"use client"
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Settings, UserCog, LogOut, ChevronDown, User } from 'lucide-react'

function DesktopPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='min-h-screen bg-[#F9EFE5] font-ibm'>
        {/* NAVBAR SECTION */}
        <nav className="px-6 sm:px-10 py-6 flex items-center justify-between sticky top-0 z-50">
            {/* Left: Logo */}
            <div className="h-10 sm:h-12 flex items-center relative z-10">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-max h-auto overflow-visible">
                  <Image 
                    src="/image/Finvera-logo.png" 
                    alt="Finvera Logo" 
                    width={500} 
                    height={150}
                    className="h-28 sm:h-40 w-auto object-contain"
                    priority
                  />
                </div>
            </div>

            {/* Right: User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-brand-black/5 transition-colors focus:outline-none border-2 border-transparent hover:border-brand-black/10 cursor-pointer"
              >
                {/* User Photo / Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand-black/10 flex items-center justify-center overflow-hidden border border-brand-black/10">
                  <User className="w-6 h-6 text-brand-black/60" />
                  {/* Placeholder jika ada foto, bisa diganti dengan tag img */}
                  {/* <img src="/path/to/profile.jpg" alt="User Profile" className="w-full h-full object-cover" /> */}
                </div>
                
                {/* User Name */}
                <span className="hidden sm:block text-sm font-bold text-brand-black">
                  Nama User
                </span>
                
                {/* Chevron */}
                <ChevronDown className={`w-4 h-4 text-brand-black/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-brand-black/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
                  {/* Dropdown Header: User Info */}
                  <div className="p-5 border-b border-brand-black/5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-black/10 flex items-center justify-center border border-brand-black/10">
                      <User className="w-7 h-7 text-brand-black/60" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-brand-black">Nama User</h3>
                      <span className="text-xs font-medium text-base-gray-1 mt-0.5">user@example.com</span>
                    </div>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-black hover:bg-brand-black/5 rounded-xl transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                        <UserCog className="w-4 h-4" />
                      </div>
                      User Setting
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-black hover:bg-brand-black/5 rounded-xl transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      Application Settings
                    </button>
                  </div>
                  
                  {/* Logout Action */}
                  <div className="p-2 border-t border-brand-black/5 bg-gray-50/50">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-red-100/50 text-red-500 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
        </nav>
        
        {/* Page Content */}
        <main className="p-6 sm:p-10">
          {/* Main Desktop Content */}
        </main>
    </div>
  )
}

export default DesktopPage