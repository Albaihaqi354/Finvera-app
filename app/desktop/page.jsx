"use client"
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { 
  Settings, 
  UserCog, 
  LogOut, 
  ChevronDown, 
  User, 
  Home, 
  List, 
  PlusCircle, 
  PieChart, 
  Compass, 
  CreditCard, 
  LayoutGrid, 
  Tag, 
  StickyNote, 
  CalendarClock, 
  ArrowLeftRight, 
  Smartphone, 
  Info,
  RotateCcw,
  Eye,
  EyeOff,
  Landmark,
  PiggyBank,
  MoreVertical,
  Calendar,
  Layers,
  Pencil
} from 'lucide-react'

// Helper component for Sidebar items
const SidebarItem = ({ icon, label, rightIcon, active = false }) => (
  <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-brand-black/10' : 'hover:bg-brand-black/5'}`}>
    <div className="flex items-center gap-3">
      <div className="text-brand-black/50 group-hover:text-brand-black transition-colors">
        {icon}
      </div>
      <span className="text-sm font-bold text-brand-black/80">{label}</span>
    </div>
    {rightIcon && <div>{rightIcon}</div>}
  </div>
);

function DesktopPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
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
        <nav className="px-6 py-6 flex items-center justify-between z-50">
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
        <main className="pl-4 pr-4 sm:pl-8 sm:pr-10 flex flex-col lg:flex-row gap-6">
          {/* Left Section: Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 bg-[#f9efe5] rounded-[32px] pl-2 pr-6 py-6 text-brand-black overflow-hidden">
            <div className="space-y-1">
              {/* Overview Item */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] rounded-r-full -ml-2 pl-6 cursor-pointer shadow-md">
                <Home className="w-5 h-5 text-white" />
                <span className="font-bold text-white text-sm">Overview</span>
              </div>

              {/* TRANSACTION DATA SECTION */}
              <div className="pt-8 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] w-4 bg-brand-black/10"></div>
                  <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest whitespace-nowrap">Transaction Data</span>
                  <div className="h-[1px] flex-grow bg-brand-black/10"></div>
                </div>
                
                <div className="space-y-1">
                  <SidebarItem icon={<List className="w-5 h-5" />} label="Transaction Details" rightIcon={<PlusCircle className="w-4 h-4 text-brand-black/30" />} />
                  <SidebarItem icon={<PieChart className="w-5 h-5" />} label="Statistics & Analysis" />
                  <SidebarItem icon={<Compass className="w-5 h-5" />} label="Insights Explorer" />
                </div>
              </div>

              {/* BASIS DATA SECTION */}
              <div className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] w-4 bg-brand-black/10"></div>
                  <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest whitespace-nowrap">Basis Data</span>
                  <div className="h-[1px] flex-grow bg-brand-black/10"></div>
                </div>
                
                <div className="space-y-1">
                  <SidebarItem icon={<CreditCard className="w-5 h-5" />} label="Accounts" />
                  <SidebarItem icon={<LayoutGrid className="w-5 h-5" />} label="Transaction Categories" />
                  <SidebarItem icon={<Tag className="w-5 h-5" />} label="Transaction Tags" />
                  <SidebarItem icon={<StickyNote className="w-5 h-5" />} label="Transaction Templates" />
                  <SidebarItem icon={<CalendarClock className="w-5 h-5" />} label="Scheduled Transactions" />
                </div>
              </div>

              {/* MISCELLANEOUS SECTION */}
              <div className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[1px] w-4 bg-brand-black/10"></div>
                  <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest whitespace-nowrap">Miscellaneous</span>
                  <div className="h-[1px] flex-grow bg-brand-black/10"></div>
                </div>
                
                <div className="space-y-1">
                  <SidebarItem icon={<ArrowLeftRight className="w-5 h-5" />} label="Exchange Rates Data" />
                  <SidebarItem icon={<Smartphone className="w-5 h-5" />} label="Use on Mobile Device" />
                  <SidebarItem icon={<Info className="w-5 h-5" />} label="About" />
                </div>
              </div>
            </div>
          </aside>

          {/* Right Section / Main Content Area */}
          <section className="flex-grow space-y-6">
            {/* Top Row Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* March Expense Card */}
              <div className="col-span-12 lg:col-span-5 bg-white rounded-[32px] p-7 text-brand-black relative overflow-hidden shadow-lg border border-brand-black/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">March</span>
                    <span className="text-sm font-medium text-brand-black/50">Expense</span>
                    <RotateCcw className="w-4 h-4 text-brand-black/40 cursor-pointer hover:text-brand-black transition-colors" />
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#E6923F]">
                      {isBalanceVisible ? "$ 5,530.45" : "$ •••••••"}
                    </span>
                    <button 
                      onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      className="hover:bg-brand-black/5 p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {isBalanceVisible ? (
                        <EyeOff className="w-5 h-5 text-brand-black/30" />
                      ) : (
                        <Eye className="w-5 h-5 text-brand-black/30" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-medium text-brand-black/40">
                    Monthly income <span className="text-brand-black/80">{isBalanceVisible ? "$ 6,200.00" : "$ •••••••"}</span>
                  </p>
                </div>

                <button className="bg-[#E6923F] hover:bg-[#d08235] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
                  View Details
                </button>

                {/* Decorative Icon on Right */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                   <div className="w-40 h-40 bg-[#E6923F] rounded-full flex items-center justify-center -rotate-12">
                      <Pencil className="w-20 h-20 text-white p-4" />
                   </div>
                </div>
                {/* Visual matching for the image's pencil icon area */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                   <div className="w-24 h-24 bg-[#E6923F]/10 rounded-3xl flex items-center justify-center rotate-12">
                      <div className="w-16 h-16 bg-[#E6923F]/20 rounded-2xl flex items-center justify-center -rotate-12">
                        <Pencil className="w-8 h-8 text-[#E6923F]" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Asset Summary Card */}
              <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-7 text-brand-black shadow-lg border border-brand-black/5">
                <div className="mb-8 text-center lg:text-left">
                  <h3 className="text-lg font-bold mb-1">Asset Summary</h3>
                  <p className="text-xs font-medium text-brand-black/40">You have recorded 4 accounts</p>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-10">
                  {/* Total Assets */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-black/5 flex items-center justify-center text-brand-black/80 border border-brand-black/10 shadow-inner">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total assets</p>
                      <p className="text-lg font-bold text-brand-black/90">{isBalanceVisible ? "$ 3,701.08" : "$ •••••••"}</p>
                    </div>
                  </div>

                  {/* Total Liabilities */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#009E9E]/10 flex items-center justify-center text-[#009E9E] border border-[#009E9E]/20 shadow-inner">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total liabilities</p>
                      <p className="text-lg font-bold text-brand-black/90">{isBalanceVisible ? "$ 1,958.78" : "$ •••••••"}</p>
                    </div>
                  </div>

                  {/* Net Assets */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E6923F]/10 flex items-center justify-center text-[#E6923F] border border-[#E6923F]/20 shadow-inner">
                      <PiggyBank className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Net assets</p>
                      <p className="text-lg font-bold text-brand-black/90">{isBalanceVisible ? "$ 1,742.30" : "$ •••••••"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Time Selection Cards (2x2) */}
              <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Today', icon: <Calendar className="w-5 h-5" />, income: '200.00', expense: '160.00', date: 'March 29, 2026' },
                  { title: 'This Week', icon: <Calendar className="w-5 h-5" />, income: '200.00', expense: '160.00', date: 'March 29-April 4' },
                  { title: 'This Month', icon: <Calendar className="w-5 h-5" />, income: '6,200.00', expense: '5,530.45', date: 'March 1-March 31' },
                  { title: 'This Year', icon: <Layers className="w-5 h-5" />, income: '6,200.00', expense: '5,530.45', date: '2026' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-[24px] p-5 text-brand-black border border-brand-black/5 shadow-md flex flex-col justify-between hover:border-brand-black/10 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-9 h-9 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black/60">
                        {item.icon}
                      </div>
                      <MoreVertical className="w-4 h-4 text-brand-black/30 cursor-pointer" />
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <p className="text-xs font-bold text-brand-black/60">{item.title}</p>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-[#F14C4C]">$ {isBalanceVisible ? item.income : "•••••••"}</p>
                        <p className="text-lg font-bold text-[#009E9E]">$ {isBalanceVisible ? item.expense : "•••••••"}</p>
                      </div>
                    </div>

                    <p className="text-[10px] font-semibold text-brand-black/30">{item.date}</p>
                  </div>
                ))}
              </div>

              {/* Income and Expense Trends */}
              <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-8 text-brand-black shadow-lg border border-brand-black/5 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold">Income and Expense Trends</h3>
                </div>

                <div className="flex-grow overflow-x-auto lg:overflow-visible my-6">
                  <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 min-w-[500px] lg:min-w-full relative">
                    {/* Mock Chart: Horizontal alignment and Bar pairs */}
                  {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full">
                      <div className="w-full flex-grow flex items-end justify-center px-1">
                        {/* Empty space or small bars for most months in image */}
                        {month === 'Mar' ? (
                          <div className="flex flex-col gap-1 w-full items-center">
                            <div className="w-3 rounded-full bg-[#F14C4C]" style={{ height: '140px' }}></div>
                            <div className="w-3 rounded-full bg-[#009E9E]" style={{ height: '80px' }}></div>
                          </div>
                        ) : null}
                      </div>
                      <span className="text-[10px] font-bold text-brand-black/20">{month}</span>
                    </div>
                  ))}
                  
                  {/* Legend on the right side of the chart specifically */}
                  <div className="absolute right-0 top-0 h-full flex flex-col justify-center gap-3">
                    <div className="w-3 h-24 bg-[#F14C4C] rounded-full opacity-80"></div>
                    <div className="w-3 h-20 bg-[#009E9E] rounded-full opacity-80"></div>
                  </div>
                </div>
              </div>

                <div className="flex items-center justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F14C4C]"></div>
                    <span className="text-xs font-bold text-brand-black/60">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#009E9E]"></div>
                    <span className="text-xs font-bold text-brand-black/60">Expense</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
    </div>
  )
}

export default DesktopPage