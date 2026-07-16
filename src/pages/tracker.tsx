import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/page-transition'
import { SkeletonCard, SkeletonGrid } from '@/components/ui/skeleton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProgressChart } from '@/components/ui/chart'
import { toast } from 'sonner'
import { Activity, Plus, FileText, PieChart as PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '@/components/theme-provider'
import { chartColors } from '@/components/ui/chart'
import { useTrackerLogs, useLogHabit } from '@/hooks/api/useTracker'

const logSchema = z.object({
  substance: z.string().min(1, { message: 'Please select a substance.' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
  time: z.string().min(1, { message: 'Time is required.' }),
  mood: z.string().min(1, { message: 'Mood is required.' }),
  reason: z.string().min(1, { message: 'Reason is required.' }),
})

type LogFormValues = z.infer<typeof logSchema>

// Schema and type are kept exactly as is.

export function TrackerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { theme } = useTheme()
  const activeTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  const colors = chartColors[activeTheme as 'light' | 'dark']
  
  const PIE_COLORS = [colors.danger, colors.warning, colors.primary, colors.success]

  // Generate some mock calendar data
  const generateMockHabitData = () => {
    const data: Record<string, 'success' | 'warning' | 'slip' | 'neutral'> = {}
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    
    for(let i=1; i<=28; i++) {
      const dateStr = `${year}-${month}-${String(i).padStart(2, '0')}`
      if (i % 5 === 0) data[dateStr] = 'slip'
      else if (i % 7 === 0) data[dateStr] = 'warning'
      else data[dateStr] = 'success'
    }
    return data
  }

  const { data, isLoading } = useTrackerLogs()
  const logHabitMutation = useLogHabit()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { quantity: 1, time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" }) }
  })

  const onSubmit = async (formData: LogFormValues) => {
    try {
      await logHabitMutation.mutateAsync({
        product: formData.substance,
        quantity: formData.quantity,
        time: formData.time,
        mood: formData.mood,
        trigger: formData.reason,
        notes: "Logged via Tracker"
      })
      toast.success('Log entry recorded successfully.')
      reset()
    } catch {
      toast.error('Failed to save log.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <SkeletonGrid cols={3} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-80" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard className="h-48" />
            <div className="grid md:grid-cols-2 gap-6">
              <SkeletonCard className="h-56" />
              <SkeletonCard className="h-56" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const logs = data?.logs || []
  const weeklyChart = data?.charts?.weeklyChart || []
  const triggersData = data?.charts?.triggers || []

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Habit Tracker</h1>
          <p className="text-muted-foreground">Log your triggers, monitor slips, and analyze patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Calendar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <Calendar 
              onSelectDate={setSelectedDate} 
              habitData={generateMockHabitData()} 
            />
          </motion.div>
          
          <Card className="bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Plus className="h-5 w-5 mr-2 text-primary" />
                Log Entry for {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Substance</label>
                  <select 
                    {...register('substance')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <option value="">Select substance...</option>
                    <option value="smoking">Smoking</option>
                    <option value="alcohol">Alcohol</option>
                    <option value="gutkha">Gutkha</option>
                    <option value="pan_masala">Pan Masala</option>
                    <option value="tobacco">Tobacco</option>
                    <option value="vaping">Vaping</option>
                  </select>
                  {errors.substance && <p className="text-xs text-destructive">{errors.substance.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Quantity</label>
                    <Input type="number" {...register('quantity', { valueAsNumber: true })} />
                    {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <Input type="time" {...register('time')} />
                    {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mood</label>
                  <select 
                    {...register('mood')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <option value="">Select mood...</option>
                    <option value="stressed">😫 Stressed</option>
                    <option value="anxious">😰 Anxious</option>
                    <option value="sad">😢 Sad</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="happy">😊 Happy</option>
                  </select>
                  {errors.mood && <p className="text-xs text-destructive">{errors.mood.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Reason / Trigger</label>
                  <textarea 
                    {...register('reason')}
                    placeholder="What triggered this?"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                  {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
                </div>

                <Button type="submit" variant="gradient" className="w-full" isLoading={logHabitMutation.isPending}>
                  Save Log
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analytics & List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-warning" />
                Consumption Trend (Past 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart data={weeklyChart} dataKey="value" color="danger" />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
            <Card className="bg-card/50 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Primary Triggers
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={triggersData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {triggersData.map((_: unknown, index: number) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            </ScrollReveal>

            <Card className="bg-card/50 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-success" />
                  Recent Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {logs.map((log: Record<string, string | number>) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
                    <div>
                      <h4 className="font-semibold text-sm">{log.product} ({log.quantity})</h4>
                      <p className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString()} at {log.time} • {log.mood}</p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No logs yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
