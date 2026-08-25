import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import { warnEmptyQuery } from '../lib/dev'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const DORMANT_OPACITY = 0.18

// Word i starts at time i on a timeline of duration (count - 1 + window) and
// runs for `window` units, so adjacent words overlap by (window - 1) and the
// wipe reads continuous; the last word still lands exactly at progress 1.
export function wordProgress(
  progress: number,
  index: number,
  count: number,
  window = 1.6,
): number {
  if (count <= 0) return 1
  const timeline = count - 1 + window
  return gsap.utils.clamp(0, 1, (progress * timeline - index) / window)
}

export function wordOpacity(
  progress: number,
  index: number,
  count: number,
  window = 1.6,
): number {
  return (
    DORMANT_OPACITY + (1 - DORMANT_OPACITY) * wordProgress(progress, index, count, window)
  )
}

interface WordRevealOptions {
  pinLength?: string
  window?: number
  revision?: unknown
}

export function useWordReveal<T extends HTMLElement>(
  container: RefObject<T | null>,
  { pinLength = '+=180%', window: windowSize = 1.6, revision }: WordRevealOptions = {},
) {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = container.current
      if (!root) return
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', root)
      if (words.length === 0) {
        warnEmptyQuery('useWordReveal', '[data-word]')
        return
      }
      if (reduced) {
        words.forEach((word) => {
          gsap.set(word, { opacity: 1 })
        })
        return
      }
      const setters = words.map(
        (word) => gsap.quickSetter(word, 'opacity') as (value: number) => void,
      )
      words.forEach((word) => {
        gsap.set(word, { opacity: DORMANT_OPACITY })
      })
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: pinLength,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setters.forEach((set, index) =>
            set(wordOpacity(self.progress, index, words.length, windowSize)),
          )
        },
      })
    },
    { dependencies: [reduced, pinLength, windowSize, revision], scope: container },
  )
}
