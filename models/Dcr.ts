import { Frame, Locator, Page } from '@playwright/test'
import { BasePage } from './Base'
import { ConfirmationModal, OkModal } from './Modal'

class ChangeTypes {
  readonly dcr: Locator
  readonly bcr: Locator

  constructor(page: Page) {
    this.dcr = page.locator('#rbTypeDCR')
    this.bcr = page.locator('#rbTypeNewBCR')
  }
}

class ChangeCategories {
  readonly requirement: Locator
  readonly sku: Locator
  readonly software: Locator
  readonly commodity: Locator
  readonly docs: Locator
  readonly other: Locator

  constructor(page: Page) {
    this.requirement = page.locator('#ReqChange')
    this.sku = page.locator('#SKUChange')
    this.software = page.locator('#ImageChange')
    this.commodity = page.locator('#CommodityChange')
    this.docs = page.locator('#DocChange')
    this.other = page.locator('#OtherChange')
  }
}

class Products {
  readonly editSelection: Locator
  readonly productName: Locator
  readonly addToSelection: Locator
  readonly table: Locator
  readonly confirm: Locator

  constructor(page: Page) {
    this.editSelection = page.locator('#editSelection')
    this.productName = page.locator('#TagInput_ProductName')
    this.addToSelection = page.locator('#AddAllToSelection')
    this.table = page.locator('#productSearchView table')
    this.confirm = page.locator('#confirmBtn')
  }
}

class Regions {
  readonly na: Locator
  readonly la: Locator
  readonly emea: Locator
  readonly apj: Locator
  readonly all: Locator

  constructor(page: Page) {
    this.na = page.locator('#NA')
    this.la = page.locator('#LA')
    this.emea = page.locator('#EMEA')
    this.apj = page.locator('#APJ')
    this.all = page.locator('#cmdAllGeos')
  }
}

class AdditionalOptions {
  readonly zsrpRequired: Locator
  readonly avRequired: Locator
  readonly qualificationRequired: Locator
  readonly globalSeriesRequired: Locator

  constructor(page: Page) {
    this.zsrpRequired = page.locator('#ZsrpRequired')
    this.avRequired = page.locator('#AVRequired')
    this.qualificationRequired = page.locator('#QualificationRequired')
    this.globalSeriesRequired = page.locator('#GlobalSeriesRequired')
  }
}

class Attachments {
  readonly attachment1: Locator
  readonly attachment2: Locator
  readonly attachment3: Locator
  readonly attachment4: Locator
  readonly attachment5: Locator
  readonly attachment1Path: Locator
  readonly attachment2Path: Locator
  readonly attachment3Path: Locator
  readonly attachment4Path: Locator
  readonly attachment5Path: Locator

  constructor(page: Page) {
    this.attachment1 = page.locator('#UploadAddLinks1 a')
    this.attachment2 = page.locator('#UploadAddLinks2 a')
    this.attachment3 = page.locator('#UploadAddLinks3 a')
    this.attachment4 = page.locator('#UploadAddLinks4 a')
    this.attachment5 = page.locator('#UploadAddLinks5 a')
    this.attachment1Path = page.locator('#UploadPath1')
    this.attachment2Path = page.locator('#UploadPath2')
    this.attachment3Path = page.locator('#UploadPath3')
    this.attachment4Path = page.locator('#UploadPath4')
    this.attachment5Path = page.locator('#UploadPath5')
  }
}

class DcrPage extends BasePage {
  readonly changeTypes: ChangeTypes
  readonly changeCategories: ChangeCategories
  readonly summary: Locator
  readonly products: Products
  readonly reviewers: Locator
  readonly reviewersAutocompleteItems: Locator
  readonly regions: Regions
  readonly description: Locator
  readonly justification: Locator
  readonly additionalOptions: AdditionalOptions
  readonly customerImpact: Locator
  readonly attachments: Attachments
  readonly samplesAvailableDate: Locator
  readonly targetApprovalDate: Locator
  readonly rtpDate: Locator
  readonly endOfManufacturingDate: Locator
  readonly notifyOnApproval: Locator
  readonly notifyOnApprovalAutocompleteItems: Locator
  readonly submit: Locator
  readonly confirmationModel: ConfirmationModal
  readonly informationModal: OkModal

  constructor(page: Page) {
    super(page)

    this.changeTypes = new ChangeTypes(page)
    this.changeCategories = new ChangeCategories(page)
    this.summary = page.locator('#Summary')
    this.products = new Products(page)
    this.reviewers = page.locator('#reviewerinput')
    this.reviewersAutocompleteItems = page.locator('#Autocomplete_Reviewer .ui-menu-item-wrapper')
    this.regions = new Regions(page)
    this.description = page.locator('#Description')
    this.justification = page.locator('#Justification')
    this.additionalOptions = new AdditionalOptions(page)
    this.customerImpact = page.locator('#customerImpact')
    this.attachments = new Attachments(page)
    this.samplesAvailableDate = page.locator('#AvailDate')
    this.targetApprovalDate = page.locator('#TargetApprovalDate')
    this.rtpDate = page.locator('#RTPDate')
    this.endOfManufacturingDate = page.locator('#RASDiscoDate')
    this.notifyOnApproval = page.locator('#notifyinput')
    this.notifyOnApprovalAutocompleteItems = page.locator('#Autocomplete_Notify .ui-menu-item-wrapper')
    this.submit = page.locator('.Button__primary[type="submit"]')
    this.confirmationModel = new ConfirmationModal(page)
    this.informationModal = new OkModal(page)
  }

  async fillReviewer(name: string, matchedName?: string) {
    await this.autocompleteFill(this.reviewers, this.reviewersAutocompleteItems, name, matchedName)
  }

  async fillNotifyOnApproval(name: string, matchedName?: string) {
    await this.autocompleteFill(this.notifyOnApproval, this.notifyOnApprovalAutocompleteItems, name, matchedName)
  }
}

class DcrAttachmentFrame {
  readonly frame: Frame
  readonly file: Locator
  readonly save: Locator

  constructor(frame: Frame) {
    this.frame = frame
    this.file = frame.locator('#files')
    this.save = frame.locator('button[onclick*="fileSave"]')
  }
}

export { DcrPage, DcrAttachmentFrame }
