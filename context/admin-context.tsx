"use client"

import { createContext, useContext, useState, useEffect } from 'react'

interface AdminContextType {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  toggleAdmin: () => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  setIsAdmin: () => {},
  toggleAdmin: () => {},
})

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const toggleAdmin = () => {
    const newState = !isAdmin
    setIsAdmin(newState)
    localStorage.setItem('isAdmin', String(newState))
  }

  useEffect(() => {
    const savedState = localStorage.getItem('isAdmin')
    if (savedState === 'true') {
      setIsAdmin(true)
    }
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)