import { motion } from 'framer-motion'
import { User, Settings, Award, Calendar, Flame, Wallet, CheckCircle, Target, Lock, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'

const stats = [
  { label: "Total Days Sober", value: "45", icon: Calendar, color: "text-primary" },
  { label: "Longest Streak", value: "90", icon: Flame, color: "text-warning" },
  { label: "Money Saved", value: "₹4,500", icon: Wallet, color: "text-success" },
  { label: "Check-ins", value: "112", icon: CheckCircle, color: "text-info" },
]

const goals = [
  "Run a half-marathon without losing breath.",
  "Save enough money for a family vacation.",
  "Be a healthy role model for my kids.",
]

const badges = [
  { id: 1, name: "First Step", description: "Logged your first day.", icon: Award, unlocked: true },
  { id: 2, name: "1 Week Clean", description: "Completed 7 days sober.", icon: Award, unlocked: true },
  { id: 3, name: "1 Month Clean", description: "Completed 30 days sober.", icon: Award, unlocked: true },
  { id: 4, name: "Piggy Bank", description: "Saved your first ₹1000.", icon: Wallet, unlocked: true },
  { id: 5, name: "Half Year", description: "Completed 6 months sober.", icon: Calendar, unlocked: false },
  { id: 6, name: "1 Year Clean", description: "Completed 365 days sober.", icon: Flame, unlocked: false },
]

export function ProfilePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto py-6 space-y-8"
    >
      <div className="mb-2">
        <h1 className="font-display text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your identity, track your lifetime stats, and view your trophies.</p>
      </div>

      {/* Identity Header */}
      <motion.div variants={itemVariants}>
        <Glass variant="card" className="p-6 md:p-8 border-border/50 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-background shrink-0 shadow-lg relative z-10">
            <User className="h-12 w-12 md:h-16 md:w-16" />
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Prasham Jain</h2>
            <p className="text-muted-foreground mb-4">Joined October 2023</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-warning/15 text-warning">
                🔥 45 Day Streak
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-success/15 text-success">
                🏆 Level 5
              </span>
            </div>
          </div>

          <Button variant="secondary" className="relative z-10 mt-4 md:mt-0 w-full md:w-auto">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Glass>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistics */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-bold font-display flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Lifetime Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <Glass key={i} variant="card" className="p-4 border-border/50 text-center flex flex-col items-center justify-center">
                <stat.icon className={`h-8 w-8 mb-3 ${stat.color} opacity-80`} />
                <span className="text-2xl font-bold mb-1">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
              </Glass>
            ))}
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-bold font-display flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            My Quit Goals
          </h3>
          <Glass variant="card" className="p-6 border-border/50 h-[calc(100%-2.5rem)]">
            <ul className="space-y-4">
              {goals.map((goal, i) => (
                <li key={i} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mr-4 mt-0.5">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-foreground/90 font-medium leading-relaxed">{goal}</p>
                </li>
              ))}
            </ul>
            <Button variant="ghost" className="w-full mt-6 text-sm text-primary">
              + Edit Goals
            </Button>
          </Glass>
        </motion.div>
      </div>

      {/* Trophy Case */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-bold font-display flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Trophy Case
        </h3>
        <Card className="bg-card/50 backdrop-blur-md border-border/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center group">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/30 shadow-[0_0_15px_rgba(var(--warning),0.2)] group-hover:scale-110' 
                      : 'bg-secondary border-2 border-border/50 grayscale opacity-50'
                  }`}>
                    {badge.unlocked ? (
                      <badge.icon className="h-8 w-8 text-warning drop-shadow-md" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-sm font-bold mb-1 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-tight px-2">
                    {badge.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  )
}
