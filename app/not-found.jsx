import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-primary font-ibm p-6 overflow-hidden">
      <div className="flex flex-col items-center text-center max-w-md w-full gap-6">
        <div className="text-7xl font-bold text-brand-black/10 select-none">404</div>
        <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center shadow-sm border border-brand-black/5 text-3xl">
          🧭
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-black mb-2">Page Not Found</h1>
          <p className="text-sm text-brand-black/50 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/desktop/overview"
            className="px-5 py-2.5 bg-brand-black text-brand-primary rounded-xl text-sm font-bold hover:bg-brand-black/80 transition-colors"
          >
            Go to Overview
          </Link>
          <Link
            href="/auth/signin"
            className="px-5 py-2.5 bg-brand-black/5 text-brand-black rounded-xl text-sm font-bold hover:bg-brand-black/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
