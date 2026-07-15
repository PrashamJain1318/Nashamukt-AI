import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Brain, HeartPulse } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="flex flex-col items-center pt-20 md:pt-32 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase"
        >
          Your Companion in Recovery
        </motion.div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Overcome Addiction with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">AI Support</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-light">
          Nashamukti AI provides 24/7 personalized support, craving management, and progress tracking to help you build a healthier, substance-free life.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 rounded-full h-14 shadow-lg shadow-primary/25">
              Start Your Journey
            </Button>
          </Link>
          <Link to="/chat" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-10 rounded-full h-14 bg-secondary/80 backdrop-blur">
              Talk to AI Now
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
        <FeatureCard 
          icon={<Brain className="h-8 w-8 text-primary" />}
          title="AI-Powered Empathy"
          description="A judgment-free conversational AI trained to understand and support you through difficult cravings."
          delay={0.4}
        />
        <FeatureCard 
          icon={<HeartPulse className="h-8 w-8 text-destructive" />}
          title="Progress Tracking"
          description="Visualize your journey. Track your sober days, mood, and triggers with beautiful insights."
          delay={0.5}
        />
        <FeatureCard 
          icon={<Shield className="h-8 w-8 text-success" />}
          title="Private & Secure"
          description="Your recovery journey is completely private. We use enterprise-grade security to protect your data."
          delay={0.6}
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-2xl bg-secondary/50 ring-1 ring-white/10 dark:ring-white/5">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
