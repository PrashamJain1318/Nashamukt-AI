import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, Stars, Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { SceneWrapper } from '@/components/three/SceneWrapper'
import { useMouseParallax } from '@/hooks/three/useMouseParallax'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'

// ─── Utilities ────────────────────────────────────────────────────────────────
function useEntrance(delay = 0) {
  const springs = useSpring({
    scale: 1,
    opacity: 1,
    from: { scale: 0, opacity: 0 },
    delay,
    config: { tension: 80, friction: 18 },
  })
  return springs
}

// ─── DARK LUNGS (Left side) ───────────────────────────────────────────────────
function DarkLungs({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)
  const springs = useEntrance(200)

  useFrame((_, delta) => {
    timeRef.current += delta * 0.4
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current) * 0.06
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.05
    }
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {/* Left lobe */}
      <mesh position={[-0.28, 0, 0]} scale={[0.55, 0.8, 0.4]}>
        <sphereGeometry args={[1, 20, 20]} />
        <MeshDistortMaterial
          color="#2d1a10"
          roughness={0.9}
          metalness={0.05}
          distort={0.15}
          speed={1.5}
          emissive="#1a0a04"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Right lobe */}
      <mesh position={[0.28, -0.1, 0]} scale={[0.45, 0.65, 0.35]}>
        <sphereGeometry args={[1, 20, 20]} />
        <MeshDistortMaterial
          color="#3a1f10"
          roughness={0.95}
          metalness={0.05}
          distort={0.18}
          speed={1.2}
          emissive="#1a0a04"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 0.75, 0]} scale={[0.08, 0.35, 0.08]}>
        <cylinderGeometry args={[1, 0.8, 1, 8]} />
        <meshStandardMaterial color="#1a0a04" roughness={0.9} />
      </mesh>
      {/* Dark veins / damage marks */}
      {[-0.15, 0.05, 0.2, -0.3, 0.35].map((x, i) => (
        <mesh key={i} position={[x, -0.1 + i * 0.08, 0.3]} rotation={[0, 0, i * 0.5]}>
          <cylinderGeometry args={[0.015, 0.008, 0.4 + i * 0.1, 4]} />
          <meshStandardMaterial color="#4a0505" roughness={1} emissive="#200000" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </animated.group>
  )
}

// ─── BROKEN CIGARETTE ─────────────────────────────────────────────────────────
function BrokenCigarette({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(Math.random() * 10)
  const springs = useEntrance(400)

  useFrame((_, delta) => {
    timeRef.current += delta * 0.6
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current) * 0.08
      groupRef.current.rotation.z = Math.sin(timeRef.current * 0.3) * 0.05
    }
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {/* Top broken piece */}
      <group rotation={[0, 0, -0.35]} position={[-0.05, 0.22, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
        </mesh>
        {/* Filter tip */}
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.12, 12]} />
          <meshStandardMaterial color="#d4a26a" roughness={0.7} />
        </mesh>
      </group>
      {/* Bottom broken piece — drooping */}
      <group rotation={[0, 0, 0.6]} position={[0.12, -0.18, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
        </mesh>
        {/* Lit end glow */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.06, 12]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={1.5} roughness={0.3} />
        </mesh>
        <pointLight position={[0, -0.35, 0]} color="#ff4400" intensity={0.8} distance={0.8} />
      </group>
      {/* Break joint */}
      <mesh position={[0.04, 0.02, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.065, 0.065, 0.04, 12]} />
        <meshStandardMaterial color="#c8b8a0" roughness={1} />
      </mesh>
    </animated.group>
  )
}

// ─── ALCOHOL BOTTLE ───────────────────────────────────────────────────────────
function AlcoholBottle({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(Math.random() * 10)
  const springs = useEntrance(600)

  useFrame((_, delta) => {
    timeRef.current += delta * 0.5
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current + 1.5) * 0.07
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {/* Bottle body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.9, 16]} />
        <meshStandardMaterial
          color="#1a3a1a"
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Bottle shoulder */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.1, 0.22, 0.2, 16]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.05} metalness={0.1} transparent opacity={0.85} />
      </mesh>
      {/* Bottle neck */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 12]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.05} transparent opacity={0.85} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.1, 12]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.6, 16]} />
        <meshStandardMaterial color="#c88c1a" roughness={0} metalness={0} transparent opacity={0.5} />
      </mesh>
      {/* Bottle reflection/shine */}
      <pointLight position={[0.3, 0.3, 0.5]} color="#aaffaa" intensity={0.3} distance={1.5} />
    </animated.group>
  )
}

