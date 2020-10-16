import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should allow a user to create new HD wallet with mnemonic (simple)', () => {
    page.navigateTo();
    expect(page.getOnboardingButton().getText()).toEqual('Create a Wallet');
    page.getOnboardingButton().click();
    expect(page.getOnboardingHeader()).toEqual('Create a Wallet');
    page.getHDWalletDiv().click();
    page.getActiveCardButton().click();
    const mnemonic = page.getMnemonicPhrase();
    expect(mnemonic).toMatch(/([a-z]+ ){23}[a-z]+/);
    page.getContinueButton().click();
    expect(page.getTextArea().getAttribute('formcontrolname')).toEqual('mnemonic');
    page.getTextArea().click();
    page.getTextArea().sendKeys(mnemonic);
    page.getContinueButton().click();
    expect(page.getInput(0).getAttribute('formcontrolname')).toEqual('walletDir');
    page.getContinueButton().click();
    expect(page.getInput(0).getAttribute('formcontrolname')).toEqual('numAccounts');
    page.getInput(0).sendKeys(1);
    page.getContinueButton().click();
    const invalidPassword = 'invalid';
    const validPassword = 'Valid$2020';
    const mismatchPassword = 'Valid$20';
    expect(page.getInput(0).getAttribute('formcontrolname')).toEqual('password');
    expect(page.getInput(1).getAttribute('formcontrolname')).toEqual('passwordConfirmation');
    page.getInput(0).sendKeys(invalidPassword);
    page.getInput(1).sendKeys(invalidPassword);
    expect(page.getContinueButton().getAttribute('disabled')).toEqual('true');
    page.getInput(0).clear();
    page.getInput(1).clear();
    page.getInput(0).sendKeys(validPassword);
    page.getInput(1).sendKeys(mismatchPassword);
    expect(page.getContinueButton().getAttribute('disabled')).toEqual('true');
    page.getInput(1).clear();
    page.getInput(1).sendKeys(validPassword);
    expect(page.getContinueButton().getAttribute('ng-reflect-disabled')).toEqual('false');
    page.getContinueButton().click();
    // TODO: Confirm results
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
