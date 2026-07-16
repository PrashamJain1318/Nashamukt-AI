import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Stars, Environment, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useMouseParallax } from '@/hooks/three/useMouseParallax'

// ─── GLSL Shaders ────────────────────────────────────────────────────────────

// 1. Premium Frosted Glass Orb Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform float uNoiseStrength;
  uniform float uNoiseFrequency;
  uniform float uNoiseSpeed;
  uniform float uSmokiness; // Stage 1 smoke turbulence factor
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  // Description : Array and textureless GLSL 2D/3D/4D simplex noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : stegu
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

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

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1),
                                 dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Breathing scale fluctuation
    float breathing = sin(uTime * 1.3) * 0.04 + 0.98;
    
    // Wave displacement using simplex noise
    // Smokiness triggers high wave speed and turbulent frequencies
    float freq = uNoiseFrequency + uSmokiness * 2.0;
    float speed = uNoiseSpeed + uSmokiness * 0.8;
    
    vec3 noisePos = position * freq + vec3(0.0, uTime * speed, 0.0);
    noisePos.xy += uMouse * 0.18;
    
    float noiseVal = snoise(noisePos);
    // Increase wave distortion strength when smoky
    float strength = uNoiseStrength * (1.0 + uSmokiness * 0.7);
    float displacement = noiseVal * strength * breathing;
    
    vec3 displacedPosition = position * breathing + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    
    vPosition = displacedPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

// 2. Premium Frosted Glass Orb Fragment Shader
const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uTime;
  uniform float uFresnelBias;
  uniform float uFresnelScale;
  uniform float uFresnelPower;
  
  // Transformation uniforms
  uniform float uDarkness; // 0 to 1 (Stage 1 ash-gray filter)
  uniform float uCracks;   // 0 to 1 (Stage 1 crack grid)
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  // Re-declare mod289 and snoise inside fragment shader for frosted texture noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
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
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1),
                                 dot(p2,x2), dot(p3,x3)));
  }

  // Thin-film interference dispersion colors
  vec3 getVisionProIrid(float cosTheta) {
    float theta = acos(cosTheta);
    
    // Vision Pro palette: soft rose-golds, custom cyans, glowing emeralds
    float r = sin(theta * 2.8 + uTime * 0.35) * 0.38 + 0.62;
    float g = sin(theta * 2.2 + uTime * 0.28 + 1.2) * 0.32 + 0.68;
    float b = sin(theta * 1.8 + uTime * 0.22 + 2.4) * 0.38 + 0.62;
    
    vec3 color = vec3(r, g, b);
    return mix(color, vec3(0.82, 0.68, 0.9), 0.25);
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    
    // High frequency noise normal perturbation for frosted glass
    vec3 noisePosFrosted = vPosition * 75.0 + vec3(0.0, uTime * 0.25, 0.0);
    float normalNoise = snoise(noisePosFrosted) * 0.16;
    vec3 perturbedNormal = normalize(normal + normalNoise * 0.45);
    
    float ndotv = dot(perturbedNormal, viewDir);
    
    // Fresnel transparency factor
    float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - max(0.0, ndotv), uFresnelPower);
    fresnel = clamp(fresnel, 0.0, 1.0);
    
    // Interior animated gradients
    float flow1 = sin(vPosition.x * 2.2 + uTime * 0.5) * 0.5 + 0.5;
    float flow2 = cos(vPosition.y * 1.8 - uTime * 0.3) * 0.5 + 0.5;
    
    // Deep volume colors, blended to an ashy black-red under Stage 1 darkness
    vec3 col1 = mix(uColor1, vec3(0.02, 0.01, 0.04), uDarkness);
    vec3 col2 = mix(uColor2, vec3(0.12, 0.03, 0.05), uDarkness);
    vec3 col3 = mix(uColor3, vec3(0.08, 0.02, 0.08), uDarkness);
    
    vec3 volumeColor = mix(col1, col2, flow1);
    volumeColor = mix(volumeColor, col3, flow2 * 0.45);
    
    // Iridescent outer shell reflection, greyed out under Stage 1 darkness
    vec3 iridColor = getVisionProIrid(max(0.0, ndotv));
    iridColor = mix(iridColor, vec3(0.15, 0.12, 0.18), uDarkness * 0.8);
    
    // Specular light coordinates
    vec3 lightDir1 = normalize(vec3(4.0, 6.0, 3.0));
    vec3 lightDir2 = normalize(vec3(-4.0, -2.0, 2.0));
    
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    
    float spec1 = pow(max(dot(perturbedNormal, halfDir1), 0.0), 32.0) * 0.55;
    float spec2 = pow(max(dot(perturbedNormal, halfDir2), 0.0), 16.0) * 0.25;
    
    // Soft outer neon glow overlay
    float rimGlow = pow(1.0 - max(0.0, ndotv), 4.5);
    
    // Composite
    vec3 glassColor = mix(volumeColor, iridColor, fresnel * 0.68);
    vec3 finalColor = glassColor + vec3(spec1) + vec3(spec2) + uColor2 * rimGlow * 0.22 * (1.0 - uDarkness * 0.65);
    
    // Mathematical Cracks overlay: sharp grid lines representing addiction fractures
    // High-frequency sin coordinate patterns generate crack fractures
    float crackVal = abs(sin(vPosition.x * 24.0) * sin(vPosition.y * 18.0) * sin(vPosition.z * 28.0));
    float crackLines = smoothstep(0.015, 0.0, crackVal);
    // Overlay cracks onto the final color when uCracks is active (red/ash colored)
    finalColor = mix(finalColor, vec3(0.35, 0.06, 0.08), crackLines * uCracks);
    
    gl_FragColor = vec4(finalColor, 0.3 + fresnel * 0.6 + rimGlow * 0.12);
  }
