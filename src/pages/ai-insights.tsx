import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Lightbulb, HeartPulse, Target, Shield } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

import { SkeletonGrid, SkeletonCard } from '@/components/ui/skeleton';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/page-transition';

export function AIInsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { speak } = useAccessibility();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [report, risk, mood, motivation, health, habit] = await Promise.all([
          apiClient.get('/api/ai/weekly-report'),
          apiClient.post('/api/ai/simulate', { yearsToSimulate: 1, dailySpending: 150 }),
          apiClient.get('/api/ai/mood-analysis'),
          apiClient.get('/api/ai/motivation'),
          apiClient.get('/api/ai/health-insights'),
          apiClient.get('/api/ai/habit-prediction'),
        ]);

        setData({
          report: report.data.data,
          risk: risk.data.data,
          mood: mood.data.data,
          motivation: motivation.data.data,
          health: health.data.data,
          habit: habit.data.data,
        });
      } catch (error) {
        console.error('Failed to load AI insights', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return (
    <div className="space-y-6 pb-12">
      <div className="h-8 w-48 skeleton-wave rounded-lg" />
      <div className="h-4 w-72 skeleton-wave rounded-lg" />
      <SkeletonGrid cols={3} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard className="lg:col-span-2 h-48" />
        <SkeletonCard className="h-48" />
      </div>
    </div>
  );
  if (!data) return <div className="p-8">Failed to load AI Insights</div>;

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">AI Insights Hub</h1>
          <p className="text-muted-foreground mt-2">Personalized deep analysis of your sobriety journey.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Report */}
        <ScrollReveal className="col-span-1 lg:col-span-2">
          <AnimatedCard className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Weekly Progress Report</h2>
              <Button variant="ghost" size="sm" onClick={() => speak(data.report.summary)}>Read Aloud</Button>
            </div>
            <p className="text-lg font-medium mb-4">{data.report.summary}</p>
            <div className="space-y-2">
              <div className="bg-background/50 p-3 rounded-lg">
                <strong>Highlights:</strong> {data.report.highlights.join(", ")}
              </div>
              <div className="bg-background/50 p-3 rounded-lg">
                <strong>To Improve:</strong> {data.report.areasForImprovement.join(", ")}
              </div>
              <div className="bg-background/50 p-3 rounded-lg">
                <strong>Next Week:</strong> {data.report.nextWeekGoal}
              </div>
            </div>
          </AnimatedCard>
        </ScrollReveal>

        {/* Motivation */}
        <ScrollReveal delay={0.05}>
          <AnimatedCard className="p-6 flex flex-col justify-center text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
            >
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-lg font-bold mb-2">Daily Motivation</h2>
            <p className="italic mb-4">"{data.motivation.quote}"</p>
            <p className="text-sm text-primary font-medium">{data.motivation.personalizedMessage}</p>
            <Button variant="ghost" className="mt-4" onClick={() => speak(data.motivation.quote)}>Read Aloud</Button>
          </AnimatedCard>
        </ScrollReveal>

        {/* Risk & Savings Simulator */}
        <ScrollReveal delay={0.1}>
          <AnimatedCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-bold">Risk & Savings Simulator (1 Yr)</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Projected Savings</p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-2xl font-bold text-green-500"
                >
                  ₹{data.risk.projectedSavings.toLocaleString()}
                </motion.p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Health Risk Reduction</p>
                <p className="font-medium">{data.risk.healthRiskReduction}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Life Expectancy Gained</p>
                <p className="font-medium text-primary">{data.risk.lifeExpectancyGained}</p>
              </div>
            </div>
          </AnimatedCard>
        </ScrollReveal>

        {/* Habit Prediction */}
        <ScrollReveal delay={0.15}>
          <AnimatedCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold">Habit Prediction</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Time</p>
                <p className="font-bold text-lg">{data.habit.highRiskTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Likely Trigger</p>
                <p className="font-medium">{data.habit.likelyTrigger}</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20"
              >
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Preventive Action: {data.habit.preventiveAction}</p>
              </motion.div>
            </div>
          </AnimatedCard>
        </ScrollReveal>

        {/* Health Insights */}
        <ScrollReveal delay={0.2}>
          <AnimatedCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HeartPulse className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold">Physiological Insights</h2>
              <Button variant="ghost" size="icon" onClick={() => speak(data.health.join(". "))}>
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-3">
              {data.health.map((insight: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  className="flex items-start space-x-2"
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"
                  />
                  <span className="text-sm">{insight}</span>
                </motion.li>
              ))}
            </ul>
          </AnimatedCard>
        </ScrollReveal>

        {/* Mood Analysis */}
        <ScrollReveal delay={0.25}>
          <AnimatedCard className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-bold">Mood Analysis</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trend</span>
                <span className="font-bold text-purple-500">{data.mood.trend}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Identified Triggers</p>
                <div className="flex flex-wrap gap-2">
                  {data.mood.triggersIdentified.map((t: string, i: number) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.08, y: -1 }}
                      className="px-2 py-1 bg-secondary rounded-md text-xs font-medium cursor-default"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
              <p className="text-sm italic text-muted-foreground">"{data.mood.aiSuggestion}"</p>
            </div>
          </AnimatedCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
