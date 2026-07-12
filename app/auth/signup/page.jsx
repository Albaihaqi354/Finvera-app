"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { Eye, EyeOff } from 'lucide-react'
import { api, setToken } from '@/lib/api/client'
import {
  PRESET_INCOME_CATEGORIES,
  PRESET_EXPENSE_CATEGORIES,
  PRESET_TRANSFER_CATEGORIES,
} from '@/lib/presetCategories'

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
          className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all placeholder:text-black/40 text-sm sm:text-base bg-surface" 
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
          className="block w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl transition-all text-sm sm:text-base bg-surface appearance-none cursor-pointer text-brand-black"
          defaultValue={value}
          onChange={options ? handleChange : undefined}
        >
          {options ? (
            options.map((opt, idx) => (
              <option key={idx} className="bg-surface text-brand-black" value={opt.value}>
                {opt.label}
              </option>
            ))
          ) : (
            <option className="bg-surface text-brand-black" value={value}>{value}</option>
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

/** Single accordion category group item */
function CategoryGroupItem({ item, isExpanded, onToggle, accentColor }) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="rounded-xl border-2 border-brand-black/5 overflow-hidden transition-all">
      {/* Group header — clickable */}
      <button
        type="button"
        id={`category-group-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
        onClick={() => hasChildren && onToggle(item.name)}
        className={`w-full flex items-center justify-between p-4 bg-surface transition-colors group ${
          hasChildren ? 'cursor-pointer hover:bg-brand-black/[0.02]' : 'cursor-default'
        } ${isExpanded ? 'border-b-2 border-brand-black/5' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.colorClass}`}>
            <span className="text-base leading-none">{item.icon}</span>
          </div>
          <span className="text-sm font-semibold text-brand-black">{item.name}</span>
          {hasChildren && (
            <span className="text-[10px] font-medium text-brand-black/30 ml-1">
              ({item.children.length})
            </span>
          )}
        </div>
        {hasChildren && (
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
            style={{ color: isExpanded ? accentColor : undefined }}
            fill="none"
            stroke={isExpanded ? accentColor : 'currentColor'}
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Sub-items dropdown */}
      {hasChildren && isExpanded && (
        <div className="divide-y divide-brand-black/5 bg-brand-black/[0.01]">
          {item.children.map((child, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-5 py-3 hover:bg-brand-black/[0.03] transition-colors"
            >
              <div className={`w-6 h-6 flex items-center justify-center rounded-md ${child.colorClass} opacity-80`}>
                <span className="text-xs leading-none">{child.icon}</span>
              </div>
              <span className="text-sm text-brand-black/80 font-medium">{child.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [usePreset, setUsePreset] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [presetData, setPresetData] = useState(null);
  const [isLoadingPreset, setIsLoadingPreset] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch preset categories from API when step 2 loads
  useEffect(() => {
    if (step === 2 && !presetData) {
      setIsLoadingPreset(true);
      api.presetCategories.getAll()
        .then((data) => {
          if (data && Array.isArray(data)) {
            // Transform flat API data into grouped structure
            const parents = data.filter(c => !c.parentId);
            const grouped = parents.map(parent => ({
              ...parent,
              children: data.filter(c => c.parentId === parent.id),
            }));
            const income = grouped.filter(c => c.type === 'income');
            const expense = grouped.filter(c => c.type === 'expense');
            const transfer = grouped.filter(c => c.type === 'transfer');
            setPresetData({ income, expense, transfer });
          } else {
            throw new Error('Invalid data format');
          }
        })
        .catch(() => {
          // Fallback to hardcoded data if API is unavailable
          setPresetData({
            income: PRESET_INCOME_CATEGORIES,
            expense: PRESET_EXPENSE_CATEGORIES,
            transfer: PRESET_TRANSFER_CATEGORIES,
          });
        })
        .finally(() => setIsLoadingPreset(false));
    }
  }, [step]);

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError('');
      await api.auth.register({ username, email, password });
      
      // Auto login after register
      const loginRes = await api.auth.login({ username, password });
      if (loginRes && loginRes.token) {
        setToken(loginRes.token);
        localStorage.setItem('finvera_user', JSON.stringify({
          username,
          loggedInAt: new Date().toISOString()
        }));
        router.push('/desktop/overview');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const incomeCategories = presetData?.income ?? PRESET_INCOME_CATEGORIES;
  const expenseCategories = presetData?.expense ?? PRESET_EXPENSE_CATEGORIES;
  const transferCategories = presetData?.transfer ?? PRESET_TRANSFER_CATEGORIES;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-primary font-ibm p-4 sm:p-6 overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-surface/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#E6923F]/20 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-2xl z-10 flex flex-col items-center py-8">
        {/* Logo centered above card */}
        <div className="mb-6">
          <Logo />
        </div>
        {/* Card */}
        <section className="bg-[#fcf8f4] p-6 sm:p-8 rounded-3xl shadow-2xl border border-brand-black/5 w-full relative z-10 flex flex-col gap-6 sm:gap-8">
          {/* Progress Stepper */}
          <div className="flex items-center justify-center text-sm mb-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none border-b border-brand-black/5 w-full">
            {/* Step 1 */}
            <div className={`flex items-center pb-4 ${step === 2 ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${step === 1 ? 'border-brand-black' : 'border-brand-black/40'}`}>
                {step === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-black"></div>}
                {step === 2 && <svg className="w-3 h-3 text-brand-black/40" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className={`ml-3 text-2xl font-bold ${step === 1 ? 'text-brand-black' : 'text-brand-black/40'}`}>01</span>
              <div className="ml-3 flex flex-col justify-center">
                <span className="text-xs font-bold text-brand-black leading-tight">User Information</span>
                <span className="text-[10px] font-medium text-base-gray-1 mt-0.5 hidden sm:block">Basic Information</span>
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
                <span className="text-[10px] font-medium text-base-gray-1 mt-0.5 hidden sm:block">Preset Categories</span>
              </div>
            </div>
          </div>

          <div className="w-full">
            {step === 1 ? (
              <div className="w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">Basic Information</h1>
                <p className="text-sm sm:text-base text-base-gray-1 leading-relaxed mb-6">
                  Already have an account? <Link href="/auth/signin" className="text-brand-black font-bold hover:text-base-gray-1 transition-colors">Click here to log in</Link>
                </p>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-semibold text-brand-black">Username</label>
                      <input value={username} onChange={e=>setUsername(e.target.value)} required className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl" placeholder="Enter username" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-semibold text-brand-black">E-mail</label>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl" placeholder="Enter your e-mail" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-semibold text-brand-black">Password</label>
                      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border-2 border-brand-black/10 focus:border-brand-black outline-none py-3 px-4 rounded-xl" placeholder="Enter your password" />
                    </div>
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
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">Preset Categories</h1>
                <p className="text-sm sm:text-base text-base-gray-1 leading-relaxed mb-8">
                  Set whether to use preset transaction categories
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        id="toggle-preset-categories"
                        onClick={() => setUsePreset(!usePreset)}
                        className={`cursor-pointer relative flex items-center w-12 h-6 rounded-full transition-colors ${usePreset ? 'bg-[#D68E5A]' : 'bg-gray-200'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-surface absolute top-1 transition-transform ${usePreset ? 'translate-x-7' : 'translate-x-1'}`}></span>
                      </button>
                      <span className="text-sm font-semibold text-brand-black">Use Preset Transaction Categories</span>
                    </div>
                    <span className="text-[#D68E5A] text-sm font-semibold hidden sm:block">English</span>
                  </div>

                  {usePreset && (
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                      {isLoadingPreset ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-6 h-6 border-2 border-[#D68E5A] border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-3 text-sm text-base-gray-1">Loading categories...</span>
                        </div>
                      ) : (
                        <>
                          {/* Income Categories */}
                          <div>
                            <h2 className="text-xs font-bold text-base-gray-1 uppercase tracking-wider mb-3">
                              Income Categories
                              <span className="ml-2 text-[#D68E5A] font-semibold normal-case tracking-normal">
                                ({incomeCategories.length} groups)
                              </span>
                            </h2>
                            <div className="space-y-2">
                              {incomeCategories.map((item) => (
                                <CategoryGroupItem
                                  key={item.name}
                                  item={item}
                                  isExpanded={!!expandedGroups[item.name]}
                                  onToggle={toggleGroup}
                                  accentColor="#D68E5A"
                                />
                              ))}
                            </div>
                          </div>

                          {/* Expense Categories */}
                          <div>
                            <h2 className="text-xs font-bold text-base-gray-1 uppercase tracking-wider mb-3">
                              Expense Categories
                              <span className="ml-2 text-brand-black/50 font-semibold normal-case tracking-normal">
                                ({expenseCategories.length} groups)
                              </span>
                            </h2>
                            <div className="space-y-2">
                              {expenseCategories.map((item) => (
                                <CategoryGroupItem
                                  key={item.name}
                                  item={item}
                                  isExpanded={!!expandedGroups[item.name]}
                                  onToggle={toggleGroup}
                                  accentColor="#374151"
                                />
                              ))}
                            </div>
                          </div>

                          {/* Transfer Categories */}
                          <div>
                            <h2 className="text-xs font-bold text-base-gray-1 uppercase tracking-wider mb-3">
                              Transfer Categories
                              <span className="ml-2 text-brand-black/50 font-semibold normal-case tracking-normal">
                                ({transferCategories.length} groups)
                              </span>
                            </h2>
                            <div className="space-y-2">
                              {transferCategories.map((item) => (
                                <CategoryGroupItem
                                  key={item.name}
                                  item={item}
                                  isExpanded={!!expandedGroups[item.name]}
                                  onToggle={toggleGroup}
                                  accentColor="#374151"
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

                  <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 bg-transparent gap-4 w-full">
                    <button onClick={() => setStep(1)} type="button" className="cursor-pointer px-6 py-3.5 sm:py-4 rounded-xl border-2 border-transparent bg-[#D68E5A]/10 text-[#D68E5A] hover:bg-[#D68E5A]/20 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                       <span className="inline">Previous</span>
                    </button>
                    <button
                      id="submit-registration"
                      onClick={handleRegister}
                      disabled={isLoading}
                      type="button"
                      className="cursor-pointer w-full sm:w-auto flex-1 sm:flex-none px-8 py-3.5 sm:py-4 rounded-xl bg-brand-black border-2 border-transparent hover:bg-transparent hover:border-brand-black hover:text-brand-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Registering...</span>
                        </>
                      ) : 'Submit ✓'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-6 text-center">
          <p className="text-[10px] sm:text-xs font-medium text-base-gray-2">
            © {new Date().getFullYear()} Finvera. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage


