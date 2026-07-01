"use client"
import { useState } from 'react'
import Sidebar from '@/components/desktop/Sidebar'
import Navbar from '@/components/desktop/Navbar'
import AuthGuard from '@/components/desktop/AuthGuard'
import { DesktopProvider } from '@/components/desktop/DesktopProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function DesktopLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <AuthGuard>
      <DesktopProvider>
        <div className="flex h-screen bg-base-light font-ibm overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(c => !c)}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </DesktopProvider>
    </AuthGuard>
  )
}
