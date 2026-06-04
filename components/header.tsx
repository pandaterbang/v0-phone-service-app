'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { Menu, X, LogOut, Smartphone } from 'lucide-react'

export default function Header({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-gradient-to-r from-background to-background via-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Phone Service
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/shops" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Browse Shops
              </Link>
              {user && (
                <Link href="/dashboard" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <form action="/auth/logout" method="POST">
                  <button className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors rounded-lg px-3 py-2 hover:bg-primary/10">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link href="/auth/sign-up" className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden border-t border-primary/10 py-4 space-y-3 bg-primary/5">
            <Link href="/shops" className="block text-foreground hover:text-primary px-2 py-2 rounded transition-colors">
              Browse Shops
            </Link>
            {user && (
              <Link href="/dashboard" className="block text-foreground hover:text-primary px-2 py-2 rounded transition-colors">
                Dashboard
              </Link>
            )}
            {user ? (
              <form action="/auth/logout" method="POST">
                <button className="w-full text-left text-foreground hover:text-primary px-2 py-2 rounded transition-colors">
                  Logout
                </button>
              </form>
            ) : (
              <>
                <Link href="/auth/login" className="block text-foreground hover:text-primary px-2 py-2 rounded transition-colors">
                  Login
                </Link>
                <Link href="/auth/sign-up" className="block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg text-center font-medium">
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
