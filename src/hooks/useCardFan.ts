import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import { warnEmptyQuery } from '../lib/dev'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Replicates redomedia.co's journey deck per breakpoint tier, from the
// 2026-08-26 measurements in reference/tokens.md (innerWidth asserted at
// 1500, 1200 and 430). Two tiers, two mechanisms, both scroll-scrubbed:
//
// STACK (<1440): the section is NOT pinned. Each card sits in a ~595px flow
// slot and sticks (CSS position: sticky) at 263px from the viewport top, so
// later cards slide over earlier ones into a covered pile that scrolls away
// whole. While a card approaches its stop it eases from an over-rotated
// entry to its settle tilt; the first card also fades in.
//
// ROW (>=1440): a pinned viewport block. The three card backs start joined
// as one landscape at scale 1.2, shrink until 32px gaps open, hold, then
// flip (rotateY 180 -> 0) while tilting to -15/0/+10 and pulling in.

export type DeckTier = 'stack' | 'row'

export const STACK_SETTLE_ROT = [-4, 4, -4] as const
export const STACK_OVER_ROT = [-5, 6, -16] as const

export const ROW_CARD_WIDTH = 334
export const ROW_GAP = 32
export const ROW_START_SCALE = 1.2
export const ROW_SETTLE_ROT = [-15, 0, 10] as const
// Measured settle centers sit ~335px apart (the fan pulls in from the
// gapped row's 366px spacing while it flips).
export const ROW_SETTLE_SPACING = 335
// Measured 12px. While joined the reference rounds only the outer corners
// (left card reports '12px 0px 0px 12px') so the three panels read as one
// rectangle with no notches at the seams.
export const ROW_RADIUS = 12
// Per-card slice is ~22.3% of the container (334px at the 1500 measurement,
// ~470px at Mike's ~2000px viewport), clamped so 1440 never dips below 300.
const ROW_WIDTH_FRACTION = 0.223
const ROW_MIN_CARD_WIDTH = 300
const ROW_MAX_CARD_WIDTH = 470
const ROW_SHRINK_END = 0.32
const ROW_FLIP_START = 0.45
const ROW_FLIP_END = 0.82
const ROW_FLIP_STAGGER = 0.05

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t: number) => gsap.utils.clamp(0, 1, t)

// approach: 0 = far below its sticky stop, 1 = stuck. Measured easing runs
// over the last ~500px of travel (start 'top 85%' -> end 'top 263px').
export function stackCardEntry(approach: number, index: number) {
  const eased = easeOut(clamp01(approach))
  const settle = STACK_SETTLE_ROT[index % STACK_SETTLE_ROT.length] ?? 0
  const over = STACK_OVER_ROT[index % STACK_OVER_ROT.length] ?? 0
  return {
    rotation: settle + (1 - eased) * over,
    opacity: index === 0 ? eased : 1,
  }
}

// progress: 0..1 across the row tier's 280% pin. Spacings scale with cardW so
// the responsive card width keeps the measured 334px geometry proportional.
export function rowCardState(progress: number, index: number, cardW = ROW_CARD_WIDTH) {
  // Linear in scroll (measured): with the gapped-slot clamp below, linear
  // shrink reopens the 32px gaps at ~p0.17, matching the reference's ~p0.18.
  const shrink = clamp01(progress / ROW_SHRINK_END)
  const scale = ROW_START_SCALE + (1 - ROW_START_SCALE) * shrink
  // Joined while the scaled cards are wider than their gapped slots; the 32px
  // gaps open on their own as the shrink passes that width.
  const gappedSpacing = Math.max(cardW * scale, cardW + ROW_GAP)
  const flip = clamp01(
    (progress - ROW_FLIP_START - index * ROW_FLIP_STAGGER) /
      (ROW_FLIP_END - ROW_FLIP_START),
  )
  const flipEased = easeOut(flip)
  const settleSpacing = cardW * (ROW_SETTLE_SPACING / ROW_CARD_WIDTH)
  const spacing = gappedSpacing + (settleSpacing - gappedSpacing) * flipEased
  return {
    x: (index - 1) * spacing,
    scale,
    rotationY: 180 - flipEased * 180,
    rotation: (ROW_SETTLE_ROT[index % ROW_SETTLE_ROT.length] ?? 0) * flipEased,
  }
}

// Corner radius follows the flip: outer-only while the panels are joined,
// interpolating to a uniform radius as each card turns and separates.
// Returned in CSS shorthand order: top-left top-right bottom-right bottom-left.
export function rowCardRadius(progress: number, index: number, radius = ROW_RADIUS) {
  const flip = clamp01(
    (progress - ROW_FLIP_START - index * ROW_FLIP_STAGGER) /
      (ROW_FLIP_END - ROW_FLIP_START),
  )
  const inner = radius * easeOut(flip)
  const left = index === 0 ? radius : inner
  const right = index === 2 ? radius : inner
  return `${left}px ${right}px ${right}px ${left}px`
}

// Heading fades in early in the row tier (absent at pin start on the
// reference, fully present by ~a fifth of the pin).
export function rowHeadingOpacity(progress: number) {
  return easeOut(clamp01((progress - 0.03) / 0.15))
}

export function useCardFan<T extends HTMLElement>(
  container: RefObject<T | null>,
  tier: DeckTier,
) {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = container.current
      if (!root) return
      const cards = gsap.utils.toArray<HTMLElement>('[data-deck-card]', root)
      if (cards.length === 0) {
        warnEmptyQuery('useCardFan', '[data-deck-card]')
        return
      }
      const heading = root.querySelector<HTMLElement>('[data-deck-heading]')

      if (tier === 'stack') {
        cards.forEach((card, index) => {
          gsap.set(card, { zIndex: index + 1, borderRadius: `${ROW_RADIUS}px` })
          if (reduced) {
            const settled = stackCardEntry(1, index)
            gsap.set(card, { rotation: settled.rotation, opacity: 1 })
            return
          }
          const apply = (approach: number) => {
            const state = stackCardEntry(approach, index)
            gsap.set(card, { rotation: state.rotation, opacity: state.opacity })
          }
          const trigger = ScrollTrigger.create({
            trigger: card.parentElement ?? card,
            start: 'top 85%',
            end: 'top 263px',
            scrub: true,
            onUpdate: (self) => apply(self.progress),
          })
          apply(trigger.progress)
        })
        return
      }

      let cardW = ROW_CARD_WIDTH
      const measure = () => {
        cardW = gsap.utils.clamp(
          ROW_MIN_CARD_WIDTH,
          ROW_MAX_CARD_WIDTH,
          root.clientWidth * ROW_WIDTH_FRACTION,
        )
        cards.forEach((card) => {
          gsap.set(card, { width: cardW })
        })
      }
      measure()

      cards.forEach((card, index) => {
        gsap.set(card, { zIndex: index + 1, transformPerspective: 1200, yPercent: -50 })
      })

      const applyProgress = (progress: number) => {
        cards.forEach((card, index) => {
          const state = rowCardState(progress, index, cardW)
          gsap.set(card, {
            x: state.x,
            scale: state.scale,
            rotationY: state.rotationY,
            rotation: state.rotation,
            borderRadius: rowCardRadius(progress, index),
          })
        })
        if (heading) gsap.set(heading, { opacity: rowHeadingOpacity(progress) })
      }

      if (reduced) {
        applyProgress(1)
        return
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: true,
        onRefreshInit: () => measure(),
        onUpdate: (self) => applyProgress(self.progress),
      })
      applyProgress(trigger.progress)
    },
    { dependencies: [reduced, tier], scope: container },
  )
}
