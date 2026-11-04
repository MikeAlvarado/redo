import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../../data/projects'
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock'
import { useFocusTrap } from '../../../hooks/useFocusTrap'
import { useLanguage } from '../../../hooks/useLanguage'
import { Pill } from '../../ui/Pill'
import { ProjectLinks } from '../../ui/ProjectLinks'
import { Button } from '../../ui/Button'
import { Eyebrow } from '../../ui/Eyebrow'

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

  // The generated data repeats the cover as the gallery's first image; the
  // overlay already renders the cover as its hero, so it would show twice.
  const galleryImages =
    project?.gallery.filter((image) => image.src !== project.cover.src) ?? []

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
            <Button variant="ghost" onClick={onClose} className="w-fit">
              <ArrowLeft size={16} aria-hidden />
              {t.showcase.back}
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex min-w-0 flex-col gap-2"
            >
              <Eyebrow as="p">{l(project.category)}</Eyebrow>
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
                <ProjectLinks project={project} className="pt-2" />
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
                <div className="flex flex-col gap-2">
                  <dt className="text-cream/50">{t.showcase.tagsLabel}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {project.categories.map((category) => (
                        <li key={category.en}>
                          <Pill>{l(category)}</Pill>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>

            {galleryImages.length > 0 && (
              <ul aria-label={t.showcase.galleryLabel} className="flex flex-col gap-6">
                {galleryImages.map((image, index) => (
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
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
