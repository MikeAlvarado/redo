import { writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const out = {}
const browser = await chromium.launch()

const VISIBLE_HELPERS = `
  const visible = (el) => {
    if (!el || !el.getClientRects || el.getClientRects().length === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 1 && r.height > 1
  }
  const leafWith = (txt) =>
    [...document.querySelectorAll('h1,h2,h3,h4,p,div,span,a,button')].find(
      (e) => visible(e) && e.children.length === 0 && (e.textContent || '').includes(txt),
    )
  const angleOf = (el) => {
    const m = (getComputedStyle(el).transform || '').match(/matrix(?:3d)?\\(([^)]+)\\)/)
    if (!m) return 0
    const p = m[1].split(',').map(Number)
    return Math.round(Math.atan2(p[1], p[0]) * (180 / Math.PI) * 10) / 10
  }
  const tiltedAncestor = (leaf, minW) => {
    let el = leaf
    while (el && el !== document.body) {
      const a = angleOf(el)
      const r = el.getBoundingClientRect()
      if (Math.abs(a) > 0.5 && r.width > minW) return { el, a, r }
      el = el.parentElement
    }
    return null
  }
`

for (const [label, vw, vh] of [
  ['mobile430', 430, 932],
  ['desktop1440', 1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } })
  await page.goto('https://redomedia.co/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  out[label] = {}

  await page.evaluate(() => {
    const el = document.getElementById('journey-1')
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 300)
  })
  await page.waitForTimeout(1500)

  const deckMeta = await page.evaluate((vhArg) => {
    const el = document.getElementById('journey-1')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      top: Math.round(r.top + scrollY),
      height: Math.round(r.height),
      pin: Math.round(r.height - vhArg),
    }
  }, vh)
  out[label].deckMeta = deckMeta

  if (deckMeta) {
    const y = deckMeta.top + deckMeta.pin
    await page.evaluate((v) => window.scrollTo(0, v), y - 500)
    await page.waitForTimeout(600)
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(2500)
    out[label].deckSettle = await page.evaluate(`(() => {
      ${VISIBLE_HELPERS}
      return ['Zero to One', 'One to N', 'Quick'].map((t) => {
        const leaf = leafWith(t)
        if (!leaf) return { t, found: false }
        const hit = tiltedAncestor(leaf, 150)
        if (!hit) return { t, angle: 0 }
        return {
          t, angle: hit.a,
          w: Math.round(hit.r.width), h: Math.round(hit.r.height),
          top: Math.round(hit.r.top), left: Math.round(hit.r.left),
          br: getComputedStyle(hit.el).borderRadius,
        }
      })
    })()`)

    out[label].journeyHeading = await page.evaluate(`(() => {
      ${VISIBLE_HELPERS}
      const leaf = leafWith('Where are')
      if (!leaf) return null
      const block = leaf.closest('h1,h2,h3,h4,p') || leaf.parentElement
      const cs = getComputedStyle(block)
      const r = block.getBoundingClientRect()
      return {
        fs: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing,
        w: Math.round(r.width), h: Math.round(r.height),
        lines: Math.round(r.height / parseFloat(cs.lineHeight)),
        text: (block.textContent || '').slice(0, 50),
      }
    })()`)

    out[label].cardInterior = await page.evaluate(`(() => {
      ${VISIBLE_HELPERS}
      const title = leafWith('Zero to One')
      const body = leafWith('navigating a new')
      const icon = title ? tiltedAncestor(title, 150) : null
      const pad = icon ? getComputedStyle(icon.el).padding : null
      const tcs = title ? getComputedStyle(title) : null
      const bcs = body ? getComputedStyle(body) : null
      return {
        titleFs: tcs && tcs.fontSize, titleLh: tcs && tcs.lineHeight,
        bodyFs: bcs && bcs.fontSize, bodyLh: bcs && bcs.lineHeight,
        cardPadding: pad,
      }
    })()`)
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1200)
  out[label].navControls = await page.evaluate(`(() => {
    ${VISIBLE_HELPERS}
    const header = document.getElementById('nav-cascade') || document.querySelector('header')
    if (!header) return null
    return [...header.querySelectorAll('div,button,a')]
      .filter((el) => visible(el))
      .map((el) => ({ el, r: el.getBoundingClientRect(), cs: getComputedStyle(el) }))
      .filter(({ r }) => r.width >= 20 && r.width <= 70 && r.height >= 20 && r.height <= 70 && r.top < 110 && r.right > (document.documentElement.clientWidth * 0.6))
      .slice(0, 5)
      .map(({ el, r, cs }) => ({
        tag: el.tagName, w: Math.round(r.width), h: Math.round(r.height),
        right: Math.round(r.right), br: cs.borderRadius,
        border: cs.borderWidth + ' ' + cs.borderColor, bg: cs.backgroundColor,
        inner: el.innerHTML.replace(/\\s+/g, ' ').slice(0, 260),
      }))
  })()`)

  await page.evaluate(() => {
    const el = document.getElementById('work')
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 400)
  })
  await page.waitForTimeout(2000)
  out[label].showcase = await page.evaluate(`(() => {
    ${VISIBLE_HELPERS}
    const work = document.getElementById('work')
    if (!work) return null
    const svgs = [...work.querySelectorAll('svg')].filter(visible).map((s) => {
      const r = s.getBoundingClientRect()
      const wrap = s.closest('div,button,a')
      const wr = wrap ? wrap.getBoundingClientRect() : r
      const wcs = wrap ? getComputedStyle(wrap) : null
      return { w: Math.round(wr.width), h: Math.round(wr.height), br: wcs && wcs.borderRadius, left: Math.round(wr.left), top: Math.round(wr.top) }
    })
    const smallDots = [...work.querySelectorAll('div')].filter((el) => {
      if (!visible(el)) return false
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return r.width > 3 && r.width < 14 && Math.abs(r.width - r.height) < 3 &&
        (cs.borderRadius.includes('%') || parseFloat(cs.borderRadius) >= r.width / 2 - 1) &&
        cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
    })
    const slide = leafWith('MVP Design Sprint') || leafWith('ConvertIAS')
    return { svgWraps: svgs.slice(0, 6), dotCount: smallDots.length, slideFound: Boolean(slide) }
  })()`)

  await page.evaluate(() => {
    const el = document.getElementById('founders')
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 150)
  })
  await page.waitForTimeout(2500)
  out[label].founders = await page.evaluate(`(() => {
    ${VISIBLE_HELPERS}
    const section = document.getElementById('founders')
    if (!section) return null
    const heading = leafWith('Get in touch')
    const hcs = heading ? getComputedStyle(heading.closest('h1,h2,h3,p') || heading) : null
    const cards = ['Dave', 'Ghelani'].map((n) => {
      const leaf = leafWith(n)
      if (!leaf) return { n, found: false }
      const nameBlock = leaf.closest('h1,h2,h3,h4,p') || leaf.parentElement
      const ncs = getComputedStyle(nameBlock)
      const hit = tiltedAncestor(leaf, 200)
      if (!hit) return { n, angle: 0, nameFs: ncs.fontSize }
      const cs = getComputedStyle(hit.el)
      const disc = [...hit.el.querySelectorAll('div,img')].find((d) => {
        if (!visible(d)) return false
        const dr = d.getBoundingClientRect()
        const dcs = getComputedStyle(d)
        return dr.width > 80 && dr.width < 230 && Math.abs(dr.width - dr.height) < 8 &&
          (dcs.borderRadius.includes('%') || parseFloat(dcs.borderRadius) >= dr.width / 2 - 3)
      })
      return {
        n, angle: hit.a, w: Math.round(hit.r.width), h: Math.round(hit.r.height),
        left: Math.round(hit.r.left), top: Math.round(hit.r.top),
        br: cs.borderRadius, bg: cs.backgroundColor, pad: cs.padding,
        nameFs: ncs.fontSize, nameFf: ncs.fontFamily.split(',')[0], nameColor: ncs.color,
        disc: disc ? Math.round(disc.getBoundingClientRect().width) : null,
      }
    })
    const role = leafWith('Head of Design')
    const link = leafWith('LinkedIn')
    return {
      heading: hcs ? { fs: hcs.fontSize, lh: hcs.lineHeight } : null,
      cards,
      roleFs: role ? getComputedStyle(role).fontSize : null,
      linkFs: link ? getComputedStyle(link).fontSize : null,
    }
  })()`)

  await page.close()
}

await browser.close()
writeFileSync('reference/measure-live-2.json', JSON.stringify(out, null, 2))
console.log(JSON.stringify(out, null, 1))
