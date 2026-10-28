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
}: {
  client: Client
  className?: string
}) {
  const { l } = useLanguage()
  if (client.mark) {
    return (
      <img
        src={client.mark.src}
        alt={l(client.mark.alt)}
        loading="lazy"
        className={cn(
          'max-tab:max-h-6 max-tab:max-w-[7.5rem] h-auto max-h-8 w-auto max-w-[9.5rem] select-none',
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
