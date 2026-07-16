import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'gradient' | 'glow' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  magnetic?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, magnetic = false, onClick, disabled, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([])
    const [magnetOffset, setMagnetOffset] = React.useState({ x: 0, y: 0 })

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-muted hover:text-foreground bg-transparent",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      gradient: "bg-gradient-to-r from-primary via-violet-600 to-indigo-500 text-white shadow-lg shadow-primary/25 bg-[length:200%] animate-gradient-x hover:shadow-primary/40",
      glow: "bg-primary text-primary-foreground shadow-lg relative",
      outline: "border border-border/60 bg-transparent hover:bg-secondary/50 text-foreground",
    }

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    }

    // Ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current
      if (!button || isLoading || disabled) return

      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples(prev => [...prev, { x, y, id }])
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)

      if (onClick) onClick(e)
    }

    // Magnetic hover effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic) return
      const button = buttonRef.current
      if (!button) return
      const rect = button.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * 0.35
      const dy = (e.clientY - cy) * 0.35
      setMagnetOffset({ x: dx, y: dy })
    }

    const handleMouseLeave = () => {
      setMagnetOffset({ x: 0, y: 0 })
    }

    const isDisabled = disabled || isLoading

    return (
      <motion.button
        ref={(node) => {
          (buttonRef as any).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as any).current = node
        }}
        whileHover={!isDisabled ? { scale: magnetic ? 1 : 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.97 } : {}}
        animate={magnetic ? { x: magnetOffset.x, y: magnetOffset.y } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium",
          "ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "relative overflow-hidden select-none",
          variants[variant],
          sizes[size],
          variant === 'glow' && "after:absolute after:inset-0 after:rounded-lg after:opacity-0 hover:after:opacity-100 after:transition-opacity after:bg-white/10",
          className
        )}
        {...props}
      >
        {/* Ripple waves */}
        {ripples.map(({ x, y, id }) => (
          <span
            key={id}
            className="ripple-wave"
            style={{
              left: x,
              top: y,
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        ))}

        {/* Loading spinner */}
        {isLoading ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading…</span>
          </motion.span>
        ) : (
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        )}

        {/* Shimmer sweep on gradient variant */}
        {variant === 'gradient' && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out" />
        )}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
