import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface ScrollProgressOptions {
  start?: string
  end?: string
  onUpdate?: (progress: number) => void
}

export function useScrollProgress<T extends HTMLElement>(
  target: RefObject<T | null>,
  { start = 'top bottom', end = 'bottom top', onUpdate }: ScrollProgressOptions = {},
) {
  const progressRef = useRef(0)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useGSAP(
    () => {
      if (!target.current) return
      ScrollTrigger.create({
        trigger: target.current,
        start,
        end,
        onUpdate: (self) => {
          progressRef.current = self.progress
          onUpdateRef.current?.(self.progress)
        },
      })
    },
    { dependencies: [start, end], scope: target },
  )

  return progressRef
}
