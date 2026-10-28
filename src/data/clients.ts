import type { LocalizedString } from '../i18n/types'

export interface ClientMark {
  src: string
  alt: LocalizedString
  // 'official' marks come from the organization's own files; 'typographic'
  // ones are set in the site's faces until an official file is supplied.
  kind: 'official' | 'typographic'
}

export interface Client {
  id: string
  name: string
  flair: 'serif' | 'caps' | 'mono' | 'script'
  mark?: ClientMark
}

const mark = (
  file: string,
  name: string,
  kind: ClientMark['kind'] = 'typographic',
): ClientMark => ({
  src: `/art/marks/${file}`,
  alt: { en: `${name} logo`, es: `Logotipo de ${name}` },
  kind,
})

export const clients: Client[] = [
  {
    id: 'ycombinator',
    name: 'Y Combinator',
    flair: 'serif',
    mark: mark('ycombinator-cream.png', 'Y Combinator', 'official'),
  },
  { id: 'kodda', name: 'Kodda', flair: 'caps', mark: mark('kodda-wordmark-cream.svg', 'Kodda', 'official') },
  {
    id: 'kodda-studio',
    name: 'Kodda +Studio',
    flair: 'caps',
    mark: mark('kodda-plus-studio-cream.svg', 'Kodda +Studio', 'official'),
  },
  { id: 'softtek', name: 'Softtek', flair: 'caps', mark: mark('softtek-wordmark.svg', 'Softtek') },
  { id: 'moneypool', name: 'Moneypool', flair: 'mono', mark: mark('moneypool-wordmark.svg', 'Moneypool') },
  { id: 'itesm', name: 'ITESM', flair: 'serif', mark: mark('itesm-wordmark.svg', 'Tecnológico de Monterrey') },
  {
    id: 'first-robotics',
    name: 'FIRST Robotics',
    flair: 'caps',
    mark: mark('first-robotics-wordmark.svg', 'FIRST Robotics'),
  },
  { id: 'vanttec', name: 'VantTec', flair: 'mono', mark: mark('vanttec-wordmark.svg', 'VantTec') },
  {
    id: 'women-in-tech',
    name: 'Women in Tech',
    flair: 'script',
    mark: mark('women-in-tech-wordmark.svg', 'Women in Technology'),
  },
  { id: 'transpais', name: 'Transpais', flair: 'serif', mark: mark('transpais-wordmark.svg', 'Transpais') },
  {
    id: 'campus-accesible',
    name: 'Campus Accesible',
    flair: 'mono',
    mark: mark('campus-accesible-wordmark.svg', 'Campus Accesible'),
  },
  { id: 'caritas', name: 'Cáritas', flair: 'script', mark: mark('caritas-wordmark.svg', 'Cáritas de Monterrey') },
  {
    id: 'tequila-kaos',
    name: 'Tequila KAOS',
    flair: 'script',
    mark: mark('kaos-wordmark-cream.png', 'Tequila KAOS', 'official'),
  },
  {
    id: 'mediterra',
    name: 'Mediterra',
    flair: 'serif',
    mark: mark('mediterra-wordmark-cream.png', 'Mediterra', 'official'),
  },
]

export const marqueeClients = clients.slice(0, 8)
