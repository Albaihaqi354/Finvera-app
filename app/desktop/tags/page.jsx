"use client"
import { useState } from 'react'
import { PlusCircle, Search, Pencil, Trash2, Tag as TagIcon, X, Check } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'

const TAG_COLORS = [
  '#E6923F', '#F14C4C', '#009E9E', '#065786', '#713670',
  '#4dd291', '#fc892c', '#2ab4d0', '#cc4a66', '#8e1d51',
]

function TagCard({ tag, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F8F8] border border-brand-black/5 hover:border-brand-black/10 group transition-all">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: (tag.color || '#E6923F') + '20', color: tag.color || '#E6923F' }}
        >
          <TagIcon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-brand-black/80">{tag.name}</span>
        {tag.color && (
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(tag)}
          className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-all cursor-pointer"
          title="Edit tag"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(tag)}
          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          title="Delete tag"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

function TagModal({ onClose, onSubmit, editTag = null }) {
  const isEdit = !!editTag
  const [name, setName] = useState(editTag?.name || '')
  const [color, setColor] = useState(editTag?.color || '#E6923F')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), color })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-black/5 flex items-center justify-between bg-[#F8F8F8]">
          <h3 className="font-bold text-lg text-brand-black">{isEdit ? 'Edit Tag' : 'Add Tag'}</h3>
          <button type="button" onClick={onClose} className="cursor-pointer p-1.5 rounded-full hover:bg-brand-black/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F8]">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: color + '20', color }}>
              <TagIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-brand-black/80">{name || 'Tag preview'}</span>
            <span className="w-2.5 h-2.5 rounded-full ml-auto" style={{ backgroundColor: color }} />
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Tag Name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Vacation 2026"
              className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border focus:border-brand-black/20 border border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2 block">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {TAG_COLORS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-lg transition-transform cursor-pointer relative"
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" strokeWidth={3} />
                  )}
                </button>
              ))}
              <input
                type="color" value={color}
                onChange={e => setColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
                title="Custom color"
              />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-brand-black text-brand-primary rounded-xl py-3 text-sm font-bold cursor-pointer hover:bg-brand-black/80 transition-colors">
            {isEdit ? 'Save Changes' : 'Add Tag'}
          </button>
        </form>
      </div>
    </div>
  )
}

function DeleteTagModal({ tag, onConfirm, onCancel }) {
  if (!tag) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Delete Tag</h3>
        <p className="text-brand-black/60 text-sm mb-6">
          Delete tag <span className="font-bold text-brand-black">&ldquo;{tag.name}&rdquo;</span>?
          It will be removed from all transactions.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 bg-brand-black/5 hover:bg-brand-black/10 text-brand-black font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TagsPage() {
  const { tags, addTag, updateTag, deleteTag, isLoaded } = useDesktop()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [deletingTag, setDeletingTag] = useState(null)

  if (!isLoaded) return (
    <div className="space-y-3 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 bg-brand-black/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => { setEditingTag(null); setModalOpen(true) }
  const openEdit = (tag) => { setEditingTag(tag); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingTag(null) }

  const handleSubmit = ({ name, color }) => {
    if (editingTag) {
      updateTag(editingTag.id, name, color)
    } else {
      addTag(name, color)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Transaction Tags</h2>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Tag
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-brand-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-brand-black">All Tags</h3>
            <span className="text-xs font-bold text-brand-black/40 bg-brand-black/5 px-2 py-0.5 rounded-full">{tags.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#F8F8F8] border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-brand-black/20 w-48 sm:w-64"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🏷️</div>
              <p className="text-sm text-brand-black/40">
                {search ? 'No tags match your search.' : 'No tags yet. Add your first tag.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map(tag => (
                <TagCard
                  key={tag.id}
                  tag={tag}
                  onEdit={openEdit}
                  onDelete={setDeletingTag}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <TagModal
          onClose={closeModal}
          onSubmit={handleSubmit}
          editTag={editingTag}
        />
      )}
      <DeleteTagModal
        tag={deletingTag}
        onConfirm={() => { deleteTag(deletingTag.id); setDeletingTag(null) }}
        onCancel={() => setDeletingTag(null)}
      />
    </div>
  )
}
