import { test, expect } from '@playwright/test'
import data from '../data/data'
import { faker } from '@faker-js/faker'

/** @type {import('@playwright/test').Page} */
let page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto(data.APP.URL)
})

test.afterAll(async () => {
  await page.close()
})

test.describe('Assignment Task: Playwright 101', () =>{
  test('Test Scenario 1:', async () => {
    const message = faker.lorem.sentence()

    await page.getByRole('link', { name: 'Simple Form Demo' }).click()
    await page.waitForURL('**/simple-form-demo')
    await page.getByPlaceholder('Please enter your Message').fill(`${message}`)
    await page.getByRole('button', { name: 'Get Checked Value' }).click()
    await expect(page.locator('#message')).toHaveText(`${message}`)
  })

  test('Test Scenario 2:', async () => {
    await page.getByRole('link', { name: 'Drag & Drop Sliders' }).click()
    await page.waitForURL('**/drag-drop-range-sliders-demo')
    const source = page.locator('#slider3').getByRole('slider')
    // await source.evaluate((Element) => Element.value = 95) //executes, but does not update the value of “#rangeSuccess”

    await source.dragTo(source, {
      sourcePosition: { x: 73, y: 0 },
      targetPosition: { x: 465, y: 0 },
    })

    await expect(page.locator('#rangeSuccess')).toHaveText('95')
  })

  test('Test Scenario 3:', async () => {
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
    await page.getByRole('button', { name: 'Submit' }).click()
    //error message - I couldn't validate the tooltip
    await page.getByPlaceholder('Name', { exact: true }).fill(`${name}`)
    await page.getByPlaceholder('Email', { exact: true }).fill(`${email}`)
    await page.getByPlaceholder('Password').fill(`${password}`)
    await page.getByPlaceholder('Company').fill(`${company}`)
    await page.getByPlaceholder('Website').fill(`${website}`)

    await page.getByRole('combobox').selectOption('United States')

    await page.getByPlaceholder('City').fill(`${city}`)
    await page.getByPlaceholder('Address 1').fill(`${address1}`)
    await page.getByPlaceholder('Address 2').fill(`${address2}`)
    await page.getByPlaceholder('State').fill(`${state}`)
    await page.getByPlaceholder('Zip code').fill(`${zipcode}`)

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Thanks for contacting us, we')).toBeVisible()

    await page.waitForTimeout(5000)
  })
})