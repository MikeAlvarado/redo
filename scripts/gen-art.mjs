import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'public', 'art')
mkdirSync(OUT, { recursive: true })

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const grain = (id) => `
  <filter id="grain-${id}">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic"/>
  </filter>`

function scene({ id, w, h, hueA, hueB, seed, marks }) {
  const rand = mulberry32(seed)
  const cx = 20 + rand() * 60
  const cy = 10 + rand() * 30
  let shapes = ''
  for (let i = 0; i < marks; i += 1) {
    const kind = Math.floor(rand() * 3)
    const x = rand() * w
    const y = h * 0.35 + rand() * h * 0.6
    const size = 20 + rand() * (w / 6)
    const opacity = (0.05 + rand() * 0.12).toFixed(3)
    if (kind === 0) {
      shapes += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(size / 2).toFixed(0)}" fill="none" stroke="#EAE7E0" stroke-opacity="${opacity}" stroke-width="1.5"/>`
    } else if (kind === 1) {
      shapes += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${size.toFixed(0)}" height="${(size * 0.62).toFixed(0)}" rx="8" fill="#EAE7E0" fill-opacity="${(opacity * 0.5).toFixed(3)}"/>`
    } else {
      shapes += `<path d="M ${x.toFixed(0)} ${y.toFixed(0)} q ${(size / 2).toFixed(0)} ${(-size * 0.8).toFixed(0)} ${size.toFixed(0)} 0" fill="none" stroke="#EAE7E0" stroke-opacity="${opacity}" stroke-width="1.5"/>`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g-${id}" cx="${cx}%" cy="${cy}%" r="95%">
      <stop offset="0%" stop-color="${hueA}"/>
      <stop offset="52%" stop-color="${hueB}"/>
      <stop offset="100%" stop-color="#0F0F0F"/>
    </radialGradient>
    ${grain(id)}
  </defs>
  <rect width="${w}" height="${h}" fill="#0A0A0A"/>
  <rect width="${w}" height="${h}" fill="url(#g-${id})" opacity="0.9" filter="url(#grain-${id})"/>
  ${shapes}
</svg>`
}

const palettes = [
  ['#FA6800', '#CC0000'],
  ['#E2542C', '#8C2416'],
  ['#B8431F', '#5C1710'],
  ['#D95B26', '#7A1E12'],
  ['#F07338', '#9C2A16'],
  ['#C24A21', '#6B1B0F'],
]

const services = ['brand', 'web', 'product', 'ai', 'motion', 'consulting']
services.forEach((name, index) => {
  const [hueA, hueB] = palettes[index % palettes.length]
  writeFileSync(
    join(OUT, `service-${name}.svg`),
    scene({
      id: `s${index}`,
      w: 800,
      h: 450,
      hueA,
      hueB,
      seed: 11 + index * 7,
      marks: 6,
    }),
  )
})

const projects = ['atlas', 'ledger', 'pulse', 'bloom', 'forge']
projects.forEach((name, index) => {
  const [hueA, hueB] = palettes[(index + 2) % palettes.length]
  writeFileSync(
    join(OUT, `project-${name}.svg`),
    scene({
      id: `p${index}`,
      w: 1200,
      h: 800,
      hueA,
      hueB,
      seed: 101 + index * 13,
      marks: 9,
    }),
  )
  for (let g = 1; g <= 2; g += 1) {
    writeFileSync(
      join(OUT, `project-${name}-${g}.svg`),
      scene({
        id: `p${index}g${g}`,
        w: 1200,
        h: 800,
        hueA,
        hueB,
        seed: 211 + index * 17 + g * 5,
        marks: 7,
      }),
    )
  }
})

const initials = ['LR', 'DM', 'SO', 'AV']
initials.forEach((pair, index) => {
  const [hueA, hueB] = palettes[(index + 1) % palettes.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="pg-${index}" cx="50%" cy="30%" r="90%">
      <stop offset="0%" stop-color="${hueA}"/>
      <stop offset="100%" stop-color="${hueB}"/>
    </radialGradient>
    ${grain(`port${index}`)}
  </defs>
  <rect width="400" height="400" fill="#141414"/>
  <circle cx="200" cy="200" r="150" fill="url(#pg-${index})" filter="url(#grain-port${index})"/>
  <text x="200" y="232" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="96" fill="#EAE7E0" text-anchor="middle">${pair}</text>
</svg>`
  writeFileSync(join(OUT, `portrait-${index}.svg`), svg)
})

console.log('art generated in public/art')
