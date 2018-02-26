import { browser, Key } from 'protractor';

import { MainPage } from './main.po';

describe('Main Page', () => {
  let page: MainPage;

  beforeEach(() => {
    browser.restart();
    page = new MainPage();
    page.navigateTo();
  });

  it('should have an input', () => {
    expect(page.getInput()).toBeTruthy();
  });

  it('should display a widget', () => {
    page.getInput().sendKeys('yvqoer');
    page.getInput().sendKeys(Key.ENTER);
    browser.sleep(2000);
    expect(page.getWidgetCount()).toEqual(1);
  });

  it('should remove a widget', () => {
    page.getInput().sendKeys('yvqoer');
    page.getInput().sendKeys(Key.ENTER);
    expect(page.getWidgetCount()).toEqual(1);
    page.getWidgetRemoveBtn().click();
    expect(page.getWidgetCount()).toEqual(0);
  });

});
