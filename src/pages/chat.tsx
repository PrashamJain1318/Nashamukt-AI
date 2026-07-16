import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User as UserIcon, Mic, AlertCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getChatSession } from "@/services/ai.service"
import { Content } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'

// Immersive holographic components
import { AIRoomScene } from "@/scenes/AIRoomScene"
import { AudioWaveform } from "@/components/dashboard/AudioWaveform"
import { HolographicCard } from "@/components/dashboard/HolographicCard"

const suggestedQuestions = [
  "I'm having a really strong craving right now.",
  "How can I manage stress without smoking?",
  "Tell me a success story.",
  "What should I do if I relapse?"
]

// ─── 1. Floating Animation Configuration ────────────────────────────────────
const floatingVariants: any = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }
  })
}

// ─── 2. Real-time Fluctuating Diagnostic Telemetry ──────────────────────────
function HUDTelemetry() {
  const [latency, setLatency] = useState(12)
  const [cpu, setCpu] = useState(38.4)
  const [sync, setSync] = useState(99.85)

  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(10 + Math.floor(Math.random() * 5))
      setCpu(35 + Math.random() * 8)
      setSync(99.80 + Math.random() * 0.12)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden xl:flex items-center gap-6 text-[10px] font-mono text-muted-foreground border-l border-white/10 pl-6 ml-6">
      <div className="flex flex-col">
        <span>LINK LATENCY</span>
        <span className="text-cyan-400 font-bold tracking-widest">{latency}ms</span>
      </div>
      <div className="flex flex-col">
        <span>CORE SYNC</span>
        <span className="text-cyan-400 font-bold tracking-widest">{sync.toFixed(2)}%</span>
      </div>
      <div className="flex flex-col">
        <span>COGNITIVE FLOW</span>
        <span className="text-cyan-400 font-bold tracking-widest">{cpu.toFixed(1)} TFLOPS</span>
      </div>
    </div>
  )
}

// ─── 3. Typewriter Text Component ───────────────────────────────────────────
function TypewriterText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index))
        index++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return <ReactMarkdown>{displayedText}</ReactMarkdown>
}

