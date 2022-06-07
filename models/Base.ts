import { Frame, Locator, Page } from '@playwright/test'

abstract class Base {
  protected async autocompleteFill(inputLocator: Locator, itemsLocator: Locator, name: string, matchedName?: string) {
    if (!matchedName) matchedName = name

    await inputLocator.fill(name)
    await itemsLocator.filter({ hasText: matchedName }).click()
  }
}

abstract class BaseFrame extends Base {
  readonly frame: Frame

  constructor(frame: Frame) {
    super()
    this.frame = frame
  }
}

abstract class BasePage extends Base {
  readonly page: Page

  constructor(page: Page) {
    super()
    this.page = page
  }
}

export { BaseFrame, BasePage }
