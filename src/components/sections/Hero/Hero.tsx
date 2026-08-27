import { motion } from 'motion/react'
import { useRef } from 'react'
import { easeOutExpo, easeOutSoft } from '../../../lib/easing'
import { useHeroRecede } from '../../../hooks/useHeroRecede'
import { useLanguage } from '../../../hooks/useLanguage'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { GrainOverlay } from '../../ui/GrainOverlay'
import { LiveClock } from '../../ui/LiveClock'

function RevealWords({ text, startAt }: { text: string; startAt: number }) {
  const reduced = usePrefersReducedMotion()
  return (
    <span className="block">
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block whitespace-pre"
          initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.7,
            delay: 0.2 + (startAt + index) * 0.06,
            ease: easeOutSoft,
          }}
        >
          {word}
          {' '}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero() {
  const { t } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const wordsInLine1 = t.hero.line1.split(' ').length
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  useHeroRecede(sectionRef, cardRef)

  return (
    <section
      ref={sectionRef}
      id="top"
      data-section="hero"
      className="p-inset-sm nav:p-inset"
    >
      <div
        ref={cardRef}
        className="rounded-shell nav:h-[calc(100svh-4.5rem)] relative flex h-[calc(100svh-2rem)] flex-col overflow-hidden"
      >
        <motion.div
          aria-hidden
          className="hero-gradient pointer-events-none absolute inset-0"
          initial={reduced ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: easeOutExpo }}
        >
          <img
            src="/art/hero-hands-960.webp"
            srcSet="/art/hero-hands-640.webp 640w, /art/hero-hands-960.webp 960w"
            sizes="100vw"
            width={960}
            height={575}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply [filter:grayscale(1)_contrast(1.1)_brightness(1.15)]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(48%_42%_at_50%_12%,rgba(250,104,0,0.5)_0%,transparent_72%)] mix-blend-screen" />
        </motion.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_8%,transparent_35%,rgba(0,0,0,0.55)_100%)]"
        />
        <GrainOverlay className="opacity-[0.07]" />
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-hero text-blush leading-[1.04] [text-shadow:0_0_30px_rgba(255,224,224,0.35)]">
            <RevealWords text={t.hero.line1} startAt={0} />
            <RevealWords text={t.hero.line2} startAt={wordsInLine1} />
          </h1>
          <motion.p
            className="text-blush/85 mt-4 text-lg"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: easeOutSoft }}
          >
            {t.hero.sub}
          </motion.p>
        </div>
        <div className="text-blush/75 nav:px-9 relative flex items-center justify-between px-6 pb-6 text-sm">
          <LiveClock />
          <motion.span
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {t.hero.scroll}
          </motion.span>
          <span>{t.hero.location}</span>
        </div>
      </div>
    </section>
  )
}
