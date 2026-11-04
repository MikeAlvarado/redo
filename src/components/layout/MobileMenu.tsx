import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { easeOutExpo, easeOutSoft } from '../../lib/easing'
import { CONTACT_EMAIL } from '../../lib/site'
import { LanguageToggle } from './LanguageToggle'
import { Button } from '../ui/Button'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  onNavigate: (id: string) => void
  links: { id: string; label: string }[]
}

export function MobileMenu({ open, onClose, onNavigate, links }: MobileMenuProps) {
  const { t } = useLanguage()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.45, ease: easeOutExpo }}
          className="nav:hidden overflow-hidden"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: reduced
                ? { duration: 0 }
                : { delay: 0.12, duration: 0.35, ease: easeOutSoft },
            }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15 } }}
            className="flex flex-col pt-7 pb-1.5"
          >
            <ul className="flex flex-col px-1">
              {links.map((link, index) => (
                <li
                  key={link.id}
                  className={index < links.length - 1 ? 'border-b border-white/12' : ''}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => {
                      event.preventDefault()
                      onNavigate(link.id)
                    }}
                    className="text-cream block pt-[18px] pb-[17px] text-lg leading-none font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-cream/50 text-xs">{t.nav.langLabel}</span>
              <LanguageToggle />
            </div>
            <Button href={`mailto:${CONTACT_EMAIL}`} className="mt-4 flex h-10 w-full">
              {t.nav.cta}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
