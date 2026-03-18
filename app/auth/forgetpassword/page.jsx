import React from 'react'
import Image from 'next/image'
import Logo from '@/components/Logo'
import Link from 'next/link'

function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F9EFE5] dark:bg-[#F9EFE5] font-ibm p-6 sm:p-10 overflow-hidden">
      {/* Logo Container */}
      <Logo />
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 max-w-6xl w-full">
        <section className="w-full lg:w-1/2 flex justify-center">
          <Image 
            src="/image/SignIn.svg" 
            alt="Signup Illustration" 
            width={400} 
            height={400}
            className="w-4/5 sm:w-2/3 lg:w-2/3 h-auto"
            priority
          />
        </section>
        
        <section className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-base-gray-1/10 max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-4">Forget Password?</h1>
          <p className="text-base-gray-1 leading-relaxed mb-8">
            Please enter your email address used for registration and we&apos;ll send you an email with a reset password link
          </p>
          
          <form action="" className='flex flex-col gap-6'>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-brand-black">E-Mail</label>
              <input 
                type="email" 
                className='border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all placeholder:text-black/40' 
                placeholder='Enter your e-mail address'
              />
            </div>
            
            <button className='text-white bg-black rounded-xl py-4 border-2 border-transparent hover:bg-transparent hover:border-black cursor-pointer hover:text-black font-semibold transition-all shadow-lg hover:shadow-none'>
              Send Reset Link
            </button>
            <Link href="/auth/signin" className='text-center text-brand-black font-semibold cursor-pointer hover:text-base-gray-1 transition-all mt-2'>
              Back to the Login page
            </Link>
          </form>
          
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

export default SignupPage
