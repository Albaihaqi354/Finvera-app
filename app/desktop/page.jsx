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
  Pencil,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Upload,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react'

// ─── Sidebar Item ────────────────────────────────────────────────────────────
const SidebarItem = ({ icon, label, rightIcon, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
      active ? 'bg-brand-black/10' : 'hover:bg-brand-black/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="text-brand-black/50 transition-colors">{icon}</div>
      <span className="text-sm font-bold text-brand-black/80">{label}</span>
    </div>
    {rightIcon && <div>{rightIcon}</div>}
  </div>
)

// ─── Mock transaction data ────────────────────────────────────────────────────
const TRANSACTIONS = [
  { date: 'April 28, 2026', day: 'Tuesday', items: [
    { time: '08:10 PM', tz: 'UTC-05:00', icon: '🔥', iconBg: 'bg-orange-100', category: 'Utilities Expense', amount: 160.00, type: 'expense', account: 'Credit Card', tags: 'None', description: 'gas bill' },
    { time: '07:38 PM', tz: 'UTC-05:00', icon: '💳', iconBg: 'bg-red-100', category: 'Credit Card Repayment', amount: 1500.00, type: 'transfer', account: 'Bank Account → Credit Card', tags: 'None', description: '' },
    { time: '02:15 PM', tz: 'UTC-05:00', icon: '📈', iconBg: 'bg-green-100', category: 'Investment Income', amount: 200.00, type: 'income', account: 'Bank Account', tags: 'None', description: '' },
  ]},
  { date: 'April 27, 2026', day: 'Monday', items: [
    { time: '07:00 PM', tz: 'UTC-05:00', icon: '🎬', iconBg: 'bg-red-100', category: 'Movies & Shows', amount: 17.00, type: 'expense', account: 'Wallet (US Dollar)', tags: 'None', description: '' },
  ]},
  { date: 'April 26, 2026', day: 'Sunday', items: [
    { time: '10:30 AM', tz: 'UTC-05:00', icon: '📗', iconBg: 'bg-green-100', category: 'Books & Newspaper & Magazines', amount: 35.00, type: 'expense', account: 'Credit Card', tags: 'None', description: 'book purchase' },
  ]},
  { date: 'April 25, 2026', day: 'Saturday', items: [
    { time: '08:00 PM', tz: 'UTC-05:00', icon: '👕', iconBg: 'bg-purple-100', category: 'Clothing', amount: 90.00, type: 'expense', account: 'Credit Card', tags: 'None', description: 'shoes' },
    { time: '11:15 AM', tz: 'UTC-05:00', icon: '🩺', iconBg: 'bg-red-100', category: 'Diagnosis & Treatment', amount: 75.00, type: 'expense', account: 'Bank Account', tags: 'None', description: 'doctor visit' },
  ]},
  { date: 'April 24, 2026', day: 'Friday', items: [
    { time: '07:30 PM', tz: 'UTC-05:00', icon: '🛒', iconBg: 'bg-orange-100', category: 'Food', amount: 160.00, type: 'expense', account: 'Credit Card', tags: 'None', description: 'supermarket' },
    { time: '12:10 PM', tz: 'UTC-05:00', icon: '📱', iconBg: 'bg-red-100', category: 'Subscriptions', amount: 9.99, type: 'expense', account: 'Credit Card', tags: 'None', description: 'Spotify' },
  ]},
  { date: 'April 23, 2026', day: 'Thursday', items: [
    { time: '09:45 AM', tz: 'UTC-05:00', icon: '💼', iconBg: 'bg-blue-100', category: 'Salary', amount: 3200.00, type: 'income', account: 'Bank Account', tags: 'None', description: 'monthly salary' },
    { time: '06:20 PM', tz: 'UTC-05:00', icon: '🍔', iconBg: 'bg-yellow-100', category: 'Food', amount: 28.50, type: 'expense', account: 'Wallet (US Dollar)', tags: 'None', description: 'dinner' },
  ]},
]

const MONTHS = [
  'All',
  'April, 2026', 'March, 2026', 'February, 2026', 'January, 2026',
  'December, 2025', 'November, 2025', 'October, 2025', 'September, 2025',
  'August, 2025', 'July, 2025', 'June, 2025', 'May, 2025',
  'Custom Date',
]

// ─── Transaction List View ───────────────────────────────────────────────────
function TransactionListView() {
  const [search, setSearch] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('April, 2026')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [perPage, setPerPage] = useState('15')
  const [activeSubTab, setActiveSubTab] = useState('Transaction List')

  const amountColor = (type) => {
    if (type === 'income') return 'text-[#F14C4C]'
    if (type === 'expense') return 'text-[#009E9E]'
    return 'text-brand-black/70'
  }

  const amountPrefix = (type) => {
    if (type === 'income') return '$ '
    if (type === 'expense') return '$ '
    return '$ '
  }

  return (
    <div className="flex h-full">
      {/* Left sub-sidebar */}
      <div className="w-52 shrink-0 pr-4 space-y-6">
        {/* Sub-tabs */}
        <div className="space-y-1">
          {['Transaction List', 'Transaction Calendar'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                activeSubTab === tab
                  ? 'bg-linear-to-r from-[#8B4513] to-[#D2691E] text-white shadow-md'
                  : 'text-brand-black/70 hover:bg-brand-black/5'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Transaction Type */}
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">Transaction Type</p>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 pr-8 cursor-pointer focus:outline-none shadow-sm"
              >
                {['All Types', 'Income', 'Expense', 'Transfer'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 pointer-events-none" />
            </div>
          </div>

          {/* Per Page */}
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">Transactions Per Page</p>
            <div className="relative">
              <select
                value={perPage}
                onChange={e => setPerPage(e.target.value)}
                className="w-full appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 pr-8 cursor-pointer focus:outline-none shadow-sm"
              >
                {['10', '15', '25', '50'].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Month List */}
        <div className="space-y-0.5">
          {MONTHS.map(month => (
            <div
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-1.5 rounded-xl cursor-pointer text-sm transition-colors ${
                selectedMonth === month
                  ? 'text-[#D2691E] font-bold'
                  : 'text-brand-black/60 hover:text-brand-black font-semibold'
              }`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="grow flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brand-black">Transaction List</h2>
            <button className="flex items-center gap-1.5 bg-[#E6923F] hover:bg-[#d08235] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              <PlusCircle className="w-3.5 h-3.5" />
              Add
            </button>
            <button className="flex items-center gap-1.5 bg-white hover:bg-brand-black/5 text-brand-black/70 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-brand-black/10 shadow-sm active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-white hover:bg-brand-black/5 text-brand-black/50 rounded-xl border border-brand-black/10 shadow-sm transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/30" />
            <input
              type="text"
              placeholder="Search transaction description"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-brand-black/10 rounded-xl text-sm text-brand-black/70 placeholder:text-brand-black/30 focus:outline-none focus:border-[#D2691E]/50 shadow-sm w-72"
            />
          </div>
        </div>

        {/* Date Range bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 mb-4 border border-brand-black/5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-brand-black/40">Date Range</span>
            <button className="p-1 hover:bg-brand-black/5 rounded-lg">
              <ChevronLeft className="w-4 h-4 text-brand-black/50" />
            </button>
            <span className="text-xs font-semibold text-brand-black/70">
              April 1, 2026 12:00:00 AM - April 30, 2026 11:59:59 PM
            </span>
            <button className="p-1 hover:bg-brand-black/5 rounded-lg">
              <ChevronRight className="w-4 h-4 text-brand-black/50" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brand-black/50">Total Income</span>
              <span className="text-sm font-bold text-[#F14C4C]">$ 6,450.00</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brand-black/50">Total Expense</span>
              <span className="text-sm font-bold text-[#009E9E]">$ 5,635.33</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-brand-black/5 shadow-sm overflow-hidden flex-1">
          {/* Table Header */}
          <div className="grid grid-cols-[160px_1fr_130px_180px_100px_1fr] gap-2 px-5 py-3 border-b border-brand-black/5 bg-brand-black/2">
            {[
              { label: 'TIME', icon: <ArrowUpDown className="w-3 h-3" /> },
              { label: 'CATEGORY', icon: <ChevronDown className="w-3 h-3" /> },
              { label: 'AMOUNT', icon: <ArrowUpDown className="w-3 h-3" /> },
              { label: 'ACCOUNT', icon: <ChevronDown className="w-3 h-3" /> },
              { label: 'TAGS', icon: <ChevronDown className="w-3 h-3" /> },
              { label: 'DESCRIPTION', icon: null },
            ].map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-1 cursor-pointer group">
                <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider group-hover:text-brand-black/60 transition-colors">{label}</span>
                {icon && <span className="text-brand-black/30">{icon}</span>}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
            {TRANSACTIONS.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center gap-3 px-5 py-2.5 bg-brand-black/1.5 border-b border-brand-black/5">
                  <span className="text-xs font-bold text-brand-black/70">{group.date}</span>
                  <span className="text-[10px] font-bold text-brand-black/40 bg-brand-black/5 px-2 py-0.5 rounded-full">{group.day}</span>
                </div>

                {/* Rows */}
                {group.items.map((tx, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[160px_1fr_130px_180px_100px_1fr] gap-2 px-5 py-3.5 border-b border-brand-black/5 hover:bg-brand-black/2 transition-colors cursor-pointer items-center"
                  >
                    {/* Time */}
                    <div>
                      <p className="text-xs font-bold text-brand-black/80">{tx.time}</p>
                      <p className="text-[10px] font-medium text-brand-black/35">{tx.tz}</p>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 shrink-0 ${tx.iconBg} rounded-lg flex items-center justify-center text-sm`}>
                        {tx.icon}
                      </div>
                      <span className="text-xs font-semibold text-brand-black/80 truncate">{tx.category}</span>
                    </div>

                    {/* Amount */}
                    <div>
                      <span className={`text-sm font-bold ${amountColor(tx.type)}`}>
                        {amountPrefix(tx.type)}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Account */}
                    <div>
                      <span className="text-xs font-semibold text-brand-black/70 truncate block">{tx.account}</span>
                    </div>

                    {/* Tags */}
                    <div>
                      <span className="text-xs font-semibold text-brand-black/50 bg-brand-black/5 px-2.5 py-1 rounded-lg">{tx.tags}</span>
                    </div>

                    {/* Description */}
                    <div>
                      <span className="text-xs font-medium text-brand-black/50">{tx.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Overview View ───────────────────────────────────────────────────────────
function OverviewView({ isBalanceVisible }) {
  return (
    <section className="grow space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 bg-white rounded-4xl p-7 text-brand-black relative overflow-hidden shadow-lg border border-brand-black/5">
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
            </div>
            <p className="text-sm font-medium text-brand-black/40">
              Monthly income <span className="text-brand-black/80">{isBalanceVisible ? "$ 6,200.00" : "$ •••••••"}</span>
            </p>
          </div>
          <button className="bg-[#E6923F] hover:bg-[#d08235] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
            View Details
          </button>
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <div className="w-24 h-24 bg-[#E6923F]/10 rounded-3xl flex items-center justify-center rotate-12">
              <div className="w-16 h-16 bg-[#E6923F]/20 rounded-2xl flex items-center justify-center -rotate-12">
                <Pencil className="w-8 h-8 text-[#E6923F]" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-white rounded-4xl p-7 text-brand-black shadow-lg border border-brand-black/5">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-1">Asset Summary</h3>
            <p className="text-xs font-medium text-brand-black/40">You have recorded 4 accounts</p>
          </div>
          <div className="flex flex-wrap items-center gap-8 md:gap-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-black/5 flex items-center justify-center text-brand-black/80 border border-brand-black/10 shadow-inner">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total assets</p>
                <p className="text-lg font-bold text-brand-black/90">{isBalanceVisible ? "$ 3,701.08" : "$ •••••••"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#009E9E]/10 flex items-center justify-center text-[#009E9E] border border-[#009E9E]/20 shadow-inner">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total liabilities</p>
                <p className="text-lg font-bold text-brand-black/90">{isBalanceVisible ? "$ 1,958.78" : "$ •••••••"}</p>
              </div>
            </div>
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Today', icon: <Calendar className="w-5 h-5" />, income: '200.00', expense: '160.00', date: 'March 29, 2026' },
            { title: 'This Week', icon: <Calendar className="w-5 h-5" />, income: '200.00', expense: '160.00', date: 'March 29-April 4' },
            { title: 'This Month', icon: <Calendar className="w-5 h-5" />, income: '6,200.00', expense: '5,530.45', date: 'March 1-March 31' },
            { title: 'This Year', icon: <Layers className="w-5 h-5" />, income: '6,200.00', expense: '5,530.45', date: '2026' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 text-brand-black border border-brand-black/5 shadow-md flex flex-col justify-between hover:border-brand-black/10 transition-colors">
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

        <div className="col-span-12 lg:col-span-7 bg-white rounded-4xl p-8 text-brand-black shadow-lg border border-brand-black/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Income and Expense Trends</h3>
          </div>
          <div className="grow overflow-x-auto lg:overflow-visible my-6">
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 min-w-125 lg:min-w-full relative">
              {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="w-full grow flex items-end justify-center px-1">
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
  )
}

// ─── Placeholder View ────────────────────────────────────────────────────────
function PlaceholderView({ label }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-brand-black/30 gap-3">
      <SlidersHorizontal className="w-12 h-12 opacity-30" />
      <p className="text-lg font-bold">{label}</p>
      <p className="text-sm">Coming soon</p>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function DesktopPage() {
  const [activePage, setActivePage] = useState('overview')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const renderContent = () => {
    switch (activePage) {
      case 'overview': return <OverviewView isBalanceVisible={isBalanceVisible} />
      case 'transaction-details': return <TransactionListView />
      case 'statistics': return <PlaceholderView label="Statistics & Analysis" />
      case 'insights': return <PlaceholderView label="Insights Explorer" />
      case 'accounts': return <PlaceholderView label="Accounts" />
      case 'categories': return <PlaceholderView label="Transaction Categories" />
      case 'tags': return <PlaceholderView label="Transaction Tags" />
      case 'templates': return <PlaceholderView label="Transaction Templates" />
      case 'scheduled': return <PlaceholderView label="Scheduled Transactions" />
      case 'exchange': return <PlaceholderView label="Exchange Rates Data" />
      case 'mobile': return <PlaceholderView label="Use on Mobile Device" />
      case 'about': return <PlaceholderView label="About" />
      default: return <OverviewView isBalanceVisible={isBalanceVisible} />
    }
  }

  return (
    <div className='min-h-screen bg-[#F9EFE5] font-ibm'>
      {/* NAVBAR */}
      <nav className="px-6 py-6 flex items-center justify-between z-50">
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

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-brand-black/5 transition-colors focus:outline-none border-2 border-transparent hover:border-brand-black/10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-brand-black/10 flex items-center justify-center overflow-hidden border border-brand-black/10">
              <User className="w-6 h-6 text-brand-black/60" />
            </div>
            <span className="hidden sm:block text-sm font-bold text-brand-black">Nama User</span>
            <ChevronDown className={`w-4 h-4 text-brand-black/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-brand-black/10 overflow-hidden z-50">
              <div className="p-5 border-b border-brand-black/5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-black/10 flex items-center justify-center border border-brand-black/10">
                  <User className="w-7 h-7 text-brand-black/60" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-brand-black">Nama User</h3>
                  <span className="text-xs font-medium text-brand-black/40 mt-0.5">user@example.com</span>
                </div>
              </div>
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
      <main className="pl-4 pr-4 sm:pl-8 sm:pr-10 flex flex-col lg:flex-row gap-6 pb-10">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-60 shrink-0 bg-[#f9efe5] rounded-4xl pl-2 pr-6 py-6 text-brand-black overflow-hidden">
          <div className="space-y-1">
            {/* Overview */}
            <div
              onClick={() => setActivePage('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-r-full -ml-2 pl-6 cursor-pointer shadow-md transition-all ${
                activePage === 'overview'
                  ? 'bg-gradient-to-r from-[#8B4513] to-[#D2691E]'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            >
              <Home className={`w-5 h-5 ${activePage === 'overview' ? 'text-white' : 'text-brand-black/60'}`} />
              <span className={`font-bold text-sm ${activePage === 'overview' ? 'text-white' : 'text-brand-black/70'}`}>Overview</span>
            </div>

            {/* Balance toggle */}
            <div className="px-4 pt-3 pb-1">
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="flex items-center gap-2 text-xs font-semibold text-brand-black/40 hover:text-brand-black/60 transition-colors"
              >
                {isBalanceVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {isBalanceVisible ? 'Hide amounts' : 'Show amounts'}
              </button>
            </div>

            {/* TRANSACTION DATA */}
            <div className="pt-6 pb-4">
              <div className="flex items-center gap-2 mb-4 px-4">
                <div className="h-px w-4 bg-brand-black/10"></div>
                <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest whitespace-nowrap">Transaction Data</span>
                <div className="h-px grow bg-brand-black/10"></div>
              </div>
              <div className="space-y-1">
                <SidebarItem
                  icon={<List className="w-5 h-5" />}
                  label="Transaction Details"
                  rightIcon={<PlusCircle className="w-4 h-4 text-brand-black/30" />}
                  active={activePage === 'transaction-details'}
                  onClick={() => setActivePage('transaction-details')}
                />
                <SidebarItem
                  icon={<PieChart className="w-5 h-5" />}
                  label="Statistics & Analysis"
                  active={activePage === 'statistics'}
                  onClick={() => setActivePage('statistics')}
                />
                <SidebarItem
                  icon={<Compass className="w-5 h-5" />}
                  label="Insights Explorer"
                  active={activePage === 'insights'}
                  onClick={() => setActivePage('insights')}
                />
              </div>
            </div>

            {/* BASIS DATA */}
            <div className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-4 px-4">
                <div className="h-px w-4 bg-brand-black/10"></div>
                <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest whitespace-nowrap">Basis Data</span>
                <div className="h-px grow bg-brand-black/10"></div>
              </div>
              <div className="space-y-1">
                <SidebarItem icon={<CreditCard className="w-5 h-5" />} label="Accounts" active={activePage === 'accounts'} onClick={() => setActivePage('accounts')} />
                <SidebarItem icon={<LayoutGrid className="w-5 h-5" />} label="Transaction Categories" active={activePage === 'categories'} onClick={() => setActivePage('categories')} />
                <SidebarItem icon={<Tag className="w-5 h-5" />} label="Transaction Tags" active={activePage === 'tags'} onClick={() => setActivePage('tags')} />
                <SidebarItem icon={<StickyNote className="w-5 h-5" />} label="Transaction Templates" active={activePage === 'templates'} onClick={() => setActivePage('templates')} />
                <SidebarItem icon={<CalendarClock className="w-5 h-5" />} label="Scheduled Transactions" active={activePage === 'scheduled'} onClick={() => setActivePage('scheduled')} />
              </div>
            </div>

            {/* MISCELLANEOUS */}
            <div className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-4 px-4">
                <div className="h-px w-4 bg-brand-black/10"></div>
                <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest whitespace-nowrap">Miscellaneous</span>
                <div className="h-px grow bg-brand-black/10"></div>
              </div>
              <div className="space-y-1">
                <SidebarItem icon={<ArrowLeftRight className="w-5 h-5" />} label="Exchange Rates Data" active={activePage === 'exchange'} onClick={() => setActivePage('exchange')} />
                <SidebarItem icon={<Smartphone className="w-5 h-5" />} label="Use on Mobile Device" active={activePage === 'mobile'} onClick={() => setActivePage('mobile')} />
                <SidebarItem icon={<Info className="w-5 h-5" />} label="About" active={activePage === 'about'} onClick={() => setActivePage('about')} />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="grow flex min-w-0">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default DesktopPage