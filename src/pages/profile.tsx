import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Award, Calendar, Flame, Wallet, CheckCircle, Target, Lock, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'
import { Progress } from '@/components/ui/progress'
import { useGamificationData, useCompleteMission } from '@/hooks/api/useGamification'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'

const ProfileAvatarScene = lazy(() => import('@/scenes/ProfileAvatarScene').then(m => ({ default: m.ProfileAvatarScene })))

export function ProfilePage() {
  const { data, isLoading } = useGamificationData()
  const completeMission = useCompleteMission()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  if (isLoading) return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      <SkeletonCard className="h-40" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-64" />
      </div>
    </div>
  )

  const levelProgress = data ? (data.xp / data.nextLevelXp) * 100 : 0;

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
          
          <motion.div
            className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shrink-0 shadow-lg relative z-10 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            animate={{ boxShadow: ['0 0 0px rgba(168,85,247,0)', '0 0 20px rgba(168,85,247,0.35)', '0 0 0px rgba(168,85,247,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Suspense fallback={null}>
              <ProfileAvatarScene />
            </Suspense>
            <User className="h-12 w-12 md:h-16 md:w-16 relative z-10 text-primary-foreground dark:text-foreground" />
          </motion.div>
          
          <div className="flex-1 text-center md:text-left relative z-10 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
                  Prasham Jain <Badge variant="gradient" className="bg-primary/20 text-primary border-primary/30">Lvl {data?.level}</Badge>
                </h2>
                <p className="text-muted-foreground">Joined October 2023</p>
              </div>
              <Button variant="ghost" size="sm" className="hidden md:flex mt-4 md:mt-0">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            
            {/* XP Progress Bar */}
            <div className="space-y-2 mt-4 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-warning flex items-center"><Star className="h-4 w-4 mr-1 fill-warning" /> {data?.xp} XP</span>
                <span className="text-muted-foreground">{data?.nextLevelXp} XP</span>
              </div>
              <Progress value={levelProgress} className="h-3 bg-secondary" indicatorColor="bg-warning" glow={true} striped={true} />
              <p className="text-xs text-muted-foreground text-right">{(data?.nextLevelXp || 0) - (data?.xp || 0)} XP to Next Level</p>
            </div>
          </div>
        </Glass>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Missions & Challenges */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-bold font-display flex items-center">
            <Zap className="h-5 w-5 mr-2 text-warning" />
            Active Quests
          </h3>
          <div className="space-y-4">
            <Glass variant="card" className="p-5 border-border/50">
              <h4 className="text-sm tracking-wider uppercase text-muted-foreground font-semibold mb-4">Daily Missions</h4>
              <div className="space-y-3">
                {data?.missions.map((mission: { id: number; type: string; title: string; xp: number; completed: boolean }) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${mission.completed ? 'bg-success/20 text-success' : 'bg-secondary text-muted-foreground'}`}>
                        {mission.completed ? <CheckCircle className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                      </div>
                      <span className={`font-medium ${mission.completed ? 'line-through text-muted-foreground' : ''}`}>{mission.title}</span>
                    </div>
                    {!mission.completed ? (
                      <Button size="sm" variant="secondary" className="h-8 text-xs font-bold text-warning" onClick={() => completeMission.mutate({ id: mission.id, xp: mission.xp })}>
                        +{mission.xp} XP
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-success px-2">Completed</span>
                    )}
                  </div>
                ))}
              </div>
            </Glass>

            <Glass variant="card" className="p-5 border-border/50">
              <h4 className="text-sm tracking-wider uppercase text-muted-foreground font-semibold mb-4">Weekly Challenges</h4>
              <div className="space-y-4">
                {data?.challenges.map((challenge: { id: number; title: string; xp: number; progress: number; total: number }) => (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{challenge.title}</span>
                      <span className="text-warning font-bold">+{challenge.xp} XP</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.total) * 100} className="h-2 bg-secondary" indicatorColor="bg-primary" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{challenge.progress} / {challenge.total}</span>
                      <span>{(challenge.progress / challenge.total * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
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
              {data?.achievements.map((badge: { id: number; icon: string; unlocked: boolean; name: string; description: string }) => {
                const IconComponent = badge.icon === 'Award' ? Award : badge.icon === 'Wallet' ? Wallet : badge.icon === 'Calendar' ? Calendar : Flame
                return (
                <div key={badge.id} className="flex flex-col items-center text-center group">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/30 shadow-[0_0_15px_rgba(var(--warning),0.2)] group-hover:scale-110' 
                      : 'bg-secondary border-2 border-border/50 grayscale opacity-50'
                  }`}>
                    {badge.unlocked ? (
                      <IconComponent className="h-8 w-8 text-warning drop-shadow-md" />
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
              )})}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  )
}