// ─── GUTKHA PACKETS ───────────────────────────────────────────────────────────
function GutkhaPackets({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)
  const springs = useEntrance(500)

  const packets = useMemo(() => [
    { pos: [-0.18, 0.05, 0.05] as [number, number, number], rot: [0.1, 0.3, -0.15] as [number, number, number], color: '#e63b00', scale: [0.22, 0.3, 0.04] as [number, number, number] },
    { pos: [0.1, -0.1, 0] as [number, number, number], rot: [0.05, -0.4, 0.2] as [number, number, number], color: '#cc2200', scale: [0.2, 0.28, 0.04] as [number, number, number] },
    { pos: [-0.05, -0.25, 0.06] as [number, number, number], rot: [-0.1, 0.5, 0.1] as [number, number, number], color: '#b81800', scale: [0.24, 0.26, 0.04] as [number, number, number] },
  ], [])

  useFrame((_, delta) => {
    timeRef.current += delta * 0.7
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current + 2) * 0.06
    }
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {packets.map((p, i) => (
        <group key={i} position={p.pos} rotation={p.rot}>
          {/* Packet body */}
          <mesh scale={p.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={p.color} roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Warning stripe */}
          <mesh scale={[p.scale[0] * 1.01, p.scale[1] * 0.15, p.scale[2] * 1.02]} position={[0, -p.scale[1] * 0.35, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffcc00" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </animated.group>
  )
}

// ─── DARK SMOKE PARTICLES ─────────────────────────────────────────────────────
function DarkSmokeParticles({ position, count = 120 }: { position: [number, number, number], count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.2
      pos[i * 3 + 1] = Math.random() * 3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 1] += 0.004
      pos[i3] += Math.sin(t * 0.5 + phases[i]) * 0.003
      if (pos[i3 + 1] > 2.5) pos[i3 + 1] = -0.5
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#444455" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── HEALTHY LUNGS (Right side) ───────────────────────────────────────────────
function HealthyLungs({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)
  const springs = useEntrance(300)

  useFrame((_, delta) => {
    timeRef.current += delta * 0.6
    if (groupRef.current) {
      // Breathing pulsation
      const breathe = 1 + Math.sin(timeRef.current * 1.2) * 0.04
      groupRef.current.scale.set(breathe, breathe, breathe)
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 0.5) * 0.07
    }
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {/* Left lobe — rosy healthy pink */}
      <mesh position={[-0.28, 0, 0]} scale={[0.55, 0.8, 0.4]}>
        <sphereGeometry args={[1, 22, 22]} />
        <MeshDistortMaterial
          color="#e8697a"
          roughness={0.3}
          metalness={0.05}
          distort={0.08}
          speed={2}
          emissive="#ff8c9e"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Right lobe */}
      <mesh position={[0.28, -0.1, 0]} scale={[0.45, 0.65, 0.35]}>
        <sphereGeometry args={[1, 22, 22]} />
        <MeshDistortMaterial
          color="#f07e8a"
          roughness={0.3}
          metalness={0.05}
          distort={0.1}
          speed={1.8}
          emissive="#ffaab8"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 0.75, 0]} scale={[0.08, 0.35, 0.08]}>
        <cylinderGeometry args={[1, 0.8, 1, 8]} />
        <meshStandardMaterial color="#d4607a" roughness={0.4} emissive="#ff8c9e" emissiveIntensity={0.1} />
      </mesh>
      {/* Healthy veins */}
      {[-0.2, 0, 0.2, -0.35, 0.32].map((x, i) => (
        <mesh key={i} position={[x, -0.1 + i * 0.07, 0.3]} rotation={[0, 0, i * 0.4]}>
          <cylinderGeometry args={[0.012, 0.006, 0.35 + i * 0.08, 4]} />
          <meshStandardMaterial color="#ff8fa0" roughness={0.4} emissive="#ff8fa0" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* Glow light from healthy lungs */}
      <pointLight color="#ff9aaa" intensity={0.6} distance={2.5} />
    </animated.group>
  )
}

// ─── GREEN LEAVES ─────────────────────────────────────────────────────────────
function GreenLeaves({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)
  const springs = useEntrance(500)

  const leaves = useMemo(() => Array.from({ length: 9 }, (_, i) => ({
    pos: [
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 0.6,
    ] as [number, number, number],
    rot: [Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5] as [number, number, number],
    scale: 0.12 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.6,
    color: ['#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac'][i % 5],
  })), [])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (!groupRef.current) return
    leaves.forEach((leaf, i) => {
      const child = groupRef.current.children[i] as THREE.Group
      if (!child) return
      child.rotation.z = leaf.rot[2] + Math.sin(timeRef.current * leaf.speed + leaf.phase) * 0.25
      child.position.y = leaf.pos[1] + Math.sin(timeRef.current * leaf.speed * 0.7 + leaf.phase) * 0.12
    })
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {leaves.map((leaf, i) => (
        <group key={i} position={leaf.pos} rotation={leaf.rot}>
          {/* Leaf — teardrop from ellipse */}
          <mesh scale={[leaf.scale, leaf.scale * 1.6, 0.01]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={leaf.color}
              roughness={0.4}
              metalness={0}
              emissive={leaf.color}
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Leaf stem */}
          <mesh position={[0, -leaf.scale * 1.2, 0]} scale={[0.01, leaf.scale * 0.8, 0.01]}>
            <cylinderGeometry args={[1, 1, 1, 4]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </animated.group>
  )
}

// ─── BLUE ENERGY ORBS ────────────────────────────────────────────────────────
function EnergyOrbs({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)
  const springs = useEntrance(700)

  const orbs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    radius: 0.8 + Math.random() * 1.2,
    angle: (i / 7) * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.4,
    yOffset: (Math.random() - 0.5) * 1.2,
    size: 0.05 + Math.random() * 0.12,
    color: ['#38bdf8', '#7dd3fc', '#0ea5e9', '#60a5fa', '#93c5fd'][i % 5],
    phase: Math.random() * Math.PI * 2,
  })), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    timeRef.current = clock.getElapsedTime()
    orbs.forEach((orb, i) => {
      const child = groupRef.current.children[i] as THREE.Mesh
      if (!child) return
      const t = timeRef.current * orb.speed + orb.angle
      child.position.x = Math.cos(t) * orb.radius
      child.position.z = Math.sin(t) * orb.radius * 0.4
      child.position.y = orb.yOffset + Math.sin(t * 1.3 + orb.phase) * 0.3
    })
  })

  return (
    <animated.group ref={groupRef} position={position} scale={springs.scale as unknown as number}>
      {orbs.map((orb, i) => (
        <mesh key={i}>
          <sphereGeometry args={[orb.size, 10, 10]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={2}
            roughness={0}
            metalness={0.1}
          />
        </mesh>
      ))}
    </animated.group>
  )
}

// ─── CLEAN AIR PARTICLES (right side, upward-moving light particles) ──────────
function CleanAirParticles({ position, count = 150 }: { position: [number, number, number], count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.4
      pos[i * 3 + 1] = Math.random() * 3.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.4
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 1] += 0.006
      pos[i3] += Math.sin(t * 0.6 + phases[i]) * 0.002
      if (pos[i3 + 1] > 3) pos[i3 + 1] = -0.5
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#93c5fd" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── CENTER FLOATING LOGO ─────────────────────────────────────────────────────
function CenterLogo() {
  const groupRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  const springs = useSpring({
    scale: 1,
    from: { scale: 0 },
    delay: 800,
    config: { tension: 60, friction: 12 },
  })

  useFrame((_, delta) => {
    timeRef.current += delta * 0.8
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(timeRef.current) * 0.12
      groupRef.current.rotation.y += delta * 0.1
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.3
      coreRef.current.rotation.z += delta * 0.2
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.5
    }
  })

  return (
    <animated.group ref={groupRef} position={[0, 0.3, 0.5]} scale={springs.scale as unknown as number}>
      {/* Glowing core icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.45, 1]} />
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#5b21b6"
          emissiveIntensity={1.2}
          roughness={0.05}
          metalness={0.9}
          distort={0.25}
          speed={3}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.7, 0.018, 8, 64]} />
        <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={1.5} roughness={0} metalness={1} />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[0.85, 0.012, 8, 64]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1.2} roughness={0} metalness={1} />
      </mesh>

      {/* Glow lights */}
      <pointLight color="#7c3aed" intensity={2.5} distance={3} />
      <pointLight color="#38bdf8" intensity={1} distance={2.5} position={[0, 0.5, 0]} />

      {/* HTML Label — always faces camera */}
      <Html center distanceFactor={4} position={[0, -0.9, 0]}>
        <div className="text-center pointer-events-none select-none">
          <div
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: '800',
              letterSpacing: '0.12em',
              color: '#c4b5fd',
              textShadow: '0 0 20px rgba(124,58,237,0.9), 0 0 40px rgba(124,58,237,0.5)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}
          >
            NashaMukt AI
          </div>
          <div
            style={{
              fontSize: '8px',
              fontWeight: '500',
              color: '#94a3b8',
              letterSpacing: '0.2em',
              marginTop: '3px',
              textTransform: 'uppercase',
            }}
          >
            Freedom · Health · Hope
          </div>
        </div>
      </Html>
    </animated.group>
  )
}

// ─── DIVIDER RAY ──────────────────────────────────────────────────────────────
function DividerRay() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const springs = useSpring({
    scaleY: 1,
    opacity: 1,
    from: { scaleY: 0, opacity: 0 },
    delay: 600,
    config: { tension: 50, friction: 20 },
  })

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 1.5) * 0.3
  })

  return (
    <animated.mesh
      ref={meshRef}
      position={[0, 0.5, 0]}
      scale-y={springs.scaleY as unknown as number}
    >
      <cylinderGeometry args={[0.006, 0.006, 5, 8]} />
      <meshStandardMaterial
        color="#818cf8"
        emissive="#6366f1"
        emissiveIntensity={0.5}
        transparent
        opacity={0.5}
      />
    </animated.mesh>
  )
}

