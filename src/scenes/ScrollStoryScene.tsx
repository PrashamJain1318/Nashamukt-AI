import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { SceneWrapper } from '@/components/three/SceneWrapper'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'

// ─── Shared mutable singleton: GSAP writes, useFrame reads ───────────────────
// No React re-renders required.
export const storyScrollProgress = { current: 0 }

// ─── Section configuration ────────────────────────────────────────────────────
const SECTIONS = [
  {
    label: 'Addiction',
    // Camera keyframe
    cam: new THREE.Vector3(0.2, -0.4, 7.8),
    look: new THREE.Vector3(0, -0.2, 0),
    // Orb
    orbColor: new THREE.Color('#3d1008'),
    orbEmissive: new THREE.Color('#6b0606'),
    orbDistort: 0.65,
    orbSpeed: 2.5,
    orbEmissiveInt: 1.0,
    // Ambient
    ambientColor: new THREE.Color('#1a0303'),
    ambientInt: 0.15,
    // Key light
    keyColor: new THREE.Color('#7f1d1d'),
    keyInt: 1.4,
    // Fill light
    fillColor: new THREE.Color('#200808'),
    fillInt: 0.2,
    // Particles
    pColor: new THREE.Color('#4a3020'),
    pSpeed: 0.007,
    pOpacity: 0.55,
    pSize: 0.028,
    // Fog
    fogColor: new THREE.Color('#080204'),
    fogNear: 4,
    fogFar: 14,
  },
  {
    label: 'Health Damage',
    cam: new THREE.Vector3(-1.2, -1.0, 8.0),
    look: new THREE.Vector3(-0.2, -0.5, 0),
    orbColor: new THREE.Color('#1a0a04'),
    orbEmissive: new THREE.Color('#3d0404'),
    orbDistort: 0.78,
    orbSpeed: 3.5,
    orbEmissiveInt: 0.8,
    ambientColor: new THREE.Color('#050a05'),
    ambientInt: 0.12,
    keyColor: new THREE.Color('#3f6b3f'),
    keyInt: 0.9,
    fillColor: new THREE.Color('#0a180a'),
    fillInt: 0.25,
    pColor: new THREE.Color('#2a4a1a'),
    pSpeed: 0.01,
    pOpacity: 0.6,
    pSize: 0.022,
    fogColor: new THREE.Color('#030805'),
    fogNear: 3,
    fogFar: 12,
  },
  {
    label: 'Decision to Quit',
    cam: new THREE.Vector3(0.8, 0.5, 6.8),
    look: new THREE.Vector3(0.1, 0.2, 0),
    orbColor: new THREE.Color('#5c3000'),
    orbEmissive: new THREE.Color('#c2680a'),
    orbDistort: 0.38,
    orbSpeed: 2.0,
    orbEmissiveInt: 1.4,
    ambientColor: new THREE.Color('#1a1200'),
    ambientInt: 0.28,
    keyColor: new THREE.Color('#d97706'),
    keyInt: 1.8,
    fillColor: new THREE.Color('#2a1800'),
    fillInt: 0.4,
    pColor: new THREE.Color('#b45309'),
    pSpeed: 0.012,
    pOpacity: 0.7,
    pSize: 0.02,
    fogColor: new THREE.Color('#0a0800'),
    fogNear: 5,
    fogFar: 16,
  },
  {
    label: 'AI Coach',
    cam: new THREE.Vector3(0.0, 2.0, 5.5),
    look: new THREE.Vector3(0, 0.5, 0),
    orbColor: new THREE.Color('#0d1240'),
    orbEmissive: new THREE.Color('#4338ca'),
    orbDistort: 0.18,
    orbSpeed: 1.2,
    orbEmissiveInt: 2.0,
    ambientColor: new THREE.Color('#000820'),
    ambientInt: 0.3,
    keyColor: new THREE.Color('#7c3aed'),
    keyInt: 2.0,
    fillColor: new THREE.Color('#1e1058'),
    fillInt: 0.6,
    pColor: new THREE.Color('#3b82f6'),
    pSpeed: 0.018,
    pOpacity: 0.8,
    pSize: 0.016,
    fogColor: new THREE.Color('#030614'),
    fogNear: 5,
    fogFar: 18,
  },
  {
    label: 'Recovery',
    cam: new THREE.Vector3(-0.6, 0.6, 6.2),
    look: new THREE.Vector3(-0.1, 0.1, 0),
    orbColor: new THREE.Color('#064e1e'),
    orbEmissive: new THREE.Color('#16a34a'),
    orbDistort: 0.14,
    orbSpeed: 1.0,
    orbEmissiveInt: 1.6,
    ambientColor: new THREE.Color('#001a08'),
    ambientInt: 0.38,
    keyColor: new THREE.Color('#22c55e'),
    keyInt: 1.6,
    fillColor: new THREE.Color('#052810'),
    fillInt: 0.5,
    pColor: new THREE.Color('#4ade80'),
    pSpeed: 0.008,
    pOpacity: 0.65,
    pSize: 0.022,
    fogColor: new THREE.Color('#010a03'),
    fogNear: 6,
    fogFar: 20,
  },
  {
    label: 'Healthy Life',
    cam: new THREE.Vector3(0.0, 0.1, 5.5),
    look: new THREE.Vector3(0, 0.1, 0),
    orbColor: new THREE.Color('#2d1f78'),
    orbEmissive: new THREE.Color('#818cf8'),
    orbDistort: 0.07,
    orbSpeed: 0.7,
    orbEmissiveInt: 2.5,
    ambientColor: new THREE.Color('#050420'),
    ambientInt: 0.55,
    keyColor: new THREE.Color('#a78bfa'),
    keyInt: 2.2,
    fillColor: new THREE.Color('#1e1b4b'),
    fillInt: 0.7,
    pColor: new THREE.Color('#c4b5fd'),
    pSpeed: 0.005,
    pOpacity: 0.75,
    pSize: 0.018,
    fogColor: new THREE.Color('#050418'),
    fogNear: 8,
    fogFar: 25,
  },
] as const

