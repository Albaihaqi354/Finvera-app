"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Eye, EyeOff } from 'lucide-react'

const InputField = ({ label, type = "text", placeholder, id }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id || label} className="text-sm font-semibold text-brand-black">
        {label}
      </label>
      <div className="relative">
        <input 
          type={inputType} 
          id={id || label} 
          className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all placeholder:text-black/40 text-sm sm:text-base bg-white" 
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`} 
        />
        {isPassword && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-gray-1 hover:text-brand-black transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
};

const SelectField = ({ label, value, addon, options }) => {
  const [currentAddon, setCurrentAddon] = useState(options ? options.find(o => o.value === value)?.addon : addon);

  const handleChange = (e) => {
    if (options) {
      const selected = options.find((opt) => opt.value === e.target.value);
      if (selected) setCurrentAddon(selected.addon);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={label} className="text-sm font-semibold text-brand-black">
        {label}
      </label>
      <div className="relative">
        <select 
          id={label} 
          className="block w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all text-sm sm:text-base bg-white appearance-none cursor-pointer text-brand-black"
          defaultValue={value}
          onChange={options ? handleChange : undefined}
        >
          {options ? (
            options.map((opt, idx) => (
              <option key={idx} className="bg-white text-brand-black" value={opt.value}>
                {opt.label}
              </option>
            ))
          ) : (
            <option className="bg-white text-brand-black" value={value}>{value}</option>
          )}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 gap-2">
          {currentAddon && <span className="text-xs text-brand-black/60 font-medium">{currentAddon}</span>}
          <svg className="fill-current h-4 w-4 text-brand-black/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

function SignupPage() {
  const [step, setStep] = useState(1);
  const [usePreset, setUsePreset] = useState(true);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F9EFE5] dark:bg-[#F9EFE5] font-ibm p-4 sm:p-8 lg:p-12 overflow-x-hidden">
      {/* Logo Container */}
      <Logo />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-7xl w-full z-10 pt-16 sm:pt-20 lg:pt-0">
        
        {/* Left Side: Image Illustration */}
        <section className="hidden lg:flex w-full lg:w-2/5 justify-center items-center">
          <Image 
            src="/image/man-taking-photo.svg" 
            alt="Signup Illustration" 
            width={700} 
            height={700}
            className="w-[120%] lg:w-[130%] max-w-175 h-auto object-contain drop-shadow-lg scale-110 xl:scale-125 transition-transform"
            priority
          />
        </section>

        {/* Right Side: Form */}
        <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm border border-base-gray-1/10 max-w-2xl w-full">
          {/* Progress Stepper */}
          <div className="flex items-center text-sm mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none border-b border-brand-black/5">
            {/* Step 1 */}
            <div className={`flex items-center pb-4 ${step === 2 ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${step === 1 ? 'border-brand-black' : 'border-brand-black/40'}`}>
                {step === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-black"></div>}
                {step === 2 && <svg className="w-3 h-3 text-brand-black/40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className={`ml-3 text-2xl font-bold ${step === 1 ? 'text-brand-black' : 'text-brand-black/40'}`}>01</span>
              <div className="ml-3 flex flex-col justify-center">
                <span className="text-xs font-bold text-brand-black leading-tight">User Information</span>
                <span className="text-[10px] font-medium text-base-gray-1 mt-0.5">Basic Information</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-8 sm:w-12 lg:w-16 border-t-2 border-brand-black/10 mx-4 sm:mx-6 mb-4"></div>
            
            {/* Step 2 */}
            <div className={`flex items-center pb-4 ${step === 1 ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${step === 2 ? 'border-brand-black' : 'border-brand-black/40'}`}>
                {step === 2 && <div className="w-2.5 h-2.5 rounded-full bg-brand-black"></div>}
              </div>
              <span className={`ml-3 text-2xl font-bold ${step === 2 ? 'text-brand-black' : 'text-brand-black/40'}`}>02</span>
              <div className="ml-3 flex flex-col justify-center">
                <span className="text-xs font-bold text-brand-black leading-tight">Transaction Categories</span>
                <span className="text-[10px] font-medium text-base-gray-1 mt-0.5">Preset Categories</span>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">Basic Information</h1>
              <p className="text-sm sm:text-base text-base-gray-1 leading-relaxed mb-8">
                Already have an account? <Link href="/auth/signin" className="text-brand-black font-bold hover:text-base-gray-1 transition-colors">Click here to log in</Link>
              </p>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="flex flex-col sm:flex-row gap-5">
                  <InputField label="Username" placeholder="Enter username" />
                  <InputField label="Nickname" placeholder="Enter nickname" />
                </div>
                
                <InputField label="E-mail" type="email" placeholder="Enter your e-mail address" />

                <div className="flex flex-col sm:flex-row gap-5">
                  <InputField label="Password" type="password" placeholder="Enter your Password" />
                  <InputField label="Confirm Password" type="password" placeholder="Confirm your Password" />
                </div>

                <SelectField label="Language" value="English" />

                <div className="flex flex-col sm:flex-row gap-5">
                  <SelectField 
                    label="Default Currency" 
                    value="United States Dollar" 
                    options={[
                      { label: "United States Dollar", value: "United States Dollar", addon: "USD" },
                      { label: "Indonesian Rupiah", value: "Indonesian Rupiah", addon: "IDR" }
                    ]} 
                  />
                  <SelectField 
                    label="First Day of Week" 
                    value="Sunday" 
                    options={[
                      { label: "Sunday", value: "Sunday" },
                      { label: "Monday", value: "Monday" },
                      { label: "Tuesday", value: "Tuesday" },
                      { label: "Wednesday", value: "Wednesday" },
                      { label: "Thursday", value: "Thursday" },
                      { label: "Friday", value: "Friday" },
                      { label: "Saturday", value: "Saturday" },
                    ]}
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 gap-4 w-full">
                  <button disabled type="button" className="px-6 py-3.5 sm:py-4 rounded-xl border-2 border-transparent bg-brand-black/5 text-base-gray-1/50 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-not-allowed transition-all w-full sm:w-auto">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     <span className="inline">Previous</span>
                  </button>
                  <button type="submit" className="cursor-pointer w-full sm:w-auto flex-1 sm:flex-none px-8 py-3.5 sm:py-4 rounded-xl bg-brand-black border-2 border-transparent hover:bg-transparent hover:border-brand-black hover:text-brand-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-none">
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">Preset Categories</h1>
              <p className="text-sm sm:text-base text-base-gray-1 leading-relaxed mb-8">
                Set whether to use preset transaction categories
              </p>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => setUsePreset(!usePreset)}
                      className={`cursor-pointer relative flex items-center w-12 h-6 rounded-full transition-colors ${usePreset ? 'bg-[#D68E5A]' : 'bg-gray-200'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${usePreset ? 'translate-x-7' : 'translate-x-1'}`}></span>
                    </button>
                    <span className="text-sm font-semibold text-brand-black">Use Preset Transaction Categories</span>
                  </div>
                  <span className="text-[#D68E5A] text-sm font-semibold">English</span>
                </div>

                {usePreset && (
                  <div className="space-y-6 max-h-[350px] sm:max-h-[450px] overflow-y-auto pr-2">
                    <div>
                      <h2 className="text-sm font-bold text-base-gray-1 mb-3">Income Categories</h2>
                      <div className="space-y-2">
                        {[
                          { name: 'Occupational Earnings', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg> },
                          { name: 'Finance & Investment', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg> },
                          { name: 'Miscellaneous', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg> }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white border-2 border-brand-black/5 hover:border-[#D68E5A]/30 transition-colors rounded-xl group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 flex items-center justify-center bg-[#D68E5A]/10 text-[#D68E5A] rounded-lg">
                                {item.icon}
                              </div>
                              <span className="text-sm font-semibold text-brand-black">{item.name}</span>
                            </div>
                            <svg className="w-5 h-5 text-base-gray-1/30 group-hover:text-[#D68E5A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-base-gray-1 mb-3">Expense Categories</h2>
                      <div className="space-y-2">
                        {[
                          { name: 'Food & Drink', colorStyle: 'text-orange-500 bg-orange-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l2 2a1 1 0 010 1.414l-2 2A1 1 0 0111 7v10a1 1 0 11-2 0V7a1 1 0 01-.293-.707l2-2a1 1 0 011.414 0l.707.707z" clipRule="evenodd" /></svg> },
                          { name: 'Clothing & Appearance', colorStyle: 'text-purple-500 bg-purple-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> },
                          { name: 'Housing & Houseware', colorStyle: 'text-gray-600 bg-gray-100', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
                          { name: 'Transportation', colorStyle: 'text-teal-500 bg-teal-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg> },
                          { name: 'Communication', colorStyle: 'text-blue-500 bg-blue-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.438a1 1 0 01-.328.968l-2.384 2.185a12.032 12.032 0 005.438 5.438l2.185-2.384a1 1 0 01.968-.328l4.438.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg> },
                          { name: 'Entertainment', colorStyle: 'text-rose-500 bg-rose-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> },
                          { name: 'Education & Studying', colorStyle: 'text-lime-500 bg-lime-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg> },
                          { name: 'Gifts & Donations', colorStyle: 'text-green-500 bg-green-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" /><path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" /></svg> },
                          { name: 'Medical & Healthcare', colorStyle: 'text-red-500 bg-red-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg> },
                          { name: 'Finance & Insurance', colorStyle: 'text-amber-500 bg-amber-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg> },
                          { name: 'Miscellaneous', colorStyle: 'text-gray-500 bg-gray-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg> },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white border-2 border-brand-black/5 hover:border-brand-black/10 transition-colors rounded-xl group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.colorStyle}`}>
                                {item.icon}
                              </div>
                              <span className="text-sm font-semibold text-brand-black">{item.name}</span>
                            </div>
                            <svg className="w-5 h-5 text-base-gray-1/30 group-hover:text-brand-black/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-base-gray-1 mb-3">Transfer Categories</h2>
                      <div className="space-y-2">
                        {[
                          { name: 'General Transfer', colorStyle: 'text-orange-500 bg-orange-50', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
                          { name: 'Loan & Debt', colorStyle: 'text-amber-500 bg-amber-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg> },
                          { name: 'Miscellaneous', colorStyle: 'text-gray-500 bg-gray-50', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg> },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white border-2 border-brand-black/5 hover:border-brand-black/10 transition-colors rounded-xl group cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.colorStyle}`}>
                                {item.icon}
                              </div>
                              <span className="text-sm font-semibold text-brand-black">{item.name}</span>
                            </div>
                            <svg className="w-5 h-5 text-base-gray-1/30 group-hover:text-brand-black/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 bg-white gap-4 w-full">
                  <button onClick={() => setStep(1)} type="button" className="cursor-pointer px-6 py-3.5 sm:py-4 rounded-xl border-2 border-transparent bg-[#D68E5A]/10 text-[#D68E5A] hover:bg-[#D68E5A]/20 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     <span className="inline">Previous</span>
                  </button>
                  <button type="button" className="cursor-pointer w-full sm:w-auto flex-1 sm:flex-none px-8 py-3.5 sm:py-4 rounded-xl bg-brand-black border-2 border-transparent hover:bg-transparent hover:border-brand-black hover:text-brand-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-none">
                    Submit ✓
                  </button>
                </div>
              </div>
            </div>
          )}
          
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

export default SignupPage