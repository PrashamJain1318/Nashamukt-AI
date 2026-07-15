import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMouseParallax } from '@/hooks/three/useMouseParallax'
import * as THREE from 'three'

interface CameraControllerProps {
  /** Enable subtle mouse-parallax camera movement */
  enableParallax?: boolean
  /** Parallax strength — smaller = subtler */
  parallaxStrength?: number
  /** Enable OrbitControls for development / exploration */
  enableOrbit?: boolean
  /** Auto-rotate the OrbitControls */
  autoRotate?: boolean
}

/**
 * Pluggable camera controller. Drop it inside any SceneWrapper.
 * Applies smooth mouse-driven parallax and optional OrbitControls.
 */
export function CameraController({
  enableParallax = true,
  parallaxStrength = 0.15,
  enableOrbit = false,
  autoRotate = false,
}: CameraControllerProps) {
  const { camera } = useThree()
  const mouse = useMouseParallax()
  const targetX = useRef(0)
  const targetY = useRef(0)

  useFrame(() => {
    if (!enableParallax) return
    targetX.current = mouse.current.x * parallaxStrength
    targetY.current = mouse.current.y * parallaxStrength

    camera.position.x += (targetX.current - camera.position.x) * 0.04
    camera.position.y += (targetY.current - camera.position.y) * 0.04
    camera.lookAt(new THREE.Vector3(0, 0, 0))
  })

  if (enableOrbit) {
    return <OrbitControls autoRotate={autoRotate} enableZoom={false} enablePan={false} />
  }

  return null
}
