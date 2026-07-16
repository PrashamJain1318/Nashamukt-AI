import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Trophy, Zap, Lock, ChevronRight, Star, Target } from 'lucide-react'
import { useGamificationData, useCompleteMission } from '@/hooks/api/useGamification'
import { HolographicCard } from '@/components/dashboard/HolographicCard'
import { FloatingMedal } from '@/components/dashboard/FloatingMedal'
import { XPEnergyBeam } from '@/components/dashboard/XPEnergyBeam'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

// ─── Medal type mapping by icon string ───────────────────────────────────────
const ICON_TO_MEDAL: Record<string, 'gold' | 'flame' | 'silver' | 'bronze' | 'platinum' | 'diamond'> = {
  Award: 'gold', Flame: 'flame', Wallet: 'silver', Calendar: 'bronze',
  Star: 'platinum', Shield: 'diamond', Target: 'gold',
}

// ─── 1. FIREWORKS CANVAS ─────────────────────────────────────────────────────
interface Rocket { pos: THREE.Vector3; vel: THREE.Vector3; life: number; color: string; exploded: boolean; particles: Particle[] }
interface Particle { pos: THREE.Vector3; vel: THREE.Vector3; life: number; maxLife: number }

const FIREWORK_COLORS = ['#fbbf24','#f43f5e','#a855f7','#06b6d4','#10b981','#f97316','#e879f9','#34d399']

function FireworksSystem({ active }: { active: boolean }) {
  const rocketsRef = useRef<Rocket[]>([])
  const allParticlesPos = useMemo(() => new Float32Array(3000 * 3), [])
  const allParticlesRef = useRef<THREE.Points>(null!)
  const timer = useRef(0)

  useFrame((_, delta) => {
    if (!active) return
    timer.current += delta

    // Spawn a new rocket every 0.45s
    if (timer.current > 0.45 && rocketsRef.current.length < 12) {
      timer.current = 0
      rocketsRef.current.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * 8, -4, 0),
        vel: new THREE.Vector3((Math.random() - 0.5) * 1.2, 3.5 + Math.random() * 2.5, 0),
        life: 1.0,
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        exploded: false,
        particles: [],
      })
    }

    let pIdx = 0
    const arr = allParticlesPos

    for (let r = rocketsRef.current.length - 1; r >= 0; r--) {
      const rocket = rocketsRef.current[r]

      if (!rocket.exploded) {
        // Move rocket up
        rocket.pos.addScaledVector(rocket.vel, delta)
        rocket.vel.y -= 1.5 * delta  // gravity
        rocket.life -= delta * 1.2

        // Write rocket position
        if (pIdx < 2999) {
          arr[pIdx * 3]     = rocket.pos.x
          arr[pIdx * 3 + 1] = rocket.pos.y
          arr[pIdx * 3 + 2] = rocket.pos.z
          pIdx++
        }

        // Explode when slow enough or life runs out
        if (rocket.vel.y < 0 || rocket.life < 0) {
          rocket.exploded = true
          const burstCount = 55 + Math.floor(Math.random() * 30)
          for (let p = 0; p < burstCount; p++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() - 0.5) * 2)
            const speed = 1.2 + Math.random() * 2.5
            rocket.particles.push({
              pos: rocket.pos.clone(),
              vel: new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed * 0.4
              ),
              life: 0.9 + Math.random() * 0.8,
              maxLife: 0.9 + Math.random() * 0.8,
            })
          }
        }
      } else {
        // Update explosion particles
        let allDead = true
        for (const p of rocket.particles) {
          p.pos.addScaledVector(p.vel, delta)
          p.vel.y -= 2.2 * delta
          p.vel.multiplyScalar(0.97)
          p.life -= delta
          if (p.life > 0) {
            allDead = false
            if (pIdx < 2999) {
              arr[pIdx * 3]     = p.pos.x
              arr[pIdx * 3 + 1] = p.pos.y
              arr[pIdx * 3 + 2] = p.pos.z
              pIdx++
            }
          }
        }
        if (allDead) rocketsRef.current.splice(r, 1)
      }
    }

    // Clear leftover positions
    for (let i = pIdx; i < 3000; i++) {
      arr[i * 3] = 999; arr[i * 3 + 1] = 999; arr[i * 3 + 2] = 999
    }
    allParticlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={allParticlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[allParticlesPos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fbbf24" size={0.09} transparent opacity={0.9} vertexColors={false} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function FireworksScene({ active }: { active: boolean }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
    >
      <FireworksSystem active={active} />
      <Sparkles count={40} scale={12} size={1.2} speed={0.08} color="#fbbf24" opacity={0.3} />
    </Canvas>
  )
}

