export default function DesktopLoading() {
  return (
    <div className="space-y-6 p-1">
      {/* Header skeleton */}
      <div className="h-8 w-48 bg-brand-black/5 rounded-xl animate-pulse" />
      {/* Content skeleton */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 h-48 bg-brand-black/5 rounded-3xl animate-pulse" />
        <div className="col-span-12 lg:col-span-7 h-48 bg-brand-black/5 rounded-3xl animate-pulse" />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 h-80 bg-brand-black/5 rounded-3xl animate-pulse" />
        <div className="col-span-12 lg:col-span-7 h-80 bg-brand-black/5 rounded-3xl animate-pulse" />
      </div>
    </div>
  )
}
