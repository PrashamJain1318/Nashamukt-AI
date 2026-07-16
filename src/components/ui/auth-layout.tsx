import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Link } from "react-router-dom"
import { Glass } from "./glass"

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Glass variant="heavy" className="p-8 relative overflow-hidden">
          {/* Subtle inner reflection */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="flex flex-col items-center mb-8 text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
              <motion.div
                whileHover={{ rotate: [-5, 5, 0], scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/20 p-2.5 rounded-xl group-hover:bg-primary/30 transition-colors"
              >
                <Activity className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="font-display font-bold text-2xl tracking-tight">
                NashaMukt<span className="text-primary">AI</span>
              </span>
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-2xl font-bold tracking-tight"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                className="text-sm text-muted-foreground mt-2"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {children}
          </motion.div>
        </Glass>
      </motion.div>
    </div>
  )
}
