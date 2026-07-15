import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight">NashaMukt<span className="text-primary">AI</span></span>
        </div>
        
        <div className="flex space-x-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-primary transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  )
}
