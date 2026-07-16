import { motion } from "framer-motion"
import { Activity } from "lucide-react"

/**
 * LoadingSpinner — branded multi-ring spinner with orbiting dot.
 * Used as the global Suspense fallback.
 */
export function LoadingSpinner() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-background"
      role="status"
      aria-label="Loading NashaMukt AI"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Multi-ring spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-500/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-transparent border-t-indigo-400/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          {/* Orbiting dot */}
          <motion.div
            className="absolute inset-0 flex items-start justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_currentColor] -mt-1 text-primary" />
          </motion.div>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary/60" />
          </div>
        </div>

        {/* Text */}
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-sm font-semibold text-foreground/80">NashaMukt AI</p>
          <p className="text-xs text-muted-foreground mt-0.5">Loading your journey…</p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-36 h-0.5 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-violet-500 to-indigo-500 rounded-full"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * InlineSpinner — small spinner for inside buttons, inline loaders.
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={`w-4 h-4 rounded-full border-2 border-current border-t-transparent ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * PageLoader — full-page loading overlay with progress animation.
 */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex h-64 w-full items-center justify-center"
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 text-primary/70" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
      </div>
    </div>
  )
}
