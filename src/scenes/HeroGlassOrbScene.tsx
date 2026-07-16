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
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  // Classic Perlin 3D Noise by Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g100, g100), dot(g010, g010), dot(g110, g110)));
    g000 *= norm0.x;
    g100 *= norm0.y;
    g010 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g101, g101), dot(g011, g011), dot(g111, g111)));
    g001 *= norm1.x;
    g101 *= norm1.y;
    g011 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Wave calculations using time and noise frequency
    vec3 noisePos = position * uNoiseFrequency + vec3(0.0, uTime * 0.5, 0.0);
    noisePos.xy += uMouse * 0.25;
    
    float noiseVal = cnoise(noisePos);
    float displacement = noiseVal * uNoiseStrength;
    
    vec3 newPosition = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    
    vPosition = newPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uFresnelBias;
  uniform float uFresnelScale;
  uniform float uFresnelPower;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  // Inigo Quilez color palette generator
  vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    float ndotv = dot(normal, viewDir);
    
    // Fresnel factor
    float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - max(0.0, ndotv), uFresnelPower);
    fresnel = clamp(fresnel, 0.0, 1.0);
    
    // iridescence shifting color index
    float t = (1.0 - ndotv) * 0.65 + uTime * 0.07;
    
    // Pastel iridescent glass chromatic dispersion
    vec3 iridColor = palette(
      t,
      vec3(0.5, 0.5, 0.5),
      vec3(0.5, 0.5, 0.5),
      vec3(1.0, 1.0, 1.0),
      vec3(0.0, 0.33, 0.67)
    );
    
    vec3 baseColor = mix(uColor1, uColor2, fresnel);
    vec3 compositeColor = mix(baseColor, iridColor, 0.4);
    
    // Specular highlight gloss
    vec3 lightDir = normalize(vec3(3.0, 5.0, 2.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
    
    vec3 finalColor = compositeColor + vec3(spec * 0.7);
    gl_FragColor = vec4(finalColor, 0.3 + fresnel * 0.5);
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
    uNoiseStrength: { value: 0.18 },
    uNoiseFrequency: { value: 2.2 },
    uNoiseSpeed: { value: 0.5 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#312e81') }, // Midnight base indigo
    uColor2: { value: new THREE.Color('#8b5cf6') }, // Vibrant purple highlight
    uFresnelBias: { value: 0.1 },
    uFresnelScale: { value: 0.8 },
    uFresnelPower: { value: 2.5 },
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
