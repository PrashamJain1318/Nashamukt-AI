import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Activity, ChevronRight, PenTool } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/components/theme-provider'
import { chartColors } from '@/components/ui/chart'
import { toast } from 'sonner'

const moodOptions = [
  { emoji: "😫", label: "Terrible", value: 1 },
  { emoji: "😕", label: "Bad", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "🤩", label: "Awesome", value: 5 },
]

const levelOptions = ["Low", "Medium", "High", "Extreme"]

const analyticsData = [
  { day: 'Mon', mood: 2, stress: 8 },
  { day: 'Tue', mood: 3, stress: 6 },
  { day: 'Wed', mood: 2, stress: 7 },
  { day: 'Thu', mood: 4, stress: 4 },
  { day: 'Fri', mood: 3, stress: 5 },
  { day: 'Sat', mood: 5, stress: 2 },
  { day: 'Sun', mood: 4, stress: 3 },
]

const history = [
  { date: "Today", time: "10:30 AM", mood: "🙂", snippet: "Feeling pretty good today. Woke up without a headache..." },
  { date: "Yesterday", time: "8:15 PM", mood: "😫", snippet: "Really tough evening. Almost gave in but called a friend..." },
  { date: "Oct 12", time: "9:00 AM", mood: "😐", snippet: "Just an average day. Work is stressful but manageable." },
]

export function JournalPage() {
  const { theme } = useTheme()
  const activeTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  const colors = chartColors[activeTheme as 'light' | 'dark']

  const [notes, setNotes] = useState("")
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [stressLevel, setStressLevel] = useState("Low")
  const [cravingLevel, setCravingLevel] = useState("Low")

  const handleSave = () => {
    if (!notes.trim() && !selectedMood) {
      toast.error("Please add a note or select a mood.")
      return
    }
    toast.success("Journal entry saved successfully!")
    setNotes("")
    setSelectedMood(null)
    setStressLevel("Low")
    setCravingLevel("Low")
  }

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
      className="w-full max-w-6xl mx-auto py-6"
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">My Journal</h1>
        <p className="text-muted-foreground">Reflect on your day, track your emotions, and observe your growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Glass variant="card" className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg flex items-center">
                <PenTool className="h-5 w-5 mr-2 text-primary" />
                New Entry
              </h2>
              <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Mood Selector */}
            <div className="mb-8">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">How are you feeling today?</label>
              <div className="flex justify-between sm:justify-start sm:gap-6">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedMood === mood.value ? 'bg-primary/20 scale-110 shadow-sm' : 'hover:bg-secondary opacity-70 hover:opacity-100 grayscale hover:grayscale-0'}`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className={`text-[10px] font-medium ${selectedMood === mood.value ? 'text-primary' : 'text-muted-foreground'}`}>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor */}
            <div className="mb-8">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write down your thoughts, triggers, or victories..."
                className="w-full min-h-[200px] bg-secondary/30 border border-border/50 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </div>

            {/* Levels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Stress Level</label>
                <div className="flex bg-secondary/50 p-1 rounded-xl">
                  {levelOptions.map(level => (
                    <button
                      key={level}
                      onClick={() => setStressLevel(level)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${stressLevel === level ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Craving Level</label>
                <div className="flex bg-secondary/50 p-1 rounded-xl">
                  {levelOptions.map(level => (
                    <button
                      key={level}
                      onClick={() => setCravingLevel(level)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${cravingLevel === level ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full sm:w-auto px-8 rounded-full">
              Save Entry
            </Button>
          </Glass>
        </div>

        {/* Right Column: Analytics & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Analytics Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-md border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  Mood vs Stress (7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.text, fontSize: 10 }} dx={-10} domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line type="monotone" dataKey="mood" name="Mood" stroke={colors.primary} strokeWidth={3} dot={{ r: 4, fill: colors.primary }} />
                    <Line type="monotone" dataKey="stress" name="Stress" stroke={colors.danger} strokeWidth={3} dot={{ r: 4, fill: colors.danger }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* History */}
          <motion.div variants={itemVariants}>
            <Glass variant="card" className="p-5 border-border/50">
              <h3 className="font-semibold text-lg flex items-center mb-4">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Recent Entries
              </h3>
              <div className="space-y-3">
                {history.map((entry, i) => (
                  <div key={i} className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50 cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{entry.mood}</span>
                        <span className="font-semibold text-sm">{entry.date}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 pr-4">{entry.snippet}</p>
                    <div className="mt-2 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Read full entry <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs">View All History</Button>
            </Glass>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
