import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageSquare, Share2, Image as ImageIcon, Smile, Send, TrendingUp, Medal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'
import { Badge } from '@/components/ui/badge'

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
  }
]

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
      author: { name: "You", avatar: "ME" },
      streak: "🔥 14 Days",
      content: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      timestamp: "Just now"
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")
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
                  <div className="flex space-x-2 text-muted-foreground">
                    <button className="p-2 hover:bg-secondary/50 rounded-full transition-colors"><ImageIcon className="h-4 w-4" /></button>
                    <button className="p-2 hover:bg-secondary/50 rounded-full transition-colors"><Smile className="h-4 w-4" /></button>
                  </div>
                  <Button onClick={handlePost} disabled={!newPostContent.trim()} className="rounded-full px-6 flex items-center gap-2">
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
              <motion.div key={post.id} variants={itemVariants} layout initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-colors">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground font-semibold shrink-0">
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
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-destructive' : ''}`} />
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
              {leaderboard.map((user) => (
                <div key={user.name} className={`flex items-center justify-between p-2 rounded-lg ${user.name === "You" ? 'bg-primary/10 border border-primary/20' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-4 ${user.rank <= 3 ? 'text-warning' : 'text-muted-foreground'}`}>{user.rank}.</span>
                    <span className={`text-sm font-medium ${user.name === "You" ? 'text-primary' : ''}`}>{user.name}</span>
                  </div>
                  <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">{user.streak}</span>
                </div>
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
