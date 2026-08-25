import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { scrollToAnchor } from '../../hooks/useLenis'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { cn } from '../../lib/cn'
import { CONTACT_EMAIL, NAV_OFFSET, SECTION_IDS } from '../../lib/site'
import { LanguageToggle } from './LanguageToggle'
import { MobileMenu } from './MobileMenu'

export function Nav() {
  const { t } = useLanguage()
  const active = useScrollSpy(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { id: 'services', label: t.nav.services },
    { id: 'work', label: t.nav.work },
    { id: 'reviews', label: t.nav.reviews },
  ]

  const goTo = (id: string) => {
    scrollToAnchor(`#${id}`, NAV_OFFSET)
  }

  return (
    <header className="inset-x-inset-sm nav:inset-x-inset nav:top-6 fixed top-4 z-50">
      <nav
        aria-label={t.nav.navLabel}
        className="rounded-nav nav:px-6 flex items-center border border-white/10 bg-black/45 px-4 py-2.5 backdrop-blur-xl"
      >
        <div className="flex flex-1 items-center">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault()
              scrollToAnchor('body', 0)
            }}
            className="font-display text-cream text-2xl italic"
          >
            {t.nav.wordmark}
          </a>
        </div>
        <ul className="nav:flex hidden items-center gap-9">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  goTo(link.id)
                }}
                className={cn(
                  'text-sm transition-colors',
                  active === link.id ? 'text-cream' : 'text-cream/60 hover:text-cream',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-1 items-center justify-end gap-3">
          <LanguageToggle className="nav:flex hidden" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-cta bg-cream text-ink nav:inline-flex hidden px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.03]"
          >
            {t.nav.cta}
          </a>
          <button
            type="button"
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="nav:hidden text-cream flex size-9 items-center justify-center rounded-full border border-white/12"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <circle cx="10" cy="4.5" r="1.6" />
              <circle cx="15.5" cy="10" r="1.6" />
              <circle cx="10" cy="15.5" r="1.6" />
              <circle cx="4.5" cy="10" r="1.6" />
            </svg>
          </button>
        </div>
      </nav>
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(id) => {
          setMenuOpen(false)
          goTo(id)
        }}
        links={links}
      />
    </header>
  )
}
