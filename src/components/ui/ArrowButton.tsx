import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'

import type { KeyboardEventHandler } from 'react'

interface ArrowButtonProps {
  direction: 'prev' | 'next'
  label: string
  onClick: () => void
  onKeyDown?: KeyboardEventHandler
  className?: string
}

export function ArrowButton({
  direction,
  label,
  onClick,
  onKeyDown,
  className,
}: ArrowButtonProps) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'bg-ink/40 text-cream hover:bg-cream hover:text-ink flex size-12 items-center justify-center rounded-full border border-white/25 backdrop-blur-sm transition-colors',
        className,
      )}
    >
      <Icon size={20} aria-hidden />
    </button>
  )
}
