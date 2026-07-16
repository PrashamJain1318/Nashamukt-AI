import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

// ─── Plasma energy particles flowing inside the beam ─────────────────────────
function BeamParticles({ progress, color }: { progress: number; color: string }) {
  const ref = useRef<THREE.Points>(null!)
  const count = 60

  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sp  = new Float32Array(count)
    const ph  = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = -2.5 + Math.random() * 5.0
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.18
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.18
      sp[i]  = 0.6 + Math.random() * 1.4
      ph[i]  = Math.random() * Math.PI * 2
    }
    return [pos, sp, ph]
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const limit = -2.5 + (progress / 100) * 5.0   // wall at current progress

    for (let i = 0; i < count; i++) {
      arr[i * 3] += speeds[i] * delta * 1.8          // move right
      if (arr[i * 3] > limit) arr[i * 3] = -2.5      // recycle at fill edge

      // Oscillate Y/Z slightly
      arr[i * 3 + 1] = Math.sin(t * 3 + phases[i]) * 0.07
      arr[i * 3 + 2] = Math.cos(t * 2 + phases[i]) * 0.07
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.065}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Plasma beam fill bar ────────────────────────────────────────────────────
function BeamBar({ progress, fillColor }: { progress: number; fillColor: string }) {
  const ref       = useRef<THREE.Mesh>(null!)
  const glowRef   = useRef<THREE.Mesh>(null!)

  const fillW = (progress / 100) * 5.0
  const fillX = -2.5 + fillW / 2

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Pulse the glow mesh
    if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = 0.18 + Math.sin(t * 4) * 0.06
    }
  })

  return (
    <>
      {/* Track (background) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.0, 0.22, 0.22]} />
        <meshStandardMaterial color="#0a0f1e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Energy fill */}
      <mesh ref={ref} position={[fillX, 0, 0]}>
        <boxGeometry args={[fillW || 0.001, 0.22, 0.22]} />
        <meshStandardMaterial
          color={fillColor}
          emissive={fillColor}
          emissiveIntensity={0.9}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Leading-edge plasma glow sphere */}
      {fillW > 0.1 && (
        <mesh ref={glowRef} position={[fillX + fillW / 2 - 0.01, 0, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshBasicMaterial color={fillColor} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {/* Track endcap rings */}
      <mesh position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.14, 0.025, 6, 24]} />
        <meshBasicMaterial color="#1e2232" />
      </mesh>
      <mesh position={[2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.14, 0.025, 6, 24]} />
        <meshBasicMaterial color="#1e2232" />
      </mesh>
    </>
  )
}

// ─── Public Component ─────────────────────────────────────────────────────────
export interface XPEnergyBeamProps {
  value: number        // 0-1000 current XP within level
  maxValue?: number    // e.g., 1000
  color?: string
  glowColor?: string
  className?: string
}

export function XPEnergyBeam({
  value,
  maxValue = 1000,
  color     = '#a855f7',
  glowColor = '#c084fc',
  className = '',
}: XPEnergyBeamProps) {
  const { tier } = usePerformanceDetector()
  const progress = Math.min(100, Math.round((value / maxValue) * 100))

  // Flat CSS fallback for low-perf
  if (tier === 'low') {
    return (
      <div className={`relative h-3 rounded-full bg-white/5 overflow-hidden ${className}`}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, backgroundColor: color, boxShadow: `0 0 12px ${glowColor}` }}
        />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height: '42px' }}>
      {/* Outer glow wash */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none blur-xl opacity-30"
        style={{ height: '24px', background: `linear-gradient(90deg, transparent, ${color} ${progress}%, transparent)` }}
      />

      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <BeamBar progress={progress} fillColor={color} />
        <BeamParticles progress={progress} color={glowColor} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 1, 2]} intensity={0.6} color={glowColor} />
      </Canvas>
    </div>
  )
}
