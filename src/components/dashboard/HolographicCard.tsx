import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HolographicCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'orange'
  tiltEnabled?: boolean
}

export function HolographicCard({
  children,
  glowColor = 'cyan',
  tiltEnabled = true,
  className,
  ...props
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for mouse position relative to card coordinates
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring configurations for smooth tilt interpolation (eliminates high GPU usage / stuttering)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)

  // Scale spring for a nice pop on hover
  const scale = useSpring(1, springConfig)

  // Track the mouse coordinates for the glow gradient
  const glowX = useMotionValue(0)
  const glowY = useMotionValue(0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Normalized coordinates (-0.5 to 0.5)
    const relativeX = (event.clientX - rect.left) / width - 0.5
    const relativeY = (event.clientY - rect.top) / height - 0.5

    mouseX.set(relativeX)
    mouseY.set(relativeY)

    // Absolute pixel positions for the radial gradient glow
    glowX.set(event.clientX - rect.left)
    glowY.set(event.clientY - rect.top)
  }

  const handleMouseEnter = () => {
    scale.set(1.02)
  }

  const handleMouseLeave = () => {
    scale.set(1)
    mouseX.set(0)
    mouseY.set(0)
  }

  // Glow gradients map
  const glows = {
    cyan: 'rgba(6, 182, 212, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)',
    emerald: 'rgba(16, 185, 129, 0.15)',
    orange: 'rgba(249, 115, 22, 0.15)',
  }

  const glowStyle = {
    background: useTransform(
      [glowX, glowY],
      ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${glows[glowColor]} 0%, transparent 80%)`
    ),
  }

  const glowBorder = {
    cyan: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    purple: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
    emerald: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    orange: 'hover:border-orange-500/50 hover:shadow-orange-500/10',
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-card/25 dark:bg-card/15 backdrop-blur-md transition-all duration-300 overflow-hidden shadow-2xl group",
        glowBorder[glowColor],
        `glow-${glowColor}`,
        className
      )}
      {...props}
    >
      {/* Dynamic light reflection/glow overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={glowStyle}
      />

      {/* Holographic tech sub-lines overlay */}
      <div className="absolute inset-0 bg-hologram-grid opacity-20 pointer-events-none z-0" />
      
      {/* Interactive scanline light line */}
      <div className="absolute left-0 w-full h-[2px] scanline-line pointer-events-none z-0 opacity-40" />

      {/* Futuristic corner elements */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/20 dark:border-white/10 rounded-tl pointer-events-none" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white/20 dark:border-white/10 rounded-tr pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white/20 dark:border-white/10 rounded-bl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/20 dark:border-white/10 rounded-br pointer-events-none" />

      {/* Contents */}
      <div className="relative z-10 w-full h-full" style={{ transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </motion.div>
  )
}
