"use client"
import { useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, Pencil, Landmark, CreditCard, PiggyBank, Calendar, Layers } from 'lucide-react'
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
  const { isBalanceVisible, accounts, transactions, getTotalsForRange, isLoaded } = useDesktop()

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
      if (start.getTime() === end.getTime() || start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', opts)
      }
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', opts)}`
    }

    return [
      { title: 'Today', icon: <Calendar className="w-5 h-5" />, ...getTotalsForRange(todayStart, todayEnd), date: fmtRange(todayStart, todayEnd) },
      { title: 'This Week', icon: <Calendar className="w-5 h-5" />, ...getTotalsForRange(startOfDay(weekStart), todayEnd), date: fmtRange(weekStart, now) },
      { title: 'This Month', icon: <Calendar className="w-5 h-5" />, ...getTotalsForRange(monthStart, todayEnd), date: fmtRange(monthStart, now) },
      { title: 'This Year', icon: <Layers className="w-5 h-5" />, ...getTotalsForRange(yearStart, todayEnd), date: String(now.getFullYear()) },
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
        isCurrent: d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
    }
    const maxVal = Math.max(...months.map(m => Math.max(m.income, m.expense)), 1)
    return { months, maxVal }
  }, [getTotalsForRange, now])

  // Memoised so these only recompute when accounts/transactions change
  const { totalAssets, totalLiabilities, netAssets } = useMemo(() => ({
    totalAssets:      accounts.filter(a => a.type === 'asset').reduce((acc, curr) => acc + curr.balance, 0),
    totalLiabilities: accounts.filter(a => a.type === 'liability').reduce((acc, curr) => acc + Math.abs(curr.balance), 0),
    netAssets:        accounts.filter(a => a.type === 'asset').reduce((acc, curr) => acc + curr.balance, 0)
                    - accounts.filter(a => a.type === 'liability').reduce((acc, curr) => acc + Math.abs(curr.balance), 0),
  }), [accounts])

  const { monthlyIncome, monthlyExpense } = useMemo(() => {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const { income, expense } = getTotalsForRange(monthStart, endOfDay(now))
    return { monthlyIncome: income, monthlyExpense: expense }
  }, [getTotalsForRange, now.getMonth(), now.getFullYear()])

  const formatMoney = (amount) => amount.toLocaleString('id-ID')
  const monthName = now.toLocaleString('default', { month: 'long' })
  const mask = (val) => (isBalanceVisible ? `Rp ${formatMoney(val)}` : 'Rp •••••••')

  return (
    <section className="grow space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 bg-white rounded-4xl p-7 text-brand-black relative overflow-hidden shadow-sm border border-brand-black/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{monthName}</span>
              <span className="text-sm font-medium text-brand-black/50">Expense</span>
              <RotateCcw className="w-4 h-4 text-brand-black/40" />
            </div>
          </div>
          <div className="space-y-1 mb-8">
            <span className="text-4xl font-bold text-[#009E9E]">{mask(monthlyExpense)}</span>
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
                <Pencil className="w-8 h-8 text-[#E6923F]" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 bg-white rounded-4xl p-7 text-brand-black shadow-sm border border-brand-black/5">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-1">Asset Summary</h3>
            <p className="text-xs font-medium text-brand-black/40">You have recorded {accounts.length} accounts</p>
          </div>
          <div className="flex flex-wrap items-center gap-8 md:gap-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-black/5 flex items-center justify-center border border-brand-black/10">
                <Landmark className="w-6 h-6 text-brand-black/80" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total assets</p>
                <p className="text-lg font-bold">{mask(totalAssets)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#009E9E]/10 flex items-center justify-center text-[#009E9E] border border-[#009E9E]/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total liabilities</p>
                <p className="text-lg font-bold">{mask(totalLiabilities)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E6923F]/10 flex items-center justify-center text-[#E6923F] border border-[#E6923F]/20">
                <PiggyBank className="w-6 h-6" />
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
            <div key={item.title} className="bg-white rounded-3xl p-5 border border-brand-black/5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="w-9 h-9 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black/60">
                  {item.icon}
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-brand-black/60">{item.title}</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-[#F14C4C]">{mask(item.income)}</p>
                  <p className="text-lg font-bold text-[#009E9E]">{mask(item.expense)}</p>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-brand-black/30">{item.date}</p>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-7 bg-white rounded-4xl p-8 shadow-sm border border-brand-black/5 flex flex-col">
          <h3 className="text-lg font-bold mb-8">Income and Expense Trends</h3>
          <div className="grow overflow-x-auto my-6">
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 min-w-[600px] relative">
              {monthlyTrend.months.map((month) => (
                <div key={month.label} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="w-full grow flex items-end justify-center gap-0.5 px-0.5">
                    {month.income > 0 || month.expense > 0 ? (
                      <>
                        <div
                          className="w-2.5 sm:w-3 rounded-full bg-[#F14C4C]"
                          style={{ height: `${(month.income / monthlyTrend.maxVal) * 140}px`, minHeight: month.income ? 4 : 0 }}
                        />
                        <div
                          className="w-2.5 sm:w-3 rounded-full bg-[#009E9E]"
                          style={{ height: `${(month.expense / monthlyTrend.maxVal) * 140}px`, minHeight: month.expense ? 4 : 0 }}
                        />
                      </>
                    ) : null}
                  </div>
                  <span className={`text-[10px] font-bold ${month.isCurrent ? 'text-brand-black/70' : 'text-brand-black/20'}`}>
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F14C4C]" />
              <span className="text-xs font-bold text-brand-black/60">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#009E9E]" />
              <span className="text-xs font-bold text-brand-black/60">Expense</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
