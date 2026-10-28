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

// Rows 1, 3 and 4 come from the CV (v3.2); row 2 is Mike's own account of
// Kodda; the fifth row is read from git. Marks are the organizations' own.
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
    id: 'kodda-people',
    value: 30,
    suffix: '+',
    source: 'Kodda',
    label: { en: 'People I worked alongside', es: 'Personas con las que trabajé' },
    body: {
      en: 'At Kodda I worked with more than 30 people at once and learned from them constantly. Helping them grow in their careers was an honor.',
      es: 'En Kodda trabajé con más de 30 personas a la vez y aprendí de ellas constantemente. Ayudarlas a crecer en su carrera fue un honor.',
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
      src: '/art/marks/softtek-wordmark-cream.svg',
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
      src: '/art/marks/moneypool-wordmark-cream.svg',
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
