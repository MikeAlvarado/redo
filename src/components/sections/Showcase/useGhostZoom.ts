import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useGhostZoom<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || reduced) return
      gsap.fromTo(
        el,
        { scale: 2.7, opacity: 0, yPercent: 26 },
        {
          scale: 1,
          opacity: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 108%',
            end: 'top 18%',
            scrub: true,
          },
        },
      )
    },
    { dependencies: [reduced], scope: ref },
  )

  return ref
}
