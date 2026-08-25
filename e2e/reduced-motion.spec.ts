import { expect, test } from '@playwright/test'

test.use({ contextOptions: { reducedMotion: 'reduce' } })

test('every section renders in its final state and smooth scroll is off', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForTimeout(800)

  const lenisActive = await page.evaluate(() =>
    document.documentElement.classList.contains('lenis'),
  )
  expect(lenisActive).toBe(false)

  const wordOpacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-word]')).map((word) =>
      Number(getComputedStyle(word).opacity),
    ),
  )
  expect(wordOpacities.length).toBeGreaterThan(20)
  for (const opacity of wordOpacities) {
    expect(opacity).toBe(1)
  }

  const pinSpacers = await page.evaluate(
    () => document.querySelectorAll('.pin-spacer').length,
  )
  expect(pinSpacers).toBe(0)

  const heroHeadline = page.getByText('Imagine a space')
  await expect(heroHeadline).toBeVisible()

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)
  const statValues = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('span[class*="numeral"] span')).map(
      (span) => span.textContent,
    ),
  )
  expect(statValues.join(' ')).toContain('24')
})
