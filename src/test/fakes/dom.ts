type MediaListener = (event: { matches: boolean; media: string }) => void

const mediaState = new Map<string, boolean>()
const mediaListeners = new Map<string, Set<MediaListener>>()

export function setMediaQuery(query: string, matches: boolean) {
  mediaState.set(query, matches)
  mediaListeners.get(query)?.forEach((listener) => listener({ matches, media: query }))
}

export function mediaListenerCount(query: string): number {
  return mediaListeners.get(query)?.size ?? 0
}

export function installMatchMedia() {
  const factory = (query: string) => {
    const listeners = mediaListeners.get(query) ?? new Set<MediaListener>()
    mediaListeners.set(query, listeners)
    return {
      get matches() {
        return mediaState.get(query) ?? false
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: MediaListener) => {
        listeners.add(listener)
      },
      removeEventListener: (_type: string, listener: MediaListener) => {
        listeners.delete(listener)
      },
      addListener: (listener: MediaListener) => {
        listeners.add(listener)
      },
      removeListener: (listener: MediaListener) => {
        listeners.delete(listener)
      },
      dispatchEvent: () => false,
    }
  }
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: factory,
  })
}

export class FakeIntersectionObserver {
  callback: IntersectionObserverCallback
  observed: Element[] = []
  disconnected = false
  root = null
  rootMargin = ''
  thresholds: number[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    intersectionObservers.push(this)
  }

  observe(target: Element) {
    this.observed.push(target)
  }

  unobserve(target: Element) {
    this.observed = this.observed.filter((el) => el !== target)
  }

  disconnect() {
    this.disconnected = true
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    const full = entries.map((entry) => ({
      isIntersecting: false,
      intersectionRatio: 0,
      ...entry,
    }))
    this.callback(
      full as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    )
  }
}

export const intersectionObservers: FakeIntersectionObserver[] = []

export function installIntersectionObserver() {
  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: FakeIntersectionObserver,
  })
}

export function installResizeObserver() {
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  })
}

export function resetDomFakes() {
  mediaState.clear()
  mediaListeners.clear()
  intersectionObservers.length = 0
}
