import { cn } from '../../lib/cn'

interface DotsPaginationProps {
  count: number
  selected: number
  onSelect: (index: number) => void
  label: string
  itemLabel: string
}

export function DotsPagination({
  count,
  selected,
  onSelect,
  label,
  itemLabel,
}: DotsPaginationProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={selected === index}
          aria-label={`${itemLabel} ${index + 1}`}
          onClick={() => onSelect(index)}
          className={cn(
            'size-2 rounded-full transition-colors',
            selected === index ? 'bg-cream' : 'bg-white/25 hover:bg-white/50',
          )}
        />
      ))}
    </div>
  )
}
