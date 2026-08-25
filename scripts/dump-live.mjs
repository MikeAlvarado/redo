import { writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const out = {}

const DUMP = `((rootSel, maxN) => {
  const root = typeof rootSel === 'string' ? document.querySelector(rootSel) : rootSel
  if (!root) return null
  const visible = (el) => el.getClientRects && el.getClientRects().length > 0
  const rows = []
  const walk = (el, depth) => {
    if (rows.length >= maxN) return
    if (visible(el)) {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const m = (cs.transform || '').match(/matrix(?:3d)?\\(([^)]+)\\)/)
    let ang = 0
    if (m) {
      const p = m[1].split(',').map(Number)
      ang = Math.round(Math.atan2(p[1], p[0]) * (180 / Math.PI) * 10) / 10
    }
    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .slice(0, 40)
    rows.push({
      d: depth,
      tag: el.tagName,
      w: Math.round(r.width),
      h: Math.round(r.height),
      x: Math.round(r.left),
      y: Math.round(r.top),
      br: cs.borderRadius,
      fs: cs.fontSize,
      ff: cs.fontFamily.split(',')[0].replace(/"/g, ''),
      fst: cs.fontStyle,
      col: cs.color,
      bg: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : '',
      ang: ang || undefined,
      txt: ownText || undefined,
    })
    }
    for (const child of el.children) walk(child, depth + 1)
  }
  walk(root, 0)
  return rows
})`

async function run(label, vw, vh, jobs) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } })
  await page.goto('https://redomedia.co/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  out[label] = {}
  for (const job of jobs) {
    if (job.scrollToId) {
      await page.evaluate(
        (args) => {
          const el = document.getElementById(args.id)
          if (el)
            window.scrollTo(
              0,
              el.getBoundingClientRect().top + scrollY + (args.offset || 0),
            )
        },
        { id: job.scrollToId, offset: job.offset },
      )
      await page.waitForTimeout(2200)
    }
    out[label][job.name] = await page.evaluate(
      `(${DUMP})(${JSON.stringify(job.selector)}, ${job.max ?? 120})`,
    )
  }
  out[label].ids = await page.evaluate(() =>
    [...document.querySelectorAll('[id]')]
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => el.id)
      .filter((id) => id && !id.startsWith('svg'))
      .slice(0, 30),
  )
  await page.close()
}

await run('m430', 430, 932, [
  { name: 'header', selector: '#nav-cascade', max: 90 },
  {
    name: 'founders',
    selector: '#founders',
    scrollToId: 'founders',
    offset: -150,
    max: 160,
  },
  { name: 'work', selector: '#work', scrollToId: 'work', offset: 350, max: 160 },
])

await run('d1440', 1440, 900, [
  { name: 'header', selector: '#nav-cascade', max: 90 },
  {
    name: 'founders',
    selector: '#founders',
    scrollToId: 'founders',
    offset: -150,
    max: 160,
  },
  { name: 'work', selector: '#work', scrollToId: 'work', offset: 350, max: 160 },
])

await browser.close()
writeFileSync('reference/dump-live.json', JSON.stringify(out, null, 1))
console.log(
  'written; sizes:',
  Object.keys(out)
    .map((k) => `${k}:${JSON.stringify(Object.keys(out[k]))}`)
    .join(' '),
)
