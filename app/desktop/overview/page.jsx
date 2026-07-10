"use client"
import { useMemo, useState } from 'react'
import Link from 'next/link'
import MdiIcon from '@/components/icons/MdiIcon'
import EChart from '@/components/charts/EChart'
import { buildTrendBarOption } from '@/lib/chart/options'
import { EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from '@/lib/chart/colors'
import { useTheme } from '@/components/desktop/ThemeProvider'
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
import { formatConverted } from '@/lib/currency'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
function endOfDay(d)   { const x = new Date(d); x.setHours(23, 59, 59, 999); return x }

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonBlock({ className }) {
  return <div className={`bg-brand-black/5 animate-pulse rounded-2xl ${className}`} />
}

export default function OverviewPage() {
  const { isBalanceVisible, accounts, getTotalsForRange, isLoaded, currency, exchangeRates } = useDesktop()
  const { resolvedTheme } = useTheme()
  const now = useMemo(() => new Date(), [])
  // Toggle hero card between income/expense/net
  const [heroMode, setHeroMode] = useState('expense')

  const periodCards = useMemo(() => {
    const todayStart = startOfDay(now)
    const todayEnd   = endOfDay(now)
    const weekStart  = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const yearStart  = new Date(now.getFullYear(), 0, 1)

    const fmtRange = (start, end) => {
      const opts = { month: 'short', day: 'numeric', year: 'numeric' }
      if (start.toDateString() === end.toDateString()) return start.toLocaleDateString('en-US', opts)
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', opts)}`
    }

    return [
      { title: 'Today',      icon: mdiCalendarOutline, ...getTotalsForRange(todayStart, todayEnd),             date: fmtRange(todayStart, todayEnd)  },
      { title: 'This Week',  icon: mdiCalendarOutline, ...getTotalsForRange(startOfDay(weekStart), todayEnd),  date: fmtRange(weekStart, now)          },
      { title: 'This Month', icon: mdiCalendarOutline, ...getTotalsForRange(monthStart, todayEnd),             date: fmtRange(monthStart, now)         },
      { title: 'This Year',  icon: mdiLayers,          ...getTotalsForRange(yearStart, todayEnd),              date: String(now.getFullYear())          },
    ]
  }, [getTotalsForRange, now])

  const monthlyTrend = useMemo(() => {
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      const { income, expense } = getTotalsForRange(start, end)
      months.push({ label: d.toLocaleString('default', { month: 'short' }), income, expense })
    }
    return months
  }, [getTotalsForRange, now])

  const trendOption = useMemo(
    () => buildTrendBarOption(monthlyTrend, { formatValue: (v) => formatConverted(v, currency, exchangeRates) }),
    [monthlyTrend, currency, exchangeRates, resolvedTheme]
  )

  const { totalAssets, totalLiabilities, netAssets } = useMemo(() => ({
    totalAssets:      accounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0),
    totalLiabilities: accounts.filter(a => a.type === 'liability').reduce((s, a) => s + Math.abs(a.balance), 0),
    netAssets:        accounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0) -
                      accounts.filter(a => a.type === 'liability').reduce((s, a) => s + Math.abs(a.balance), 0),
  }), [accounts])

  const { income: monthlyIncome, expense: monthlyExpense } = useMemo(() => {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return getTotalsForRange(monthStart, endOfDay(now))
  }, [getTotalsForRange, now])

  const monthName = now.toLocaleString('default', { month: 'long' })
  const mask = (val) => {
    if (!isBalanceVisible) return `${currency} •••••••`
    return formatConverted(val, currency, exchangeRates)
  }

  // Hero card configuration
  const HERO_MODES = [
    { key: 'expense', label: 'Expense', value: monthlyExpense, color: EZ_EXPENSE_COLOR, Icon: ArrowDownCircle },
    { key: 'income',  label: 'Income',  value: monthlyIncome,  color: EZ_INCOME_COLOR,  Icon: ArrowUpCircle   },
  ]
  const activeHero = HERO_MODES.find(m => m.key === heroMode) || HERO_MODES[0]
  const otherHero  = HERO_MODES.find(m => m.key !== heroMode) || HERO_MODES[1]

  if (!isLoaded) return (
    <section className="grow space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <SkeletonBlock className="col-span-12 lg:col-span-5 h-48" />
        <SkeletonBlock className="col-span-12 lg:col-span-7 h-48" />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-36" />)}
        </div>
        <SkeletonBlock className="col-span-12 lg:col-span-7 h-80" />
      </div>
    </section>
  )

  return (
    <section className="grow space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* ── Hero Card ── */}
        <div className="col-span-12 lg:col-span-5 bg-surface rounded-3xl p-5 text-brand-black relative overflow-hidden shadow-sm border border-brand-black/5">
          {/* Toggle pills */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold">{monthName}</span>
            <div className="flex items-center gap-1 bg-brand-black/5 rounded-lg p-1 ml-2">
              {HERO_MODES.map(m => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setHeroMode(m.key)}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                    heroMode === m.key ? 'bg-surface shadow-sm text-brand-black' : 'text-brand-black/40 hover:text-brand-black/60'
                  }`}
                >{m.label}</button>
              ))}
            </div>
          </div>

          {/* Main value */}
          <div className="space-y-1 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: activeHero.color }}>
                {mask(activeHero.value)}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-black/40">
              Monthly {otherHero.label.toLowerCase()}{' '}
              <span className="font-bold" style={{ color: otherHero.color }}>
                {mask(otherHero.value)}
              </span>
            </p>
            {/* Net flow indicator */}
            <p className="text-xs font-semibold text-brand-black/30 mt-1">
              Net flow:{' '}
              <span className={monthlyIncome - monthlyExpense >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {mask(Math.abs(monthlyIncome - monthlyExpense))}
                {monthlyIncome - monthlyExpense >= 0 ? ' surplus' : ' deficit'}
              </span>
            </p>
          </div>

          <Link
            href="/desktop/transactions"
            className="inline-block bg-[#E6923F] hover:bg-[#d08235] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            View Details
          </Link>

          {/* Decorative icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-18 h-18 bg-[#E6923F]/10 rounded-3xl flex items-center justify-center rotate-12">
              <div className="w-12 h-12 bg-[#E6923F]/20 rounded-2xl flex items-center justify-center -rotate-12">
                <MdiIcon path={mdiPencilOutline} size={24} className="text-[#E6923F]" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Asset Summary ── */}
        <div className="col-span-12 lg:col-span-7 bg-surface rounded-3xl p-5 shadow-sm border border-brand-black/5">
          <h3 className="text-base font-bold mb-0.5">Asset Summary</h3>
          <p className="text-xs font-medium text-brand-black/40 mb-5">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} recorded
          </p>
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-black/5 flex items-center justify-center border border-brand-black/10">
                <MdiIcon path={mdiBankOutline} size={20} className="text-brand-black/80" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">Total Assets</p>
                <p className="text-base font-bold">{mask(totalAssets)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                <MdiIcon path={mdiCreditCardOutline} size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">Liabilities</p>
                <p className="text-base font-bold text-rose-500">{mask(totalLiabilities)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6923F]/10 flex items-center justify-center text-[#E6923F] border border-[#E6923F]/20">
                <MdiIcon path={mdiPiggyBankOutline} size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">Net Assets</p>
                <p className={`text-base font-bold ${netAssets >= 0 ? 'text-brand-black' : 'text-rose-500'}`}>{mask(netAssets)}</p>
              </div>
            </div>
          </div>

          {/* Account mini-list */}
          {accounts.length > 0 && (
            <div className="mt-6 pt-5 border-t border-brand-black/5 flex flex-wrap gap-2">
              {accounts.slice(0, 5).map(acc => (
                <div key={acc.id} className="flex items-center gap-2 px-3 py-1.5 bg-base-light rounded-xl">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: acc.color || '#E6923F' }} />
                  <span className="text-xs font-bold text-brand-black/70">{acc.name}</span>
                  <span className={`text-xs font-semibold ${acc.balance < 0 ? 'text-rose-500' : 'text-brand-black/50'}`}>
                    {isBalanceVisible ? formatConverted(Math.abs(acc.balance), currency, exchangeRates) : '•••'}
                  </span>
                </div>
              ))}
              {accounts.length > 5 && (
                <span className="text-xs font-bold text-brand-black/40 self-center">+{accounts.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── Period Cards ── */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {periodCards.map((item) => (
            <div key={item.title} className="bg-surface rounded-2xl p-4 border border-brand-black/5 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black/60 mb-2.5">
                <MdiIcon path={item.icon} size={16} />
              </div>
              <p className="text-xs font-bold text-brand-black/60 mb-2">{item.title}</p>
              <div className="space-y-1 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: EZ_INCOME_COLOR }} />
                  <p className="text-sm font-bold" style={{ color: EZ_INCOME_COLOR }}>{mask(item.income)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: EZ_EXPENSE_COLOR }} />
                  <p className="text-sm font-bold" style={{ color: EZ_EXPENSE_COLOR }}>{mask(item.expense)}</p>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-brand-black/30">{item.date}</p>
            </div>
          ))}
        </div>

        {/* ── 12-Month Trend ── */}
        <div className="col-span-12 lg:col-span-7 bg-surface rounded-3xl p-5 shadow-sm border border-brand-black/5">
          <h3 className="text-base font-bold mb-0.5">Income &amp; Expense Trends</h3>
          <p className="text-xs text-brand-black/40 mb-2">12-month view</p>
          <EChart option={trendOption} style={{ minHeight: 280 }} className="pie-chart-container" />
          <div className="flex items-center justify-center gap-6 -mt-1">
            {[
              { label: 'Income',  color: EZ_INCOME_COLOR },
              { label: 'Expense', color: EZ_EXPENSE_COLOR },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                <span className="text-xs font-bold text-brand-black/60">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
