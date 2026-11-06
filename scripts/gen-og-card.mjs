// Renders public/og-card.png (1200 x 630) from the closing card's treatment:
// the Canova Psyche photograph under the red-orange wash, with the site's
// own fonts. Needs the built site being served: node scripts/gen-og-card.mjs
// http://localhost:4173
import { chromium } from 'playwright'

const origin = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto(origin, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  const label =
    "position:absolute;top:44px;font:500 17px/1 'Mona Sans Variable',sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,224,224,0.8)"
  document.body.innerHTML = `
  <div style="position:fixed;inset:0;overflow:hidden;background:radial-gradient(60% 90% at 50% 36%,#E2542C 0%,#A32B14 45%,#4A100A 78%,#1A0503 100%)">
    <img src="/art/closing-psyche-960.webp" style="position:absolute;left:236px;top:-34px;width:880px;height:880px;mix-blend-mode:multiply;filter:grayscale(1) contrast(1.9) brightness(1.02);-webkit-mask-image:radial-gradient(52% 50% at 42% 38%,#000 55%,transparent 100%);mask-image:radial-gradient(52% 50% at 42% 38%,#000 55%,transparent 100%)">
    <div style="position:absolute;inset:0;background:radial-gradient(30% 50% at 50% 38%,rgba(250,104,0,0.4) 0%,transparent 74%);mix-blend-mode:screen"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,transparent 22%,transparent 56%,rgba(12,2,1,0.92) 86%)"></div>
    <div style="position:absolute;left:48px;top:36px;font:italic 400 34px/1 'Instrument Serif',serif;color:#EAE7E0">Mike.</div>
    <div style="${label};right:48px">Engineer &amp; founder · YC S21</div>
    <div style="position:absolute;inset:auto 0 44px 0;text-align:center">
      <div style="font:400 60px/1.05 'Instrument Serif',serif;letter-spacing:-0.01em;color:#FFE9E4;text-shadow:0 0 30px rgba(255,212,212,0.3)">Technology that makes life <i>easier</i> for everyone.</div>
      <div style="margin-top:14px;font:400 23px/1.3 'Mona Sans Variable',sans-serif;color:rgba(255,233,228,0.85)">Mike Alvarado. Engineer and founder (Kodda, YC S21), from Monterrey.</div>
    </div>
  </div>`
})
await page.locator('img').evaluate((img) => img.decode())
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: 'public/og-card.png' })
await browser.close()
