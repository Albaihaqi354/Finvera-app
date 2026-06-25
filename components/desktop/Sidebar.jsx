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
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
} from '@/lib/icons/mdi'
import { useDesktop } from './DesktopProvider'

function NavSection({ title, collapsed }) {
  if (collapsed) return <div className="my-2 border-t border-brand-black/10 mx-2" />
  return (
    <p className="px-4 pt-5 pb-2 text-[10px] font-bold text-brand-black/35 uppercase tracking-widest">
      {title}
    </p>
  )
}

function SidebarItem({ path, label, active = false, onClick, action, collapsed, title: tipTitle }) {
  return (
    <div className={`flex items-center gap-1 ${collapsed ? 'pr-0 justify-center' : 'pr-1'}`}>
      <div
        onClick={onClick}
        title={collapsed ? tipTitle || label : undefined}
        className={`flex flex-1 items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
          collapsed ? 'justify-center px-0 w-10 h-10 mx-auto flex-none' : ''
        } ${
          active ? 'bg-brand-black/10' : 'hover:bg-brand-black/5'
        }`}
      >
        <MdiIcon
          path={path}
          size={collapsed ? 22 : 20}
          className={active ? 'text-brand-black/70' : 'text-brand-black/50'}
        />
        {!collapsed && <span className="text-sm font-bold text-brand-black/80 truncate">{label}</span>}
      </div>
      {!collapsed && action}
    </div>
  )
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isBalanceVisible, setIsBalanceVisible } = useDesktop()

  const navigateTo = (path) => {
    router.push(`/desktop/${path}`)
    onClose?.()
  }
  const isActive = (path) => pathname === `/desktop/${path}`

  const openAddTransaction = (e) => {
    e.stopPropagation()
    router.push('/desktop/transactions?add=1')
    onClose?.()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 lg:z-auto
        bg-[#f9efe5] rounded-r-4xl lg:rounded-4xl
        py-4 text-brand-black overflow-y-auto overflow-x-hidden
        border-r border-brand-black/5 shadow-sm
        flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:flex
        lg:m-2
        ${isCollapsed ? 'w-16 pl-1 pr-1' : 'w-64 pl-2 pr-4'}
      `}>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden absolute top-3 right-3 p-1.5 rounded-xl hover:bg-brand-black/10 transition-colors cursor-pointer"
        >
          <MdiIcon path={mdiClose} size={18} className="text-brand-black/60" />
        </button>

        {/* Desktop collapse toggle */}
        <div className={`hidden lg:flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-1 px-1`}>
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-xl hover:bg-brand-black/10 transition-colors cursor-pointer text-brand-black/50 hover:text-brand-black/70"
          >
            <MdiIcon path={isCollapsed ? mdiChevronRight : mdiChevronLeft} size={18} />
          </button>
        </div>

        <div className="space-y-0.5 flex-1 min-w-0">
          {/* Overview – special pill style */}
          <div
            onClick={() => navigateTo('overview')}
            title={isCollapsed ? 'Overview' : undefined}
            className={`flex items-center gap-3 rounded-r-full cursor-pointer transition-all ${
              isCollapsed
                ? 'justify-center w-10 h-10 mx-auto rounded-xl'
                : '-ml-2 pl-6 pr-4 py-2.5'
            } ${
              isActive('overview')
                ? 'bg-linear-to-r from-[#8B4513] to-[#D2691E] shadow-md'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          >
            <MdiIcon
              path={mdiHomeOutline}
              size={isCollapsed ? 22 : 20}
              className={isActive('overview') ? 'text-white' : 'text-brand-black/60'}
            />
            {!isCollapsed && (
              <span className={`font-bold text-sm ${isActive('overview') ? 'text-white' : 'text-brand-black/70'}`}>
                Overview
              </span>
            )}
          </div>

          {/* Balance toggle */}
          {!isCollapsed && (
            <div className="px-4 pt-2 pb-1">
              <button
                type="button"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="flex items-center gap-2 text-xs font-semibold text-brand-black/40 hover:text-brand-black/60 transition-colors cursor-pointer"
              >
                <MdiIcon path={isBalanceVisible ? mdiEyeOffOutline : mdiEyeOutline} size={13} />
                {isBalanceVisible ? 'Hide amounts' : 'Show amounts'}
              </button>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center mt-1 mb-1">
              <button
                type="button"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                title={isBalanceVisible ? 'Hide amounts' : 'Show amounts'}
                className="p-1.5 rounded-xl hover:bg-brand-black/10 transition-colors cursor-pointer text-brand-black/40 hover:text-brand-black/60"
              >
                <MdiIcon path={isBalanceVisible ? mdiEyeOffOutline : mdiEyeOutline} size={16} />
              </button>
            </div>
          )}

          <NavSection title="Transaction Data" collapsed={isCollapsed} />
          <SidebarItem
            path={mdiListBoxOutline}
            label="Transaction Details"
            active={isActive('transactions')}
            onClick={() => navigateTo('transactions')}
            collapsed={isCollapsed}
            action={
              <button
                type="button"
                onClick={openAddTransaction}
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-brand-black/50 hover:bg-brand-black/10 hover:text-brand-black transition-colors cursor-pointer"
                title="Add Transaction"
              >
                <MdiIcon path={mdiPlusCircle} size={16} />
              </button>
            }
          />
          <SidebarItem path={mdiChartPieOutline} label="Statistics & Analysis" active={isActive('statistics')} onClick={() => navigateTo('statistics')} collapsed={isCollapsed} />
          <SidebarItem path={mdiCompassOutline} label="Insights Explorer" active={isActive('insights')} onClick={() => navigateTo('insights')} collapsed={isCollapsed} />

          <NavSection title="Basis Data" collapsed={isCollapsed} />
          <SidebarItem path={mdiCreditCardOutline} label="Accounts" active={isActive('accounts')} onClick={() => navigateTo('accounts')} collapsed={isCollapsed} />
          <SidebarItem path={mdiViewDashboardOutline} label="Transaction Categories" active={isActive('categories')} onClick={() => navigateTo('categories')} collapsed={isCollapsed} />
          <SidebarItem path={mdiTagOutline} label="Transaction Tags" active={isActive('tags')} onClick={() => navigateTo('tags')} collapsed={isCollapsed} />
          <SidebarItem path={mdiClipboardTextOutline} label="Transaction Templates" active={isActive('templates')} onClick={() => navigateTo('templates')} collapsed={isCollapsed} />
          <SidebarItem path={mdiClipboardTextClockOutline} label="Scheduled Transactions" active={isActive('scheduled')} onClick={() => navigateTo('scheduled')} collapsed={isCollapsed} />

          <NavSection title="Miscellaneous" collapsed={isCollapsed} />
          <SidebarItem path={mdiSwapHorizontal} label="Exchange Rates Data" active={isActive('exchange')} onClick={() => navigateTo('exchange')} collapsed={isCollapsed} />
          <SidebarItem path={mdiCellphone} label="Use on Mobile Device" active={isActive('mobile')} onClick={() => navigateTo('mobile')} collapsed={isCollapsed} />
          <SidebarItem path={mdiInformationOutline} label="About" active={isActive('about')} onClick={() => navigateTo('about')} collapsed={isCollapsed} />
        </div>
      </aside>
    </>
  )
}
