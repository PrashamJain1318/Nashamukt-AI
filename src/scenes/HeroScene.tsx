import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { SceneWrapper } from '@/components/three/SceneWrapper'
import { CameraController } from '@/components/three/CameraController'
import { LightingSystem } from '@/components/three/LightingSystem'
import { ParticleEngine } from '@/components/three/ParticleEngine'
import { FloatingObject } from '@/components/three/FloatingObject'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'

// ─── Inner orb mesh ──────────────────────────────────────────────────────────
function GlowingOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.08
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.1, 4]} />
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#4c1d95"
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.9}
        distort={0.35}
        speed={1.5}
        transparent
        opacity={0.92}
      />
    </mesh>
  )
}

// ─── Inner rotating ring ─────────────────────────────────────────────────────
function Ring({ scale = 1, speed = 1, axis = 'x' as 'x' | 'y' | 'z', color = '#7c3aed' }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation[axis] += delta * speed
  })

  return (
    <mesh ref={meshRef} scale={scale}>
      <torusGeometry args={[1.8, 0.012, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// ─── Orbiting satellite spheres ───────────────────────────────────────────────
function OrbitingSpheres({ count = 5 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  const spheres = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: 2.2,
      size: 0.06 + Math.random() * 0.08,
      speed: 0.3 + Math.random() * 0.2,
      color: i % 2 === 0 ? '#7c3aed' : '#3b82f6',
    }))
  , [count])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    spheres.forEach((s, i) => {
      const child = groupRef.current.children[i] as THREE.Mesh
      if (!child) return
      const t = clock.getElapsedTime() * s.speed + s.angle
      child.position.x = Math.cos(t) * s.radius
      child.position.z = Math.sin(t) * s.radius
      child.position.y = Math.sin(t * 0.7) * 0.3
    })
  })

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[s.size, 12, 12]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Full scene assembled ─────────────────────────────────────────────────────
function HeroSceneContent() {
  const { maxParticles } = usePerformanceDetector()

  return (
    <>
      <LightingSystem preset="ambient-soft" />
      <CameraController enableParallax parallaxStrength={0.2} />

      {/* Central orb */}
      <FloatingObject amplitude={0.08} speed={0.8} rotationSpeed={[0, 0.001, 0]}>
        <GlowingOrb />
        <Ring scale={1} speed={0.4} axis="x" color="#7c3aed" />
        <Ring scale={1.1} speed={-0.3} axis="y" color="#3b82f6" />
        <Ring scale={1.05} speed={0.25} axis="z" color="#818cf8" />
        <OrbitingSpheres count={6} />
      </FloatingObject>

      {/* Ambient sparkles from Drei */}
      <Sparkles
        count={80}
        scale={8}
        size={0.6}
        speed={0.15}
        color="#818cf8"
        opacity={0.5}
      />

      {/* Deep particle field */}
      <ParticleEngine
        count={Math.min(maxParticles, 2000)}
        spread={12}
        size={0.012}
        color="#7c3aed"
        accentColor="#3b82f6"
        speed={0.08}
        opacity={0.5}
      />
    </>
  )
}

// ─── Exported component (self-contained with Canvas) ─────────────────────────
export function HeroScene() {
  const { tier } = usePerformanceDetector()

  // On low-power devices, skip 3D entirely
  if (tier === 'low') return null

  return (
    <SceneWrapper
      className="absolute inset-0 w-full h-full"
      cameraPosition={[0, 0, 4.5]}
      fov={70}
    >
      <HeroSceneContent />
    </SceneWrapper>
  )
}
