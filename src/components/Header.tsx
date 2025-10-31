"use client" 

import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  // Helper function to check for active link.
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  // Define our styles one time
  const baseStyle = "pb-1 transition-colors"
  const activeStyle = "text-white font-bold border-b-2 border-white"
  const inactiveStyle = "text-gray-400 hover:text-white"

  return (
    <nav className="w-full bg-[#111111] border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold text-white">
          LoanWallah
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-sm">
        <Link href="/" className={`${baseStyle} ${isActive('/') ? activeStyle : inactiveStyle}`}>
          HOME
        </Link>
        <Link href="/about" className={`${baseStyle} ${isActive('/about') ? activeStyle : inactiveStyle}`}>
          ABOUT US
        </Link>
        
        {/* Clerk: Shows links ONLY if user is signed out */}
        <SignedOut>
          <Link href="/sign-up" className={`${baseStyle} ${isActive('/sign-up') ? activeStyle : inactiveStyle}`}>
            SIGN UP
          </Link>
          <Link href="/sign-in" className={`${baseStyle} ${isActive('/sign-in') ? activeStyle : inactiveStyle}`}>
            LOG IN
          </Link>
        </SignedOut>

        {/* Clerk: Shows Profile Button ONLY if user is signed in */}
        <SignedIn>
          <Link href="/profile" className={`${baseStyle} ${isActive('/profile') ? activeStyle : inactiveStyle}`}>
            PROFILE
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}
