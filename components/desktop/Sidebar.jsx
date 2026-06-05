"use client"
import { usePathname, useRouter } from 'next/navigation'
import MdiIcon from '@/components/icons/MdiIcon'
import {
  mdiHomeOutline,
  mdiListBoxOutline,
  mdiPlusCircle,
  mdiChartPieOutline,
  mdiCompassOutline,
  mdiCreditCardOutline,
  mdiViewDashboardOutline,
  mdiTagOutline,
  mdiClipboardTextOutline,
  mdiClipboardTextClockOutline,
  mdiSwapHorizontal,
  mdiCellphone,
  mdiInformationOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
} from '@/lib/icons/mdi'
import { useDesktop } from './DesktopProvider'

function NavSection({ title }) {
  return (
    <p className="px-4 pt-5 pb-2 text-[10px] font-bold text-brand-black/35 uppercase tracking-widest">
      {title}
    </p>
  )
}

function SidebarItem({ path, label, active = false, onClick, action }) {
  return (
    <div className="flex items-center gap-1 pr-1">
      <div
        onClick={onClick}
        className={`flex flex-1 items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
          active ? 'bg-brand-black/10' : 'hover:bg-brand-black/5'
        }`}
      >
        <MdiIcon
          path={path}
          size={20}
          className={active ? 'text-brand-black/70' : 'text-brand-black/50'}
        />
        <span className="text-sm font-bold text-brand-black/80">{label}</span>
      </div>
      {action}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isBalanceVisible, setIsBalanceVisible } = useDesktop()

  const navigateTo = (path) => router.push(`/desktop/${path}`)
  const isActive = (path) => pathname === `/desktop/${path}`

  const openAddTransaction = (e) => {
    e.stopPropagation()
    router.push('/desktop/transactions?add=1')
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#f9efe5] rounded-4xl pl-2 pr-4 py-6 text-brand-black overflow-y-auto border-r border-brand-black/5 shadow-sm m-2 flex flex-col">
      <div className="space-y-0.5 flex-1">
        <div
          onClick={() => navigateTo('overview')}
          className={`flex items-center gap-3 px-4 py-3 rounded-r-full -ml-2 pl-6 cursor-pointer transition-all ${
            isActive('overview')
              ? 'bg-linear-to-r from-[#8B4513] to-[#D2691E] shadow-md'
              : 'bg-white/60 hover:bg-white/80'
          }`}
        >
          <MdiIcon
            path={mdiHomeOutline}
            size={20}
            className={isActive('overview') ? 'text-white' : 'text-brand-black/60'}
          />
          <span className={`font-bold text-sm ${isActive('overview') ? 'text-white' : 'text-brand-black/70'}`}>
            Overview
          </span>
        </div>

        <div className="px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="flex items-center gap-2 text-xs font-semibold text-brand-black/40 hover:text-brand-black/60 transition-colors cursor-pointer"
          >
            <MdiIcon path={isBalanceVisible ? mdiEyeOffOutline : mdiEyeOutline} size={14} />
            {isBalanceVisible ? 'Hide amounts' : 'Show amounts'}
          </button>
        </div>

        <NavSection title="Transaction Data" />
        <SidebarItem
          path={mdiListBoxOutline}
          label="Transaction Details"
          active={isActive('transactions')}
          onClick={() => navigateTo('transactions')}
          action={
            <button
              type="button"
              onClick={openAddTransaction}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-brand-black/50 hover:bg-brand-black/10 hover:text-brand-black transition-colors cursor-pointer"
              title="Add Transaction"
            >
              <MdiIcon path={mdiPlusCircle} size={18} />
            </button>
          }
        />
        <SidebarItem
          path={mdiChartPieOutline}
          label="Statistics & Analysis"
          active={isActive('statistics')}
          onClick={() => navigateTo('statistics')}
        />
        <SidebarItem
          path={mdiCompassOutline}
          label="Insights Explorer"
          active={isActive('insights')}
          onClick={() => navigateTo('insights')}
        />

        <NavSection title="Basis Data" />
        <SidebarItem
          path={mdiCreditCardOutline}
          label="Accounts"
          active={isActive('accounts')}
          onClick={() => navigateTo('accounts')}
        />
        <SidebarItem
          path={mdiViewDashboardOutline}
          label="Transaction Categories"
          active={isActive('categories')}
          onClick={() => navigateTo('categories')}
        />
        <SidebarItem
          path={mdiTagOutline}
          label="Transaction Tags"
          active={isActive('tags')}
          onClick={() => navigateTo('tags')}
        />
        <SidebarItem
          path={mdiClipboardTextOutline}
          label="Transaction Templates"
          active={isActive('templates')}
          onClick={() => navigateTo('templates')}
        />
        <SidebarItem
          path={mdiClipboardTextClockOutline}
          label="Scheduled Transactions"
          active={isActive('scheduled')}
          onClick={() => navigateTo('scheduled')}
        />

        <NavSection title="Miscellaneous" />
        <SidebarItem
          path={mdiSwapHorizontal}
          label="Exchange Rates Data"
          active={isActive('exchange')}
          onClick={() => navigateTo('exchange')}
        />
        <SidebarItem
          path={mdiCellphone}
          label="Use on Mobile Device"
          active={isActive('mobile')}
          onClick={() => navigateTo('mobile')}
        />
        <SidebarItem
          path={mdiInformationOutline}
          label="About"
          active={isActive('about')}
          onClick={() => navigateTo('about')}
        />
      </div>
    </aside>
  )
}
