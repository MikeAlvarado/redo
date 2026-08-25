export interface Client {
  id: string
  name: string
  flair: 'serif' | 'caps' | 'mono' | 'script'
}

// TODO(mike): fictional wordmarks — replace with the organizations you've worked with.
export const clients: Client[] = [
  { id: 'atlas', name: 'Atlas', flair: 'caps' },
  { id: 'ledger', name: 'ledger', flair: 'mono' },
  { id: 'pulse', name: 'Pulse', flair: 'serif' },
  { id: 'bloom', name: 'bloom & co.', flair: 'script' },
  { id: 'forge', name: 'FORGE', flair: 'caps' },
  { id: 'nimbus', name: 'nimbus', flair: 'mono' },
  { id: 'marea', name: 'Marea', flair: 'serif' },
  { id: 'quill', name: 'Quill', flair: 'script' },
  { id: 'vertex', name: 'VERTEX', flair: 'caps' },
  { id: 'solstice', name: 'solstice', flair: 'mono' },
  { id: 'harbor', name: 'Harbor', flair: 'serif' },
  { id: 'ember', name: 'ember.', flair: 'script' },
]

export const marqueeClients = clients.slice(0, 8)
