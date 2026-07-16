import { motion, Variants } from 'framer-motion'
import { Wallet, TrendingUp, Calendar, CalendarDays, Coins, Trophy, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from '@/components/theme-provider'
import { chartColors } from '@/components/ui/chart'
import { ScrollReveal } from '@/components/ui/page-transition'

const savingsData = [
  { name: 'Jan', spent: 4000, saved: 0 },
  { name: 'Feb', spent: 3800, saved: 0 },
  { name: 'Mar', spent: 3500, saved: 0 },
  { name: 'Apr', spent: 1000, saved: 2500 }, // Quit date halfway
  { name: 'May', spent: 0, saved: 4000 },
  { name: 'Jun', spent: 0, saved: 4000 },
]

const achievements = [
  { title: "First ₹100 Saved", icon: Wallet, unlocked: true, color: "text-primary", bg: "bg-primary/20" },
  { title: "Movie Ticket", icon: Sparkles, unlocked: true, color: "text-success", bg: "bg-success/20" },
  { title: "Nice Dinner", icon: Trophy, unlocked: true, color: "text-warning", bg: "bg-warning/20" },
  { title: "New Phone", icon: Sparkles, unlocked: false, color: "text-muted-foreground", bg: "bg-secondary" },
]

export function MoneySavedPage() {
  const { theme } = useTheme()
  const activeTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  const colors = chartColors[activeTheme as 'light' | 'dark']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Money Saved</h1>
          <p className="text-muted-foreground">Watch your health and wallet grow simultaneously.</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div variants={itemVariants}>
          <Glass variant="card" animated={true} className="p-6 h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="h-24 w-24 text-success" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-muted-foreground">Daily Savings</h3>
                <div className="bg-success/20 p-2 rounded-xl"><TrendingUp className="h-4 w-4 text-success" /></div>
              </div>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter value={130} prefix="₹" className="text-3xl font-display font-bold" />
              </div>
            </div>
          </Glass>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Glass variant="card" animated={true} className="p-6 h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar className="h-24 w-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-muted-foreground">Weekly Savings</h3>
                <div className="bg-primary/20 p-2 rounded-xl"><Calendar className="h-4 w-4 text-primary" /></div>
              </div>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter value={910} prefix="₹" className="text-3xl font-display font-bold" />
              </div>
            </div>
          </Glass>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Glass variant="card" animated={true} className="p-6 h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CalendarDays className="h-24 w-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-muted-foreground">Monthly Savings</h3>
                <div className="bg-primary/20 p-2 rounded-xl"><CalendarDays className="h-4 w-4 text-primary" /></div>
              </div>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter value={4000} prefix="₹" className="text-3xl font-display font-bold" />
              </div>
            </div>
          </Glass>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Glass variant="card" animated={true} className="p-6 h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Wallet className="h-24 w-24 text-warning" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-muted-foreground">Yearly Projection</h3>
                <div className="bg-warning/20 p-2 rounded-xl"><Wallet className="h-4 w-4 text-warning" /></div>
              </div>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter value={48000} prefix="₹" className="text-3xl font-display font-bold" />
              </div>
            </div>
          </Glass>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ScrollReveal delay={0.2}>
            <Card className="h-full bg-card/50 backdrop-blur-md border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Savings vs Spending</CardTitle>
                  <p className="text-sm text-muted-foreground">Your financial trajectory over the last 6 months.</p>
                </div>
              </CardHeader>
              <CardContent className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip 
                      cursor={{ fill: 'var(--secondary)', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="spent" name="Money Spent" fill={colors.danger} radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="saved" name="Money Saved" fill={colors.success} radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </ScrollReveal>
        </motion.div>

        {/* Side Panels */}
        <motion.div variants={itemVariants} className="space-y-6">
          
          {/* Gamification Coins */}
          <Card className="bg-gradient-to-br from-warning/10 to-primary/10 border-border/50 overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Coins className="h-40 w-40 text-warning" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg flex items-center text-warning">
                <Coins className="h-5 w-5 mr-2 fill-warning" />
                Coins Earned
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-2 mt-2">
                <AnimatedCounter value={2450} className="text-5xl font-display font-bold text-foreground" />
                <span className="text-lg text-warning font-semibold">C</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 mb-4">You're 550 coins away from the Diamond Tier!</p>
              <Progress value={80} indicatorColor="bg-warning" className="h-2 bg-warning/20" glow={true} showValue={true} />
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Savings Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achieve, i) => {
                  const Icon = achieve.icon
                  const card = (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                        achieve.unlocked 
                          ? 'bg-secondary/30 border-border/50 hover:bg-secondary/50' 
                          : 'bg-background/50 border-dashed border-border opacity-50 grayscale'
                      }`}
                    >
                      <div className={`p-2 rounded-full mb-2 ${achieve.bg}`}>
                        <Icon className={`h-5 w-5 ${achieve.color}`} />
                      </div>
                      <span className="text-xs font-semibold">{achieve.title}</span>
                    </div>
                  )
                  return achieve.unlocked ? (
                    <motion.div key={i} whileHover={{ scale: 1.03 }}>
                      {card}
                    </motion.div>
                  ) : (
                    <div key={i}>{card}</div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          
        </motion.div>
      </div>
    </motion.div>
  )
}
