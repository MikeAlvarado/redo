import { createElement, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: 'span' | 'p' | 'dt'
}

// Small tracked uppercase label in cream/55: project category, stat source,
// overlay kicker. Reads at 12px with 0.16em tracking everywhere.
export function Eyebrow({ as = 'span', className, ...rest }: EyebrowProps) {
  return createElement(as, {
    ...rest,
    className: cn('text-cream/55 text-xs tracking-[0.16em] uppercase', className),
  })
}
