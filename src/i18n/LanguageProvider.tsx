import { useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Locale } from './types'
import {
  isLocale,
  LanguageSetterContext,
  LanguageValueContext,
  STORAGE_KEY,
} from './context'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Locale>(STORAGE_KEY, 'en', isLocale)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageValueContext.Provider value={lang}>
      <LanguageSetterContext.Provider value={setLang}>
        {children}
      </LanguageSetterContext.Provider>
    </LanguageValueContext.Provider>
  )
}
