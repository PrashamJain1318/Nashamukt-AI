import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, OrbitControls } from '@react-three/drei'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface OrganProps {
  opacity: number
  isActive: boolean
}

// ─── 1. PROCEDURAL HEART MODEL (Stages 0 & 6) ──────────────────────────────
function HeartModel({ opacity }: OrganProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (opacity < 0.01) return
    const t = state.clock.getElapsedTime()
    
    // Heartbeat pulse calculation (double pulse wave)
    const wave = Math.pow(Math.sin(t * 3.8), 6) * 0.14 + Math.pow(Math.sin(t * 3.8 - 0.25), 6) * 0.06
    const scale = 1.0 + wave
    groupRef.current.scale.setScalar(scale)

    // Inner mesh wobbling
    innerRef.current.rotation.y = t * 0.15
  })

  return (
    <group ref={groupRef}>
      {/* Central Heart Core (Stylized Dual-Sphere overlapping mesh) */}
      <group position={[0, -0.2, 0]}>
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[0.85, 3]} />
          <MeshDistortMaterial
            color="#f43f5e"
            emissive="#881337"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.65}
            distort={0.25}
            speed={2}
            transparent
            opacity={opacity}
          />
        </mesh>
        
        {/* Left Ventricle Bulb */}
        <mesh position={[-0.32, 0.2, 0]} scale={[0.85, 0.9, 0.85]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#e11d48"
            roughness={0.2}
            metalness={0.4}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Right Ventricle Bulb */}
        <mesh position={[0.32, 0.2, 0]} scale={[0.85, 0.9, 0.85]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#be123c"
            roughness={0.2}
            metalness={0.4}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Aorta/Artery Pipes */}
        <mesh position={[0.1, 0.65, -0.15]} rotation={[0.1, 0, -0.25]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 16]} />
          <meshStandardMaterial
            color="#be123c"
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
        <mesh position={[-0.15, 0.72, -0.1]} rotation={[0.2, 0, 0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.45, 16]} />
          <meshStandardMaterial
            color="#9f1239"
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* Orbiting Circulatory Rings */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[1.5, 0.015, 8, 64]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={opacity * 0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, -Math.PI / 4, 0]}>
        <torusGeometry args={[1.7, 0.01, 8, 64]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={opacity * 0.2} />
      </mesh>
    </group>
  )
}

