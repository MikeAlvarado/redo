import type { LocalizedString } from '../i18n/types'

export interface JourneyCard {
  id: string
  tone: 'silver' | 'red' | 'charcoal'
  icon: 'trend' | 'orbit' | 'spark'
  title: LocalizedString
  body: LocalizedString
  status: LocalizedString
}

// The three kinds of technology Mike builds with. Every line is evidenced by
// a repository under ~/Developer/personal or by the CV (v3.2); the status
// line names the products that prove it.
export const journeyCards: JourneyCard[] = [
  {
    id: 'native',
    tone: 'silver',
    icon: 'orbit',
    title: { en: 'Native\napps', es: 'Apps\nnativas' },
    body: {
      en: 'Swift, SwiftUI and React Native, from iPhone to Apple Watch. Widgets, Live Activities, Keychain, architectures that need no server at all.',
      es: 'Swift, SwiftUI y React Native, del iPhone al Apple Watch. Widgets, Live Activities, Keychain, arquitecturas que no necesitan servidor.',
    },
    status: {
      en: 'AIMeter · preride · Kodda',
      es: 'AIMeter · preride · Kodda',
    },
  },
  {
    id: 'web',
    tone: 'red',
    icon: 'trend',
    title: { en: 'Web &\ncloud', es: 'Web y\nnube' },
    body: {
      en: 'React and TypeScript in front, Node, Firebase and Cloud Run behind, Stripe when it bills. Design systems, accessibility and prerendering built in.',
      es: 'React y TypeScript al frente, Node, Firebase y Cloud Run detrás, Stripe cuando cobra. Sistemas de diseño, accesibilidad y prerenderizado de serie.',
    },
    status: {
      en: 'midflight · Mediterra · HazloFácil · vitrina',
      es: 'midflight · Mediterra · HazloFácil · vitrina',
    },
  },
  {
    id: 'ai',
    tone: 'charcoal',
    icon: 'spark',
    title: { en: 'AI &\nengines', es: 'IA y\nmotores' },
    body: {
      en: 'Coding agents I direct and the tools they run on: Claude Code plugins, MCP servers, on-device ML. Physics engines in Rust with every formula cited.',
      es: 'Agentes de código que dirijo y las herramientas donde corren: plugins de Claude Code, servidores MCP, ML en el dispositivo. Motores de física en Rust con cada fórmula citada.',
    },
    status: {
      en: 'midflight · preride · AIMeter · OCR at Softtek',
      es: 'midflight · preride · AIMeter · OCR en Softtek',
    },
  },
]
