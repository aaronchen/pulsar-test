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

  test('should have correct Systems Engineering PM name', async ({ page }) => {
    await page.locator('#quickSearchTextbox').fill('anna')
    await page.locator('#resultTypeArea >> text=Anna 1.1').click()
    await page.locator('text=See Full Roster').click()

    // const name = page.locator('td:right-of(:nth-match(:text("Systems Engineering PM"), 1))').nth(0)
    const name = page.locator(':nth-match(:text("Systems Engineering PM"), 1)').locator('xpath=..').locator('td')

    await expect(name).toContainText('Eddy Liu')
  })

  test('should have correct Team Roaster', async ({ page }) => {
    await page.locator('#quickSearchTextbox').fill('anna')
    await page.locator('#resultTypeArea >> text=Anna 1.1').click()
    await page.locator('text=See Full Roster').click()

    const team = [
      { role: 'System Manager', name: 'Chang, Michael' },
      { role: 'Configuration Manager', name: 'srihari A' },
      { role: 'Systems Engineering PM', name: 'Eddy Liu' },
      { role: 'Program Office Program Manager', name: 'Lin, Rachel' },
      { role: 'Marketing/Product Mgmt', name: '	yeh, wing' }
    ]

    for (const member of team) {
      const name = page.locator(`:nth-match(th:text("${member.role}"), 1)`).locator('xpath=..').locator('td')
      await expect(name).toContainText(member.name)
    }
  })

  test('should have correct release badge next to System Team', async ({ page }) => {
    await page.locator('#quickSearchTextbox').fill('anna')
    await page.locator('#resultTypeArea >> text=Anna 1.1').click()

    const release = 'Feb 2018'
    const releaseBadge = page.locator('.GeneralPageContent--table--title h6 .badge')
    const filterButtonLocator = page.locator('#ProductReleaseIdTitle')
    const filterDropdownLocator = page.locator('#FilterContent')

    const currentRelease = await filterButtonLocator.locator('.Filter--item--value').textContent()

    if (!currentRelease?.includes(release)) {
      await filterButtonLocator.locator('.Pulsar-filter').click()
      await filterDropdownLocator.locator('label', { hasText: release }).click()
      await filterDropdownLocator.locator('#btnApply').click()
    }

    await expect(releaseBadge).toContainText(release)
  })
})
