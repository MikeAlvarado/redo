import { AnimatePresence, motion } from 'motion/react'
import type { KeyboardEvent } from 'react'
import { useCarousel } from '../../../hooks/useCarousel'
import { useLanguage } from '../../../hooks/useLanguage'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { cn } from '../../../lib/cn'
import { ArrowButton } from '../../ui/ArrowButton'
import { MixedHeading } from '../../ui/MixedHeading'
import { Pill } from '../../ui/Pill'
import { ProjectOverlay } from '../ProjectOverlay'
import { useGhostZoom } from './useGhostZoom'
import { useShowcaseSlides } from './useShowcaseSlides'

// Below `tab:` the slides lay out as a plain vertical list, so the carousel
// deactivates. Expressed in rem, not px, so it tracks --breakpoint-tab
// (50.625rem) through browser zoom — if JS and CSS ever disagreed here, a click
// would scroll a carousel the reader cannot see.
const STACKED_QUERY = '(max-width: 50.624rem)'

export function Showcase() {
  const { t, l } = useLanguage()
  const headingRef = useRevealOnScroll<HTMLDivElement>({ selector: '[data-reveal]' })
  const ghostRef = useGhostZoom<HTMLDivElement>()
  const { slides, activeProject, openProject, closeProject } = useShowcaseSlides()
  const stacked = useMediaQuery(STACKED_QUERY)
  const { viewportRef, selectedIndex, scrollTo, scrollPrev, scrollNext } = useCarousel({
    loop: true,
    align: 'center',
    breakpoints: { [STACKED_QUERY]: { active: false } },
  })
  const active = slides[selectedIndex]

  const isPeeking = (index: number) => !stacked && index !== selectedIndex

  const onArrowKeys = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  return (
    <section id="work" data-section="work" className="nav:py-32 overflow-x-clip py-24">
      <div
        ref={headingRef}
        className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 px-6 text-center"
      >
        <div ref={ghostRef}>
          <MixedHeading
            text={t.showcase.heading}
            className="text-section leading-[1.02] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]"
          />
        </div>
        <p data-reveal className="text-cream/60 text-lg">
          {t.showcase.sub}
        </p>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.showcase.carouselLabel}
        className="relative"
      >
        <div ref={viewportRef} className="tab:overflow-hidden">
          <div className="tab:flex-row tab:gap-0 tab:px-0 flex touch-pan-y flex-col gap-12 px-4">
            {slides.map((project, index) => (
              <div
                key={project.id}
                className="tab:min-w-0 tab:flex-[0_0_44%] tab:px-4 w-full"
              >
                <button
                  type="button"
                  onClick={() =>
                    isPeeking(index) ? scrollTo(index) : openProject(project.slug)
                  }
                  onKeyDown={onArrowKeys}
                  aria-label={`${
                    isPeeking(index) ? t.showcase.goToSlide : t.showcase.openProject
                  }: ${l(project.title)}`}
                  className={cn(
                    'block w-full text-left transition-[opacity,transform] duration-500',
                    index !== selectedIndex && 'tab:scale-[0.94] tab:opacity-30',
                  )}
                >
                  <motion.img
                    layoutId={`cover-${project.slug}`}
                    src={project.cover.src}
                    alt={l(project.coverAlt)}
                    width={project.cover.width}
                    height={project.cover.height}
                    loading="lazy"
                    className="rounded-tile aspect-[3/2] w-full object-cover"
                  />
                  <span className="tab:hidden mt-4 flex flex-col gap-3">
                    <span className="flex flex-col gap-1">
                      <span className="text-cream/55 text-xs tracking-[0.16em] uppercase">
                        {l(project.category)}
                      </span>
                      <span className="text-cream text-lg leading-snug">
                        {l(project.title)}
                      </span>
                    </span>
                    <span className="flex flex-wrap gap-2">
                      {project.categories.map((category) => (
                        <Pill key={category.en}>{l(category)}</Pill>
                      ))}
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="tab:flex pointer-events-none absolute inset-y-0 right-[16%] left-[16%] hidden items-center justify-between">
          <ArrowButton
            direction="prev"
            label={t.showcase.prev}
            onClick={scrollPrev}
            onKeyDown={onArrowKeys}
            className="pointer-events-auto"
          />
          <ArrowButton
            direction="next"
            label={t.showcase.next}
            onClick={scrollNext}
            onKeyDown={onArrowKeys}
            className="pointer-events-auto"
          />
        </div>
      </div>

      <div className="tab:flex mt-8 hidden min-h-24 flex-col items-center gap-4 px-6">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-cream/55 text-xs tracking-[0.16em] uppercase">
                {l(active.category)}
              </span>
              <h3 className="text-cream text-xl">{l(active.title)}</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {active.categories.map((category) => (
                  <Pill key={category.en}>{l(category)}</Pill>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProjectOverlay project={activeProject} onClose={closeProject} />
    </section>
  )
}
