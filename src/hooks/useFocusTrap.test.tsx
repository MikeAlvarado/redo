import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useFocusTrap } from './useFocusTrap'

function Dialog({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useFocusTrap(active, ref)
  return (
    <div ref={ref}>
      <button type="button">first</button>
      <button type="button">middle</button>
      <button type="button">last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('moves focus to the first focusable element when activated', () => {
    render(<Dialog active />)
    expect(screen.getByRole('button', { name: 'first' })).toHaveFocus()
  })

  it('wraps Tab from the last element back to the first', () => {
    render(<Dialog active />)
    screen.getByRole('button', { name: 'last' }).focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'first' })).toHaveFocus()
  })

  it('wraps Shift+Tab from the first element to the last', () => {
    render(<Dialog active />)
    screen.getByRole('button', { name: 'first' }).focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'last' })).toHaveFocus()
  })

  it('restores focus to the previously focused element on deactivation', () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()

    const { rerender } = render(<Dialog active={false} />)
    rerender(<Dialog active />)
    expect(outside).not.toHaveFocus()

    rerender(<Dialog active={false} />)
    expect(outside).toHaveFocus()
    outside.remove()
  })

  it('removes its keydown listener on cleanup', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<Dialog active />)
    unmount()
    expect(removeSpy.mock.calls.some(([type]) => type === 'keydown')).toBe(true)
  })
})
