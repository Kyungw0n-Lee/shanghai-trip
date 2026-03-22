'use client'

import { useState } from 'react'

interface Props {
  tripId: string
  onSuccess: () => void
  onClose: () => void
  title?: string
  description?: string
}

export default function PasswordModal({ tripId, onSuccess, onClose, title, description }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/trips/${tripId}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      setError('비밀번호가 틀렸습니다.')
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-bold mb-1">{title ?? '편집 모드 잠금 해제'}</h2>
        <p className="text-sm text-gray-500 mb-4">{description ?? '편집 비밀번호를 입력하세요'}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '확인 중...' : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
