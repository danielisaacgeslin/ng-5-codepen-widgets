import { browser, Key } from 'protractor';

import { MainPage } from './main.po';

describe('Main Page', () => {
  let page: MainPage;

  beforeEach(() => {
    page = new MainPage();
    page.navigateTo();
  });

  it('should have an input', () => {
    expect(page.getInput()).toBeTruthy();
  });

  it('should display a widget', async () => {
    await page.getInput().sendKeys('yvqoer');
    await page.getInput().sendKeys(Key.ENTER);
    await browser.sleep(2000);
    expect(page.getWidgetCount()).toEqual(1);
  });

});
