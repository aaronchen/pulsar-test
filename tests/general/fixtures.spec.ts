import { test, expect } from '../../fixtures/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/pulsar2')
})

test('should have basePage', async ({ basePage }) => {
  await basePage.locator('#quickSearchTextbox').fill('anna')

  expect(await basePage.waitForText('#resultTypeArea', 'Anna')).toBeTruthy()
})
