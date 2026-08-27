import { Sparkles, TrendingUp } from 'lucide-react'
import type { JourneyCard as JourneyCardData } from '../../../data/journey'
import { useLanguage } from '../../../hooks/useLanguage'
import { cn } from '../../../lib/cn'
import { GrainOverlay } from '../../ui/GrainOverlay'

function OrbitIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 28 28"
      className="size-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="9" cy="8" r="3.4" />
      <circle cx="19.5" cy="12.5" r="3.4" />
      <circle cx="10.5" cy="19.5" r="3.4" />
    </svg>
  )
}

const ICONS = {
  trend: <TrendingUp aria-hidden className="size-7" strokeWidth={1.6} />,
  orbit: <OrbitIcon />,
  spark: <Sparkles aria-hidden className="size-7" strokeWidth={1.6} />,
} as const

const TONE_CLASSES = {
  silver:
    'bg-[linear-gradient(160deg,#EFEFED_0%,#D8D8D5_55%,#BEBEBA_100%)] text-[#1c1c1c]',
  red: 'bg-[radial-gradient(120%_120%_at_20%_0%,#E8391D_0%,#C21507_55%,#7A1108_100%)] text-blush',
  charcoal: 'bg-[linear-gradient(160deg,#222222_0%,#161616_60%,#101010_100%)] text-cream',
} as const

const TONE_MUTED = {
  silver: 'text-[#1c1c1c]/65',
  red: 'text-blush/80',
  charcoal: 'text-cream/60',
} as const

export function JourneyCard({
  card,
  className,
}: {
  card: JourneyCardData
  className?: string
}) {
  const { l } = useLanguage()
  return (
    <article
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-[inherit] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.55)]',
        TONE_CLASSES[card.tone],
        className,
      )}
    >
      <GrainOverlay />
      <div className={TONE_MUTED[card.tone]}>{ICONS[card.icon]}</div>
      <h3 className="text-[2rem] leading-[1.1] tracking-tight">
        {l(card.title)
          .split('\n')
          .map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
      </h3>
      <p className={cn('text-sm leading-relaxed', TONE_MUTED[card.tone])}>
        {l(card.body)}
      </p>
    </article>
  )
}
