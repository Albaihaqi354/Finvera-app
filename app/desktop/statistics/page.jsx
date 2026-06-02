"use client"
import { useMemo, useState } from 'react'
import { PieChart, BarChart3, ChevronDown, Calendar } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'

function getRangeBounds(range) {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  let start = new Date(now)
  start.setHours(0, 0, 0, 0)

  if (range === 'This Week') {
    start.setDate(now.getDate() - now.getDay())
  } else if (range === 'This Month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
  } else if (range === 'This Year') {
    start = new Date(now.getFullYear(), 0, 1)
  }
  return { start, end }
}

function CategoryChart({ title, type, transactions, categories, colorClass, borderClass }) {
  const data = useMemo(() => {
    const filtered = transactions.filter(t => t.type === type)
    const map = {}
    filtered.forEach(tx => {
      const name = categories.find(c => c.id === tx.categoryId)?.name || 'Unknown'
      map[name] = (map[name] || 0) + tx.amount
    })
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount, percent: Math.round((amount / total) * 100) }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [transactions, categories, type])

  const shades = [
    borderClass,
    borderClass.replace(']', '/60]'),
    borderClass.replace(']', '/30]'),
    borderClass.replace(']', '/20]'),
    borderClass.replace(']', '/10]')
  ]

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5">
        <h3 className="text-sm font-bold text-brand-black mb-4">{title}</h3>
        <p className="text-sm text-brand-black/40 py-8 text-center">No data in this period.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
          {type === 'income' ? <PieChart className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
        </div>
        <h3 className="text-sm font-bold text-brand-black">{title}</h3>
      </div>
      <div className="flex items-center gap-8">
        <div className={`w-40 h-40 rounded-full border-[12px] ${shades[0]} flex items-center justify-center shadow-inner`}>
          <span className="text-xs font-bold text-brand-black/40">Total</span>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((item, i) => (
            <div key={item.name}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${colorClass.replace('/10', '').replace('text-', 'bg-')}`} />
                  <span className="text-brand-black/70">{item.name}</span>
                </div>
                <span className="text-brand-black">{item.percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F8F8F8] rounded-full overflow-hidden">
                <div className={colorClass.replace('/10', '').replace('text-', 'bg-')} style={{ width: `${item.percent}%`, height: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function StatisticsPage() {
  const { transactions, categories, isLoaded } = useDesktop()
  const [dateRange, setDateRange] = useState('This Month')

  const filteredTx = useMemo(() => {
    const { start, end } = getRangeBounds(dateRange)
    return transactions.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end && t.type !== 'transfer'
    })
  }, [transactions, dateRange])

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Statistics & Analysis</h2>
        <div className="relative">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2 pl-10 text-sm font-bold pr-8 cursor-pointer outline-none shadow-sm"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart
          title="Income by Category"
          type="income"
          transactions={filteredTx}
          categories={categories}
          colorClass="bg-[#F14C4C]/10 text-[#F14C4C]"
          borderClass="border-[#F14C4C]"
        />
        <CategoryChart
          title="Expense by Category"
          type="expense"
          transactions={filteredTx}
          categories={categories}
          colorClass="bg-[#009E9E]/10 text-[#009E9E]"
          borderClass="border-[#009E9E]"
        />
      </div>
    </div>
  )
}