// ─── SIDE LABELS ──────────────────────────────────────────────────────────────
function SideLabel({ position, text, color }: { position: [number, number, number], text: string, color: string }) {
  return (
    <Html center distanceFactor={5} position={position}>
      <div
        className="pointer-events-none select-none text-center"
        style={{
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color,
          textShadow: `0 0 12px ${color}`,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </Html>
  )
}

// ─── SLOW ROTATING CAMERA ────────────────────────────────────────────────────
function CinematicCamera() {
  const mouse = useMouseParallax()
  const timeRef = useRef(0)

  useFrame(({ camera: cam }, delta) => {
    timeRef.current += delta * 0.12

    // Slow orbital sway — gentle left-right
    const swayX = Math.sin(timeRef.current) * 0.4
    const swayY = Math.cos(timeRef.current * 0.6) * 0.12

    // Mouse parallax layer
    const targetX = swayX + mouse.current.x * 0.35
    const targetY = swayY + mouse.current.y * 0.2

    cam.position.x += (targetX - cam.position.x) * 0.025
    cam.position.y += (targetY - cam.position.y) * 0.025
    cam.position.z += (6.2 - cam.position.z) * 0.03
    cam.lookAt(0, 0.2, 0)
  })

  return null
}

// ─── AMBIENT BACKGROUND PARTICLES ────────────────────────────────────────────
function AmbientParticles({ count = 400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3
    }
    return { positions: pos }
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#6366f1" transparent opacity={0.3} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── FULL SCENE CONTENT ───────────────────────────────────────────────────────
function TransformationSceneContent() {
  const { maxParticles, tier } = usePerformanceDetector()
  const particleScale = tier === 'high' ? 1 : 0.6

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[-5, 5, 3]} intensity={0.6} color="#c084fc" />
      <directionalLight position={[5, 5, 3]} intensity={0.6} color="#38bdf8" />
      <hemisphereLight args={['#1e1b4b', '#0f172a', 0.4]} />

      {/* Camera */}
      <CinematicCamera />

      {/* Stars background */}
      {tier !== 'low' && <Stars radius={30} depth={20} count={Math.min(2000, maxParticles)} factor={3} saturation={0.5} fade speed={0.5} />}

      {/* Ambient particles */}
      <AmbientParticles count={Math.round(300 * particleScale)} />

      {/* ── LEFT SIDE: Addiction ─────────────────────── */}
      <group position={[-3.2, 0, 0]}>
        <DarkLungs position={[0, 0.8, 0]} />
        <BrokenCigarette position={[-0.8, -0.5, 0.3]} />
        <AlcoholBottle position={[0.7, -1.0, 0]} />
        <GutkhaPackets position={[-0.2, -1.1, 0.2]} />
        <DarkSmokeParticles position={[0, -0.5, 0]} count={Math.round(100 * particleScale)} />
        <SideLabel position={[0, -2.2, 0]} text="Before" color="#ef4444" />
        {/* Dim red light casting a shadow feel */}
        <pointLight color="#7f1d1d" intensity={0.5} distance={4} position={[0, 0, 1]} />
      </group>

      {/* ── CENTER: NashaMukt AI ─────────────────────── */}
      <CenterLogo />
      <DividerRay />
      <Sparkles count={30} scale={2.5} size={1.2} speed={0.2} color="#a78bfa" opacity={0.7} />

      {/* ── RIGHT SIDE: Health ───────────────────────── */}
      <group position={[3.2, 0, 0]}>
        <HealthyLungs position={[0, 0.8, 0]} />
        <GreenLeaves position={[0, -0.3, 0]} />
        <EnergyOrbs position={[0, 0.5, 0]} />
        <CleanAirParticles position={[0, -0.5, 0]} count={Math.round(120 * particleScale)} />
        <SideLabel position={[0, -2.2, 0]} text="After" color="#22c55e" />
        {/* Warm blue-green glow */}
        <pointLight color="#0d9488" intensity={0.7} distance={4} position={[0, 0, 1]} />
      </group>
    </>
  )
}

// ─── EXPORTED COMPONENT ───────────────────────────────────────────────────────
export function TransformationHeroScene() {
  const { tier } = usePerformanceDetector()
  if (tier === 'low') return null

  return (
    <SceneWrapper
      className="absolute inset-0 w-full h-full"
      cameraPosition={[0, 0.5, 6.5]}
      fov={65}
    >
      <TransformationSceneContent />
    </SceneWrapper>
  )
}
