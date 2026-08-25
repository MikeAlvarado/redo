import { marqueeClients } from '../../../data/clients'
import { useLanguage } from '../../../hooks/useLanguage'
import { useMarquee } from '../../../hooks/useMarquee'
import { ClientWordmark } from '../../ui/ClientWordmark'
import { Laurel } from './Laurel'

function LogoRow({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-center gap-20 pr-20">
      {marqueeClients.map((client) => (
        <ClientWordmark key={client.id} client={client} />
      ))}
    </div>
  )
}

export function ClientMarquee() {
  const { t } = useLanguage()
  const { trackRef, isStatic } = useMarquee<HTMLDivElement>()

  return (
    <section className="px-inset-sm nav:flex-row nav:gap-14 nav:px-inset flex flex-col items-center gap-10 py-20">
      <div className="flex shrink-0 items-center gap-3">
        <Laurel />
        <p className="text-cream/90 max-w-40 text-center text-lg">{t.marquee.lockup}</p>
        <Laurel flipped />
      </div>
      {isStatic ? (
        <div
          aria-label={t.marquee.trackLabel}
          className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6"
        >
          {marqueeClients.map((client) => (
            <ClientWordmark key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div
          aria-label={t.marquee.trackLabel}
          className="edge-fade-x w-full min-w-0 flex-1 overflow-hidden"
        >
          <div ref={trackRef} className="animate-marquee flex w-max">
            <LogoRow />
            <LogoRow hidden />
          </div>
        </div>
      )}
    </section>
  )
}
