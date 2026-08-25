import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Pill({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'text-cream/70 inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 text-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}