type Section = (typeof SECTIONS)[number]

// ─── Linear interpolation helpers ────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Writes lerped color into `out` to avoid allocations
const _c = new THREE.Color()
function lerpColor(out: THREE.Color, a: THREE.Color, b: THREE.Color, t: number) {
  out.copy(a).lerp(_c.copy(b), t)
}

function getSectionState(progress: number): { from: Section; to: Section; t: number } {
  const n = SECTIONS.length
  const scaled = progress * (n - 1)
  const i = Math.min(Math.floor(scaled), n - 2)
  return { from: SECTIONS[i], to: SECTIONS[i + 1], t: THREE.MathUtils.clamp(scaled - i, 0, 1) }
}

// ─── Camera Controller (reads storyScrollProgress directly) ──────────────────
const _targetPos = new THREE.Vector3()
const _targetLook = new THREE.Vector3()
const _currentLook = new THREE.Vector3()

function StoryCamera() {
  useFrame(({ camera }) => {
    const { from, to, t } = getSectionState(storyScrollProgress.current)

    _targetPos.set(
      lerp(from.cam.x, to.cam.x, t),
      lerp(from.cam.y, to.cam.y, t),
      lerp(from.cam.z, to.cam.z, t),
    )
    _targetLook.set(
      lerp(from.look.x, to.look.x, t),
      lerp(from.look.y, to.look.y, t),
      lerp(from.look.z, to.look.z, t),
    )

    camera.position.lerp(_targetPos, 0.035)
    _currentLook.lerp(_targetLook, 0.035)
    camera.lookAt(_currentLook)
  })
  return null
}

// ─── Dynamic Lighting (reads storyScrollProgress) ────────────────────────────
const _ambCol = new THREE.Color()
const _keyCol = new THREE.Color()
const _fillCol = new THREE.Color()
const _fogCol = new THREE.Color()

