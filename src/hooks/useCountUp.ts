import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { padStat } from '../lib/format'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface CountUpOptions {
  digits?: number
  duration?: number
}

export function useCountUp<T extends HTMLElement>(
  value: number,
  { digits = 2, duration = 1.4 }: CountUpOptions = {},
) {
  const ref = useRef<T | null>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (reduced) {
        el.textContent = padStat(value, digits)
        return
      }
      const counter = { current: 0 }
      el.textContent = padStat(0, digits)
      gsap.to(counter, {
        current: value,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = padStat(counter.current, digits)
        },
      })
    },
    { dependencies: [reduced, value, digits, duration], scope: ref },
  )

  return ref
}
