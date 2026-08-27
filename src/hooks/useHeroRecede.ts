import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// The reference pins its hero with position:sticky and, on top of that,
// scales the card down as the next section rises over it. Measured from the
// reference's own capture: the card loses ~55px of width on a ~1900px card
// between scroll 0 and one viewport down, so it settles at ~0.97.
export const HERO_END_SCALE = 0.97

export function useHeroRecede<T extends HTMLElement>(
  section: RefObject<HTMLElement | null>,
  card: RefObject<T | null>,
  { endScale = HERO_END_SCALE }: { endScale?: number } = {},
) {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!section.current || !card.current) return
      if (reduced) {
        gsap.set(card.current, { scale: 1 })
        return
      }
      gsap.fromTo(
        card.current,
        { scale: 1 },
        {
          scale: endScale,
          ease: 'none',
          scrollTrigger: {
            // The hero is pinned with position:sticky, so its own rect never
            // advances and element-relative start/end would never progress.
            // A numeric range keys the recede to one viewport of scroll.
            trigger: section.current,
            start: 0,
            end: () => window.innerHeight,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { dependencies: [reduced, endScale], scope: section },
  )
}
