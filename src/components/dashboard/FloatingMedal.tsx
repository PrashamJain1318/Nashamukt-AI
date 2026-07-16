import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

// ─── Medal type config ───────────────────────────────────────────────────────
const MEDAL_CONFIG = {
  gold:     { base: '#f59e0b', shine: '#fde68a', emissive: '#d97706', rim: '#fbbf24', point: '#fef08a', glow: 'rgba(251,191,36,0.5)' },
  silver:   { base: '#94a3b8', shine: '#e2e8f0', emissive: '#475569', rim: '#cbd5e1', point: '#f1f5f9', glow: 'rgba(148,163,184,0.4)' },
  bronze:   { base: '#b45309', shine: '#fcd34d', emissive: '#78350f', rim: '#d97706', point: '#fde68a', glow: 'rgba(180,83,9,0.4)' },
  flame:    { base: '#ef4444', shine: '#fca5a5', emissive: '#991b1b', rim: '#f97316', point: '#fde68a', glow: 'rgba(239,68,68,0.5)' },
  platinum: { base: '#a5f3fc', shine: '#e0f2fe', emissive: '#0891b2', rim: '#67e8f9', point: '#f0f9ff', glow: 'rgba(165,243,252,0.5)' },
  diamond:  { base: '#818cf8', shine: '#c7d2fe', emissive: '#4338ca', rim: '#a5b4fc', point: '#e0e7ff', glow: 'rgba(129,140,248,0.5)' },
}

type MedalType = keyof typeof MEDAL_CONFIG

