'use client'

import { useState } from 'react'
import { Expense, ExpenseCategory } from '@/types'
import { formatCny } from '@/lib/exchange-rate'
import { CATEGORY_COLORS } from './budget-constants'
import ExpenseForm from './ExpenseForm'

const CATEGORIES: ExpenseCategory[] = ['식비', '교통', '숙박', '쇼핑', '기타']

interface Props {
  expenses: Expense[]
  tripId: string
  canEdit: boolean
  onDelete: (id: string) => void
  onUpdate: (expense: Expense) => void
}

export default function ExpenseList({ expenses, tripId, canEdit, onDelete, onUpdate }: Props) {
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | '전체'>('전체')
  const [filterDate, setFilterDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    onDelete(id)
  }

  const filtered = expenses.filter(e => {
    if (filterCategory !== '전체' && e.category !== filterCategory) return false
    if (filterDate && e.date !== filterDate) return false
    return true
  })

  return (
    <div className="space-y-3">
      {/* 필터 */}
      <div className="bg-white rounded-2xl p-3 shadow-sm space-y-2">
        <p className="text-xs text-gray-500 font-medium">필터</p>
        <div className="flex gap-1.5 flex-wrap">
          {(['전체', ...CATEGORIES] as const).map(c => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                filterCategory === c
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-xs w-full"
          placeholder="날짜 필터"
        />
        {filterDate && (
          <button onClick={() => setFilterDate('')} className="text-xs text-blue-500">날짜 필터 초기화</button>
        )}
      </div>

      {/* 지출 목록 */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">해당 조건의 지출이 없습니다</p>
      ) : (
        filtered.map(e => (
          <div key={e.id}>
            {editingId === e.id ? (
              <ExpenseForm
                tripId={tripId}
                editId={e.id}
                initial={e}
                onAdd={updated => { onUpdate(updated); setEditingId(null) }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs shrink-0 ${CATEGORY_COLORS[e.category] ?? 'bg-gray-100'}`}>
                  {e.category}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{formatCny(e.amount_cny)}</span>
                    <span className="text-xs text-gray-400">
                      {e.date}{e.time ? ` ${e.time}` : ''}
                    </span>
                  </div>
                  {e.memo && <p className="text-xs text-gray-500 truncate">{e.memo}</p>}
                </div>
                {canEdit && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditingId(e.id)} className="text-blue-400 text-xs hover:text-blue-600">수정</button>
                    <button onClick={() => handleDelete(e.id)} className="text-red-400 text-xs hover:text-red-600">삭제</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
