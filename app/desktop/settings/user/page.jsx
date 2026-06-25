"use client"
import { useEffect, useState } from 'react'
import { Save, User, Mail, Lock, Shield } from 'lucide-react'

import { api } from '@/lib/api/client'

export default function UserSettingsPage() {
  const [profile, setProfile] = useState({ username: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.users.getProfile()
        setProfile({ username: res.username || '', email: res.email || '' })
      } catch (err) {
        console.error('Failed to load profile:', err)
        // Fallback to local storage if API fails
        const raw = localStorage.getItem('finvera_user')
        if (raw) {
          const u = JSON.parse(raw)
          setProfile({ username: u.username || '', email: u.email || '' })
        }
      }
    }
    fetchProfile()
  }, [])

  const saveProfile = async () => {
    try {
      setIsLoading(true)
      await api.users.updateProfile(profile)
      // Update local storage too for fallback/other UI parts
      const raw = localStorage.getItem('finvera_user')
      const prev = raw ? JSON.parse(raw) : {}
      localStorage.setItem('finvera_user', JSON.stringify({ ...prev, ...profile }))
      alert('Profile saved successfully!')
    } catch (err) {
      alert(err.message || 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">User Settings</h2>
        <button
          type="button"
          onClick={saveProfile}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-2xl space-y-8">
          
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-brand-black/5 border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative group">
              <User className="w-10 h-10 text-brand-black/40" />
              <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <span className="text-xs font-bold text-white">Upload</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-black">Profile Picture</h3>
              <p className="text-xs font-medium text-brand-black/40 mt-1">Recommended size: 256x256px. Formats: JPG, PNG.</p>
              <button className="mt-3 text-xs font-bold text-[#E6923F] hover:text-[#d08235] transition-colors">
                Remove Picture
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-brand-black border-b border-brand-black/5 pb-2">Profile Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-black/40" />
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                  className="w-full bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-black/40" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-brand-black border-b border-brand-black/5 pb-2">Security</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F8F8] border border-brand-black/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black/60">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">Password</h4>
                    <p className="text-xs font-medium text-brand-black/50">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="text-xs font-bold bg-white border border-brand-black/10 px-4 py-2 rounded-lg hover:bg-brand-black/5 transition-colors shadow-sm">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F8F8] border border-brand-black/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black/60">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">Two-Factor Authentication</h4>
                    <p className="text-xs font-medium text-brand-black/50">Not configured</p>
                  </div>
                </div>
                <button className="text-xs font-bold bg-brand-black text-brand-primary px-4 py-2 rounded-lg hover:bg-brand-black/80 transition-colors shadow-sm">
                  Enable
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
