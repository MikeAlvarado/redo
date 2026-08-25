import { writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const out = {}

async function measureDeck(page, vw, vh) {
  const section = await page.evaluate(() => {
    const el = document.getElementById('journey-1')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { top: Math.round(r.top + scrollY), height: Math.round(r.height) }
  })
  if (!section) return null
  const pinLength = section.height - vh
  const result = {
    section,
    pinLength,
    pinLengthVh: Math.round((pinLength / vh) * 100) / 100,
    frames: {},
  }

  for (const p of [0.33, 0.66, 1]) {
    const y = Math.round(section.top + pinLength * p)
    await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y - 400))
    await page.waitForTimeout(400)
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(1800)
    result.frames[p] = await page.evaluate(() => {
      const titles = ['Zero to One', 'One to N', 'Quick']
      return titles.map((t) => {
        const leaf = [...document.querySelectorAll('h1,h2,h3,h4,h5,p,div,span')].find(
          (e) => e.children.length === 0 && (e.textContent || '').includes(t),
        )
        if (!leaf) return { t, found: false }
        let el = leaf
        let hit = null
        while (el && el !== document.body) {
          const cs = getComputedStyle(el)
          if (cs.transform && cs.transform !== 'none') {
            const m = cs.transform.match(/matrix(?:3d)?\(([^)]+)\)/)
            if (m) {
              const parts = m[1].split(',').map(Number)
              const ang = Math.atan2(parts[1], parts[0]) * (180 / Math.PI)
              const r = el.getBoundingClientRect()
              if (Math.abs(ang) > 0.5 && r.width > 150) {
                hit = {
                  t,
                  angle: Math.round(ang * 10) / 10,
                  w: Math.round(r.width),
                  h: Math.round(r.height),
                  top: Math.round(r.top),
                  left: Math.round(r.left),
                  opacity: cs.opacity,
                }
                break
              }
            }
          }
          el = el.parentElement
        }
        if (!hit) {
          const card = leaf.closest('div')
          const r = card ? card.getBoundingClientRect() : null
          hit = {
            t,
            angle: 0,
            w: r ? Math.round(r.width) : 0,
            h: r ? Math.round(r.height) : 0,
          }
        }
        return hit
      })
    })
  }

  const heading = await page.evaluate(() => {
    const leaf = [...document.querySelectorAll('h1,h2,h3,p,div,span')].find(
      (e) =>
        (e.textContent || '').trim().startsWith('Where are') && e.children.length <= 4,
    )
    if (!leaf) return null
    const cs = getComputedStyle(leaf)
    return {
      fs: cs.fontSize,
      lh: cs.lineHeight,
      ls: cs.letterSpacing,
      w: Math.round(leaf.getBoundingClientRect().width),
      lines: Math.round(
        leaf.getBoundingClientRect().height / parseFloat(cs.lineHeight || cs.fontSize),
      ),
      text: (leaf.textContent || '').slice(0, 60),
    }
  })
  result.heading = heading

  const inner = await page.evaluate(() => {
    const leaf = [...document.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && (e.textContent || '').includes('Zero to One'),
    )
    if (!leaf) return null
    const titleCs = getComputedStyle(leaf)
    const body = [...document.querySelectorAll('*')].find(
      (e) =>
        e.children.length === 0 && (e.textContent || '').includes('navigating a new'),
    )
    const bodyCs = body ? getComputedStyle(body) : null
    return {
      titleFs: titleCs.fontSize,
      titleLh: titleCs.lineHeight,
      titleFf: titleCs.fontFamily.split(',')[0],
      bodyFs: bodyCs ? bodyCs.fontSize : null,
      bodyLh: bodyCs ? bodyCs.lineHeight : null,
    }
  })
  result.cardInterior = inner
  return result
}

const browser = await chromium.launch()

