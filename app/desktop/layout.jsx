import Sidebar from '@/components/desktop/Sidebar'
import Navbar from '@/components/desktop/Navbar'
import AuthGuard from '@/components/desktop/AuthGuard'
import { DesktopProvider } from '@/components/desktop/DesktopProvider'

export default function DesktopLayout({ children }) {
  return (
    <AuthGuard>
      <DesktopProvider>
        <div className="flex h-screen bg-[#F8F8F8] font-ibm overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </DesktopProvider>
    </AuthGuard>
  )
}
