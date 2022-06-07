## Install

```bash
git clone https://github.com/aaronchen/pulsar-test.git
cd pulsar-test
npm install
npx playwright install chromium
code . # Please install recommended extensions when you launch the workspace 
```


## [Playwright Commands](https://playwright.dev/docs/test-cli)

```bash
npx playwright open https://pulsartest.twn.int.hp.com/pulsar2

npx playwright test
npx playwright test tests/dcr
npx playwright test tests/dcr/dcr.spec.ts
npx playwright test -g "@daily"
npx playwright test --headed

npx playwright show-report
```

## [Test Annotation](https://playwright.dev/docs/test-annotations)

```typescript
test.skip()  // Skip the test
test.fixme() // Mark the test as failed and skip
test.slow()  // Triple test timeout
test.only()  // Only test to run
```

## [Locators](https://playwright.dev/docs/locators)
## [Selectors](https://playwright.dev/docs/selectors#text-selector)
## [Input](https://playwright.dev/docs/input#keys-and-shortcuts)
## [Auto Waiting](https://playwright.dev/docs/actionability)
## [Navigation](https://playwright.dev/docs/navigations)
## [Test Assertions](https://playwright.dev/docs/test-assertions)

## [Playwright Inspector](https://playwright.dev/docs/inspector#open-playwright-inspector)

## [Page](https://playwright.dev/docs/api/class-page)
## [Frame](https://playwright.dev/docs/api/class-frame)
## [ElementHandle](https://playwright.dev/docs/api/class-elementhandle)
