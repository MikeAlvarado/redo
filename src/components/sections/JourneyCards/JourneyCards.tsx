import { motion } from 'motion/react'
import { useRef } from 'react'
import { journeyCards } from '../../../data/journey'
import { useCardFan, type DeckTier } from '../../../hooks/useCardFan'
import { useLanguage } from '../../../hooks/useLanguage'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { cn } from '../../../lib/cn'
import { easeOutSoft } from '../../../lib/easing'
import { GrainOverlay } from '../../ui/GrainOverlay'
import { MixedHeading } from '../../ui/MixedHeading'
import { JourneyCard } from './JourneyCard'

export function JourneyCards() {
  const { t } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const row = useMediaQuery('(min-width: 90rem)')
  const tier: DeckTier = row ? 'row' : 'stack'
  const containerRef = useRef<HTMLDivElement | null>(null)
  useCardFan(containerRef, tier)

  return (
    <section data-section="journey" className="overflow-x-clip">
      <div
        ref={containerRef}
        data-deck={tier}
        className={cn(
          'relative',
          row ? 'flex min-h-svh flex-col items-center pt-24' : 'pt-24',
        )}
      >
        <div data-deck-heading className="mb-14 flex justify-center">
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0, filter: 'blur(10px)', y: 16 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: easeOutSoft }}
            >
              <MixedHeading
                text={t.journey.heading}
                brClassName={row ? 'hidden' : undefined}
                className={cn(
                  row ? 'text-[2.5rem]' : 'tab:text-[2.5rem] max-w-2xl text-[2.75rem]',
                  'text-center leading-[1.05] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]',
                )}
              />
            </motion.div>
          </div>
        </div>
        <div
          className={cn(
            'relative w-full [perspective:1400px]',
            row ? 'flex-1' : 'pb-[160px]',
          )}
        >
          {journeyCards.map((card, index) => (
            /* Each stack-tier card needs its OWN sticky containing block:
               sharing one makes every card unstick at the same moment, so the
               last card never got to hold at all. The slot must clear the
               263px offset plus the card's own 402px height before any hold
               is possible, so 880px buys every card an equal ~215px hold. */
            <div key={card.id} className={row ? 'contents' : 'h-[880px]'}>
              <div
                data-deck-card
                className={cn(
                  'mx-auto aspect-[0.733] [transform-style:preserve-3d]',
                  row ? 'absolute inset-x-0 top-1/2' : 'sticky top-[263px] w-[281px]',
                )}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden]">
                  <JourneyCard card={card} className="h-full" />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 [transform:rotateY(180deg)] overflow-hidden rounded-[inherit] [backface-visibility:hidden]"
                  style={{
                    backgroundImage: 'url(/art/deck-back.svg)',
                    backgroundSize: '300% 100%',
                    backgroundPosition: `${index * 50}% 0`,
                  }}
                >
                  <GrainOverlay className="opacity-[0.06]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
