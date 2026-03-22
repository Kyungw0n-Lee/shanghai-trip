import { describe, it, expect } from 'vitest'
import { cnyToKrw, formatKrw } from '@/lib/exchange-rate'

describe('exchange-rate', () => {
  it('cnyToKrw converts using rate', () => {
    const result = cnyToKrw(100, 190)
    expect(result).toBe(19000)
  })

  it('formatKrw formats number as Korean won', () => {
    expect(formatKrw(19000)).toBe('₩19,000')
  })
})
