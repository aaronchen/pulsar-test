import { ElementHandle, Locator, Page } from '@playwright/test'
import { Table } from './Table'

/* === Change Request Tab === */

type ChangeRequestTableColumnNameType =
  | 'dcrId'
  | 'changeType'
  | 'submitter'
  | 'zsrpReady'
  | 'avRequired'
  | 'qualificationRequired'
  | 'approved'
  | 'available'
  | 'summary'
  | 'release'

type ChangeRequestTableMenuNameType = 'sendEmail' | 'properties' | 'viewHistory'

class ChangeRequestTab {
  readonly createDcrLink: Locator
  readonly table: Table<ChangeRequestTableColumnNameType, ChangeRequestTableMenuNameType>

  constructor(page: Page) {
    this.createDcrLink = page.locator('[data-shortcutid="200"]')
    this.table = new Table<ChangeRequestTableColumnNameType, ChangeRequestTableMenuNameType>(
      page,
      'tileGrid',
      {
        dcrId: 'DcrId',
        changeType: 'ChangeType',
        submitter: 'Submitter',
        zsrpReady: 'ZsrpReadyFormatted',
        avRequired: 'AvRequired',
        qualificationRequired: 'QualificationRequired',
        approved: 'ActualDate',
        available: 'AvailableForTest',
        summary: 'Summary',
        release: 'ReleaseNames'
      },
      {
        sendEmail: 'SendEmail',
        properties: 'Properties',
        viewHistory: 'ViewHistory'
      }
    )
  }
}

/* === Deliverable Tab === */

type DeliverableHardwareTableColumnNameType =
  | 'id'
  | 'componentCategory'
  | 'name'
  | 'vendor'
  | 'partNumber'
  | 'hw'
  | 'fw'
  | 'rev'
  | 'release'
  | 'modelNumber'
  | 'qualStatus'
  | 'pilotStatus'
  | 'devSignOff'
  | 'mitSignOff'
  | 'odmSignOff'
  | 'commSignOff'

type DeliverableHardwareTableMenuNameType = 'removeRoot' | 'targetVersions' | 'properties'

class DeliverableTab {
  readonly hardwareTable: Table<DeliverableHardwareTableColumnNameType, DeliverableHardwareTableMenuNameType>

  constructor(page: Page) {
    this.hardwareTable = new Table<DeliverableHardwareTableColumnNameType, DeliverableHardwareTableMenuNameType>(
      page,
      'tileGrid',
      {
        id: 'DeliverableVersionId',
        componentCategory: 'ComponentCategory',
        name: 'DeliverableName',
        vendor: 'VendorName',
        partNumber: 'PartNumber',
        hw: 'ComponentVersionName',
        fw: 'FirmwareVersion',
        rev: 'Revision',
        release: 'Release',
        modelNumber: 'ModelNumber',
        qualStatus: 'TestStatusValue',
        pilotStatus: 'PilotStatusValue',
        devSignOff: 'DeveloperTestStatusValue',
        mitSignOff: 'IntegrationTestStatusValue',
        odmSignOff: 'OdmTestStatusValue',
        commSignOff: 'WwanTestStatusValue'
      },
      {
        removeRoot: 'RemoveRoot',
        targetVersions: 'TargetVersions',
        properties: 'Properties'
      }
    )
  }
}

/* === Product Page === */

enum ProductTab {
  Certifications = '#tabLink2',
  ChangeRequest = '#tabLink3',
  Deliverables = '#tabLink4',
  Document = '#tabLink5',
  General = '#tabLink6',
  Images = '#tabLink7',
  Localization = '#tabLink8',
  Observations = '#tabLink9',
  Requirements = '#tabLink10',
  Schedule = '#tabLink11',
  Service = '#tabLink12',
  SMR = '#tabLink13',
  SupplyChain = '#tabLink14'
}

class ProductPage {
  readonly page: Page
  readonly changeRequestTab: ChangeRequestTab
  readonly deliverableTab: DeliverableTab

  constructor(page: Page) {
    this.page = page
    this.changeRequestTab = new ChangeRequestTab(page)
    this.deliverableTab = new DeliverableTab(page)
  }

  async gotoTab(tab: ProductTab) {
    await this.page.waitForSelector(tab)

    const $productTab = (await this.page.$(tab)) as ElementHandle<HTMLElement>
    const isActiveTab = await $productTab.evaluate((el) => el.classList.contains('PageHeader--tabs--link__active'))

    if (!isActiveTab) {
      await $productTab.click()
      await this.page.waitForLoadState('load')
    }
  }
}

export { ProductPage, ProductTab }
