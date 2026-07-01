"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { Eye, EyeOff, User, Lock, Globe, AlertCircle } from 'lucide-react'
import { api, setToken } from '@/lib/api/client'
import { useToast } from '@/components/ui/Toast'
import { useI18n } from '@/lib/i18n'

function mapLoginError(message, t) {
  if (!message) return t('something_went_wrong')
  if (message.toLowerCase().includes('invalid credentials')) return t('invalid_credentials')
  return message
}

function SigninPage() {
  const router = useRouter()
  const toast = useToast()
  const { t, lang, setLang } = useI18n()
  
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!username.trim()) {
      setError(t('username_required'))
      return
    }
    if (!password.trim()) {
      setError(t('password_required'))
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.login({ username, password })
      if (response && response.token) {
        setToken(response.token)
        localStorage.setItem('finvera_user', JSON.stringify({
          username,
          loggedInAt: new Date().toISOString()
        }))
        toast.success(`Welcome back, ${username}!`)
        router.push('/desktop/overview')
      } else {
        const msg = t('something_went_wrong')
        setError(msg)
        toast.error(msg)
      }
    } catch (err) {
      const msg = mapLoginError(err.message, t)
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-primary font-ibm p-4 sm:p-8 overflow-hidden">
      
      <Logo />

      {/* Top right language switcher */}
      <div 
        onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 text-brand-black/50 hover:text-brand-black cursor-pointer transition-colors z-20"
      >
        <Globe size={20} />
        <span className="text-sm font-medium">{lang === 'en' ? 'English' : 'Bahasa Indonesia'}</span>
      </div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Card */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-black/5 w-full relative z-10 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-brand-black">
              {t('log_in')}
            </h1>
            <Link
              href="/auth/signup"
              className="text-sm font-medium text-brand-black hover:text-base-gray-1 transition-colors"
            >
              {t('sign_up')}
            </Link>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Username/Email Field */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-gray-2">
                <User size={20} />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value)
                  if (error) setError('')
                }}
                className={`w-full bg-[#F8F8F8] border focus:bg-white outline-none py-3.5 pl-12 pr-4 rounded-xl transition-all placeholder:text-base-gray-2 text-sm sm:text-base text-brand-black ${
                  error && !username.trim() ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-brand-black/20'
                }`}
                placeholder={t('username_or_email')}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-gray-2">
                <Lock size={20} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                className={`w-full bg-[#F8F8F8] border focus:bg-white outline-none py-3.5 pl-12 pr-12 rounded-xl transition-all placeholder:text-base-gray-2 text-sm sm:text-base text-brand-black ${
                  error && !password.trim() ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-brand-black/20'
                }`}
                placeholder={t('password')}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-base-gray-2 hover:text-brand-black transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${rememberMe ? 'bg-brand-black border-brand-black' : 'border-base-gray-2 group-hover:border-brand-black'}`}
                >
                  {rememberMe && <div className="w-2 h-2 bg-brand-primary rounded-sm" />}
                </div>
                <span className="text-sm text-base-gray-1 select-none">{t('remember_me')}</span>
              </label>

              <Link
                href="/auth/forgetpassword"
                className="text-sm font-medium text-base-gray-1 hover:text-brand-black transition-colors"
              >
                {t('forgot_password')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full text-brand-primary bg-brand-black rounded-xl py-4 border-2 border-brand-black hover:bg-transparent hover:text-brand-black cursor-pointer font-semibold transition-all text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t('logging_in')}
                </>
              ) : t('log_in')}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
            <p className="text-xs font-bold text-base-gray-1 text-center uppercase tracking-wider">{t('demo_accounts')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setUsername('demo'); setPassword('ezbookkeeping'); setError('') }}
                className="text-left p-3 rounded-xl bg-[#F8F8F8] hover:bg-brand-black/5 border border-transparent hover:border-brand-black/10 transition-all cursor-pointer"
              >
                <p className="text-xs font-bold text-brand-black">demo</p>
                <p className="text-[10px] font-medium text-base-gray-1 mt-0.5">password: ezbookkeeping</p>
              </button>
              <button
                type="button"
                onClick={() => { setUsername('admin'); setPassword('admin123'); setError('') }}
                className="text-left p-3 rounded-xl bg-[#F8F8F8] hover:bg-brand-black/5 border border-transparent hover:border-brand-black/10 transition-all cursor-pointer"
              >
                <p className="text-xs font-bold text-brand-black">admin</p>
                <p className="text-[10px] font-medium text-base-gray-1 mt-0.5">password: admin123</p>
              </button>
            </div>
            <p className="text-[10px] text-base-gray-2 text-center">{t('demo_autofill')}</p>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-base-gray-2">
            © {new Date().getFullYear()} Finvera. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SigninPage