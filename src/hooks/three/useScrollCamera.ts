import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface UseScrollCameraOptions {
  startZ?: number
  endZ?: number
}

/**
 * Animates the camera along the Z axis based on window scroll position.
 */
export function useScrollCamera({ startZ = 5, endZ = 3 }: UseScrollCameraOptions = {}) {
  const { camera } = useThree()
  const scrollRef = useRef(0)

  // Listen to scroll
  if (typeof window !== 'undefined') {
    window.addEventListener(
      'scroll',
      () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight
        scrollRef.current = window.scrollY / (maxScroll || 1)
      },
      { passive: true }
    )
  }

  useFrame(() => {
    const targetZ = THREE.MathUtils.lerp(startZ, endZ, scrollRef.current)
    camera.position.z += (targetZ - camera.position.z) * 0.05
  })
}
