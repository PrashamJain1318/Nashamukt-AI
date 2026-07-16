import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, Text } from '@react-three/drei'
import { usePerformanceDetector } from '@/hooks/three/usePerformanceDetector'
import * as THREE from 'three'

interface AssistantCoreProps {
  mode: 'idle' | 'listening' | 'speaking' | 'thinking'
}

// Global colors matching states
const colors = {
  idle: '#06b6d4',      // Neon Cyan
  listening: '#f97316', // Neon Orange
  speaking: '#10b981',  // Neon Emerald
  thinking: '#a855f7',  // Neon Purple
}

// ─── 1. Holographic Floor Grid ──────────────────────────────────────────────
function FloorScannerGrid({ mode }: AssistantCoreProps) {
  const gridRef = useRef<THREE.Group>(null!)
  const currentColor = colors[mode] || colors.idle

  useFrame((state) => {
    // Floor grid rotates slowly to feel active
    gridRef.current.rotation.z = state.clock.getElapsedTime() * 0.05
  })

  // Rising scanner light columns
  const columns = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 2.5 + Math.random() * 1.5,
      height: 2.0 + Math.random() * 3.0,
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI,
    }))
  }, [])

  return (
    <group position={[0, -2.5, 0]}>
      {/* Radial floor grid */}
      <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]}>
        <polarGridHelper
          args={[6, 16, 8, 64, currentColor, currentColor]}
          material-opacity={0.25}
          material-transparent={true}
        />
        {/* Flat outer technical ring */}
        <mesh>
          <ringGeometry args={[5.8, 6.0, 64]} />
          <meshBasicMaterial color={currentColor} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Volumetric scanner columns */}
      {columns.map((col, idx) => (
        <ScannerColumn
          key={idx}
          angle={col.angle}
          radius={col.radius}
          height={col.height}
          speed={col.speed}
          phase={col.phase}
          color={currentColor}
        />
      ))}
    </group>
  )
}

interface ScannerColumnProps {
  angle: number
  radius: number
  height: number
  speed: number
  phase: number
  color: string
}

