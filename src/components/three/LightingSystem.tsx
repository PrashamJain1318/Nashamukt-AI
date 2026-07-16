import { useTheme } from '@/components/theme-provider'

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
  const { theme } = useTheme()
  const activeTheme = theme === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  const isDark = activeTheme === 'dark'

  if (preset === 'ambient-soft') {
    return (
      <>
        <ambientLight intensity={isDark ? 0.45 : 0.75} />
        {isDark ? (
          <>
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#a855f7" />
            <pointLight position={[-10, -10, -5]} intensity={0.8} color="#00f2fe" />
            <hemisphereLight args={['#05060A', '#141724', 0.4]} />
          </>
        ) : (
          <>
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#fbbf24" /> {/* Golden sunlight */}
            <pointLight position={[-10, -10, -5]} intensity={0.6} color="#38bdf8" />
            <hemisphereLight args={['#ffffff', '#f1f5f9', 0.6]} />
          </>
        )}
      </>
    )
  }

  if (preset === 'dramatic') {
    return (
      <>
        <ambientLight intensity={isDark ? 0.1 : 0.3} />
        <directionalLight
          position={[5, 8, 3]}
          intensity={isDark ? 2 : 1.5}
          color={isDark ? "#ffffff" : "#fffbeb"}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {isDark ? (
          <pointLight position={[-8, -2, -3]} intensity={0.5} color="#a855f7" />
        ) : (
          <pointLight position={[-8, -2, -3]} intensity={0.4} color="#fbbf24" />
        )}
      </>
    )
  }

  // studio
  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.5} />
      {/* Key */}
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.5 : 1.2} color={isDark ? "#ffffff" : "#fffbeb"} />
      {/* Fill */}
      <directionalLight position={[-5, 3, 2]} intensity={0.5} color={isDark ? "#e0e7ff" : "#f1f5f9"} />
      {/* Rim */}
      <directionalLight position={[0, -5, -5]} intensity={0.8} color={isDark ? "#a855f7" : "#38bdf8"} />
    </>
  )
}