// ─── Confetti particle burst on unlock ───────────────────────────────────────
function ConfettiBurst({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null!)
  const count = 40

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 0.4 + Math.random() * 1.2
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 0.3
      vel[i * 3 + 2] = Math.cos(phi) * speed
    }
    return [pos, vel]
  }, [])

  useFrame((_, delta) => {
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3]     += velocities[i * 3] * delta
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta - 0.4 * delta // gravity
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta
      if (arr[i * 3 + 1] < -3) { // recycle
        arr[i * 3] = 0; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = 0
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.08} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// ─── Main 3D Medal Mesh ──────────────────────────────────────────────────────
interface MedalMeshProps {
  type: MedalType
  hovered: boolean
  unlocked: boolean
  burst: boolean
}

function MedalMesh({ type, hovered, unlocked, burst }: MedalMeshProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const bodyRef  = useRef<THREE.Mesh>(null!)
  const rimRef   = useRef<THREE.Mesh>(null!)
  const starRef  = useRef<THREE.Mesh>(null!)
  const ring1Ref = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)

  const cfg = MEDAL_CONFIG[type] || MEDAL_CONFIG.gold

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    // Floating bob
    const bob = Math.sin(t * 2.2) * 0.06
    groupRef.current.position.y = bob

    // Rotation speed
    const spinSpeed = hovered ? 3.5 : 0.6
    groupRef.current.rotation.y += delta * spinSpeed

    // Tilt wobble on hover
    groupRef.current.rotation.x = hovered
      ? Math.sin(t * 3) * 0.15
      : Math.sin(t * 1.2) * 0.04

    // Ring orbit
    ring1Ref.current.rotation.x += delta * 1.2
    ring1Ref.current.rotation.z += delta * 0.4
    ring2Ref.current.rotation.y -= delta * 0.9
    ring2Ref.current.rotation.z += delta * 0.6

    // Star pulse
    const pulse = 1 + Math.sin(t * 4) * 0.06
    starRef.current.scale.setScalar(unlocked ? pulse : 0.8)

    // Emissive intensity on body
    if (bodyRef.current.material instanceof THREE.MeshStandardMaterial) {
      bodyRef.current.material.emissiveIntensity = unlocked
        ? (hovered ? 0.8 : 0.4) + Math.sin(t * 3) * 0.12
        : 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Holographic confetti burst on unlock */}
      {burst && <ConfettiBurst color={cfg.shine} />}

      {/* Medal body — thick cylinder */}
      <mesh ref={bodyRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.22, 48]} />
        <meshStandardMaterial
          color={unlocked ? cfg.base : '#1e2232'}
          emissive={unlocked ? cfg.emissive : '#000000'}
          emissiveIntensity={unlocked ? 0.4 : 0}
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      {/* Inner face disc with slight inset */}
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.04, 48]} />
        <meshStandardMaterial
          color={unlocked ? cfg.shine : '#2a2f45'}
          metalness={0.98}
          roughness={0.08}
        />
      </mesh>

      {/* Engraved star on face */}
      <mesh ref={starRef} position={[0, 0, 0.14]}>
        <torusGeometry args={[0.38, 0.06, 4, 5]} />
        <meshStandardMaterial
          color={unlocked ? '#ffffff' : '#333'}
          emissive={unlocked ? cfg.shine : '#000'}
          emissiveIntensity={unlocked ? 0.9 : 0}
          metalness={0.99}
          roughness={0.05}
        />
      </mesh>

      {/* Outer rim ring */}
      <mesh ref={rimRef}>
        <torusGeometry args={[1.08, 0.06, 12, 48]} />
        <meshStandardMaterial
          color={unlocked ? cfg.rim : '#1a1f35'}
          emissive={unlocked ? cfg.emissive : '#000'}
          emissiveIntensity={unlocked ? 0.3 : 0}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Ribbon connector nub (top) */}
      <mesh position={[0, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.32, 12]} />
        <meshStandardMaterial
          color={unlocked ? cfg.rim : '#252a45'}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Ribbon bar */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.6, 0.25, 0.08]} />
        <MeshDistortMaterial
          color={unlocked ? cfg.emissive : '#1a1f35'}
          emissive={unlocked ? cfg.base : '#000'}
          emissiveIntensity={unlocked ? 0.5 : 0}
          distort={0.2}
          speed={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting holographic rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.45, 0.018, 4, 64]} />
        <meshBasicMaterial
          color={unlocked ? cfg.shine : '#2a2f45'}
          transparent opacity={unlocked ? 0.5 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[-Math.PI / 5, Math.PI / 6, 0]}>
        <torusGeometry args={[1.65, 0.012, 4, 64]} />
        <meshBasicMaterial
          color={unlocked ? cfg.rim : '#2a2f45'}
          transparent opacity={unlocked ? 0.35 : 0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────
export interface FloatingMedalProps {
  type?: MedalType
  unlocked?: boolean
  onHover?: (h: boolean) => void
  size?: number   // canvas size in px (square)
}

export function FloatingMedal({
  type = 'gold',
  unlocked = true,
  onHover,
  size = 56,
}: FloatingMedalProps) {
  const { tier } = usePerformanceDetector()
  const [hovered, setHovered]   = useState(false)
  const [burst, setBurst]       = useState(false)
  const prevUnlocked = useRef(unlocked)

  // Fire confetti burst when badge is newly unlocked
  useEffect(() => {
    if (!prevUnlocked.current && unlocked) {
      setBurst(true)
      setTimeout(() => setBurst(false), 2500)
    }
    prevUnlocked.current = unlocked
  }, [unlocked])

  const cfg = MEDAL_CONFIG[type] || MEDAL_CONFIG.gold

  const handleMouseEnter = () => { setHovered(true);  onHover?.(true)  }
  const handleMouseLeave = () => { setHovered(false); onHover?.(false) }

  // CSS fallback for low-perf devices
  if (tier === 'low') {
    return (
      <div
        className="flex items-center justify-center cursor-pointer"
        style={{ width: size, height: size }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
          <rect x="38" y="0" width="24" height="14" rx="4" fill={unlocked ? cfg.emissive : '#2a2f45'} />
          <circle cx="50" cy="70" r="34" fill={unlocked ? cfg.base : '#1e2232'} />
          <circle cx="50" cy="70" r="26" fill="none" stroke={unlocked ? cfg.shine : '#2a2f45'} strokeWidth="4" opacity="0.5" />
          <polygon points="50,52 56,65 70,67 60,77 63,91 50,84 37,91 40,77 30,67 44,65" fill={unlocked ? '#fff' : '#333'} opacity={unlocked ? '0.9' : '0.2'} />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="relative cursor-pointer transition-transform duration-200"
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow halo behind canvas */}
      {unlocked && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: cfg.glow, transform: 'scale(0.7)', opacity: hovered ? 0.8 : 0.4 }}
        />
      )}

      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 55 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={unlocked ? 0.5 : 0.15} />
        <pointLight position={[3, 4, 3]} intensity={unlocked ? 2.0 : 0.3} color={cfg.point} />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#a5b4fc" />

        <MedalMesh type={type} hovered={hovered} unlocked={unlocked} burst={burst} />

        {unlocked && (
          <Sparkles
            count={16}
            scale={2.8}
            size={0.8}
            speed={0.2}
            color={cfg.shine}
            opacity={hovered ? 0.9 : 0.45}
          />
        )}
      </Canvas>
    </div>
  )
}
