import { socialLinks } from '../../data/contact'
import { useLanguage } from '../../hooks/useLanguage'
import { scrollToAnchor } from '../../hooks/useLenis'
import { CONTACT_EMAIL, NAV_OFFSET, SECTION_IDS } from '../../lib/site'

export function Footer() {
  const { t, l } = useLanguage()
  const labels = { services: t.nav.services, work: t.nav.work, reviews: t.nav.reviews }
  const links = SECTION_IDS.map((id) => ({ id, label: labels[id] }))

  return (
    <footer className="nav:px-10 nav:pb-8 relative px-7 pb-7">
      <div className="mb-6 h-px w-full bg-white/15" />
      <ul
        aria-label={t.closing.connectLabel}
        className="text-blush/70 mb-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
      >
        {socialLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blush transition-colors"
            >
              {l(link.label)}
            </a>
          </li>
        ))}
      </ul>
      <div className="mb-6 h-px w-full bg-white/10" />
      <div className="text-blush/80 nav:flex-row nav:justify-between flex flex-col-reverse items-center gap-3 text-sm">
        <p>
          © {new Date().getFullYear()} Mike Alvarado. {t.closing.rights}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label={t.closing.emailLabel}
          className="text-blush after:bg-blush/70 relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-100 after:transition-transform after:duration-300 hover:after:origin-right hover:after:scale-x-0"
        >
          {CONTACT_EMAIL}
        </a>
        <ul className="nav:flex hidden items-center gap-6">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToAnchor(`#${link.id}`, NAV_OFFSET)
                }}
                className="text-blush/70 hover:text-blush transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
