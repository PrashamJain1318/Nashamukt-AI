import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'heavy' | 'card'
  glow?: string        // e.g. 'cyan', 'purple', 'emerald'
  reflection?: boolean // sweep on hover (default true)
  animated?: boolean   // continuous shimmer
}

export function Glass({
  className,
  variant = 'card',
  glow,
  reflection = true,
  animated = false,
  children,
  ...props
}: GlassProps) {
  const variants = {
    light: "bg-background/40 backdrop-blur-sm border border-border/40",
    heavy: "bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg",
    card: "bg-card/70 dark:bg-card/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm rounded-2xl",
  }

  const glowClasses: Record<string, string> = {
    cyan: 'glow-cyan',
    purple: 'glow-purple',
    emerald: 'glow-emerald',
    orange: 'glow-orange',
  }

  return (
    <div
      className={cn(
        variants[variant],
        reflection && 'glass-reflection',
        glow && glowClasses[glow],
        animated && 'overflow-hidden relative',
        'transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {/* Animated continuous shimmer overlay */}
      {animated && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-0"
        >
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.04)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.04)_60%,transparent_100%)] bg-[length:250%_100%] animate-shimmer" />
        </div>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
