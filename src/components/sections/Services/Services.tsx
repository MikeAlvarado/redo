import { services } from '../../../data/services'
import { CONTACT_EMAIL } from '../../../lib/site'
import { useLanguage } from '../../../hooks/useLanguage'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { MixedHeading } from '../../ui/MixedHeading'
import { ServiceRow } from './ServiceRow'

export function Services() {
  const { t } = useLanguage()
  const headingRef = useRevealOnScroll<HTMLDivElement>({ selector: '[data-reveal]' })

  return (
    <section
      id="services"
      data-section="services"
      className="px-inset-sm nav:px-inset nav:py-32 py-24"
    >
      <div
        ref={headingRef}
        className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center"
      >
        <MixedHeading
          data-reveal
          text={t.services.heading}
          className="text-section leading-[1.02] [text-shadow:0_0_26px_rgba(234,231,224,0.25)]"
        />
        <p data-reveal className="text-cream/60 max-w-md text-lg">
          {t.services.sub}
        </p>
      </div>
      <ul aria-label={t.services.listLabel} className="mx-auto flex max-w-6xl flex-col">
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))}
      </ul>
      <div className="tab:hidden mt-10 flex justify-center">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="rounded-cta bg-cream text-ink px-5 py-2.5 text-sm font-medium"
        >
          {t.services.cta}
        </a>
      </div>
    </section>
  )
}
