import { test as base, expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../models/Base'

type Options = {
  basePage: Page & BasePage
}

const test = base.extend<Options>({
  basePage: async ({ page }, use) => {
    await use(Object.assign(page, new BasePage(page)))
  }
})

export { test, expect, Locator, Page }
