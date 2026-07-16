import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleEngineProps {
  /** Total number of particles */
  count?: number
  /** Spatial spread radius */
  spread?: number
  /** Base particle size */
  size?: number
  /** Particle colour (hex) */
  color?: string
  /** Secondary / accent colour for variation */
  accentColor?: string
  /** Rotation speed multiplier */
  speed?: number
  /** Optional opacity */
  opacity?: number
}

/**
 * High-performance particle field using BufferGeometry + Points.
 * Uses a single draw-call — no looping over individual meshes.
 */
import { useTheme } from '@/components/theme-provider'

export function ParticleEngine({
  count = 1200,
  spread = 8,
  size = 0.015,
  color = '#7c3aed',
  accentColor = '#3b82f6',
  speed = 0.12,
  opacity = 0.75,
}: ParticleEngineProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const { theme } = useTheme()
  
  const activeTheme = theme === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  const isDark = activeTheme === 'dark'

  // Map default violet/blue particle colors to theme colors
  const finalColor = useMemo(() => {
    if (color === '#7c3aed' || color === '#7c3aed') {
      return isDark ? '#a855f7' : '#fbbf24' // Violet for dark, amber for light
    }
    return color
  }, [color, isDark])

  const finalAccentColor = useMemo(() => {
    if (accentColor === '#3b82f6' || accentColor === '#4f46e5') {
      return isDark ? '#00f2fe' : '#ffffff' // Cyan for dark, white for light
    }
    return accentColor
  }, [accentColor, isDark])

  // Build random positions once
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const c1 = new THREE.Color(finalColor)
    const c2 = new THREE.Color(finalAccentColor)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = spread * Math.cbrt(Math.random()) // cube-root for uniform sphere fill

      pos[i3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)

      const mixed = Math.random() > 0.5 ? c1 : c2
      col[i3]     = mixed.r
      col[i3 + 1] = mixed.g
      col[i3 + 2] = mixed.b
    }
    return { positions: pos, colors: col }
  }, [count, spread, finalColor, finalAccentColor])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * speed * 0.2
    pointsRef.current.rotation.x += delta * speed * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
