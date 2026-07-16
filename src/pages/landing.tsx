import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Suspense, lazy, useRef } from 'react'
import { useAccessibility } from '@/contexts/AccessibilityContext'

import { Shield, Brain, HeartPulse, Activity, MessageSquare, TrendingUp, Sparkles, Star, Download, ChevronRight, CheckCircle2, ChevronDown, Quote } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Glass } from '@/components/ui/glass'
import { CanvasCursorTrail } from '@/components/ui/canvas-trail'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Lazy-load heavy 3D scenes — they won't block the initial paint
const HeroGlassOrbScene = lazy(() => import('@/scenes/HeroGlassOrbScene').then(m => ({ default: m.HeroGlassOrbScene })))

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      <HeroSection />
      <WhyThisMattersSection />
      <HowItWorksSection />
      <AICoachPreviewSection />
      <HealthTimelinePreviewSection />
      <FeaturesGridSection />
      <TestimonialsSection />
      <FAQSection />
      <DownloadAppSection />
    </div>
  )
}

// 1. HERO SECTION
function HeroSection() {
  const { isEcoMode } = useAccessibility()
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    section.style.setProperty('--mouse-x', `${x}px`)
    section.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between overflow-hidden bg-background"
    >
      {/* Canvas Cursor Trail (60 FPS particles) */}
      {!isEcoMode && <CanvasCursorTrail />}

      {/* Dynamic Cursor Glow (Radial gradient backplate) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(600px_circle_at_var(--mouse-x,_0px)_var(--mouse-y,_0px),rgba(139,92,246,0.15),transparent_40%)] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Background soft mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-violet-950/5 to-background -z-10 pointer-events-none" />

      {/* Floating decorative parallax symbols */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 opacity-20"
        >
          <Shield className="h-10 w-10 text-primary blur-[0.5px]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/4 opacity-15"
        >
          <Brain className="h-8 w-8 text-cyan-400 blur-[0.5px]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/3 opacity-20"
        >
          <Sparkles className="h-6 w-6 text-violet-400 blur-[0.5px]" />
        </motion.div>
      </div>

      {/* Main Grid content */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex items-center justify-center py-12 md:py-20 px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Side: Typography and CTAs */}
          <div className="flex flex-col text-left space-y-6 max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-xs font-semibold text-primary shadow-sm hover:border-primary/20 transition-all duration-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Future of Addiction Recovery</span>
            </motion.div>

            {/* Headline with word stagger reveal */}
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-foreground">
                {"Break Free.".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1, type: "spring", stiffness: 100 }}
                    className="inline-block mr-3"
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                {"Reclaim Your Life.".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 + i * 0.1, type: "spring", stiffness: 100 }}
                    className="inline-block mr-3 text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-blue-400"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed font-light"
            >
              NashaMukt AI helps users overcome addiction through AI guidance, personalized recovery plans, progress tracking, and community support.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="gradient"
                  className="w-full h-14 px-8 text-base rounded-full shadow-lg font-bold"
                  magnetic
                >
                  Start Recovery <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/chat" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full h-14 px-8 text-base rounded-full border border-border/50 hover:bg-secondary/80 font-bold"
                  magnetic
                >
                  Talk to AI Counselor
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Immersive Orb or 2D Fallback */}
          <div className="w-full flex items-center justify-center relative min-h-[360px] md:min-h-[500px]">
            {isEcoMode ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-[420px] aspect-square rounded-full border border-white/5 bg-[#070b13] flex flex-col items-center justify-center p-6 relative shadow-inner overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                
                {/* Pulsing 2D gradient orb */}
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary/30 via-violet-500/20 to-cyan-500/30 blur-2xl animate-pulse" />
                
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/60 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Eco 2D Mode active</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-6 max-w-xs font-mono">
                  WebGL 3D Canvas throttled. Pulsing 2D ambient gradient displays in place of shader animations.
                </p>
              </motion.div>
            ) : (
              <Suspense fallback={
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background flex items-center justify-center">
                  <div className="text-muted-foreground text-xs font-mono animate-pulse">Initializing 3D Space...</div>
                </div>
              }>
                <HeroGlassOrbScene />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* Bouncing scroll down mouse indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer z-20 hidden md:flex"
        onClick={() => {
          const nextSection = document.getElementById('why-this-matters')
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }
        }}
      >
        <span className="text-[9px] uppercase font-mono tracking-widest text-muted-foreground/80">Explore More</span>
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center p-1.5 backdrop-blur-sm bg-background/30 hover:border-primary/50 transition-colors">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>

      {/* ── STATS BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 w-full border-t border-border/30 bg-background/70 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 50000, suffix: '+', label: 'Active Users' },
            { value: 120, suffix: 'k', label: 'Cravings Beaten' },
            { value: 94, suffix: '%', label: 'Success Rate' },
            { value: 24, suffix: '/7', label: 'AI Support' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// 2. WHY THIS MATTERS
function WhyThisMattersSection() {
  return (
    <section id="why-this-matters" className="py-24 px-4 bg-secondary/30 border-y border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">The True Cost of Addiction</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">It's not just a habit. It's a silent epidemic affecting millions of lives and families every single day.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Tobacco", stat: "8M+", desc: "deaths globally every year due to direct tobacco use.", color: "text-red-500" },
            { title: "Alcohol", stat: "3M+", desc: "deaths annually resulting from harmful use of alcohol.", color: "text-orange-500" },
            { title: "Gutkha", stat: "90%", desc: "of global oral cancer cases are linked to smokeless tobacco.", color: "text-amber-500" },
            { title: "Economy", stat: "$1.4T", desc: "global economic cost of smoking annually.", color: "text-primary" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{item.title}</h4>
              <h3 className={`text-5xl font-bold mb-4 font-display ${item.color}`}>{item.stat}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 3. HOW IT WORKS
function HowItWorksSection() {
  const steps = [
    { title: "Register & Commit", desc: "Create your secure profile and set your quit date.", icon: Shield },
    { title: "AI Analysis", desc: "Our AI learns your triggers and creates a personalized plan.", icon: Brain },
    { title: "Daily Tracking", desc: "Log your mood, cravings, and money saved every day.", icon: Activity },
    { title: "Freedom", desc: "Unlock achievements, heal your body, and reclaim your life.", icon: HeartPulse },
  ]

  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-20">Your Path to Freedom</h2>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-border via-primary to-border -translate-y-1/2 -z-10 opacity-30" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative text-center"
            >
              <div className="w-20 h-20 mx-auto bg-background border-2 border-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Step {i + 1}: {step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 4. AI COACH PREVIEW
function AICoachPreviewSection() {
  return (
    <section className="py-24 px-4 bg-primary/5 border-y border-primary/10 overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <MessageSquare className="h-4 w-4" /> Available 24/7
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Meet Your New <br/>Personal Coach</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience cravings at 2 AM? Our Gemini-powered AI coach is always awake, always empathetic, and trained specifically in addiction recovery to talk you through your toughest moments.
          </p>
          <ul className="space-y-4 mb-10">
            {["Science-backed coping strategies", "Zero judgment, complete privacy", "Personalized breathing exercises", "Instant emergency support"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
              </li>
            ))}
          </ul>
          <Link to="/chat">
            <Button size="lg" className="rounded-full px-8 h-12">Try the AI Coach Now</Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-3xl rounded-[3rem] -z-10" />
          <Glass variant="card" className="border-border/50 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8 border-b border-border/50 pb-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">NashaMukt AI</h3>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0" />
                <div className="bg-secondary rounded-2xl rounded-tl-sm p-4 text-sm max-w-[80%]">
                  I'm having a really strong craving right now. I don't know if I can do this.
                </div>
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 text-sm max-w-[80%]">
                  I hear you, and it's completely normal to feel this way. The craving feels overwhelming, but remember it will pass in a few minutes. Let's do a quick breathing exercise together. Inhale for 4 seconds...
                </div>
              </div>
            </div>
          </Glass>
        </motion.div>
      </div>
    </section>
  )
}

// 5. HEALTH TIMELINE PREVIEW
function HealthTimelinePreviewSection() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Watch Your Body Heal</h2>
        <p className="text-xl text-muted-foreground mb-16">Our beautiful interactive health timeline shows exactly how your body repairs itself, second by second, from the moment you quit.</p>
        
        <Glass className="p-8 rounded-3xl border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success to-primary" />
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { time: "20 Minutes", desc: "Blood pressure and heart rate drop to normal." },
              { time: "8 Hours", desc: "Carbon monoxide levels in blood drop to normal." },
              { time: "48 Hours", desc: "Nerve endings begin to regrow. Smell & taste improve." }
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-border/50 pl-6 relative">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-success ring-4 ring-background" />
                <h3 className="font-bold text-lg mb-2 text-success">{item.time}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/health">
              <Button variant="secondary" className="rounded-full">View Full Timeline</Button>
            </Link>
          </div>
        </Glass>
      </div>
    </section>
  )
}

// 6. FEATURES GRID
function FeaturesGridSection() {
  const features = [
    { title: "Money Saved Tracker", desc: "Watch your savings grow daily. Set financial goals with the money you're no longer spending on addiction.", icon: TrendingUp, col: "md:col-span-2" },
    { title: "Triggers Journal", desc: "Identify patterns and predict cravings before they happen.", icon: Activity, col: "md:col-span-1" },
    { title: "Anonymous Community", desc: "Share stories and support others without revealing your identity.", icon: Shield, col: "md:col-span-1" },
    { title: "Gamification & Badges", desc: "Earn achievements for your milestones to stay motivated.", icon: Star, col: "md:col-span-2" },
  ]

  return (
    <section className="py-24 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center">Everything You Need to Succeed</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-background p-8 rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors group ${feature.col}`}
            >
              <feature.icon className="h-8 w-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 7. TESTIMONIALS
function TestimonialsSection() {
  return (
    <section className="py-32 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">Lives Changed</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { quote: "The AI coach talked me down from a massive craving at 3 AM. I would have relapsed without it.", name: "Rahul S.", days: "142 Days Sober" },
            { quote: "Seeing the money saved tracker hit ₹50,000 made me realize how much I was burning. Literally.", name: "Priya M.", days: "89 Days Sober" },
            { quote: "The health timeline is so motivating. Knowing my lungs are healing keeps me going.", name: "Amit K.", days: "210 Days Sober" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Glass variant="card" className="p-8 h-full rounded-3xl">
                <Quote className="h-8 w-8 text-primary/40 mb-6" />
                <p className="text-lg font-medium mb-8 leading-relaxed">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-success font-medium">{item.days}</p>
                  </div>
                </div>
              </Glass>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 8. FAQ
function FAQSection() {
  const faqs = [
    { q: "Is the AI Coach completely private?", a: "Yes. Your conversations are end-to-end encrypted and never shared with third parties. You can even use the app anonymously." },
    { q: "Is NashaMukt AI free?", a: "The core features, including the tracker and basic AI coach, are completely free. We offer a premium tier for advanced AI features." },
    { q: "Can it help with multiple addictions?", a: "Absolutely. You can track smoking, alcohol, gutkha, and other substances simultaneously." },
  ]
  
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 px-4 bg-secondary/30 border-y border-border/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-display font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-background rounded-2xl border border-border/50 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <span className="font-bold text-lg">{faq.q}</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openIndex === i ? "rotate-180" : "")} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 9. DOWNLOAD CTA
function DownloadAppSection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">Ready to Quit?</h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join thousands of others who have taken control of their lives. Your future self will thank you.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
              <Download className="mr-2 h-5 w-5" /> Download App
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
