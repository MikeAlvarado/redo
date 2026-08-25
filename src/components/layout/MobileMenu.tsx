import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLanguage } from '../../hooks/useLanguage'
import { LanguageToggle } from './LanguageToggle'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  onNavigate: (id: string) => void
  links: { id: string; label: string }[]
}

export function MobileMenu({ open, onClose, onNavigate, links }: MobileMenuProps) {
  const { t } = useLanguage()
  const panelRef = useRef<HTMLDivElement | null>(null)
  useBodyScrollLock(open)
  useFocusTrap(open, panelRef)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.navLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-ink/95 fixed inset-0 z-50 flex flex-col px-6 py-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-cream text-2xl italic">
              {t.nav.wordmark}
            </span>
            <button
              type="button"
              aria-label={t.nav.closeMenu}
              onClick={onClose}
              className="rounded-cta text-cream flex size-10 items-center justify-center border border-white/15"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <ul className="flex flex-1 flex-col items-center justify-center gap-8">
            {links.map((link, index) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.07, duration: 0.4 }}
              >
                <a
                  href={`#${link.id}`}
                  onClick={(event) => {
                    event.preventDefault()
                    onNavigate(link.id)
                  }}
                  className="font-display text-cream text-4xl"
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="flex items-center justify-center pb-6">
            <LanguageToggle />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
