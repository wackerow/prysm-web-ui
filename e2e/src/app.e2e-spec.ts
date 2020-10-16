import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  const ALLOWS_HD_ONBOARDING = 'Should allow a user to generate new mnemonic and create new HD wallet';

  it(`${ALLOWS_HD_ONBOARDING} w/ Simple navigation`, () => {
    page.navigateTo();

    // Home Page
    // Check onboarding button text
    expect(page.getOnboardingButton().getText()).toEqual('Create a Wallet');
    // Click button -> Navigate to Onboarding
    page.getOnboardingButton().click();

    // Onboarding Page
    // Check page header text
    expect(page.getOnboardingHeader()).toEqual('Create a Wallet');
    // Click 'HD Wallet' section -> Sets focus
    page.getHDWalletDiv().click();
    // Click 'Select Wallet' button -> Navigate to HD Wallet Wizard (Step 1)
    page.getActiveCardButton().click();

    // Onboarding > HD Wallet Wizard Page
    // Store generated mnemonic phrase to simulate writing it down
    const mnemonic = page.getMnemonicPhrase();
    // Check mnemonic is list of 24 space-separated lowercase words
    expect(mnemonic).toMatch(/([a-z]+ ){23}[a-z]+/);
    // Click 'Continue' button -> Proceed to Step 2
    page.getContinueButton().click();

    // Check form control name
    expect(page.getTextArea().getAttribute('formcontrolname')).toEqual('mnemonic');
    // Click into text field and type saved mnemonic
    page.getTextArea().click();
    page.getTextArea().sendKeys(mnemonic);
    // Click 'Continue' button -> Proceed to Step 3
    page.getContinueButton().click();

    // Check form control name
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('walletDir');
    // Leave default data value
    // Click 'Continue' button -> Proceed to Step 4
    page.getContinueButton().click();

    // Check form control name
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('numAccounts');
    // Type '1' into input field (1 validator)
    page.getFirstInput().sendKeys(1);
    // Click 'Continue' button -> Proceed to Step 5
    page.getContinueButton().click();

    // Check form control names
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('password');
    expect(page.getSecondInput().getAttribute('formcontrolname')).toEqual('passwordConfirmation');
    // Type matching valid passwords
    page.getFirstInput().sendKeys('Valid$2020');
    page.getSecondInput().sendKeys('Valid$2020');
    // Check 'Create Wallet' button is not disabled
    expect(page.getContinueButton().getAttribute('ng-reflect-disabled')).toEqual('false');
    // Click 'Continue' button -> Proceed to wallet generation
    page.getContinueButton().click();
    // TODO: Confirm deposit data results
  });

  it(`${ALLOWS_HD_ONBOARDING} w/ Proper navigation restriction if password invalid`, () => {
    page.navigateTo();

    // Home Page
    // Check onboarding button text
    expect(page.getOnboardingButton().getText()).toEqual('Create a Wallet');
    // Click button -> Navigate to Onboarding
    page.getOnboardingButton().click();

    // Onboarding Page
    // Check page header text
    expect(page.getOnboardingHeader()).toEqual('Create a Wallet');
    // Click 'HD Wallet' section -> Sets focus
    page.getHDWalletDiv().click();
    // Click 'Select Wallet' button -> Navigate to HD Wallet Wizard (Step 1)
    page.getActiveCardButton().click();

    // Onboarding > HD Wallet Wizard Page
    // Store generated mnemonic phrase to simulate writing it down
    const mnemonic = page.getMnemonicPhrase();
    // Check mnemonic is list of 24 space-separated lowercase words
    expect(mnemonic).toMatch(/([a-z]+ ){23}[a-z]+/);
    // Click 'Continue' button -> Proceed to Step 2
    page.getContinueButton().click();

    // Check form control name
    expect(page.getTextArea().getAttribute('formcontrolname')).toEqual('mnemonic');
    // Click into text field and type saved mnemonic
    page.getTextArea().click();
    page.getTextArea().sendKeys(mnemonic);
    // Click 'Continue' button -> Proceed to Step 3
    page.getContinueButton().click();

    // Check form control name
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('walletDir');
    // Leave default data value
    // Click 'Continue' button -> Proceed to Step 4
    page.getContinueButton().click();

    // Check form control name
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('numAccounts');
    // Type '1' into input field (1 validator)
    page.getFirstInput().sendKeys(1);
    // Click 'Continue' button -> Proceed to Step 5
    page.getContinueButton().click();

    // Declare password constants
    const invalidPassword = 'invalid';
    const validPassword = 'Valid$2020';
    const mismatchPassword = 'Valid$20';
    // Check form control names
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('password');
    expect(page.getSecondInput().getAttribute('formcontrolname')).toEqual('passwordConfirmation');
    // Type matching INVALID passwords
    page.getFirstInput().sendKeys(invalidPassword);
    page.getSecondInput().sendKeys(invalidPassword);
    // Check 'Create Wallet' button is disabled
    expect(page.getContinueButton().getAttribute('disabled')).toEqual('true');
    // Clear form and type MISMATCHED valid passwords
    page.getFirstInput().clear();
    page.getSecondInput().clear();
    page.getFirstInput().sendKeys(validPassword);
    page.getSecondInput().sendKeys(mismatchPassword);
    // Check 'Create Wallet' button is disabled
    expect(page.getContinueButton().getAttribute('disabled')).toEqual('true');
    // Clear mismatched password and type correct valid matching password
    page.getSecondInput().clear();
    page.getSecondInput().sendKeys(validPassword);
    // Check 'Create Wallet' button is not disabled
    expect(page.getContinueButton().getAttribute('ng-reflect-disabled')).toEqual('false');
    // Click 'Continue' button -> Proceed to wallet generation
    page.getContinueButton().click();
    // TODO: Confirm deposit data results
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
