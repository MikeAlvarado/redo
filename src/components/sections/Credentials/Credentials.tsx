import { ArrowUpRight } from 'lucide-react'
import { credentials } from '../../../data/credentials'
import { useLanguage } from '../../../hooks/useLanguage'
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import { cn } from '../../../lib/cn'

export function Credentials() {
  const { t, l } = useLanguage()
  const listRef = useRevealOnScroll<HTMLUListElement>()

  return (
    <section
      data-section="credentials"
      aria-label={t.credentials.regionLabel}
      className="px-inset-sm nav:px-inset py-12"
    >
      {/* Inline-block items in a centred run of text, so the list wraps
          between items like words; each item carries its own trailing
          divider, so no line ever starts with one. */}
      <div className="mx-auto max-w-5xl">
        <ul ref={listRef} className="text-cream/60 text-center text-sm leading-[2.2]">
          {credentials.map((credential, index) => (
            <li
              key={credential.id}
              className={cn(
                'inline-block whitespace-nowrap',
                index < credentials.length - 1 &&
                  "after:mx-4 after:text-white/20 after:content-['|']",
              )}
            >
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
