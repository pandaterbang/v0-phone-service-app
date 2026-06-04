'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'

export default function Header({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              My Phone Service
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/shops" className="text-gray-600 hover:text-gray-900">
                Browse Shops
              </Link>
              {user && (
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <form action="/auth/logout" method="POST">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link href="/shops" className="block text-gray-600 hover:text-gray-900">
              Browse Shops
            </Link>
            {user && (
              <Link href="/dashboard" className="block text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            )}
            {user ? (
              <form action="/auth/logout" method="POST">
                <button className="w-full text-left text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </form>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/sign-up" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
