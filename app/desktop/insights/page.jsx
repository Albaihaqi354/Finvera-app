"use client"
import { useMemo, useState } from 'react'
import { Compass, ChevronDown } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'

export default function InsightsPage() {
  const { transactions, categories, isLoaded } = useDesktop()
  const [dimension, setDimension] = useState('category')
  const [typeFilter, setTypeFilter] = useState('expense')

  const chartData = useMemo(() => {
    const filtered = transactions.filter(t => t.type === typeFilter)
    const map = {}
    filtered.forEach(tx => {
      const key = dimension === 'category'
        ? categories.find(c => c.id === tx.categoryId)?.name || 'Unknown'
        : tx.note || 'No description'
      map[key] = (map[key] || 0) + tx.amount
    })
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount, percent: Math.round((amount / total) * 100) }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8)
  }, [transactions, categories, dimension, typeFilter])

  if (!isLoaded) {
    return <div className="p-8 text-center text-brand-black/50">Loading...</div>
  }

  const barColor = typeFilter === 'income' ? 'bg-[#F14C4C]' : 'bg-[#009E9E]'

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black/5 flex items-center justify-center">
            <Compass className="w-5 h-5 text-brand-black/60" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">Insights Explorer</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2 text-sm font-bold text-brand-black/80 pr-8 cursor-pointer outline-none shadow-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={dimension}
              onChange={e => setDimension(e.target.value)}
              className="appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2 text-sm font-bold text-brand-black/80 pr-8 cursor-pointer outline-none shadow-sm"
            >
              <option value="category">By Category</option>
              <option value="description">By Description</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-6 lg:p-8 overflow-y-auto">
        {chartData.length === 0 ? (
          <p className="text-sm font-medium text-brand-black/40 text-center py-16">
            No data for the selected filters. Add transactions to explore insights.
          </p>
        ) : (
          <div className="max-w-2xl mx-auto space-y-5">
            {chartData.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm font-bold mb-2">
                  <span className="text-brand-black/80">{item.name}</span>
                  <span className="text-brand-black">
                    $ {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({item.percent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-[#F8F8F8] rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs font-medium text-brand-black/30 text-center mt-8">
          Custom chart builder — simplified view aligned with ezBookkeeping Insights Explorer flow.
        </p>
      </div>
    </div>
  )
}
