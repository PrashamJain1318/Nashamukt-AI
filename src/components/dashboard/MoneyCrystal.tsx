import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Octahedron } from '@react-three/drei'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface CrystalSceneProps {
  hovered: boolean
  clicked: boolean
}

function CrystalScene({ hovered, clicked }: CrystalSceneProps) {
  const crystalRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Mesh>(null!)
  const spinSpeed = useRef(1)

  useFrame((state, delta) => {
    // Smoothly decay spin speed after click
    if (clicked) {
      spinSpeed.current = 10
    } else {
      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, hovered ? 3.0 : 1.0, 0.1)
    }

    crystalRef.current.rotation.y += delta * 0.5 * spinSpeed.current
    crystalRef.current.rotation.x += delta * 0.2 * spinSpeed.current
    
    outerRef.current.rotation.y -= delta * 0.2
    
    // Scale pulse
    const t = state.clock.getElapsedTime()
    const scaleFactor = (clicked ? 1.25 : 1) + Math.sin(t * 2.5) * 0.03
    crystalRef.current.scale.setScalar(scaleFactor)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

      {/* Rotating emerald crystal */}
      <Octahedron ref={crystalRef} args={[1.3, 0]}>
        <meshPhysicalMaterial
          color={clicked ? "#34d399" : hovered ? "#059669" : "#10b981"}
          roughness={0.15}
          metalness={0.1}
          transmission={0.65}
          thickness={1.5}
          ior={1.48}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Octahedron>

      {/* Floating holographic containment rings */}
      <mesh ref={outerRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.9, 0.02, 8, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={hovered ? 0.45 : 0.18} />
      </mesh>
    </>
  )
}

export function MoneyCrystal() {
  const { tier } = usePerformanceDetector()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Fallback for low GPU tier
  if (tier === 'low') {
    return (
      <div
        className="relative w-36 h-36 mx-auto flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          setClicked(true)
          setTimeout(() => setClicked(false), 400)
        }}
      >
        <div className={`absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-emerald-500 to-teal-500 transition-all duration-500 ${hovered ? 'scale-110 opacity-50' : 'scale-95 opacity-30'}`} />
        <svg viewBox="0 0 100 100" className={`w-28 h-28 relative z-10 transition-transform duration-300 ${clicked ? 'scale-110' : 'hover:scale-105'}`}>
          <defs>
            <linearGradient id="crysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="crysGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="50,15 80,50 50,85 20,50"
            fill="url(#crysGrad)"
            filter="url(#crysGlow)"
            className={`${hovered ? 'animate-pulse' : ''}`}
            style={{ transformOrigin: 'center', animationDuration: '2s' }}
          />
          <polygon points="50,15 50,50 80,50" fill="rgba(255,255,255,0.15)" />
          <polygon points="50,15 50,50 20,50" fill="rgba(255,255,255,0.05)" />
          <polygon points="50,85 50,50 80,50" fill="rgba(0,0,0,0.15)" />
          <polygon points="50,85 50,50 20,50" fill="rgba(0,0,0,0.05)" />
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
      <div className={`absolute w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none transition-all duration-300 ${hovered ? 'scale-125 opacity-100' : 'scale-90 opacity-60'}`} />
      
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <CrystalScene hovered={hovered} clicked={clicked} />
      </Canvas>
    </div>
  )
}
