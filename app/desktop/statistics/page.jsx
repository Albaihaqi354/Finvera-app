"use client"
import { useMemo, useState } from 'react'
import MdiIcon from '@/components/icons/MdiIcon'
import EChart from '@/components/charts/EChart'
import { buildPieChartOption } from '@/lib/chart/options'
import { mdiCalendarOutline, mdiChevronDown } from '@/lib/icons/mdi'
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

function aggregateByCategory(transactions, categories, type) {
  const map = {}
  transactions
    .filter(t => t.type === type)
    .forEach(tx => {
      const name = categories.find(c => c.id === tx.categoryId)?.name || 'Unknown'
      map[name] = (map[name] || 0) + tx.amount
    })
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
}

function CategoryPieCard({ title, items }) {
  const option = useMemo(() => buildPieChartOption(items), [items])

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5">
        <h3 className="text-sm font-bold text-brand-black mb-4">{title}</h3>
        <p className="text-sm text-brand-black/40 py-16 text-center">No data in this period.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-brand-black/5">
      <h3 className="text-sm font-bold text-brand-black px-2 pt-2 pb-0">{title}</h3>
      <EChart option={option} style={{ minHeight: 460 }} />
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

  const incomeItems = useMemo(
    () => aggregateByCategory(filteredTx, categories, 'income'),
    [filteredTx, categories]
  )
  const expenseItems = useMemo(
    () => aggregateByCategory(filteredTx, categories, 'expense'),
    [filteredTx, categories]
  )

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] space-y-6">
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
          <MdiIcon
            path={mdiCalendarOutline}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none"
          />
          <MdiIcon
            path={mdiChevronDown}
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CategoryPieCard title="Income by Category" items={incomeItems} />
        <CategoryPieCard title="Expense by Category" items={expenseItems} />
      </div>
    </div>
  )
}
