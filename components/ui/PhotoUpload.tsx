'use client'

import { useState, useRef, useEffect } from 'react'
import { Photo } from '@/types'
import Image from 'next/image'

interface Props {
  tripId: string
  refType: 'place' | 'schedule_item' | 'checklist_item'
  refId: string
  canEdit: boolean
}

export default function PhotoUpload({ tripId, refType, refId, canEdit }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/photos?ref_id=${refId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setPhotos)
  }, [refId])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('trip_id', tripId)
    formData.append('ref_type', refType)
    formData.append('ref_id', refId)

    const res = await fetch('/api/photos', { method: 'POST', body: formData })
    if (res.ok) {
      const photo = await res.json()
      setPhotos(prev => [...prev, photo])
    }
    setUploading(false)
    // Reset input so same file can be re-uploaded
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {photos.map(photo => (
          <div key={photo.id} className="relative w-20 h-20 rounded-xl overflow-hidden">
            <Image src={photo.storage_url} alt={photo.caption ?? ''} fill className="object-cover" />
            {canEdit && (
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {canEdit && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 disabled:opacity-50"
          >
            {uploading ? '...' : '📷'}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  )
}
