import { SceneWrapper } from '@/components/three/SceneWrapper'
import { ParticleEngine } from '@/components/three/ParticleEngine'
import { LightingSystem } from '@/components/three/LightingSystem'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'

function DashboardSceneContent() {
  const { maxParticles } = usePerformanceDetector()
  return (
    <>
      <LightingSystem preset="ambient-soft" />
      <ParticleEngine
        count={Math.min(maxParticles, 600)}
        spread={10}
        size={0.008}
        color="#7c3aed"
        accentColor="#4f46e5"
        speed={0.04}
        opacity={0.3}
      />
    </>
  )
}

/**
 * Subtle ambient particle background for the Dashboard page.
 * Renders as a fixed full-page layer behind all content.
 */
export function DashboardScene() {
  const { tier } = usePerformanceDetector()
  if (tier === 'low') return null

  return (
    <SceneWrapper
      className="fixed inset-0 w-full h-full pointer-events-none"
      cameraPosition={[0, 0, 6]}
      fov={75}
    >
      <DashboardSceneContent />
    </SceneWrapper>
  )
}
