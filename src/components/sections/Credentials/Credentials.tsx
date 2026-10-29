import { ArrowUpRight } from 'lucide-react'
import { credentials } from '../../../data/credentials'
import { useLanguage } from '../../../hooks/useLanguage'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'

export function Credentials() {
  const { t, l } = useLanguage()
  const listRef = useRevealOnScroll<HTMLUListElement>()

  return (
    <section
      data-section="credentials"
      aria-label={t.credentials.regionLabel}
      className="px-inset-sm nav:px-inset py-12"
    >
      {/* The row is shifted 1px left inside a clipping wrapper so the divider
          on whichever item starts a wrapped line falls outside and disappears;
          only the dividers between items on the same line survive. */}
      <div className="mx-auto max-w-5xl overflow-hidden">
        <ul
          ref={listRef}
          className="text-cream/60 -ml-px flex flex-wrap items-center gap-y-3 text-sm"
        >
          {credentials.map((credential) => (
            <li key={credential.id} className="border-l border-white/15 px-5 leading-snug">
              {credential.href ? (
                <a
                  href={credential.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cream inline-flex items-center gap-1 transition-colors"
                >
                  {l(credential.label)}
                  <ArrowUpRight size={13} aria-hidden />
                </a>
              ) : (
                l(credential.label)
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
