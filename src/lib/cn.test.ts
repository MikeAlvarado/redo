import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges conditional classes and resolves tailwind conflicts', () => {
    expect(cn('p-2', false, 'p-4')).toBe('p-4')
    expect(cn('text-cream', { hidden: false }, ['flex'])).toBe('text-cream flex')
  })
})
