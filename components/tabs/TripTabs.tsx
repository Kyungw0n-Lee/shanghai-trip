'use client'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = [
  { id: 'schedule', label: '📅 일정' },
  { id: 'checklist', label: '✅ 체크리스트' },
  { id: 'budget', label: '💰 지출' },
  { id: 'places', label: '📍 장소' },
]

export default function TripTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex border-b bg-white overflow-x-auto">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
