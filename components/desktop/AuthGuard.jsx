"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, removeToken } from '@/lib/api/client'

/**
 * AuthGuard validates the JWT token by calling /users/me on mount.
 *
 * Why not just check localStorage?
 * - Anyone can set localStorage.setItem('finvera_user', '{}') and bypass a
 *   purely client-side check.
 * - The server validates the token signature and expiry — this is the only
 *   authoritative source of truth.
 */
export default function AuthGuard({ children }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function verifyToken() {
      // Fast-path: no token in storage — skip API call
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('finvera_token')
        : null

      if (!token) {
        router.replace('/auth/signin')
        return
      }

      try {
        // This call sends the Bearer token and returns 401 if invalid/expired.
        // The fetchApi wrapper will call removeToken() and redirect on 401
        // automatically, so we only need to handle the success case here.
        await api.users.getProfile()
        if (!cancelled) setReady(true)
      } catch {
        // Token is invalid or expired — remove stale data and redirect
        removeToken()
        router.replace('/auth/signin')
      }
    }

    verifyToken()

    return () => {
      cancelled = true
    }
  }, [router])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-light font-ibm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
          <p className="text-sm font-medium text-brand-black/50">Verifying session…</p>
        </div>
      </div>
    )
  }

  return children
}
