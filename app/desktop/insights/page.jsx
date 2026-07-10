"use client"
import { useMemo, useState } from 'react'
import MdiIcon from '@/components/icons/MdiIcon'
import EChart from '@/components/charts/EChart'
import { buildHorizontalBarOption } from '@/lib/chart/options'
import { EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from '@/lib/chart/colors'
import { mdiCompassOutline, mdiChevronDown } from '@/lib/icons/mdi'
import { useTheme } from '@/components/desktop/ThemeProvider'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { formatConverted } from '@/lib/currency'

const QUICK_RANGES = ['This Week', 'This Month', 'This Year', 'All Time', 'Custom']

function getRangeBounds(range, customStart, customEnd) {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  let start = new Date(now)
  start.setHours(0, 0, 0, 0)

  switch (range) {
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

export default function InsightsPage() {
  const { transactions, categories, accounts, isLoaded, currency, exchangeRates } = useDesktop()
  const { resolvedTheme } = useTheme()
  const [dimension, setDimension] = useState('category')
  const [typeFilter, setTypeFilter] = useState('expense')
  const [accountFilter, setAccountFilter] = useState('all')
  const [dateRange, setDateRange] = useState('This Month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const { start, end } = useMemo(
    () => getRangeBounds(dateRange, customStart, customEnd),
    [dateRange, customStart, customEnd]
  )

  const chartItems = useMemo(() => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date)
      if (d < start || d > end) return false
      if (t.type !== typeFilter) return false
      if (accountFilter !== 'all' && t.accountId !== accountFilter) return false
      return true
    })
    const map = {}
    filtered.forEach(tx => {
      const key =
        dimension === 'category'
          ? categories.find(c => c.id === tx.categoryId)?.name || 'Unknown'
          : dimension === 'account'
          ? accounts.find(a => a.id === tx.accountId)?.name || 'Unknown'
          : tx.note || 'No description'
      map[key] = (map[key] || 0) + tx.amount
    })
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 15)
  }, [transactions, categories, accounts, dimension, typeFilter, accountFilter, start, end])

  const totalAmount = useMemo(() => chartItems.reduce((s, i) => s + i.amount, 0), [chartItems])

  const barColor = typeFilter === 'income' ? EZ_INCOME_COLOR : EZ_EXPENSE_COLOR
  const chartOption = useMemo(
    () => buildHorizontalBarOption(
      chartItems,
      barColor,
      { formatValue: (v) => formatConverted(v, currency, exchangeRates) }
    ),
    [chartItems, barColor, currency, exchangeRates, resolvedTheme]
  )

  if (!isLoaded) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-brand-black/5 rounded-3xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black/5 flex items-center justify-center">
            <MdiIcon path={mdiCompassOutline} size={22} className="text-brand-black/60" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">Insights Explorer</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type */}
          <div className="flex items-center gap-1 bg-surface border border-brand-black/10 rounded-xl p-1 shadow-sm">
            {['expense', 'income'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize cursor-pointer transition-all ${
                  typeFilter === t
                    ? t === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-rose-500 text-white shadow-sm'
                    : 'text-brand-black/60 hover:bg-brand-black/5'
                }`}>{t}</button>
            ))}
          </div>

          {/* Dimension */}
          <div className="relative">
            <select
              value={dimension}
              onChange={e => setDimension(e.target.value)}
              className="appearance-none bg-surface border border-brand-black/10 rounded-xl px-4 py-2 text-xs font-bold pr-7 cursor-pointer outline-none shadow-sm"
            >
              <option value="category">By Category</option>
              <option value="account">By Account</option>
              <option value="description">By Description</option>
            </select>
            <MdiIcon path={mdiChevronDown} size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" />
          </div>

          {/* Account filter */}
          <div className="relative">
            <select
              value={accountFilter}
              onChange={e => setAccountFilter(e.target.value)}
              className="appearance-none bg-surface border border-brand-black/10 rounded-xl px-4 py-2 text-xs font-bold pr-7 cursor-pointer outline-none shadow-sm"
            >
              <option value="all">All Accounts</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <MdiIcon path={mdiChevronDown} size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-1.5 bg-surface border border-brand-black/10 rounded-xl p-1 shadow-sm">
            {QUICK_RANGES.map(r => (
              <button key={r} onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  dateRange === r ? 'bg-brand-black text-brand-primary shadow-sm' : 'text-brand-black/60 hover:bg-brand-black/5'
                }`}>{r}</button>
            ))}
          </div>

          {dateRange === 'Custom' && (
            <div className="flex items-center gap-2">
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                className="bg-surface border border-brand-black/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none shadow-sm cursor-pointer" />
              <span className="text-xs text-brand-black/40 font-bold">→</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                className="bg-surface border border-brand-black/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none shadow-sm cursor-pointer" />
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {chartItems.length > 0 && (
        <div className="flex items-center gap-6 px-5 py-3 bg-surface rounded-2xl border border-brand-black/5 shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider">Top {Math.min(chartItems.length, 15)} items</p>
            <p className={`text-lg font-bold ${typeFilter === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatConverted(totalAmount, currency, exchangeRates)}
            </p>
          </div>
          <div className="h-8 w-px bg-brand-black/10" />
          <p className="text-xs text-brand-black/50">
            Showing {typeFilter} breakdown {dimension === 'category' ? 'by category' : dimension === 'account' ? 'by account' : 'by description'}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="bg-surface rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-4 min-h-[400px]">
        {chartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-3">🧭</div>
            <p className="text-sm font-medium text-brand-black/40">No data for the selected filters.</p>
            <p className="text-xs text-brand-black/30 mt-1">Try a different time period or transaction type.</p>
          </div>
        ) : (
          <EChart option={chartOption} style={{ minHeight: Math.max(380, chartItems.length * 38) }} />
        )}
      </div>
    </div>
  )
}
