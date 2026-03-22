'use client'

import { ChecklistItem } from '@/types'

interface Props {
  item: ChecklistItem
  canEdit: boolean
  onToggle: (item: ChecklistItem) => void
  onDelete: (id: string) => void
}

export default function ChecklistItemRow({ item, canEdit, onToggle, onDelete }: Props) {
  async function handleToggle() {
    const res = await fetch(`/api/checklist-items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_checked: !item.is_checked }),
    })
    if (!res.ok) return
    const updated = await res.json()
    onToggle(updated)
  }

  async function handleDelete() {
    const res = await fetch(`/api/checklist-items/${item.id}`, { method: 'DELETE' })
    if (!res.ok) return
    onDelete(item.id)
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
          item.is_checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        }`}
      >
        {item.is_checked && <span className="text-white text-xs">✓</span>}
      </button>
      <span className={`flex-1 text-sm ${item.is_checked ? 'line-through text-gray-400' : ''}`}>
        {item.content}
      </span>
      {canEdit && !item.is_template && (
        <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-xs p-1">삭제</button>
      )}
    </div>
  )
}
