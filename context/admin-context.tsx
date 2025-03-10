"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { LoginModal } from '@/components/LoginModal'

interface AdminContextType {
  isAdmin: boolean
  toggleAdmin: () => void
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  toggleAdmin: () => {},
  logout: async () => {},
})

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth')
      const data = await response.json()
      setIsAdmin(data.isAuthenticated)
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAdmin(false)
    }
  }

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAdmin(true)
        setShowLoginModal(false)
        setLoginError('')
      } else {
        setLoginError('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('An error occurred during login')
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
      })
      setIsAdmin(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleAdmin = () => {
    if (isAdmin) {
      logout()
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin, logout }}>
      {children}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        error={loginError}
      />
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)