"use client"
import { useState } from 'react'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    // Password reset is not yet implemented on the backend.
    // Simulate a short delay and show a success message regardless
    // (do not confirm or deny whether the email exists — security best practice).
    await new Promise(r => setTimeout(r, 800))
    setIsLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-primary font-ibm p-6 sm:p-10 overflow-hidden">
      <div className="flex flex-col items-center justify-center max-w-md w-full">
        <div className="mb-3">
          <Logo />
        </div>

        <section className="bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-base-gray-1/10 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-4">Forgot Password?</h1>

          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <p className="text-sm text-brand-black/70 leading-relaxed">
                If an account with that email exists, we&apos;ve sent a password reset link. Please check your inbox.
              </p>
              <Link
                href="/auth/signin"
                className="mt-2 text-sm font-semibold text-brand-black hover:text-base-gray-1 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-base-gray-1 leading-relaxed mb-8">
                Enter the email address you used to register and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="reset-email" className="text-sm font-semibold text-brand-black">
                    E-Mail
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError('') }}
                    className="border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all placeholder:text-black/40"
                    placeholder="Enter your e-mail address"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white bg-black rounded-xl py-4 border-2 border-transparent hover:bg-transparent hover:border-black cursor-pointer hover:text-black font-semibold transition-all shadow-lg hover:shadow-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </button>

                <Link
                  href="/auth/signin"
                  className="text-center text-brand-black font-semibold cursor-pointer hover:text-base-gray-1 transition-all mt-2"
                >
                  Back to the Login page
                </Link>
              </form>
            </>
          )}

          <div className="mt-10 pt-6 border-t border-base-gray-1/10 text-center">
            <p className="text-xs font-medium text-base-gray-2">
              © {new Date().getFullYear()} Finvera. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
