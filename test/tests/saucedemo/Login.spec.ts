import { test, expect } from '@playwright/test';


test.describe('Login tests', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Deve fazer login com sucesso', async ({ page }) => {
    await expect(await page.title()).toBe('Swag Labs'); // page.title pega o titulo da pagina
    await expect(page.getByText('Swag Labs')).toBeVisible();

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();
    await expect(await page.url()).toBe('https://www.saucedemo.com/inventory.html')

    const productTitle = await page.locator('.header_secondary_container > span');
    await expect(productTitle).toHaveText('Products');
  });


  test('Não deve Acessar a pagina principal', async ({ page }) => {
    await expect(await page.title()).toBe('Swag Labs'); // page.title pega o titulo da pagina

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('senhaerrada');

    await page.locator('[data-test="login-button"]').click();

    const errorText = await page.getByText('Epic sadface: Username and password do not match any user in this service');
    await expect(errorText).toBeVisible();

  });

  test('Não deve logar com campos vazios', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();

    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  });

  test('Não deve logar com usuário bloqueado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'locked_out_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    await expect(page.getByText('Sorry, this user has been locked out')).toBeVisible();
  });

  test('Não deve logar com usuário inválido', async ({ page }) => {

    await page.fill('[data-test="username"]', 'usuario_invalido');
    await page.fill('[data-test="password"]', 'qualquer_senha');

    await page.click('[data-test="login-button"]');

    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();

  });

  test.describe('Login - Validação de UI', async () => {
    test('Deve exibir o campo Username', async ({ page }) => {
      const usernameInput = page.locator('[data-test="username"]');
      await expect(usernameInput).toBeVisible();
      await expect(usernameInput).toBeEnabled();
    });

    test('Deve exibir o campo Password', async ({ page }) => {
      const passwordInput = page.locator('[data-test="password"]');
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toBeEnabled();
    });

    test('Deve exibir o botão Login habilitado', async ({ page }) => {
      const loginButton = page.locator('[data-test="login-button"]');
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toBeEnabled();
    });

    test('Deve exibir o logo Swag Labs', async ({ page }) => {
      await expect(page.getByText('Swag Labs')).toBeVisible();
    });

  });

  test.describe('Login - Testes de Usabilidade', async () => {

    test('Deve realizar login ao pressionar Enter', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');

      // Pressiona Enter no campo senha
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
    });

    test('Campo Username deve aceitar foco', async ({ page }) => {
      const usernameInput = page.locator('[data-test="username"]');

      await usernameInput.focus();
      await expect(usernameInput).toBeFocused();
    });

    test('Deve navegar corretamente com Tab entre os campos', async ({ page }) => {
      const usernameInput = page.locator('[data-test="username"]');
      const passwordInput = page.locator('[data-test="password"]');
      const loginButton = page.locator('[data-test="login-button"]');

      // Garante foco inicial
      await usernameInput.focus();
      await expect(usernameInput).toBeFocused();

      // Tab → Password
      await page.keyboard.press('Tab');
      await expect(passwordInput).toBeFocused();

      // Tab → Login button
      await page.keyboard.press('Tab');
      await expect(loginButton).toBeFocused();
    });
  });

  test.describe('Login - Testes de Segurança', async () => {

    test('Não deve permitir login com usuário bloqueado', async ({ page }) => {

      await page.fill('[data-test="username"]', 'locked_out_user');
      await page.fill('[data-test="password"]', 'secret_sauce');

      await page.click('[data-test="login-button"]');

      await expect(page.locator('[data-test="error"]')).toBeVisible();

      await expect(page.getByText('Sorry, this user has been locked out.')).toBeVisible();
    });

    test('Não deve acessar inventory sem estar logado', async ({ page }) => {
      await page.goto('https://www.saucedemo.com/inventory.html');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('Não deve permitir acesso após logout', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      await page.click('#react-burger-menu-btn');
      await page.click('#logout_sidebar_link');

      await page.goto('https://www.saucedemo.com/inventory.html');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

  });



  test.describe('Login - Testes de Refresh / Sessão', async () => {
    test('Recarregar página após erro NÃO deve manter a mensagem', async ({ page }) => {

      await page.fill('[data-test="username"]', 'usuario_invalido');
      await page.fill('[data-test="password"]', 'senha_invalida');
      await page.click('[data-test="login-button"]');

      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();

      await page.reload();

      await expect(errorMessage).not.toBeVisible();
    });

    test('Recarregar página após login DEVE manter a sessão ativa', async ({ page }) => {
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();

      await page.reload();

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
    });


  });

  test.describe('Login - Testes de Performance', () => {

    test('Tempo de login deve ser menor que 2 segundos', async ({ page }) => {
      const startTime = Date.now();

      // Arrange
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');

      // Act
      await page.click('[data-test="login-button"]');

      // Aguarda página de produtos carregar
      await page.waitForURL(/inventory\.html/);
      await page.getByText('Products').waitFor();

      const endTime = Date.now();
      const loginTime = endTime - startTime;

      console.log(`⏱️ Tempo de login: ${loginTime} ms`);

      // Assert
      expect(loginTime).toBeLessThan(2000);
    });

    test('Página de produtos deve carregar corretamente', async ({ page }) => {
      // Login
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');

      // Assert - página carregada
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();

      // Assert - produtos visíveis
      const products = page.locator('.inventory_item');
      await expect(products).toHaveCount(6);
    });

  });

});
