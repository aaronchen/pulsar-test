import { test, expect } from '@playwright/test'
import { Utils } from '../../helpers/Utils'

test.describe('SSRS Test Suite', () => {
  test('can show Product Information Summary Report by Product Lines', async ({ page }) => {
    test.slow()

    await page.goto('/pulsar2/SsrsReport/ShowContent?reportId=20')

    const productLineOptions = Utils.sampleSize(await page.$$('#lstProductLineAvailable option'), 10)

    for (const option of productLineOptions) {
      await page.locator('#cmdRemoveAll >> nth=0').click()

      await page.locator('#lstProductLineAvailable').selectOption(option)

      await page.locator('#cmdAdd >> nth=0').click()

      const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('#btnSave').click()])
      await popup.waitForEvent('load')

      await expect(page.locator('text=Product Information Summary Report')).toBeVisible()

      await popup.close()
      await page.bringToFront()
    }
  })
})
