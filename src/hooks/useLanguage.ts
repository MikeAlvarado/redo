import { useCallback, useContext } from 'react'
import { en } from '../i18n/en'
import { es } from '../i18n/es'
import { LanguageSetterContext, LanguageValueContext } from '../i18n/context'
import type { Dictionary, Locale, LocalizedString } from '../i18n/types'

const dictionaries: Record<Locale, Dictionary> = { en, es }

export function useLanguage() {
  const lang = useContext(LanguageValueContext)
  const setLang = useContext(LanguageSetterContext)
  const t = dictionaries[lang]
  const l = useCallback((text: LocalizedString) => text[lang], [lang])
  return { lang, setLang, t, l }
}