function ScannerColumn({ angle, radius, height, speed, phase, color }: ScannerColumnProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Columns move up and down, pulsing in opacity
    const offset = Math.sin(t * speed + phase) * 0.5 + 0.5
    meshRef.current.position.y = (height / 2) + offset * 0.5
    if (meshRef.current.material instanceof THREE.Material) {
      meshRef.current.material.opacity = (0.04 + offset * 0.08)
    }
  })

  return (
    <mesh ref={meshRef} position={[x, height / 2, z]}>
      <cylinderGeometry args={[0.08, 0.15, height, 16, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}


// ─── 2. Holographic AI Assistant Core ────────────────────────────────────────
function AssistantCore({ mode }: AssistantCoreProps) {
  const coreRef = useRef<THREE.Group>(null!)
  const innerOrbRef = useRef<THREE.Mesh>(null!)
  const ringXRef = useRef<THREE.Mesh>(null!)
  const ringYRef = useRef<THREE.Mesh>(null!)
  const ringZRef = useRef<THREE.Mesh>(null!)

  const currentColor = colors[mode] || colors.idle

  // Floating bobbing motion for the assistant core
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    
    // Smooth floating
    coreRef.current.position.y = Math.sin(t * 1.5) * 0.15

    // Multi-speed ring rotations based on active mode
    const speed = mode === 'thinking' ? 2.8 : mode === 'listening' ? 1.8 : mode === 'speaking' ? 1.4 : 0.6
    
    ringXRef.current.rotation.x += delta * 0.4 * speed
    ringXRef.current.rotation.y += delta * 0.25 * speed

    ringYRef.current.rotation.y -= delta * 0.3 * speed
    ringYRef.current.rotation.z += delta * 0.15 * speed

    ringZRef.current.rotation.z += delta * 0.5 * speed
    ringZRef.current.rotation.x -= delta * 0.2 * speed

    // Dynamic scale jittering to represent holographic projection stability
    let baseScale = 1.0
    if (mode === 'thinking') {
      baseScale = 1.1 + Math.sin(t * 15) * 0.03
    } else if (mode === 'speaking') {
      baseScale = 1.05 + Math.sin(t * 8) * 0.05
    } else if (mode === 'listening') {
      baseScale = 0.95 + Math.sin(t * 5) * 0.02
    } else {
      baseScale = 1.0 + Math.sin(t * 1.2) * 0.02
    }
    
    // Add rare sudden glitch jitter (projection blink)
    const isGlitching = Math.random() > (mode === 'thinking' ? 0.96 : 0.99)
    const glitchScale = isGlitching ? 0.85 + Math.random() * 0.3 : 1
    
    if (innerOrbRef.current) {
      innerOrbRef.current.scale.setScalar(baseScale * glitchScale)
    }
  })

  return (
    <group ref={coreRef}>
      {/* Central wobbly energy orb */}
      <mesh ref={innerOrbRef}>
        <icosahedronGeometry args={[0.9, 5]} />
        <MeshDistortMaterial
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={mode === 'thinking' ? 1.8 : mode === 'speaking' ? 1.4 : 0.9}
          roughness={0.1}
          metalness={0.8}
          distort={mode === 'thinking' ? 0.55 : mode === 'speaking' ? 0.4 : 0.25}
          speed={mode === 'thinking' ? 3.0 : mode === 'speaking' ? 2.0 : 1.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orbiting Gyroscope Rings */}
      <mesh ref={ringXRef}>
        <torusGeometry args={[1.4, 0.02, 8, 64]} />
        <meshBasicMaterial color={currentColor} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ringYRef}>
        <torusGeometry args={[1.7, 0.015, 8, 64]} />
        <meshBasicMaterial color={currentColor} transparent opacity={0.35} />
      </mesh>
      <mesh ref={ringZRef}>
        <torusGeometry args={[2.0, 0.01, 8, 64]} />
        <meshBasicMaterial color={currentColor} transparent opacity={0.2} />
      </mesh>

      {/* Technical tick marks represented by wireframe rings */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.03, 2, 8]} />
        <meshBasicMaterial color={currentColor} wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  )
}


// ─── 3. Glowing Neural Network with Active Signal Pulses ────────────────────
interface SignalPulse {
  startIndex: number
  endIndex: number
  progress: number
  speed: number
  position: THREE.Vector3
}

