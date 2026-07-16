import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Play, ArrowRight, ArrowLeft, Activity, Brain, 
  Volume2, VolumeX, AlertTriangle, Coins 
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Badge } from '@/components/ui/badge'

const slides = [
  {
    title: "Nashamukti AI",
    subtitle: "Sobriety Reimagined through Generative AI & 3D Telemetry",
    narration: "Welcome to Nashamukti AI, a comprehensive digital therapeutics platform designed to tackle substance abuse through generative artificial intelligence, immersive gamification, and real-time physiological simulations.",
    content: (
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="relative w-28 h-28 flex items-center justify-center bg-primary/20 rounded-full border-2 border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        >
          <Brain className="h-14 w-14 text-primary animate-pulse" />
          <div className="absolute inset-0 border border-violet-500/20 rounded-full animate-ping" />
        </motion.div>
        
        <div className="space-y-2">
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold">Hackathon Presentation Console</p>
          <h2 className="text-3xl md:text-5xl font-display font-black">Empathetic Recovery</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Breaking cycles of tobacco, alcohol, and gutkha abuse with science-backed personal companions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center pt-4">
          <Badge variant="gradient" animated pulse>Gemini 1.5 Pro</Badge>
          <Badge variant="success" animated>Three.js WebGL</Badge>
          <Badge variant="warning" animated>Accessible UI</Badge>
        </div>
      </div>
    )
  },
  {
    title: "1. The Crisis",
    subtitle: "Understanding the True Cost of Substance Abuse",
    narration: "Substance abuse is a silent epidemic. In India alone, chewing tobacco like Gutkha accounts for 90% of oral cancer cases. Globally, smoking costs the economy over 1.4 trillion dollars annually, destroying millions of families.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> The Silent Epidemic
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In both rural and urban areas, cheap oral tobacco (Gutkha, Pan Masala) and alcohol target vulnerable demographics. Traditional recovery tools lack personalisation, scale, and immediate 24/7 crisis support.
          </p>
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-mono uppercase text-destructive font-bold">Critical Target Areas</p>
            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
              <li>High-toxicity chemical dependencies (nicotine, tobacco tar).</li>
              <li>Socio-economic cycles of daily wage depletion.</li>
              <li>Poor regional availability of healthcare and counselors.</li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 border border-border/50 rounded-2xl p-4 text-center flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-mono uppercase">Gutkha Link</span>
            <span className="text-3xl font-bold font-display text-destructive mt-1">90%</span>
            <span className="text-[10px] text-muted-foreground mt-1">of oral cancers</span>
          </div>
          <div className="bg-secondary/30 border border-border/50 rounded-2xl p-4 text-center flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-mono uppercase">Annual Cost</span>
            <span className="text-3xl font-bold font-display text-primary mt-1">$1.4T</span>
            <span className="text-[10px] text-muted-foreground mt-1">Global loss</span>
          </div>
          <div className="bg-secondary/30 border border-border/50 rounded-2xl p-4 text-center col-span-2 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-mono uppercase">Fatalities</span>
            <span className="text-2xl font-bold font-display text-orange-500 mt-1">11M+ Deaths</span>
            <span className="text-[10px] text-muted-foreground mt-1">Directly attributed yearly</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "2. The AI Solution",
    subtitle: "Empathetic Cognitive Therapy & 3D Interactive Telemetry",
    narration: "Our solution targets recovery through three core pillars. A personal Gemini AI chatbot trained on cognitive behavioral guidelines, a hardware accelerated 3D simulator to visualize organ healing, and a real-time savings tracker.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div className="bg-secondary/30 border border-border/50 rounded-2xl p-5 space-y-3">
          <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-sm">Gemini AI Coach</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
             Empathetic chatbot responding in real-time. Features specialized instructions for withdrawal distress and craving management.
          </p>
        </div>

        <div className="bg-secondary/30 border border-border/50 rounded-2xl p-5 space-y-3">
          <div className="h-10 w-10 bg-success/20 rounded-xl flex items-center justify-center text-success">
            <Activity className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-sm">3D Healing Engine</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Renders heart rate and lung recovery based on the user's specific substance profile, creating visual reinforcement.
          </p>
        </div>

        <div className="bg-secondary/30 border border-border/50 rounded-2xl p-5 space-y-3">
          <div className="h-10 w-10 bg-warning/20 rounded-xl flex items-center justify-center text-warning">
            <Coins className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-sm">Gamification Loop</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            XP levels, milestone medals, and money saved trackers reward days free, replacing cheap dopamine spikes with real progress.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "3. Technical Architecture",
    subtitle: "Production Ready, Code Split & Accessible",
    narration: "Our architecture is optimized for low performance mobile networks. Heavy 3D scenes are completely code split using React lazy, dynamic telemetry is cached locally via mock adapters, and full screen screen-readers are native.",
    content: (
      <div className="space-y-4 py-2 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border/50 rounded-xl p-3 flex gap-3 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold font-mono">React Suspense Chunks</p>
              <p className="text-[10px] text-muted-foreground">Three.js components dynamically lazy loaded</p>
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-3 flex gap-3 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold font-mono">Gemini AI Link</p>
              <p className="text-[10px] text-muted-foreground">Streaming LLM generation with custom context</p>
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-3 flex gap-3 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold font-mono">Axios API Cache</p>
              <p className="text-[10px] text-muted-foreground">Mock database persisting log and streak tables</p>
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-3 flex gap-3 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold font-mono">SO-118 Audio Context</p>
              <p className="text-[10px] text-muted-foreground">Native web speech synthesis screen reader</p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/40 border border-border/50 rounded-2xl p-4 text-xs font-mono">
          <p className="text-primary font-bold mb-2">// Edge Network Optimization</p>
          <p className="text-muted-foreground">
            Accessibility options support Eco-Mode (automatic WebGL throttling to 2D fallbacks), high contrast mode for medical clinics, and full layout scaling.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "4. Live Demo Playbook",
    subtitle: "Launch Instant seeded Profiles to Test",
    narration: "Ready to test the live application? Click one of the pre-seeded profiles below. This will automatically login and mock our database state, bypassing all registration forms for an instant test run.",
    content: (
      <div className="flex flex-col gap-4 py-2">
        <p className="text-xs text-muted-foreground text-center mb-2">Select a persona to instantly log in with pre-loaded milestones:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DemoCard 
            title="Alex (45d Clean)" 
            desc="Heavy Smoker profile. Level 5, ₹4,500 saved, unlocked calendar medals."
            persona="alex"
            badge="Standard Run"
            badgeColor="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
          />
          <DemoCard 
            title="Priya (Fresh Start)" 
            desc="Gutkha User profile. 0d streak, ready to trigger AI Plan & 3D body analysis."
            persona="priya"
            badge="Early Stage"
            badgeColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
          />
          <DemoCard 
            title="Rohan (Recent Slip)" 
            desc="Recent slip logged, displaying craving countdown timers and trigger warnings."
            persona="rohan"
            badge="Relapse State"
            badgeColor="bg-destructive/10 text-destructive border-destructive/20"
          />
        </div>
      </div>
    )
  }
]

function DemoCard({ title, desc, persona, badge, badgeColor }: { title: string; desc: string; persona: string; badge: string; badgeColor: string }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLaunch = async () => {
    // Clear old state
    localStorage.clear()
    
    // Seed profiles
    if (persona === 'alex') {
      const dbState = {
        smokeFreeDays: 45,
        streak: 45,
        healthScore: 88,
        moneySaved: 4500,
        xp: 1250,
        todaysGoal: "Complete 10 min breathing routine",
        dailyMotivation: "A journey of a thousand miles begins with a single step.",
        level: 5,
      }
      localStorage.setItem('nashamukti_dashboard', JSON.stringify(dbState))
      await login("Alex W.", "alex@nashamukti.org")
    } else if (persona === 'priya') {
      const dbState = {
        smokeFreeDays: 0,
        streak: 0,
        healthScore: 64,
        moneySaved: 0,
        xp: 150,
        todaysGoal: "Read your AI Recovery Plan",
        dailyMotivation: "Your past does not equal your future. Focus on today.",
        level: 1,
      }
      localStorage.setItem('nashamukti_dashboard', JSON.stringify(dbState))
      await login("Priya M.", "priya@nashamukti.org")
    } else {
      const dbState = {
        smokeFreeDays: 0,
        streak: 0,
        healthScore: 50,
        moneySaved: 0,
        xp: 340,
        todaysGoal: "Engage with Jarvis AI Chat",
        dailyMotivation: "Relapses are setbacks, not ends. Rise up!",
        level: 2,
      }
      localStorage.setItem('nashamukti_dashboard', JSON.stringify(dbState))
      
      const logs = [
        { id: 1, date: new Date().toISOString(), product: "Smoking", quantity: 6, time: "18:30", mood: "Anxious", trigger: "Social gathering", notes: "Lost control" }
      ]
      localStorage.setItem('nashamukti_logs', JSON.stringify(logs))
      await login("Rohan S.", "rohan@nashamukti.org")
    }
    
    // Redirect
    if (persona === 'priya') {
      navigate('/plan')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col justify-between items-start text-left h-full hover:border-primary/50 transition-colors">
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center w-full">
          <h4 className="font-bold text-sm truncate">{title}</h4>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
      <Button 
        onClick={handleLaunch} 
        size="sm" 
        variant="gradient" 
        className="w-full mt-4 rounded-xl flex items-center justify-center gap-1.5"
      >
        <Play className="h-3.5 w-3.5 fill-white" /> Launch Playbook
      </Button>
    </div>
  )
}

export function PitchPage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const { isVoiceEnabled, toggleVoice, speak } = useAccessibility()
  const navigate = useNavigate()

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      const next = activeSlide + 1
      setActiveSlide(next)
      if (isVoiceEnabled) {
        speak(slides[next].narration)
      }
    }
  }

  const handlePrev = () => {
    if (activeSlide > 0) {
      const prev = activeSlide - 1
      setActiveSlide(prev)
      if (isVoiceEnabled) {
        speak(slides[prev].narration)
      }
    }
  }

  const handleSpeechToggle = () => {
    toggleVoice()
    // Speech toggle callback fires after state transition, read current slide
    setTimeout(() => {
      if (!isVoiceEnabled) {
        speak(slides[activeSlide].narration)
      } else {
        window.speechSynthesis.cancel()
      }
    }, 100)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 px-4">
        <Glass variant="heavy" className="p-8 relative overflow-hidden border-white/10 rounded-3xl min-h-[480px] flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          {/* Top Row: Navigation and Narration Toggle */}
          <div className="flex justify-between items-center pb-4 border-b border-border/50 shrink-0 gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-secondary/80 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold font-display">Hackathon Presentation Deck</h1>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Nashamukti AI // Pitch Console</p>
              </div>
            </div>

            <Button 
              onClick={handleSpeechToggle} 
              variant="outline" 
              size="sm" 
              className={`rounded-full px-4 gap-2 text-xs font-semibold ${isVoiceEnabled ? 'text-primary border-primary/30 bg-primary/5' : ''}`}
            >
              {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5 animate-pulse" /> : <VolumeX className="h-3.5 w-3.5" />}
              {isVoiceEnabled ? "Voice Narrator: On" : "Voice Narrator: Off"}
            </Button>
          </div>

          {/* Slide Window Content */}
          <div className="flex-1 py-8 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="space-y-1 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                    {slides[activeSlide].title}
                  </h2>
                  <p className="text-sm font-semibold text-foreground/80">
                    {slides[activeSlide].subtitle}
                  </p>
                </div>

                <div className="min-h-[220px] flex items-center justify-center">
                  {slides[activeSlide].content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Footer / Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-border/50 shrink-0">
            <div className="text-xs font-mono text-muted-foreground">
              SLIDE {activeSlide + 1} / {slides.length}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handlePrev} 
                disabled={activeSlide === 0} 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-4"
              >
                Prev
              </Button>
              {activeSlide < slides.length - 1 ? (
                <Button 
                  onClick={handleNext} 
                  variant="gradient" 
                  size="sm" 
                  className="rounded-full px-5 flex items-center gap-1.5"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="gradient" 
                  size="sm" 
                  className="rounded-full px-5 flex items-center gap-1.5"
                >
                  Demo Sandbox <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </Glass>
      </div>
    </div>
  )
}
