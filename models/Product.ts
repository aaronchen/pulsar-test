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

type DeliverableSoftwareTableColumnNameType =
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

type DeliverableSoftwareTableMenuNameType = 'removeTarget' | 'updateTargetNotes' | 'updateImageStrategy'

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
  protected readonly page: Page
  readonly softwareTable: Table<DeliverableSoftwareTableColumnNameType, DeliverableSoftwareTableMenuNameType>
  readonly hardwareTable: Table<DeliverableHardwareTableColumnNameType, DeliverableHardwareTableMenuNameType>

  constructor(page: Page) {
    this.page = page

    this.softwareTable = new Table<DeliverableSoftwareTableColumnNameType, DeliverableSoftwareTableMenuNameType>(
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

  async setTableFiltersTo(filters: {
    type: 'Software' | 'Hardware' | 'Firmware' | 'Documentation'
    team?: string
    filter?: string
    release?: string
  }) {
    const filterButton = this.page.locator('.Pulsar-filter:visible')
    const typeLocator = this.page.locator(`[for*="DelTypeIdOption_${filters.type}"]`)
    let teamLocator: Locator
    let filterLocator: Locator
    let releaseLocator: Locator
    const applyButton = this.page.locator('#btnApply')

    await filterButton.click()
    await typeLocator.click()

    if (filters.team) {
      teamLocator = this.page.locator('[for*="DeliverableTeamIdOption_"]', { hasText: filters.team })
      await teamLocator.click()
    }

    if (filters.filter) {
      filterLocator = this.page.locator('[for*="FilterOption_"]', { hasText: filters.filter })
      await filterLocator.click()
    }

    if (filters.release) {
      releaseLocator = this.page.locator('[for*="ProductReleaseOption_"]', { hasText: filters.release })
      await releaseLocator.click()
    }

    if (await applyButton.isEnabled()) {
      await applyButton.click()
      await applyButton.waitFor({ state: 'hidden' })
      await this.page.waitForLoadState('load')
    } else {
      await filterButton.click()
    }
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
