import { useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { en } from './en'
import { es } from './es'
import type { Locale } from './types'
import {
  isLocale,
  LanguageSetterContext,
  LanguageValueContext,
  STORAGE_KEY,
} from './context'

const TITLES: Record<Locale, string> = { en: en.meta.title, es: es.meta.title }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Locale>(STORAGE_KEY, 'en', isLocale)

  useEffect(() => {
    document.documentElement.lang = lang
    if (location.pathname !== '/yc') document.title = TITLES[lang]
  }, [lang])

  return (
    <LanguageValueContext.Provider value={lang}>
      <LanguageSetterContext.Provider value={setLang}>
        {children}
      </LanguageSetterContext.Provider>
    </LanguageValueContext.Provider>
  )
}
