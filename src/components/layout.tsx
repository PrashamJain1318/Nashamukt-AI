import { useEffect, useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Activity, Home, MessageCircle, Moon, Sun, Zap, Trophy, Sparkles, ArrowRight } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { Footer } from "./footer"
import { CustomCursor } from "./ui/cursor"
import { PageTransition } from "./ui/page-transition"
import { Glass } from "./ui/glass"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'AI Support' },
  { href: '/pitch', label: '🏆 Pitch Deck' },
]

export function Layout() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  // Scroll-aware header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans pb-16 md:pb-0 relative overflow-hidden">
      <CustomCursor />

      {/* Animated background gradients */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 pointer-events-none"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] -z-10 pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-violet-500/15 blur-[100px] -z-10 pointer-events-none animate-float" />

      {/* Header — shrinks and gains blur on scroll */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-border/50 bg-background/85 backdrop-blur-xl shadow-sm h-14"
            : "border-transparent bg-background/40 backdrop-blur-sm h-16"
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto flex h-full items-center px-4 justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors"
            >
              <Activity className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="font-display font-bold text-xl tracking-tight">
              NashaMukt<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Nav links with animated underline */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative py-1 transition-colors hover:text-primary",
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                  {/* Animated underline indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "light"
                      ? <Moon className="h-5 w-5" />
                      : <Sun className="h-5 w-5 text-yellow-400" />
                    }
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>

            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full px-5 hidden sm:flex">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="gradient" size="sm" className="rounded-full px-5 hidden sm:flex" magnetic>
                <Zap className="h-3.5 w-3.5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Page content with transitions */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
      <Toaster position="top-center" richColors theme={theme as 'light' | 'dark' | 'system'} />

      {/* Floating Hackathon Presentation Drawer Trigger */}
      {location.pathname !== '/pitch' && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
          className="fixed bottom-6 left-6 z-[60] hidden md:block"
        >
          <Link to="/pitch">
            <Glass 
              variant="heavy" 
              glow="cyan"
              className="p-4 rounded-2xl border-white/10 hover:border-primary/50 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.4)] group flex items-center gap-3 cursor-pointer"
            >
              <div className="h-10 w-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="h-5 w-5 fill-amber-500/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-display text-white">Hackathon Presentation</span>
                  <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground">Interactive Deck &amp; Live Playbooks</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-1" />
            </Glass>
          </Link>
        </motion.div>
      )}

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/90 backdrop-blur-xl pb-safe z-50"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {[
            { to: '/', icon: Home, label: 'Home' },
            { to: '/dashboard', icon: Activity, label: 'Dashboard' },
            { to: '/chat', icon: MessageCircle, label: 'Chat' },
          ].map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full transition-colors",
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                )}
              >
                <motion.div animate={{ scale: isActive ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span className="text-[10px] mt-1 font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
