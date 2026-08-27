export interface FakeScrollTrigger {
  vars: Record<string, unknown>
  progress: number
  killed: boolean
  kill: () => void
  setProgress: (progress: number) => void
}

export const scrollTriggers: FakeScrollTrigger[] = []
export const tickerCallbacks = new Set<(time: number) => void>()

interface TweenVars {
  scrollTrigger?: Record<string, unknown>
  onUpdate?: () => void
  duration?: number
  [key: string]: unknown
}

export const tweens: { targets: unknown; vars: TweenVars }[] = []

function makeTrigger(vars: Record<string, unknown>): FakeScrollTrigger {
  const trigger: FakeScrollTrigger = {
    vars,
    progress: 0,
    killed: false,
    kill() {
      trigger.killed = true
    },
    setProgress(progress: number) {
      trigger.progress = progress
      const onUpdate = vars.onUpdate
      if (typeof onUpdate === 'function') {
        const callback = onUpdate as (self: FakeScrollTrigger) => void
        callback(trigger)
      }
    },
  }
  scrollTriggers.push(trigger)
  return trigger
}

function applyVars(target: unknown, vars: Record<string, unknown>) {
  if (target instanceof HTMLElement) {
    if ('opacity' in vars) target.style.opacity = String(vars.opacity)
    if ('zIndex' in vars) target.style.zIndex = String(vars.zIndex)
    return
  }
  if (typeof target === 'object' && target !== null) {
    Object.assign(target, vars)
  }
}

const gsap = {
  registerPlugin: () => {},
  set(targets: unknown, vars: Record<string, unknown>) {
    const list = Array.isArray(targets) ? targets : [targets]
    list.forEach((target) => applyVars(target, vars))
  },
  to(targets: unknown, vars: TweenVars) {
    tweens.push({ targets, vars })
    if (vars.scrollTrigger) {
      const trigger = makeTrigger(vars.scrollTrigger)
      trigger.vars.onTweenComplete = () => {
        const rest = { ...vars }
        delete rest.scrollTrigger
        delete rest.onUpdate
        applyVars(targets, rest)
        vars.onUpdate?.()
      }
    }
    return { kill: () => {} }
  },
  from(targets: unknown, vars: TweenVars) {
    return gsap.to(targets, vars)
  },
  fromTo(targets: unknown, fromVars: Record<string, unknown>, toVars: TweenVars) {
    applyVars(targets, fromVars)
    return gsap.to(targets, toVars)
  },
  quickSetter(target: unknown, prop: string) {
    return (value: unknown) => applyVars(target, { [prop]: value })
  },
  ticker: {
    add: (callback: (time: number) => void) => tickerCallbacks.add(callback),
    remove: (callback: (time: number) => void) => tickerCallbacks.delete(callback),
    lagSmoothing: () => {},
  },
  utils: {
    clamp: (min: number, max: number, value: number) =>
      Math.min(max, Math.max(min, value)),
    toArray: (selector: string, scope?: Element | null) =>
      Array.from((scope ?? document).querySelectorAll(selector)),
  },
}

export const ScrollTrigger = {
  create: (vars: Record<string, unknown>) => makeTrigger(vars),
  update: () => {},
  refresh: () => {},
}

export function completeTween(trigger: FakeScrollTrigger | undefined) {
  const complete = trigger?.vars.onTweenComplete
  if (typeof complete === 'function') {
    const callback = complete as () => void
    callback()
  }
}

export function resetGsapFakes() {
  scrollTriggers.length = 0
  tweens.length = 0
  tickerCallbacks.clear()
}

export default gsap
