import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import { warnEmptyQuery } from '../lib/dev'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export type DeckMode = 'stack' | 'fan'

// Settled staircase measured on the live site at 430/1240: cards ~307x419,
// tilts -4/+4/-4, card 1 tucked almost behind card 2, card 3 ~38% lower.
export const STACK_SETTLE = [
  { rotation: -4, xPercent: -3, yPercent: 0 },
  { rotation: 4, xPercent: 4, yPercent: 2 },
  { rotation: -4, xPercent: -1, yPercent: 38 },
] as const

// Settled fan measured at 1440: three 334x464 cards in a row, -15/0/+10,
// center card stacked on top, 32px gaps closed while the backs are joined.
export const FAN_ROTATIONS = [-15, 0, 10] as const
export const FAN_Z = [1, 3, 2] as const
const FAN_GAP = 32

// Card 0 sits settled when the pin starts (observed live at p=0); cards 1..n-1
// each own segment [i-1, i - 1 + 1.4) of a timeline of duration (count-2+1.4),
// flying up from below while over-rotated (~ -20deg observed live).
export function stackCardState(progress: number, index: number, count: number) {
  const window = 1.4
  const timeline = Math.max(count - 2, 0) + window
  const raw =
    index === 0 ? 1 : gsap.utils.clamp(0, 1, (progress * timeline - (index - 1)) / window)
  const eased = 1 - Math.pow(1 - raw, 3)
  const settle = STACK_SETTLE[index % STACK_SETTLE.length] ?? STACK_SETTLE[0]
  return {
    yPercent: settle.yPercent + (1 - eased) * 130,
    xPercent: settle.xPercent * eased,
    rotation: settle.rotation + (1 - eased) * (settle.rotation >= 0 ? 16 : -16),
    opacity: raw > 0.01 || index === 0 ? 1 : 0,
  }
}

// Fan phases measured against live pin frames: the joined backs read as one
// wide landscape until ~0.22 of the pin, the side cards split outward, every
// card flips over (rotateY 180 -> 0, slightly staggered), then tilts into the
// settled fan.
export function fanCardState(progress: number, index: number) {
  const split = gsap.utils.clamp(0, 1, (progress - 0.22) / 0.18)
  const splitEased = 1 - Math.pow(1 - split, 2)
  const flipStart = 0.28 + index * 0.08
  const flip = gsap.utils.clamp(0, 1, (progress - flipStart) / 0.24)
  const flipEased = 1 - Math.pow(1 - flip, 2)
  const tilt = gsap.utils.clamp(0, 1, (progress - 0.5) / 0.35)
  const tiltEased = 1 - Math.pow(1 - tilt, 3)
  return {
    x: (1 - splitEased) * (1 - index) * FAN_GAP,
    rotationY: 180 - flipEased * 180,
    rotation: (FAN_ROTATIONS[index % FAN_ROTATIONS.length] ?? 0) * tiltEased,
  }
}

interface CardFanOptions {
  mode?: DeckMode
  pinLength?: string
}

export function useCardFan<T extends HTMLElement>(
  container: RefObject<T | null>,
  { mode = 'stack', pinLength }: CardFanOptions = {},
) {
  const reduced = usePrefersReducedMotion()
  const resolvedPin = pinLength ?? (mode === 'fan' ? '+=240%' : '+=135%')

  useGSAP(
    () => {
      const root = container.current
      if (!root) return
      const cards = gsap.utils.toArray<HTMLElement>('[data-deck-card]', root)
      if (cards.length === 0) {
        warnEmptyQuery('useCardFan', '[data-deck-card]')
        return
      }

      const applySettled = () => {
        cards.forEach((card, index) => {
          if (mode === 'fan') {
            gsap.set(card, {
              rotationY: 0,
              rotation: FAN_ROTATIONS[index % FAN_ROTATIONS.length] ?? 0,
              xPercent: 0,
              yPercent: 0,
              opacity: 1,
              zIndex: FAN_Z[index % FAN_Z.length] ?? 1,
            })
          } else {
            const settle = STACK_SETTLE[index % STACK_SETTLE.length] ?? STACK_SETTLE[0]
            gsap.set(card, {
              rotationY: 0,
              rotation: settle.rotation,
              xPercent: settle.xPercent,
              yPercent: settle.yPercent,
              opacity: 1,
              zIndex: index + 1,
            })
          }
        })
      }

      if (reduced) {
        applySettled()
        return
      }

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: mode === 'fan' ? (FAN_Z[index % FAN_Z.length] ?? 1) : index + 1,
          transformPerspective: 1400,
        })
      })

      const applyProgress = (progress: number) => {
        cards.forEach((card, index) => {
          if (mode === 'fan') {
            const state = fanCardState(progress, index)
            gsap.set(card, {
              x: state.x,
              rotationY: state.rotationY,
              rotation: state.rotation,
              xPercent: 0,
              yPercent: 0,
              opacity: 1,
            })
          } else {
            const state = stackCardState(progress, index, cards.length)
            gsap.set(card, {
              x: 0,
              rotationY: 0,
              yPercent: state.yPercent,
              xPercent: state.xPercent,
              rotation: state.rotation,
              opacity: state.opacity,
            })
          }
        })
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: resolvedPin,
        pin: true,
        scrub: true,
        onUpdate: (self) => applyProgress(self.progress),
      })
      applyProgress(trigger.progress)
    },
    { dependencies: [reduced, mode, resolvedPin], scope: container },
  )
}
