'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecentTrips, RecentTrip } from '@/hooks/useRecentTrips'
import PasswordModal from '@/components/ui/PasswordModal'

type PendingAction = { trip: RecentTrip; action: 'open' | 'delete' } | null

export default function HomePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<PendingAction>(null)

  const { trips, removeRecentTrip } = useRecentTrips()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setError('여행 생성에 실패했습니다.')
      setLoading(false)
      return
    }

    const trip = await res.json()
    sessionStorage.setItem(`edit_${trip.id}`, 'true')
    router.push(`/trip/${trip.id}`)
  }

  async function handleTripOpen(trip: RecentTrip) {
    // 서버에 여행이 존재하는지 확인 후 비밀번호 모달 표시
    const res = await fetch(`/api/trips/${trip.id}`)
    if (!res.ok) {
      removeRecentTrip(trip.id)
      alert('이 여행은 삭제되었습니다. 목록에서 제거합니다.')
      return
    }
    setPending({ trip, action: 'open' })
  }

  function handlePasswordSuccess() {
    if (!pending) return
    if (pending.action === 'open') {
      sessionStorage.setItem(`edit_${pending.trip.id}`, 'true')
      router.push(`/trip/${pending.trip.id}`)
    } else {
      removeRecentTrip(pending.trip.id)
      setPending(null)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">✈️ 상하이 여행 플래너</h1>
          <p className="text-center text-gray-500 mb-8">여행 계획을 만들고 가족/친구와 공유하세요</p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">여행 이름</label>
              <input
                type="text"
                placeholder="예: 상하이 가족 여행 2026"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">출발일</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">귀국일</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">편집 비밀번호</label>
              <input
                type="password"
                placeholder="편집할 때 필요한 비밀번호"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '생성 중...' : '여행 만들기'}
            </button>
          </form>
        </div>

        {trips.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-base mb-3">내 여행 목록</h2>
            <ul className="space-y-2">
              {trips.map(trip => (
                <li
                  key={trip.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl border hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <button
                    className="flex-1 text-left"
                    onClick={() => handleTripOpen(trip)}
                  >
                    <p className="font-medium text-sm">{trip.title}</p>
                    <p className="text-xs text-gray-400">{trip.start_date} ~ {trip.end_date}</p>
                  </button>
                  <button
                    onClick={() => setPending({ trip, action: 'delete' })}
                    className="text-gray-300 hover:text-red-400 text-lg leading-none px-1"
                    title="목록에서 제거"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {pending && (
        <PasswordModal
          tripId={pending.trip.id}
          onSuccess={handlePasswordSuccess}
          onClose={() => setPending(null)}
          title={pending.action === 'delete' ? '목록에서 제거' : '편집 모드 잠금 해제'}
          description={
            pending.action === 'delete'
              ? `"${pending.trip.title}"을(를) 목록에서 제거하려면 비밀번호를 입력하세요`
              : '편집 비밀번호를 입력하세요'
          }
        />
      )}
    </main>
  )
}
