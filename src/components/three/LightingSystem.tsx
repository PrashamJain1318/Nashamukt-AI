interface LightingSystemProps {
  /** 'ambient-soft' | 'dramatic' | 'studio' */
  preset?: 'ambient-soft' | 'dramatic' | 'studio'
}

/**
 * Reusable lighting presets. Place inside any SceneWrapper.
 *
 * ambient-soft  → gentle fill lights for hero sections
 * dramatic      → single key + rim for product/model shots
 * studio        → three-point studio lighting
 */
export function LightingSystem({ preset = 'ambient-soft' }: LightingSystemProps) {
  if (preset === 'ambient-soft') {
    return (
      <>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#7c3aed" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
        <hemisphereLight args={['#1e1b4b', '#0f0f1a', 0.3]} />
      </>
    )
  }

  if (preset === 'dramatic') {
    return (
      <>
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[5, 8, 3]}
          intensity={2}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-8, -2, -3]} intensity={0.5} color="#7c3aed" />
      </>
    )
  }

  // studio
  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Key */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      {/* Fill */}
      <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#e0e7ff" />
      {/* Rim */}
      <directionalLight position={[0, -5, -5]} intensity={0.8} color="#7c3aed" />
    </>
  )
}
