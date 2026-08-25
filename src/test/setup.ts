import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import {
  installIntersectionObserver,
  installMatchMedia,
  installResizeObserver,
  resetDomFakes,
} from './fakes/dom'
import { resetGsapFakes } from './fakes/gsap'
import { resetLenisFakes } from './fakes/lenis'

vi.mock('gsap', async () => {
  const fakes = await import('./fakes/gsap')
  return { default: fakes.default, gsap: fakes.default }
})

vi.mock('gsap/ScrollTrigger', async () => {
  const fakes = await import('./fakes/gsap')
  return { ScrollTrigger: fakes.ScrollTrigger, default: fakes.ScrollTrigger }
})

vi.mock('@gsap/react', async () => {
  const react = await import('react')
  const fakes = await import('./fakes/gsap')
  const useGSAP = (
    callback: () => void | (() => void),
    options?: { dependencies?: unknown[]; scope?: unknown },
  ) => {
    react.useEffect(() => {
      const before = fakes.scrollTriggers.length
      const cleanup = callback()
      return () => {
        cleanup?.()
        fakes.scrollTriggers.slice(before).forEach((trigger) => trigger.kill())
      }
    }, options?.dependencies ?? [])
  }
  return { useGSAP }
})

vi.mock('lenis', async () => {
  const fakes = await import('./fakes/lenis')
  return { default: fakes.FakeLenis }
})

beforeEach(() => {
  installMatchMedia()
  installIntersectionObserver()
  installResizeObserver()
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
  resetDomFakes()
  resetGsapFakes()
  resetLenisFakes()
  window.localStorage.clear()
  vi.restoreAllMocks()
})
