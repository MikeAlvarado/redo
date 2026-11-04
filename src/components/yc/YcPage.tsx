import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { socialLinks } from '../../data/contact'
import { useLanguage } from '../../hooks/useLanguage'
import { useLanguageFade } from '../../hooks/useLanguageFade'
import { useLenis } from '../../hooks/useLenis'
import { CONTACT_EMAIL } from '../../lib/site'
import { LanguageToggle } from '../layout/LanguageToggle'
import { ScrollStatement } from '../sections/ScrollStatement'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { GrainOverlay } from '../ui/GrainOverlay'
import { LanyardBadge } from './LanyardBadge'

const YC_COMPANY_URL = 'https://www.ycombinator.com/companies/kodda'

// Alternative landing at /yc, after the one-page "we are backed by YC"
// pages: a lanyard badge you can drag and flip, one statement that reveals
// on scroll, three facts and the same contact CTA. The home page is untouched.
export function YcPage() {
  useLenis()
  const { t } = useLanguage()
  const fadeRef = useRef<HTMLDivElement | null>(null)
  useLanguageFade(fadeRef)

  const facts = [
    { label: t.yc.batchLabel, value: t.yc.batchValue },
    { label: t.yc.foundedLabel, value: t.yc.foundedValue },
    { label: t.yc.companyLabel, value: 'Kodda', href: YC_COMPANY_URL },
  ]

  return (
    <div ref={fadeRef} data-page="yc">
      <GrainOverlay className="fixed inset-0 z-40 opacity-[0.035]" />
      <header className="inset-x-inset-sm nav:inset-x-inset nav:top-6 fixed top-4 z-50">
        <nav
          aria-label={t.nav.navLabel}
          className="rounded-nav nav:px-6 mx-auto flex w-full max-w-[62.5rem] items-center border border-white/10 bg-black/35 px-4 py-2.5 backdrop-blur-xl"
        >
          <a href="/" className="font-display text-cream flex-1 text-2xl italic">
            {t.nav.wordmark}
          </a>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button href={`mailto:${CONTACT_EMAIL}`} className="px-4 py-2">
              {t.nav.cta}
            </Button>
          </div>
        </nav>
      </header>

      <main className="bg-ink flex flex-col">
        <section
          data-section="yc-badge"
          className="px-inset-sm nav:px-inset relative flex min-h-svh flex-col items-center justify-start gap-4 overflow-x-clip pb-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(242,102,37,0.28)_0%,transparent_70%)]" />
          <h1 className="sr-only">{t.yc.title}</h1>
          <LanyardBadge />
          <p className="text-cream/65 font-mono text-xs tracking-[0.12em]">{t.yc.hint}</p>
        </section>

        <ScrollStatement text={t.yc.statement} />

        <section
          data-section="yc-facts"
          className="px-inset-sm nav:px-inset nav:py-32 flex flex-col items-center gap-12 py-24"
        >
          <p className="text-cream/70 max-w-2xl text-center text-xl leading-relaxed text-pretty">
            {t.yc.body}
          </p>
          <dl className="tab:flex-row tab:gap-16 flex flex-col items-center gap-8 text-center">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col items-center gap-2">
                <Eyebrow as="dt">{fact.label}</Eyebrow>
                <dd className="text-cream text-2xl">
                  {fact.href ? (
                    <a
                      href={fact.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blush inline-flex items-center gap-1 transition-colors"
                    >
                      {fact.value}
                      <ArrowUpRight size={18} aria-hidden />
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <Button href={`mailto:${CONTACT_EMAIL}`}>{t.yc.cta}</Button>
          <p className="text-cream/65 text-sm">{t.yc.madeIn}</p>
        </section>

        <footer className="nav:px-10 px-7 pb-8">
          <div className="mb-6 h-px w-full bg-white/15" />
          <div className="text-cream/70 nav:flex-row nav:justify-between flex flex-col-reverse items-center gap-4 text-sm">
            <p>
              © {new Date().getFullYear()} Mike Alvarado. {t.closing.rights}
            </p>
            <ul aria-label={t.closing.connectLabel} className="flex flex-wrap items-center gap-5">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-cream transition-colors"
                  >
                    {link.label.en}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </main>
    </div>
  )
}
