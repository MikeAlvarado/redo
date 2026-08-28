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
  // Build-only: the reference has no credentials strip, so its `ref` column
  // renders "missing" on purpose rather than being left untracked.
  { id: 'credentials', ref: [], pinned: false },
  { id: 'closing', ref: ['#footer'], pinned: false },
]

const TARGETS = [
  { name: 'ref', url: 'https://redomedia.co/', lang: null },
  { name: 'mine-en', url: 'http://localhost:5173/', lang: 'en' },
  { name: 'mine-es', url: 'http://localhost:5173/', lang: 'es' },
]

// Deck fidelity sweep: reference vs build at one width per reference tier
// (1500 = the >=1440 row/flip tier, 1200 and 430 = the sticky stack tier),
// stepped through the section scrolling down AND back up.
const DECK_SWEEP_WIDTHS = [1500, 1200, 430]
const DECK_SWEEP_DOWN = [0, 0.2, 0.4, 0.6, 0.8, 1]
const DECK_SWEEP_UP = [0.7, 0.35, 0]

const reportOnly = process.argv.includes('--report-only')

async function shoot(page, path) {
  try {
    await page.screenshot({ path, timeout: 45000 })
  } catch {
    console.log(`  retrying screenshot ${path}`)
    await page.screenshot({ path, timeout: 60000 }).catch((error) => {
      console.log(`  FAILED screenshot ${path}: ${error.message.split('\n')[0]}`)
    })
  }
}

function frameList(section, meta, vh, docH) {
  const frames = []
  const pin = meta.pinDist ?? meta.height - vh
  if (section.pinned && pin > 100) {
    for (const p of [0, 0.33, 0.66, 1]) {
      frames.push({
        name: `p${Math.round(p * 100)}`,
        y: (meta.pinStart ?? meta.top) + pin * p,
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
          if (args.target !== 'ref') {
            const spacer = el.querySelector('.pin-spacer')
            const pinned = spacer && spacer.firstElementChild
            if (spacer && pinned) {
              const spacerRect = spacer.getBoundingClientRect()
              out[section.id].pinStart = Math.round(spacerRect.top + scrollY)
              out[section.id].pinDist = Math.round(
                spacerRect.height - pinned.getBoundingClientRect().height,
              )
            }
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
          await shoot(page, join(dir, `${section.id}-${frame.name}-${target.name}.png`))
        }
      }
      await captureNavOpen(page, viewport, target, dir)
      await page.close()
      console.log(`captured ${viewport.name}/${target.name}`)
    }
  }
  await browser.close()
}

async function captureNavOpen(page, viewport, target, dir) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  if (viewport.width < 900) {
    if (target.name === 'ref') {
      const point = await page.evaluate(() => {
        const el = [...document.querySelectorAll('div,button')]
          .filter((node) => {
            const r = node.getBoundingClientRect()
            return (
              r.top < 120 &&
              r.width >= 28 &&
              r.width <= 64 &&
              r.height >= 28 &&
              r.height <= 64 &&
              r.left > window.innerWidth * 0.6 &&
              node.getAttribute('tabindex') === '0'
            )
          })
          .pop()
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      })
      if (!point) {
        console.log(`  [${viewport.name}/ref] menu trigger not found`)
        return
      }
      await page.mouse.click(point.x, point.y)
    } else {
      await page.click('button[aria-controls="mobile-menu"]')
    }
    await page.waitForTimeout(1200)
  }
  await shoot(page, join(dir, `nav-open-open-${target.name}.png`))
  if (viewport.width < 900 && target.name !== 'ref') {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(600)
  }
}

