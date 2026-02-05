import { test, expect } from '@playwright/test';

test.describe('Testes na pagina HOME do Inatel', () => {

  test('Pagina HOME Inatel existe', async ({ page }) => {

    await page.goto('https://inatel.br/home/');

    await expect(page.locator('.ma-logo')).toBeVisible();
    await expect(page.locator('#contactar')).toContainText('Conheça o Inatel');
    await expect(page.locator('#noticias-inatel')).toContainText('Notícias');

  });

  test('Validar texto do botão "Conheça o inatel"', async ({ page }) => {

    await page.goto('https://inatel.br/home/');
    await expect(page.locator('#contactar')).toContainText('Conheça o Inatel');

  });

  test('Validar se o botão "Conheça o inatel" funciona', async ({ page }) => {

    await page.goto('https://inatel.br/home/');
    await page.locator('#contactar').click();

    await expect(
      page.locator('.flexBoxGeral > :nth-child(1) > .subtopic > .colorfff')
    ).toContainText('Quem Somos');

  });

  test('Validar texto do botão "Notícias"', async ({ page }) => {

    await page.goto('https://inatel.br/home/');
    await expect(page.locator('#noticias-inatel')).toContainText('Notícias');

  });

  test('Validar se botão "Notícias" Funciona', async ({ page }) => {

    await page.goto('https://inatel.br/home/');
    await page.locator('#noticias-inatel').click();

    await expect(page.locator('.news-headline > h2'))
      .toContainText('Destaque');

  });

  test('Valida redirecionamento ao clicar no botão Graduação', async ({ page }) => {

    await page.goto('https://inatel.br/home/');

    await page.evaluate(() => {
      document.querySelector(':nth-child(1) > .boxLink')
        ?.removeAttribute('target');
    });

    await page.locator(':nth-child(1) > .boxLink').click();

    await expect(page).toHaveURL(/.*vestibular/);

  });

  test('Valida redirecionamento ao clicar no botão Especialização', async ({ page }) => {

    await page.goto('https://inatel.br/home/');

    await page.evaluate(() => {
      document.querySelector(':nth-child(2) > .boxLink')
        ?.removeAttribute('target');
    });

    await page.locator(':nth-child(2) > .boxLink').click();

    await expect(page).toHaveURL(/.*pos/);

  });

  test('Valida redirecionamento ao clicar no botão Mestrado e Doutorado', async ({ page }) => {

    await page.goto('https://inatel.br/home/');

    await page.evaluate(() => {
      document.querySelector(':nth-child(3) > .boxLink')
        ?.removeAttribute('target');
    });

    await page.locator(':nth-child(3) > .boxLink').click();

    await expect(page).toHaveURL(/.*mestrado-doutorado/);

  });

  test('Valida redirecionamento ao clicar no botão Cursos de Extensão e Certificações', async ({ page }) => {

    await page.goto('https://inatel.br/home/');

    await page.evaluate(() => {
      document.querySelector(':nth-child(5) > .boxLink')
        ?.removeAttribute('target');
    });

    await page.locator(':nth-child(5) > .boxLink').click();

    await expect(page).toHaveURL(/.*treinamento/);

  });

  test('Valida redirecionamento ao clicar no botão Inatel Online', async ({ page }) => {

    await page.goto('https://inatel.br/home/');

    await page.evaluate(() => {
      document.querySelector(':nth-child(4) > .boxLink')
        ?.removeAttribute('target');
    });

    await page.locator(':nth-child(4) > .boxLink').click();

    await expect(page).toHaveURL(/.*online.inatel.br/);

  });

});
