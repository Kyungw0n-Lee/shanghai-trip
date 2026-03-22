'use client'

import { useState, useEffect } from 'react'
import { Place, PlaceTag } from '@/types'
import PlaceSearch from './PlaceSearch'
import PlacesMap from './PlacesMap'
import PlaceCard from './PlaceCard'

interface Props {
  tripId: string
  canEdit: boolean
}

const TAGS: PlaceTag[] = ['관광지', '맛집', '카페', '쇼핑']

export default function PlacesTab({ tripId, canEdit }: Props) {
  const [places, setPlaces] = useState<Place[]>([])
  const [activeTag, setActiveTag] = useState<PlaceTag | 'all'>('all')
  const [pendingPlace, setPendingPlace] = useState<Partial<Place> | null>(null)
  const [selectedTag, setSelectedTag] = useState<PlaceTag>('관광지')

  useEffect(() => {
    fetch(`/api/places?trip_id=${tripId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setPlaces)
  }, [tripId])

  const filtered = activeTag === 'all' ? places : places.filter(p => p.tag === activeTag)

  async function handleSavePlace() {
    if (!pendingPlace) return
    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pendingPlace, trip_id: tripId, tag: selectedTag }),
    })
    if (!res.ok) return
    const place = await res.json()
    setPlaces(prev => [...prev, place])
    setPendingPlace(null)
  }

  return (
    <div className="p-4 space-y-4">
      {canEdit && (
        <div className="space-y-3">
          <PlaceSearch
            onPlaceSelect={p => setPendingPlace(p)}
          />
          {pendingPlace && (
            <div className="bg-blue-50 rounded-xl p-3 space-y-2">
              <p className="text-sm font-medium">{pendingPlace.name}</p>
              <p className="text-xs text-gray-500">{pendingPlace.address}</p>
              <div className="flex gap-2 flex-wrap">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs ${selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPendingPlace(null)} className="flex-1 border rounded-lg py-2 text-sm">취소</button>
                <button onClick={handleSavePlace} className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm">저장</button>
              </div>
            </div>
          )}
        </div>
      )}

      <PlacesMap places={places} />

      {/* 태그 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTag('all')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTag === 'all' ? 'bg-gray-800 text-white' : 'bg-white border'}`}
        >
          전체 ({places.length})
        </button>
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTag === tag ? 'bg-gray-800 text-white' : 'bg-white border'}`}
          >
            {tag} ({places.filter(p => p.tag === tag).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(place => (
          <PlaceCard
            key={place.id}
            place={place}
            canEdit={canEdit}
            onDelete={id => setPlaces(prev => prev.filter(p => p.id !== id))}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            {canEdit ? '위에서 장소를 검색해 추가하세요' : '저장된 장소가 없습니다'}
          </p>
        )}
      </div>
    </div>
  )
}
