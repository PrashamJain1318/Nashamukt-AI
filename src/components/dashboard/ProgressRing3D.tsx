import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface RingSceneProps {
  hovered: boolean
  clicked: boolean
  value: number
  color: string
  glowColor: string
}

function RingScene({ hovered, clicked, value, color, glowColor }: RingSceneProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const pulseSpeed = useRef(1)

  const arc = (value / 100) * Math.PI * 2

  useFrame((state, delta) => {
    if (clicked) {
      pulseSpeed.current = 5
    } else {
      pulseSpeed.current = THREE.MathUtils.lerp(pulseSpeed.current, hovered ? 2 : 1, 0.1)
    }

    // Gentle floating bob and rotation tilt
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15
    groupRef.current.rotation.x = Math.cos(t * 0.5) * 0.1

    if (hovered) {
      groupRef.current.rotation.z += delta * 0.5 * pulseSpeed.current
    } else {
      groupRef.current.rotation.z += delta * 0.1
    }

    const scaleFactor = (clicked ? 1.2 : 1) + Math.sin(t * 4) * 0.02
    groupRef.current.scale.setScalar(scaleFactor)
  })

  // Position of the glowing tip sphere at the end of the arc
  // Radius of torus is 1.3, offset by -Math.PI / 2 because the torus starts from -Math.PI / 2 position
  const tipX = Math.cos(arc - Math.PI / 2) * 1.3
  const tipY = Math.sin(arc - Math.PI / 2) * 1.3

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={color} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />

      <group ref={groupRef}>
        {/* Background full grey torus */}
        <mesh>
          <torusGeometry args={[1.3, 0.08, 12, 48]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.2} />
        </mesh>

        {/* Foreground colored progress torus */}
        {/* Rotate by -Math.PI / 2 around Z to start the progress at the top (12 o'clock) */}
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[1.3, 0.1, 16, 100, arc]} />
          <meshStandardMaterial
            color={color}
            emissive={glowColor}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Glowing tip indicator sphere */}
        <mesh position={[tipX, tipY, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </>
  )
}

interface ProgressRing3DProps {
  value: number // percentage 0-100
  color?: string
  glowColor?: string
  textColorClass?: string
  label?: string
}

export function ProgressRing3D({
  value = 75,
  color = '#06b6d4',
  glowColor = '#22d3ee',
  textColorClass = 'text-cyan-500',
  label,
}: ProgressRing3DProps) {
  const { tier } = usePerformanceDetector()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const displayText = label !== undefined ? label : `${value}%`

  // Responsive / Low performance fallback (SVG Ring)
  if (tier === 'low') {
    const radius = 35
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    return (
      <div 
        className="relative w-32 h-32 mx-auto flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          setClicked(true)
          setTimeout(() => setClicked(false), 300)
        }}
      >
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-20 ${hovered ? 'scale-110' : 'scale-95'}`} style={{ backgroundColor: color }} />
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="6"
            className="opacity-40"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out origin-center -rotate-90"
          />
          <text 
            x="50" 
            y="56" 
            textAnchor="middle" 
            className={`font-display font-bold text-lg ${textColorClass}`}
            fill="currentColor"
          >
            {displayText}
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-36 flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setClicked(true)
        setTimeout(() => setClicked(false), 500)
      }}
    >
      {/* Absolute text inside the ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        <span className={`font-display font-bold text-2xl ${textColorClass} drop-shadow-glow`}>
          {displayText}
        </span>
      </div>

      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <RingScene hovered={hovered} clicked={clicked} value={value} color={color} glowColor={glowColor} />
      </Canvas>
    </div>
  )
}
