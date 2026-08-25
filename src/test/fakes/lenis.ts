export class FakeLenis {
  static instances: FakeLenis[] = []
  destroyed = false
  stopped = false
  scrollCalls: unknown[] = []
  listeners = new Map<string, Set<(...args: unknown[]) => void>>()

  options: Record<string, unknown>

  constructor(options: Record<string, unknown> = {}) {
    this.options = options
    FakeLenis.instances.push(this)
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    const set = this.listeners.get(event) ?? new Set()
    set.add(callback)
    this.listeners.set(event, set)
  }

  raf() {}

  scrollTo(target: unknown, options?: unknown) {
    this.scrollCalls.push({ target, options })
  }

  stop() {
    this.stopped = true
  }

  start() {
    this.stopped = false
  }

  destroy() {
    this.destroyed = true
  }
}

export function resetLenisFakes() {
  FakeLenis.instances.length = 0
}

export default FakeLenis
