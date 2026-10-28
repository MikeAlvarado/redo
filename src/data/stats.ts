import type { LocalizedString } from '../i18n/types'

export interface StatMark {
  src: string
  alt: LocalizedString
}

export interface StatRow {
  id: string
  value: number
  prefix?: string
  suffix?: string
  group?: boolean
  source: string
  label: LocalizedString
  body: LocalizedString
  mark?: StatMark
}

// The first four rows come from the CV (v3.2). The Kodda mark is Kodda's own
// wordmark; Softtek and Moneypool are typographic marks set in the site's
// faces until official ones are supplied. The fifth row is read from git.
export const stats: StatRow[] = [
  {
    id: 'kodda-users',
    value: 8000,
    suffix: '+',
    group: true,
    source: 'Kodda',
    label: { en: 'Users on Kodda', es: 'Usuarios en Kodda' },
    body: {
      en: 'Scaled the platform past 8,000 users — Zustand for lightweight state, lazy loading for startup time, load balancing for API response times.',
      es: 'Escalé la plataforma más allá de 8,000 usuarios: Zustand para estado ligero, lazy loading para el arranque y balanceo de carga para los tiempos de respuesta de la API.',
    },
    mark: {
      src: '/art/marks/kodda-wordmark-cream.svg',
      alt: { en: 'Kodda wordmark', es: 'Logotipo de Kodda' },
    },
  },
  {
    id: 'kodda-team',
    value: 6,
    source: 'Kodda',
    label: { en: 'Engineers led', es: 'Ingenieros a mi cargo' },
    body: {
      en: 'Built and led a 6-person engineering team from scratch, establishing the code review standards and delivery processes that kept web and mobile shipping.',
      es: 'Armé y lideré desde cero un equipo de ingeniería de 6 personas, estableciendo los estándares de code review y los procesos de entrega que mantuvieron web y móvil entregando.',
    },
    mark: {
      src: '/art/marks/kodda-wordmark-cream.svg',
      alt: { en: 'Kodda wordmark', es: 'Logotipo de Kodda' },
    },
  },
  {
    id: 'softtek-supermarkets',
    value: 70,
    suffix: '+',
    source: 'Softtek',
    label: { en: 'Supermarkets served', es: 'Supermercados atendidos' },
    body: {
      en: 'Deployed an OCR app built on ML Kit across 70+ supermarkets, streamlining invoice processing at the register.',
      es: 'Desplegué una app de OCR construida con ML Kit en más de 70 supermercados, agilizando el procesamiento de facturas en el punto de venta.',
    },
    mark: {
      src: '/art/marks/softtek-wordmark.svg',
      alt: { en: 'Softtek wordmark', es: 'Logotipo de Softtek' },
    },
  },
  {
    id: 'moneypool-payments',
    value: 37,
    prefix: '+',
    suffix: '%',
    source: 'Moneypool',
    label: { en: 'Payment completion', es: 'Finalización de pagos' },
    body: {
      en: 'Designed and ran A/B tests on the payment flows, improving weekly direct payment completion by 37%.',
      es: 'Diseñé y ejecuté pruebas A/B en los flujos de pago, mejorando la finalización semanal de pagos directos en 37%.',
    },
    mark: {
      src: '/art/marks/moneypool-wordmark.svg',
      alt: { en: 'Moneypool wordmark', es: 'Logotipo de Moneypool' },
    },
  },
  {
    id: 'shipped-2026',
    value: 4,
    source: '2026',
    label: { en: 'Products shipped this year', es: 'Productos publicados este año' },
    body: {
      en: 'AIMeter on the App Store, Vitrina on npm, Mediterra and hazlofacil.co live — built solo, with agents, between January and October.',
      es: 'AIMeter en la App Store, Vitrina en npm, Mediterra y hazlofacil.co en línea: construidos solo, con agentes, entre enero y octubre.',
    },
  },
]
