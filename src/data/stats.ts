import type { LocalizedString } from '../i18n/types'

export interface StatRow {
  id: string
  value: number
  label: LocalizedString
  body: LocalizedString
}

// TODO(mike): use your real numbers.
export const stats: StatRow[] = [
  {
    id: 'years',
    value: 6,
    label: { en: 'Years of Experience', es: 'Años de experiencia' },
    body: {
      en: 'Years spent solving product, design, and engineering problems, from scrappy startups to established teams.',
      es: 'Años resolviendo problemas de producto, diseño e ingeniería, desde startups incipientes hasta equipos consolidados.',
    },
  },
  {
    id: 'projects',
    value: 24,
    label: { en: 'Projects Delivered', es: 'Proyectos entregados' },
    body: {
      en: 'Products shipped end to end — MVPs, redesigns, and platforms delivered with clarity, speed, and intent.',
      es: 'Productos entregados de principio a fin: MVPs, rediseños y plataformas con claridad, velocidad e intención.',
    },
  },
  {
    id: 'industries',
    value: 10,
    label: { en: 'Industries Impacted', es: 'Industrias impactadas' },
    body: {
      en: 'From fintech to health to commerce, cross-pollinating ideas between industries keeps every project fresh.',
      es: 'De fintech a salud y comercio: cruzar ideas entre industrias mantiene fresco cada proyecto.',
    },
  },
]
