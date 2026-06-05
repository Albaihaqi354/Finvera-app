"use client"
import { useMemo, useState } from 'react'
import MdiIcon from '@/components/icons/MdiIcon'
import EChart from '@/components/charts/EChart'
import { buildHorizontalBarOption } from '@/lib/chart/options'
import { EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from '@/lib/chart/colors'
import { mdiCompassOutline, mdiChevronDown } from '@/lib/icons/mdi'
import { useDesktop } from '@/components/desktop/DesktopProvider'

export default function InsightsPage() {
  const { transactions, categories, isLoaded } = useDesktop()
  const [dimension, setDimension] = useState('category')
  const [typeFilter, setTypeFilter] = useState('expense')

  const chartItems = useMemo(() => {
    const filtered = transactions.filter(t => t.type === typeFilter)
    const map = {}
    filtered.forEach(tx => {
      const key =
        dimension === 'category'
          ? categories.find(c => c.id === tx.categoryId)?.name || 'Unknown'
          : tx.note || 'No description'
      map[key] = (map[key] || 0) + tx.amount
    })
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 12)
  }, [transactions, categories, dimension, typeFilter])

  const barColor = typeFilter === 'income' ? EZ_INCOME_COLOR : EZ_EXPENSE_COLOR
  const chartOption = useMemo(
    () => buildHorizontalBarOption(chartItems, barColor),
    [chartItems, barColor]
  )

  if (!isLoaded) {
    return <div className="p-8 text-center text-brand-black/50">Loading...</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black/5 flex items-center justify-center">
            <MdiIcon path={mdiCompassOutline} size={22} className="text-brand-black/60" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">Insights Explorer</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2 text-sm font-bold pr-8 cursor-pointer outline-none shadow-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <MdiIcon path={mdiChevronDown} size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={dimension}
              onChange={e => setDimension(e.target.value)}
              className="appearance-none bg-white border border-brand-black/10 rounded-xl px-4 py-2 text-sm font-bold pr-8 cursor-pointer outline-none shadow-sm"
            >
              <option value="category">By Category</option>
              <option value="description">By Description</option>
            </select>
            <MdiIcon path={mdiChevronDown} size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-4 min-h-[480px]">
        {chartItems.length === 0 ? (
          <p className="text-sm font-medium text-brand-black/40 text-center py-24">
            No data for the selected filters. Add transactions to explore insights.
          </p>
        ) : (
          <EChart option={chartOption} style={{ minHeight: Math.max(360, chartItems.length * 36) }} />
        )}
      </div>
    </div>
  )
}
