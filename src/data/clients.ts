import type { LocalizedString } from '../i18n/types'

export interface ClientMark {
  src: string
  alt: LocalizedString
  // Natural size of the file. ClientWordmark turns it into an explicit
  // rendered width, because an <img> sized only by max-height/max-width
  // reports a wrong max-content width to a w-max flex row in Chromium and
  // the marquee's rows end up narrower than their logos.
  width: number
  height: number
  // 'official' marks come from the organization's own files (recoloured to
  // cream, background removed); 'typographic' ones are set in the site's
  // faces until an official file is supplied (VantTec, Women in Tech).
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
  [width, height]: [number, number],
  kind: ClientMark['kind'] = 'typographic',
): ClientMark => ({
  src: `/art/marks/${file}`,
  alt: { en: `${name} logo`, es: `Logotipo de ${name}` },
  width,
  height,
  kind,
})

export const clients: Client[] = [
  {
    id: 'ycombinator',
    name: 'Y Combinator',
    flair: 'serif',
    mark: mark('ycombinator-cream.png', 'Y Combinator', [1600, 331], 'official'),
  },
  { id: 'kodda', name: 'Kodda', flair: 'caps', mark: mark('kodda-wordmark-cream.svg', 'Kodda', [83, 19], 'official') },
  { id: 'softtek', name: 'Softtek', flair: 'caps', mark: mark('softtek-wordmark-cream.svg', 'Softtek', [555.6, 102], 'official') },
  { id: 'moneypool', name: 'Moneypool', flair: 'mono', mark: mark('moneypool-wordmark-cream.svg', 'Moneypool', [144, 30], 'official') },
  { id: 'itesm', name: 'ITESM', flair: 'serif', mark: mark('itesm-lockup-cream.svg', 'Tecnológico de Monterrey', [195, 52], 'official') },
  {
    id: 'first-robotics',
    name: 'FIRST Robotics',
    flair: 'caps',
    mark: mark('first-lockup-cream.svg', 'FIRST Robotics', [154, 40], 'official'),
  },
  { id: 'vanttec', name: 'VantTec', flair: 'mono', mark: mark('vanttec-wordmark.svg', 'VantTec', [189.4, 64]) },
  {
    id: 'women-in-tech',
    name: 'Women in Tech',
    flair: 'script',
    mark: mark('women-in-tech-wordmark.svg', 'Women in Technology', [344.8, 54.2]),
  },
  { id: 'transpais', name: 'Transpais', flair: 'serif', mark: mark('transpais-wordmark-cream.svg', 'Transpais', [196, 16], 'official') },
  { id: 'caritas', name: 'Cáritas', flair: 'script', mark: mark('caritas-lockup-cream.png', 'Cáritas de Monterrey', [734, 358], 'official') },
  {
    id: 'tequila-kaos',
    name: 'Tequila KAOS',
    flair: 'script',
    mark: mark('kaos-wordmark-cream.png', 'Tequila KAOS', [819, 246], 'official'),
  },
  {
    id: 'mediterra',
    name: 'Mediterra',
    flair: 'serif',
    mark: mark('mediterra-wordmark-cream.png', 'Mediterra', [821, 157], 'official'),
  },
]

export const marqueeClients = clients.slice(0, 8)
