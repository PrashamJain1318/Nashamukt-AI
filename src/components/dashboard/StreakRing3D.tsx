import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus } from '@react-three/drei'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface StreakSceneProps {
  hovered: boolean
  clicked: boolean
}

function StreakScene({ hovered, clicked }: StreakSceneProps) {
  const torusRef = useRef<THREE.Mesh>(null!)
  const particlesRef = useRef<THREE.Points>(null!)
  const pulseSpeed = useRef(1)

  // Generate particle positions for a ring structure
  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 1.75 + (Math.random() - 0.5) * 0.2
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4
    }
    return pos
  }, [])

  useFrame((state, delta) => {
    if (clicked) {
      pulseSpeed.current = 8
    } else {
      pulseSpeed.current = THREE.MathUtils.lerp(pulseSpeed.current, hovered ? 2.5 : 1, 0.1)
    }

    // Rotations
    torusRef.current.rotation.z += delta * 0.4 * pulseSpeed.current
    particlesRef.current.rotation.z -= delta * 0.2 * pulseSpeed.current
    
    // Animate particle scale/wobble
    const t = state.clock.getElapsedTime()
    particlesRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05)
    
    const scaleFactor = (clicked ? 1.25 : 1) + Math.sin(t * 3) * 0.03
    torusRef.current.scale.setScalar(scaleFactor)
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#f97316" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ef4444" />

      {/* Main streak torus */}
      <Torus ref={torusRef} args={[1.3, 0.15, 12, 48]}>
        <meshStandardMaterial
          color="#f97316"
          emissive="#ef4444"
          emissiveIntensity={hovered ? 0.95 : 0.45}
          roughness={0.2}
          metalness={0.9}
        />
      </Torus>

      {/* Outer sparks / particles ring */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f97316"
          size={0.07}
          transparent
          opacity={hovered ? 0.95 : 0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  )
}

export function StreakRing3D({ days = 5 }: { days?: number }) {
  const { tier } = usePerformanceDetector()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Fallback for low performance GPU
  if (tier === 'low') {
    return (
      <div 
        className="relative w-36 h-36 mx-auto flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          setClicked(true)
          setTimeout(() => setClicked(false), 300)
        }}
      >
        <div className={`absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-orange-500 to-amber-500 transition-all duration-500 ${hovered ? 'scale-110 opacity-50' : 'scale-95 opacity-30'}`} />
        
        <svg viewBox="0 0 100 100" className={`w-32 h-32 relative z-10 transition-transform duration-300 ${clicked ? 'scale-110' : 'hover:scale-105'}`}>
          <defs>
            <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="orangeGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#streakGrad)"
            strokeWidth="6"
            filter="url(#orangeGlow)"
            strokeDasharray="180 60"
            className={`${hovered ? 'animate-spin' : ''}`}
            style={{ 
              transformOrigin: 'center', 
              animationDuration: hovered ? '3s' : '8s',
              animationTimingFunction: 'linear'
            }}
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          
          <text 
            x="50" 
            y="56" 
            textAnchor="middle" 
            className="font-display font-bold text-foreground text-xl"
            fill="currentColor"
          >
            {days}d
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-40 flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setClicked(true)
        setTimeout(() => setClicked(false), 500)
      }}
    >
      <div className={`absolute w-32 h-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none transition-all duration-300 ${hovered ? 'scale-125 opacity-100' : 'scale-90 opacity-60'}`} />
      
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <StreakScene hovered={hovered} clicked={clicked} />
      </Canvas>
    </div>
  )
}
