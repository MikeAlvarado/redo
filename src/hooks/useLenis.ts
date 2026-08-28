import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

let activeLenis: Lenis | null = null

export function scrollToAnchor(target: string, offset = 0) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset })
    return
  }
  const el = document.querySelector(target)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export function pauseLenis() {
  activeLenis?.stop()
}

export function resumeLenis(scrollY?: number) {
  activeLenis?.start()
  if (scrollY !== undefined) {
    activeLenis?.scrollTo(scrollY, { immediate: true, force: true })
  }
}

export function useLenis() {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const lenis = new Lenis({ lerp: 0.1 })
      activeLenis = lenis
      const update = () => ScrollTrigger.update()
      lenis.on('scroll', update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      return () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        activeLenis = null
      }
    },
    { dependencies: [reduced] },
  )
}
