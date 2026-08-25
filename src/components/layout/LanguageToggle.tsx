import { useLanguage } from '../../hooks/useLanguage'
import type { Locale } from '../../i18n/types'
import { cn } from '../../lib/cn'

const LOCALES: Locale[] = ['en', 'es']

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t.nav.langLabel}
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-white/15 p-0.5 text-xs',
        className,
      )}
    >
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-current={lang === locale ? 'true' : undefined}
          onClick={() => setLang(locale)}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            lang === locale ? 'bg-cream text-ink' : 'text-cream/60 hover:text-cream',
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
