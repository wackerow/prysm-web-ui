import { browser, by, element, ElementFinder, $ } from 'protractor';

export class AppPage {
  HORIZONTAL_CONTAINER = '.mat-horizontal-content-container';
  VERTICAL_CONTAINER = '.mat-vertical-content-container';
  HORIZONTAL_HEADER = '.mat-horizontal-stepper-header-container';
  VERTICAL_HEADER = '.mat-vertical-stepper-header-container';

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
    return element(
      by.className('onboarding-grid flex-wrap flex justify-center items-center my-auto')
    ).all(by.tagName('div')).get(0);
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
  // TODO: Refactor below to also test mobile ('.mat-vertical...')
  getMatStepHeaderElement(step: number): ElementFinder {
    if (element(by.css(`${this.HORIZONTAL_HEADER}`))) {
      return element(
        by.css(`${this.HORIZONTAL_HEADER}`)
      ).all(by.tagName('mat-step-header')).get(step - 1);
    }
    return element(
      by.css(`${this.VERTICAL_HEADER}`)
    ).all(by.tagName('mat-step-header')).get(step - 1);
  }

  getMnemonicPhrase(): Promise<string> {
    return element(
      by.tagName('app-generate-mnemonic')
    ).all(by.tagName('div')).get(1).getText() as Promise<string>;
  }

  getPreviousButton(): ElementFinder {
    if (element(by.css(`${this.HORIZONTAL_CONTAINER}`))) {
      return element(
        by.css(`${this.HORIZONTAL_CONTAINER} [aria-expanded="true"]`)
      ).all(by.tagName('button')).get(0);
    }
    return element(
      by.css(`${this.VERTICAL_CONTAINER} [aria-expanded="true"]`)
    ).all(by.tagName('button')).get(0);
  }

  getContinueButton(): ElementFinder {
    if (element(by.css(`${this.HORIZONTAL_CONTAINER}`))) {
      return element(
        by.css(`${this.HORIZONTAL_CONTAINER} [aria-expanded="true"]`)
      ).all(by.tagName('button')).get(1);
    }
    return element(
      by.css(`${this.VERTICAL_CONTAINER} [aria-expanded="true"]`)
    ).all(by.tagName('button')).get(1);
  }

  getTextArea(): ElementFinder {
    if (element(by.css(`${this.HORIZONTAL_CONTAINER}`))) {
      return element(
        by.css(`${this.HORIZONTAL_CONTAINER} [aria-expanded="true"]`)
      ).all(by.tagName('textarea')).get(0);
    }
    return element(
      by.css(`${this.VERTICAL_CONTAINER} [aria-expanded="true"]`)
    ).all(by.tagName('textarea')).get(0);
  }

  getFirstInput(): ElementFinder {
    if (element(by.css(`${this.HORIZONTAL_CONTAINER}`))) {
      return element(
        by.css(`${this.HORIZONTAL_CONTAINER} [aria-expanded="true"]`)
      ).all(by.tagName('input')).get(0);
    }
    return element(
      by.css(`${this.VERTICAL_CONTAINER} [aria-expanded="true"]`)
    ).all(by.tagName('input')).get(0);
  }

  getSecondInput(): ElementFinder {
    if (element(by.css(`${this.HORIZONTAL_CONTAINER}`))) {
      return element(
        by.css(`${this.HORIZONTAL_CONTAINER} [aria-expanded="true"]`)
      ).all(by.tagName('input')).get(1);
    }
    return element(
      by.css(`${this.VERTICAL_CONTAINER} [aria-expanded="true"]`)
    ).all(by.tagName('input')).get(1);
  }

  getMatError(): ElementFinder {
    return element(
      by.css(`${this.VERTICAL_CONTAINER} [aria-expanded="true"]`)
    ).all(by.className('mat-error')).get(0);
  }
}