`

// 3. Volumetric Glow Shell Shaders
const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`
const glowFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform vec3 uColor;
  uniform float uDarkness;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Glow is dimmed when uDarkness is 1 (Stage 1)
    float glow = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.2);
    gl_FragColor = vec4(uColor, glow * 0.18 * (1.0 - uDarkness * 0.7));
  }
`

// 4. Volumetric Light Shaft Shaders
const volumetricVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const volumetricFragmentShader = `
  varying vec2 vUv;
  uniform float uDarkness;
  void main() {
    float verticalFade = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
    float radialFade = sin(vUv.x * 3.14159);
    float intensity = verticalFade * radialFade * 0.08 * (1.0 - uDarkness * 0.8);
    
    gl_FragColor = vec4(0.0, 0.95, 1.0, intensity);
  }
`

// ─── Scene components ────────────────────────────────────────────────────────
interface SceneProps {
  scrollProgress: { current: number }
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  shaderState: React.MutableRefObject<{
    darkness: number
    smokiness: number
    cracks: number
    greenParticles: number
    scale: number
  }>
}

function LiquidOrb({ scrollProgress, mouseRef, shaderState }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const scaleRef = useRef(0)

  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNoiseStrength: { value: 0.15 },
    uNoiseFrequency: { value: 2.5 },
    uNoiseSpeed: { value: 0.38 },
    uSmokiness: { value: 1.0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#0c0721') },
    uColor2: { value: new THREE.Color('#00f2fe') },
    uColor3: { value: new THREE.Color('#d946ef') },
    uFresnelBias: { value: 0.08 },
    uFresnelScale: { value: 0.85 },
    uFresnelPower: { value: 2.8 },
    uDarkness: { value: 1.0 },
    uCracks: { value: 1.0 },
  }), [])

  const glowUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#00f2fe') },
    uDarkness: { value: 1.0 },
  }), [])

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime()
    uniforms.uTime.value = elapsed

    // Scale-in entrance animation
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1.0, delta * 2.5)

    // Gentle float loop
    const floatOffset = Math.sin(elapsed * 1.5) * 0.12
    // Multiply by GSAP-tweened shaderState scale factor
    const targetScale = scaleRef.current * (1.45 + scrollProgress.current * 0.15) * shaderState.current.scale

    // Update dynamic uniforms from GSAP scroll tracker
    uniforms.uDarkness.value = shaderState.current.darkness
    uniforms.uCracks.value = shaderState.current.cracks
    uniforms.uSmokiness.value = shaderState.current.smokiness
    
    glowUniforms.uDarkness.value = shaderState.current.darkness

    if (meshRef.current) {
      meshRef.current.position.y = floatOffset
      meshRef.current.rotation.y = elapsed * 0.08
      meshRef.current.scale.setScalar(targetScale)
      
      // Mouse move tilt
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseRef.current.y * 0.35, delta * 3)
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -mouseRef.current.x * 0.35, delta * 3)
      
      uniforms.uMouse.value.set(
        THREE.MathUtils.lerp(uniforms.uMouse.value.x, mouseRef.current.x, delta * 4),
        THREE.MathUtils.lerp(uniforms.uMouse.value.y, mouseRef.current.y, delta * 4)
      )
    }

    if (glowRef.current) {
      glowRef.current.position.y = floatOffset
      glowRef.current.rotation.y = elapsed * 0.08
      glowRef.current.scale.setScalar(targetScale * 1.05)
      
      glowRef.current.rotation.x = THREE.MathUtils.lerp(glowRef.current.rotation.x, mouseRef.current.y * 0.35, delta * 3)
      glowRef.current.rotation.z = THREE.MathUtils.lerp(glowRef.current.rotation.z, -mouseRef.current.x * 0.35, delta * 3)
    }
  })

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

      {/* Volumetric glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <shaderMaterial
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function SceneInner({ scrollProgress, mouseRef, shaderState }: SceneProps) {
  const lightRef = useRef<THREE.PointLight>(null!)
  const ambientRef = useRef<THREE.AmbientLight>(null!)
  const volumetricUniforms = useMemo(() => ({
    uDarkness: { value: 1.0 }
  }), [])

  const greenSparklesRef = useRef<THREE.Group>(null!)
  const cyanSparklesRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    // Zoom camera on scroll
    state.camera.position.z = THREE.MathUtils.lerp(5.0, 4.3, scrollProgress.current)
    
    // Parallax camera move
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseRef.current.x * 0.35, delta * 3)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseRef.current.y * 0.35, delta * 3)
    state.camera.lookAt(0, 0, 0)

    // Dynamic light shifts on scroll
    // Lights dim down when uDarkness is active (representing low-energy Stage 1)
    const darknessFactor = 1.0 - shaderState.current.darkness * 0.65
    
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(2.2, 3.5, scrollProgress.current) * darknessFactor
      lightRef.current.position.y = 5.0 - scrollProgress.current * 2.0
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.3, 0.6, scrollProgress.current) * darknessFactor
    }

    volumetricUniforms.uDarkness.value = shaderState.current.darkness

    // Control background particle sets dynamically based on GSAP stages without triggering React re-renders!
    if (greenSparklesRef.current) {
      // Emerald green sparkles only active during Stage 5 and 6
      greenSparklesRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1
      greenSparklesRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
      
      // Fade in green sparkles
      greenSparklesRef.current.traverse((child: any) => {
        if (child.isPoints && child.material) {
          child.material.opacity = shaderState.current.greenParticles * 0.85
        }
      })
    }

    if (cyanSparklesRef.current) {
      // Cyan sparkles represent the clean recovery glow (Stage 3+)
      cyanSparklesRef.current.traverse((child: any) => {
        if (child.isPoints && child.material) {
          child.material.opacity = (1.0 - shaderState.current.darkness) * 0.7
        }
      })
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.4} />
      
      {/* Cinematic key, fill, and back rim lighting */}
      <pointLight ref={lightRef} position={[5, 5, 4]} intensity={2.2} color="#00f2fe" />
      <pointLight position={[-5, -4, 2]} intensity={1.5} color="#d946ef" />
      
      {/* Soft back rim light for glass glow highlights */}
      <pointLight position={[0, 0, -4.5]} intensity={4.5} color="#00f2fe" />
      <directionalLight position={[0, -4, -4]} intensity={1.0} color="#0c0721" />

      {/* HDRI Environment reflection studio mapping */}
      <Environment preset="studio" />

      {/* Volumetric Light Shaft shaft cone */}
      <mesh position={[1.5, 2.2, -2.5]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.0, 3.2, 8.0, 32, 1, true]} />
        <shaderMaterial
          vertexShader={volumetricVertexShader}
          fragmentShader={volumetricFragmentShader}
          uniforms={volumetricUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Clean cyan background sparkles (Stage 3+) */}
      <group ref={cyanSparklesRef}>
        <Sparkles count={30} scale={5.5} size={1.8} speed={0.4} color="#00f2fe" />
      </group>

      {/* Green recovery energy sparkles (Stage 5+) */}
      <group ref={greenSparklesRef}>
        <Sparkles count={25} scale={4.5} size={1.6} speed={1.2} color="#10b981" />
      </group>

      {/* Neutral background stars */}
      <Stars radius={15} depth={5} count={100} factor={1.5} fade speed={0.4} />

      <LiquidOrb scrollProgress={scrollProgress} mouseRef={mouseRef} shaderState={shaderState} />

      {/* ground floor plane with contact shadows and blurry reflections */}
      <group position={[0, -0.05, 0]}>
        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.65}
          scale={7}
          blur={2.4}
          far={3.0}
        />

        <mesh position={[0, -2.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 12]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={3.5}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#05030f"
            metalness={0.5}
            mirror={0.65}
          />
        </mesh>
      </group>
    </>
  )
}

export function HeroGlassOrbScene() {
  const mouseRef = useMouseParallax()
  const scrollProgress = useRef(0)

  // Settings ref containing current transformation values driven by GSAP
  const shaderState = useRef({
    darkness: 1.0,      // Stage 1: starts completely dark/grey
    smokiness: 1.0,     // Stage 1: starts highly turbulent/smoky
    cracks: 1.0,        // Stage 1: starts cracked
    greenParticles: 0.0,// Stage 5: green energy particles count
    scale: 1.0,         // Stage 6: slight scale push
  })

  const tlRef = useRef<gsap.core.Timeline>()

  useEffect(() => {
    // Instantiate paused GSAP timeline
    tlRef.current = gsap.timeline({ paused: true })

    // Build the stages sequence (duration maps 0.0 -> 1.0)
    tlRef.current
      // Stage 1 -> 2: Smoke disappears (0.0 to 0.2)
      .to(shaderState.current, { smokiness: 0.0, duration: 0.2, ease: 'power1.out' })
      // Stage 2 -> 3: Cracks fade away, glass clears (0.2 to 0.45)
      .to(shaderState.current, { cracks: 0.0, duration: 0.25, ease: 'power2.inOut' })
      // Stage 3 -> 4: Healthy blue neon glow emerges (0.45 to 0.7)
      .to(shaderState.current, { darkness: 0.0, duration: 0.25, ease: 'power2.out' })
      // Stage 4 -> 5: Green recovery particles float in (0.7 to 0.9)
      .to(shaderState.current, { greenParticles: 1.0, duration: 0.2, ease: 'power1.inOut' })
      // Stage 5 -> 6: Hope (stabilizes and expands slightly) (0.9 to 1.0)
      .to(shaderState.current, { scale: 1.15, duration: 0.1, ease: 'sine.out' })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY
      // Scroll bounds linked strictly to Hero container viewport height
      const maxScroll = Math.max(100, window.innerHeight * 0.8)
      const progress = Math.min(1.0, scroll / maxScroll)
      
      if (tlRef.current) {
        tlRef.current.progress(progress)
      }
      scrollProgress.current = progress
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[550px] relative rounded-3xl overflow-hidden">
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
        <SceneInner scrollProgress={scrollProgress} mouseRef={mouseRef} shaderState={shaderState} />
      </Canvas>
    </div>
  )
}
