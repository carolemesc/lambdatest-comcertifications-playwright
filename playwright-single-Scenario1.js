import { test, expect, chromium } from '@playwright/test'
import data from './data/data.js'
import { faker } from '@faker-js/faker'
import cp from 'child_process'

const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1]

const capabilities = {
  'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
  'browserVersion': 'latest',
  'LT:Options': {
    'platform': 'Windows 10',
    'build': 'Playwright Single Build',
    'name': 'Playwright Sample Test',
    'user': process.env.LT_USERNAME,
    'accessKey': process.env.LT_ACCESS_KEY,
    'network': true,
    'video': true,
    'console': true,
    'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
    'tunnelName': '', // Optional
    'geoLocation': 'BR', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
    'playwrightClientVersion': playwrightClientVersion
  }
}

const browser = await chromium.connect({
  wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
})

const page = await browser.newPage()


await page.goto(data.APP.URL)
const message = faker.lorem.sentence()

await page.getByRole('link', { name: 'Simple Form Demo' }).click()
await page.waitForURL('**/simple-form-demo')
await page.getByPlaceholder('Please enter your Message').fill(message)
await page.getByRole('button', { name: 'Get Checked Value' }).click()

try {
  await expect(page.locator('#message')).toHaveText(message)

  await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`)
  await teardown(page, browser)
} catch (e) {
  await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`)
  await teardown(page, browser)
  throw e
}

async function teardown(page, browser) {
  await page.close()
  await browser.close()
}

