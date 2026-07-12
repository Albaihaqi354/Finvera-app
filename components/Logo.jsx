"use client"
import FinveraLogo from '@/components/FinveraLogo'

/**
 * Logo — used on auth pages (signin, signup, forget password).
 * Renders the full Finvera logo, centered above the form card.
 * Theme-aware via FinveraLogo component.
 */
export default function Logo() {
  return (
    <div className="flex justify-center">
      <FinveraLogo variant="full" size="lg" priority />
    </div>
  )
}
