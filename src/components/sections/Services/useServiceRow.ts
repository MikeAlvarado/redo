import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { warnEmptyQuery } from '../../../lib/dev'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useServiceRow<T extends HTMLElement>() {
  const rowRef = useRef<T | null>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const row = rowRef.current
      if (!row || reduced) return
      const trigger = { trigger: row, start: 'top 85%', once: true } as const
      const divider = row.querySelector('[data-divider]')
      if (divider) {
        gsap.from(divider, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { ...trigger },
        })
      }
      const revealTargets = gsap.utils.toArray('[data-reveal]', row)
      if (revealTargets.length === 0) {
        warnEmptyQuery('useServiceRow', '[data-reveal]')
        return
      }
      gsap.from(revealTargets, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { ...trigger },
      })
      const thumb = row.querySelector('[data-thumb]')
      if (thumb) {
        gsap.from(thumb, {
          scale: 0.96,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { ...trigger },
        })
      }
    },
    { dependencies: [reduced], scope: rowRef },
  )

  return rowRef
}
