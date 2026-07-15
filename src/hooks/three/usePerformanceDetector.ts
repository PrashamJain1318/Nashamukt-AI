import { useEffect, useRef, useState } from 'react'

type PerformanceTier = 'high' | 'medium' | 'low'

interface PerformanceResult {
  tier: PerformanceTier
  isMobile: boolean
  dpr: [number, number]
  maxParticles: number
  enableShadows: boolean
  frameloop: 'always' | 'demand' | 'never'
}

export function usePerformanceDetector(): PerformanceResult {
  const [tier, setTier] = useState<PerformanceTier>('medium')
  const detected = useRef(false)

  const isMobile =
    typeof navigator !== 'undefined' &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

  useEffect(() => {
    if (detected.current) return
    detected.current = true

    // Heuristic: use canvas benchmark
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (!gl) {
      setTier('low')
      return
    }

    const renderer = gl.getParameter(gl.RENDERER) as string
    const lowGPU = /SwiftShader|llvmpipe|Adreno 3|Mali-4/i.test(renderer)
    if (lowGPU || isMobile) {
      setTier('medium')
      return
    }

    // FPS benchmark — render 1000 empty draw calls
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    const elapsed = performance.now() - start
    setTier(elapsed < 50 ? 'high' : elapsed < 150 ? 'medium' : 'low')
  }, [isMobile])

  const configs: Record<PerformanceTier, Omit<PerformanceResult, 'isMobile' | 'tier'>> = {
    high: {
      dpr: [1, 2],
      maxParticles: 3000,
      enableShadows: true,
      frameloop: 'always',
    },
    medium: {
      dpr: [1, 1.5],
      maxParticles: 1200,
      enableShadows: false,
      frameloop: 'always',
    },
    low: {
      dpr: [1, 1],
      maxParticles: 400,
      enableShadows: false,
      frameloop: 'demand',
    },
  }

  return { tier, isMobile, ...configs[tier] }
}
