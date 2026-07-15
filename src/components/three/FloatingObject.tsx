import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

interface FloatingObjectProps {
  children: React.ReactNode
  /** Vertical float amplitude in world units */
  amplitude?: number
  /** Float oscillation speed */
  speed?: number
  /** Additional rotation speed [x, y, z] */
  rotationSpeed?: [number, number, number]
  /** Entrance spring — scale from 0 to 1 */
  enableEntrance?: boolean
}

/**
 * Wraps any 3D mesh/group in a smooth bobbing + rotation animation.
 * Uses react-spring for the entrance and useFrame for continuous motion.
 */
export function FloatingObject({
  children,
  amplitude = 0.12,
  speed = 1,
  rotationSpeed = [0, 0.003, 0],
  enableEntrance = true,
}: FloatingObjectProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(Math.random() * Math.PI * 2) // random phase offset

  // Entrance spring: pops in from scale 0
  const springs = useSpring({
    scale: enableEntrance ? 1 : 1,
    from: { scale: enableEntrance ? 0 : 1 },
    config: { tension: 120, friction: 14 },
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta * speed
    // Bobbing
    groupRef.current.position.y = Math.sin(timeRef.current) * amplitude
    // Rotation
    groupRef.current.rotation.x += rotationSpeed[0]
    groupRef.current.rotation.y += rotationSpeed[1]
    groupRef.current.rotation.z += rotationSpeed[2]
  })

  return (
    <animated.group ref={groupRef} scale={springs.scale as unknown as number}>
      {children}
    </animated.group>
  )
}
