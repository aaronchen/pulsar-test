import { Locator, Page } from '@playwright/test'

abstract class Modal {
  readonly title: Locator
  readonly body: Locator

  constructor(page: Page) {
    this.title = page.locator('#modalTitle')
    this.body = page.locator('#modalContent')
  }
}

class ConfirmationModal extends Modal {
  readonly yes: Locator
  readonly no: Locator

  constructor(page: Page) {
    super(page)
    this.yes = page.locator('#modalButtonYes')
    this.no = page.locator('#modalButtonNo')
  }
}

class OkModal extends Modal {
  readonly ok: Locator

  constructor(page: Page) {
    super(page)
    this.ok = page.locator('#modalButtonOK')
  }
}

export { ConfirmationModal, OkModal }