function StoryLighting() {
  const ambRef = useRef<THREE.AmbientLight>(null!)
  const keyRef = useRef<THREE.PointLight>(null!)
  const fillRef = useRef<THREE.DirectionalLight>(null!)

  useFrame(({ scene }) => {
    const { from, to, t } = getSectionState(storyScrollProgress.current)

    if (ambRef.current) {
      lerpColor(_ambCol, from.ambientColor, to.ambientColor, t)
      ambRef.current.color.copy(_ambCol)
      ambRef.current.intensity = lerp(from.ambientInt, to.ambientInt, t)
    }
    if (keyRef.current) {
      lerpColor(_keyCol, from.keyColor, to.keyColor, t)
      keyRef.current.color.copy(_keyCol)
      keyRef.current.intensity = lerp(from.keyInt, to.keyInt, t)
    }
    if (fillRef.current) {
      lerpColor(_fillCol, from.fillColor, to.fillColor, t)
      fillRef.current.color.copy(_fillCol)
      fillRef.current.intensity = lerp(from.fillInt, to.fillInt, t)
    }

    // Fog
    if (scene.fog instanceof THREE.Fog) {
      lerpColor(_fogCol, from.fogColor, to.fogColor, t)
      scene.fog.color.copy(_fogCol)
      scene.fog.near = lerp(from.fogNear, to.fogNear, t)
      scene.fog.far = lerp(from.fogFar, to.fogFar, t)
    }
  })

  return (
    <>
      <fog attach="fog" args={['#080204', 4, 14]} />
      <ambientLight ref={ambRef} color="#1a0303" intensity={0.15} />
      <pointLight ref={keyRef} position={[3, 4, 3]} color="#7f1d1d" intensity={1.4} distance={20} />
      <directionalLight ref={fillRef} position={[-4, 2, -2]} color="#200808" intensity={0.2} />
      <hemisphereLight args={['#0a0a1a', '#000000', 0.15]} />
    </>
  )
}

// ─── Central Morphing Orb ─────────────────────────────────────────────────────
const _orbCol = new THREE.Color()
const _orbEmissive = new THREE.Color()

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<any>(null!)
  const timeRef = useRef(0)

  const springs = useSpring({
    scale: 1,
    from: { scale: 0 },
    config: { tension: 50, friction: 14 },
  })

  useFrame((_, delta) => {
    timeRef.current += delta
    const { from, to, t } = getSectionState(storyScrollProgress.current)

    if (matRef.current) {
      lerpColor(_orbCol, from.orbColor, to.orbColor, t)
      lerpColor(_orbEmissive, from.orbEmissive, to.orbEmissive, t)
      matRef.current.color.copy(_orbCol)
      matRef.current.emissive.copy(_orbEmissive)
      matRef.current.distort = lerp(from.orbDistort, to.orbDistort, t)
      matRef.current.speed = lerp(from.orbSpeed, to.orbSpeed, t)
      matRef.current.emissiveIntensity = lerp(from.orbEmissiveInt, to.orbEmissiveInt, t)
    }

    // Slow self-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
      meshRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.15
    }
  })

  return (
    <animated.group scale={springs.scale as unknown as number}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.3, 4]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#3d1008"
          emissive="#6b0606"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={0.85}
          distort={0.65}
          speed={2.5}
        />
      </mesh>
      {/* Inner glow core */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.04} />
      </mesh>
      {/* Orbital ring 1 */}
      <OrbitalRing radius={2.0} thickness={0.014} speed={0.5} tiltX={Math.PI / 3} />
      {/* Orbital ring 2 */}
      <OrbitalRing radius={2.5} thickness={0.01} speed={-0.35} tiltX={-Math.PI / 5} tiltZ={Math.PI / 6} />
    </animated.group>
  )
}

// ─── Orbital ring that morphs color with section ──────────────────────────────
const _rCol = new THREE.Color()

