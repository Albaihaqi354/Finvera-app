"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('finvera_user')
    if (!user) {
      router.replace('/auth/signin')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-light font-ibm">
        <p className="text-sm font-medium text-brand-black/50">Loading...</p>
      </div>
    )
  }

  return children
}
