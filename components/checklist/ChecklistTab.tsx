'use client'

import { useState, useEffect } from 'react'
import { ChecklistItem } from '@/types'
import ChecklistCategory from './ChecklistCategory'

interface Props {
  tripId: string
  canEdit: boolean
}

export default function ChecklistTab({ tripId, canEdit }: Props) {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newFirstItem, setNewFirstItem] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)

  useEffect(() => {
    fetch(`/api/checklist-items?trip_id=${tripId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setItems)
  }, [tripId])

  const categories = [...new Set(items.map(i => i.category))]
  const totalChecked = items.filter(i => i.is_checked).length

  function handleToggle(updated: ChecklistItem) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
  }

  function handleAdd(item: ChecklistItem) {
    setItems(prev => [...prev, item])
  }

  function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function handleAddCategory() {
    if (!newCategory.trim() || !newFirstItem.trim()) return
    const res = await fetch('/api/checklist-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trip_id: tripId,
        category: newCategory.trim(),
        content: newFirstItem.trim(),
        is_checked: false,
        is_template: false,
        sort_order: 0,
      }),
    })
    if (!res.ok) return
    const item = await res.json()
    setItems(prev => [...prev, item])
    setNewCategory('')
    setNewFirstItem('')
    setAddingCategory(false)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          전체 {totalChecked}/{items.length} 완료
        </p>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${items.length ? (totalChecked / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="space-y-3">
        {categories.map(cat => (
          <ChecklistCategory
            key={cat}
            tripId={tripId}
            category={cat}
            items={items.filter(i => i.category === cat)}
            canEdit={canEdit}
            onToggle={handleToggle}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        ))}
        {canEdit && (
          addingCategory ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="카테고리 이름"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                autoFocus
              />
              <input
                type="text"
                value={newFirstItem}
                onChange={e => setNewFirstItem(e.target.value)}
                placeholder="첫 번째 항목"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button onClick={handleAddCategory} className="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm">추가</button>
                <button onClick={() => { setAddingCategory(false); setNewCategory(''); setNewFirstItem('') }} className="text-gray-400 text-sm px-3 py-2">취소</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCategory(true)}
              className="w-full py-3 text-sm text-blue-500 border-2 border-dashed border-blue-200 rounded-2xl hover:bg-blue-50"
            >
              + 카테고리 추가
            </button>
          )
        )}
      </div>
    </div>
  )
}
