import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean
  glow?: boolean
  glowColor?: string
  reflection?: boolean
}

/**
 * Card — base card with optional 3D tilt, glass reflection sweep, and glow border.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tilt = false, glow = false, glowColor, reflection = true, children, onMouseMove, onMouseLeave, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null)
    const [rotateX, setRotateX] = React.useState(0)
    const [rotateY, setRotateY] = React.useState(0)
    const [isHovered, setIsHovered] = React.useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt) return
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rX = ((y - centerY) / centerY) * -6
      const rY = ((x - centerX) / centerX) * 6
      setRotateX(rX)
      setRotateY(rY)
      setIsHovered(true)
      onMouseMove?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setRotateX(0)
      setRotateY(0)
      setIsHovered(false)
      onMouseLeave?.(e)
    }

    const glowStyle = glow && glowColor ? {
      boxShadow: isHovered ? `0 0 30px ${glowColor}40, 0 0 60px ${glowColor}20` : 'none',
    } : {}

    return (
      <div
        className="card-3d-wrapper"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          ref={(node) => {
            (cardRef as any).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as any).current = node
          }}
          animate={{
            rotateX: tilt ? rotateX : 0,
            rotateY: tilt ? rotateY : 0,
            scale: isHovered ? (tilt ? 1.01 : 1) : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.5 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "rounded-2xl border bg-card text-card-foreground shadow-sm",
            "transition-shadow duration-300",
            reflection && "glass-reflection",
            glow && "transition-all",
            className
          )}
          style={{ transformStyle: 'preserve-3d', ...glowStyle }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      </div>
    )
  }
)
Card.displayName = "Card"

export interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  delay?: number
  glow?: boolean
  glowColor?: string
}

/**
 * AnimatedCard — motion.div card with whileHover lift + shadow,
 * suitable for feature cards and stats panels.
 */
export function AnimatedCard({
  children,
  className,
  delay = 0,
  glow,
  glowColor,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-sm",
        "hover:shadow-lg transition-shadow duration-300",
        "glass-reflection overflow-hidden",
        glow && "hover:border-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight font-display", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
