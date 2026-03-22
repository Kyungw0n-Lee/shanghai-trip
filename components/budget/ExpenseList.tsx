'use client'

import { Expense } from '@/types'
import { formatCny } from '@/lib/exchange-rate'

interface Props {
  expenses: Expense[]
  canEdit: boolean
  onDelete: (id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  '식비': 'bg-orange-100 text-orange-700',
  '교통': 'bg-blue-100 text-blue-700',
  '숙박': 'bg-purple-100 text-purple-700',
  '쇼핑': 'bg-pink-100 text-pink-700',
  '기타': 'bg-gray-100 text-gray-700',
}

export default function ExpenseList({ expenses, canEdit, onDelete }: Props) {
  async function handleDelete(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    onDelete(id)
  }

  return (
    <div className="space-y-2">
      {expenses.map(e => (
        <div key={e.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs ${CATEGORY_COLORS[e.category] ?? 'bg-gray-100'}`}>
            {e.category}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{formatCny(e.amount_cny)}</span>
              <span className="text-xs text-gray-400">{e.date}</span>
            </div>
            {e.memo && <p className="text-xs text-gray-500">{e.memo}</p>}
          </div>
          {canEdit && (
            <button onClick={() => handleDelete(e.id)} className="text-red-400 text-xs hover:text-red-600">삭제</button>
          )}
        </div>
      ))}
    </div>
  )
}