// ─── 4. Startup Boot Overlay Sequence ────────────────────────────────────────
function StartupBootOverlay({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const bootLines = [
    "LOGGING IN USER SESSION...",
    "ESTABLISHING SECURE CRYPTO LINK...",
    "LOADING COGNITIVE ENGINES...",
    "CALIBRATING CORE NEURAL CHANNELS...",
    "COGNITIVE EMOTION MODEL: ONLINE",
    "UPLINK STATUS: STABLE (E2EE)",
    "BOOTING JARVIS RECOVERY OS..."
  ]

  useEffect(() => {
    let currentIdx = 0
    const interval = setInterval(() => {
      if (currentIdx < bootLines.length) {
        setLines(prev => [...prev, bootLines[currentIdx]])
        currentIdx++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 600)
      }
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 bg-[#010206] z-50 flex flex-col justify-center p-8 font-mono text-cyan-400 overflow-hidden"
    >
      <div className="absolute inset-0 bg-hologram-grid opacity-15" />
      <div className="absolute left-0 w-full h-[3px] bg-cyan-500/20 scanline-line pointer-events-none" />
      
      <div className="max-w-md mx-auto w-full space-y-4 relative z-10">
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4 mb-6">
          <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 animate-ping mr-1" />
          <h1 className="text-sm font-bold tracking-widest uppercase">JARVIS SYSTEM OS v3.5</h1>
        </div>
        
        <div className="space-y-2 text-xs h-36 overflow-hidden">
          {lines.map((line, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <span className="text-cyan-600 font-bold">&gt;&gt;</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </div>

        <div className="pt-6">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: bootLines.length * 0.3 }}
              className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
            />
          </div>
          <p className="text-[10px] text-cyan-500/60 mt-2 text-right">BOOT PATHWAY LOGGED</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── MAIN CHAT INTERFACE ────────────────────────────────────────────────────
export function ChatInterface() {
  const [messages, setMessages] = useState<Content[]>([
    {
      role: "model",
      parts: [{ text: "Hello! I'm your NashaMukt AI Coach. I'm here to support you on your journey. How are you feeling today? Are you experiencing any cravings?" }]
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Jarvis core mode state: 'idle' | 'listening' | 'speaking' | 'thinking'
  const [assistantMode, setAssistantMode] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle')
  const [isMicActive, setIsMicActive] = useState(false)
  const [booting, setBooting] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (!booting) {
      scrollToBottom()
    }
  }, [messages, booting])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Content = { role: "user", parts: [{ text }] }
    const newHistory = [...messages, userMessage]
    setMessages(newHistory)
    setInput("")
    setIsLoading(true)
    setError(null)
    setAssistantMode('thinking')

    setMessages((prev) => [...prev, { role: "model", parts: [{ text: "" }] }])

    try {
      const chat = getChatSession(messages)
      const result = await chat.sendMessageStream(text)

      let streamedText = ""
      for await (const chunk of result.stream) {
        streamedText += chunk.text()
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "model", parts: [{ text: streamedText }] }
          return updated
        })
      }
      
      // Simulate speech after streaming completes
      setAssistantMode('speaking')
      setTimeout(() => {
        setAssistantMode('idle')
      }, 5000)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", parts: [{ text: "I'm sorry, I encountered an error. Please try again later." }] }
        return updated
      })
      setAssistantMode('idle')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMic = () => {
    if (isMicActive) {
      setIsMicActive(false)
      setAssistantMode('idle')
      handleSend("I need a quick check-in to clear my mind.")
    } else {
      setIsMicActive(true)
      setAssistantMode('listening')
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 w-full relative overflow-hidden">
      
      {/* Jarvis boot initialization */}
      <AnimatePresence>
        {booting && <StartupBootOverlay onComplete={() => setBooting(false)} />}
      </AnimatePresence>

      {/* 3D Holographic Viewport */}
      <div className="flex-1 lg:max-w-[45%] flex flex-col gap-4 h-[350px] lg:h-full shrink-0">
        <div className="flex-1 min-h-0 relative">
          <AIRoomScene mode={assistantMode} />
          {/* Core HUD status badge */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold tracking-widest uppercase text-cyan-400">
            <span className={`w-1.5 h-1.5 rounded-full ${assistantMode === 'idle' ? 'bg-cyan-500 animate-pulse' : assistantMode === 'listening' ? 'bg-orange-500 animate-ping' : assistantMode === 'speaking' ? 'bg-emerald-500 animate-pulse' : 'bg-purple-500 animate-spin'} mr-1`} />
            JARVIS ACTIVE // MODE: {assistantMode}
          </div>
        </div>
        
        {/* Dynamic Waveform Panel */}
        <AudioWaveform isActive={assistantMode !== 'idle'} mode={assistantMode} />
      </div>

      {/* Holographic Uplink Console */}
      <HolographicCard glowColor={assistantMode === 'thinking' ? 'purple' : assistantMode === 'listening' ? 'orange' : assistantMode === 'speaking' ? 'emerald' : 'cyan'} className="flex-1 flex flex-col h-full overflow-hidden relative z-10 border-white/10">
        
        {/* Console Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#070c19]/40 backdrop-blur-md">
          <div className="flex items-center">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${assistantMode === 'listening' ? 'bg-orange-500 animate-ping' : 'bg-cyan-500 animate-pulse'}`} />
                Recovery Uplink Console
              </h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">NashaMukt AI V3.5 // SECURE LINK</p>
            </div>
            
            {/* HUD Live telemetry component */}
            <HUDTelemetry />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSend("Give me an emergency craving tip.")}
              className="border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-semibold rounded-full px-4"
            >
              Emergency Tip
            </Button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-lg border border-white/10 ${msg.role === "user" ? "bg-cyan-500/20 text-cyan-400 ml-3" : "bg-purple-500/20 text-purple-400 mr-3"}`}>
                    {msg.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`rounded-2xl px-5 py-3 shadow-md border ${msg.role === "user" ? "bg-cyan-500/10 border-cyan-500/20 text-foreground rounded-tr-sm" : "bg-purple-500/10 border-purple-500/20 text-foreground rounded-tl-sm"}`}>
                    {msg.role === 'model' ? (
                       <div className="prose prose-sm dark:prose-invert max-w-none">
                         {idx === 0 ? (
                           <TypewriterText text={msg.parts[0].text || ""} />
                         ) : (
                           <ReactMarkdown>{msg.parts[0].text || ""}</ReactMarkdown>
                         )}
                         {isLoading && idx === messages.length - 1 && (msg.parts[0].text || "") === "" && (
                            <div className="flex items-center space-x-1.5 h-5">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                         )}
                       </div>
                    ) : (
                       <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {error && (
            <div className="flex justify-center mt-4">
              <div className="bg-destructive/10 text-destructive text-xs px-4 py-2 rounded-full border border-destructive/20 flex items-center">
                <AlertCircle className="h-3 w-3 mr-2" />
                {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Recommendation Cards (Jarvis Holographic Plate style) */}
        {messages.length < 3 && (
          <div className="px-4 py-2 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {suggestedQuestions.map((q, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={floatingVariants}
                animate="animate"
                whileHover={{ scale: 1.03, y: -8, boxShadow: "0 0 15px rgba(6, 182, 212, 0.25)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSend(q)}
                className="relative p-4 overflow-hidden bg-gradient-to-br from-cyan-950/20 to-black/60 hover:from-cyan-950/30 hover:to-cyan-900/40 border border-white/5 hover:border-cyan-500/40 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-lg"
              >
                {/* Tech corner accents */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-500/30 group-hover:border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-500/30 group-hover:border-cyan-500" />
                
                <span className="text-xs text-muted-foreground group-hover:text-cyan-300 font-mono font-medium tracking-wide pr-4">{q}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cyan-300 transition-transform group-hover:translate-x-1 shrink-0" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Form Panel */}
        <div className="p-4 bg-black/45 border-t border-white/5 backdrop-blur-xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isMicActive ? "Listening to voice command..." : "Type query to Jarvis coach..."}
              disabled={isMicActive}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner text-cyan-300 font-mono"
            />
            
            <button 
              type="button" 
              onClick={toggleMic}
              className={`p-3 rounded-full border transition-all duration-300 shrink-0 ${isMicActive ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 animate-pulse' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/30'}`}
            >
              <Mic className="h-5 w-5" />
            </button>

            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-full h-11 w-11 shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </HolographicCard>

    </div>
  )
}
