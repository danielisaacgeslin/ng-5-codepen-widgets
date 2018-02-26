import { browser, by, element } from 'protractor';

export class MainPage {
  public navigateTo() {
    return browser.get('/main');
  }

  public getInput() {
    return element(by.css('input'));
  }

  public getWidgetCount() {
    return element.all(by.css('widget')).count();
  }
}
