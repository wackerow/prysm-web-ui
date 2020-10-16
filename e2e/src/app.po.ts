import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  /**
   * /login
   */
  getOnboardingButton(): ElementFinder {
    return element(by.css('[routerlink="/onboarding"]'));
  }

  /**
   * /onboarding
   */
  getOnboardingHeader(): Promise<string> {
    return element(by.css('app-choose-wallet-kind .text-white.text-3xl')).getText() as Promise<string>;
  }

  getHDWalletDiv(): ElementFinder {
    return element(by.className('onboarding-grid flex-wrap flex justify-center items-center my-auto')).all(by.tagName('div')).get(0);
  }

  getImportedWalletDiv(): ElementFinder {
    return element(by.cssContainingText('div', 'Imported Wallet'));
  }

  getRemoteWalletDiv(): ElementFinder {
    return element(by.cssContainingText('div', 'Remote Wallet'));
  }

  getActiveCardButton(): ElementFinder {
    return element(by.css('app-choose-wallet-kind .onboarding-card.active .wallet-action button'));
  }

  /**
   * /onboarding - HD Wallet Setup wizard
   */
  getMnemonicPhrase(): Promise<string> {
    return element(by.tagName('app-generate-mnemonic')).all(by.tagName('div')).get(1).getText() as Promise<string>;
  }

  getPreviousButton(): ElementFinder {
    return element(
      by.css('.mat-horizontal-content-container [aria-expanded="true"]')
      ).all(by.tagName('button')).get(0);
  }

  getContinueButton(): ElementFinder {
    return element(
      by.css('.mat-horizontal-content-container [aria-expanded="true"]')
      ).all(by.tagName('button')).get(1);
  }

  getTextArea(): ElementFinder {
    return element(
      by.css('.mat-horizontal-content-container [aria-expanded="true"]')
      ).all(by.tagName('textarea')).get(0);
  }

  getFirstInput(): ElementFinder {
    return element(
      by.css('.mat-horizontal-content-container [aria-expanded="true"]')
      ).all(by.tagName('input')).get(0);
  }

  getSecondInput(): ElementFinder {
    return element(
      by.css('.mat-horizontal-content-container [aria-expanded="true"]')
      ).all(by.tagName('input')).get(1);
  }

  getWizardComponent(): ElementFinder {
    return element(by.byTag('app-hd-wallet-wizard'));
  }
}
