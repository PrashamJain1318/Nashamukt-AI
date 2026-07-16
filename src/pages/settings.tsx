import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Palette, Bell, Shield, AlertTriangle, Monitor, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Glass } from '@/components/ui/glass'
import { useTheme } from '@/components/theme-provider'
import { toast } from 'sonner'


const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, color: "text-destructive" },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('preferences')
  const { theme, setTheme } = useTheme()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = () => {
    toast.success("Settings saved successfully.")
  }

  const handleDelete = async () => {
    if (deleteInput === "DELETE") {
      setIsDeleting(true)
      await new Promise(r => setTimeout(r, 1500))
      toast.success("Account deleted (mock).")
      setIsDeleting(false)
      setShowDeleteModal(false)
    } else {
      toast.error("Please type DELETE to confirm.")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto py-6"
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and privacy.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 gap-2 scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : `hover:bg-secondary/80 ${tab.color || 'text-foreground'}`
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* PREFERENCES */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <Glass variant="card" className="p-6 border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <motion.button 
                        onClick={() => setTheme('light')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                      >
                        <Sun className={`h-8 w-8 mb-2 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">Light</span>
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => setTheme('dark')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                      >
                        <Moon className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">Dark</span>
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => setTheme('system')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                      >
                        <Monitor className={`h-8 w-8 mb-2 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">System</span>
                      </motion.button>

                    </div>
                  </Glass>
                  
                  <Glass variant="card" className="p-6 border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Language</h3>
                    <select className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                      <option>English (US)</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                    </select>
                    <div className="mt-6 flex justify-end">
                      <Button variant="gradient" magnetic={true} onClick={handleSave}>Save Changes</Button>
                    </div>
                  </Glass>
                </div>
              )}

              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <Glass variant="card" className="p-6 border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-1">Full Name</label>
                        <input type="text" defaultValue="Prasham Jain" className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-1">Email Address</label>
                        <input type="email" defaultValue="prasham@example.com" className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button variant="gradient" magnetic={true} onClick={handleSave}>Update Account</Button>
                    </div>
                  </Glass>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <Glass variant="card" className="p-6 border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                    <div className="space-y-4 divide-y divide-border/50">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Daily Reminders</p>
                          <p className="text-sm text-muted-foreground">Receive a daily check-in prompt.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox h-5 w-5 accent-primary" />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Motivational Quotes</p>
                          <p className="text-sm text-muted-foreground">Receive random bursts of motivation.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox h-5 w-5 accent-primary" />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Community Updates</p>
                          <p className="text-sm text-muted-foreground">Get notified when someone replies to you.</p>
                        </div>
                        <input type="checkbox" className="toggle-checkbox h-5 w-5 accent-primary" />
                      </div>
                    </div>
                  </Glass>
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <Glass variant="card" className="p-6 border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Data & Visibility</h3>
                    <div className="space-y-4 divide-y divide-border/50">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Public Profile</p>
                          <p className="text-sm text-muted-foreground">Allow others to see your stats and badges.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox h-5 w-5 accent-primary" />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Show on Leaderboard</p>
                          <p className="text-sm text-muted-foreground">Include your streak in the community leaderboard.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle-checkbox h-5 w-5 accent-primary" />
                      </div>
                    </div>
                  </Glass>
                </div>
              )}

              {/* DANGER ZONE */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-destructive flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Delete Account
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" isLoading={isDeleting} onClick={() => setShowDeleteModal(true)}>
                        Delete My Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border border-border"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-destructive">Are you absolutely sure?</h3>
                <button onClick={() => setShowDeleteModal(false)} className="p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. This will permanently delete your account, wipe all your journal entries, and reset your streak to zero.
              </p>
              <div className="mb-6">
                <label className="text-sm font-medium block mb-2">
                  Please type <span className="font-bold text-foreground">DELETE</span> to confirm.
                </label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 text-foreground"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="destructive" isLoading={isDeleting} onClick={handleDelete}>Permanently Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
