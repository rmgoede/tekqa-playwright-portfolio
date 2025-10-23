import { test, expect } from '@playwright/test';

//This test was used to open inspector and see how to generate code snippets with the generate assertions checked to copy paste here
//Launch a new Chromium browser window
//Open the Playwright Inspector / Recorder
//Start a new recording session
//command
//npx playwright codegen https://www.saucedemo.com

test('test', async ({ page }) => {
  //Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  //assertions after login
  await expect(page).toHaveURL(/inventory\.html/);

  //item on page visable
  await expect(page.locator('[data-test="item-4-img-link"]')).toBeVisible();
  // click Sauce Labs Bike Light
  await page.locator('[data-test="item-0-title-link"]').click();
  //assertions after clicking item
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    await expect(page.locator('text=Add to cart')).toBeVisible();
    await expect(page.locator('text=Back to products')).toBeVisible();
    await expect(page.locator('.inventory_details_desc_container')).toBeVisible();
    

  //click back to products
    await page.locator('text=Back to products').click();
  //assert
    await expect(page).toHaveURL(/inventory\.html/);
});