function OrbitalRing({
  radius, thickness, speed, tiltX = 0, tiltZ = 0,
}: { radius: number; thickness: number; speed: number; tiltX?: number; tiltZ?: number }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * speed
    if (matRef.current) {
      const { from, to, t } = getSectionState(storyScrollProgress.current)
      lerpColor(_rCol, from.keyColor, to.keyColor, t)
      matRef.current.color.copy(_rCol)
      matRef.current.emissive.copy(_rCol)
    }
  })

  return (
    <mesh ref={meshRef} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, thickness, 8, 80]} />
      <meshStandardMaterial
        ref={matRef}
        color="#7f1d1d"
        emissive="#7f1d1d"
        emissiveIntensity={1.8}
        metalness={1}
        roughness={0}
      />
    </mesh>
  )
}

// ─── Story Particle System ────────────────────────────────────────────────────
const _pCol = new THREE.Color()

function StoryParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    const vel = new Float32Array(count * 3) // individual velocity offsets

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 4

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.5
      ph[i] = Math.random() * Math.PI * 2
      vel[i * 3]     = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = 0.004 + Math.random() * 0.006
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }
    return { positions: pos, phases: ph, velocities: vel }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const mat = pointsRef.current.material as THREE.PointsMaterial
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    const t_global = clock.getElapsedTime()

    const { from, to, t } = getSectionState(storyScrollProgress.current)
    const speed = lerp(from.pSpeed, to.pSpeed, t)
    const opacity = lerp(from.pOpacity, to.pOpacity, t)
    const size = lerp(from.pSize, to.pSize, t)

    lerpColor(_pCol, from.pColor, to.pColor, t)
    mat.color.copy(_pCol)
    mat.opacity = opacity
    mat.size = size

    const section = storyScrollProgress.current * 5 // 0-5

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Section-specific movement
      if (section < 2) {
        // Smoke: drift upward with sway
        pos[i3]     += Math.sin(t_global * 0.4 + phases[i]) * 0.003
        pos[i3 + 1] += speed
        pos[i3 + 2] += Math.cos(t_global * 0.3 + phases[i]) * 0.002
      } else if (section < 3) {
        // Toxic burst: accelerate outward
        const len = Math.sqrt(pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2)
        pos[i3]     += (pos[i3] / len) * speed * 0.5
        pos[i3 + 1] += speed * 0.8
      } else if (section < 4) {
        // Decision: chaotic swirl
        pos[i3]     += Math.sin(t_global * 1.2 + phases[i] * 3) * 0.01
        pos[i3 + 1] += speed * (1 + Math.sin(phases[i]) * 0.5)
        pos[i3 + 2] += Math.cos(t_global * 0.9 + phases[i] * 2) * 0.008
      } else if (section < 5) {
        // AI: structured data stream (matrix-like falling/rising)
        pos[i3 + 1] += speed * (i % 2 === 0 ? 1 : -1)
        pos[i3]     += Math.sin(pos[i3 + 1] * 0.5 + phases[i]) * 0.004
      } else {
        // Healthy Life: radiate outward like a celebration
        const angle = phases[i] * 4 + t_global * speed * 10
        pos[i3]     += Math.cos(angle) * speed * 0.8
        pos[i3 + 1] += Math.sin(angle * 0.7) * speed * 0.6 + speed * 0.3
        pos[i3 + 2] += Math.sin(angle) * speed * 0.4
      }

      // Reset out-of-bounds particles to inner sphere
      const dist2 = pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2
      if (dist2 > 100 || pos[i3 + 1] > 6 || pos[i3 + 1] < -6) {
        const r = 2 + Math.random() * 2
        const th = Math.random() * Math.PI * 2
        const ph_ = Math.acos(2 * Math.random() - 1)
        pos[i3]     = r * Math.sin(ph_) * Math.cos(th)
        pos[i3 + 1] = (Math.random() - 0.5) * 6
        pos[i3 + 2] = r * Math.cos(ph_) * 0.5
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#4a3020"
        size={0.028}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Section Accent: AI data network (visible near section 4) ─────────────────
function AIDataNetwork() {
  const groupRef = useRef<THREE.Group>(null!)
  const nodesRef = useRef<THREE.InstancedMesh>(null!)
  const timeRef = useRef(0)

  const nodes = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 2,
    ),
    phase: Math.random() * Math.PI * 2,
  })), [])

  useFrame((_, delta) => {
    timeRef.current += delta
    const p = storyScrollProgress.current
    // Visible only near section 4 (progress 0.5 – 0.67)
    const sectionP = p * 6
    const opacity = THREE.MathUtils.clamp(
      sectionP < 3 ? (sectionP - 2.5) * 2 : (4.5 - sectionP) * 2,
      0, 1,
    )
    if (groupRef.current) groupRef.current.visible = opacity > 0.01

    if (nodesRef.current) {
      const mat = nodesRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = opacity
      const dummy = new THREE.Object3D()
      nodes.forEach((n, i) => {
        dummy.position.copy(n.pos)
        dummy.position.y += Math.sin(timeRef.current * 0.8 + n.phase) * 0.1
        dummy.scale.setScalar(0.06 + Math.sin(timeRef.current + n.phase) * 0.02)
        dummy.updateMatrix()
        nodesRef.current.setMatrixAt(i, dummy.matrix)
      })
      nodesRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={2}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  )
}

// ─── Section Accent: Recovery light burst ─────────────────────────────────────
function RecoveryBurst() {
  const groupRef = useRef<THREE.Group>(null!)
  const raysRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const p = storyScrollProgress.current
    const sectionP = p * 6
    const opacity = THREE.MathUtils.clamp(
      sectionP < 4 ? (sectionP - 3.5) * 2 : (5.5 - sectionP) * 2,
      0, 1,
    )
    if (groupRef.current) {
      groupRef.current.visible = opacity > 0.01
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.15
    }
    // Update ray material opacity
    if (raysRef.current) {
      raysRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat) mat.opacity = opacity * 0.4
      })
    }
  })

  const rays = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * Math.PI * 2,
    length: 1.5 + Math.random() * 1,
    width: 0.03 + Math.random() * 0.04,
  })), [])

  return (
    <group ref={groupRef} visible={false} position={[0, 0, 0]}>
      <group ref={raysRef}>
        {rays.map((ray, i) => (
          <mesh
            key={i}
            position={[Math.cos(ray.angle) * ray.length * 0.5, Math.sin(ray.angle) * ray.length * 0.5, 0]}
            rotation={[0, 0, ray.angle + Math.PI / 2]}
          >
            <planeGeometry args={[ray.width, ray.length]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={3}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <Sparkles count={30} scale={4} size={0.8} speed={0.3} color="#4ade80" opacity={0.6} />
    </group>
  )
}

// ─── Full Scene Content ───────────────────────────────────────────────────────
function StorySceneContent() {
  const { maxParticles, tier } = usePerformanceDetector()
  const particleCount = Math.min(maxParticles, tier === 'high' ? 1800 : 900)

  return (
    <>
      <StoryCamera />
      <StoryLighting />
      <CentralOrb />
      <StoryParticles count={particleCount} />
      <AIDataNetwork />
      <RecoveryBurst />
      {tier !== 'low' && (
        <Stars radius={40} depth={15} count={1500} factor={3} saturation={0.3} fade speed={0.3} />
      )}
    </>
  )
}

// ─── Exported Scene ───────────────────────────────────────────────────────────
export function ScrollStoryScene() {
  const { tier } = usePerformanceDetector()
  if (tier === 'low') return null

  return (
    <SceneWrapper
      className="absolute inset-0 w-full h-full"
      cameraPosition={[0.2, -0.4, 7.8]}
      fov={68}
    >
      <StorySceneContent />
    </SceneWrapper>
  )
}
