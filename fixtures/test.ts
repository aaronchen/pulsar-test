import { test as base, expect, Page } from '@playwright/test'
import { BasePage } from '../models/Base'

type Options = {
  basePage: BasePage
}

const test = base.extend<Options>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page))
  }
})

export { test, expect }
