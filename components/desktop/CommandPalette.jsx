"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, LayoutDashboard, ReceiptText, Banknote, CalendarClock, Settings, ArrowRight } from 'lucide-react'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const navigate = (path) => {
    router.push(path)
    setIsOpen(false)
  }

  const defaultCommands = [
    { name: 'Go to Dashboard', path: '/desktop/overview', icon: LayoutDashboard },
    { name: 'View Transactions', path: '/desktop/transactions', icon: ReceiptText },
    { name: 'Add New Transaction', path: '/desktop/transactions?add=1', icon: Banknote },
    { name: 'Scheduled Transactions', path: '/desktop/scheduled', icon: CalendarClock },
    { name: 'App Settings', path: '/desktop/settings/app', icon: Settings },
  ]

  const filteredCommands = defaultCommands.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  )

  if (!isOpen) return null

  // Stop propagation on the backdrop so clicking inside doesn't close
  // Wait, I didn't add a backdrop click handler. Let's add it.
  const closePalette = () => setIsOpen(false)

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 p-4"
      onClick={closePalette}
    >
      <div 
        className="bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-brand-black/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-brand-black/5 bg-base-light">
          <Search className="w-5 h-5 text-brand-black/40 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base font-medium text-brand-black placeholder:text-brand-black/30"
            placeholder="Search commands or navigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-brand-black/40 hover:bg-brand-black/5 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Navigation</p>
              {filteredCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(cmd.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-black/5 text-left group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-base-light text-brand-black/60 group-hover:bg-brand-black/10 group-hover:text-brand-black transition-colors">
                      <cmd.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-brand-black/80 group-hover:text-brand-black">{cmd.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-black/20 group-hover:text-brand-black/60" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-brand-black/40 font-semibold">No results found for "{query}"</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-base-light px-4 py-2 border-t border-brand-black/5 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <kbd className="bg-brand-black/5 px-2 py-0.5 rounded text-[10px] font-bold text-brand-black/50 border border-brand-black/10">esc</kbd>
            <span className="text-[10px] text-brand-black/40 font-semibold">to close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-brand-black/5 px-2 py-0.5 rounded text-[10px] font-bold text-brand-black/50 border border-brand-black/10">enter</kbd>
            <span className="text-[10px] text-brand-black/40 font-semibold">to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
