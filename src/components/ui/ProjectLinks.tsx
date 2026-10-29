import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../data/projects'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../lib/cn'

export function ProjectLinks({
  project,
  className,
  size = 'base',
}: {
  project: Project
  className?: string
  size?: 'base' | 'sm'
}) {
  const { t } = useLanguage()
  const links = project.links
  const entries = [
    { href: links?.live, label: t.showcase.visit },
    { href: links?.site, label: t.showcase.site },
    { href: links?.repo, label: t.showcase.repo },
    { href: links?.caseStudy, label: t.showcase.caseStudy },
  ].filter((entry): entry is { href: string; label: string } => Boolean(entry.href))
  if (entries.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-4', className)}>
      {entries.map((entry) => (
        <li key={entry.label}>
          <a
            href={entry.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'text-cream hover:decoration-cream inline-flex items-center gap-1.5 underline decoration-white/30 underline-offset-4 transition-colors',
              size === 'sm' && 'text-sm',
            )}
          >
            {entry.label}
            <ArrowUpRight size={size === 'sm' ? 14 : 16} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
