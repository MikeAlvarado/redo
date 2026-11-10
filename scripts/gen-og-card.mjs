// Renders the link preview from the closing card's treatment (the Canova
// Psyche photograph under the red-orange wash, the site's own fonts):
//   public/og-card.png  1200 x 630, the settled frame (og:image)
//   public/og-card.mp4  the same card coming in over six seconds (og:video,
//                       which iMessage plays inside the link bubble)
// Needs the built site being served and ffmpeg on the PATH:
//   node scripts/gen-og-card.mjs http://localhost:4173
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'

const origin = process.argv[2] ?? 'http://localhost:4173'
const FPS = 30
const SECONDS = 6

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(origin, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  const words = ['Technology', 'that', 'makes', 'life', '<i>easier</i>', 'for', 'everyone.']
  const headline = words
    .map(
      (word, index) =>
        `<span class="word" style="animation-delay:${(0.7 + index * 0.16).toFixed(2)}s">${word}</span>`,
    )
    .join(' ')
  document.body.innerHTML = `
  <style>
    @keyframes settle { from { transform: scale(1.14); filter: grayscale(1) contrast(1.9) brightness(0.72) } to { transform: scale(1); filter: grayscale(1) contrast(1.9) brightness(1.02) } }
    @keyframes glow { from { opacity: 0.25 } to { opacity: 1 } }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); filter: blur(10px) } to { opacity: 1; transform: none; filter: blur(0) } }
    @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
    .card { position: fixed; inset: 0; overflow: hidden; background: radial-gradient(60% 90% at 50% 36%, #E2542C 0%, #A32B14 45%, #4A100A 78%, #1A0503 100%) }
    .photo { position: absolute; left: 236px; top: -34px; width: 880px; height: 880px; mix-blend-mode: multiply; transform-origin: 42% 38%; -webkit-mask-image: radial-gradient(52% 50% at 42% 38%, #000 55%, transparent 100%); mask-image: radial-gradient(52% 50% at 42% 38%, #000 55%, transparent 100%); animation: settle 5.2s cubic-bezier(0.16, 1, 0.3, 1) both }
    .glow { position: absolute; inset: 0; background: radial-gradient(30% 50% at 50% 38%, rgba(250, 104, 0, 0.4) 0%, transparent 74%); mix-blend-mode: screen; animation: glow 4s ease-out both }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 22%, transparent 56%, rgba(12, 2, 1, 0.92) 86%) }
    .mark { position: absolute; left: 48px; top: 36px; font: italic 400 34px/1 'Instrument Serif', serif; color: #EAE7E0; animation: fade 0.8s ease-out 0.2s both }
    .label { position: absolute; right: 48px; top: 44px; font: 500 17px/1 'Mona Sans Variable', sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255, 224, 224, 0.8); animation: fade 0.8s ease-out 0.35s both }
    .copy { position: absolute; inset: auto 0 44px 0; text-align: center }
    .headline { font: 400 60px/1.05 'Instrument Serif', serif; letter-spacing: -0.01em; color: #FFE9E4; text-shadow: 0 0 30px rgba(255, 212, 212, 0.3) }
    .word { display: inline-block; animation: rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both }
    .sub { margin-top: 14px; font: 400 23px/1.3 'Mona Sans Variable', sans-serif; color: rgba(255, 233, 228, 0.85); animation: fade 0.9s ease-out 2.3s both }
  </style>
  <div class="card">
    <img class="photo" src="/art/closing-psyche-960.webp">
    <div class="glow"></div>
    <div class="shade"></div>
    <div class="mark">Mike.</div>
    <div class="label">Engineer &amp; founder · YC S21</div>
    <div class="copy">
      <div class="headline">${headline}</div>
      <div class="sub">Mike Alvarado. Engineer and founder (Kodda, YC S21), from Monterrey.</div>
    </div>
  </div>`
})
await page.locator('img').evaluate((img) => img.decode())
await page.evaluate(() => document.fonts.ready)

// Every animation is paused and stepped by hand, so each frame is exact
// whatever the machine's speed.
const seek = (ms) =>
  page.evaluate((time) => {
    for (const animation of document.getAnimations()) {
      animation.pause()
      animation.currentTime = time
    }
  }, ms)

const frames = mkdtempSync(join(tmpdir(), 'og-card-'))
const total = FPS * SECONDS
for (let frame = 0; frame < total; frame++) {
  await seek((frame / FPS) * 1000)
  await page.screenshot({ path: join(frames, `${String(frame).padStart(4, '0')}.png`) })
}
await seek(SECONDS * 1000)
await page.screenshot({ path: 'public/og-card.png' })
await browser.close()

execFileSync(
  'ffmpeg',
  [
    '-y', '-loglevel', 'error',
    '-framerate', String(FPS),
    '-i', join(frames, '%04d.png'),
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-crf', '21', '-preset', 'slow',
    '-movflags', '+faststart', '-an',
    'public/og-card.mp4',
  ],
  { stdio: 'inherit' },
)
rmSync(frames, { recursive: true, force: true })
