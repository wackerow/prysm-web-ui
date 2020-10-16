import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getLogoUrl(): Promise<string> {
    return element(by.css('app-root app-login img')).getAttribute('src') as Promise<string>;
  }
}
