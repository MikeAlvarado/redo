import type { CSSProperties } from 'react'
import type { Client } from '../../data/clients'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../lib/cn'

const FLAIR_CLASSES = {
  serif: 'font-display text-2xl',
  caps: 'text-lg font-bold tracking-[0.22em] uppercase',
  mono: 'font-mono text-lg tracking-tight',
  script: 'font-display text-2xl italic',
} as const

export function ClientWordmark({
  client,
  className,
  loading = 'lazy',
}: {
  client: Client
  className?: string
  // The marquee duplicates its row off-screen; a lazy image there never
  // loads, the clone measures narrower than the original, and the loop
  // overlaps itself. That caller passes 'eager'.
  loading?: 'lazy' | 'eager'
}) {
  const { l } = useLanguage()
  if (client.mark) {
    const ratio = client.mark.width / client.mark.height
    const style: CSSProperties & { '--mark-ratio': number; '--mark-fit': number } = {
      aspectRatio: String(ratio),
      '--mark-ratio': ratio,
      '--mark-fit': client.mark.fit ?? 1,
    }
    // Width is an explicit length (2rem tall, capped at 9.5rem; 1.5rem /
    // 7.5rem below tab) and height follows the aspect ratio, so the image
    // contributes a definite max-content width to the marquee row.
    return (
      <img
        src={client.mark.src}
        alt={l(client.mark.alt)}
        loading={loading}
        style={style}
        className={cn(
          'max-tab:w-[min(7.5rem,1.5rem*var(--mark-ratio))] h-auto w-[min(9.5rem,2rem*var(--mark-ratio))] max-w-full select-none',
          className,
        )}
      />
    )
  }
  return (
    <span
      className={cn('text-cream/45 select-none', FLAIR_CLASSES[client.flair], className)}
    >
      {client.name}
    </span>
  )
}
