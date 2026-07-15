import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Link } from "react-router-dom"
import { Glass } from "./glass"

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Glass variant="heavy" className="p-8">
          <div className="flex flex-col items-center mb-8 text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
              <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">NashaMukt<span className="text-primary">AI</span></span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          {children}
        </Glass>
      </motion.div>
    </div>
  )
}
