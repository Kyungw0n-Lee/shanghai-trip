'use client'

import { useState, useEffect } from 'react'
import { Expense } from '@/types'
import BudgetSummary from './BudgetSummary'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'

interface Props {
  tripId: string
  initialBudget: number
  canEdit: boolean
}

export default function BudgetTab({ tripId, initialBudget, canEdit }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState(initialBudget)
  const [rate, setRate] = useState(190)
  const [adding, setAdding] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  useEffect(() => {
    fetch(`/api/expenses?trip_id=${tripId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setExpenses)
    fetch('/api/exchange-rate')
      .then(r => r.ok ? r.json() : { rate: 190 })
      .then(d => setRate(d.rate))
  }, [tripId])

  return (
    <div className="p-4 space-y-4">
      {canEdit && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {editingBudget ? (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">예산 (CNY)</span>
              <input
                type="number"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
              />
              <button
                onClick={async () => {
                  const newBudget = Number(budgetInput)
                  const res = await fetch(`/api/trips/${tripId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ budget_cny: newBudget }),
                  })
                  if (!res.ok) return
                  setBudget(newBudget)
                  setEditingBudget(false)
                }}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm"
              >저장</button>
            </div>
          ) : (
            <button
              onClick={() => { setBudgetInput(String(budget)); setEditingBudget(true) }}
              className="text-sm text-blue-500 hover:underline"
            >
              {budget > 0 ? `예산 ¥${budget} 수정` : '+ 예산 설정'}
            </button>
          )}
        </div>
      )}

      <BudgetSummary expenses={expenses} budget={budget} rate={rate} />

      {canEdit && (
        adding ? (
          <ExpenseForm
            tripId={tripId}
            onAdd={e => { setExpenses(prev => [...prev, e]); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full py-3 text-sm text-blue-500 border-2 border-dashed border-blue-200 rounded-2xl hover:bg-blue-50"
          >
            + 지출 추가
          </button>
        )
      )}

      <ExpenseList
        expenses={expenses}
        canEdit={canEdit}
        onDelete={id => setExpenses(prev => prev.filter(e => e.id !== id))}
      />
    </div>
  )
}
