import type { Client } from '../../data/clients'
import { cn } from '../../lib/cn'

const FLAIR_CLASSES = {
  serif: 'font-display text-2xl',
  caps: 'text-lg font-bold tracking-[0.22em] uppercase',
  mono: 'font-mono text-lg tracking-tight lowercase',
  script: 'font-display text-2xl italic',
} as const

export function ClientWordmark({
  client,
  className,
}: {
  client: Client
  className?: string
}) {
  return (
    <span
      className={cn('text-cream/45 select-none', FLAIR_CLASSES[client.flair], className)}
    >
      {client.name}
    </span>
  )
}
