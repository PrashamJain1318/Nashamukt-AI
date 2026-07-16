import { useState, useEffect } from 'react'
import { SkeletonCard, SkeletonGrid } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartPulse, Wind, Droplet, Brain, Heart, Sparkles, Smile, Clock, Wallet, TrendingDown } from 'lucide-react'
import { Glass } from '@/components/ui/glass'
import { Progress } from '@/components/ui/progress'
import { useHealthData } from '@/hooks/api/useHealth'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Health3DScene } from '@/scenes/Health3DScene'
import { cn } from '@/lib/utils'
import { useAccessibility } from '@/contexts/AccessibilityContext'

function EcoOrganDiagram({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="absolute inset-0 bg-[#070b13] flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl">
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/60 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>ECO 2D Diagnostic Monitor</span>
      </div>
      <svg className="w-full h-64 text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        {/* Human Body Outline */}
        <path d="M50,15 A5,5 0 1,0 50,25 A5,5 0 1,0 50,15 Z" strokeWidth="0.5" stroke="rgba(255,255,255,0.15)" />
        <path d="M42,27 C42,27 48,29 50,29 C52,29 58,27 58,27 C58,27 59,35 59,45 L50,85 L41,45 C41,35 42,27 42,27 Z" strokeWidth="0.5" stroke="rgba(255,255,255,0.06)" />
        {/* Brain */}
        <circle cx="50" cy="20" r="3.5" fill={activeIndex >= 5 ? "#a855f7" : "rgba(168,85,247,0.1)"} className={activeIndex >= 5 ? "animate-pulse" : ""} stroke="#a855f7" strokeWidth="0.3" />
        {/* Heart */}
        <path d="M49,38 C47,36 45,36 45,38 C45,41 49,43 50,44 C51,43 55,41 55,38 C55,36 53,36 51,38 L50,39 Z" fill={activeIndex === 0 || activeIndex === 4 || activeIndex === 6 ? "#f43f5e" : "rgba(244,63,94,0.1)"} className={activeIndex === 0 || activeIndex === 4 || activeIndex === 6 ? "animate-pulse" : ""} stroke="#f43f5e" strokeWidth="0.3" />
        {/* Lungs */}
        <path d="M46,40 C43,40 43,45 46,47 C48,47 48,42 46,40 Z" fill={activeIndex === 1 || activeIndex === 2 || activeIndex === 4 ? "#22d3ee" : "rgba(34,211,238,0.1)"} stroke="#22d3ee" strokeWidth="0.3" />
        <path d="M54,40 C57,40 57,45 54,47 C52,47 52,42 54,40 Z" fill={activeIndex === 1 || activeIndex === 2 || activeIndex === 4 ? "#22d3ee" : "rgba(34,211,238,0.1)"} stroke="#22d3ee" strokeWidth="0.3" />
      </svg>
      <div className="text-center mt-4">
        <h4 className="text-xs font-mono font-bold text-slate-300">Diagnostic Status</h4>
        <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] mx-auto">
          Eco 2D display active. Throttled GPU WebGL render loops.
        </p>
      </div>
    </div>
  )
}

