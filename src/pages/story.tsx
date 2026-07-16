import { Suspense, lazy, useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScrollProgress } from '@/hooks/three/useScrollProgress'
import { storyScrollProgress } from '@/utils/storyProgress'
import { useAccessibility } from '@/contexts/AccessibilityContext'

// Lazy-load the heavy Three.js scene
const ScrollStoryScene = lazy(() =>
  import('@/scenes/ScrollStoryScene').then(m => ({ default: m.ScrollStoryScene }))
)

// ─── Section metadata ─────────────────────────────────────────────────────────
const SECTIONS = [
  {
    index: 0,
    number: '01',
    label: 'Addiction',
    title: 'Trapped in the Cycle',
    body: 'Every cigarette, every drink — a moment of relief masking years of damage. The body adapts, the mind deceives, and the habit deepens silently.',
    accent: 'text-red-400',
    dot: 'bg-red-500',
    icon: '🚬',
  },
  {
    index: 1,
    number: '02',
    label: 'Health Damage',
    title: 'The Silent Toll',
    body: 'Tar coats the lungs. Liver cells die quietly. Blood pressure climbs. Your body is sending distress signals — are you listening?',
    accent: 'text-orange-400',
    dot: 'bg-orange-500',
    icon: '🫁',
  },
  {
    index: 2,
    number: '03',
    label: 'Decision to Quit',
    title: 'The Turning Point',
    body: 'There is a moment — a breath, a thought, a resolve — when everything changes. The hardest decision is also the most powerful one you will ever make.',
    accent: 'text-amber-400',
    dot: 'bg-amber-400',
    icon: '⚡',
  },
  {
    index: 3,
    number: '04',
    label: 'AI Coach',
    title: 'Never Quit Alone',
    body: 'NashaMukt AI analyzes your patterns, predicts cravings before they strike, and gives you personalized interventions — 24/7, always in your corner.',
    accent: 'text-indigo-400',
    dot: 'bg-indigo-500',
    icon: '🤖',
  },
  {
    index: 4,
    number: '05',
    label: 'Recovery',
    title: 'Your Body Heals',
    body: 'In 20 minutes, heart rate drops. In 8 hours, oxygen rises. In 72 hours, breathing eases. The timeline of healing begins the moment you decide.',
    accent: 'text-emerald-400',
    dot: 'bg-emerald-500',
    icon: '🌱',
  },
  {
    index: 5,
    number: '06',
    label: 'Healthy Life',
    title: 'Breathe Free. Live Fully.',
    body: 'Clear lungs. Sharp mind. More money. More years. More life. This is what NashaMukt AI is building for you — one breakthrough day at a time.',
    accent: 'text-violet-400',
    dot: 'bg-violet-400',
    icon: '✨',
  },
]

