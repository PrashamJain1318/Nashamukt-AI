import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

type User = {
  id: string
  name: string
  email: string
} | null

type AuthState = {
  user: User
  isAuthenticated: boolean
  login: (name: string, email: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('mock-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (name: string, email: string) => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockUser = { id: '1', name, email }
    setUser(mockUser)
    localStorage.setItem('mock-user', JSON.stringify(mockUser))
    localStorage.setItem('auth-token', 'mock-jwt-token')
    toast.success('Successfully logged in!')
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mock-user')
    localStorage.removeItem('auth-token')
    toast.info('Logged out')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
