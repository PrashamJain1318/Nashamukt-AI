import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'gradient'
  animated?: boolean   // pulsing glow border
  pulse?: boolean      // dot ping indicator
}

function Badge({ className, variant = "default", animated = false, pulse = false, children, ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    success: "border-transparent bg-success/20 text-success border border-success/30",
    warning: "border-transparent bg-warning/20 text-warning border border-warning/30",
    outline: "text-foreground border-border",
    gradient: "border-transparent text-white bg-gradient-to-r from-primary via-violet-600 to-indigo-500 shadow-sm",
  }

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
          "relative overflow-hidden",
          variants[variant],
          "animate-glow-pulse",
          className
        )}
        style={{ ['--glow-color' as string]: 'rgba(99, 102, 241, 0.5)' }}
        {...(props as React.ComponentPropsWithRef<typeof motion.div>)}
      >
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        )}
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...(props as React.ComponentPropsWithRef<typeof motion.div>)}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </motion.div>
  )
}

export { Badge }
