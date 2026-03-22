'use client'

import { useState, useEffect, useCallback } from 'react'

export interface RecentTrip {
  id: string
  title: string
  start_date: string
  end_date: string
  visited_at: number
}

const STORAGE_KEY = 'recent_trips'
const MAX_TRIPS = 10

function readFromStorage(): RecentTrip[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(trips: RecentTrip[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  } catch {
    // localStorage may be unavailable
  }
}

export function useRecentTrips() {
  const [trips, setTrips] = useState<RecentTrip[]>([])

  useEffect(() => {
    setTrips(readFromStorage())
  }, [])

  const addRecentTrip = useCallback((trip: Omit<RecentTrip, 'visited_at'>) => {
    const updated = [
      { ...trip, visited_at: Date.now() },
      ...readFromStorage().filter(t => t.id !== trip.id),
    ].slice(0, MAX_TRIPS)
    writeToStorage(updated)
    setTrips(updated)
  }, [])

  const removeRecentTrip = useCallback((id: string) => {
    const updated = readFromStorage().filter(t => t.id !== id)
    writeToStorage(updated)
    setTrips(updated)
  }, [])

  return { trips, addRecentTrip, removeRecentTrip }
}
