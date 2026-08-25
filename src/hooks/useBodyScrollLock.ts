import { useEffect } from 'react'
import { pauseLenis, resumeLenis } from './useLenis'

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previousOverflow = document.documentElement.style.overflow
    const previousPadding = document.documentElement.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`
    }
    pauseLenis()
    return () => {
      document.documentElement.style.overflow = previousOverflow
      document.documentElement.style.paddingRight = previousPadding
      resumeLenis()
    }
  }, [locked])
}
