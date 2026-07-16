import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageSquare, Share2, Image as ImageIcon, Smile, Send, TrendingUp, Medal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'
import { Badge } from '@/components/ui/badge'
import { ScrollReveal } from '@/components/ui/page-transition'

const CommunityGlobeScene = lazy(() => import('@/scenes/CommunityGlobeScene').then(m => ({ default: m.CommunityGlobeScene })))

// Mock Data
const initialPosts = [
  {
    id: 1,
    author: { name: "Sarah J.", avatar: "SJ" },
    streak: "🔥 365 Days",
    content: "One year! I can't believe I finally made it. To anyone struggling in their first week: it gets easier. The cravings disappear, and you get your life back. Stay strong! 💪",
    likes: 124,
    comments: 18,
    isLiked: false,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: { name: "Michael R.", avatar: "MR" },
    streak: "🔥 14 Days",
    content: "Having a really tough time today. The stress from work is making the cravings intense. Going to do a breathing exercise and push through. Need some encouragement right now.",
    likes: 45,
    comments: 12,
    isLiked: false,
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    author: { name: "Priya T.", avatar: "PT" },
    streak: "🔥 90 Days",
    content: "Just bought myself a new pair of shoes with the money I saved from not buying cigarettes for 3 months! Treating yourself is the best motivation. 👟✨",
    likes: 89,
    comments: 5,
    isLiked: false,
    timestamp: "Yesterday"
  },
  {
    id: 4,
    author: { name: "David K.", avatar: "DK" },
    streak: "🔥 240 Days",
    content: "I reached 8 months today. This community is a lifesaver. Keep going everyone!",
    likes: 210,
    comments: 45,
    isLiked: false,
    timestamp: "2 days ago",
    isMilestone: true
  }
]

const communityStats = {
  totalUsers: "12,450",
  activeToday: "3,120",
  totalMoneySaved: "₹45,20,000",
  totalDaysSober: "145,600"
}

const leaderboard = [
  { name: "Sarah J.", streak: "365 Days", rank: 1 },
  { name: "David K.", streak: "240 Days", rank: 2 },
  { name: "Priya T.", streak: "90 Days", rank: 3 },
  { name: "Alex W.", streak: "45 Days", rank: 4 },
  { name: "You", streak: "14 Days", rank: 12 },
]

