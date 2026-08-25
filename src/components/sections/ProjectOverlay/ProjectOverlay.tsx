import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { Project } from '../../../data/projects'
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock'
import { useFocusTrap } from '../../../hooks/useFocusTrap'
import { useLanguage } from '../../../hooks/useLanguage'
import { Pill } from '../../ui/Pill'

interface ProjectOverlayProps {
  project: Project | null
  onClose: () => void
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const { t, l } = useLanguage()
  const panelRef = useRef<HTMLDivElement | null>(null)
  useBodyScrollLock(project !== null)
  useFocusTrap(project !== null, panelRef)

  useEffect(() => {
    if (!project) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [project, onClose])

  const links = project?.links
  const linkEntries = [
    { href: links?.live, label: t.showcase.visit },
    { href: links?.repo, label: t.showcase.repo },
    { href: links?.caseStudy, label: t.showcase.caseStudy },
  ].filter((entry): entry is { href: string; label: string } => Boolean(entry.href))

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-ink/95 fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={l(project.title)}
            className="nav:py-20 mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16"
          >
            <div className="flex items-start justify-between gap-6">
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="font-display text-cream nav:text-5xl text-4xl leading-[1.05]"
              >
                {l(project.title)}
              </motion.h2>
              <button
                type="button"
                aria-label={t.showcase.closeOverlay}
                onClick={onClose}
                className="text-cream hover:bg-cream hover:text-ink flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <motion.img
              layoutId={`cover-${project.slug}`}
              src={project.cover}
              alt={l(project.coverAlt)}
              width={1200}
              height={800}
              className="rounded-tile aspect-[3/2] w-full object-cover"
            />

            <div className="nav:flex-row nav:gap-12 flex flex-col gap-8">
              <div className="nav:flex-1 flex flex-col gap-5">
                <p className="text-cream/90 text-lg">{l(project.summary)}</p>
                <p className="text-cream/65 leading-relaxed">{l(project.description)}</p>
                {linkEntries.length > 0 && (
                  <ul className="flex flex-wrap gap-4 pt-2">
                    {linkEntries.map((entry) => (
                      <li key={entry.label}>
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cream hover:decoration-cream inline-flex items-center gap-1.5 underline decoration-white/30 underline-offset-4 transition-colors"
                        >
                          {entry.label}
                          <ArrowUpRight size={16} aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <dl className="nav:w-56 flex shrink-0 flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-cream/50">{t.showcase.roleLabel}</dt>
                  <dd className="text-cream">{l(project.role)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-cream/50">{t.showcase.yearLabel}</dt>
                  <dd className="text-cream">{project.year}</dd>
                </div>
                {project.client && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-cream/50">{t.showcase.clientLabel}</dt>
                    <dd className="text-cream">{project.client}</dd>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.categories.map((category) => (
                    <Pill key={category.en}>{l(category)}</Pill>
                  ))}
                </div>
              </dl>
            </div>

            <ul aria-label={t.showcase.galleryLabel} className="flex flex-col gap-6">
              {project.gallery.map((image, index) => (
                <li key={image}>
                  <img
                    src={image}
                    alt={`${l(project.title)} — ${index + 1}`}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="rounded-tile aspect-[3/2] w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