const milestones = [
  { time: "20 Minutes", title: "Vitals Normalize", description: "Your heart rate and blood pressure drop back to normal levels.", icon: HeartPulse, color: "text-rose-400", bgColor: "bg-rose-500/20", progressColor: "bg-rose-500", progress: 100 },
  { time: "8 Hours", title: "Oxygen Returns", description: "Carbon monoxide levels in your blood drop by half. Oxygen levels return to normal.", icon: Wind, color: "text-red-400", bgColor: "bg-red-500/20", progressColor: "bg-red-500", progress: 100 },
  { time: "24 Hours", title: "Toxins Clear", description: "Your body has completely cleared the nicotine and carbon monoxide.", icon: Droplet, color: "text-red-300", bgColor: "bg-red-400/20", progressColor: "bg-red-400", progress: 100 },
  { time: "1 Week", title: "Senses Heighten", description: "Nerve endings grow back. Your sense of taste and smell improve significantly.", icon: Smile, color: "text-cyan-400", bgColor: "bg-cyan-500/20", progressColor: "bg-cyan-500", progress: 100 },
  { time: "1 Month", title: "Circulation & Lung Boost", description: "Blood circulation improves. Lung function increases by up to 30%.", icon: Heart, color: "text-pink-400", bgColor: "bg-pink-500/20", progressColor: "bg-pink-500", progress: 100 },
  { time: "3 Months", title: "Brain Reset", description: "Dopamine receptors normalize. Emotional stability increases and cravings drop.", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-500/20", progressColor: "bg-purple-500", progress: 100 },
  { time: "1 Year", title: "Heart Risk Halved", description: "Your risk of coronary heart disease is now half that of a continuing smoker.", icon: Sparkles, color: "text-amber-400", bgColor: "bg-amber-500/20", progressColor: "bg-amber-500", progress: 100 }
]

const tooltips = [
  { organ: "Cardiovascular Sync", details: "Blood pressure and heart rate settle to base levels. Reduces acute load on blood vessels.", color: "text-rose-400" },
  { organ: "Oxygen Restoration", details: "CO molecules detach from hemoglobin, allowing blood cells to bond with vital oxygen.", color: "text-red-400" },
  { organ: "Toxic Cleanse", details: "Lungs begin sweeping cellular debris. Nicotine content decreases to 0% in circulation.", color: "text-red-300" },
  { organ: "Olfactory & Sensory Growth", details: "Olfactory nerves and tastebuds regenerate, boosting sensory acuity.", color: "text-cyan-400" },
  { organ: "Pulmonary Capacity Boost", details: "Lungs restore cilia, clearing congestion. Breathing capacity increases up to 30%.", color: "text-pink-400" },
  { organ: "Neuro-Dopamine Balance", details: "Dopamine receptors adjust to normal baseline. Emotional balance and self-control return.", color: "text-purple-400" },
  { organ: "Coronary Defense Shield", details: "Coronary heart disease risk drops to 50% of an active smoker. Vital longevity restored.", color: "text-amber-400" },
]

// Calculate progress relative to actual smoke-free days
const getMilestoneProgress = (stageIndex: number, smokeFreeDays: number = 0) => {
  const stageDays = [0.013, 0.33, 1, 7, 30, 90, 365] // 20m, 8h, 24h, 7d, 30d, 90d, 365d
  const targetDays = stageDays[stageIndex]
  if (smokeFreeDays >= targetDays) return 100
  const pct = Math.floor((smokeFreeDays / targetDays) * 100)
  return Math.max(0, Math.min(99, pct))
}

export function HealthTimelinePage() {
  const { data, isLoading } = useHealthData()
  const [activeStage, setActiveStage] = useState(0)
  const [activeTab, setActiveTab] = useState<'analytics' | 'timeline'>('analytics')
  const { isEcoMode } = useAccessibility()

  // Track closest milestone card to window center to drive 3D scene activeIndex
  useEffect(() => {
    if (activeTab !== 'timeline') return

    const handleScroll = () => {
      const cards = document.querySelectorAll('.milestone-card')
      let closestIdx = 0
      let minDistance = Infinity
      const center = window.innerHeight / 2

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        const dist = Math.abs(center - cardCenter)
        if (dist < minDistance) {
          minDistance = dist
          closestIdx = idx
        }
      })

      setActiveStage(closestIdx)
    }

    window.addEventListener('scroll', handleScroll)
    // Run initial trigger
    setTimeout(handleScroll, 100)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeTab])

  if (isLoading) return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      <div className="h-8 w-56 skeleton-wave rounded-lg" />
      <SkeletonGrid cols={4} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-[400px]" />
        <SkeletonCard className="h-[400px]" />
      </div>
    </div>
  )

  const metrics = data?.metrics
  const charts = data?.charts

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Health Analytics</h1>
          <p className="text-muted-foreground">Monitor your physical recovery and mental well-being.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-secondary/50 p-1 rounded-full w-full md:w-auto border border-white/5">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 md:w-32 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-[#0b1329] shadow-md border border-white/5 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 md:w-32 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'timeline' ? 'bg-[#0b1329] shadow-md border border-white/5 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Timeline
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              <MetricCard title="Smoke-Free" value={`${metrics?.smokeFreeDays} Days`} icon={<Wind />} color="text-info" bg="bg-info" />
              <MetricCard title="Health Score" value={`${metrics?.healthScore}/100`} icon={<HeartPulse />} color="text-primary" bg="bg-primary" />
              <MetricCard title="Money Saved" value={`₹${metrics?.moneySaved}`} icon={<Wallet />} color="text-success" bg="bg-success" />
              <MetricCard title="Hours Regained" value={`${metrics?.lifeHoursRegained}h`} icon={<Clock />} color="text-warning" bg="bg-warning" />
              <MetricCard title="Risk Reduction" value={`${metrics?.riskReduction}%`} icon={<TrendingDown />} color="text-destructive" bg="bg-destructive" />
            </div>

            {/* Recharts Displays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Glass variant="card" className="p-6 h-[400px]">
                <h3 className="font-bold text-lg mb-4">Daily Consumption vs Cravings</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.dailyConsumption} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" stroke="#666" tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderRadius: '12px', border: '1px solid #1e293b' }} />
                    <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Glass>

              <Glass variant="card" className="p-6 h-[400px]">
                <h3 className="font-bold text-lg mb-4">Mood Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={charts?.moodTrends}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis dataKey="subject" stroke="#666" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#666" tick={false} axisLine={false} />
                    <Radar name="Mood" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderRadius: '12px', border: '1px solid #1e293b' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </Glass>

              <Glass variant="card" className="p-6 h-[400px] lg:col-span-2">
                <h3 className="font-bold text-lg mb-4">Craving Intensity</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts?.cravings} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                    <defs>
                      <linearGradient id="colorCravings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" stroke="#666" tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#090d16', borderRadius: '12px', border: '1px solid #1e293b' }} />
                    <Area type="monotone" dataKey="count" stroke="var(--destructive)" fillOpacity={1} fill="url(#colorCravings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Glass>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col lg:flex-row gap-8 mt-4 items-start relative w-full"
          >
            {/* Left 3D Viewport Column (Sticky on desktop view) */}
            <div className="w-full lg:w-[45%] h-[360px] lg:h-[500px] lg:sticky lg:top-24 z-10 shrink-0 relative rounded-2xl overflow-hidden shadow-2xl">
              {isEcoMode ? (
                <EcoOrganDiagram activeIndex={activeStage} />
              ) : (
                <Health3DScene activeIndex={activeStage} />
              )}
              
              {/* Overlay dynamic diagnostic details (Educational tooltip HUD) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="absolute bottom-5 left-5 right-5 z-20 p-4 bg-[#02050c]/85 backdrop-blur-md rounded-xl border border-white/10 flex flex-col gap-1 shadow-inner"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />
                  
                  <span className={`text-[10px] font-mono tracking-widest font-bold uppercase ${tooltips[activeStage]?.color || 'text-cyan-400'}`}>
                    BIOLOGICAL ANALYTICAL INTELLIGENCE // {tooltips[activeStage]?.organ}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 font-mono">
                    {tooltips[activeStage]?.details}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Milestone Timeline Cards list */}
            <div className="flex-1 space-y-16 pb-32 pt-4 relative pl-6 border-l border-white/10 ml-4 lg:ml-6 w-full">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                const progress = getMilestoneProgress(index, metrics?.smokeFreeDays || 0)
                const isCompleted = progress === 100
                const isActive = activeStage === index

                return (
                  <motion.div 
                    key={index}
                    className={cn(
                      "milestone-card relative pl-10 transition-all duration-500",
                      isActive ? "scale-[1.02] opacity-100" : "opacity-40 hover:opacity-60"
                    )}
                    whileHover={{ y: -2, scale: 1.01 }}
                  >
                    {/* Glowing Node Points on vertical track line */}
                    <div className={cn(
                      "absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-[#090e1a] flex items-center justify-center z-20 transition-all duration-500",
                      isActive ? "bg-cyan-500 scale-110 shadow-[0_0_12px_rgba(6,182,212,0.6)]" : isCompleted ? milestone.bgColor : "bg-zinc-800"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors duration-500",
                        isActive ? "bg-white" : isCompleted ? "bg-cyan-400" : "bg-zinc-500"
                      )} />
                    </div>

                    {/* Milestone Glass Card container */}
                    <Glass 
                      variant="card" 
                      className={cn(
                        "p-6 border transition-all duration-300 shadow-xl",
                        isActive ? "border-cyan-500/40 bg-cyan-950/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "border-white/5 bg-secondary/5"
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={cn(
                          "text-xs font-mono font-bold tracking-wider uppercase",
                          isCompleted ? milestone.color : "text-muted-foreground"
                        )}>
                          {milestone.time}
                        </span>
                        {isCompleted ? (
                          <span className="text-[9px] bg-success/20 text-success px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                            Locked ({progress}%)
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2.5">
                        <Icon className={cn("h-5 w-5", isCompleted ? milestone.color : 'text-muted-foreground')} />
                        {milestone.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                        {milestone.description}
                      </p>
                      
                      {/* Interactive Telemetry progress indicators */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground tracking-widest">
                          <span>SYNC LEVEL</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress 
                          value={progress} 
                          indicatorColor={isCompleted ? milestone.progressColor : "bg-cyan-500"} 
                          className="h-1 bg-white/5"
                          glow
                          showValue
                        />
                      </div>
                    </Glass>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function MetricCard({ title, value, icon, color, bg }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Glass variant="card" className="p-5 relative overflow-hidden group h-full flex flex-col justify-between shadow-lg">
        <div className={`absolute -right-4 -top-4 w-24 h-24 ${bg}/10 rounded-full blur-2xl group-hover:${bg}/20 transition-colors`} />
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className={`p-2 ${bg}/15 ${color} rounded-xl`}>
            {icon}
          </div>
          <h3 className="font-semibold text-sm text-muted-foreground whitespace-nowrap">{title}</h3>
        </div>
        <div className="relative z-10">
          <span className="text-2xl lg:text-3xl font-display font-bold text-foreground">{value}</span>
        </div>
      </Glass>
    </motion.div>
  )
}
