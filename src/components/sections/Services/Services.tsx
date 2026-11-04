import { services } from '../../../data/services'
import { CONTACT_EMAIL } from '../../../lib/site'
import { useLanguage } from '../../../hooks/useLanguage'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { Button } from '../../ui/Button'
import { SectionHeading } from '../../ui/SectionHeading'
import { ServiceRow } from './ServiceRow'

export function Services() {
  const { t } = useLanguage()
  const headingRef = useRevealOnScroll<HTMLDivElement>({ selector: '[data-reveal]' })

  return (
    <section
      id="about"
      data-section="services"
      className="px-inset-sm nav:px-inset nav:py-32 py-24"
    >
      <SectionHeading
        ref={headingRef}
        reveal
        text={t.services.heading}
        sub={t.services.sub}
        subClassName="max-w-md"
        className="mb-16"
      />
      <ul aria-label={t.services.listLabel} className="mx-auto flex max-w-6xl flex-col">
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))}
      </ul>
      <div className="tab:mt-24 mt-10 flex justify-center">
        <Button href={`mailto:${CONTACT_EMAIL}`}>{t.services.cta}</Button>
      </div>
    </section>
  )
}
