import { useEffect, useRef, useState } from 'react'
import { founders } from '../../data/founders'
import { useLanguage } from '../../hooks/useLanguage'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'
import type { LanyardHandle } from './lanyard/scene'

// The three.js scene (~590 KB) is imported only once the stage is within a
// viewport of the screen, so neither page pays for it up front.
export function LanyardBadge({ className }: { className?: string }) {
  const { t } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement | null>(null)
  const handleRef = useRef<LanyardHandle | null>(null)
  const [flipped, setFlipped] = useState(false)
  // Without IntersectionObserver (tests, old engines) load right away.
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  const [mike] = founders
  const copy = { batch: t.yc.batchValue, name: mike?.name.replace('\n', ' ') ?? '', role: t.yc.role }
  const copyKey = JSON.stringify(copy)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || near) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true)
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(stage)
    return () => observer.disconnect()
  }, [near])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !near || !mike) return
    let cancelled = false
    void import('./lanyard/scene').then(({ createLanyard }) => {
      if (cancelled) return
      handleRef.current = createLanyard(stage, {
        copy: JSON.parse(copyKey) as typeof copy,
        ycMarkSrc: '/art/marks/ycombinator-orange.png',
        koddaSrc: '/art/marks/kodda-wordmark-cream.svg',
        portraitSrc: mike.portrait,
        reducedMotion: reduced,
        onFlip: setFlipped,
      })
    })
    return () => {
      cancelled = true
      handleRef.current?.dispose()
      handleRef.current = null
    }
  }, [copyKey, reduced, near, mike])

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={stageRef}
        role="img"
        aria-label={t.yc.badgeLabel}
        className="relative h-[calc(100svh-9rem)] min-h-[28rem] w-full"
      />
      <button
        type="button"
        onClick={() => handleRef.current?.flip()}
        aria-pressed={flipped}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:rounded-full focus-visible:border focus-visible:border-white/20 focus-visible:px-3 focus-visible:py-1 focus-visible:text-xs"
      >
        {t.yc.flipLabel}
      </button>
    </div>
  )
}
