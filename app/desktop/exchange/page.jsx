"use client"
import { useState } from 'react'
import { PlusCircle, Search, RefreshCw, Globe, Edit, Trash2 } from 'lucide-react'

const MOCK_EXCHANGE = [
  { id: 1, base: 'USD', target: 'IDR', rate: 16250.00, updated: '2026-05-31 10:00:00' },
  { id: 2, base: 'USD', target: 'EUR', rate: 0.92, updated: '2026-05-31 10:00:00' },
  { id: 3, base: 'USD', target: 'GBP', rate: 0.79, updated: '2026-05-31 10:00:00' },
  { id: 4, base: 'USD', target: 'JPY', rate: 155.40, updated: '2026-05-31 10:00:00' },
]

export default function ExchangeRatesPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_EXCHANGE.filter(ex =>
    `${ex.base} ${ex.target}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-brand-black">Exchange Rates Data</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 bg-base-light hover:bg-brand-black/5 text-brand-black/70 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Update All Rates</span>
            <span className="sm:hidden">Update</span>
          </button>
          <button className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Rate</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-brand-black/5 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-brand-black shrink-0">Currency Rates (Base: USD)</h3>
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search currency"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-base-light border border-transparent rounded-lg text-sm text-brand-black/70 placeholder:text-brand-black/30 focus:outline-none focus:bg-surface focus:border-brand-black/20 transition-all w-40 sm:w-64"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-surface">
          {/* Desktop table header — hidden on mobile */}
          <div className="hidden md:grid grid-cols-[60px_1fr_1fr_1fr_80px] gap-2 px-5 py-3 border-b border-brand-black/5 bg-base-light">
            {['ICON', 'CURRENCY PAIR', 'EXCHANGE RATE', 'LAST UPDATED', 'ACTIONS'].map(label => (
              <div key={label} className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider">{label}</div>
            ))}
          </div>

          <div className="flex flex-col">
            {filtered.map(ex => (
              <div key={ex.id}>
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[60px_1fr_1fr_1fr_80px] gap-2 px-5 py-4 border-b border-brand-black/5 hover:bg-base-light transition-colors items-center group">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-brand-black truncate block">{ex.base} → {ex.target}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-brand-black/80">{ex.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-brand-black/50 truncate block">{ex.updated}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-brand-black/40 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-brand-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Mobile card */}
                <div className="md:hidden flex items-center justify-between gap-3 px-4 py-3.5 border-b border-brand-black/5 hover:bg-base-light transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-black truncate">{ex.base} → {ex.target}</p>
                      <p className="text-xs font-semibold text-brand-black/50 mt-0.5 truncate">{ex.updated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-brand-black/80">{ex.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <div className="flex items-center gap-0.5">
                      <button className="p-1.5 text-brand-black/40 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-brand-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
