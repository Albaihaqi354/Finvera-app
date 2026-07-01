"use client"
import { useMemo, useState } from 'react'

import EChart from '@/components/charts/EChart'
import { buildPieChartOption, buildGroupedBarOption } from '@/lib/chart/options'
import { EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from '@/lib/chart/colors'
import { useTheme } from '@/components/desktop/ThemeProvider'

import { useDesktop } from '@/components/desktop/DesktopProvider'

const QUICK_RANGES = ['Today', 'This Week', 'This Month', 'This Year', 'All Time', 'Custom']

function getRangeBounds(range, customStart, customEnd) {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  let start = new Date(now)
  start.setHours(0, 0, 0, 0)

  switch (range) {
    case 'Today':
      break
    case 'This Week':
      start.setDate(now.getDate() - now.getDay())
      break
    case 'This Month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'This Year':
      start = new Date(now.getFullYear(), 0, 1)
      break
    case 'All Time':
      start = new Date(2000, 0, 1)
      break
    case 'Custom':
      return {
        start: customStart ? new Date(customStart + 'T00:00:00') : new Date(2000, 0, 1),
        end: customEnd ? new Date(customEnd + 'T23:59:59') : end
      }
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1)
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

function StatCard({ label, value, color }) {
  return (
    <div className="bg-surface rounded-2xl px-5 py-4 border border-brand-black/5 shadow-sm">
      <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>Rp {value.toLocaleString('id-ID')}</p>
    </div>
  )
}

function CategoryPieCard({ title, items, emptyLabel }) {
  const { resolvedTheme } = useTheme()
  const option = useMemo(() => buildPieChartOption(items), [items, resolvedTheme])
  return (
    <div className="bg-surface rounded-3xl p-4 shadow-sm border border-brand-black/5">
      <h3 className="text-sm font-bold text-brand-black px-2 pt-2 pb-0">{title}</h3>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-brand-black/40">{emptyLabel}</p>
        </div>
      ) : (
        <EChart option={option} style={{ minHeight: 400 }} />
      )}
    </div>
  )
}

export default function StatisticsPage() {
  const { transactions, categories, isLoaded } = useDesktop()
  const { resolvedTheme } = useTheme()
  const [dateRange, setDateRange] = useState('This Month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const { start, end } = useMemo(
    () => getRangeBounds(dateRange, customStart, customEnd),
    [dateRange, customStart, customEnd]
  )

  const filteredTx = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end && t.type !== 'transfer'
    })
  }, [transactions, start, end])

  const incomeItems  = useMemo(() => aggregateByCategory(filteredTx, categories, 'income'), [filteredTx, categories])
  const expenseItems = useMemo(() => aggregateByCategory(filteredTx, categories, 'expense'), [filteredTx, categories])

  const totalIncome  = useMemo(() => filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [filteredTx])
  const totalExpense = useMemo(() => filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [filteredTx])
  const netFlow      = totalIncome - totalExpense

  // Monthly trend for bar chart (last 6 months or custom period breakdown by month)
  const monthlyBreakdown = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1)
      const mEnd   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      const txs = transactions.filter(t => {
        const td = new Date(t.date)
        return td >= mStart && td <= mEnd && t.type !== 'transfer'
      })
      months.push({
        label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }
    return months
  }, [transactions])

  const barOption = useMemo(() => buildGroupedBarOption(
    monthlyBreakdown.map(m => m.label),
    [
      { name: 'Income',  data: monthlyBreakdown.map(m => m.income),  color: EZ_INCOME_COLOR },
      { name: 'Expense', data: monthlyBreakdown.map(m => m.expense), color: EZ_EXPENSE_COLOR },
    ]
  ), [monthlyBreakdown, resolvedTheme])

  if (!isLoaded) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-brand-black/5 rounded-3xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-brand-black">Statistics & Analysis</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick range pills */}
          <div className="flex items-center gap-1.5 bg-surface border border-brand-black/10 rounded-xl p-1 shadow-sm flex-wrap">
            {QUICK_RANGES.map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateRange === r ? 'bg-brand-black text-brand-primary shadow-sm' : 'text-brand-black/60 hover:bg-brand-black/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Custom date inputs */}
          {dateRange === 'Custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                className="bg-surface border border-brand-black/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none shadow-sm cursor-pointer"
              />
              <span className="text-xs text-brand-black/40 font-bold">→</span>
              <input
                type="date"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                className="bg-surface border border-brand-black/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none shadow-sm cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Income"  value={totalIncome}  color="text-emerald-500" />
        <StatCard label="Total Expense" value={totalExpense} color="text-rose-500" />
        <StatCard
          label="Net Flow"
          value={Math.abs(netFlow)}
          color={netFlow >= 0 ? 'text-emerald-500' : 'text-rose-500'}
        />
      </div>

      {/* 6-month trend bar chart */}
      <div className="bg-surface rounded-3xl p-5 shadow-sm border border-brand-black/5">
        <h3 className="text-sm font-bold text-brand-black mb-1">6-Month Income & Expense Trend</h3>
        <p className="text-xs text-brand-black/40 mb-2">Comparison of the last 6 months</p>
        <EChart option={barOption} style={{ minHeight: 260 }} />
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CategoryPieCard
          title="Income by Category"
          items={incomeItems}
          emptyLabel="No income recorded in this period."
        />
        <CategoryPieCard
          title="Expense by Category"
          items={expenseItems}
          emptyLabel="No expenses recorded in this period."
        />
      </div>
    </div>
  )
}
