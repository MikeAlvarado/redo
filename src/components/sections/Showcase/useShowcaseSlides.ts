import { useCallback, useSyncExternalStore } from 'react'
import { projects, type Project } from '../../../data/projects'

const HASH_PREFIX = '#project/'

function parseOpenSlug(): string | null {
  const hash = window.location.hash
  return hash.startsWith(HASH_PREFIX) ? hash.slice(HASH_PREFIX.length) : null
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}

export function useShowcaseSlides() {
  const openSlug = useSyncExternalStore(subscribe, parseOpenSlug, () => null)

  const openProject = useCallback((slug: string) => {
    window.location.hash = `${HASH_PREFIX.slice(1)}${slug}`
  }, [])

  const closeProject = useCallback(() => {
    window.location.hash = ''
  }, [])

  const slides = projects.filter((project) => project.featured)
  const activeProject: Project | null =
    slides.find((project) => project.slug === openSlug) ?? null

  return { slides, activeProject, openProject, closeProject }
}