// ─── 2. FLOWING BLOOD CELLS & TOXINS (Stages 1 & 2) ───────────────────────
function BloodStreamModel({ opacity, isToxinClearing }: OrganProps & { isToxinClearing: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const cellCount = 10

  // Blood cells configuration
  const cells = useMemo(() => {
    return Array.from({ length: cellCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 4.0,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ),
      scale: 0.16 + Math.random() * 0.12,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      speed: 0.4 + Math.random() * 0.6,
    }))
  }, [])

  // Floating CO / Oxygen molecules
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.0,
        (Math.random() - 0.5) * 1.5
      ),
      type: i % 2 === 0 ? 'CO' : 'O2',
      speed: 0.8 + Math.random() * 1.2,
    }))
  }, [])

  useFrame((_, delta) => {
    if (opacity < 0.01) return
    const cellsGroup = groupRef.current.children

    // Move cells left to right along flow stream
    for (let i = 0; i < cellCount; i++) {
      const cellMesh = cellsGroup[i] as THREE.Mesh
      if (!cellMesh) continue

      cellMesh.position.x += cells[i].speed * delta * 1.2
      cellMesh.rotation.x += delta * 0.4
      cellMesh.rotation.y += delta * 0.2

      // Recycle cells
      if (cellMesh.position.x > 2.5) {
        cellMesh.position.x = -2.5
      }
    }

    // Move CO (grey) & O2 (blue) molecules
    const partStartIndex = cellCount
    for (let i = 0; i < 15; i++) {
      const partMesh = cellsGroup[partStartIndex + i] as THREE.Mesh
      if (!partMesh) continue

      const p = particles[i]
      if (p.type === 'CO' && isToxinClearing) {
        // Disperse toxins: move up and away
        partMesh.position.y += p.speed * delta * 2.0
        partMesh.position.x += delta * 0.5
        if (partMesh.material instanceof THREE.Material) {
          partMesh.material.opacity = Math.max(0, opacity * (1 - (partMesh.position.y + 1) / 2))
        }
      } else {
        // Normal oxygen drift flow
        partMesh.position.x += p.speed * delta * 1.5
        if (partMesh.position.x > 2.5) {
          partMesh.position.x = -2.5
          partMesh.position.y = (Math.random() - 0.5) * 1.8
        }
        if (partMesh.material instanceof THREE.Material) {
          partMesh.material.opacity = opacity
        }
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* 1. Red Blood Cells (squashed disks) */}
      {cells.map((c, idx) => (
        <mesh key={idx} position={c.pos} scale={[c.scale, c.scale * 0.4, c.scale]} rotation={c.rotation}>
          <cylinderGeometry args={[1, 1, 0.5, 16]} />
          <meshStandardMaterial
            color={isToxinClearing ? '#dc2626' : '#991b1b'} // Brighter red when clear
            roughness={0.12}
            metalness={0.4}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* 2. Floating Gas Molecules */}
      {particles.map((p, idx) => {
        const isCO = p.type === 'CO'
        const color = isCO ? '#4b5563' : '#06b6d4' // Grey CO vs Cyan/Blue O2
        const emissive = isCO ? '#111827' : '#0891b2'

        return (
          <mesh key={idx} position={p.pos}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isCO ? 0.1 : 1.2}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── 3. GLOWING NEURAL BRAIN NETWORK (Stages 3 & 5) ───────────────────────
function BrainModel({ opacity, isResetting }: OrganProps & { isResetting: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const nodeCount = 34
  const maxDistance = 1.6

  // Generate nodes shaped like a brain (two ellipsoidal lobes)
  const [nodePositions, connections] = useMemo(() => {
    const positions: THREE.Vector3[] = []
    
    for (let i = 0; i < nodeCount; i++) {
      const isLeftLobe = i % 2 === 0
      const offsetX = isLeftLobe ? -0.45 : 0.45
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() - 0.5) * 2)
      // Brain shaped bounds
      const rx = 0.4 + Math.random() * 0.35
      const ry = 0.5 + Math.random() * 0.45
      const rz = 0.4 + Math.random() * 0.35

      positions.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * rx + offsetX,
          Math.sin(phi) * Math.sin(theta) * ry - 0.1,
          Math.cos(phi) * rz
        )
      )
    }

    // Connect close neighbors
    const conns: { from: number; to: number }[] = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = positions[i].distanceTo(positions[j])
        if (dist < maxDistance) {
          conns.push({ from: i, to: j })
        }
      }
    }

    return [positions, conns]
  }, [])

  // Pulses traveling along neural synapses
  const pulses = useMemo(() => {
    if (connections.length === 0) return []
    return Array.from({ length: 10 }, () => {
      const randomConn = connections[Math.floor(Math.random() * connections.length)]
      return {
        start: randomConn.from,
        end: randomConn.to,
        progress: Math.random(),
        speed: 0.8 + Math.random() * 1.5,
      }
    })
  }, [connections])

  const linePositions = useMemo(() => {
    const arr = []
    for (const conn of connections) {
      const p1 = nodePositions[conn.from]
      const p2 = nodePositions[conn.to]
      arr.push(p1.x, p1.y, p1.z)
      arr.push(p2.x, p2.y, p2.z)
    }
    return new Float32Array(arr)
  }, [connections, nodePositions])

  const nodeFlatPositions = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3)
    nodePositions.forEach((pos, idx) => {
      arr[idx * 3] = pos.x
      arr[idx * 3 + 1] = pos.y
      arr[idx * 3 + 2] = pos.z
    })
    return arr
  }, [nodePositions])

  // Animate brain spin & pulses
  useFrame((state, delta) => {
    if (opacity < 0.01) return
    const t = state.clock.getElapsedTime()
    
    groupRef.current.rotation.y = t * 0.18
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.08

    // Animate individual pulse meshes
    const pulseMeshes = groupRef.current.children.slice(2) // Skip lines and points meshes
    const pulseCount = pulses.length

    for (let i = 0; i < pulseCount; i++) {
      const pulseMesh = pulseMeshes[i] as THREE.Mesh
      if (!pulseMesh) continue

      const p = pulses[i]
      p.progress += delta * p.speed * (isResetting ? 1.8 : 1.0)
      
      if (p.progress >= 1.0) {
        p.progress = 0
        p.start = p.end
        // Find next connected path
        const nextCandidates = connections
          .filter((c) => c.from === p.start || c.to === p.start)
          .map((c) => (c.from === p.start ? c.to : c.from))
        
        if (nextCandidates.length > 0) {
          p.end = nextCandidates[Math.floor(Math.random() * nextCandidates.length)]
        } else {
          p.end = Math.floor(Math.random() * nodeCount)
        }
      }

      // Smooth position LERP
      const p1 = nodePositions[p.start]
      const p2 = nodePositions[p.end]
      pulseMesh.position.lerpVectors(p1, p2, p.progress)

      if (pulseMesh.material instanceof THREE.Material) {
        pulseMesh.material.opacity = opacity
      }
    }
  })

  // Set colors: dopamine reset (golden/violet) vs initial heightening (cyan)
  const mainColor = isResetting ? '#e9d5ff' : '#a5f3fc' // Violet-white vs Cyan-white
  const pulseColor = isResetting ? '#d8b4fe' : '#67e8f9' // Purple vs Cyan
  const glowColor = isResetting ? '#c084fc' : '#22d3ee'

  return (
    <group ref={groupRef}>
      {/* Synaptic line connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={mainColor}
          transparent
          opacity={opacity * 0.25}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Synapse nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodeFlatPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={mainColor}
          size={0.14}
          transparent
          opacity={opacity * 0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Traveling electrical impulses */}
      {pulses.map((_, idx) => (
        <mesh key={idx}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial
            color={pulseColor}
            transparent
            opacity={opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Inner brain glow sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={opacity * 0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// ─── 4. RESPIRATORY HEALTHY LUNGS MODEL (Stage 4) ─────────────────────────
function LungsModel({ opacity }: OrganProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const leftLobeRef = useRef<THREE.Group>(null!)
  const rightLobeRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (opacity < 0.01) return
    const t = state.clock.getElapsedTime()
    
    // Slow deep respiratory cycle (breathing)
    const breath = 1.0 + Math.sin(t * 1.6) * 0.08
    
    leftLobeRef.current.scale.set(breath, breath * 1.1, breath)
    rightLobeRef.current.scale.set(breath, breath * 1.1, breath)

    // Slight floating tilt
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1
  })

  const lobeMaterial = (
    <meshStandardMaterial
      color="#ec4899" // Healthy pink lungs
      roughness={0.2}
      metalness={0.2}
      transparent
      opacity={opacity}
    />
  )

  return (
    <group ref={groupRef}>
      {/* Central trachea structure */}
      <group position={[0, 0.4, 0]}>
        {/* Windpipe */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.7, 16]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.5} transparent opacity={opacity} />
        </mesh>
        {/* Left Bronchial Tube */}
        <mesh position={[-0.18, 0.05, 0]} rotation={[0, 0, 0.45]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.5} transparent opacity={opacity} />
        </mesh>
        {/* Right Bronchial Tube */}
        <mesh position={[0.18, 0.05, 0]} rotation={[0, 0, -0.45]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.5} transparent opacity={opacity} />
        </mesh>
      </group>

      {/* Left Lung Lobe */}
      <group ref={leftLobeRef} position={[-0.52, -0.15, 0]}>
        {/* Upper segment */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          {lobeMaterial}
        </mesh>
        {/* Middle segment */}
        <mesh position={[0.08, -0.05, 0]} scale={[1.1, 1.2, 1.0]}>
          <sphereGeometry args={[0.46, 32, 32]} />
          {lobeMaterial}
        </mesh>
        {/* Lower segment */}
        <mesh position={[-0.05, -0.4, 0]} scale={[1.1, 0.9, 1.0]}>
          <sphereGeometry args={[0.44, 32, 32]} />
          {lobeMaterial}
        </mesh>
      </group>

      {/* Right Lung Lobe */}
      <group ref={rightLobeRef} position={[0.52, -0.15, 0]}>
        {/* Upper segment */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          {lobeMaterial}
        </mesh>
        {/* Middle segment */}
        <mesh position={[-0.08, -0.05, 0]} scale={[1.1, 1.2, 1.0]}>
          <sphereGeometry args={[0.46, 32, 32]} />
          {lobeMaterial}
        </mesh>
        {/* Lower segment */}
        <mesh position={[0.05, -0.4, 0]} scale={[1.1, 0.9, 1.0]}>
          <sphereGeometry args={[0.44, 32, 32]} />
          {lobeMaterial}
        </mesh>
      </group>
    </group>
  )
}

// ─── 5. SMOOTH CAMERA DIRECTOR ──────────────────────────────────────────────
interface DirectorProps {
  activeIndex: number
}

function CameraDirector({ activeIndex }: DirectorProps) {
  useFrame((state) => {
    const targetPos = new THREE.Vector3()
    const targetLookAt = new THREE.Vector3(0, 0, 0)

    // Dynamic camera offsets for specific stages
    switch (activeIndex) {
      case 0: // 20m Heart
        targetPos.set(0, 0.2, 3.4)
        break
      case 1: // 8h Blood
      case 2: // 24h Clean Blood
        targetPos.set(0.6, 0.4, 3.2)
        break
      case 3: // 1w Sensory brain
        targetPos.set(-0.5, 0.2, 2.8)
        break
      case 4: // 1m Breathing lungs
        targetPos.set(0, 0.4, 3.6)
        break
      case 5: // 3m Dopamine Brain
        targetPos.set(0.4, -0.2, 2.5)
        break
      case 6: // 1y Combined body vitality
        targetPos.set(0.0, 0.3, 4.2)
        break
      default:
        targetPos.set(0, 0, 3.5)
    }

    // Smooth LERP camera transitions
    state.camera.position.lerp(targetPos, 0.05)
    
    const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position)
    currentLook.lerp(targetLookAt, 0.05)
    state.camera.lookAt(currentLook)
  })

  return null
}

// ─── MAIN 3D TIMELINE SCENE CONTAINER ────────────────────────────────────────
interface Health3DSceneProps {
  activeIndex: number
}

export function Health3DScene({ activeIndex = 0 }: Health3DSceneProps) {
  const { tier } = usePerformanceDetector()

  // Calculate target opacities for morphing components
  // index mapping: 0=heart, 1=blood(dirty), 2=blood(clean), 3=brain, 4=lungs, 5=brain(reset), 6=combined(heart+lungs)
  const targetOpacities = useMemo(() => {
    const ops = [0, 0, 0, 0, 0, 0, 0] // [heart, blood_dirty, blood_clean, brain_sensory, lungs, brain_dopamine, combined]
    if (activeIndex >= 0 && activeIndex < 7) {
      ops[activeIndex] = 1.0
    }
    return ops
  }, [activeIndex])

  // Low performance fallback (renders simple flat vector telemetry gauges)
  if (tier === 'low') {
    const states = [
      { name: "Heart Pulse", desc: "Heart rate returning to normal.", color: "text-rose-400" },
      { name: "Bloodstream Flow", desc: "Carbon monoxide dispersing.", color: "text-red-400" },
      { name: "Blood Cleared", desc: "Oxygenation levels normal.", color: "text-red-300" },
      { name: "Sensory Networks", desc: "Taste and smell receptors heightening.", color: "text-cyan-300" },
      { name: "Respiratory Lungs", desc: "Bronchial relaxation & capacity boost.", color: "text-pink-400" },
      { name: "Dopamine Reset", desc: "Neurotransmitter balance restoring.", color: "text-purple-400" },
      { name: "Combined Vitality", desc: "Full systemic recovery achieved.", color: "text-amber-400" },
    ]
    const activeState = states[activeIndex] || states[0]

    return (
      <div className="w-full h-full bg-[#030712] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 border-4 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
          <div className="w-24 h-24 border border-dashed border-white/10 rounded-full flex items-center justify-center">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${activeState.color}`}>STAGE {activeIndex + 1}</span>
          </div>
        </div>
        <h3 className={`mt-6 font-bold text-lg ${activeState.color}`}>{activeState.name}</h3>
        <p className="text-xs text-muted-foreground mt-2 max-w-[240px] leading-relaxed">{activeState.desc}</p>
      </div>
    )
  }

  // Particle color matching index
  const particleColors = ['#f43f5e', '#ef4444', '#ef4444', '#06b6d4', '#ec4899', '#a855f7', '#fbbf24']
  const currentParticleColor = particleColors[activeIndex] || '#06b6d4'

  return (
    <div className="relative w-full h-full bg-black/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden group/canvas">
      {/* HUD Telemetry styling overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono text-[9px] text-cyan-400/60 uppercase tracking-widest">
        BIO-LINK STATE: ACTIVE // ACTIVE_STAGE: {activeIndex}
      </div>
      <div className="absolute inset-0 bg-hologram-grid opacity-5 pointer-events-none" />

      {/* Viewport framing ticks */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 group-hover/canvas:border-cyan-500/30 transition-all duration-500" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 group-hover/canvas:border-cyan-500/30 transition-all duration-500" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/10 group-hover/canvas:border-cyan-500/30 transition-all duration-500" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/10 group-hover/canvas:border-cyan-500/30 transition-all duration-500" />

      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.2, 3.4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#010309']} />
        
        {/* Soft environmental lighting */}
        <ambientLight intensity={0.25} />
        <pointLight position={[2, 3, 2]} intensity={1.5} color={currentParticleColor} />
        <pointLight position={[-2, -3, -2]} intensity={0.5} color="#06b6d4" />

        {/* Heart Models (Stage 0: 20m, Stage 6: Combined/1y) */}
        <group visible={targetOpacities[0] > 0.01 || targetOpacities[6] > 0.01}>
          <HeartModel
            opacity={Math.max(targetOpacities[0], targetOpacities[6])}
            isActive={activeIndex === 0 || activeIndex === 6}
          />
        </group>

        {/* Blood Cells Streams (Stage 1: 8h with toxins, Stage 2: 24h clean) */}
        <group visible={targetOpacities[1] > 0.01 || targetOpacities[2] > 0.01}>
          <BloodStreamModel
            opacity={Math.max(targetOpacities[1], targetOpacities[2])}
            isActive={activeIndex === 1 || activeIndex === 2}
            isToxinClearing={activeIndex === 2}
          />
        </group>

        {/* Brain Neural Networks (Stage 3: 1w sensory, Stage 5: 3m dopamine reset) */}
        <group visible={targetOpacities[3] > 0.01 || targetOpacities[5] > 0.01}>
          <BrainModel
            opacity={Math.max(targetOpacities[3], targetOpacities[5])}
            isActive={activeIndex === 3 || activeIndex === 5}
            isResetting={activeIndex === 5}
          />
        </group>

        {/* Healthy Breathing Lungs (Stage 4: 1m, Stage 6: Combined/1y) */}
        <group visible={targetOpacities[4] > 0.01 || targetOpacities[6] > 0.01}>
          <LungsModel
            opacity={Math.max(targetOpacities[4], targetOpacities[6])}
            isActive={activeIndex === 4 || activeIndex === 6}
          />
        </group>

        {/* Cinematic camera system */}
        <CameraDirector activeIndex={activeIndex} />

        {/* Sparkles background layer matching organ color */}
        <Sparkles
          count={60}
          scale={5}
          size={0.8}
          speed={0.15}
          color={currentParticleColor}
          opacity={0.35}
        />

        {/* Orbitcontrols allowing user manual pan, but return is handled by Director */}
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.7} minPolarAngle={Math.PI / 2.3} />
      </Canvas>
    </div>
  )
}
