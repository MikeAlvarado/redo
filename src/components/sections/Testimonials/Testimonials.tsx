import Autoplay from 'embla-carousel-autoplay'
import { useMemo } from 'react'
import { testimonials } from '../../../data/testimonials'
import { cn } from '../../../lib/cn'
import { useCarousel } from '../../../hooks/useCarousel'
import { useLanguage } from '../../../hooks/useLanguage'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { ArrowButton } from '../../ui/ArrowButton'
import { DotGrid } from '../../ui/DotGrid'
import { DotsPagination } from '../../ui/DotsPagination'
import { MixedHeading } from '../../ui/MixedHeading'

export function Testimonials() {
  const { t, l } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const headingRef = useRevealOnScroll<HTMLDivElement>({ selector: '[data-reveal]' })
  const plugins = useMemo(
    () =>
      reduced
        ? []
        : [
            Autoplay({
              delay: 6000,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              stopOnInteraction: false,
            }),
          ],
    [reduced],
  )
  const { viewportRef, selectedIndex, scrollTo, scrollPrev, scrollNext } = useCarousel(
    { loop: true, align: 'center' },
    plugins,
  )

  return (
    <section
      id="reviews"
      data-section="reviews"
      aria-label={t.testimonials.regionLabel}
      className="px-inset-sm nav:px-inset nav:py-32 py-24"
    >
      <div
        ref={headingRef}
        className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center"
      >
        <MixedHeading
          data-reveal
          text={t.testimonials.heading}
          className="text-section leading-[1.02] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]"
        />
        <p data-reveal className="text-cream/60 text-lg">
          {t.testimonials.sub}
        </p>
      </div>

      <div className="relative">
        <div
          ref={viewportRef}
          className="deck:max-w-none mx-auto max-w-6xl overflow-hidden"
        >
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.id}
                className={cn(
                  'rounded-shell deck:mx-4 deck:flex-[0_0_72%] relative min-w-0 flex-[0_0_100%] overflow-hidden border border-white/5 bg-[#101010] transition-opacity duration-500',
                  index !== selectedIndex && 'deck:opacity-40',
                )}
              >
                <DotGrid className="opacity-60" />
                <div className="tab:flex-row tab:gap-12 tab:p-10 relative flex flex-col gap-6 p-6">
                  <div className="tab:hidden flex items-center gap-4">
                    <img
                      src={testimonial.portrait}
                      alt={l(testimonial.portraitAlt)}
                      width={400}
                      height={400}
                      loading="lazy"
                      className="rounded-tile aspect-square w-20 object-cover"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-cream font-medium">{testimonial.name}</span>
                      <span className="text-cream/55 text-sm">
                        {l(testimonial.role)} @ {testimonial.company}
                      </span>
                    </div>
                  </div>
                  <img
                    src={testimonial.portrait}
                    alt={l(testimonial.portraitAlt)}
                    width={400}
                    height={400}
                    loading="lazy"
                    className="rounded-tile tab:block hidden aspect-square w-72 shrink-0 object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <blockquote className="text-cream tab:text-xl text-base leading-relaxed">
                      {l(testimonial.quote)}
                    </blockquote>
                    <figcaption className="tab:justify-between mt-auto flex items-end justify-start gap-6 pt-10">
                      <div className="tab:flex hidden flex-col gap-0.5">
                        <span className="text-cream font-medium">{testimonial.name}</span>
                        <span className="text-cream/55 text-sm">
                          {l(testimonial.role)} @ {testimonial.company}
                        </span>
                      </div>
                      <span className="font-display text-cream/30 text-2xl italic">
                        {testimonial.company}
                      </span>
                    </figcaption>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
        <div className="deck:flex pointer-events-none absolute inset-y-0 right-[6%] left-[6%] hidden items-center justify-between">
          <ArrowButton
            direction="prev"
            label={t.testimonials.prev}
            onClick={scrollPrev}
            className="pointer-events-auto"
          />
          <ArrowButton
            direction="next"
            label={t.testimonials.next}
            onClick={scrollNext}
            className="pointer-events-auto"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <DotsPagination
          count={testimonials.length}
          selected={selectedIndex}
          onSelect={scrollTo}
          label={t.testimonials.paginationLabel}
          itemLabel={t.testimonials.goTo}
        />
      </div>
    </section>
  )
}