function NeuralNetwork({ mode }: AssistantCoreProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const currentColor = colors[mode] || colors.idle

  const nodeCount = 38
  const maxDistance = 2.8

  // Generate stable neural network node structure
  const [nodePositions, connections] = useMemo(() => {
    const positions: THREE.Vector3[] = []
    
    // Place nodes in a spherical cluster, slightly offset behind the assistant
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() - 0.5) * 2)
      const dist = 3.0 + Math.random() * 2.8
      
      positions.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * dist * 1.5,
          Math.sin(phi) * Math.sin(theta) * dist - 0.5,
          Math.cos(phi) * dist - 3.0 // cluster mainly in back half of screen
        )
      )
    }

    // Connect nodes that are within maxDistance
    const conns: { from: number; to: number }[] = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (positions[i].distanceTo(positions[j]) < maxDistance) {
          conns.push({ from: i, to: j })
        }
      }
    }

    return [positions, conns]
  }, [])

  // Setup active flying signal pulses
  const [pulses, setPulses] = useState<SignalPulse[]>([])

  useEffect(() => {
    // Create initial signals
    if (connections.length === 0) return
    const initialPulses: SignalPulse[] = Array.from({ length: 12 }, () => {
      const randomConn = connections[Math.floor(Math.random() * connections.length)]
      return {
        startIndex: randomConn.from,
        endIndex: randomConn.to,
        progress: Math.random(),
        speed: 0.6 + Math.random() * 0.8,
        position: new THREE.Vector3(),
      }
    })
    setPulses(initialPulses)
  }, [connections])

  // Flat lines representation for Three.js render
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

  // Nodes position array
  const nodeFlatPositions = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3)
    nodePositions.forEach((pos, idx) => {
      arr[idx * 3] = pos.x
      arr[idx * 3 + 1] = pos.y
      arr[idx * 3 + 2] = pos.z
    })
    return arr
  }, [nodePositions])

  // Animate signals traveling along lines
  useFrame((state, delta) => {
    const timeScale = mode === 'thinking' ? 2.5 : mode === 'speaking' ? 1.4 : 0.8
    
    // Slow rotational drift of the entire network
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05

    // Progress signals along connected paths
    setPulses((prevPulses) =>
      prevPulses.map((pulse) => {
        let p = pulse.progress + delta * pulse.speed * timeScale
        let start = pulse.startIndex
        let end = pulse.endIndex

        if (p >= 1.0) {
          // When signal reaches destination, route to a new node connected to the current endpoint
          p = 0.0
          start = end
          
          // Find candidates
          const candidates = connections
            .filter((c) => c.from === start || c.to === start)
            .map((c) => (c.from === start ? c.to : c.from))
          
          if (candidates.length > 0) {
            end = candidates[Math.floor(Math.random() * candidates.length)]
          } else {
            // Fallback to random node
            end = Math.floor(Math.random() * nodeCount)
          }
        }

        // Interpolate position
        const p1 = nodePositions[start]
        const p2 = nodePositions[end]
        const pos = new THREE.Vector3().lerpVectors(p1, p2, p)

        return {
          ...pulse,
          startIndex: start,
          endIndex: end,
          progress: p,
          position: pos,
        }
      })
    )
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={currentColor}
          transparent
          opacity={mode === 'thinking' ? 0.3 : 0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Nodes (Glowing points) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodeFlatPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={currentColor}
          size={0.16}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Signal Pulses (small physical meshes to allow glow/depth) */}
      {pulses.map((pulse, idx) => (
        <mesh key={idx} position={pulse.position}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshBasicMaterial color={currentColor} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}


// ─── 4. Circular 3D Audio Waveform Ring ──────────────────────────────────────
function AudioWaveformRing({ mode }: AssistantCoreProps) {
  const barsRef = useRef<THREE.Group>(null!)
  const count = 36
  const radius = 2.4
  const currentColor = colors[mode] || colors.idle

  const barData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      return { x, z, angle }
    })
  }, [count, radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const bars = barsRef.current.children

    // Base height mapping by state
    const multiplier = mode === 'listening' ? 1.5 : mode === 'speaking' ? 1.2 : mode === 'thinking' ? 0.6 : 0.15
    const frequency = mode === 'listening' ? 8.0 : mode === 'speaking' ? 5.0 : mode === 'thinking' ? 12.0 : 2.0
    const speed = mode === 'listening' ? 14 : mode === 'speaking' ? 8 : mode === 'thinking' ? 22 : 2.5

    for (let i = 0; i < count; i++) {
      const bar = bars[i] as THREE.Mesh
      if (!bar) continue

      const data = barData[i]
      
      // Dynamic circular ripple wave height calculation
      const wave = Math.sin(data.angle * frequency + t * speed) * Math.cos(data.angle * 1.5 - t * 0.4)
      const targetHeight = 0.05 + Math.abs(wave) * multiplier

      // Smooth interpolation for heights
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetHeight * 8, 0.2)
      
      // Orient the bar rotation to face outwards
      bar.rotation.y = -data.angle
    }
  })

  return (
    <group ref={barsRef}>
      {barData.map((data, idx) => (
        <mesh key={idx} position={[data.x, 0, data.z]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshBasicMaterial
            color={currentColor}
            transparent
            opacity={mode === 'idle' ? 0.25 : 0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}


// ─── 5. Typing / Data Flow Particles (Data Vortex) ─────────────────────────
function TypingParticles({ mode }: AssistantCoreProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 150

  const [positions, speeds, phases, baseRadii] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sp = new Float32Array(count)
    const ph = new Float32Array(count)
    const rad = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Start spread out on floor (Y = -2.5)
      const angle = Math.random() * Math.PI * 2
      const radius = 1.0 + Math.random() * 3.5
      
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = -2.5 + Math.random() * 0.5 // near floor
      pos[i * 3 + 2] = Math.sin(angle) * radius
      
      sp[i] = 0.8 + Math.random() * 1.5 // rising speed
      ph[i] = Math.random() * Math.PI * 2 // phase shift for rotation
      rad[i] = radius
    }
    return [pos, sp, ph, rad]
  }, [])

  useFrame((state, delta) => {
    const geo = pointsRef.current.geometry
    const posAttr = geo.attributes.position
    const arr = posAttr.array as Float32Array
    const t = state.clock.getElapsedTime()

    const stateMultiplier = mode === 'thinking' ? 2.5 : mode === 'speaking' ? 1.5 : mode === 'listening' ? 1.0 : 0.4

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      let y = arr[idx + 1]
      
      // Rise upward
      y += speeds[i] * delta * stateMultiplier * 1.5
      
      // If particle reaches the AI core height, recycle back to floor
      if (y > 0.5) {
        y = -2.5
        const angle = Math.random() * Math.PI * 2
        const r = 1.0 + Math.random() * 3.5
        arr[idx] = Math.cos(angle) * r
        arr[idx + 2] = Math.sin(angle) * r
      } else {
        // Spiral inward as they rise
        const progress = (y + 2.5) / 3.0 // 0 to 1
        const currentRadius = baseRadii[i] * (1.0 - progress * 0.9) // Converge toward center
        const angle = t * (1.2 + speeds[i]) + phases[i]
        
        arr[idx] = Math.cos(angle) * currentRadius
        arr[idx + 2] = Math.sin(angle) * currentRadius
      }
      
      arr[idx + 1] = y
    }
    posAttr.needsUpdate = true
  })

  const currentColor = colors[mode] || colors.idle

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={currentColor}
        size={0.065}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}


// ─── 6. Smooth Camera Director ──────────────────────────────────────────────
function CameraDirector({ mode }: AssistantCoreProps) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const targetPos = new THREE.Vector3()
    const targetLookAt = new THREE.Vector3(0, 0, 0)

    // Calculate camera target depending on the active state
    if (mode === 'idle') {
      // Cinematic slow orbital drift
      const x = Math.cos(t * 0.08) * 7.5
      const z = Math.sin(t * 0.08) * 7.5
      const y = 1.8 + Math.sin(t * 0.15) * 0.6
      targetPos.set(x, y, z)
      targetLookAt.set(0, Math.sin(t * 0.4) * 0.1, 0)
    } else if (mode === 'listening') {
      // Focus in close, stable
      targetPos.set(-0.8, 0.4, 4.4)
      targetLookAt.set(0, -0.1, 0)
    } else if (mode === 'thinking') {
      // Move to a wide low angle showing neural network processing
      targetPos.set(4.0, 3.2, 5.0)
      targetLookAt.set(-1.0, 0.2, -1.0)
    } else if (mode === 'speaking') {
      // Normal dialog framing
      targetPos.set(2.2, 0.8, 5.2)
      targetLookAt.set(-0.2, 0, 0)
    }

    // Smooth camera positioning
    state.camera.position.lerp(targetPos, 0.04)

    // Smooth target lookAt
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position)
    currentLookAt.lerp(targetLookAt, 0.04)
    state.camera.lookAt(currentLookAt)
  })

  return null
}


