import { Suspense, lazy } from 'react'
import { SkeletonGrid, SkeletonCard } from '@/components/ui/skeleton'
import { motion, Variants } from "framer-motion"
import { Activity, Flame, Wallet, HeartPulse, Award, ChevronRight, Calendar, Target, Zap, Star } from 'lucide-react'
import { useDashboardData } from '@/hooks/api/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressChart } from "@/components/ui/chart"
import { QRCodeModal } from '@/components/ui/qr-code-modal'
import { ResponsiveContainer, BarChart } from "recharts"

// Holographic interactive components
import { HolographicCard } from '@/components/dashboard/HolographicCard'
import { InteractiveOrb } from '@/components/dashboard/InteractiveOrb'
import { MoneyCrystal } from '@/components/dashboard/MoneyCrystal'
import { StreakRing3D } from '@/components/dashboard/StreakRing3D'
import { ProgressRing3D } from '@/components/dashboard/ProgressRing3D'
import { FloatingMedal } from '@/components/dashboard/FloatingMedal'

// Lazy-load 3D background so it never blocks dashboard render
const DashboardScene = lazy(() => import('@/scenes/DashboardScene').then(m => ({ default: m.DashboardScene })))

export function Dashboard() {
  const { data, isLoading, isError } = useDashboardData()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
        <div className="h-8 w-56 skeleton-wave rounded-lg" />
        <SkeletonGrid cols={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><SkeletonCard className="h-[400px]" /></div>
          <SkeletonCard className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return <div className="p-8 text-destructive text-center">Failed to load dashboard data.</div>
  }

  return (
    <>
      {/* Ambient 3D particle background */}
      <Suspense fallback={null}>
        <DashboardScene />
      </Suspense>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto py-6 relative z-10"
      >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back, Prasham</h1>
          <p className="text-muted-foreground">You are doing great. Keep the momentum going!</p>
        </div>
        <div className="flex items-center space-x-4">
          <QRCodeModal />
          <Button className="hidden sm:flex rounded-full px-6 shadow-glow transition-transform hover:scale-105 active:scale-95">
            <Activity className="mr-2 h-4 w-4" /> Daily Check-in
          </Button>
        </div>
      </div>

      {/* Top 5 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Smoke-free progress ring */}
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="cyan" className="p-6 flex flex-col justify-between items-center text-center h-full">
            <div className="flex items-center gap-2 mb-4 self-start">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Smoke-Free</span>
            </div>
            <ProgressRing3D 
              value={Math.min(100, Math.round((data.smokeFreeDays / 30) * 100))} 
              color="#06b6d4" 
              glowColor="#22d3ee" 
              textColorClass="text-cyan-400"
              label={`${data.smokeFreeDays} Days`}
            />
            <span className="mt-4 text-xs text-muted-foreground block">30-day milestone progress</span>
          </HolographicCard>
        </motion.div>

        {/* Sobriety Streak */}
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="orange" className="p-6 flex flex-col justify-between items-center text-center h-full">
            <div className="flex items-center gap-2 mb-4 self-start">
              <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Streak</span>
            </div>
            <StreakRing3D days={data.streak} />
            <span className="mt-4 text-xs text-muted-foreground block">Keep the flame alive!</span>
          </HolographicCard>
        </motion.div>

        {/* Health Orb */}
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="cyan" className="p-6 flex flex-col justify-between items-center text-center h-full">
            <div className="flex items-center gap-2 mb-4 self-start">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health</span>
            </div>
            <InteractiveOrb />
            <span className="mt-4 text-sm font-display font-bold text-cyan-400 block">{data.healthScore}/100</span>
          </HolographicCard>
        </motion.div>

        {/* Money Crystal */}
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="emerald" className="p-6 flex flex-col justify-between items-center text-center h-full">
            <div className="flex items-center gap-2 mb-4 self-start">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved</span>
            </div>
            <MoneyCrystal />
            <span className="mt-4 text-sm font-display font-bold text-emerald-400 block">₹{data.moneySaved}</span>
          </HolographicCard>
        </motion.div>

        {/* XP progress ring */}
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="purple" className="p-6 flex flex-col justify-between items-center text-center h-full">
            <div className="flex items-center gap-2 mb-4 self-start">
              <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                <Star className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">XP</span>
            </div>
            <ProgressRing3D 
              value={Math.round((data.xp % 1000) / 10)} 
              color="#a855f7" 
              glowColor="#c084fc" 
              textColorClass="text-purple-400"
              label={`${data.xp} XP`}
            />
            <span className="mt-4 text-xs text-muted-foreground block">Level {Math.floor(data.xp / 1000) + 1}</span>
          </HolographicCard>
        </motion.div>
      </div>

      {/* Goal & Motivation Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="cyan" className="p-6 relative overflow-hidden h-full">
            <h3 className="font-semibold text-muted-foreground flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-cyan-400" /> Today's Goal
            </h3>
            <p className="text-lg font-display font-medium text-foreground">{data.todaysGoal}</p>
          </HolographicCard>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="purple" className="p-6 relative overflow-hidden h-full">
            <h3 className="font-semibold text-muted-foreground flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-purple-400" /> Daily Motivation
            </h3>
            <p className="text-lg font-display font-medium text-foreground italic">"{data.dailyMotivation}"</p>
          </HolographicCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HolographicCard glowColor="cyan" className="p-6 relative overflow-hidden h-full">
            <h3 className="font-semibold text-muted-foreground flex items-center gap-2 mb-4">
              <HeartPulse className="h-5 w-5 text-cyan-400" /> Daily Health Tip
            </h3>
            <p className="text-lg font-display font-medium text-foreground">
              Drink at least 8 glasses of water today to flush out toxins faster.
            </p>
          </HolographicCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle>Health & Mood Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <ProgressChart data={data.dailyStats} dataKey="value" color="primary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <HolographicCard glowColor="cyan" className="p-6">
            <h3 className="text-xl font-bold font-display mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-cyan-400" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {data.achievements.map((achievement, i) => (
                <div key={i} className="flex items-center p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50 group cursor-pointer">
                  <div className="mr-4 group-hover:scale-110 transition-transform">
                    {achievement.icon === 'Award' && <FloatingMedal type="gold" />}
                    {achievement.icon === 'Wallet' && <FloatingMedal type="silver" />}
                    {achievement.icon === 'Flame' && <FloatingMedal type="flame" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs flex items-center justify-center">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </HolographicCard>
        </motion.div>
      </div>
    </motion.div>
    </>
  )
}
