"use client"
import { useState } from 'react'
import { PlusCircle, Search, Edit, Trash2, Tag as TagIcon, X } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'

export default function TagsPage() {
  const { tags, addTag, deleteTag, isLoaded } = useDesktop()
  const [search, setSearch] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTagName.trim()) return
    addTag(newTagName.trim())
    setNewTagName('')
    setShowAdd(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Transaction Tags</h2>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Tag
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-brand-black/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-brand-black">All Tags</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search tag"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#F8F8F8] border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-brand-black/20 w-48 sm:w-64"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(tag => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F8F8] border border-brand-black/5 hover:border-brand-black/10 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-black/5 flex items-center justify-center text-brand-black/50">
                    <TagIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-brand-black/80">{tag.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTag(tag.id)}
                  className="p-1.5 text-brand-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-brand-black">Add Tag</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                required
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="Tag name"
                className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none"
              />
              <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3 text-sm font-bold cursor-pointer">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
