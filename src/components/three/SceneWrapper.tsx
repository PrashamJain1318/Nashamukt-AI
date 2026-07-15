import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'

interface SceneWrapperProps {
  children: React.ReactNode
  /** Tailwind/CSS classes applied to the container div */
  className?: string
  /** CSS background behind the canvas */
  background?: string
  /** Force a specific camera position */
  cameraPosition?: [number, number, number]
  /** Camera FOV */
  fov?: number
}

/**
 * Universal Canvas wrapper.
 * - Adapts DPR & frameloop based on detected GPU tier
 * - Wraps children in <Suspense> so lazy 3D meshes load cleanly
 * - Pointer-events-none so it never blocks 2D UI underneath
 */
export function SceneWrapper({
  children,
  className = '',
  background = 'transparent',
  cameraPosition = [0, 0, 5],
  fov = 75,
}: SceneWrapperProps) {
  const { dpr, frameloop } = usePerformanceDetector()

  return (
    <div
      className={className}
      style={{ background }}
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: cameraPosition, fov }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
