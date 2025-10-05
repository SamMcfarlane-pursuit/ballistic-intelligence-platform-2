"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'analyst' | 'viewer'
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('cyberedge_user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call - in production, this would be a real authentication endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user database
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@cyberedge.com',
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'manage_users', 'ai_analysis', 'investment_advice']
        },
        {
          id: '2',
          name: 'Analyst User',
          email: 'analyst@cyberedge.com',
          role: 'analyst',
          permissions: ['read', 'write', 'ai_analysis', 'investment_advice']
        },
        {
          id: '3',
          name: 'Viewer User',
          email: 'viewer@cyberedge.com',
          role: 'viewer',
          permissions: ['read']
        }
      ]

      const foundUser = mockUsers.find(u => u.email === email)
      
      if (foundUser && password === 'demo123') {
        setUser(foundUser)
        localStorage.setItem('cyberedge_user', JSON.stringify(foundUser))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cyberedge_user')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}