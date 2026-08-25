import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../i18n/context'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { useLanguage } from './useLanguage'

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('useLanguage', () => {
  it('defaults to English without sniffing the browser locale', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.lang).toBe('en')
    expect(result.current.t.nav.services).toBe('Services')
  })

  it('switches language, persists it, and updates the html lang attribute', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => result.current.setLang('es'))
    expect(result.current.lang).toBe('es')
    expect(result.current.t.nav.services).toBe('Servicios')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('es')
    expect(document.documentElement.lang).toBe('es')
  })

  it('picks localized strings through l()', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.l({ en: 'hello', es: 'hola' })).toBe('hello')
    act(() => result.current.setLang('es'))
    expect(result.current.l({ en: 'hello', es: 'hola' })).toBe('hola')
  })

  it('restores a persisted choice on a fresh mount', () => {
    window.localStorage.setItem(STORAGE_KEY, 'es')
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.lang).toBe('es')
  })
})
