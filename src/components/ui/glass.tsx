import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'heavy' | 'card'
}

export function Glass({ className, variant = 'card', ...props }: GlassProps) {
  const variants = {
    light: "bg-background/40 backdrop-blur-sm border border-border/40",
    heavy: "bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg",
    card: "bg-card/70 dark:bg-card/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm rounded-2xl",
  }

  return (
    <div className={cn(variants[variant], className)} {...props} />
  )
}
