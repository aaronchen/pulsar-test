import { Locator, Page } from '@playwright/test'

class QuickSearch {
  readonly page: Page
  readonly quickSearchText: Locator
  readonly quickSearchResults: Locator
  readonly resultsFound: Locator

  constructor(page: Page) {
    this.page = page
    this.quickSearchText = page.locator('#quickSearchTextbox')
    this.quickSearchResults = page.locator('#tblSearchResult tbody a')
    this.resultsFound = page.locator('#totalQueryTime')
  }

  async fillAndClick(searchText: string, options: { nth?: number; resultText?: string } = { nth: 0 }) {
    options = { nth: 0, resultText: undefined, ...options }

    await this.quickSearchText.fill(searchText)

    if (options.resultText === undefined) {
      options.resultText = searchText
    }

    await this.quickSearchResults
      .filter({ hasText: options.resultText })
      .nth(options.nth ?? 0)
      .click()
  }

  async waitForSearchResults() {
    await this.page.waitForFunction((element) => {
      return element?.textContent?.includes('result(s) found')
    }, await this.resultsFound.elementHandle())
  }
}

class UserInfo {
  readonly page: Page
  readonly username: Locator
  readonly dropdownMenuItems: Locator
  readonly myProfile: Locator
  readonly loginToPulsarAgain: Locator
  readonly userImpersonation: Locator
  readonly stopImpersonation: Locator
  readonly search: Locator
  readonly autocompleteItems: Locator
  readonly save: Locator

  constructor(page: Page) {
    this.page = page
    this.username = page.locator('#userName')
    this.dropdownMenuItems = page.locator('#UserDropdownMenu a')
    this.myProfile = page.locator('#UserDropdownMenu [href*="AddUserToTeam_Edit"]')
    this.loginToPulsarAgain = page.locator('#UserDropdownMenu [href*="LoginToPulsarAgain"]')
    this.userImpersonation = page.locator('#UserDropdownMenu [href*="ShowImpersonationPage"]')
    this.stopImpersonation = page.locator('#UserDropdownMenu [href*="StopImpersonation"]')
    this.search = page.locator('#userinput')
    this.autocompleteItems = page.locator('#Autocomplete_userSelector .ui-menu-item-wrapper')
    this.save = page.locator('#Impersonation #save')
  }

  async impersonate(name: string, matchedName?: string) {
    if (!matchedName) matchedName = name

    const username = await this.username.textContent()

    if (username?.includes(name)) return

    await this.username.click()

    const menuItems = await this.dropdownMenuItems.allInnerTexts()

    if (menuItems.includes(' Stop Impersonation')) {
      await this.stopImpersonation.click()
      await this.page.waitForEvent('load')
      await this.username.click()
    }

    await this.userImpersonation.click()

    await this.search.fill(name)
    await this.autocompleteItems.filter({ hasText: matchedName }).click()

    await this.save.click()
    await this.page.waitForEvent('load')
  }
}

export { QuickSearch, UserInfo }
