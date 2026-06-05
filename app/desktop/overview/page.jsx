"use client"
import { useMemo } from 'react'
import Link from 'next/link'
import MdiIcon from '@/components/icons/MdiIcon'
import EChart from '@/components/charts/EChart'
import { buildTrendBarOption } from '@/lib/chart/options'
import { EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from '@/lib/chart/colors'
import {
  mdiRefresh,
  mdiPencilOutline,
  mdiBankOutline,
  mdiCreditCardOutline,
  mdiPiggyBankOutline,
  mdiCalendarOutline,
  mdiLayers,
} from '@/lib/icons/mdi'
import { useDesktop } from '@/components/desktop/DesktopProvider'

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function endOfDay(d) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

export default function OverviewPage() {
  const { isBalanceVisible, accounts, getTotalsForRange, isLoaded } = useDesktop()
  const now = new Date()

  const periodCards = useMemo(() => {
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    const fmtRange = (start, end) => {
      const opts = { month: 'short', day: 'numeric', year: 'numeric' }
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', opts)
      }
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', opts)}`
    }

    return [
      { title: 'Today', icon: mdiCalendarOutline, ...getTotalsForRange(todayStart, todayEnd), date: fmtRange(todayStart, todayEnd) },
      { title: 'This Week', icon: mdiCalendarOutline, ...getTotalsForRange(startOfDay(weekStart), todayEnd), date: fmtRange(weekStart, now) },
      { title: 'This Month', icon: mdiCalendarOutline, ...getTotalsForRange(monthStart, todayEnd), date: fmtRange(monthStart, now) },
      { title: 'This Year', icon: mdiLayers, ...getTotalsForRange(yearStart, todayEnd), date: String(now.getFullYear()) },
    ]
  }, [getTotalsForRange, now])

  const monthlyTrend = useMemo(() => {
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      const { income, expense } = getTotalsForRange(start, end)
      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        income,
        expense,
      })
    }
    return months
  }, [getTotalsForRange, now])

  const trendOption = useMemo(() => buildTrendBarOption(monthlyTrend), [monthlyTrend])

  const { totalAssets, totalLiabilities, netAssets } = useMemo(() => ({
    totalAssets: accounts.filter(a => a.type === 'asset').reduce((acc, curr) => acc + curr.balance, 0),
    totalLiabilities: accounts.filter(a => a.type === 'liability').reduce((acc, curr) => acc + Math.abs(curr.balance), 0),
    netAssets:
      accounts.filter(a => a.type === 'asset').reduce((acc, curr) => acc + curr.balance, 0) -
      accounts.filter(a => a.type === 'liability').reduce((acc, curr) => acc + Math.abs(curr.balance), 0),
  }), [accounts])

  const { monthlyIncome, monthlyExpense } = useMemo(() => {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return getTotalsForRange(monthStart, endOfDay(now))
  }, [getTotalsForRange, now])

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  const formatMoney = (amount) => amount.toLocaleString('id-ID')
  const monthName = now.toLocaleString('default', { month: 'long' })
  const mask = (val) => (isBalanceVisible ? `Rp ${formatMoney(val)}` : 'Rp •••••••')

  return (
    <section className="grow space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 bg-white rounded-4xl p-7 text-brand-black relative overflow-hidden shadow-sm border border-brand-black/5">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold">{monthName}</span>
            <span className="text-sm font-medium text-brand-black/50">Expense</span>
            <MdiIcon path={mdiRefresh} size={16} className="text-brand-black/40" />
          </div>
          <div className="space-y-1 mb-8">
            <span className="text-4xl font-bold" style={{ color: EZ_EXPENSE_COLOR }}>
              {mask(monthlyExpense)}
            </span>
            <p className="text-sm font-medium text-brand-black/40">
              Monthly income <span className="text-brand-black/80">{mask(monthlyIncome)}</span>
            </p>
          </div>
          <Link
            href="/desktop/transactions"
            className="inline-block bg-[#E6923F] hover:bg-[#d08235] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            View Details
          </Link>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-24 h-24 bg-[#E6923F]/10 rounded-3xl flex items-center justify-center rotate-12">
              <div className="w-16 h-16 bg-[#E6923F]/20 rounded-2xl flex items-center justify-center -rotate-12">
                <MdiIcon path={mdiPencilOutline} size={32} className="text-[#E6923F]" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-white rounded-4xl p-7 shadow-sm border border-brand-black/5">
          <h3 className="text-lg font-bold mb-1">Asset Summary</h3>
          <p className="text-xs font-medium text-brand-black/40 mb-8">You have recorded {accounts.length} accounts</p>
          <div className="flex flex-wrap items-center gap-8 md:gap-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-black/5 flex items-center justify-center border border-brand-black/10">
                <MdiIcon path={mdiBankOutline} size={24} className="text-brand-black/80" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total assets</p>
                <p className="text-lg font-bold">{mask(totalAssets)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#009E9E]/10 flex items-center justify-center text-[#009E9E] border border-[#009E9E]/20">
                <MdiIcon path={mdiCreditCardOutline} size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total liabilities</p>
                <p className="text-lg font-bold">{mask(totalLiabilities)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E6923F]/10 flex items-center justify-center text-[#E6923F] border border-[#E6923F]/20">
                <MdiIcon path={mdiPiggyBankOutline} size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Net assets</p>
                <p className="text-lg font-bold">{mask(netAssets)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {periodCards.map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-5 border border-brand-black/5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black/60 mb-6">
                <MdiIcon path={item.icon} size={20} />
              </div>
              <p className="text-xs font-bold text-brand-black/60 mb-3">{item.title}</p>
              <div className="space-y-1 mb-6">
                <p className="text-lg font-bold" style={{ color: EZ_INCOME_COLOR }}>{mask(item.income)}</p>
                <p className="text-lg font-bold" style={{ color: EZ_EXPENSE_COLOR }}>{mask(item.expense)}</p>
              </div>
              <p className="text-[10px] font-semibold text-brand-black/30">{item.date}</p>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-7 bg-white rounded-4xl p-6 shadow-sm border border-brand-black/5">
          <h3 className="text-lg font-bold mb-2">Income and Expense Trends</h3>
          <EChart option={trendOption} style={{ minHeight: 420 }} className="pie-chart-container" />
          <div className="flex items-center justify-center gap-6 -mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: EZ_INCOME_COLOR }} />
              <span className="text-xs font-bold text-brand-black/60">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: EZ_EXPENSE_COLOR }} />
              <span className="text-xs font-bold text-brand-black/60">Expense</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
