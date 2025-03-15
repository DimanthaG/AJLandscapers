"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import LoginModal from "@/components/LoginModal"

type AdminContextType = {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState("")

  const login = async () => {
    try {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        setIsAdmin(true)
      } else {
        throw new Error('Not authenticated')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAdmin(false)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if (response.ok) {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAdmin(true)
        setShowLoginModal(false)
        setLoginError("")
      } else {
        setLoginError("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An error occurred during login")
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
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, login, logout }}>
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

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}