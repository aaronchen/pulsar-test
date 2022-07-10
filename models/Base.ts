import { ElementHandle, Frame, Locator, Page } from '@playwright/test'

abstract class Base {
  private frameOrPage: Frame | Page

  constructor(frameOrPage: Frame | Page) {
    this.frameOrPage = frameOrPage
  }

  protected async autocompleteFill(
    inputLocator: Locator,
    itemsLocator: Locator,
    name: string,
    matchedName?: string
  ): Promise<void> {
    if (!matchedName) matchedName = name

    await inputLocator.fill(name)
    await itemsLocator.filter({ hasText: matchedName }).click()
  }

  async getElementHandle(selector: string | Locator): Promise<ElementHandle<HTMLElement>> {
    let elementHandle: ElementHandle<HTMLElement>

    if (typeof selector === 'string') {
      elementHandle = (await this.frameOrPage.$(selector)) as ElementHandle<HTMLElement>
    } else {
      elementHandle = (await (selector as Locator).elementHandle()) as ElementHandle<HTMLElement>
    }

    return elementHandle
  }

  async hasClass(selector: string | Locator, className: string): Promise<boolean> {
    const elementHandle = await this.getElementHandle(selector)
    return await elementHandle.evaluate((el, className) => el.classList.contains(className), className)
  }

  async waitForState(
    selector: string | Locator,
    state: 'visible' | 'hidden' | 'stable' | 'enabled' | 'disabled' | 'editable',
    timeout = 5000
  ): Promise<boolean> {
    const elementHandle = await this.getElementHandle(selector)

    const timeoutPromise = new Promise(function (_resolve, reject) {
      setTimeout(reject, timeout)
    })

    return Promise.race([elementHandle.waitForElementState(state), timeoutPromise])
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async waitForText(selector: string | Locator, hasText: string, timeout = 5000): Promise<boolean> {
    const elementHandle = await this.getElementHandle(selector)

    const waitForTextPromise = new Promise<void>(function (resolve) {
      ;(async function waitForText() {
        const textContent = await elementHandle.textContent()

        if (typeof textContent === 'string' && (textContent as string).includes(hasText)) {
          resolve()
        } else {
          setTimeout(waitForText, 30)
        }
      })()
    })

    const timeoutPromise = new Promise(function (_resolve, reject) {
      setTimeout(reject, timeout)
    })

    return Promise.race([waitForTextPromise, timeoutPromise])
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }
}

abstract class BaseFrame extends Base {
  readonly frame: Frame

  constructor(frame: Frame) {
    super(frame)
    this.frame = frame
  }
}

abstract class BasePage extends Base {
  readonly page: Page

  constructor(page: Page) {
    super(page)
    this.page = page
  }
}

export { BaseFrame, BasePage }
