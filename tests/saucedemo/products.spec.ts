import { test, expect } from '@playwright/test';

test.describe('Testes na pagina Produtos', async () => {
    test('Deve conter "Sauce Labs" no começo de todos as produtos', async ({ page }) => {
        test.fail();
        await test.step('login', async () => {
            await page.goto('https://www.saucedemo.com/');
            await page.locator('[data-test="username"]').fill('standard_user');
            await page.locator('[data-test="password"]').fill('secret_sauce');
            await page.locator('[data-test="login-button"]').click();
        })

        await test.step('verificar titulo do produto', async () => {
            const titleListLocator = await page.locator('.inventory_item_name');
            const productTitleList = await titleListLocator.allTextContents();

            for (const item of productTitleList) {
                await expect(item.slice(0, 10)).toBe('Sauce Labs');
            }

        });
    });
});