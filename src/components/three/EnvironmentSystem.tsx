import { Environment, GradientTexture, Sky } from '@react-three/drei'

type EnvironmentPreset = 'gradient-dark' | 'gradient-purple' | 'city' | 'sky'

interface EnvironmentSystemProps {
  preset?: EnvironmentPreset
}

/**
 * Pluggable environment / background system.
 * Wraps @react-three/drei's Environment with curated presets.
 */
export function EnvironmentSystem({ preset = 'gradient-dark' }: EnvironmentSystemProps) {
  if (preset === 'gradient-dark') {
    return (
      <mesh scale={100}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial side={1}>
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={['#0f0f1a', '#1e1b4b', '#0f172a']}
            size={1024}
          />
        </meshBasicMaterial>
      </mesh>
    )
  }

  if (preset === 'gradient-purple') {
    return (
      <mesh scale={100}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial side={1}>
          <GradientTexture
            stops={[0, 0.6, 1]}
            colors={['#1e1b4b', '#4c1d95', '#0f172a']}
            size={1024}
          />
        </meshBasicMaterial>
      </mesh>
    )
  }

  if (preset === 'sky') {
    return <Sky sunPosition={[100, 10, 100]} />
  }

  // city preset
  return <Environment preset="city" background={false} />
}
