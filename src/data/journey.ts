import type { LocalizedString } from '../i18n/types'

export interface JourneyCard {
  id: string
  tone: 'silver' | 'red' | 'charcoal'
  icon: 'trend' | 'orbit' | 'spark'
  title: LocalizedString
  body: LocalizedString
  status: LocalizedString
}

// What Mike is building now. Status lines are read from each repository on
// 2026-10-27 (commit counts, versions, the ticket in flight) and are meant to
// be refreshed by hand with every milestone.
export const journeyCards: JourneyCard[] = [
  {
    id: 'midflight',
    tone: 'silver',
    icon: 'orbit',
    title: { en: 'midflight', es: 'midflight' },
    body: {
      en: 'Working memory for people who direct coding agents. One always-open page: what is open, where each thread stopped, what changed at the source.',
      es: 'Memoria de trabajo para quien dirige agentes de código. Una página siempre abierta: qué está abierto, dónde se quedó cada hilo, qué cambió en la fuente.',
    },
    status: {
      en: '108 commits · local-first · cloud landing on Firebase',
      es: '108 commits · local-first · la nube aterriza en Firebase',
    },
  },
  {
    id: 'preride',
    tone: 'red',
    icon: 'trend',
    title: { en: 'preride', es: 'preride' },
    body: {
      en: 'Know the ride before you ride it. A physics engine in Rust and a SwiftUI app for cyclists, every formula cited and validated on real rides.',
      es: 'Conoce la ruta antes de rodarla. Un motor de física en Rust y una app SwiftUI para ciclistas, cada fórmula citada y validada en rodadas reales.',
    },
    status: {
      en: 'Rust no_std · SwiftUI · iOS first',
      es: 'Rust no_std · SwiftUI · primero iOS',
    },
  },
  {
    id: 'aimeter',
    tone: 'charcoal',
    icon: 'spark',
    title: { en: 'AIMeter', es: 'AIMeter' },
    body: {
      en: 'Your AI limits at a glance, on iPhone, iPad, Mac and Apple Watch. No server, no account. Claude, Codex and Copilot today, more providers pluggable.',
      es: 'Tus límites de IA de un vistazo, en iPhone, iPad, Mac y Apple Watch. Sin servidor, sin cuenta. Claude, Codex y Copilot hoy, más proveedores conectables.',
    },
    status: {
      en: '4.3.4 on the App Store · 8 languages',
      es: '4.3.4 en la App Store · 8 idiomas',
    },
  },
]
