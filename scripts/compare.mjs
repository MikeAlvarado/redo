import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const OUT = 'reference/compare'
const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]

const SECTIONS = [
  { id: 'hero', ref: ['#nav-cascade'], pinned: false },
  { id: 'statement', ref: ['#scroll-text'], pinned: true },
  { id: 'journey', ref: ['#journey-1', '#journey'], pinned: true },
  { id: 'services', ref: ['#services'], pinned: false },
  { id: 'work', ref: ['#work'], pinned: false },
  { id: 'grid', ref: ['text:Revolutionary'], pinned: false },
  { id: 'reviews', ref: ['#mobile-reviews', '#reviews'], pinned: false },
  { id: 'stats', ref: ['text:Industries'], pinned: false },
  { id: 'founders', ref: ['#founders'], pinned: false },
  { id: 'closing', ref: ['#footer'], pinned: false },
]

const TARGETS = [
  { name: 'ref', url: 'https://redomedia.co/', lang: null },
  { name: 'mine-en', url: 'http://localhost:5173/', lang: 'en' },
  { name: 'mine-es', url: 'http://localhost:5173/', lang: 'es' },
]

const reportOnly = process.argv.includes('--report-only')

function frameList(section, meta, vh, docH) {
  const frames = []
  if (section.pinned && meta.height > vh + 100) {
    const pin = meta.height - vh
    for (const p of [0, 0.33, 0.66, 1]) {
      frames.push({
        name: `p${Math.round(p * 100)}`,
        y: meta.top + pin * p,
        settle: 2000,
      })
    }
  } else {
    frames.push({ name: 'enter', y: meta.top - vh * 0.85, settle: 1100 })
    frames.push({ name: 'mid', y: meta.top + meta.height / 2 - vh / 2, settle: 1100 })
    frames.push({ name: 'leave', y: meta.top + meta.height - vh * 0.2, settle: 1100 })
  }
  const seen = []
  return frames.filter((frame) => {
    frame.y = Math.max(0, Math.min(Math.round(frame.y), docH - vh))
    if (seen.some((y) => Math.abs(y - frame.y) < 40)) return false
    seen.push(frame.y)
    return true
  })
}

async function locateSections(page, target) {
  return page.evaluate(
    (args) => {
      const visible = (el) => el && el.getClientRects && el.getClientRects().length > 0
      const out = {}
      for (const section of args.sections) {
        let el = null
        if (args.target === 'ref') {
          for (const candidate of section.ref) {
            if (candidate.startsWith('text:')) {
              const needle = candidate.slice(5)
              el = [
                ...document.querySelectorAll('section, footer, header, div[id]'),
              ].find(
                (node) =>
                  visible(node) &&
                  (node.textContent || '').includes(needle) &&
                  node.getBoundingClientRect().height > 300 &&
                  node.getBoundingClientRect().height < 3500,
              )
            } else {
              const found = document.querySelector(candidate)
              if (visible(found)) el = found
            }
            if (el) break
          }
        } else {
          el = document.querySelector(`[data-section="${section.id}"]`)
        }
        if (el) {
          const r = el.getBoundingClientRect()
          out[section.id] = {
            top: Math.round(r.top + scrollY),
            height: Math.round(r.height),
          }
        }
      }
      return { sections: out, docH: document.documentElement.scrollHeight }
    },
    { sections: SECTIONS, target },
  )
}

async function capture() {
  const browser = await chromium.launch()
  for (const viewport of VIEWPORTS) {
    const dir = join(OUT, viewport.name)
    mkdirSync(dir, { recursive: true })
    for (const target of TARGETS) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
      })
      if (target.lang) {
        await page.addInitScript(
          (lang) => window.localStorage.setItem('portfolio.lang', lang),
          target.lang,
        )
      }
      try {
        await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60000 })
      } catch {
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      }
      await page.waitForTimeout(2500)
      await page.evaluate(async () => {
        const step = window.innerHeight
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 90))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(1200)
      const located = await locateSections(page, target.name === 'ref' ? 'ref' : 'mine')
      for (const section of SECTIONS) {
        const meta = located.sections[section.id]
        if (!meta) {
          console.log(`  [${viewport.name}/${target.name}] MISSING section ${section.id}`)
          continue
        }
        for (const frame of frameList(section, meta, viewport.height, located.docH)) {
          await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 350)), frame.y)
          await page.waitForTimeout(300)
          await page.evaluate((y) => window.scrollTo(0, y), frame.y)
          await page.waitForTimeout(frame.settle)
          await page.screenshot({
            path: join(dir, `${section.id}-${frame.name}-${target.name}.png`),
          })
        }
      }
      await page.close()
      console.log(`captured ${viewport.name}/${target.name}`)
    }
  }
  await browser.close()
}

