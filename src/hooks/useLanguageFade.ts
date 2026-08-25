import { useContext, useEffect, useRef, type RefObject } from 'react'
import { LanguageValueContext } from '../i18n/context'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useLanguageFade<T extends HTMLElement>(target: RefObject<T | null>) {
  const lang = useContext(LanguageValueContext)
  const reduced = usePrefersReducedMotion()
  const previousLang = useRef(lang)

  useEffect(() => {
    if (previousLang.current === lang) return
    previousLang.current = lang
    if (reduced) return
    target.current?.animate([{ opacity: 0.25 }, { opacity: 1 }], {
      duration: 280,
      easing: 'ease-out',
    })
  }, [lang, reduced, target])
}
