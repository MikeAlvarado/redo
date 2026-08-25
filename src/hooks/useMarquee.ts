import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useMarquee<T extends HTMLElement>() {
  const trackRef = useRef<T | null>(null)
  const isStatic = usePrefersReducedMotion()

  useEffect(() => {
    const track = trackRef.current
    if (!track || isStatic) return
    const pause = () => {
      track.style.animationPlayState = 'paused'
    }
    const resume = () => {
      track.style.animationPlayState = 'running'
    }
    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)
    track.addEventListener('focusin', pause)
    track.addEventListener('focusout', resume)
    return () => {
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
      track.removeEventListener('focusin', pause)
      track.removeEventListener('focusout', resume)
    }
  }, [isStatic])

  return { trackRef, isStatic }
}
