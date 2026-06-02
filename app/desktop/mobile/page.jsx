"use client"
import { Smartphone, QrCode } from 'lucide-react'

export default function MobilePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <h2 className="text-xl font-bold text-brand-black">Use on Mobile Device</h2>
      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
        <div className="w-20 h-20 rounded-2xl bg-[#F8F8F8] flex items-center justify-center mb-6">
          <Smartphone className="w-10 h-10 text-brand-black/40" />
        </div>
        <h3 className="text-lg font-bold text-brand-black mb-2">Access Finvera on your phone</h3>
        <p className="text-sm font-medium text-brand-black/50 mb-8">
          Open this app URL in your mobile browser and add it to your home screen for a PWA-like experience, similar to ezBookkeeping mobile flow.
        </p>
        <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-brand-black/15 flex items-center justify-center bg-[#F8F8F8] mb-4">
          <QrCode className="w-16 h-16 text-brand-black/20" />
        </div>
        <p className="text-xs font-semibold text-brand-black/30">QR code placeholder — configure when deployed</p>
      </div>
    </div>
  )
}
