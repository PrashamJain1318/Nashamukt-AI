import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useMouseParallax } from '@/hooks/three/useMouseParallax'

// ─── GLSL Noise & Shader source code ──────────────────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform float uNoiseStrength;
  uniform float uNoiseFrequency;
  uniform float uNoiseSpeed;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  // Description : Array and textureless GLSL 2D/3D/4D simplex 
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : stegu
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //               https://github.com/stegu/webgl-noise

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.xxx = C.yyy
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.xxx = -0.5 = -D.yyy

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z); // mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_); // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1),
                                 dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Smooth breathing periodic pulse
    float breathing = sin(uTime * 1.3) * 0.04 + 0.98;
    
    // Wave displacement using time and simplex noise
    vec3 noisePos = position * uNoiseFrequency + vec3(0.0, uTime * uNoiseSpeed, 0.0);
    noisePos.xy += uMouse * 0.18;
    
    float noiseVal = snoise(noisePos);
    float displacement = noiseVal * uNoiseStrength * breathing;
    
    vec3 displacedPosition = position * breathing + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    
    vPosition = displacedPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uTime;
  uniform float uFresnelBias;
  uniform float uFresnelScale;
  uniform float uFresnelPower;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  // Thin-film interference thin dispersion colors
  vec3 getVisionProIrid(float cosTheta) {
    float theta = acos(cosTheta);
    
    // Vision Pro dynamic palette: soft rose-golds, custom cyans, glowing emeralds
    float r = sin(theta * 2.8 + uTime * 0.35) * 0.38 + 0.62;
    float g = sin(theta * 2.2 + uTime * 0.28 + 1.2) * 0.32 + 0.68;
    float b = sin(theta * 1.8 + uTime * 0.22 + 2.4) * 0.38 + 0.62;
    
    vec3 color = vec3(r, g, b);
    return mix(color, vec3(0.82, 0.68, 0.9), 0.25); // blend with premium silver/pink sheen
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    float ndotv = dot(normal, viewDir);
    
    // Fresnel transparency factor
    float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - max(0.0, ndotv), uFresnelPower);
    fresnel = clamp(fresnel, 0.0, 1.0);
    
    // Interior animated gradients (moving cloud flows inside the orb)
    float flow1 = sin(vPosition.x * 2.2 + uTime * 0.5) * 0.5 + 0.5;
    float flow2 = cos(vPosition.y * 1.8 - uTime * 0.3) * 0.5 + 0.5;
    
    vec3 volumeColor = mix(uColor1, uColor2, flow1);
    volumeColor = mix(volumeColor, uColor3, flow2 * 0.45);
    
    // Iridescent outer shell reflection
    vec3 iridColor = getVisionProIrid(max(0.0, ndotv));
    
    // Specular light coordinates
    vec3 lightDir1 = normalize(vec3(4.0, 6.0, 3.0));
    vec3 lightDir2 = normalize(vec3(-4.0, -2.0, 2.0));
    
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 128.0);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 64.0);
    
    // Soft outer neon glow overlay
    float rimGlow = pow(1.0 - max(0.0, ndotv), 4.5);
    
    // Composite: translucent glass color + iridescence + specular points
    vec3 glassColor = mix(volumeColor, iridColor, fresnel * 0.68);
    vec3 finalColor = glassColor + vec3(spec1 * 0.75) + vec3(spec2 * 0.35) + uColor2 * rimGlow * 0.25;
    
    gl_FragColor = vec4(finalColor, 0.35 + fresnel * 0.55 + rimGlow * 0.15);
  }