export function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [filter, setFilter] = useState("All")
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const handlePost = () => {
    if (!newPostContent.trim()) return

    const newPost = {
      id: Date.now(),
      author: isAnonymous ? { name: "Anonymous", avatar: "👻" } : { name: "Prasham Jain", avatar: "PJ" },
      streak: "🔥 45 Days",
      content: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      timestamp: "Just now",
      isMilestone: false
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")
    setIsAnonymous(false)
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
        <h1 className="font-display text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">Share your journey, find support, and celebrate milestones together.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          
          {/* Composer */}
          <Glass variant="card" className="p-4 border-border/50 shadow-sm">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/20 text-primary font-bold shrink-0">
                ME
              </div>
              <div className="flex-1 space-y-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, milestones, or ask for support..."
                  className="w-full bg-transparent resize-none border-none focus:ring-0 p-0 text-foreground placeholder:text-muted-foreground min-h-[80px]"
                />
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex space-x-2 text-muted-foreground items-center">
                    <button className="p-2 hover:bg-secondary/50 rounded-full transition-colors"><ImageIcon className="h-4 w-4" /></button>
                    <button className="p-2 hover:bg-secondary/50 rounded-full transition-colors"><Smile className="h-4 w-4" /></button>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer ml-2">
                      <input 
                        type="checkbox" 
                        checked={isAnonymous} 
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-border bg-background text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      Post Anonymously
                    </label>
                  </div>
                  <Button onClick={handlePost} disabled={!newPostContent.trim()} variant="gradient" className="rounded-full px-6 flex items-center gap-2">
                    Post <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Glass>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Success Stories", "Need Support", "Milestones"].map((f) => (
              <Badge 
                key={f}
                variant={filter === f ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full ${filter !== f ? 'hover:bg-primary/20 hover:text-primary transition-colors' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </Badge>
            ))}
          </div>

          {/* Posts */}
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
              >
                <Card className={`bg-card/50 backdrop-blur-sm transition-colors border-border/50 hover:border-border ${post.isMilestone ? 'border-warning/50 shadow-[0_0_15px_rgba(var(--warning),0.1)]' : ''}`}>
                  <CardContent className="p-5">
                    {post.isMilestone && (
                      <div className="flex items-center gap-2 text-warning font-bold text-xs uppercase tracking-wider mb-4 bg-warning/10 w-fit px-3 py-1 rounded-full">
                        <Medal className="h-3 w-3" /> Milestone Reached
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold shrink-0 ${post.author.name === 'Anonymous' ? 'bg-secondary/50 text-muted-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.name}</span>
                            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                          </div>
                          <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">{post.streak}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base leading-relaxed mb-4 text-foreground/90">{post.content}</p>
                    
                    <div className="flex items-center gap-6 text-muted-foreground border-t border-border/50 pt-3">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${post.isLiked ? 'text-destructive hover:text-destructive/80' : 'hover:text-primary'}`}
                      >
                        <motion.span
                          animate={{ scale: post.isLiked ? [1, 1.4, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-destructive' : ''}`} />
                        </motion.span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors ml-auto">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* 3D Global Live Network Globe */}
          <Glass variant="card" className="p-5 border-border/50 overflow-hidden flex flex-col items-center">
            <h3 className="font-semibold text-sm flex items-center mb-2 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-2" />
              Global Support Network
            </h3>
            <Suspense fallback={<div className="h-[180px] w-full flex items-center justify-center text-xs text-muted-foreground animate-pulse font-mono">Initializing network globe...</div>}>
              <CommunityGlobeScene />
            </Suspense>
          </Glass>

          {/* Community Stats */}
          <Glass variant="card" className="p-5 border-border/50">
            <h3 className="font-semibold text-lg flex items-center mb-4">
              <Heart className="h-5 w-5 mr-2 text-destructive" />
              Community Impact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ScrollReveal delay={0} className="contents">
                <div className="bg-secondary/30 p-3 rounded-xl text-center">
                  <span className="block text-2xl font-bold text-primary">{communityStats.activeToday}</span>
                  <span className="text-xs text-muted-foreground">Active Today</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1} className="contents">
                <div className="bg-secondary/30 p-3 rounded-xl text-center">
                  <span className="block text-2xl font-bold text-success">{communityStats.totalMoneySaved}</span>
                  <span className="text-xs text-muted-foreground">Combined Saved</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2} className="col-span-2">
                <div className="bg-secondary/30 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Days Sober</span>
                  <span className="font-bold text-warning">{communityStats.totalDaysSober}</span>
                </div>
              </ScrollReveal>
            </div>
          </Glass>

          {/* Leaderboard */}
          <Glass variant="card" className="p-5 border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Medal className="h-24 w-24 text-warning" />
            </div>
            <h3 className="font-semibold text-lg flex items-center mb-4 relative z-10">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Streak Leaderboard
            </h3>
            <div className="space-y-4 relative z-10">
              {leaderboard.map((user, i) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className={`flex items-center justify-between p-2 rounded-lg ${user.name === "You" ? 'bg-primary/10 border border-primary/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-4 ${user.rank <= 3 ? 'text-warning' : 'text-muted-foreground'}`}>{user.rank}.</span>
                    <span className={`text-sm font-medium ${user.name === "You" ? 'text-primary' : ''}`}>{user.name}</span>
                  </div>
                  <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">{user.streak}</span>
                </motion.div>
              ))}
            </div>
          </Glass>

          {/* Success Story Highlight */}
          <Card className="bg-gradient-to-br from-info/10 to-primary/10 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center text-info">
                <Star className="h-4 w-4 mr-2 fill-info text-info" />
                Featured Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-1">"How quitting changed my life"</h4>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                After 10 years of struggling, I finally found the strength to stop. The journey wasn't easy, but the community here kept me accountable...
              </p>
              <Button variant="ghost" className="p-0 h-auto text-info font-semibold hover:text-info/80 hover:bg-transparent">Read full story &rarr;</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </motion.div>
  )
}
