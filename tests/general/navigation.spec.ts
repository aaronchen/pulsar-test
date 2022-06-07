import { test, expect } from '@playwright/test'
import { QuickSearch, UserInfo } from '../../models/Navigation'

test.beforeEach(async ({ page }) => {
  await page.goto('/pulsar2')
})

test.describe('Navigation Test Suite', () => {
  test('can Quick Search', async ({ page }) => {
    const quickSearch = new QuickSearch(page)

    await quickSearch.quickSearchText.fill('anna 1.1')
    await quickSearch.waitForSearchResults()
    expect(await quickSearch.quickSearchResults.count()).toBeGreaterThan(0)
  })

  test('can start and stop impersonation', async ({ page }) => {
    const userInfo = new UserInfo(page)

    await userInfo.impersonate('Kent Yu')
    await expect(userInfo.username).toContainText('Kent Yu')

    await userInfo.impersonate('Max Yu')
    await expect(userInfo.username).toContainText('Max Yu')
  })
})
