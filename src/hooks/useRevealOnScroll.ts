import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { warnEmptyQuery } from '../lib/dev'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface RevealOptions {
  y?: number
  stagger?: number | ((index: number) => number)
  selector?: string
  start?: string
}

export function useRevealOnScroll<T extends HTMLElement>({
  y = 28,
  stagger = 0.12,
  selector,
  start = 'top 85%',
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root || reduced) return
      const targets = selector ? gsap.utils.toArray<HTMLElement>(selector, root) : [root]
      if (targets.length === 0) {
        warnEmptyQuery('useRevealOnScroll', selector ?? '(root)')
        return
      }
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger,
        scrollTrigger: { trigger: root, start, once: true },
      })
    },
    { dependencies: [reduced, y, stagger, selector, start], scope: ref },
  )

  return ref
}
