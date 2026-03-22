'use client'

import { useState } from 'react'
import { Expense, ExpenseCategory } from '@/types'

const CATEGORIES: ExpenseCategory[] = ['식비', '교통', '숙박', '쇼핑', '기타']

interface Props {
  tripId: string
  onAdd: (expense: Expense) => void
  onCancel: () => void
}

export default function ExpenseForm({ tripId, onAdd, onCancel }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    date: today,
    category: '식비' as ExpenseCategory,
    amount_cny: '',
    memo: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, trip_id: tripId, amount_cny: Number(form.amount_cny) }),
    })
    if (!res.ok) return
    const expense = await res.json()
    onAdd(expense)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">날짜</label>
          <input type="date" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">카테고리</label>
          <select value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))}
            className="w-full border rounded-lg px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">금액 (CNY ¥)</label>
        <input type="number" value={form.amount_cny} min="0" step="0.01"
          onChange={e => setForm(f => ({ ...f, amount_cny: e.target.value }))}
          placeholder="0.00"
          className="w-full border rounded-lg px-3 py-2 text-sm" required />
      </div>
      <input type="text" value={form.memo}
        onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
        placeholder="메모 (선택)"
        className="w-full border rounded-lg px-3 py-2 text-sm" />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 border rounded-lg py-2 text-sm">취소</button>
        <button type="submit" className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm">추가</button>
      </div>
    </form>
  )
}
