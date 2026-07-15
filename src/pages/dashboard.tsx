import { motion, Variants } from "framer-motion"
import { Activity, Flame, Wallet, HeartPulse, Award, ChevronRight } from 'lucide-react'
import { useDashboardData } from '@/hooks/api/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Glass } from "@/components/ui/glass"
import { ProgressChart } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart } from "recharts"

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
      <div className="w-full max-w-6xl mx-auto py-6 flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-48 bg-secondary/50 rounded-lg mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary/50 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-secondary/50 rounded-2xl"></div>
          <div className="h-[400px] bg-secondary/50 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return <div className="p-8 text-destructive text-center">Failed to load dashboard data.</div>
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto py-6"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back, Prasham</h1>
          <p className="text-muted-foreground">You are doing great. Keep the momentum going!</p>
        </div>
        <Button className="hidden sm:flex rounded-full px-6 shadow-glow transition-transform hover:scale-105 active:scale-95">
          <Activity className="mr-2 h-4 w-4" /> Daily Check-in
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Glass variant="card" className="p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-warning/10 rounded-full blur-2xl group-hover:bg-warning/20 transition-colors" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-warning/15 text-warning rounded-2xl">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground">Current Streak</h3>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-display font-bold text-foreground">{data.streak}</span>
              <span className="text-muted-foreground ml-2">Days</span>
            </div>
          </Glass>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Glass variant="card" className="p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-success/10 rounded-full blur-2xl group-hover:bg-success/20 transition-colors" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-success/15 text-success rounded-2xl">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground">Money Saved</h3>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-display font-bold text-foreground">₹{data.moneySaved.toLocaleString()}</span>
            </div>
          </Glass>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Glass variant="card" className="p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-primary/15 text-primary rounded-2xl">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground">Health Score</h3>
            </div>
            <div className="relative z-10 flex items-end">
              <span className="text-4xl font-display font-bold text-foreground">{data.healthScore}</span>
              <span className="text-muted-foreground ml-2 mb-1">/ 100</span>
            </div>
          </Glass>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Glass variant="card" className="p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-info/10 rounded-full blur-2xl group-hover:bg-info/20 transition-colors" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-info/15 text-info rounded-2xl">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-muted-foreground">Level</h3>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-display font-bold text-foreground">{data.level}</span>
            </div>
          </Glass>
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
          <Glass variant="card" className="p-6">
            <h3 className="text-xl font-bold font-display mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {data.achievements.map((achievement, i) => (
                <div key={i} className="flex items-center p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50 group cursor-pointer">
                  <div className="p-3 bg-background rounded-xl mr-4 shadow-sm group-hover:scale-110 transition-transform">
                    {achievement.icon === 'Award' && <Award className="h-5 w-5 text-warning" />}
                    {achievement.icon === 'Wallet' && <Wallet className="h-5 w-5 text-success" />}
                    {achievement.icon === 'Flame' && <Flame className="h-5 w-5 text-destructive" />}
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
          </Glass>
        </motion.div>
      </div>
    </motion.div>
  )
}
