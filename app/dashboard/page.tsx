'use client';

import { useEffect, useState } from 'react'
import { Archive, RefreshCw, LogOut, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Submission = {
  id: string
  name: string
  email: string
  phone?: string
  service?: string
  message: string
  created_at: string
  status?: 'active' | 'archived'
}

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [quoteRequests, setQuoteRequests] = useState<Submission[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.replace('/login')
          return
        }
        setIsAuthenticated(true)
        fetchSubmissions()
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/login')
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.replace('/login')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      setError('Failed to logout')
    }
  }

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/submissions')
      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }

      const data = await response.json()
      console.log('Dashboard - Fetched data:', data)

      // Add status field if missing
      const quotesWithStatus = (data.quotes || []).map((quote: Submission) => ({
        ...quote,
        status: quote.status || 'active'
      }))
      
      const contactsWithStatus = (data.contacts || []).map((contact: Submission) => ({
        ...contact,
        status: contact.status || 'active'
      }))

      console.log('Dashboard - Processed quotes:', quotesWithStatus)
      console.log('Dashboard - Processed contacts:', contactsWithStatus)

      setQuoteRequests(quotesWithStatus)
      setContactSubmissions(contactsWithStatus)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submissions'
      console.error('Fetch error:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSubmissionStatus = async (
    id: string,
    type: 'quote' | 'contact',
    newStatus: 'active' | 'archived'
  ) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Update local state
      if (type === 'quote') {
        setQuoteRequests(prev =>
          prev.map(quote =>
            quote.id === id ? { ...quote, status: newStatus } : quote
          )
        )
      } else {
        setContactSubmissions(prev =>
          prev.map(contact =>
            contact.id === id ? { ...contact, status: newStatus } : contact
          )
        )
      }
    } catch (error) {
      console.error('Error updating submission status:', error)
      setError('Failed to update submission status')
    }
  }

  const filteredQuotes = quoteRequests.filter(quote => quote.status === activeTab)
  const filteredContacts = contactSubmissions.filter(contact => contact.status === activeTab)

  if (!isAuthenticated) {
    return null // Don't render anything while checking auth
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 p-8 bg-[#111111] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Submissions Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/editmode')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Website
            </button>
            <button
              onClick={fetchSubmissions}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'archived'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Archived
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quote Requests */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Quote Requests</h2>
              <div className="grid gap-4">
                {filteredQuotes.map(quote => (
                  <div
                    key={quote.id}
                    className="bg-[#1a1a1a] p-6 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium text-white">{quote.name}</h3>
                        <p className="text-gray-400">{quote.email}</p>
                        {quote.phone && (
                          <p className="text-gray-400">{quote.phone}</p>
                        )}
                        {quote.service && (
                          <p className="text-primary mt-2">{quote.service}</p>
                        )}
                        <p className="text-gray-300 mt-4">{quote.message}</p>
                        <p className="text-gray-500 text-sm mt-4">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSubmissionStatus(
                            quote.id,
                            'quote',
                            activeTab === 'active' ? 'archived' : 'active'
                          )
                        }
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title={activeTab === 'active' ? 'Archive' : 'Restore'}
                      >
                        {activeTab === 'active' ? (
                          <Archive className="w-5 h-5 text-gray-400" />
                        ) : (
                          <RefreshCw className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                {filteredQuotes.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    No {activeTab} quote requests found
                  </p>
                )}
              </div>
            </div>

            {/* Contact Submissions */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Submissions</h2>
              <div className="grid gap-4">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="bg-[#1a1a1a] p-6 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium text-white">{contact.name}</h3>
                        <p className="text-gray-400">{contact.email}</p>
                        <p className="text-gray-300 mt-4">{contact.message}</p>
                        <p className="text-gray-500 text-sm mt-4">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSubmissionStatus(
                            contact.id,
                            'contact',
                            activeTab === 'active' ? 'archived' : 'active'
                          )
                        }
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title={activeTab === 'active' ? 'Archive' : 'Restore'}
                      >
                        {activeTab === 'active' ? (
                          <Archive className="w-5 h-5 text-gray-400" />
                        ) : (
                          <RefreshCw className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    No {activeTab} contact submissions found
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 