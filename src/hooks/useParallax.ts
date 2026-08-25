import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface ParallaxOptions {
  yPercent?: number
  fromScale?: number
}

export function useParallax<T extends HTMLElement>(
  trigger: RefObject<HTMLElement | null>,
  target: RefObject<T | null>,
  { yPercent = -12, fromScale = 1.08 }: ParallaxOptions = {},
) {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!trigger.current || !target.current) return
      if (reduced) {
        gsap.set(target.current, { yPercent: 0, scale: 1 })
        return
      }
      gsap.fromTo(
        target.current,
        { yPercent: 0, scale: fromScale },
        {
          yPercent,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { dependencies: [reduced, yPercent, fromScale], scope: trigger },
  )
}
