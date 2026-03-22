import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth'

describe('auth', () => {
  it('hashPassword returns a bcrypt hash', async () => {
    const hash = await hashPassword('test123')
    expect(hash).toMatch(/^\$2[ab]\$/)
  })

  it('verifyPassword returns true for correct password', async () => {
    const hash = await hashPassword('mypassword')
    const result = await verifyPassword('mypassword', hash)
    expect(result).toBe(true)
  })

  it('verifyPassword returns false for wrong password', async () => {
    const hash = await hashPassword('mypassword')
    const result = await verifyPassword('wrongpassword', hash)
    expect(result).toBe(false)
  })
})
