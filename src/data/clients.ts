export interface Client {
  id: string
  name: string
  flair: 'serif' | 'caps' | 'mono' | 'script'
}

export const clients: Client[] = [
  { id: 'kodda', name: 'Kodda', flair: 'caps' },
  { id: 'ycombinator', name: 'Y Combinator', flair: 'serif' },
  { id: 'moneypool', name: 'Moneypool', flair: 'mono' },
  { id: 'softtek', name: 'Softtek', flair: 'caps' },
  { id: 'itesm', name: 'ITESM', flair: 'serif' },
  { id: 'first-robotics', name: 'FIRST Robotics', flair: 'caps' },
  { id: 'vanttec', name: 'VantTec', flair: 'mono' },
  { id: 'women-in-tech', name: 'Women in Tech', flair: 'script' },
  { id: 'transpais', name: 'Transpais', flair: 'serif' },
  { id: 'campus-accesible', name: 'Campus Accesible', flair: 'mono' },
  { id: 'caritas', name: 'Cáritas', flair: 'script' },
  { id: 'tequila-kaos', name: 'Tequila KAOS', flair: 'script' },
]

export const marqueeClients = clients.slice(0, 8)
