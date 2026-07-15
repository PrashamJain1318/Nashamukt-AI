import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartPulse, Wind, Droplet, Brain, Activity, ShieldCheck, Heart, Sparkles, Smile, Clock, Wallet, TrendingDown } from 'lucide-react'
import { Glass } from '@/components/ui/glass'
import { Progress } from '@/components/ui/progress'
import { useHealthData } from '@/hooks/api/useHealth'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const milestones = [
  { time: "20 Minutes", title: "Vitals Normalize", description: "Your heart rate and blood pressure drop back to normal levels.", icon: HeartPulse, color: "text-primary", bgColor: "bg-primary/20", progressColor: "bg-primary", progress: 100 },
  { time: "8 Hours", title: "Oxygen Returns", description: "Carbon monoxide levels in your blood drop by half. Oxygen levels return to normal.", icon: Wind, color: "text-primary", bgColor: "bg-primary/20", progressColor: "bg-primary", progress: 100 },
  { time: "24 Hours", title: "Toxins Clear", description: "Your body has completely cleared the nicotine and carbon monoxide.", icon: Droplet, color: "text-success", bgColor: "bg-success/20", progressColor: "bg-success", progress: 100 },
  { time: "3 Days", title: "Breathing Eases", description: "Bronchial tubes begin to relax, making breathing easier. Energy levels increase.", icon: Activity, color: "text-primary", bgColor: "bg-primary/20", progressColor: "bg-primary", progress: 80 },
  { time: "1 Week", title: "Senses Heighten", description: "Your sense of taste and smell start to improve significantly.", icon: Smile, color: "text-warning", bgColor: "bg-warning/20", progressColor: "bg-warning", progress: 40 },
  { time: "1 Month", title: "Circulation Boost", description: "Blood circulation improves. Lung function increases by up to 30%.", icon: Heart, color: "text-destructive", bgColor: "bg-destructive/20", progressColor: "bg-destructive", progress: 10 },
  { time: "3 Months", title: "Brain Reset", description: "Dopamine receptors begin to normalize. Cravings significantly decrease.", icon: Brain, color: "text-primary", bgColor: "bg-primary/20", progressColor: "bg-primary", progress: 5 },
  { time: "6 Months", title: "Immunity Strengthens", description: "Your immune system is much stronger. Coughing and shortness of breath decrease.", icon: ShieldCheck, color: "text-success", bgColor: "bg-success/20", progressColor: "bg-success", progress: 0 },
  { time: "1 Year", title: "Heart Risk Halved", description: "Your risk of coronary heart disease is now half that of a continuing smoker.", icon: Sparkles, color: "text-warning", bgColor: "bg-warning/20", progressColor: "bg-warning", progress: 0 }
]

export function HealthTimelinePage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'timeline'>('analytics')
  const { data, isLoading } = useHealthData()

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading Health Data...</div>

  const metrics = data?.metrics
  const charts = data?.charts

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Health Analytics</h1>
          <p className="text-muted-foreground">Monitor your physical recovery and mental well-being.</p>
        </div>
        
        {/* Simple Tabs */}
        <div className="flex bg-secondary/50 p-1 rounded-full w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 md:w-32 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 md:w-32 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'timeline' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
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
            {/* Top 5 Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              <MetricCard title="Smoke-Free" value={`${metrics?.smokeFreeDays} Days`} icon={<Wind />} color="text-info" bg="bg-info" />
              <MetricCard title="Health Score" value={`${metrics?.healthScore}/100`} icon={<HeartPulse />} color="text-primary" bg="bg-primary" />
              <MetricCard title="Money Saved" value={`₹${metrics?.moneySaved}`} icon={<Wallet />} color="text-success" bg="bg-success" />
              <MetricCard title="Hours Regained" value={`${metrics?.lifeHoursRegained}h`} icon={<Clock />} color="text-warning" bg="bg-warning" />
              <MetricCard title="Risk Reduction" value={`${metrics?.riskReduction}%`} icon={<TrendingDown />} color="text-destructive" bg="bg-destructive" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Glass variant="card" className="p-6 h-[400px]">
                <h3 className="font-bold text-lg mb-4">Daily Consumption vs Cravings</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.dailyConsumption} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="date" stroke="#888" tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }} />
                    <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Glass>

              <Glass variant="card" className="p-6 h-[400px]">
                <h3 className="font-bold text-lg mb-4">Mood Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={charts?.moodTrends}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" stroke="#888" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" tick={false} axisLine={false} />
                    <Radar name="Mood" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }} />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="date" stroke="#888" tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }} />
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
            className="relative mt-8"
          >

        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-border/50 -translate-x-1/2 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-primary" 
            initial={{ height: 0 }}
            whileInView={{ height: '35%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        <div className="space-y-12">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            const isEven = index % 2 === 0
            const isCompleted = milestone.progress === 100
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Center Node (Icon) */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-4 border-background flex items-center justify-center z-10 shadow-lg shadow-background/50">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${isCompleted ? milestone.bgColor : 'bg-secondary'}`}>
                    <Icon className={`h-5 w-5 ${isCompleted ? milestone.color : 'text-muted-foreground'}`} />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full pl-24 pr-4 md:px-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                  <Glass variant="card" className={`p-6 transition-all duration-300 ${isCompleted ? 'border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'opacity-70 grayscale-[0.5]'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold ${isCompleted ? milestone.color : 'text-muted-foreground'}`}>{milestone.time}</span>
                      {isCompleted && <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-semibold">Achieved</span>}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
                    
                    {!isCompleted && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} indicatorColor={milestone.progressColor} className="h-1.5 bg-secondary" />
                      </div>
                    )}
                  </Glass>
                </div>
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
      <Glass variant="card" className="p-5 relative overflow-hidden group h-full flex flex-col justify-between">
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
