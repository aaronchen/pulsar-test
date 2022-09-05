import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/pulsar2')
})

test.afterAll(async ({ page }) => {
  await page.close()
})

test.describe('Pilot Suite', () => {
  test('should have a correct email address in My Profile - basic', async ({ page }) => {
    await page.locator('#userName').click()
    await page.locator('#UserDropdownMenu >> text=My Profile').click()

    expect(await page.inputValue('#txtEmail')).toEqual('aaron.chen@hp.com')
  })
})
