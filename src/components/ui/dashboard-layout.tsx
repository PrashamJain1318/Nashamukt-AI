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
  User
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { CravingAssistant } from "./craving-assistant"

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCravingAssistantOpen, setIsCravingAssistantOpen] = useState(false)
  const { logout, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tracker", href: "/tracker", icon: CalendarDays },
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "Savings", href: "/savings", icon: Wallet },
    { name: "Health", href: "/health", icon: HeartPulse },
    { name: "AI Support", href: "/chat", icon: MessageSquare },
    { name: "Community", href: "/community", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">NashaMukt<span className="text-primary">AI</span></span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
        >
          <LogOut className="h-5 w-5 group-hover:text-destructive transition-colors" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-40">
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
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Dashboard Navbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display font-semibold text-lg hidden sm:block">
              Welcome back, {user?.name || 'Alex'} 👋
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <span className="text-lg">{theme === "dark" ? "🌞" : "🌙"}</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 ml-2">
              <span className="font-bold text-xs text-primary">{user?.name?.charAt(0) || 'A'}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button 
          size="lg" 
          variant="destructive" 
          className="rounded-full shadow-2xl shadow-destructive/50 h-14 px-6 font-bold text-base flex items-center gap-2 group overflow-hidden"
          onClick={() => setIsCravingAssistantOpen(true)}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          <HeartPulse className="h-5 w-5 animate-pulse" />
          <span>I'm Having a Craving</span>
        </Button>
      </motion.div>

      <CravingAssistant 
        isOpen={isCravingAssistantOpen} 
        onClose={() => setIsCravingAssistantOpen(false)} 
      />

      <Toaster position="top-center" richColors theme={theme as 'light' | 'dark' | 'system'} />
    </div>
  )
}
