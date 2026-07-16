import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorColor?: string
  glow?: boolean
  striped?: boolean
  label?: string
  showValue?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value = 0,
    indicatorColor = "bg-primary",
    glow = false,
    striped = false,
    label,
    showValue = false,
    ...props
  }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value))

    return (
      <div className="space-y-1">
        {(label || showValue) && (
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            {label && <span>{label}</span>}
            {showValue && <span className="font-medium">{Math.round(clampedValue)}%</span>}
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-secondary/50",
            className
          )}
          {...props}
        >
          <motion.div
            className={cn(
              "h-full rounded-full relative",
              indicatorColor,
              striped && [
                "bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.15)_8px,rgba(255,255,255,0.15)_16px)]",
                "bg-[length:30px_30px]",
                "animate-gradient-x",
              ],
              glow && "progress-glow"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow trail */}
            {glow && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full blur-sm opacity-80"
                style={{ background: 'currentColor' }}
              />
            )}
          </motion.div>
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
