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
const name = faker.person.firstName()
const email = faker.internet.email()
const password = faker.internet.password()
const company = faker.company.name()
const website = faker.internet.url()
const city = faker.location.city()
const address1 = faker.location.street()
const address2 = faker.location.secondaryAddress()
const state = faker.location.state()
const zipcode = faker.location.zipCode()

await page.getByRole('link', { name: 'Input Form Submit' }).click()
await page.waitForURL('**/input-form-demo')
await page.getByPlaceholder('Name', { exact: true }).fill(name)
await page.getByPlaceholder('Email', { exact: true }).fill(email)
await page.getByPlaceholder('Password').fill(password)
await page.getByPlaceholder('Company').fill(company)
await page.getByPlaceholder('Website').fill(website)

await page.getByRole('combobox').selectOption('United States')

await page.getByPlaceholder('City').fill(city)
await page.getByPlaceholder('Address 1').fill(address1)
await page.getByPlaceholder('Address 2').fill(address2)
await page.getByPlaceholder('State').fill(state)
await page.getByPlaceholder('Zip code').fill(zipcode)

await page.getByRole('button', { name: 'Submit' }).click()

try {
  await expect(page.getByText('Thanks for contacting us, we will get back to you shortly.')).toBeVisible()

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

