import { motion } from 'motion/react'
import { founders } from '../../../data/founders'
import { useLanguage } from '../../../hooks/useLanguage'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { cn } from '../../../lib/cn'
import { easeOutSoft, hoverSpring } from '../../../lib/easing'
import { MixedHeading } from '../../ui/MixedHeading'
import { FounderCard } from './FounderCard'

// Tilt/overlap measured on the live site: -6deg / +4deg, cards overlapping
// ~24px vertically on mobile and ~16px horizontally on desktop.
const TILTS = [-6, 4, -5]

export function Founders() {
  const { t } = useLanguage()
  const reduced = usePrefersReducedMotion()

  return (
    <section
      id="founders"
      data-section="founders"
      aria-label={t.founders.regionLabel}
      className="px-inset-sm nav:px-inset nav:py-32 overflow-x-clip py-24"
    >
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center">
        <MixedHeading
          text={t.founders.heading}
          className="text-section leading-[1.05] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]"
        />
        <p className="text-cream/60 text-lg">{t.founders.sub}</p>
      </div>
      <div className="tab:flex-row tab:items-start tab:justify-center flex flex-col items-center">
        {founders.map((founder, index) => (
          <motion.div
            key={founder.id}
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: easeOutSoft }}
            whileHover={{ y: -6, transition: hoverSpring }}
            className={cn(index > 0 && 'tab:-mt-0 tab:-ml-4 -mt-6', 'shrink-0')}
            style={{ rotate: TILTS[index % TILTS.length], zIndex: index + 1 }}
          >
            <FounderCard founder={founder} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
