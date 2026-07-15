import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface OrbSceneProps {
  hovered: boolean
  clicked: boolean
}

function OrbScene({ hovered, clicked }: OrbSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const wireRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const speed = hovered ? 2.5 : 1
    meshRef.current.rotation.y += delta * 0.5 * speed
    wireRef.current.rotation.x -= delta * 0.3 * speed
    wireRef.current.rotation.y -= delta * 0.2 * speed
    
    // Wave distortion pulsation based on clock time
    const t = state.clock.getElapsedTime()
    meshRef.current.scale.setScalar(
      (clicked ? 1.15 : 1) + Math.sin(t * (hovered ? 6 : 3)) * 0.03
    )
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />

      {/* Main liquid health orb */}
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color={clicked ? "#a855f7" : hovered ? "#06b6d4" : "#22d3ee"}
          roughness={0.1}
          metalness={0.8}
          distort={hovered ? 0.45 : 0.3}
          speed={hovered ? 4 : 2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Holographic outer wireframe shield */}
      <Sphere ref={wireRef} args={[1.8, 16, 16]}>
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={hovered ? 0.35 : 0.12}
        />
      </Sphere>
    </>
  )
}

export function InteractiveOrb() {
  const { tier } = usePerformanceDetector()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Low performance tier fallback (pure CSS SVG fluid orb)
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
        <div className={`absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-cyan-500 to-purple-500 transition-all duration-500 ${hovered ? 'scale-110 opacity-50' : 'scale-95 opacity-30'}`} />
        <svg viewBox="0 0 100 100" className={`w-full h-full relative z-10 transition-transform duration-300 ${clicked ? 'scale-110' : 'hover:scale-105'}`}>
          <defs>
            <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            fill="url(#orbGrad)"
            filter="url(#glow)"
            d="M80,50 C80,66.5 66.5,80 50,80 C33.5,80 20,66.5 20,50 C20,33.5 33.5,20 50,20 C66.5,20 80,33.5 80,50 Z"
            className="animate-pulse"
            style={{ transformOrigin: 'center', animationDuration: hovered ? '1.5s' : '3s' }}
          />
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
        setTimeout(() => setClicked(false), 300)
      }}
    >
      <div className={`absolute w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none transition-all duration-300 ${hovered ? 'scale-125 opacity-100' : 'scale-90 opacity-60'}`} />
      
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <OrbScene hovered={hovered} clicked={clicked} />
      </Canvas>
    </div>
  )
}
