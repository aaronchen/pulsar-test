import { ElementHandle, Locator, Page } from '@playwright/test'

class Table<ColumnNameType extends string, MenuNameType extends string = ''> {
  protected readonly page: Page
  readonly tableId: string
  protected readonly columnNames: Record<ColumnNameType, string>
  protected readonly menuNames?: Record<MenuNameType, string>
  readonly headerLocator: Locator
  readonly tableLocator: Locator
  protected readonly loadingSelector: string
  protected readonly headerLocators: Record<ColumnNameType, Locator>
  protected readonly filterLocators: Record<ColumnNameType, Locator>
  protected readonly columnLocators: Record<ColumnNameType, Locator>
  protected readonly menuLocators?: Record<MenuNameType, Locator>

  constructor(
    page: Page,
    tableId: string,
    columnNames: Record<ColumnNameType, string>,
    menuNames?: Record<MenuNameType, string>
  ) {
    this.page = page
    this.tableId = tableId
    this.columnNames = columnNames
    this.menuNames = menuNames

    this.headerLocator = page.locator(`#${tableId}_headers`)
    this.tableLocator = page.locator(`#${tableId}`)
    this.loadingSelector = `#${tableId}_container_loading`

    const headerLocators: Record<string, Locator> = {}
    const filterLocators: Record<string, Locator> = {}
    const columnLocators: Record<string, Locator> = {}
    const menuLocators: Record<string, Locator> = {}

    for (const columnKey in this.columnNames) {
      const columnId = `${tableId}_${this.columnNames[columnKey]}`
      headerLocators[columnKey] = page.locator(`#${columnId}`)
      filterLocators[columnKey] = page.locator(`.ui-igedit-input:below(#${columnId})`)
      columnLocators[columnKey] = page.locator(`[aria-describedby="${columnId}"]`)
    }

    for (const menuKey in this.menuNames) {
      menuLocators[menuKey] = page.locator(`[data-command="${this.menuNames[menuKey]}"] div:visible`)
    }

    this.headerLocators = headerLocators
    this.filterLocators = filterLocators
    this.columnLocators = columnLocators
    this.menuLocators = menuLocators
  }

  async clickMenu(menuNameType: MenuNameType) {
    if (this.menuLocators) await this.menuLocators[menuNameType].click()
  }

  find(
    columnNameType: ColumnNameType,
    hasText: string,
    options: { nth?: number; findType?: 'row' | 'cell' } = { nth: 0, findType: 'row' }
  ): Locator {
    options = { nth: 0, findType: 'row', ...options }

    return this.tableLocator
      .locator(options.findType === 'row' ? 'tbody tr' : 'tbody td', {
        has: this.columnLocators[columnNameType],
        hasText
      })
      .nth(options.nth ?? 0)
  }

  findCell(columnNameType: ColumnNameType, hasText: string, nth = 0): Locator {
    return this.columnLocators[columnNameType].locator(':scope', { hasText }).nth(nth)
  }

  findRow(columnNameType: ColumnNameType, hasText: string, nth = 0): Locator {
    return this.tableLocator
      .locator('tbody tr', {
        has: this.columnLocators[columnNameType],
        hasText
      })
      .nth(nth)
  }

  findHeader(columnNameType: ColumnNameType): Locator {
    return this.headerLocator.locator(':scope', { has: this.headerLocators[columnNameType] })
  }

  async filter(columnNameType: ColumnNameType, filterText: string, spinnerWait = 2000) {
    const filterHandle = (await this.filterLocators[columnNameType].nth(0).elementHandle()) as ElementHandle

    await filterHandle.fill(filterText)
    await filterHandle.evaluate((element) => element.dispatchEvent(new KeyboardEvent('keyup')))
    await Promise.race([
      this.page.waitForTimeout(spinnerWait),
      this.page.waitForSelector(this.loadingSelector, { state: 'visible' })
    ])
    await this.page.waitForSelector(this.loadingSelector, { state: 'hidden' })
  }
}

export { Table }
