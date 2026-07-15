import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Phone, Wind, Timer, Droplets, PersonStanding, Heart } from 'lucide-react'
import { Button } from './button'
import { Glass } from './glass'
import { Input } from './input'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function CravingAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: "I'm here for you. Cravings usually pass within 10-15 minutes. What are you feeling right now?" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { id: Date.now().toString(), role: 'ai', content: "I'm here for you. Cravings usually pass within 10-15 minutes. What are you feeling right now?" }
      ])
      setTimeLeft(120)
      setIsTimerRunning(false)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await apiClient.post('/ai/craving', { message: userMessage.content })
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: response.data.reply }])
    } catch {
      toast.error("Failed to connect to AI.")
    } finally {
      setIsTyping(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex bg-background/95 backdrop-blur-md flex-col lg:flex-row overflow-hidden"
      >
        {/* Header (Mobile) / Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-secondary/50 hover:bg-destructive/20 hover:text-destructive">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Tools Section */}
        <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r border-border/50 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <div className="pt-8 lg:pt-4">
            <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Heart className="h-6 w-6 text-destructive animate-pulse" />
              Craving Toolkit
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Immediate actions to help you cope.</p>
          </div>

          {/* Breathing Exercise */}
          <Glass variant="card" className="p-6 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Wind className="h-5 w-5 text-info" /> Breathe
            </h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.5, 1.5, 1],
                  opacity: [0.5, 1, 1, 0.5]
                }}
                transition={{
                  duration: 19, // 4s inhale, 7s hold, 8s exhale
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-info/20 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1.3, 1],
                }}
                transition={{
                  duration: 19,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-4 bg-info/40 rounded-full"
              />
              <div className="z-10 text-info font-medium">4-7-8</div>
            </div>
            <p className="text-sm text-muted-foreground">Inhale for 4s, hold for 7s, exhale for 8s.</p>
          </Glass>

          {/* Focus Timer */}
          <Glass variant="card" className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Timer className="h-5 w-5 text-warning" /> Delay Timer
            </h3>
            <div className="text-5xl font-display font-bold text-foreground">
              {formatTime(timeLeft)}
            </div>
            <Button 
              variant={isTimerRunning ? "secondary" : "primary"} 
              className="w-full rounded-full"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? "Pause" : timeLeft === 0 ? "Restart" : "Start 2-Min Delay"}
            </Button>
          </Glass>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2 rounded-2xl">
              <Droplets className="h-6 w-6 text-primary" />
              <span>Drink Water</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2 rounded-2xl">
              <PersonStanding className="h-6 w-6 text-success" />
              <span>Take a Walk</span>
            </Button>
          </div>

          <div className="mt-auto pt-4">
            <Button variant="destructive" className="w-full py-6 rounded-2xl text-lg font-bold flex items-center gap-2">
              <Phone className="h-5 w-5" /> Emergency Contact
            </Button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col h-[50vh] lg:h-auto">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary/50 backdrop-blur-sm border border-border/50 text-foreground rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-2xl rounded-tl-sm p-4 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 md:p-8 border-t border-border/50 bg-background/50 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell me what you're feeling..."
                  className="rounded-full bg-secondary/50 border-border/50 pr-12 py-6 text-base"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-1.5 top-1.5 rounded-full h-9 w-9 bg-primary hover:bg-primary/90"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-3">
                AI can make mistakes. For medical emergencies, always contact a healthcare professional.
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  )
}
