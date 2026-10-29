import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const lang of ['en', 'es'] as const) {
  test(`axe reports no serious or critical violations (${lang})`, async ({ page }) => {
    await page.goto('/')
    if (lang === 'es') {
      await page.getByRole('button', { name: 'ES', exact: true }).click()
      await page.waitForTimeout(400)
    }
    await page.waitForTimeout(800)

    const results = await new AxeBuilder({ page }).analyze()
    const blocking = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    )
    expect(
      blocking.flatMap((violation) =>
        violation.nodes.map(
          (node) => `${violation.id}: ${node.target.join(' ')} — ${node.failureSummary}`,
        ),
      ),
    ).toEqual([])
  })
}
