"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Lock, Globe, AlertCircle } from 'lucide-react'

// ─── Mock User Database ───────────────────────────────────────────────────────
const MOCK_USERS = [
  { username: 'demo', email: 'demo@finvera.app', password: 'ezbookkeeping' },
  { username: 'demo', email: 'demo@finvera.app', password: 'Finvera' },
  { username: 'admin', email: 'admin@finvera.app', password: 'admin123' },
]

function SigninPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check credentials against mock database
    const user = MOCK_USERS.find(
      u => (u.username === username || u.email === username) && u.password === password
    )

    if (user) {
      // Store session in localStorage (mock session)
      localStorage.setItem('finvera_user', JSON.stringify({
        username: user.username,
        email: user.email,
        loggedInAt: new Date().toISOString()
      }))
      router.push('/desktop/overview')
    } else {
      setError('Username/email atau password salah. Coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-primary font-ibm p-4 sm:p-8 overflow-hidden">
      
      {/* Top right language switcher */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 text-brand-black/50 hover:text-brand-black cursor-pointer transition-colors z-20">
        <Globe size={20} />
        <span className="text-sm font-medium">English</span>
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center -mt-12 sm:-mt-20">
        {/* Centered Logo outside card */}
        <div className="mb-0 relative z-20">
          <Image 
            src="/image/Finvera-logo.png" 
            alt="Finvera Logo" 
            width={500} 
            height={100}
            className="h-32 sm:h-44 w-auto object-contain"
            priority
          />
        </div>

        {/* Card */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-black/5 w-full relative z-10 -mt-6 sm:-mt-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-brand-black">
              Log In
            </h1>
            <Link 
              href="/auth/signup"
              className="text-sm font-medium text-brand-black hover:text-base-gray-1 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 outline-none py-3.5 pl-12 pr-4 rounded-xl transition-all placeholder:text-base-gray-2 text-sm sm:text-base text-brand-black" 
                placeholder="Username atau Email"
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
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 outline-none py-3.5 pl-12 pr-12 rounded-xl transition-all placeholder:text-base-gray-2 text-sm sm:text-base text-brand-black" 
                placeholder="Password"
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
                <span className="text-sm text-base-gray-1 select-none">Remember me</span>
              </label>

              <Link 
                href="/auth/forgetpassword"
                className="text-sm font-medium text-base-gray-1 hover:text-brand-black transition-colors"
              >
                Forgot Password?
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Logging in...
                </>
              ) : 'Log In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
            <p className="text-xs font-bold text-base-gray-1 text-center uppercase tracking-wider">Demo Accounts</p>
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
            <p className="text-[10px] text-base-gray-2 text-center">Klik salah satu untuk mengisi otomatis</p>
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