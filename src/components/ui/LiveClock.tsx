import { useLanguage } from '../../hooks/useLanguage'
import { useLiveClock } from '../../hooks/useLiveClock'

export function LiveClock() {
  const { lang, t } = useLanguage()
  const time = useLiveClock('America/Monterrey', lang)
  return (
    <time aria-label={t.hero.clockLabel} className="text-blush/80 text-sm">
      {time}
    </time>
  )
}
