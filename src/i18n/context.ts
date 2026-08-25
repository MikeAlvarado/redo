import { createContext } from 'react'
import type { Locale } from './types'

export const STORAGE_KEY = 'portfolio.lang'

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'es'
}

export const LanguageValueContext = createContext<Locale>('en')
export const LanguageSetterContext = createContext<(next: Locale) => void>(() => {})