for (const [label, vw, vh] of [
  ['mobile430', 430, 932],
  ['desktop1440', 1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } })
  await page.goto('https://redomedia.co/', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2500)
  out[label] = {}

  out[label].deck = await measureDeck(page, vw, vh)

  out[label].navTrigger = await page.evaluate(() => {
    const header =
      document.getElementById('nav-cascade') || document.querySelector('header')
    if (!header) return null
    const candidates = [...header.querySelectorAll('div,button,a')]
      .map((el) => ({ el, r: el.getBoundingClientRect(), cs: getComputedStyle(el) }))
      .filter(
        ({ r, cs }) =>
          r.width >= 24 &&
          r.width <= 60 &&
          r.height >= 24 &&
          r.height <= 60 &&
          r.top < 120 &&
          Math.abs(r.width - r.height) < 8 &&
          (parseFloat(cs.borderRadius) >= r.width / 3 || cs.borderRadius.includes('%')),
      )
    return candidates.slice(0, 4).map(({ el, r, cs }) => ({
      tag: el.tagName,
      w: Math.round(r.width),
      h: Math.round(r.height),
      right: Math.round(r.right),
      br: cs.borderRadius,
      border: cs.borderWidth + ' ' + cs.borderColor,
      bg: cs.backgroundColor,
      svg: el.querySelectorAll('svg,circle,path').length,
      html: el.innerHTML.slice(0, 220),
    }))
  })

  const founders = await page.evaluate(() => {
    const section = document.getElementById('founders')
    if (!section) return null
    window.scrollTo(0, section.getBoundingClientRect().top + scrollY - 200)
    return true
  })
  if (founders) {
    await page.waitForTimeout(2200)
    out[label].founders = await page.evaluate(() => {
      const section = document.getElementById('founders')
      const sr = section.getBoundingClientRect()
      const heading = [...section.querySelectorAll('*')].find(
        (e) =>
          e.children.length <= 4 &&
          /Get in touch/i.test(e.textContent || '') &&
          e.getBoundingClientRect().height < 200,
      )
      const hcs = heading ? getComputedStyle(heading) : null
      const names = ['Bhini', 'Preet']
      const cards = names.map((n) => {
        const leaf = [...section.querySelectorAll('*')].find(
          (e) => e.children.length === 0 && (e.textContent || '').includes(n),
        )
        if (!leaf) return { n, found: false }
        const nameCs = getComputedStyle(leaf.parentElement || leaf)
        let el = leaf
        let card = null
        while (el && el !== section) {
          const cs = getComputedStyle(el)
          const m = (cs.transform || '').match(/matrix\(([^)]+)\)/)
          if (m) {
            const parts = m[1].split(',').map(Number)
            const ang = Math.atan2(parts[1], parts[0]) * (180 / Math.PI)
            if (Math.abs(ang) > 0.5) {
              const r = el.getBoundingClientRect()
              card = {
                angle: Math.round(ang * 10) / 10,
                w: Math.round(r.width),
                h: Math.round(r.height),
                left: Math.round(r.left),
                top: Math.round(r.top),
                br: cs.borderRadius,
                bg: cs.backgroundColor,
              }
              break
            }
          }
          el = el.parentElement
        }
        const disc = [...(el || leaf.closest('div')).querySelectorAll('*')].find((d) => {
          const dcs = getComputedStyle(d)
          const dr = d.getBoundingClientRect()
          return (
            dr.width > 80 &&
            dr.width < 220 &&
            (dcs.borderRadius.includes('%') ||
              parseFloat(dcs.borderRadius) >= dr.width / 2 - 2)
          )
        })
        const discR = disc ? disc.getBoundingClientRect() : null
        return {
          n,
          card,
          nameFs: nameCs.fontSize,
          nameFf: nameCs.fontFamily.split(',')[0],
          nameStyle: nameCs.fontStyle,
          nameColor: nameCs.color,
          disc: discR ? Math.round(discR.width) : null,
        }
      })
      const roleLeaf = [...section.querySelectorAll('*')].find(
        (e) => e.children.length === 0 && /Head of/i.test(e.textContent || ''),
      )
      const roleCs = roleLeaf ? getComputedStyle(roleLeaf) : null
      const linkLeaf = [...section.querySelectorAll('*')].find(
        (e) => e.children.length === 0 && /LinkedIn/i.test(e.textContent || ''),
      )
      const linkCs = linkLeaf ? getComputedStyle(linkLeaf) : null
      return {
        sectionH: Math.round(sr.height),
        heading: hcs
          ? { fs: hcs.fontSize, text: (heading.textContent || '').slice(0, 40) }
          : null,
        cards,
        role: roleCs ? { fs: roleCs.fontSize, color: roleCs.color } : null,
        link: linkCs ? { fs: linkCs.fontSize, color: linkCs.color } : null,
      }
    })
  }

  out[label].showcaseControls = await page.evaluate(() => {
    const work = document.getElementById('work')
    if (!work) return null
    window.scrollTo(0, work.getBoundingClientRect().top + scrollY + 300)
    const arrows = [...work.querySelectorAll('div,button,a')].filter((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return (
        r.width >= 30 &&
        r.width <= 70 &&
        Math.abs(r.width - r.height) < 6 &&
        (cs.borderRadius.includes('%') ||
          parseFloat(cs.borderRadius) >= r.width / 2 - 2) &&
        el.querySelector('svg')
      )
    })
    const dots = [...work.querySelectorAll('*')].filter((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return (
        r.width > 3 &&
        r.width < 14 &&
        Math.abs(r.width - r.height) < 3 &&
        cs.borderRadius.includes('%')
      )
    })
    return {
      arrowCount: arrows.length,
      arrowVisible: arrows.map(
        (a) =>
          getComputedStyle(a).display !== 'none' && a.getBoundingClientRect().width > 0,
      ),
      dotCount: dots.length,
    }
  })

  out[label].type = await page.evaluate(() => {
    const pick = (finder) => {
      const el = finder()
      if (!el) return null
      const cs = getComputedStyle(el)
      return { fs: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing }
    }
    return {
      h1: pick(() => document.querySelector('h1')),
      statement: pick(() =>
        [...document.querySelectorAll('h2,p,div')].find((e) =>
          (e.textContent || '').trim().startsWith('We craft brand'),
        ),
      ),
      sectionHeading: pick(() =>
        [...document.querySelectorAll('h2,h3')].find((e) =>
          (e.textContent || '').includes('services'),
        ),
      ),
    }
  })

  await page.close()
}

await browser.close()
writeFileSync('reference/measure-live.json', JSON.stringify(out, null, 2))
console.log(JSON.stringify(out, null, 1))
