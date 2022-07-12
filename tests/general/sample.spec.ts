import { test, expect, ElementHandle } from '@playwright/test'
import { Database } from '../../helpers/Database'
import { Excel } from '../../helpers/Excel'
import { Utils } from '../../helpers/Utils'
import { QuickSearch, UserInfo } from '../../models/Navigation'
import { ProductPage } from '../../models/Product'
import { Table } from '../../models/Table'

test.beforeEach(async ({ page }) => {
  await page.goto('/pulsar2')
})

test.afterAll(async ({ page }) => {
  await page.close()
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

  test('can download Auto Bridge Root Setting Report', async ({ page }) => {
    await page.locator('#quickSearchTextbox').fill('Auto Bridge')
    await page.locator('#resultCommandArea >> text=Hardware Deliverables Auto Bridge Root Setting Report').click()

    await page.selectOption('#BusinessSegmentList .dualList-select[data-control="left"]', ['1', '2'])
    await page.locator('#BusinessSegmentList .dualList-add').click()

    const productListSelect = await page.locator('#ProductList .dualList-select[data-control="left"]').elementHandle()
    await productListSelect?.selectOption([
      (await productListSelect.$('option:text("Bran")')) as ElementHandle,
      (await productListSelect.$('option:text("Cubano")')) as ElementHandle,
      (await productListSelect.$('option:text("Decaf")')) as ElementHandle
    ])
    await page.locator('#ProductList .dualList-add').click()

    await page.waitForSelector('#ReleaseList .dualList-select[data-control="left"] option')
    await page.locator('#ReleaseList .dualList-add-all').click()
    await page.waitForSelector('#ComponentCategoryList .dualList-select[data-control="left"] option')
    await page.locator('#ComponentCategoryList .dualList-add-all').click()
    await page.waitForSelector('#ComponentRootList .dualList-select[data-control="left"] option')
    await page.locator('#ComponentRootList .dualList-add-all').click()

    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#btnExport').click()])
    const file = (await download.path()) as string

    expect(Utils.isPath(file)).toBeTruthy()
    expect(download.suggestedFilename().endsWith('.xlsx')).toBeTruthy()

    const firstHeader = Excel.getCellValue(file, 'F1') as string
    expect(firstHeader).toEqual('Bran')

    const secondHeader = Excel.getCellValue(file, { c: 6, r: 0 }) as string
    expect(secondHeader).toEqual('Cubano')

    expect(Excel.isEqual(file, file)).toBeTruthy()
  })

  test('can open Update Image Strategy window - Table page object', async ({ page }) => {
    const quickSearch = new QuickSearch(page)
    await quickSearch.fillAndClick('cubano', { resultText: 'HP EliteDesk 805 G6 Desktop Mini PC' })

    const productPage = new ProductPage(page)
    await productPage.gotoTab('Deliverables')

    type SoftwareColumnNameType =
      | 'target'
      | 'id'
      | 'componentCategory'
      | 'name'
      | 'language'
      | 'partNumber'
      | 'version'
      | 'release'
      | 'pin'
      | 'alerts'
      | 'img'
      | 'corpReady'
      | 'targetNotes'
      | 'distribution'
      | 'images'

    type SoftwareTableMenuNameType = 'removeTarget' | 'updateTargetNotes' | 'updateImageStrategy'

    const softwareTable = new Table<SoftwareColumnNameType, SoftwareTableMenuNameType>(
      page,
      'tileGrid',
      {
        target: 'Target',
        id: 'DeliverableVersionId',
        componentCategory: 'ComponentCategory',
        name: 'DeliverableName',
        language: 'Language',
        partNumber: 'PartNumber',
        version: 'ComponentVersion',
        release: 'Release',
        pin: 'InternalRevision',
        alerts: 'Alerts',
        img: 'DisplayImage',
        corpReady: 'CorpReadyImage',
        targetNotes: 'TargetNotes',
        distribution: 'Distribution',
        images: 'Image'
      },
      {
        removeTarget: 'RemoveTarget',
        updateTargetNotes: 'UpdateTargetNotes',
        updateImageStrategy: 'UpdateImageStrategy'
      }
    )

    await softwareTable.filter('name', 'flag')
    await softwareTable.filter('partNumber', 'b2e')
    await softwareTable.locateRow('name', 'Flag').click({ button: 'right' })

    const [imageStrategyPage] = await Promise.all([
      productPage.page.waitForEvent('popup'),
      softwareTable.clickMenu('updateImageStrategy')
    ])

    await imageStrategyPage.bringToFront()

    const componentLocator = imageStrategyPage
      .locator('.PopupForm--title:text("Component")')
      .locator('xpath=..')
      .locator('.PopupForm--input--readonlyInfo')
    await expect(componentLocator).toContainText('Flag - Bypass MiniDiags')
  })

  test('can open Update Image Strategy window - Product page object', async ({ page }) => {
    const quickSearch = new QuickSearch(page)
    await quickSearch.fillAndClick('cubano', { resultText: 'HP EliteDesk 805 G6 Desktop Mini PC' })

    const productPage = new ProductPage(page)
    await productPage.gotoTab('Deliverables')

    await productPage.deliverableTab.setTableFiltersTo({ type: 'Software', team: 'Image Engineering' })

    const softwareTable = productPage.deliverableTab.softwareTable
    await softwareTable.filter('name', 'flag')
    await softwareTable.filter('partNumber', 'b2e')
    await softwareTable.locateRow('name', 'Flag').click({ button: 'right' })

    const [imageStrategyPage] = await Promise.all([
      productPage.page.waitForEvent('popup'),
      softwareTable.clickMenu('updateImageStrategy')
    ])

    await imageStrategyPage.bringToFront()

    const componentLocator = imageStrategyPage
      .locator('.PopupForm--title:text("Component")')
      .locator('xpath=..')
      .locator('.PopupForm--input--readonlyInfo')
    await expect(componentLocator).toContainText('Flag - Bypass MiniDiags')
  })

  test('can use Table page object model', async ({ page }) => {
    const productName = '20190427ForUSAServer'

    const quickSearch = new QuickSearch(page)
    await quickSearch.fillAndClick(productName)

    const productPage = new ProductPage(page)
    await productPage.gotoTab('Deliverables')

    await productPage.deliverableTab.setTableFiltersTo({ type: 'Software', team: 'All' })

    const hardwareTable = productPage.deliverableTab.hardwareTable

    // Filter
    await hardwareTable.filter('name', 'jay')

    // Click on a header to sort
    await hardwareTable.locateHeader('componentCategory').click()

    // Clear filter
    await hardwareTable.filter('name', '')

    // Locate row
    await hardwareTable.locateRow('name', 'ZHAN 66 Pro G1 - 8471').click({ button: 'right' })
    const [systemBoardVersionPage] = await Promise.all([
      productPage.page.waitForEvent('popup'),
      await hardwareTable.clickMenu('properties')
    ])
    systemBoardVersionPage.bringToFront()

    // Locate cell
    productPage.page.bringToFront()
    await hardwareTable.locateCell('name', 'HP 50W Slim AC Adapter').click()
    const [acAdapterVersionPage] = await Promise.all([
      productPage.page.waitForEvent('popup'),
      hardwareTable.locateCell('name', 'HP 50W Slim AC Adapter').locator('a').click()
    ])
    acAdapterVersionPage.bringToFront()
  })

  test('can use Database helper', async () => {
    type AbtBusinessSegment = {
      ID: number
      Value: string
      IsActive: boolean
      CreatedBy: string
    }

    const db = new Database(process.env.MSSQL_CONNECTION as string)
    const results = await db.select<AbtBusinessSegment>('SELECT * FROM AbtBusinessSegment WHERE Id = 1')
    await db.close()

    expect(results[0].ID).toEqual(1)
    expect(results[0].Value).toEqual('Consumer AIO')
    expect(results[0].IsActive).toBeTruthy()
    expect(results[0].CreatedBy).toEqual('Dao, An')
  })
})
