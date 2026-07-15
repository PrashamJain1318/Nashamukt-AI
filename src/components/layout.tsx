import { Outlet, Link, useLocation } from "react-router-dom"
import { Activity, Home, MessageCircle, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { Footer } from "./footer"

export function Layout() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background font-sans pb-16 md:pb-0 relative overflow-hidden">
      {/* Background gradients for premium feel */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/30 blur-[100px] -z-10 pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4 justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">NashaMukt<span className="text-primary">AI</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/dashboard" className={cn("transition-colors hover:text-primary", location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground')}>Dashboard</Link>
            <Link to="/chat" className={cn("transition-colors hover:text-primary", location.pathname === '/chat' ? 'text-primary' : 'text-muted-foreground')}>AI Support</Link>
            <Link to="/design" className={cn("transition-colors hover:text-primary", location.pathname === '/design' ? 'text-primary' : 'text-muted-foreground')}>Design System</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
        <Outlet />
      </main>

      <Footer />
      <Toaster position="top-center" richColors theme={theme as 'light' | 'dark' | 'system'} />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/80 backdrop-blur-xl pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <Link to="/" className={cn("flex flex-col items-center justify-center w-full h-full hover:text-primary transition-colors", location.pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link to="/dashboard" className={cn("flex flex-col items-center justify-center w-full h-full hover:text-primary transition-colors", location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground')}>
            <Activity className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Dashboard</span>
          </Link>
          <Link to="/chat" className={cn("flex flex-col items-center justify-center w-full h-full hover:text-primary transition-colors", location.pathname === '/chat' ? 'text-primary' : 'text-muted-foreground')}>
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Chat</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
