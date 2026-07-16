import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar
} from 'recharts'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Cylinder, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import {
  Cigarette, DollarSign, Heart, Wind, Brain, Zap, TrendingDown,
  AlertTriangle, CheckCircle, Activity, Clock, BarChart2, Sparkles,
  ArrowRight, RefreshCw, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAccessibility } from '@/contexts/AccessibilityContext'

function EcoSimulatorFallback({ organDamage }: { organDamage: any }) {
  return (
    <div className="w-full h-full bg-[#070b13] flex flex-col items-center justify-center p-6 border border-white/5 text-center relative">
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/60 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>ECO 2D Simulator Monitor</span>
      </div>
      <div className="space-y-4 w-full max-w-[240px]">
        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
          <span className="text-white/60">Lungs Health:</span>
          <span className={`font-bold ${organDamage.lungs > 70 ? 'text-green-400' : organDamage.lungs > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {organDamage.lungs.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
          <span className="text-white/60">Heart Health:</span>
          <span className={`font-bold ${organDamage.heart > 70 ? 'text-green-400' : organDamage.heart > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {organDamage.heart.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
          <span className="text-white/60">Dopamine Baseline:</span>
          <span className={`font-bold ${organDamage.brain > 70 ? 'text-green-400' : organDamage.brain > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {organDamage.brain.toFixed(1)}%
          </span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-4">
        Eco 2D display active. Throttled GPU WebGL render loops.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
// Calculation Engine
// ─────────────────────────────────────────
interface SimulatorInputs {
  cigarettesPerDay: number
  yearsSmoked: number
  dailySpending: number
}

interface SimulationResults {
  totalMoneyLost: number
  moneyPerYear: number
  lifeYearsLost: number
  lungHealthPct: number
  heartRiskMultiplier: number
  cancerRiskMultiplier: number
  copdRisk: number
  recoveryTimeline: RecoveryMilestone[]
  healthProjection: HealthPoint[]
  financialProjection: FinancialPoint[]
  radarData: RadarPoint[]
  organDamage: OrganDamage
}

interface RecoveryMilestone {
  label: string
  days: number
  description: string
  color: string
  icon: string
}

interface HealthPoint {
  year: string
  withSmoking: number
  afterQuitting: number
  nonsmoker: number
}

interface FinancialPoint {
  year: string
  cumulativeLoss: number
  alternativeGrowth: number
}

interface RadarPoint {
  subject: string
  smoker: number
  quitter: number
  fullMark: number
}

interface OrganDamage {
  lungs: number
  heart: number
  brain: number
  skin: number
  kidneys: number
}

function calculateSimulation(inputs: SimulatorInputs): SimulationResults {
  const { cigarettesPerDay, yearsSmoked, dailySpending } = inputs

  const packEquivalents = cigarettesPerDay / 20
  const totalCigarettes = cigarettesPerDay * 365 * yearsSmoked
  const totalMoneyLost = dailySpending * 365 * yearsSmoked
  const moneyPerYear = dailySpending * 365

  // Life years lost: ~11 minutes per cigarette
  const lifeMinutesLost = totalCigarettes * 11
  const lifeYearsLost = lifeMinutesLost / (60 * 24 * 365)

  // Lung health degradation (100% = perfect, 0% = worst)
  const lungDamageRate = Math.min(0.95, packEquivalents * yearsSmoked * 0.025)
  const lungHealthPct = Math.max(5, Math.round((1 - lungDamageRate) * 100))

  // Heart disease risk multiplier
  const heartRiskMultiplier = 1 + Math.min(3, packEquivalents * 0.5 + yearsSmoked * 0.08)

  // Cancer risk
  const cancerRiskMultiplier = 1 + Math.min(24, packEquivalents * 2 + yearsSmoked * 0.3)

  // COPD risk %
  const copdRisk = Math.min(90, packEquivalents * yearsSmoked * 2.5)

  // Recovery timeline
  const recoveryTimeline: RecoveryMilestone[] = [
    { label: '20 Min', days: 0.013, description: 'Blood pressure & heart rate normalize', color: '#10b981', icon: '❤️' },
    { label: '8 Hours', days: 0.33, description: 'CO drops 50%, oxygen levels restore', color: '#06b6d4', icon: '💨' },
    { label: '24 Hours', days: 1, description: 'Nicotine fully cleared from body', color: '#8b5cf6', icon: '🫁' },
    { label: '2 Weeks', days: 14, description: 'Circulation improves, walking gets easier', color: '#f59e0b', icon: '🚶' },
    { label: '1 Month', days: 30, description: 'Lung capacity increases by 30%', color: '#ef4444', icon: '🫀' },
    { label: '1 Year', days: 365, description: 'Heart disease risk cut in HALF', color: '#ec4899', icon: '✨' },
    { label: `${Math.round(yearsSmoked * 0.5 + 5)} Years`, days: 365 * (yearsSmoked * 0.5 + 5), description: 'Stroke risk equals non-smoker', color: '#6366f1', icon: '🧠' },
  ]

  // Health projection data
  const healthProjection: HealthPoint[] = []
  for (let y = 0; y <= 15; y++) {
    const smokerScore = Math.max(10, 100 - (cigarettesPerDay * 0.3 + yearsSmoked * 1.5) - y * 2.5)
    const quitterScore = y === 0 ? Math.max(10, 100 - (cigarettesPerDay * 0.3 + yearsSmoked * 1.5)) : Math.min(95, (100 - (cigarettesPerDay * 0.3 + yearsSmoked * 1.5)) + y * 4.5)
    healthProjection.push({
      year: `Yr ${y}`,
      withSmoking: Math.round(Math.max(10, smokerScore)),
      afterQuitting: Math.round(Math.min(95, quitterScore)),
      nonsmoker: 95,
    })
  }

  // Financial projection
  const financialProjection: FinancialPoint[] = []
  for (let y = 0; y <= 20; y++) {
    financialProjection.push({
      year: `${y}y`,
      cumulativeLoss: Math.round(moneyPerYear * y),
      alternativeGrowth: Math.round(moneyPerYear * y * Math.pow(1.08, y)),
    })
  }

  // Radar
  const radarData: RadarPoint[] = [
    { subject: 'Lung Power', smoker: Math.max(10, lungHealthPct), quitter: Math.min(90, lungHealthPct + 35), fullMark: 100 },
    { subject: 'Heart Health', smoker: Math.max(10, 100 - (heartRiskMultiplier - 1) * 20), quitter: Math.min(85, 100 - (heartRiskMultiplier - 1) * 5), fullMark: 100 },
    { subject: 'Brain Clarity', smoker: Math.max(20, 90 - yearsSmoked * 1.5), quitter: Math.min(90, 90 - yearsSmoked * 0.5 + 20), fullMark: 100 },
    { subject: 'Immunity', smoker: Math.max(15, 85 - cigarettesPerDay * 1.2), quitter: Math.min(80, 85 - cigarettesPerDay * 0.3), fullMark: 100 },
    { subject: 'Energy', smoker: Math.max(10, 90 - packEquivalents * 15), quitter: Math.min(85, 90 - packEquivalents * 4), fullMark: 100 },
    { subject: 'Lifespan', smoker: Math.max(10, 95 - lifeYearsLost * 3), quitter: Math.min(90, 95 - lifeYearsLost * 0.5), fullMark: 100 },
  ]

  // Organ damage (0 = destroyed, 100 = perfect)
  const organDamage: OrganDamage = {
    lungs: Math.max(5, lungHealthPct),
    heart: Math.max(10, 100 - (heartRiskMultiplier - 1) * 22),
    brain: Math.max(15, 95 - yearsSmoked * 1.8),
    skin: Math.max(20, 95 - yearsSmoked * 1.5 - cigarettesPerDay * 0.5),
    kidneys: Math.max(25, 92 - yearsSmoked * 1.2),
  }

  return {
    totalMoneyLost,
    moneyPerYear,
    lifeYearsLost,
    lungHealthPct,
    heartRiskMultiplier,
    cancerRiskMultiplier,
    copdRisk,
    recoveryTimeline,
    healthProjection,
    financialProjection,
    radarData,
    organDamage,
  }
}

// ─────────────────────────────────────────
// 3D Human Body Scene
// ─────────────────────────────────────────
function OrganGlobe({ health, color, pulse }: { health: number; color: string; pulse?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const damageLevel = 1 - health / 100

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (pulse ? 0.8 : 0.3)
      if (pulse) {
        const t = Date.now() * 0.003
        meshRef.current.scale.setScalar(1 + Math.sin(t) * 0.05)
      }
    }
  })

  const c = new THREE.Color(color)
  c.lerp(new THREE.Color('#ff2200'), damageLevel * 0.7)

  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]}>
      <meshStandardMaterial
        color={c}
        roughness={0.2}
        metalness={0.6}
        emissive={c}
        emissiveIntensity={0.15 + damageLevel * 0.3}
        transparent
        opacity={0.85}
      />
    </Sphere>
  )
}

function SmokeParticle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const speed = 0.3 + Math.random() * 0.3
  const offset = index * 0.618

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed + offset
      meshRef.current.position.x = Math.sin(t * 2) * 1.5 + Math.cos(t * 0.7) * 0.5
      meshRef.current.position.y = (t % 5) - 2.5
      meshRef.current.position.z = Math.cos(t * 1.3) * 0.8
      if (meshRef.current.material) {
        ;(meshRef.current.material as any).opacity = 0.1 + Math.sin(t * 3) * 0.05
      }
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.08, 8, 8]}>
      <meshStandardMaterial color="#888888" transparent opacity={0.15} />
    </Sphere>
  )
}

function MoneyParticle({ index, active }: { index: number; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const speed = 0.5 + Math.random() * 0.5

  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return
    const t = clock.getElapsedTime() * speed + index * 0.8
    meshRef.current.position.x = Math.sin(t * 0.9) * 2.5 - 2
    meshRef.current.position.y = -((t * 1.5) % 6) + 3
    meshRef.current.position.z = Math.cos(t * 1.1) * 0.5
    meshRef.current.rotation.z = t * 2
    if (meshRef.current.material) {
      ;(meshRef.current.material as any).opacity = active ? 0.6 + Math.sin(t * 4) * 0.2 : 0
    }
  })

  return (
    <Cylinder ref={meshRef} args={[0.15, 0.15, 0.04, 16]}>
      <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
    </Cylinder>
  )
}

function BodyScene({ organDamage, showMoney }: { organDamage: OrganDamage; showMoney: boolean }) {
  return (
    <>
      <Stars radius={20} depth={10} count={400} factor={2} fade speed={0.5} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#06b6d4" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#8b5cf6" />

      {/* Lungs */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[-0.7, 0.5, 0]}>
          <OrganGlobe health={organDamage.lungs} color="#60a5fa" pulse />
        </group>
      </Float>
      <Float speed={1.3} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[0.7, 0.5, 0]}>
          <OrganGlobe health={organDamage.lungs} color="#60a5fa" pulse />
        </group>
      </Float>

      {/* Heart */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0, 0.5, 0.3]}>
          <OrganGlobe health={organDamage.heart} color="#f43f5e" pulse />
        </group>
      </Float>

      {/* Brain */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
        <group position={[0, 1.8, 0]}>
          <OrganGlobe health={organDamage.brain} color="#a855f7" />
        </group>
      </Float>

      {/* Kidneys */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-0.6, -0.5, 0]}>
          <OrganGlobe health={organDamage.kidneys} color="#f97316" />
        </group>
      </Float>
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[0.6, -0.5, 0]}>
          <OrganGlobe health={organDamage.kidneys} color="#f97316" />
        </group>
      </Float>

      {/* Smoke particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <SmokeParticle key={i} index={i} />
      ))}

      {/* Money particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <MoneyParticle key={i} index={i} active={showMoney} />
      ))}
    </>
  )
}

// ─────────────────────────────────────────
// Input Slider
// ─────────────────────────────────────────
function Slider({
  label, value, min, max, step, unit, icon: Icon, color,
  onChange, description,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string
  icon: React.ElementType; color: string; onChange: (v: number) => void; description?: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded-lg', color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn('text-xl font-bold tabular-nums', color.replace('bg-', 'text-').replace('/20', ''))}>
            {value}
          </span>
          <span className="text-xs text-white/50">{unit}</span>
        </div>
      </div>
      {description && (
        <p className="text-xs text-white/40 ml-8">{description}</p>
      )}
      <div className="relative">
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', color.replace('/20', ''))}
            style={{ width: `${pct}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
      </div>
      <div className="flex justify-between text-xs text-white/30">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────
function StatCard({ label, value, sub, color, icon: Icon, danger }: {
  label: string; value: string; sub: string; color: string
  icon: React.ElementType; danger?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5',
        danger
          ? 'bg-red-950/40 border-red-500/30'
          : 'bg-white/5 border-white/10',
        'backdrop-blur-sm'
      )}
    >
      {danger && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent pointer-events-none" />
      )}
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/50 mb-1">{label}</p>
          <p className={cn('text-2xl font-bold', danger ? 'text-red-400' : 'text-white')}>{value}</p>
          <p className="text-xs text-white/40 mt-1">{sub}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────
// Organ Damage Bar
// ─────────────────────────────────────────
function OrganBar({ label, health, icon, color }: { label: string; health: number; icon: string; color: string }) {
  const getLabel = (h: number) => {
    if (h >= 80) return { text: 'Healthy', cls: 'text-emerald-400' }
    if (h >= 60) return { text: 'Moderate', cls: 'text-yellow-400' }
    if (h >= 40) return { text: 'Damaged', cls: 'text-orange-400' }
    return { text: 'Critical', cls: 'text-red-400' }
  }
  const status = getLabel(health)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-white/70">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-medium', status.cls)}>{status.text}</span>
          <span className="text-white font-bold text-xs">{health}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Custom Recharts Tooltip
// ─────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900/95 border border-white/20 rounded-xl px-4 py-3 shadow-2xl backdrop-blur">
      <p className="text-white/60 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="text-white font-bold">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Main Simulator
// ─────────────────────────────────────────
export function SimulatorPage() {
  const { isEcoMode } = useAccessibility()
  const [inputs, setInputs] = useState<SimulatorInputs>({
    cigarettesPerDay: 10,
    yearsSmoked: 5,
    dailySpending: 150,
  })
  const [results, setResults] = useState<SimulationResults | null>(null)
  const [activeTab, setActiveTab] = useState<'health' | 'finance' | 'recovery'>('health')
  const [isCalculating, setIsCalculating] = useState(false)
  const [showMoney, setShowMoney] = useState(false)

  const updateInput = useCallback((key: keyof SimulatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  const calculate = useCallback(async () => {
    setIsCalculating(true)
    // Simulate "AI thinking"
    await new Promise(r => setTimeout(r, 1200))
    const result = calculateSimulation(inputs)
    setResults(result)
    setIsCalculating(false)
    setShowMoney(true)
    setTimeout(() => setShowMoney(false), 4000)
  }, [inputs])

  // Auto-calculate on input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (results) {
        setResults(calculateSimulation(inputs))
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputs])

  const dummyOrganDamage: OrganDamage = results?.organDamage ?? {
    lungs: 70, heart: 75, brain: 80, skin: 72, kidneys: 82
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-white relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.06)_0%,transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 hologram-grid pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Health Simulator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
            See Your Smoking Impact
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Enter your smoking habits. Our AI calculates the real cost — to your body and your wallet.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* ─── LEFT PANEL: Inputs + 3D ─── */}
          <div className="space-y-6">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 space-y-7"
            >
              <div className="flex items-center gap-2 mb-2">
                <Cigarette className="w-5 h-5 text-red-400" />
                <h2 className="font-semibold text-white">Your Profile</h2>
              </div>

              <Slider
                label="Cigarettes per Day"
                value={inputs.cigarettesPerDay}
                min={1} max={60} step={1} unit="cigs/day"
                icon={Cigarette} color="bg-red-500/20"
                onChange={(v) => updateInput('cigarettesPerDay', v)}
                description="How many cigarettes do you smoke daily?"
              />
              <Slider
                label="Years Smoked"
                value={inputs.yearsSmoked}
                min={1} max={40} step={1} unit="years"
                icon={Clock} color="bg-orange-500/20"
                onChange={(v) => updateInput('yearsSmoked', v)}
                description="How long have you been smoking?"
              />
              <Slider
                label="Daily Spending"
                value={inputs.dailySpending}
                min={10} max={1000} step={10} unit="₹/day"
                icon={DollarSign} color="bg-amber-500/20"
                onChange={(v) => updateInput('dailySpending', v)}
                description="How much do you spend on cigarettes daily?"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculate}
                disabled={isCalculating}
                className={cn(
                  'w-full py-3.5 rounded-xl font-semibold text-sm relative overflow-hidden transition-all',
                  'bg-gradient-to-r from-cyan-500 to-purple-600',
                  'hover:from-cyan-400 hover:to-purple-500',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                  'shadow-lg shadow-cyan-500/25'
                )}
              >
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      AI Analyzing…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Simulate Impact
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium">3D Organ Visualization</span>
                </div>
                <span className="text-xs text-white/40">Real-time damage model</span>
              </div>
              <div className="h-[280px] relative">
                {isEcoMode ? (
                  <EcoSimulatorFallback organDamage={dummyOrganDamage} />
                ) : (
                  <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                    <BodyScene organDamage={dummyOrganDamage} showMoney={showMoney} />
                  </Canvas>
                )}
              </div>
              {/* Legend */}
              <div className="px-5 pb-4 grid grid-cols-3 gap-2 text-xs text-white/50 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span>Lungs</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>Heart</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Brain</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT PANEL: Results ─── */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!results && !isCalculating && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-12 text-center h-[400px] flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                    <BarChart2 className="w-10 h-10 text-cyan-500/60" />
                  </div>
                  <h3 className="text-xl font-semibold text-white/80 mb-2">Awaiting Your Data</h3>
                  <p className="text-white/40 text-sm max-w-xs">
                    Set your smoking habits on the left and click "Simulate Impact" to see AI-generated results.
                  </p>
                </motion.div>
              )}

              {isCalculating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-lg p-12 text-center h-[400px] flex flex-col items-center justify-center"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500"
                    />
                    <Brain className="absolute inset-0 m-auto w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">AI Analyzing Data…</h3>
                  <p className="text-white/40 text-sm">Processing health & financial models</p>
                </motion.div>
              )}

              {results && !isCalculating && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Key Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard
                      label="Money Wasted"
                      value={`₹${(results.totalMoneyLost / 100000).toFixed(1)}L`}
                      sub={`₹${results.moneyPerYear.toLocaleString()}/year`}
                      color="bg-amber-500/20" icon={DollarSign} danger
                    />
                    <StatCard
                      label="Life Lost"
                      value={`${results.lifeYearsLost.toFixed(1)} yrs`}
                      sub={`~${Math.round(results.lifeYearsLost * 365)} days lost`}
                      color="bg-red-500/20" icon={Clock} danger
                    />
                    <StatCard
                      label="Lung Health"
                      value={`${results.lungHealthPct}%`}
                      sub={results.lungHealthPct < 50 ? 'Critical damage' : 'Moderate damage'}
                      color="bg-blue-500/20" icon={Wind}
                    />
                    <StatCard
                      label="Heart Risk"
                      value={`${results.heartRiskMultiplier.toFixed(1)}×`}
                      sub="vs non-smoker"
                      color="bg-rose-500/20" icon={Heart} danger
                    />
                  </div>

                  {/* Organ Status */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-semibold text-sm">Organ Health Status</h3>
                    </div>
                    <div className="space-y-4">
                      <OrganBar label="Lungs" health={results.organDamage.lungs} icon="🫁" color="bg-gradient-to-r from-blue-600 to-blue-400" />
                      <OrganBar label="Heart" health={results.organDamage.heart} icon="❤️" color="bg-gradient-to-r from-rose-600 to-rose-400" />
                      <OrganBar label="Brain" health={results.organDamage.brain} icon="🧠" color="bg-gradient-to-r from-purple-600 to-purple-400" />
                      <OrganBar label="Skin" health={results.organDamage.skin} icon="🪄" color="bg-gradient-to-r from-amber-600 to-amber-400" />
                      <OrganBar label="Kidneys" health={results.organDamage.kidneys} icon="🫘" color="bg-gradient-to-r from-emerald-600 to-emerald-400" />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden">
                    {/* Tab Nav */}
                    <div className="flex border-b border-white/10">
                      {[
                        { key: 'health', label: 'Health Projection', icon: Heart },
                        { key: 'finance', label: 'Financial Loss', icon: DollarSign },
                        { key: 'recovery', label: 'Recovery Path', icon: TrendingDown },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key as 'health' | 'finance' | 'recovery')}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-medium transition-all',
                            activeTab === key
                              ? 'text-white border-b-2 border-cyan-500 bg-cyan-500/10'
                              : 'text-white/40 hover:text-white/70'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-5">
                      <AnimatePresence mode="wait">
                        {activeTab === 'health' && (
                          <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-xs text-white/40 mb-4">Health score over 15 years — smoker vs. quitter vs. non-smoker</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* Area Chart */}
                              <div>
                                <h4 className="text-xs text-white/60 mb-3 font-medium">Health Score Timeline</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                  <AreaChart data={results.healthProjection}>
                                    <defs>
                                      <linearGradient id="smokerGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                      </linearGradient>
                                      <linearGradient id="quitterGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                      </linearGradient>
                                      <linearGradient id="nonGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="withSmoking" name="Smoker" stroke="#ef4444" fill="url(#smokerGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="afterQuitting" name="After Quitting" stroke="#06b6d4" fill="url(#quitterGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="nonsmoker" name="Non-Smoker" stroke="#10b981" fill="url(#nonGrad)" strokeWidth={1.5} strokeDasharray="4 4" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                              {/* Radar */}
                              <div>
                                <h4 className="text-xs text-white/60 mb-3 font-medium">Body System Comparison</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                  <RadarChart data={results.radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                                    <Radar name="Smoker" dataKey="smoker" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                                    <Radar name="After Quitting" dataKey="quitter" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            {/* Risk Badges */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="rounded-xl bg-red-950/40 border border-red-500/20 p-3 flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                <div>
                                  <p className="text-xs text-white/50">Cancer Risk</p>
                                  <p className="text-red-300 font-bold text-sm">{results.cancerRiskMultiplier.toFixed(0)}× Higher</p>
                                </div>
                              </div>
                              <div className="rounded-xl bg-orange-950/40 border border-orange-500/20 p-3 flex items-center gap-3">
                                <Wind className="w-5 h-5 text-orange-400 shrink-0" />
                                <div>
                                  <p className="text-xs text-white/50">COPD Risk</p>
                                  <p className="text-orange-300 font-bold text-sm">{results.copdRisk.toFixed(0)}% Likelihood</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'finance' && (
                          <motion.div key="finance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-xs text-white/40 mb-4">Cumulative loss vs. if you invested the same money at 8% p.a.</p>
                            {/* Big Money Number */}
                            <div className="text-center mb-5 py-4 rounded-xl bg-gradient-to-r from-red-950/60 to-amber-950/60 border border-red-500/20">
                              <p className="text-xs text-white/50 mb-1">Total Money Burned So Far</p>
                              <motion.p
                                key={results.totalMoneyLost}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-black text-red-400"
                              >
                                ₹{results.totalMoneyLost.toLocaleString('en-IN')}
                              </motion.p>
                              <p className="text-xs text-white/40 mt-1">
                                That's ₹{results.moneyPerYear.toLocaleString()} per year
                              </p>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                              <BarChart data={results.financialProjection.filter((_, i) => i % 2 === 0)} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar dataKey="cumulativeLoss" name="Money Wasted" fill="#ef4444" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                                <Bar dataKey="alternativeGrowth" name="If Invested (8%)" fill="#10b981" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex gap-4 justify-center mt-3 text-xs text-white/50">
                              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-500" />Money Wasted</div>
                              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />If Invested</div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'recovery' && (
                          <motion.div key="recovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="text-xs text-white/40 mb-5">What happens to your body after you quit — hour by hour, day by day</p>
                            <div className="relative pl-6">
                              <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/60 via-purple-500/40 to-transparent" />
                              {results.recoveryTimeline.map((m, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.08 }}
                                  className="relative mb-5 last:mb-0"
                                >
                                  <div
                                    className="absolute -left-4 top-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                                    style={{ background: m.color + '33', border: `1px solid ${m.color}66` }}
                                  >
                                    {m.icon}
                                  </div>
                                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: m.color + '22', color: m.color }}>
                                        {m.label}
                                      </span>
                                      <CheckCircle className="w-3.5 h-3.5" style={{ color: m.color }} />
                                    </div>
                                    <p className="text-sm text-white/80">{m.description}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            {/* AI Message */}
                            <div className="mt-5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/20 p-4">
                              <div className="flex gap-3">
                                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-cyan-300 mb-1">AI Health Note</p>
                                  <p className="text-xs text-white/60">
                                    After {inputs.yearsSmoked} years of smoking {inputs.cigarettesPerDay} cigarettes/day,
                                    your body needs approximately <strong className="text-white">{Math.round(inputs.yearsSmoked * 0.4 + 2)} years</strong> of
                                    smoke-free living to recover most lung function. Heart disease risk halves within the first year alone.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Bottom Health Score Gauge */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">Overall Damage Score</h3>
                      </div>
                      <span className="text-xs text-white/40">AI Risk Assessment</span>
                    </div>
                    <div className="flex items-center gap-6">
                      {/* Gauge */}
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                          <motion.circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke={results.lungHealthPct > 60 ? '#f59e0b' : results.lungHealthPct > 30 ? '#ef4444' : '#7f1d1d'}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (results.lungHealthPct / 100) }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-white">{results.lungHealthPct}%</span>
                          <span className="text-[10px] text-white/40">lung health</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/50">Cigarettes smoked (total)</span>
                          <span className="text-white font-medium">{(inputs.cigarettesPerDay * 365 * inputs.yearsSmoked).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Life expectancy impact</span>
                          <span className="text-red-400 font-medium">-{results.lifeYearsLost.toFixed(1)} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Annual savings if quit today</span>
                          <span className="text-emerald-400 font-medium">₹{results.moneyPerYear.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">COPD probability</span>
                          <span className="text-orange-400 font-medium">{results.copdRisk.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