// ─── 7. Exposing Visual HUD Telemetry (Float overlay in 3D canvas) ──────────
function HUDDiagnostics({ mode }: AssistantCoreProps) {
  const currentColor = colors[mode] || colors.idle
  
  return (
    <group position={[-3.8, 2.5, -2]} rotation={[0, 0.2, 0]}>
      <Text
        color={currentColor}
        fontSize={0.16}
        maxWidth={3}
        font="Courier New"
        anchorX="left"
        anchorY="top"
        fillOpacity={0.65}
      >
        {`COGNITIVE STREAM: CONNECTED\nSYNC RATE: 99.85%\nCORE TEMP: 32.4 C\nJARVIS V3.52\nLATENCY: 12ms`}
      </Text>
    </group>
  )
}


// ─── MAIN COMPONENT EXPORT ──────────────────────────────────────────────────
interface AIRoomSceneProps {
  mode?: 'idle' | 'listening' | 'speaking' | 'thinking'
}

export function AIRoomScene({ mode = 'idle' }: AIRoomSceneProps) {
  const { tier } = usePerformanceDetector()

  // Low performance tier fallback (cyber HUD flat overlay UI)
  if (tier === 'low') {
    const borders = {
      idle: 'border-cyan-500/30 text-cyan-400 from-cyan-950/20 to-black/80',
      listening: 'border-orange-500/30 text-orange-400 from-orange-950/20 to-black/80',
      speaking: 'border-emerald-500/30 text-emerald-400 from-emerald-950/20 to-black/80',
      thinking: 'border-purple-500/30 text-purple-400 from-purple-950/20 to-black/80',
    }
    const colorClasses = borders[mode] || borders.idle
    const activeColor = colors[mode] || colors.idle

    return (
      <div className={`relative w-full h-full rounded-2xl border bg-gradient-to-b ${colorClasses} flex flex-col items-center justify-center p-6 transition-all duration-500 overflow-hidden`}>
        <div className="absolute inset-0 bg-hologram-grid opacity-10 pointer-events-none" />
        <div className="absolute left-0 w-full h-[2px] scanline-line pointer-events-none z-0 opacity-15" />
        
        {/* Flat cyber dials */}
        <div className="relative flex items-center justify-center w-40 h-40 border border-white/5 rounded-full bg-black/40">
          <div className="absolute w-32 h-32 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: activeColor, animationDuration: '10s' }} />
          <div className="absolute w-28 h-28 rounded-full border opacity-50 animate-pulse" style={{ borderColor: activeColor }} />
          <div className="w-16 h-16 rounded-full blur-lg animate-pulse" style={{ backgroundColor: activeColor, opacity: 0.6 }} />
        </div>
        
        {/* Terminal Telemetry readout */}
        <div className="mt-8 font-mono text-[10px] tracking-wider text-center space-y-1 opacity-75">
          <p>SYSTEM STATUS: ONLINE</p>
          <p className="uppercase">ASSISTANT MODE: {mode}</p>
          <p>QUANTUM TUNNEL: SECURE</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden min-h-[420px] group/room">
      {/* Sci-fi Overlay grids */}
      <div className="absolute inset-0 bg-hologram-grid opacity-10 pointer-events-none z-10" />
      <div className="absolute left-0 w-full h-[2px] scanline-line pointer-events-none z-10 opacity-20" />

      {/* Screen Corners brackets */}
      <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover/room:border-cyan-500/50 transition-colors duration-500 z-10" />
      <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-white/20 group-hover/room:border-cyan-500/50 transition-colors duration-500 z-10" />
      <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-white/20 group-hover/room:border-cyan-500/50 transition-colors duration-500 z-10" />
      <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover/room:border-cyan-500/50 transition-colors duration-500 z-10" />

      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.2, 7.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#010206']} />
        
        {/* Fog for spatial depth */}
        <fog attach="fog" args={['#010206', 5, 12]} />

        {/* Ambient environment light */}
        <ambientLight intensity={0.15} />
        
        {/* Dynamic spotlights targeting the central assistant core */}
        <pointLight position={[0, 0, 3]} intensity={mode === 'thinking' ? 2.5 : 1.5} color={colors[mode] || colors.idle} />
        <pointLight position={[-4, 2, -2]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[4, -2, -2]} intensity={0.8} color="#a855f7" />

        {/* Scene Components */}
        <FloorScannerGrid mode={mode} />
        <AssistantCore mode={mode} />
        <NeuralNetwork mode={mode} />
        <AudioWaveformRing mode={mode} />
        <TypingParticles mode={mode} />
        
        {/* Dynamic camera controller */}
        <CameraDirector mode={mode} />

        {/* Spatial diagnostic metrics */}
        <HUDDiagnostics mode={mode} />

        {/* Ambient space dust */}
        <Sparkles
          count={100}
          scale={8}
          size={0.8}
          speed={0.12}
          color={colors[mode] || colors.idle}
          opacity={0.4}
        />
      </Canvas>
    </div>
  )
}
