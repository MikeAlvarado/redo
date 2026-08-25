import { useLanguage } from '../../hooks/useLanguage'
import { scrollToAnchor } from '../../hooks/useLenis'
import { CONTACT_EMAIL, NAV_OFFSET } from '../../lib/site'

export function Footer() {
  const { t } = useLanguage()
  const links = [
    { id: 'services', label: t.nav.services },
    { id: 'work', label: t.nav.work },
    { id: 'reviews', label: t.nav.reviews },
  ]

  return (
    <footer className="nav:px-10 nav:pb-8 relative px-7 pb-7">
      <div className="mb-6 h-px w-full bg-white/15" />
      <div className="text-blush/80 nav:flex-row nav:justify-between flex flex-col-reverse items-center gap-3 text-sm">
        <p>{t.closing.rights}</p>
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