// ─── 2. FLOATING COIN RAIN ────────────────────────────────────────────────────
function CoinMesh({ pos, phase }: { pos: [number, number, number]; phase: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y -= delta * (1.0 + Math.sin(phase) * 0.5)
    ref.current.rotation.y += delta * (2 + Math.sin(phase + t) * 1.2)
    ref.current.rotation.x = Math.sin(t * 1.8 + phase) * 0.3
    if (ref.current.position.y < -4) ref.current.position.y = 4.5
  })
  return (
    <mesh ref={ref} position={pos} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
      <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.4} metalness={0.98} roughness={0.08} />
    </mesh>
  )
}

function CoinRainScene({ active }: { active: boolean }) {
  const coins = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    pos: [(Math.random() - 0.5) * 10, 1 + Math.random() * 5, (Math.random() - 0.5) * 2] as [number,number,number],
    phase: (i / 22) * Math.PI * 2,
  })), [])

  if (!active) return null

  return (
    <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 8], fov: 55 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={2} color="#fde68a" />
      {coins.map((c, i) => <CoinMesh key={i} pos={c.pos} phase={c.phase} />)}
    </Canvas>
  )
}

// ─── 3. LEVEL-UP OVERLAY ─────────────────────────────────────────────────────
function LevelUpOverlay({ level, onClose }: { level: number; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
    >
      <div className="relative flex flex-col items-center">
        {/* Outer burst ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-32 h-32 rounded-full border-4 border-amber-400"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 7, opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
          className="absolute w-28 h-28 rounded-full border-2 border-amber-300"
        />

        {/* Core panel */}
        <motion.div
          initial={{ rotateY: -90 }}
          animate={{ rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="relative bg-[#0a0f20]/95 backdrop-blur-2xl border border-amber-500/40 rounded-3xl px-16 py-10 text-center shadow-[0_0_60px_rgba(251,191,36,0.3)] z-10"
        >
          <div className="absolute inset-0 bg-hologram-grid opacity-10 rounded-3xl" />

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-mono tracking-[0.4em] text-amber-400/70 uppercase mb-1"
          >
            Level Achieved
          </motion.p>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, type: 'spring' }}
            className="text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600"
          >
            {level}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-amber-300/80 font-medium mt-2 font-mono"
          >
            WARRIOR RANK UNLOCKED
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── 4. VICTORY BANNER ──────────────────────────────────────────────────────
function VictoryBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[199] flex items-center gap-4 bg-[#0a0f20]/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(251,191,36,0.2)]"
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
        className="text-3xl"
      >
        ✨
      </motion.div>
      <div>
        <p className="font-bold text-amber-300 text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  )
}

// ─── 5. MAIN ACHIEVEMENTS PAGE ───────────────────────────────────────────────
export function AchievementsPage() {
  const { data, isLoading } = useGamificationData()
  const completeMission = useCompleteMission()
  const { tier } = usePerformanceDetector()

  const [showFireworks, setShowFireworks]       = useState(false)
  const [showCoins, setShowCoins]               = useState(false)
  const [levelUpLevel, setLevelUpLevel]         = useState<number | null>(null)
  const [victoryBanner, setVictoryBanner]       = useState<{ title: string; subtitle: string } | null>(null)
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set())

  // Fire victory sequence for a newly-complete mission
  const triggerVictory = (xp: number, missionTitle: string) => {
    setVictoryBanner({ title: `Mission Complete!`, subtitle: `+${xp} XP earned — ${missionTitle}` })
    setShowCoins(true)
    setTimeout(() => { setShowCoins(false); setVictoryBanner(null) }, 3500)
  }

  const triggerLevelUp = (level: number) => {
    setLevelUpLevel(level)
    setShowFireworks(true)
    setTimeout(() => setShowFireworks(false), 5000)
  }

  const handleMissionComplete = async (id: number, xp: number, title: string) => {
    if (completedMissions.has(id)) return
    try {
      const result = await completeMission.mutateAsync({ id, xp })
      setCompletedMissions(prev => new Set(prev).add(id))
      triggerVictory(xp, title)
      // Rough level check
      if (result?.newTotalXp && Math.floor(result.newTotalXp / 1000) > Math.floor((result.newTotalXp - xp) / 1000)) {
        setTimeout(() => triggerLevelUp(Math.floor(result.newTotalXp / 1000) + 1), 1200)
      }
    } catch {/* swallow */}
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <Trophy className="h-7 w-7 text-amber-400/50" />
        </div>
        <p className="text-muted-foreground font-mono text-sm tracking-widest">LOADING ACHIEVEMENTS...</p>
      </div>
    )
  }

  const { level = 1, xp = 0, nextLevelXp = 1000, missions = [], challenges = [], achievements = [] } = data || {}
  const xpInLevel   = xp % nextLevelXp
  const xpPct       = Math.round((xpInLevel / nextLevelXp) * 100)
  const levelColor  = level >= 10 ? '#e879f9' : level >= 7 ? '#a855f7' : level >= 4 ? '#06b6d4' : '#f59e0b'

  return (
    <div className="relative w-full max-w-6xl mx-auto py-6 px-4 min-h-screen">

      {/* ── Fireworks overlay canvas ── */}
      <AnimatePresence>
        {showFireworks && tier !== 'low' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] pointer-events-none"
          >
            <FireworksScene active={showFireworks} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Coin rain overlay canvas ── */}
      <AnimatePresence>
        {showCoins && tier !== 'low' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[148] pointer-events-none"
          >
            <CoinRainScene active={showCoins} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Level-up modal ── */}
      <AnimatePresence>
        {levelUpLevel !== null && (
          <LevelUpOverlay level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
        )}
      </AnimatePresence>

      {/* ── Victory banner ── */}
      <AnimatePresence>
        {victoryBanner && <VictoryBanner {...victoryBanner} />}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10"
      >
        <div>
          <h1 className="font-display text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600">
            Achievements
          </h1>
          <p className="text-muted-foreground">Earn XP, unlock medals, and level up your recovery journey.</p>
        </div>

        {/* Trigger fireworks demo button */}
        <button
          onClick={() => triggerLevelUp(level + 1)}
          className="px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex items-center gap-2"
        >
          <Zap className="h-3.5 w-3.5" />
          Trigger Victory
        </button>
      </motion.div>

      {/* ── XP & Level Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="mb-8"
      >
        <HolographicCard glowColor="cyan" className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Level orb */}
            <div className="relative flex-shrink-0">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center border-2 font-display font-black text-5xl"
                style={{ borderColor: `${levelColor}60`, color: levelColor, boxShadow: `0 0 40px ${levelColor}30, inset 0 0 20px ${levelColor}10`, background: `radial-gradient(circle at center, ${levelColor}15, transparent 70%)` }}
              >
                {level}
              </div>
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest"
                style={{ background: `${levelColor}20`, border: `1px solid ${levelColor}40`, color: levelColor }}
              >
                Level
              </div>
            </div>

            {/* XP details */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-baseline mb-3">
                <div>
                  <span className="text-2xl font-display font-bold text-foreground">{xp.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm ml-2">/ {nextLevelXp.toLocaleString()} XP</span>
                </div>
                <span className="text-xs font-mono tracking-widest text-muted-foreground">{xpPct}% to Lv {level + 1}</span>
              </div>

              <XPEnergyBeam
                value={xpInLevel}
                maxValue={nextLevelXp}
                color={levelColor}
                glowColor={levelColor}
                className="w-full"
              />

              <div className="flex gap-6 mt-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5"><Star className="h-3 w-3 text-amber-400" /> {xp.toLocaleString()} Total XP</span>
                <span className="flex items-center gap-1.5"><Trophy className="h-3 w-3 text-amber-400" /> Level {level} Warrior</span>
                <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-purple-400" /> {nextLevelXp - xpInLevel} XP to next</span>
              </div>
            </div>
          </div>
        </HolographicCard>
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Achievements Grid */}
        <div className="lg:col-span-2 space-y-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="text-lg font-bold font-display flex items-center gap-2"
          >
            <Trophy className="h-5 w-5 text-amber-400" /> Badges & Medals
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {achievements.map((achievement: { id: number; name: string; description: string; icon: string; unlocked: boolean }, i: number) => {
              const medalType = ICON_TO_MEDAL[achievement.icon] ?? 'bronze'
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={achievement.unlocked ? { scale: 1.04, y: -3 } : {}}
                  style={!achievement.unlocked ? { filter: 'grayscale(1)', opacity: 0.5 } : undefined}
                  className={cn(
                    "relative flex flex-col items-center gap-3 p-5 rounded-2xl border text-center cursor-pointer group transition-all duration-300",
                    achievement.unlocked
                      ? "bg-gradient-to-b from-amber-950/20 to-black/60 border-amber-500/20 hover:border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.08)] hover:shadow-[0_0_30px_rgba(251,191,36,0.18)]"
                      : "bg-black/30 border-white/5"
                  )}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-amber-500/30 group-hover:border-amber-400/60 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-amber-500/30 group-hover:border-amber-400/60 transition-colors" />

                  {/* 3D Medal */}
                  <FloatingMedal
                    type={medalType}
                    unlocked={achievement.unlocked}
                    size={68}
                  />

                  {/* Lock overlay for locked badges */}
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                      <Lock className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                  )}

                  <div className="space-y-0.5 relative z-10">
                    <p className={cn("text-xs font-bold", achievement.unlocked ? "text-amber-300" : "text-muted-foreground")}>
                      {achievement.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      {achievement.description}
                    </p>
                  </div>

                  {achievement.unlocked && (
                    <span className="absolute top-2.5 right-2.5 text-[8px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      ✓ Earned
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Missions & Challenges */}
        <div className="space-y-6">

          {/* Daily Missions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <HolographicCard glowColor="purple" className="p-5">
              <h3 className="font-bold text-base font-display flex items-center gap-2 mb-5">
                <Zap className="h-4 w-4 text-purple-400" /> Daily Missions
              </h3>
              <div className="space-y-3">
                {missions.map((mission: { id: number; title: string; xp: number; completed: boolean }, i: number) => {
                  const isDone = mission.completed || completedMissions.has(mission.id)
                  return (
                    <motion.div
                      key={mission.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer group",
                        isDone
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-white/3 border-white/5 hover:bg-purple-500/5 hover:border-purple-500/25"
                      )}
                      onClick={() => !isDone && handleMissionComplete(mission.id, mission.xp, mission.title)}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                        isDone ? "bg-emerald-500 border-emerald-400" : "border-white/15 group-hover:border-purple-500/50"
                      )}>
                        {isDone && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs">✓</motion.span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold truncate", isDone ? "line-through text-muted-foreground" : "text-foreground")}>
                          {mission.title}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[9px] font-mono font-bold shrink-0 px-1.5 py-0.5 rounded-full",
                        isDone ? "text-emerald-400 bg-emerald-500/10" : "text-purple-400 bg-purple-500/10"
                      )}>
                        +{mission.xp} XP
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </HolographicCard>
          </motion.div>

          {/* Weekly Challenges */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
            <HolographicCard glowColor="orange" className="p-5">
              <h3 className="font-bold text-base font-display flex items-center gap-2 mb-5">
                <Target className="h-4 w-4 text-orange-400" /> Weekly Challenges
              </h3>
              <div className="space-y-4">
                {challenges.map((ch: { id: number; title: string; xp: number; progress: number; total: number }) => {
                  const pct = Math.round((ch.progress / ch.total) * 100)
                  return (
                    <div key={ch.id} className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-semibold">{ch.title}</p>
                        <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full">+{ch.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, #f97316, #fbbf24)`, boxShadow: '0 0 8px rgba(249,115,22,0.6)' }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0">{ch.progress}/{ch.total}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="w-full mt-5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-orange-400 transition-colors flex items-center justify-center gap-1">
                View All Challenges <ChevronRight className="h-3 w-3" />
              </button>
            </HolographicCard>
          </motion.div>

          {/* Stats quick glance */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 }}>
            <HolographicCard glowColor="cyan" className="p-5">
              <h3 className="font-bold text-sm font-display flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-cyan-400" /> Power Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total XP', value: xp.toLocaleString(), icon: <Zap className="h-3.5 w-3.5" />, color: 'text-purple-400' },
                  { label: 'Level',    value: `Lv ${level}`,       icon: <Star className="h-3.5 w-3.5" />, color: 'text-amber-400' },
                  { label: 'Unlocked', value: `${achievements.filter((a: {unlocked: boolean}) => a.unlocked).length}/${achievements.length}`, icon: <Trophy className="h-3.5 w-3.5" />, color: 'text-emerald-400' },
                  { label: 'Missions', value: `${[...completedMissions].length + missions.filter((m: {completed: boolean}) => m.completed).length}`, icon: <Target className="h-3.5 w-3.5" />, color: 'text-cyan-400' },
                ].map(s => (
                  <div key={s.label} className="flex flex-col gap-1 p-3 rounded-xl bg-white/3 border border-white/5">
                    <span className={cn("flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest", s.color)}>{s.icon} {s.label}</span>
                    <span className="text-base font-display font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