async function contactSheets() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  for (const viewport of VIEWPORTS) {
    const dir = join(OUT, viewport.name)
    for (const section of SECTIONS) {
      const frames = ['p0', 'p33', 'p66', 'p100', 'enter', 'mid', 'leave'].filter(
        (frame) => existsSync(join(dir, `${section.id}-${frame}-mine-en.png`)),
      )
      if (frames.length === 0) continue
      const cell = (file) =>
        existsSync(join(dir, file))
          ? `<img src="${file}" style="width:100%;display:block">`
          : '<p style="color:#f66">missing</p>'
      const rows = frames
        .map(
          (frame) => `
        <tr><td class="lbl">${frame}</td>
          <td>${cell(`${section.id}-${frame}-ref.png`)}</td>
          <td>${cell(`${section.id}-${frame}-mine-en.png`)}</td>
          <td>${cell(`${section.id}-${frame}-mine-es.png`)}</td></tr>`,
        )
        .join('')
      const html = `<!doctype html><html><head><style>
        body{background:#222;color:#eee;font-family:monospace;margin:8px}
        table{border-collapse:collapse;width:100%}
        td{border:1px solid #555;padding:4px;vertical-align:top;width:31%}
        td.lbl{width:60px;font-size:14px}
        th{font-size:14px;padding:4px}
      </style></head><body>
      <table><tr><th></th><th>reference</th><th>mine (en)</th><th>mine (es)</th></tr>${rows}</table>
      </body></html>`
      const sheetPath = join(dir, `sheet-${section.id}.html`)
      writeFileSync(sheetPath, html)
      await page.goto(`file://${process.cwd()}/${sheetPath}`)
      await page.waitForTimeout(400)
      await page.screenshot({
        path: join(dir, `sheet-${section.id}.png`),
        fullPage: true,
      })
    }
  }
  await browser.close()
}

function buildReport() {
  const verdictsPath = join(OUT, 'verdicts.json')
  const verdicts = existsSync(verdictsPath)
    ? JSON.parse(readFileSync(verdictsPath, 'utf8'))
    : {}
  let failCount = 0
  let rowCount = 0
  const lines = [
    '# Mobile-fidelity comparison report',
    '',
    `Generated ${new Date().toISOString().slice(0, 16)} against https://redomedia.co/.`,
    'Each row was judged by eye from the side-by-side contact sheet',
    '(`sheet-<section>.png`): structure, motion, geometry, content-only diffs.',
    '',
    '| Viewport | Section | Frame | Verdict | Note |',
    '|---|---|---|---|---|',
  ]
  for (const viewport of VIEWPORTS) {
    const dir = join(OUT, viewport.name)
    for (const section of SECTIONS) {
      for (const frame of ['p0', 'p33', 'p66', 'p100', 'enter', 'mid', 'leave']) {
        if (!existsSync(join(dir, `${section.id}-${frame}-mine-en.png`))) continue
        rowCount += 1
        const key = `${viewport.name}/${section.id}-${frame}`
        const verdict = verdicts[key]
        const status = verdict?.status === 'PASS' ? 'PASS' : 'FAIL'
        if (status === 'FAIL') failCount += 1
        lines.push(
          `| ${viewport.name} | ${section.id} | ${frame} | ${status} | ${verdict?.note ?? 'no verdict recorded'} |`,
        )
      }
    }
  }
  lines.push('', `**${rowCount - failCount}/${rowCount} PASS.**`)
  writeFileSync(join(OUT, 'report.md'), lines.join('\n') + '\n')
  console.log(`report.md written: ${rowCount - failCount}/${rowCount} PASS`)
  return failCount
}

if (!reportOnly) {
  const ping = await fetch('http://localhost:5173/').catch(() => null)
  if (!ping || !ping.ok) {
    console.error(
      'local dev server is not running on :5173 — start it with `npm run dev`',
    )
    process.exit(2)
  }
  await capture()
  await contactSheets()
}
const failures = buildReport()
process.exit(failures > 0 ? 1 : 0)
