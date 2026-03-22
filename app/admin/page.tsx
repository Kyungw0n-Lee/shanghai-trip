'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TripSummary {
  id: string
  title: string
  start_date: string
  end_date: string
  budget_cny: number | null
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [trips, setTrips] = useState<TripSummary[]>([])
  const [tripsLoading, setTripsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') {
      setIsAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthed) loadTrips()
  }, [isAuthed])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      setAuthError('비밀번호가 틀렸습니다.')
      setAuthLoading(false)
      return
    }

    sessionStorage.setItem('admin_authed', 'true')
    setIsAuthed(true)
    setAuthLoading(false)
  }

  async function loadTrips() {
    setTripsLoading(true)
    const res = await fetch('/api/admin/trips')
    if (res.ok) {
      const data = await res.json()
      setTrips(data)
    }
    setTripsLoading(false)
  }

  async function handleDelete(trip: TripSummary) {
    if (!confirm(`"${trip.title}" 여행을 완전히 삭제하시겠습니까?\n일정, 체크리스트, 지출, 장소 등 모든 데이터가 삭제됩니다.`)) return

    setDeletingId(trip.id)
    const res = await fetch(`/api/admin/trips/${trip.id}`, { method: 'DELETE' })
    if (res.ok) {
      setTrips(prev => prev.filter(t => t.id !== trip.id))
    }
    setDeletingId(null)
  }

  function handleOpen(trip: TripSummary) {
    sessionStorage.setItem(`edit_${trip.id}`, 'true')
    router.push(`/trip/${trip.id}`)
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authed')
    setIsAuthed(false)
    setTrips([])
  }

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">관리자 비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                required
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {authLoading ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">관리자 대시보드</h1>
          <p className="text-sm text-gray-500">모든 여행을 관리합니다</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border rounded-lg"
        >
          로그아웃
        </button>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base">전체 여행 목록 ({trips.length}개)</h2>
          <button
            onClick={loadTrips}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            새로고침
          </button>
        </div>

        {tripsLoading ? (
          <p className="text-center text-gray-400 py-12">불러오는 중...</p>
        ) : trips.length === 0 ? (
          <p className="text-center text-gray-400 py-12">등록된 여행이 없습니다</p>
        ) : (
          <ul className="space-y-3">
            {trips.map(trip => (
              <li key={trip.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{trip.title}</p>
                  <p className="text-xs text-gray-400">{trip.start_date} ~ {trip.end_date}</p>
                  <p className="text-xs text-gray-300 mt-0.5">
                    생성: {new Date(trip.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleOpen(trip)}
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    열기
                  </button>
                  <button
                    onClick={() => handleDelete(trip)}
                    disabled={deletingId === trip.id}
                    className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === trip.id ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
