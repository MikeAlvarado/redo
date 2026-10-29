import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { groupStat, padStat } from '../lib/format'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface CountUpOptions {
  digits?: number
  group?: boolean
  duration?: number
}

export function useCountUp<T extends HTMLElement>(
  value: number,
  { digits = 2, group = false, duration = 1.4 }: CountUpOptions = {},
) {
  const ref = useRef<T | null>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const format = (current: number) =>
        group ? groupStat(current) : padStat(current, digits)
      if (reduced) {
        el.textContent = format(value)
        return
      }
      const counter = { current: 0 }
      el.textContent = format(0)
      gsap.to(counter, {
        current: value,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = format(counter.current)
        },
      })
    },
    { dependencies: [reduced, value, digits, group, duration], scope: ref },
  )

  return ref
}