async function captureDeckSweep(browser) {
  const dir = join(OUT, 'deck')
  mkdirSync(dir, { recursive: true })
  for (const width of DECK_SWEEP_WIDTHS) {
    const height = width < 800 ? 932 : 900
    for (const target of [
      { name: 'ref', url: 'https://redomedia.co/' },
      { name: 'mine-en', url: 'http://localhost:5173/' },
    ]) {
      const page = await browser.newPage({ viewport: { width, height } })
      if (target.name !== 'ref') {
        await page.addInitScript(() =>
          window.localStorage.setItem('portfolio.lang', 'en'),
        )
      }
      try {
        await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60000 })
      } catch {
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      }
      await page.waitForTimeout(2200)
      const innerWidth = await page.evaluate(() => window.innerWidth)
      if (innerWidth !== width) {
        console.log(`  [deck/${width}/${target.name}] innerWidth ${innerWidth} mismatch`)
        await page.close()
        continue
      }
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 90))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(1200)
      // Scroll range spans the whole journey section (pin spacers and the
      // sticky column both live inside it), viewport-entry to section end.
      const meta = await page.evaluate((isRef) => {
        const el = isRef
          ? document.querySelector('#journey') || document.querySelector('#journey-1')
          : document.querySelector('[data-section="journey"]')
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return { top: Math.round(rect.top + scrollY), height: Math.round(rect.height) }
      }, target.name === 'ref')
      if (!meta) {
        console.log(`  [deck/${width}/${target.name}] journey section not found`)
        await page.close()
        continue
      }
      const from = Math.max(0, meta.top - height)
      const range = meta.height
      const frame = async (progress, label) => {
        await page.evaluate((y) => window.scrollTo(0, y), from + range * progress)
        await page.waitForTimeout(1100)
        await shoot(
          page,
          join(dir, `${width}-${label}${Math.round(progress * 100)}-${target.name}.png`),
        )
      }
      for (const progress of DECK_SWEEP_DOWN) await frame(progress, 'd')
      for (const progress of DECK_SWEEP_UP) await frame(progress, 'u')
      await page.close()
      console.log(`captured deck sweep ${width}/${target.name}`)
    }
  }
}

async function contactSheets() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  for (const viewport of VIEWPORTS) {
    const dir = join(OUT, viewport.name)
    for (const section of [...SECTIONS, { id: 'nav-open' }]) {
      const frames = ['p0', 'p33', 'p66', 'p100', 'enter', 'mid', 'leave', 'open'].filter(
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
  const deckDir = join(OUT, 'deck')
  const deckFrames = [
    ...DECK_SWEEP_DOWN.map((p) => `d${Math.round(p * 100)}`),
    ...DECK_SWEEP_UP.map((p) => `u${Math.round(p * 100)}`),
  ]
  for (const width of DECK_SWEEP_WIDTHS) {
    const rows = deckFrames
      .filter((frame) => existsSync(join(deckDir, `${width}-${frame}-mine-en.png`)))
      .map(
        (frame) => `
      <tr><td class="lbl">${frame}</td>
        <td><img src="${width}-${frame}-ref.png" style="width:100%;display:block"></td>
        <td><img src="${width}-${frame}-mine-en.png" style="width:100%;display:block"></td></tr>`,
      )
      .join('')
    if (!rows) continue
    const html = `<!doctype html><html><head><style>
      body{background:#222;color:#eee;font-family:monospace;margin:8px}
      table{border-collapse:collapse;width:100%}
      td{border:1px solid #555;padding:4px;vertical-align:top;width:47%}
      td.lbl{width:60px;font-size:14px}
      th{font-size:14px;padding:4px}
    </style></head><body>
    <table><tr><th></th><th>reference</th><th>mine (en)</th></tr>${rows}</table>
    </body></html>`
    const sheetPath = join(deckDir, `sheet-${width}.html`)
    writeFileSync(sheetPath, html)
    await page.goto(`file://${process.cwd()}/${sheetPath}`)
    await page.waitForTimeout(400)
    await page.screenshot({ path: join(deckDir, `sheet-${width}.png`), fullPage: true })
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
    for (const section of [...SECTIONS, { id: 'nav-open' }]) {
      for (const frame of ['p0', 'p33', 'p66', 'p100', 'enter', 'mid', 'leave', 'open']) {
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
  lines.push(
    '',
    '## Deck fidelity sweep (reference vs build, per tier, down then back up)',
    '',
    '| Width | Frame | Verdict | Note |',
    '|---|---|---|---|',
  )
  const sweepFrames = [
    ...DECK_SWEEP_DOWN.map((p) => `d${Math.round(p * 100)}`),
    ...DECK_SWEEP_UP.map((p) => `u${Math.round(p * 100)}`),
  ]
  for (const width of DECK_SWEEP_WIDTHS) {
    for (const frame of sweepFrames) {
      if (!existsSync(join(OUT, 'deck', `${width}-${frame}-mine-en.png`))) continue
      rowCount += 1
      const key = `deck/${width}-${frame}`
      const verdict = verdicts[key]
      const status = verdict?.status === 'PASS' ? 'PASS' : 'FAIL'
      if (status === 'FAIL') failCount += 1
      lines.push(
        `| ${width} | ${frame} | ${status} | ${verdict?.note ?? 'no verdict recorded'} |`,
      )
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
  const sweepBrowser = await chromium.launch()
  await captureDeckSweep(sweepBrowser)
  await sweepBrowser.close()
  await contactSheets()
}
const failures = buildReport()
process.exit(failures > 0 ? 1 : 0)
