import { useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLanguage } from '../../hooks/useLanguage'
import { scrollToAnchor } from '../../hooks/useLenis'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { cn } from '../../lib/cn'
import { CONTACT_EMAIL, NAV_OFFSET, SECTION_IDS } from '../../lib/site'
import { LanguageToggle } from './LanguageToggle'
import { MobileMenu } from './MobileMenu'
import { Button } from '../ui/Button'

export function Nav() {
  const { t } = useLanguage()
  const active = useScrollSpy(SECTION_IDS)
  const scrolled = useScrolledPast()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  useFocusTrap(menuOpen, navRef)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  const labels = {
    tech: t.nav.tech,
    about: t.nav.about,
    work: t.nav.work,
    reviews: t.nav.reviews,
  }
  const links = SECTION_IDS.map((id) => ({ id, label: labels[id] }))

  const goTo = (id: string) => {
    scrollToAnchor(`#${id}`, NAV_OFFSET)
  }

  return (
    <header className="inset-x-inset-sm nav:inset-x-inset nav:top-6 fixed top-4 z-50">
      <nav
        ref={navRef}
        aria-label={t.nav.navLabel}
        className={cn(
          'rounded-nav nav:px-6 mx-auto flex w-full flex-col border border-white/10 px-4 py-2.5 backdrop-blur-xl transition-[max-width,background-color] duration-500 ease-out',
          scrolled ? 'max-w-[62.5rem] bg-black/45' : 'max-w-[120rem] bg-black/20',
        )}
      >
        <div className="flex items-center">
          <div className="flex flex-1 items-center">
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault()
                scrollToAnchor('body', 0)
              }}
              className="font-display text-cream relative after:absolute after:content-[''] text-2xl italic after:-inset-x-2 after:-inset-y-1.5"
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
            <Button href={`mailto:${CONTACT_EMAIL}`} className="nav:inline-flex hidden px-4 py-2">
              {t.nav.cta}
            </Button>
            <button
              type="button"
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((wasOpen) => !wasOpen)}
              className="nav:hidden text-cream relative flex size-9 items-center justify-center rounded-full border border-white/12 after:absolute after:-inset-1 after:content-['']"
            >
              {menuOpen ? (
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              ) : (
                <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="currentColor">
                  <circle cx="10" cy="4.5" r="1.6" />
                  <circle cx="15.5" cy="10" r="1.6" />
                  <circle cx="10" cy="15.5" r="1.6" />
                  <circle cx="4.5" cy="10" r="1.6" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={(id) => {
            setMenuOpen(false)
            goTo(id)
          }}
          links={links}
        />
      </nav>
    </header>
  )
}
