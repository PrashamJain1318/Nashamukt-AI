import { motion } from 'framer-motion'
import { HeartPulse, Wind, Droplet, Brain, Activity, ShieldCheck, Heart, Sparkles, Smile } from 'lucide-react'
import { Glass } from '@/components/ui/glass'
import { Progress } from '@/components/ui/progress'

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
  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <div className="mb-12 text-center md:text-left">
        <h1 className="font-display text-3xl font-bold mb-2">Health Recovery Timeline</h1>
        <p className="text-muted-foreground">Watch how your body miraculously heals itself over time.</p>
      </div>

      <div className="relative">
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
      </div>
    </div>
  )
}
