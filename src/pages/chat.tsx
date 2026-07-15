import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User as UserIcon, Paperclip, Mic, AlertCircle, Phone, Wind, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Glass } from "@/components/ui/glass"
import { getChatSession } from "@/services/ai.service"
import { Content } from "@google/generative-ai"
import ReactMarkdown from 'react-markdown'

const suggestedQuestions = [
  "I'm having a really strong craving right now.",
  "How can I manage stress without smoking?",
  "Tell me a success story.",
  "What should I do if I relapse?"
]

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Content = { role: "user", parts: [{ text }] }
    const newHistory = [...messages, userMessage]
    setMessages(newHistory)
    setInput("")
    setIsLoading(true)
    setError(null)

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
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "model", parts: [{ text: "I'm sorry, I encountered an error. Please try again later." }] }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6 w-full">
      <Glass variant="card" className="flex-1 flex flex-col h-full overflow-hidden border-border/50 relative z-10">
        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-card/30">
          <div>
            <h2 className="font-semibold text-lg flex items-center">
              <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
              AI Recovery Coach
            </h2>
            <p className="text-xs text-muted-foreground">Always here for you</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-md ${msg.role === "user" ? "bg-primary/20 text-primary ml-3" : "bg-primary text-primary-foreground mr-3"}`}>
                    {msg.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`rounded-2xl px-5 py-3 shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-secondary-foreground rounded-tl-sm border border-border/50"}`}>
                    {msg.role === 'model' ? (
                       <div className="prose prose-sm dark:prose-invert max-w-none">
                         <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                         {isLoading && idx === messages.length - 1 && msg.parts[0].text === "" && (
                            <div className="flex items-center space-x-1 h-5">
                              <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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

        <div className="p-4 bg-background/80 border-t border-border/50 backdrop-blur-xl">
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 hover:text-primary border border-border/50 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-2"
          >
            <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Coach..."
              className="flex-1 bg-secondary/50 border border-border/50 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
            />
            <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              <Mic className="h-5 w-5" />
            </button>
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-full h-11 w-11 shrink-0 shadow-md">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Glass>

      {/* Side Tools Area */}
      <div className="w-full xl:w-80 shrink-0 space-y-4 overflow-y-auto pb-4 xl:pb-0 relative z-10">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="h-auto py-3 flex flex-col gap-2 border border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-destructive bg-background/50 backdrop-blur-sm">
            <AlertCircle className="h-6 w-6" />
            <span className="text-xs font-semibold">Emergency SOS</span>
          </Button>
          <Button variant="secondary" className="h-auto py-3 flex flex-col gap-2 border border-primary/30 hover:bg-primary/10 hover:text-primary text-primary bg-background/50 backdrop-blur-sm">
            <Phone className="h-6 w-6" />
            <span className="text-xs font-semibold">Call Sponsor</span>
          </Button>
        </div>

        {/* Breathing Exercise */}
        <Card className="bg-card/50 backdrop-blur-md border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Wind className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-base flex items-center">
              <Wind className="h-4 w-4 mr-2 text-primary" />
              4-7-8 Breathing
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8 relative z-10">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div 
                className="absolute w-24 h-24 rounded-full border-4 border-primary/20"
                animate={{ 
                  scale: [1, 1.6, 1.6, 1],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 19, 
                  repeat: Infinity,
                  times: [0, 0.21, 0.58, 1], 
                  ease: "easeInOut"
                }}
              />
              {/* Inner core */}
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-lg shadow-primary/30 z-10"
                animate={{ 
                  scale: [1, 1.2, 1.2, 1],
                }}
                transition={{ 
                  duration: 19, 
                  repeat: Infinity,
                  times: [0, 0.21, 0.58, 1], 
                  ease: "easeInOut"
                }}
              >
                <Wind className="h-6 w-6" />
              </motion.div>
            </div>
            <p className="mt-8 text-sm text-center text-muted-foreground font-medium">Inhale (4s) • Hold (7s) • Exhale (8s)</p>
          </CardContent>
        </Card>

        {/* Daily Motivation */}
        <Card className="bg-gradient-to-br from-primary/10 to-warning/10 border-border/50 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Heart className="h-4 w-4 mr-2 text-warning fill-warning" />
              Daily Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic font-medium leading-relaxed">
              "You don't have to control your thoughts. You just have to stop letting them control you."
            </p>
            <p className="text-xs text-muted-foreground mt-2 text-right">— Dan Millman</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
