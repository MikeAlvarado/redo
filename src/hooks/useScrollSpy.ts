import { useEffect, useState } from 'react'

export function useScrollSpy(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio)
          } else {
            visible.delete(entry.target.id)
          }
        }
        let best: string | null = null
        let bestRatio = 0
        for (const id of ids) {
          const ratio = visible.get(id)
          if (ratio !== undefined && ratio >= bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        setActive((current) => best ?? current)
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return active
}
