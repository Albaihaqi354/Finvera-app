"use client"
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import MdiIcon from '@/components/icons/MdiIcon'
import {
  mdiAccount,
  mdiChevronDown,
  mdiAccountCogOutline,
  mdiCogOutline,
  mdiLogout,
  mdiMenu,
} from '@/lib/icons/mdi'

export default function Navbar({ onMenuClick }) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigateTo = (path) => {
    router.push(`/desktop/${path}`)
    setIsDropdownOpen(false)
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    setIsLogoutModalOpen(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem('finvera_user')
    router.push('/auth/signin')
  }

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('finvera_user') : null
  const user = userStr ? JSON.parse(userStr) : { username: 'User', email: 'user@finvera.app' }

  return (
    <>
      <nav className="px-4 sm:px-6 py-3 flex items-center justify-between z-40 bg-white/70 backdrop-blur-sm border-b border-brand-black/5 sticky top-0">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-brand-black/5 transition-colors cursor-pointer text-brand-black/60"
            aria-label="Open menu"
          >
            <MdiIcon path={mdiMenu} size={22} />
          </button>

          {/* Logo — shown on mobile (sidebar hidden), hidden on lg+ (sidebar shows logo) */}
          <div className="lg:hidden">
            <Image
              src="/image/Finvera-logo.png"
              alt="Finvera Logo"
              width={120}
              height={40}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: user dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-2 pr-3 rounded-xl hover:bg-brand-black/5 transition-colors focus:outline-none border-2 border-transparent hover:border-brand-black/10 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-brand-black/10 flex items-center justify-center overflow-hidden border border-brand-black/10">
              <MdiIcon path={mdiAccount} size={18} className="text-brand-black/60" />
            </div>
            <span className="hidden sm:block text-sm font-bold text-brand-black">{user.username}</span>
            <MdiIcon
              path={mdiChevronDown}
              size={16}
              className={`text-brand-black/50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-brand-black/10 overflow-hidden z-50">
              {/* User info */}
              <div className="p-5 border-b border-brand-black/5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E6923F] to-[#D2691E] flex items-center justify-center text-white font-bold text-lg">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-bold text-brand-black truncate">{user.username}</h3>
                  <span className="text-xs font-medium text-brand-black/40 mt-0.5 truncate">{user.email}</span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => navigateTo('settings/user')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-black hover:bg-brand-black/5 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                    <MdiIcon path={mdiAccountCogOutline} size={16} />
                  </div>
                  User Settings
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('settings/app')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-black hover:bg-brand-black/5 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                    <MdiIcon path={mdiCogOutline} size={16} />
                  </div>
                  Application Settings
                </button>
              </div>

              <div className="p-2 border-t border-brand-black/5">
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center">
                    <MdiIcon path={mdiLogout} size={16} />
                  </div>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout confirm modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdiIcon path={mdiLogout} size={32} className="ml-1" />
            </div>
            <h3 className="text-xl font-bold text-brand-black mb-2">Logout</h3>
            <p className="text-brand-black/60 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 px-4 bg-brand-black/5 hover:bg-brand-black/10 text-brand-black font-bold rounded-xl transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
