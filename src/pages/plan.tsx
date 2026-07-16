import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Glass } from '@/components/ui/glass'
import { Brain, Activity, TrendingDown, Target, Zap, ShieldAlert, CheckCircle2, ChevronRight, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { ScrollReveal, FadeIn } from '@/components/ui/page-transition'


interface AnalysisData {
  addictionScore: number;
  healthRiskScore: number;
  financialImpact: {
    monthlyWasted: number;
    yearlyWasted: number;
  };
  timeline: { time: string; desc: string }[];
  sevenDayPlan: { day: number; title: string; desc: string }[];
  thirtyDayPlan: string;
  dailyAdvice: {
    motivation: string;
    goal: string;
    alternative: string;
    prevention: string;
  };
}

export function PlanPage() {
  const [data, setData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch the AI Analysis
    const fetchAnalysis = async () => {
      try {
        // In a real app, we would pass the onboarding data from global state or localStorage
        // Here we just pass mock data to trigger the mock server
        const response = await apiClient.post('/ai/analyze', { dailySpending: 250 })
        setData(response.data)
      } catch (error) {
        console.error("Failed to fetch analysis", error)
      } finally {
        // Simulate a slight delay to show the "AI Processing" state for UX
        setTimeout(() => setLoading(false), 2000)
      }
    }

    fetchAnalysis()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-25" />
          <Brain className="h-12 w-12 text-primary animate-pulse" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold mb-2">Analyzing Your Profile</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Gemini AI is processing your addiction profile, calculating health risks, and generating your personalized recovery plan...
        </p>
      </div>
    )
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-32 px-4 selection:bg-primary/20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Brain className="h-4 w-4" />
              <span>AI Recovery Analysis Complete</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Your Personalized Plan
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              We've analyzed your habit profile. Here is the reality of your situation, and your exact roadmap to freedom.
            </p>
          </FadeIn>
        </div>

        {/* Risk & Finance Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <ScoreCard 
            title="Addiction Severity" 
            score={data.addictionScore} 
            icon={<Activity className="h-6 w-6 text-orange-500" />} 
            color="text-orange-500" 
            delay={0.3}
          />
          <ScoreCard 
            title="Health Risk Level" 
            score={data.healthRiskScore} 
            icon={<ShieldAlert className="h-6 w-6 text-destructive" />} 
            color="text-destructive" 
            delay={0.4}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <Glass variant="card" className="p-6 h-full flex flex-col justify-between border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingDown className="h-24 w-24 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <TrendingDown className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold">Financial Impact</h3>
                </div>
                <div className="space-y-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Waste</p>
                    <p className="text-3xl font-bold text-destructive">₹{data.financialImpact.monthlyWasted.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Yearly Waste</p>
                    <p className="text-3xl font-bold text-destructive">₹{data.financialImpact.yearlyWasted.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Glass>
          </motion.div>
        </div>

        {/* Daily Advice / Actionable */}
        <ScrollReveal delay={0.1}>
          <Glass className="p-8 border border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -z-10" />
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" /> Immediate Action Items
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AdviceItem title="Daily Motivation" content={data.dailyAdvice.motivation} />
              <AdviceItem title="Your Goal Today" content={data.dailyAdvice.goal} />
              <AdviceItem title="Healthy Alternative" content={data.dailyAdvice.alternative} />
              <AdviceItem title="Craving Prevention" content={data.dailyAdvice.prevention} />
            </div>
          </Glass>
        </ScrollReveal>

        {/* 7-Day Plan */}
        <ScrollReveal delay={0.15}>
          <h2 className="text-2xl font-bold mb-6 mt-12 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" /> Your 7-Day Quit Plan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.sevenDayPlan.map((day, i) => (
              <Glass key={i} variant="card" className="p-5 border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Day {day.day}</span>
                </div>
                <h3 className="font-bold mb-2">{day.title}</h3>
                <p className="text-sm text-muted-foreground">{day.desc}</p>
              </Glass>
            ))}
            <Glass variant="card" className="p-5 border-border/50 bg-primary/5 flex flex-col justify-center items-center text-center">
              <h3 className="font-bold mb-2">Beyond Day 7</h3>
              <p className="text-sm text-muted-foreground mb-4">You will transition to the 30-Day psychological resilience plan.</p>
              <Button variant="secondary" size="sm" className="w-full">View 30-Day Plan</Button>
            </Glass>
          </div>
        </ScrollReveal>

        {/* Health Timeline Preview */}
        <ScrollReveal delay={0.2}>
          <h2 className="text-2xl font-bold mb-6 mt-12 flex items-center gap-2">
            <Clock className="h-6 w-6 text-success" /> Estimated Health Recovery
          </h2>
          <Glass className="p-6 border-success/30">
            <div className="flex flex-col space-y-6">
              {data.timeline.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-success animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{item.time}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Glass>
        </ScrollReveal>

        {/* CTA to Dashboard */}
        <ScrollReveal delay={0.25} className="flex justify-center mt-16 pt-8 border-t border-border/40">
          <Button size="lg" variant="gradient" magnetic={true} onClick={() => navigate('/dashboard')} className="h-14 px-10 text-base rounded-full">
            Go to My Dashboard <ChevronRight className="ml-2 h-5 w-5 animate-pulse" />
          </Button>
        </ScrollReveal>

      </div>
    </div>
  )
}

function ScoreCard({ title, score, icon, color, delay }: { title: string, score: number, icon: React.ReactNode, color: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Glass variant="card" className="p-6 h-full flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg bg-secondary`}>
            {icon}
          </div>
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Severity</p>
            <p className={`text-4xl font-bold ${color}`}>{score}<span className="text-lg text-muted-foreground font-normal">/100</span></p>
          </div>
          {/* Circular Progress with SVG with Animated Stroke */}
          <div className="relative h-16 w-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary" />
              <motion.circle 
                cx="32" 
                cy="32" 
                r="28" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="transparent" 
                initial={{ strokeDasharray: "0 175" }}
                animate={{ strokeDasharray: `${(score / 100) * 175} 175` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.3 }}
                className={color} 
              />
            </svg>
          </div>
        </div>
      </Glass>
    </motion.div>
  )
}

function AdviceItem({ title, content }: { title: string, content: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="space-y-2 p-3 rounded-xl hover:bg-secondary/30 transition-colors"
    >
      <h4 className="font-bold text-xs text-primary uppercase tracking-wider">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
    </motion.div>
  )
}