`

// ─── Scene components ────────────────────────────────────────────────────────
interface SceneProps {
  scrollProgress: { current: number }
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

function LiquidOrb({ scrollProgress, mouseRef }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const shadowRef = useRef<THREE.Mesh>(null!)
  const scaleRef = useRef(0)

  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNoiseStrength: { value: 0.16 },
    uNoiseFrequency: { value: 2.5 },
    uNoiseSpeed: { value: 0.4 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#0c0721') }, // Midnight dark indigo
    uColor2: { value: new THREE.Color('#00f2fe') }, // Neon glowing cyan
    uColor3: { value: new THREE.Color('#d946ef') }, // Muted neon magenta/violet
    uFresnelBias: { value: 0.08 },
    uFresnelScale: { value: 0.85 },
    uFresnelPower: { value: 2.8 },
  }), [])

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime()
    uniforms.uTime.value = elapsed

    // Scale-in entrance animation
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1.0, delta * 2.5)

    // Gentle float float loop
    const floatOffset = Math.sin(elapsed * 1.5) * 0.12
    const targetScale = scaleRef.current * (1.5 + scrollProgress.current * 0.15)

    if (meshRef.current) {
      meshRef.current.position.y = floatOffset
      meshRef.current.rotation.y = elapsed * 0.1
      meshRef.current.scale.setScalar(targetScale)
      
      // Mouse move tilt
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseRef.current.y * 0.35, delta * 3)
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -mouseRef.current.x * 0.35, delta * 3)
      
      // Update mouse coordinate uniforms
      uniforms.uMouse.value.set(
        THREE.MathUtils.lerp(uniforms.uMouse.value.x, mouseRef.current.x, delta * 4),
        THREE.MathUtils.lerp(uniforms.uMouse.value.y, mouseRef.current.y, delta * 4)
      )
    }

    // Shadow scale & opacity logic based on distance
    if (shadowRef.current) {
      const shadowFactor = 1.0 - Math.min(1.0, scrollProgress.current * 0.7)
      shadowRef.current.scale.setScalar(scaleRef.current * (1.0 - floatOffset * 0.25) * shadowFactor)
      
      const mat = shadowRef.current.material as THREE.MeshBasicMaterial
      if (mat) {
        mat.opacity = 0.25 * (1.0 + floatOffset * 0.2) * shadowFactor
      }
    }
  })

  // On-the-fly CanvasTexture for radial glow
  const radialGradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60)
      gradient.addColorStop(0, 'rgba(139, 92, 246, 1)')
      gradient.addColorStop(0.3, 'rgba(99, 102, 241, 0.4)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  return (
    <group position={[0, 0.2, 0]}>
      {/* 3D Orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glowing reflection floor plane below orb */}
      <mesh ref={shadowRef} position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          map={radialGradientTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function SceneInner({ scrollProgress, mouseRef }: SceneProps) {
  const lightRef = useRef<THREE.PointLight>(null!)
  const ambientRef = useRef<THREE.AmbientLight>(null!)

  useFrame((state, delta) => {
    // Zoom camera on scroll
    state.camera.position.z = THREE.MathUtils.lerp(5.0, 4.2, scrollProgress.current)
    
    // Parallax camera move
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseRef.current.x * 0.35, delta * 3)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseRef.current.y * 0.35, delta * 3)
    state.camera.lookAt(0, 0, 0)

    // Dynamic light shifts on scroll
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(2.2, 3.2, scrollProgress.current)
      lightRef.current.position.y = 5.0 - scrollProgress.current * 2.0
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.3, 0.6, scrollProgress.current)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.4} />
      <pointLight ref={lightRef} position={[5, 5, 4]} intensity={2.2} color="#06b6d4" />
      <pointLight position={[-5, -4, 2]} intensity={1.5} color="#8b5cf6" />
      <directionalLight position={[0, -4, -4]} intensity={1.0} color="#312e81" />

      {/* Suspended glowing background particles */}
      <Sparkles count={45} scale={5.5} size={1.8} speed={0.4} color="#8b5cf6" />
      <Stars radius={15} depth={5} count={100} factor={1.5} fade speed={0.4} />

      <LiquidOrb scrollProgress={scrollProgress} mouseRef={mouseRef} />
    </>
  )
}

export function HeroGlassOrbScene() {
  const mouseRef = useMouseParallax()
  const scrollProgress = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY
      const maxScroll = Math.max(100, window.innerHeight)
      scrollProgress.current = Math.min(1.0, scroll / maxScroll)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[550px] relative rounded-3xl overflow-hidden">
      {/* Background radial overlay inside scene container */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none z-0" />
      
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 5], fov: 55 }}
        className="w-full h-full absolute inset-0 z-10"
      >
        <SceneInner scrollProgress={scrollProgress} mouseRef={mouseRef} />
      </Canvas>
    </div>
  )
}
