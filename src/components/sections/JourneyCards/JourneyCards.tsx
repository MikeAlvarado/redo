import { motion } from 'motion/react'
import { useRef } from 'react'
import { journeyCards } from '../../../data/journey'
import { useCardFan } from '../../../hooks/useCardFan'
import { useLanguage } from '../../../hooks/useLanguage'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { easeOutSoft, hoverSpring } from '../../../lib/easing'
import { MixedHeading } from '../../ui/MixedHeading'
import { JourneyCard } from './JourneyCard'

const BACK_STEP = 366

export function JourneyCards() {
  const { t } = useLanguage()
  const isFan = useMediaQuery('(min-width: 90rem)')
  const reduced = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  useCardFan(containerRef, { mode: isFan ? 'fan' : 'stack' })

  return (
    <section data-section="journey" className="overflow-x-clip">
      <div
        ref={containerRef}
        className="deck:justify-start deck:pt-28 relative flex min-h-svh flex-col items-center gap-10 px-6 pt-24 pb-10"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, filter: 'blur(10px)', y: 16 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: easeOutSoft }}
        >
          <MixedHeading
            text={t.journey.heading}
            brClassName="deck:hidden"
            className="text-section deck:text-[2.5rem] max-w-2xl text-center leading-[1.05] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]"
          />
        </motion.div>
        <div
          className="relative w-full flex-1 [perspective:1400px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="deck:flex deck:items-start deck:justify-center deck:gap-8 relative h-full w-full">
            {journeyCards.map((card, index) => (
              <div
                key={card.id}
                data-deck-card
                className="deck:static deck:inset-auto deck:mx-0 deck:aspect-[0.72] deck:w-[334px] absolute inset-x-0 top-6 mx-auto aspect-[0.733] w-[min(320px,72vw)] [transform-style:preserve-3d]"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={hoverSpring}
                  className="h-full [transform-style:preserve-3d]"
                >
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <JourneyCard card={card} className="h-full" />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 [transform:rotateY(180deg)] overflow-hidden rounded-[10px] [backface-visibility:hidden]"
                    style={{
                      backgroundImage: 'url(/art/deck-back.svg)',
                      backgroundSize: '1066px 464px',
                      backgroundPosition: `${-index * BACK_STEP}px 0`,
                    }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
