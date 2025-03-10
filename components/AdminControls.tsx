"use client"

import { useAdmin } from "@/context/admin-context"
import { Settings, KeyRound, Edit3, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

export function AdminControls() {
  const { isAdmin, toggleAdmin, logout } = useAdmin()
  const [showTooltip, setShowTooltip] = useState(false)

  // Add keyboard shortcut for toggling admin mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to toggle admin mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        toggleAdmin()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleAdmin])

  return (
    <div className="fixed bottom-32 md:bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={toggleAdmin}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`group flex items-center gap-2 rounded-full p-3 transition-all ${
            isAdmin 
              ? 'bg-green-500 hover:bg-green-600 animate-glow' 
              : 'bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur'
          }`}
        >
          <Settings className={`h-6 w-6 ${isAdmin ? 'text-white' : 'text-gray-300'}`} />
          <span className={`max-w-0 overflow-hidden transition-all duration-300 group-hover:max-w-xs whitespace-nowrap ${
            isAdmin ? 'text-white' : 'text-gray-300'
          }`}>
            {isAdmin ? 'Admin Mode' : 'Login'}
          </span>
        </button>

        {isAdmin && (
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>

      {isAdmin && showTooltip && (
        <div className="absolute bottom-16 right-0 bg-gray-800/95 backdrop-blur p-4 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <KeyRound className="h-4 w-4" />
            <span className="text-sm font-medium">Admin Mode Active</span>
          </div>
          <div className="space-y-2 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-gray-400" />
              <span>Click content to edit</span>
            </div>
            <div className="text-xs text-gray-400">
              Press Ctrl+Shift+A to toggle
            </div>
          </div>
        </div>
      )}
    </div>
  )
}