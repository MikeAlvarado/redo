import { cn } from '../../../lib/cn'

export function Laurel({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 56"
      className={cn('text-cream/60 h-12 w-5', flipped && '-scale-x-100')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M18 52 C 8 44 4 30 8 12" />
      <path
        d="M8 12 q -6 -2 -7 -8 q 7 0 7 8"
        fill="currentColor"
        stroke="none"
        opacity="0.7"
      />
      <path
        d="M7 22 q -6 -1 -8 -7 q 7 -1 8 7"
        fill="currentColor"
        stroke="none"
        opacity="0.7"
      />
      <path
        d="M8 32 q -7 0 -9 -6 q 7 -2 9 6"
        fill="currentColor"
        stroke="none"
        opacity="0.7"
      />
      <path
        d="M11 41 q -7 1 -10 -4 q 7 -3 10 4"
        fill="currentColor"
        stroke="none"
        opacity="0.7"
      />
      <path
        d="M16 48 q -7 2 -11 -2 q 6 -4 11 2"
        fill="currentColor"
        stroke="none"
        opacity="0.7"
      />
    </svg>
  )
}
