import { clients } from '../../../data/clients'
import { useLanguage } from '../../../hooks/useLanguage'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { ClientWordmark } from '../../ui/ClientWordmark'

const COLUMNS = 6

export function ClientGrid() {
  const { t } = useLanguage()
  const headingRef = useRevealOnScroll<HTMLHeadingElement>()
  const gridRef = useRevealOnScroll<HTMLUListElement>({
    selector: '[data-tile]',
    stagger: (index) => 0.07 * ((index % COLUMNS) + Math.floor(index / COLUMNS)),
    y: 20,
  })

  return (
    <section data-section="grid" className="px-inset-sm nav:px-inset nav:py-32 py-24">
      <div ref={headingRef} className="tab:max-w-md mx-auto mb-10 max-w-xs text-center">
        <h2 className="text-cream/55 tab:text-base text-sm leading-relaxed">
          {t.clients.heading}
        </h2>
      </div>
      <ul
        ref={gridRef}
        aria-label={t.clients.gridLabel}
        className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3"
      >
        {clients.map((client) => (
          <li
            key={client.id}
            data-tile
            className="rounded-tile bg-surface nav:basis-[calc(16.666%-0.625rem)] nav:h-20 tab:h-16 tab:basis-[calc(25%-0.5625rem)] flex h-14 basis-[calc(33.333%-0.5rem)] items-center justify-center border border-white/5"
          >
            <ClientWordmark
              client={client}
              className="text-cream/45 hover:text-cream/90 max-tab:text-sm transition-opacity duration-300"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
