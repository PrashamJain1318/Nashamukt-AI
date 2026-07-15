import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface MedalSceneProps {
  type: 'gold' | 'silver' | 'bronze' | 'flame'
  hovered: boolean
}

function MedalScene({ type, hovered }: MedalSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  const colors = {
    gold: { base: '#fbbf24', emissive: '#d97706', point: '#f59e0b' },
    silver: { base: '#cbd5e1', emissive: '#475569', point: '#94a3b8' },
    bronze: { base: '#b45309', emissive: '#78350f', point: '#d97706' },
    flame: { base: '#ef4444', emissive: '#991b1b', point: '#f97316' },
  }

  const activeColor = colors[type] || colors.gold

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    
    // Smooth floating bobbing
    const bob = Math.sin(t * 2) * 0.12
    meshRef.current.position.y = bob
    ringRef.current.position.y = bob

    // Continuous spin
    const speed = hovered ? 4 : 1
    meshRef.current.rotation.y += delta * 0.8 * speed
    ringRef.current.rotation.y += delta * 0.8 * speed
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={activeColor.point} />

      {/* Outer decorative ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.08, 8, 32]} />
        <meshStandardMaterial
          color={activeColor.base}
          emissive={activeColor.emissive}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Main thin cylindrical medal body */}
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.15, 32]} />
        <meshStandardMaterial
          color={activeColor.base}
          emissive={activeColor.emissive}
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </>
  )
}

interface FloatingMedalProps {
  type?: 'gold' | 'silver' | 'bronze' | 'flame'
}

export function FloatingMedal({ type = 'gold' }: FloatingMedalProps) {
  const { tier } = usePerformanceDetector()
  const [hovered, setHovered] = useState(false)

  const colors = {
    gold: '#fbbf24',
    silver: '#cbd5e1',
    bronze: '#b45309',
    flame: '#ef4444',
  }

  // Low performance tier fallback (bobbing SVG)
  if (tier === 'low') {
    return (
      <div 
        className="w-10 h-10 flex items-center justify-center cursor-pointer animate-bounce"
        style={{ animationDuration: '3s' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill={colors[type]} className="opacity-90" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
          <polygon points="50,25 57,40 73,42 61,53 65,69 50,60 35,69 39,53 27,42 43,40" fill="white" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="w-12 h-12 flex items-center justify-center cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        className="absolute w-8 h-8 rounded-full blur-lg opacity-40 transition-all duration-300 scale-75 group-hover:scale-110 pointer-events-none"
        style={{ backgroundColor: colors[type] }}
      />
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 3.2], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <MedalScene type={type} hovered={hovered} />
      </Canvas>
    </div>
  )
}
