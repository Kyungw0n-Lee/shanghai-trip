'use client'

import { Expense } from '@/types'
import { cnyToKrw, formatKrw, formatCny } from '@/lib/exchange-rate'

interface Props {
  expenses: Expense[]
  budget: number
  rate: number
}

const CATEGORY_COLORS: Record<string, string> = {
  '식비': 'bg-orange-100 text-orange-700',
  '교통': 'bg-blue-100 text-blue-700',
  '숙박': 'bg-purple-100 text-purple-700',
  '쇼핑': 'bg-pink-100 text-pink-700',
  '기타': 'bg-gray-100 text-gray-700',
}

export default function BudgetSummary({ expenses, budget, rate }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.amount_cny, 0)
  const remaining = budget - total
  const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount_cny
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">총 지출</span>
          <span className="font-bold">{formatCny(total)} ({formatKrw(cnyToKrw(total, rate))})</span>
        </div>
        {budget > 0 && (
          <>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${percent >= 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>예산 {formatCny(budget)}</span>
              <span>잔여 {formatCny(remaining)}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(byCategory).map(([cat, amount]) => (
          <div key={cat} className={`px-3 py-1.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[cat] ?? 'bg-gray-100'}`}>
            {cat}: {formatCny(amount)}
          </div>
        ))}
      </div>
    </div>
  )
}
