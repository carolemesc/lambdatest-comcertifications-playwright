import { test, expect } from '@playwright/test'
import data from '../data/data'

/** @type {import('@playwright/test').Page} */
let page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto(data.APP.URL)
})

test.afterAll(async () => {
  await page.close()
})

test.describe('Login na plataforma', () =>{
  test.only('Should be able to login', async () =>{
    await page.waitForTimeout(5000)
  })
})