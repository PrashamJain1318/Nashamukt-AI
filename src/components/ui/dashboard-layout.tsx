import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  Activity,
  Bell,
  CalendarDays,
  Wallet,
  HeartPulse,
  BookOpen,
  User,
  Sparkles,
  Trophy,
  FlaskConical,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { CravingAssistant } from "./craving-assistant"
import { AccessibilityMenu } from "./accessibility-menu"
import { CustomCursor } from "./cursor"
import { PageTransition } from "./page-transition"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tracker", href: "/tracker", icon: CalendarDays },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Savings", href: "/savings", icon: Wallet },
  { name: "Health", href: "/health", icon: HeartPulse },
  { name: "AI Simulator", href: "/simulator", icon: FlaskConical },
  { name: "Insights", href: "/insights", icon: Sparkles },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "AI Support", href: "/chat", icon: MessageSquare },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

const sidebarVariants: any = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } },
  exit: { x: "-100%", opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
}

const navItemVariants: any = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border-r border-border/50 relative">
      {/* Logo row */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: [-5, 5, 0], scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors"
          >
            <Activity className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="font-display font-bold tracking-tight text-lg">
            NashaMukt<span className="text-primary">AI</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/70 text-muted-foreground transition-colors md:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {/* Hackathon Presenter Banner */}
        <div className="mb-4">
          <Link to="/pitch" onClick={onClose} className="block">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all text-xs font-semibold text-amber-400 cursor-pointer">
              <Trophy className="h-4 w-4 shrink-0 text-amber-400" />
              <span>🏆 Hackathon Presentation</span>
            </div>
          </Link>
        </div>

        {navItems.map((item, i) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <motion.div
              key={item.name}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  "hover:bg-secondary/60",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/25"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 relative z-10 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )}
                  size={18}
                />
                <span className="font-medium text-sm relative z-10">{item.name}</span>

                {/* Hover indicator dot */}
                {!isActive && (
                  <motion.div
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-border/50 shrink-0">
        <LogoutButton />
      </div>
    </div>
  )
}

function LogoutButton() {
  const { logout, user } = useAuth()
  return (
    <div className="space-y-2">
      {/* User info */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">{user?.name?.charAt(0) || 'A'}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">{user?.name || 'User'}</p>
          <p className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.97 }}
        onClick={logout}
        className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
      >
        <LogOut className="h-4 w-4 group-hover:text-destructive transition-colors" />
        <span className="font-medium text-sm">Logout</span>
      </motion.button>
    </div>
  )
}

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCravingAssistantOpen, setIsCravingAssistantOpen] = useState(false)
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background flex">
      <CustomCursor />

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 fixed inset-y-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 w-60 z-50 md:hidden shadow-2xl shadow-black/20"
            >
              <SidebarContent onClose={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
            <motion.h1
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display font-semibold text-lg hidden sm:block"
            >
              Welcome back, {user?.name?.split(' ')[0] || 'Alex'} 👋
            </motion.h1>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <AccessibilityMenu />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -60, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 60, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg leading-none"
                >
                  {theme === "dark" ? "🌞" : "🌙"}
                </motion.span>
              </AnimatePresence>
            </Button>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5" />
                <motion.span
                  className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
            </motion.div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 cursor-pointer ml-1 shadow-sm"
            >
              <span className="font-bold text-xs text-primary">{user?.name?.charAt(0) || 'A'}</span>
            </motion.div>
          </div>
        </header>

        {/* Page Content with Transitions */}
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </main>

      {/* Craving FAB */}
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(239,68,68,0.4)",
              "0 0 0 12px rgba(239,68,68,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-full"
        >
          <Button
            size="lg"
            variant="destructive"
            className="rounded-full shadow-2xl shadow-destructive/40 h-14 px-6 font-bold text-sm gap-2"
            onClick={() => setIsCravingAssistantOpen(true)}
          >
            <HeartPulse className="h-5 w-5 animate-pulse" />
            <span className="hidden sm:inline">I'm Having a Craving</span>
            <span className="sm:hidden">Craving</span>
          </Button>
        </motion.div>
      </motion.div>

      <CravingAssistant
        isOpen={isCravingAssistantOpen}
        onClose={() => setIsCravingAssistantOpen(false)}
      />

      <Toaster position="top-center" richColors theme={theme as 'light' | 'dark' | 'system'} />
    </div>
  )
}
