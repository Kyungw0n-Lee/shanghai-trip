'use client'

import { useRef } from 'react'
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'

interface Props {
  onPlaceSelect: (place: {
    name: string
    address: string
    lat: number
    lng: number
    google_place_id: string
  }) => void
}

const LIBRARIES: ('places')[] = ['places']

export default function PlaceSearch({ onPlaceSelect }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: LIBRARIES,
  })

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null)

  function handlePlacesChanged() {
    const places = searchBoxRef.current?.getPlaces()
    if (!places || places.length === 0) return
    const place = places[0]
    if (!place.geometry?.location) return

    onPlaceSelect({
      name: place.name ?? '',
      address: place.formatted_address ?? '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      google_place_id: place.place_id ?? '',
    })
  }

  if (!isLoaded) return <div className="w-full border rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50">Google Maps 로딩 중... (API 키 필요)</div>

  return (
    <StandaloneSearchBox
      onLoad={ref => { searchBoxRef.current = ref }}
      onPlacesChanged={handlePlacesChanged}
    >
      <input
        type="text"
        placeholder="장소 검색 (예: 외탄, 예원)"
        className="w-full border rounded-xl px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </StandaloneSearchBox>
  )
}
