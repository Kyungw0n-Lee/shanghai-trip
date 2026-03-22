'use client'

import { useState, useEffect } from 'react'

export function useEditMode(tripId: string) {
  const [canEdit, setCanEdit] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(`edit_${tripId}`)
    if (stored === 'true') setCanEdit(true)
  }, [tripId])

  function requestEdit() {
    if (canEdit) return
    setShowModal(true)
  }

  function grantEdit() {
    sessionStorage.setItem(`edit_${tripId}`, 'true')
    setCanEdit(true)
    setShowModal(false)
  }

  return { canEdit, showModal, setShowModal, requestEdit, grantEdit }
}
