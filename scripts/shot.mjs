import { chromium } from '@playwright/test'

const url = process.argv[2] ?? 'http://localhost:5173/'
const name = process.argv[3] ?? 'shot'
const scrollY = Number(process.argv[4] ?? 0)
const width = Number(process.argv[5] ?? 1440)
const height = Number(process.argv[6] ?? 900)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height } })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
if (scrollY > 0) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY)
  await page.waitForTimeout(1800)
}
await page.screenshot({ path: `reference/self-check/${name}.png` })
await browser.close()
console.log(`saved reference/self-check/${name}.png`)
