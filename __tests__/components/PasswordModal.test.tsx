import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PasswordModal from '@/components/ui/PasswordModal'

describe('PasswordModal', () => {
  it('renders when open', () => {
    render(<PasswordModal tripId="trip-1" onSuccess={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('편집 모드 잠금 해제')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()
    render(<PasswordModal tripId="trip-1" onSuccess={vi.fn()} onClose={onClose} />)
    fireEvent.click(screen.getByText('취소'))
    expect(onClose).toHaveBeenCalled()
  })
})
