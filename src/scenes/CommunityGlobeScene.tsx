import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function GlobeGroup() {
  const globeRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (globeRef.current) {
      globeRef.current.rotation.y = elapsed * 0.12
      globeRef.current.rotation.x = Math.sin(elapsed * 0.05) * 0.08
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -elapsed * 0.08
    }
  })

  return (
    <group>
      {/* 3D Wireframe Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.35, 24, 24]} />
        <meshBasicMaterial
          color="#00f2fe" // Cyan network lines
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Floating active user nodes */}
      <group ref={outerRef}>
        <Sparkles count={22} scale={2.6} size={2.5} speed={0.6} color="#00f2fe" />
        <Sparkles count={14} scale={2.8} size={2.0} speed={0.4} color="#d946ef" />
      </group>
    </group>
  )
}

export function CommunityGlobeScene() {
  return (
    <div className="w-full h-[180px] relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={1.5} color="#00f2fe" />
        <pointLight position={[-4, -4, -4]} intensity={1.0} color="#d946ef" />
        
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
          <GlobeGroup />
        </Float>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.3}
          scale={5}
          blur={1.8}
          far={3.0}
        />
      </Canvas>
    </div>
  )
}
