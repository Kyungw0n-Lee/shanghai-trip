'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Trip } from '@/types'
import TripTabs from '@/components/tabs/TripTabs'
import ShareButton from '@/components/ui/ShareButton'
import PasswordModal from '@/components/ui/PasswordModal'
import { useEditMode } from '@/hooks/useEditMode'
import ScheduleTab from '@/components/schedule/ScheduleTab'

// 탭 컴포넌트는 이후 Task에서 구현 (임시 placeholder)
function PlaceholderTab({ name }: { name: string }) {
  return <div className="p-6 text-gray-400 text-center">{name} 탭 준비 중...</div>
}

export default function TripPage() {
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [activeTab, setActiveTab] = useState('schedule')
  const { canEdit, showModal, setShowModal, requestEdit, grantEdit } = useEditMode(id)

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then(r => r.json())
      .then(setTrip)
  }, [id])

  if (!trip) return <div className="flex items-center justify-center min-h-screen">불러오는 중...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">{trip.title}</h1>
          <p className="text-sm text-gray-500">
            {trip.start_date} ~ {trip.end_date}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          {!canEdit && (
            <button
              onClick={requestEdit}
              className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
            >
              편집
            </button>
          )}
          {canEdit && (
            <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm">편집 중</span>
          )}
        </div>
      </header>

      {/* 탭 */}
      <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'schedule' && trip && (
          <ScheduleTab
            tripId={id}
            startDate={trip.start_date}
            endDate={trip.end_date}
            canEdit={canEdit}
          />
        )}
        {activeTab === 'checklist' && <PlaceholderTab name="체크리스트" />}
        {activeTab === 'budget' && <PlaceholderTab name="지출" />}
        {activeTab === 'places' && <PlaceholderTab name="장소" />}
      </div>

      {/* 비밀번호 모달 */}
      {showModal && (
        <PasswordModal
          tripId={id}
          onSuccess={grantEdit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
