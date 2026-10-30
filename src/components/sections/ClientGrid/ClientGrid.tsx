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
            className="rounded-tile bg-surface nav:basis-[calc(16.666%-0.625rem)] nav:h-20 tab:h-16 tab:basis-[calc(25%-0.5625rem)] flex h-14 basis-[calc(33.333%-0.5rem)] items-center justify-center border border-white/5 px-4"
          >
            <ClientWordmark
              client={client}
              // One fit box for every tile (7rem wide, at most 2.75rem tall;
              // 4.5rem / 2rem below tab) so the marks share the same air on
              // both sides instead of the wide ones filling the tile. Heavy
              // marks scale down by their `fit` in clients.ts.
              className="max-tab:w-[min(4.5rem*var(--mark-fit),2rem*var(--mark-fit)*var(--mark-ratio))] max-tab:text-sm w-[min(7rem*var(--mark-fit),2.75rem*var(--mark-fit)*var(--mark-ratio))] opacity-60 transition-opacity duration-300 hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
