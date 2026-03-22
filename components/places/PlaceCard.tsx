'use client'

import { useState, useEffect } from 'react'
import { Place, PlaceTag } from '@/types'

interface NaverItem {
  title: string
  link: string
  description: string
}

interface Props {
  place: Place
  canEdit: boolean
  onDelete: (id: string) => void
}

const TAG_COLORS: Record<PlaceTag, string> = {
  '관광지': 'bg-blue-100 text-blue-700',
  '맛집': 'bg-orange-100 text-orange-700',
  '카페': 'bg-yellow-100 text-yellow-700',
  '쇼핑': 'bg-pink-100 text-pink-700',
}

export default function PlaceCard({ place, canEdit, onDelete }: Props) {
  const [naverItems, setNaverItems] = useState<NaverItem[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    fetch(`/api/naver-search?q=${encodeURIComponent(place.name)}`)
      .then(r => r.ok ? r.json() : { items: [] })
      .then(d => setNaverItems(d.items ?? []))
  }, [expanded, place.name])

  async function handleDelete() {
    const res = await fetch(`/api/places/${place.id}`, { method: 'DELETE' })
    if (!res.ok) return
    onDelete(place.id)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[place.tag as PlaceTag] ?? 'bg-gray-100'}`}>
              {place.tag}
            </span>
            <h4 className="font-medium">{place.name}</h4>
          </div>
          {place.address && <p className="text-xs text-gray-400">{place.address}</p>}
          {place.memo && <p className="text-sm text-gray-500 mt-1">{place.memo}</p>}
        </div>
        {canEdit && (
          <button onClick={handleDelete} className="text-red-400 text-xs hover:text-red-600 ml-2">삭제</button>
        )}
      </div>

      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-2 text-xs text-gray-400 hover:text-gray-600"
      >
        {expanded ? '▲ 블로그 후기 닫기' : '▼ 네이버 블로그 후기 보기'}
      </button>

      {expanded && naverItems.length > 0 && (
        <div className="mt-2 space-y-1">
          {naverItems.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
              className="block text-xs text-blue-500 hover:underline truncate"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
          ))}
        </div>
      )}
      {expanded && naverItems.length === 0 && (
        <p className="mt-2 text-xs text-gray-400">검색 결과 없음 (API 키 필요)</p>
      )}
    </div>
  )
}
