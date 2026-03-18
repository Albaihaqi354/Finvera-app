"use client"
import Logo from '@/components/Logo'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function SigninPage() {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F9EFE5] dark:bg-[#F9EFE5] font-ibm p-4 sm:p-8 lg:p-12 overflow-hidden">
      {/* Logo Container */}
      <Logo />
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl w-full z-10 pt-16 sm:pt-20 lg:pt-0">
        
        {/* Left Side: Image Illustration */}
        <section className="w-full lg:w-1/2 flex justify-center">
          <Image 
            src="/image/Signup.svg" 
            alt="Signin Illustration" 
            width={400} 
            height={400}
            className="w-3/4 sm:w-2/3 lg:max-w-100 h-auto object-contain drop-shadow-lg"
            priority
          />
        </section>
        
        {/* Right Side: Form */}
        <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm border border-base-gray-1/10 max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-brand-black mb-3">
            Welcome to Finvera
          </h1>
          <p className="text-sm sm:text-base text-base-gray-1 leading-relaxed mb-8">
            Please log in with your Finvera account. You can use the demo account (user name &quot;<span className="font-semibold text-brand-black">demo</span>&quot;, password &quot;<span className="font-semibold text-brand-black">Finvera</span>&quot;), or register a new user.
          </p>
          
          <form action="" className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-brand-black">
                E-Mail
              </label>
              <input 
                id="email"
                type="email" 
                className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all placeholder:text-black/40 text-sm sm:text-base" 
                placeholder="Enter your e-mail address"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-brand-black">
                Password
              </label>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 pl-4 pr-12 rounded-xl transition-all placeholder:text-black/40 text-sm sm:text-base" 
                  placeholder="Enter your Password"
                  required
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-gray-1 hover:text-brand-black transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Link 
                href="/auth/forgetpassword"
                className="text-base-gray-1 hover:text-brand-black cursor-pointer self-end text-xs sm:text-sm font-medium transition-colors mt-1"
              >
                Forget Password?
              </Link>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              className="mt-2 text-white bg-brand-black rounded-xl py-3.5 sm:py-4 border-2 border-transparent hover:bg-transparent hover:border-brand-black cursor-pointer hover:text-brand-black font-semibold transition-all shadow-md hover:shadow-none text-sm sm:text-base"
            >
              Log In
            </button>
            
            {/* Create Account Link */}
            <div className="flex justify-center items-center gap-2 mt-2">
               <p className="text-xs sm:text-sm text-base-gray-1">
                 Don&apos;t have an account?
               </p>
               <Link 
                 href="/auth/signup"
                 className="text-xs sm:text-sm text-brand-black font-bold cursor-pointer hover:text-base-gray-1 transition-all"
               >
                 Create Account
               </Link>
            </div>
          </form>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-base-gray-1/10 text-center">
            <p className="text-[10px] sm:text-xs font-medium text-base-gray-2/60">
              © {new Date().getFullYear()} Finvera. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SigninPage