import { useLanguage } from '../../../hooks/useLanguage'
import { SectionHeading } from '../../ui/SectionHeading'
import { LanyardBadge } from '../../yc/LanyardBadge'

// Since 2026-10-30 the contact card is the 3D lanyard badge (the one /yc
// uses); the contact links live in the closing card and the footer.
export function Founders() {
  const { t } = useLanguage()

  return (
    <section
      id="founders"
      data-section="founders"
      aria-label={t.founders.regionLabel}
      className="px-inset-sm nav:px-inset nav:py-32 overflow-x-clip py-24"
    >
      <SectionHeading
        text={t.founders.heading}
        sub={t.founders.sub}
        headingClassName="leading-[1.05]"
        className="pointer-events-none relative z-10 mb-4"
      />
      <div className="-mx-inset-sm nav:-mx-inset">
        <LanyardBadge />
      </div>
    </section>
  )
}
