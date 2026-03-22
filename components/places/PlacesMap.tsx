'use client'

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Place } from '@/types'

interface Props {
  places: Place[]
  onMarkerClick?: (place: Place) => void
}

const SHANGHAI_CENTER = { lat: 31.2304, lng: 121.4737 }
const LIBRARIES: ('places')[] = ['places']

export default function PlacesMap({ places, onMarkerClick }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: LIBRARIES,
  })

  if (!isLoaded) return <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">지도 로딩 중... (API 키 필요)</div>

  return (
    <GoogleMap
      mapContainerClassName="w-full h-64 rounded-2xl overflow-hidden"
      center={SHANGHAI_CENTER}
      zoom={13}
    >
      {places.filter(p => p.lat && p.lng).map(place => (
        <Marker
          key={place.id}
          position={{ lat: place.lat!, lng: place.lng! }}
          title={place.name}
          onClick={() => onMarkerClick?.(place)}
        />
      ))}
    </GoogleMap>
  )
}
