import { useEffect, useRef } from 'react'

interface MouseParallax {
  x: number
  y: number
}

/**
 * Returns normalized mouse position [-1, 1] for use as parallax input.
 * Values are stored in a ref for use inside R3F's useFrame without re-renders.
 */
export function useMouseParallax() {
  const mouse = useRef<MouseParallax>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mouse
}
