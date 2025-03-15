'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { safeNavigate, safeGetPath } from '../utils/browser';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Login successful, attempting navigation');
        
        try {
          // First try using Next.js router
          await router.push('/dashboard');
          
          // Add a small delay to check if navigation worked
          setTimeout(() => {
            const currentPath = safeGetPath();
            console.log('Current path after router.push:', currentPath);
            
            if (currentPath !== '/dashboard') {
              console.log('Router navigation failed, using fallback');
              safeNavigate('/dashboard');
            }
          }, 100);
        } catch (navError) {
          console.log('Navigation error, using fallback:', navError);
          safeNavigate('/dashboard');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Company Login</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#a3a300] focus:border-transparent text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#a3a300] focus:border-transparent text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#a3a300] hover:bg-[#a3a300]/90 text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 