// ─── Progress dot indicator ───────────────────────────────────────────────────
function ProgressDots({ active }: { active: number }) {
  return (
    <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
      {SECTIONS.map((s, i) => (
        <div key={i} className="group relative flex items-center gap-3">
          <motion.div
            animate={{
              width: i === active ? 20 : 8,
              height: i === active ? 8 : 8,
              opacity: i === active ? 1 : i < active ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`rounded-full ${s.dot} cursor-pointer`}
          />
          {/* Label tooltip on hover */}
          <span className="hidden md:block text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
            {s.number} {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Section label overlay ────────────────────────────────────────────────────
function SectionOverlay({ section }: { section: (typeof SECTIONS)[0] }) {
  return (
    <motion.div
      key={section.index}
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 bottom-0 z-20 pb-20 md:pb-24 px-6 md:px-16 pointer-events-none"
    >
      {/* Section number + label */}
      <div className={`flex items-center gap-3 mb-4 ${section.accent}`}>
        <span className="text-4xl">{section.icon}</span>
        <div>
          <span className="text-xs font-mono tracking-[0.3em] opacity-70 block">
            {section.number} / {SECTIONS.length.toString().padStart(2, '0')}
          </span>
          <span className="text-sm font-semibold tracking-widest uppercase">{section.label}</span>
        </div>
      </div>

      {/* Main headline */}
      <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white mb-5 leading-[1.05] max-w-2xl">
        {section.title}
      </h2>

      {/* Body */}
      <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl font-light">
        {section.body}
      </p>

      {/* CTA on last section */}
      {section.index === SECTIONS.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pointer-events-auto"
        >
          <Link to="/register">
            <Button
              variant="gradient"
              magnetic={true}
              size="lg"
              className="h-14 px-10 rounded-full text-base font-semibold"
            >
              Start Your Journey ✨
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Scroll down hint ─────────────────────────────────────────────────────────
function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
    >
      <span className="text-xs text-white/50 tracking-widest uppercase font-mono">Scroll to journey</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-5 w-5 text-white/40" />
      </motion.div>
    </motion.div>
  )
}

// ─── Section progress bar (top) ───────────────────────────────────────────────
function TopProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] z-40 bg-white/10">
      <motion.div
        className="h-full bg-gradient-to-r from-violet-500 via-primary to-indigo-400"
        style={{ width: `${progress * 100}%` }}
        transition={{ duration: 0 }}
      />
    </div>
  )
}

// ─── Main Story Page ──────────────────────────────────────────────────────────
export function StoryPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [barProgress, setBarProgress] = useState(0)
  const { isEcoMode } = useAccessibility()

  // Sync section change callback
  const handleSectionChange = useCallback((idx: number) => {
    setActiveSection(idx)
  }, [])

  // Track progress for the top progress bar — poll every frame via rAF
  useEffect(() => {
    let rafId: number
    const tick = () => {
      setBarProgress(storyScrollProgress.current)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Connect GSAP ScrollTrigger
  useScrollProgress(containerRef, handleSectionChange, SECTIONS.length)

  return (
    <div className="bg-black text-white">
      {/* Back nav */}
      <Link
        to="/"
        className="fixed top-5 right-5 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden md:inline font-medium">Back to Home</span>
      </Link>

      {/* ── TALL SCROLL CONTAINER (6 sections × 100vh) ── */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${SECTIONS.length * 100}vh` }}
      >
        {/* ── STICKY VIEWPORT ── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Top progress bar */}
          <TopProgressBar progress={barProgress} />

          {/* Three.js canvas layer */}
          <Suspense
            fallback={
              <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black flex items-center justify-center">
                <div className="text-white/40 text-sm font-mono animate-pulse">Loading scene…</div>
              </div>
            }
          >
            {isEcoMode ? (
              <div className="absolute inset-0 bg-[#02050c] flex items-center justify-center border border-white/5">
                <div className="absolute top-6 left-6 flex items-center gap-1.5 text-[9px] font-mono text-amber-500 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Eco 2D Story Backdrop</span>
                </div>
                <div className="text-center p-6 space-y-2">
                  <div className="text-xl md:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                    JOURNEY STAGE // {activeSection + 1}
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    3D Canvas deactivated in Eco Mode. Watch the panels animate below as you scroll.
                  </p>
                </div>
              </div>
            ) : (
              <ScrollStoryScene />
            )}
          </Suspense>

          {/* Cinematic vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/40 via-transparent to-black/40" />

          {/* Vertical progress dots */}
          <ProgressDots active={activeSection} />

          {/* Section overlay text */}
          <AnimatePresence mode="wait">
            <SectionOverlay key={activeSection} section={SECTIONS[activeSection]} />
          </AnimatePresence>

          {/* First-section scroll hint */}
          <AnimatePresence>
            {activeSection === 0 && <ScrollHint />}
          </AnimatePresence>

          {/* Section counter (top-center) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none">
            <div className="h-px w-10 bg-white/20" />
            <span className="text-xs font-mono text-white/40 tracking-widest uppercase">
              Your Story of Freedom
            </span>
            <div className="h-px w-10 bg-white/20" />
          </div>

        </div>
      </div>

      {/* ── POST-SCROLL CTA SECTION ── */}
      <section className="relative min-h-screen bg-background flex items-center justify-center px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-center relative z-10"
        >
          <div className="text-5xl mb-6">✨</div>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-6 leading-tight text-foreground">
            Your Transformation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
              Starts Today
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Over 50,000 people have already begun their journey with NashaMukt AI.
            Join them — it is free, private, and always here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="gradient" magnetic={true} size="lg" className="h-14 px-12 rounded-full text-base">
                Begin Free Trial
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-base backdrop-blur-sm hover:bg-secondary/40">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
