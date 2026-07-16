import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function CoreObject() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.15
      meshRef.current.rotation.z = Math.sin(elapsed * 0.1) * 0.12
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial
          color="#a855f7" // Glowing violet wireframe lines
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      
      {/* Tiny sparkles swirling in the avatar background */}
      <Sparkles count={16} scale={2.0} size={2.2} speed={0.8} color="#a855f7" />
    </group>
  )
}

export function ProfileAvatarScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <Canvas
        camera={{ position: [0, 0, 3.0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#a855f7" />
        
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.35}>
          <CoreObject />
        </Float>
      </Canvas>
    </div>
  )
}
