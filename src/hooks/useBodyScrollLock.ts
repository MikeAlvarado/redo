import { useEffect } from 'react'
import { pauseLenis, resumeLenis } from './useLenis'

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previousOverflow = document.documentElement.style.overflow
    const previousPadding = document.documentElement.style.paddingRight
    // Taking the scroll extent away from <html> drops the document's scroll
    // position, so the page came back at the top when the lock lifted. Lenis
    // has to be told too — it restores its own animatedScroll on start().
    const previousScrollY = window.scrollY
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`
    }
    pauseLenis()
    return () => {
      document.documentElement.style.overflow = previousOverflow
      document.documentElement.style.paddingRight = previousPadding
      window.scrollTo(0, previousScrollY)
      resumeLenis(previousScrollY)
    }
  }, [locked])
}
