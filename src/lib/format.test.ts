import { describe, expect, it } from 'vitest'
import { formatClock, padStat } from './format'

describe('formatClock', () => {
  it('renders h:mm AM/PM in the requested timezone', () => {
    const date = new Date('2026-08-24T18:05:00Z')
    expect(formatClock(date, 'America/Monterrey', 'en')).toBe('12:05 PM')
  })

  it('respects the locale', () => {
    const date = new Date('2026-08-24T18:05:00Z')
    expect(formatClock(date, 'America/Monterrey', 'es').toLowerCase()).toContain('12:05')
  })
})

describe('padStat', () => {
  it('pads to the requested width', () => {
    expect(padStat(6, 2)).toBe('06')
    expect(padStat(24, 2)).toBe('24')
    expect(padStat(3.6, 2)).toBe('04')
  })
})
