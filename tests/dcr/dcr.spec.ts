import { test, expect } from '@playwright/test'
import { Text } from '../../helpers/Text'
import { QuickSearch, UserInfo } from '../../models/Navigation'
import { ProductPage, ProductTab } from '../../models/Product'
import { DcrPage, DcrAttachmentFrame } from '../../models/Dcr'

// test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await page.goto('/pulsar2')
})

test.describe('DCR Test Suite @daily', () => {
  test('can open a DCR page from Quick Search', async ({ page }) => {
    await page.locator('#quickSearchTextbox').fill('Add Change Request')
    await page.locator('#resultCommandArea >> text=Add Change Request').click()

    const dcrHeader = page.locator('.DcrHeader')
    await dcrHeader.waitFor()
    await expect(dcrHeader).toHaveText('Add Change Request')
  })

  test('can create a DCR from Product page', async ({ page }) => {
    test.slow()

    const productName = '20190427ForUSAServer'

    const quickSearch = new QuickSearch(page)
    await quickSearch.fillAndClick(productName)

    const productPage = new ProductPage(page)
    await productPage.gotoTab(ProductTab.ChangeRequest)

    const [newPage] = await Promise.all([
      productPage.page.waitForEvent('popup'),
      productPage.changeRequestTab.createDcrLink.click()
    ])

    await Promise.all([newPage.bringToFront(), newPage.waitForLoadState()])

    const dcrPage = new DcrPage(newPage)

    await dcrPage.changeCategories.sku.check({ force: true })

    const summary = `Summary-${Text.random(15, { whitespace: true })}-${Text.timestamp()}`
    await dcrPage.summary.fill(summary)

    await dcrPage.products.editSelection.click()
    await dcrPage.products.productName.fill(productName)
    await dcrPage.products.productName.press('Enter')
    await dcrPage.products.table.locator('td', { hasText: productName }).waitFor()
    await dcrPage.products.addToSelection.click()
    await dcrPage.products.confirm.click()

    await dcrPage.fillReviewer('Kent Yu')

    const description = `Description-${Text.random(200, { whitespace: true, punctuation: true })}`
    await dcrPage.description.fill(description)

    const justification = `Justification-${Text.random(200, { whitespace: true, punctuation: true })}`
    await dcrPage.justification.fill(justification)

    await dcrPage.regions.all.click()

    await dcrPage.additionalOptions.avRequired.check({ force: true })
    await dcrPage.additionalOptions.qualificationRequired.check({ force: true })

    await dcrPage.customerImpact.check({ force: true })

    const [newFrame] = await Promise.all([
      dcrPage.page.waitForEvent('frameattached'),
      dcrPage.attachments.attachment1.click()
    ])

    const attachmentFrame = new DcrAttachmentFrame(newFrame)
    await attachmentFrame.file.setInputFiles('./artifacts/sample.pdf')
    await attachmentFrame.save.click()
    await dcrPage.attachments.attachment1Path.waitFor()

    const today = Text.daySince(0)
    const tomorrow = Text.daySince(1)
    await dcrPage.samplesAvailableDate.fill(today)
    await dcrPage.targetApprovalDate.fill(tomorrow)
    await dcrPage.rtpDate.fill(today)
    await dcrPage.endOfManufacturingDate.fill(tomorrow)

    await dcrPage.fillNotifyOnApproval('Aaron Chen', 'aaron.chen@hp.com')

    await dcrPage.submit.click()

    await dcrPage.confirmationModel.yes.click()

    await dcrPage.informationModal.ok.waitFor()

    await expect(dcrPage.informationModal.body).toContainText('Successfully Created 1 DCRs')
  })

  test('can use Table page object model', async ({ page }) => {
    const productName = '20190427ForUSAServer'

    const quickSearch = new QuickSearch(page)
    await quickSearch.fillAndClick(productName)

    const productPage = new ProductPage(page)
    await productPage.gotoTab(ProductTab.Deliverables)

    await productPage.deliverableTab.hardwareTable.filter('name', 'jay')

    // await productPage.deliverableTab.hardwareTable.findHeader('componentCategory').click()

    await productPage.deliverableTab.hardwareTable.filter('name', '')

    // await productPage.deliverableTab.hardwareTable.findRow('name', 'HP 50W Slim AC Adapter').click({ button: 'right' })
    // await productPage.deliverableTab.hardwareTable.clickMenu('properties')
    // await productPage.page.waitForTimeout(3000)

    // await productPage.deliverableTab.hardwareTable.findCell('name', 'HP 50W Slim AC Adapter').click()
    // await Promise.all([
    //   productPage.page.waitForEvent('popup'),
    //   productPage.deliverableTab.hardwareTable.findCell('name', 'HP 50W Slim AC Adapter').locator('a').click()
    // ])
  })

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
    await userInfo.impersonate('Max Yu')
    await userInfo.username.click()
    await userInfo.myProfile.click()

    expect(await page.inputValue('#txtEmail')).toEqual('max.yu@hp.com')
  })
})
