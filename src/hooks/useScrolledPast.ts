import { useSyncExternalStore } from 'react'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('scroll', onStoreChange, { passive: true })
  return () => window.removeEventListener('scroll', onStoreChange)
}

export function useScrolledPast(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > window.innerHeight * 0.6,
    () => false,
  )
}
