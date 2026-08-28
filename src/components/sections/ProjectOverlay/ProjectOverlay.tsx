import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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

  // Every section wrapper in App.tsx is `relative z-10`, which is a stacking
  // context — so this panel's z-50 only ever competed inside it and the nav's
  // root-level z-50 painted over the top of it. A portal puts it back at root.
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // Lenis keeps its wheel/touch listener and calls preventDefault even
          // while stopped, which kills native scrolling inside this fixed
          // panel. data-lenis-prevent makes it skip events from in here.
          data-lenis-prevent
          className="bg-ink/95 fixed inset-0 z-50 overflow-y-auto overscroll-contain backdrop-blur-sm"
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
            <button
              type="button"
              onClick={onClose}
              className="rounded-cta text-cream hover:bg-cream hover:text-ink inline-flex w-fit items-center gap-2 border border-white/20 px-4 py-2.5 text-sm transition-colors"
            >
              <ArrowLeft size={16} aria-hidden />
              {t.showcase.back}
            </button>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex min-w-0 flex-col gap-2"
            >
              <p className="text-cream/55 text-xs tracking-[0.16em] uppercase">
                {l(project.category)}
              </p>
              <h2 className="font-display text-cream nav:text-5xl text-4xl leading-[1.05]">
                {l(project.title)}
              </h2>
            </motion.div>

            <motion.img
              layoutId={`cover-${project.slug}`}
              src={project.cover.src}
              alt={l(project.coverAlt)}
              width={project.cover.width}
              height={project.cover.height}
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
                <li key={image.src}>
                  <img
                    src={image.src}
                    alt={`${l(project.title)} — ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    className="rounded-tile w-full object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
