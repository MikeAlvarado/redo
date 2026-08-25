import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { useMarquee } from './useMarquee'

const REDUCE = '(prefers-reduced-motion: reduce)'

function Marquee() {
  const { trackRef, isStatic } = useMarquee<HTMLDivElement>()
  return (
    <div ref={trackRef} data-testid="track" data-static={isStatic}>
      logos
    </div>
  )
}

describe('useMarquee', () => {
  it('pauses on hover and resumes on leave', () => {
    render(<Marquee />)
    const track = screen.getByTestId('track')

    fireEvent.mouseEnter(track)
    expect(track.style.animationPlayState).toBe('paused')

    fireEvent.mouseLeave(track)
    expect(track.style.animationPlayState).toBe('running')
  })

  it('pauses while any child holds focus', () => {
    render(<Marquee />)
    const track = screen.getByTestId('track')
    fireEvent.focusIn(track)
    expect(track.style.animationPlayState).toBe('paused')
  })

  it('reports static under reduced motion and attaches no listeners', () => {
    setMediaQuery(REDUCE, true)
    render(<Marquee />)
    const track = screen.getByTestId('track')
    expect(track.dataset.static).toBe('true')
    fireEvent.mouseEnter(track)
    expect(track.style.animationPlayState).toBe('')
  })
})
