'use client'

import { useAdmin } from '@/context/admin-context'

function AdminControls() {
  const { isAdmin, login, logout } = useAdmin()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isAdmin ? (
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-[#111111] bg-[#a3a300] hover:bg-[#a3a300]/90 rounded-lg transition-colors shadow-lg"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={login}
          className="px-4 py-2 text-sm font-medium text-[#111111] bg-[#a3a300] hover:bg-[#a3a300]/90 rounded-lg transition-colors shadow-lg"
        >
          Admin Login
        </button>
      )}
    </div>
  )
}

export default AdminControls