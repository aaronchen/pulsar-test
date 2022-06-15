import { test, expect } from '@playwright/test'
import { UserInfo } from '../../models/Navigation'

test.beforeEach(async ({ page }) => {
  await page.goto('/pulsar2')
})

test.describe('Sample Suite', () => {
  test('should have a correct email address in My Profile - basic', async ({ page }) => {
    await page.locator('#userName').click()
    await page.locator('#UserDropdownMenu >> text=My Profile').click()

    expect(await page.inputValue('#txtEmail')).toEqual('aaron.chen@hp.com')
  })

  test('should have a correct email address in My Profile - medium', async ({ page }) => {
    await page.locator('#userName').click()

    const dropdownMenuText = await page.locator('#UserDropdownMenu').innerText()

    if (dropdownMenuText.includes('Stop Impersonation')) {
      await page.locator('#UserDropdownMenu >> text=Stop Impersonation').click()
      await page.locator('#userName').click()
    }

    await page.locator('#UserDropdownMenu >> text=My Profile').click()

    expect(await page.inputValue('#txtEmail')).toEqual('aaron.chen@hp.com')
  })

  test('should have a correct email address in My Profile - advanced', async ({ page }) => {
    const userInfo = new UserInfo(page)
    await userInfo.impersonate('max.yu@hp.com')
    await userInfo.username.click()
    await userInfo.myProfile.click()

    expect(await page.inputValue('#txtEmail')).toEqual('max.yu@hp.com')
  })

  test('can change system manager in team roaster', async ({ page }) => {
    await page.locator('#quickSearchTextbox').fill('anna')
    await page.locator('#resultTypeArea >> text=Anna 1.1').click()
    await page.locator('#SystemTeamTable >> text=Edit').click()
    await page.locator('#SysTeamAddButton_45').click()
    await page.frameLocator('#FrameElementInPulsar2').locator('#employeeName').fill('aaron chen')
    await page
      .frameLocator('#FrameElementInPulsar2')
      .locator(".ui-menu-item-wrapper:has-text('aaron.chen@hp.com')")
      .click()
    await page.frameLocator('#FrameElementInPulsar2').locator('#OkButton').click()

    expect(await page.inputValue('#SysTeamDropdown_45')).toEqual('26879')
  })
})
