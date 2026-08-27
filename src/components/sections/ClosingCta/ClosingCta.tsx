import { useRef } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { useParallax } from '../../../hooks/useParallax'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { CONTACT_EMAIL } from '../../../lib/site'
import { Footer } from '../../layout/Footer'
import { GrainOverlay } from '../../ui/GrainOverlay'
import { MixedHeading } from '../../ui/MixedHeading'

export function ClosingCta() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  useParallax(sectionRef, backgroundRef, { yPercent: -12, fromScale: 1.08 })
  const contentRef = useRevealOnScroll<HTMLDivElement>({ selector: '[data-reveal]' })

  return (
    <section ref={sectionRef} data-section="closing" className="p-inset-sm nav:p-inset">
      <div className="rounded-shell relative flex min-h-[92svh] flex-col overflow-hidden">
        <div
          ref={backgroundRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -inset-y-[8%] bg-[radial-gradient(70%_80%_at_50%_38%,#E2542C_0%,#A32B14_45%,#4A100A_78%,#1A0503_100%)]"
        >
          <img
            src="/art/closing-statue-960.webp"
            srcSet="/art/closing-statue-640.webp 640w, /art/closing-statue-960.webp 960w"
            sizes="100vw"
            width={960}
            height={641}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply [filter:grayscale(1)_contrast(1.1)_brightness(1.15)]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_30%,rgba(250,104,0,0.4)_0%,transparent_72%)] mix-blend-screen" />
        </div>
        <GrainOverlay className="opacity-[0.07]" />
        <div
          ref={contentRef}
          className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center"
        >
          <p data-reveal className="text-blush/70 text-lg">
            {t.closing.eyebrow}
          </p>
          <MixedHeading
            data-reveal
            text={t.closing.heading}
            className="text-hero text-blush-deep max-w-3xl leading-[1.02] [text-shadow:0_0_34px_rgba(255,212,212,0.3)]"
          />
          <a
            data-reveal
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-cta bg-cream text-ink mt-4 px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.04]"
          >
            {t.closing.cta}
          </a>
        </div>
        <Footer />
      </div>
    </section>
  )
}
