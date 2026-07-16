import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  shake?: boolean
}

/**
 * Input — enhanced with:
 * - Floating animated label (rises on focus/fill)
 * - Focus glow ring animation
 * - Shake animation on error
 * - Success/error state icons
 * - Smooth border color transitions
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, shake, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(
      !!props.defaultValue || !!props.value || !!props.placeholder
    )

    const isFloating = isFocused || hasValue || !!props.placeholder

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    // If label is provided, render floating label wrapper
    if (label) {
      return (
        <div className="relative">
          <motion.div
            animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <input
              type={type}
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleChange}
              className={cn(
                "flex h-12 w-full rounded-xl border bg-background px-3 pt-4 pb-1 text-sm",
                "ring-offset-background transition-all duration-200",
                "placeholder:text-transparent",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "input-glow",
                error
                  ? "border-destructive focus:ring-destructive/30"
                  : success
                    ? "border-success focus:ring-success/30"
                    : "border-input focus:border-primary/50",
                className
              )}
              {...props}
            />
            {/* Floating label */}
            <motion.label
              animate={{
                y: isFloating ? -10 : 0,
                scale: isFloating ? 0.75 : 1,
                color: isFocused
                  ? 'hsl(var(--primary))'
                  : error
                    ? 'hsl(var(--destructive))'
                    : 'hsl(var(--muted-foreground))',
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-3 top-3.5 text-sm font-medium pointer-events-none origin-left"
            >
              {label}
            </motion.label>

            {/* Status icon */}
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {error
                    ? <XCircle className="h-4 w-4 text-destructive" />
                    : <CheckCircle2 className="h-4 w-4 text-success" />
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error / success message */}
          <AnimatePresence>
            {(error || success) && (
              <motion.p
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-xs mt-1.5 px-1",
                  error ? "text-destructive" : "text-success"
                )}
              >
                {error || success}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )
    }

    // Simple Input (no floating label)
    return (
      <motion.div
        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200 input-glow",
            error && "border-destructive",
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </motion.div>
    )
  }
)
Input.displayName = "Input"

export { Input }
