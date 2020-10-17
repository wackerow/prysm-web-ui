import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { protractor } from 'protractor/built/ptor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  const ALLOWS_HD_ONBOARDING = 'Should allow a user to generate new mnemonic and create new HD wallet';

  it(`${ALLOWS_HD_ONBOARDING} w/ Simple navigation`, () => {
    /**
     * Tests user navigating through wizard using 'Continue' buttons, entering
     * valid information at each step, without going back
     *
     * Intended Pathway:
     * Home (/login) -> Onboarding (/onboarding) -> HD Wallet Wizard, Step 1 ->
     *  Step 2 -> Step 3 -> Step 4 -> Step 5 -> Complete
     */
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
    // Check Step 1 tab selected
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    // Check mnemonic is list of 24 space-separated lowercase words (note: English)
    expect(page.getMnemonicPhrase()).toMatch(/([a-z]+ ){23}[a-z]+/);
    // Store generated mnemonic phrase to simulate writing it down
    const mnemonic = page.getMnemonicPhrase();
    // Click 'Continue' button -> Proceed to Step 2
    page.getContinueButton().click();

    // Check Step 2 tab selected
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    // Check form control name
    expect(page.getTextArea().getAttribute('formcontrolname')).toEqual('mnemonic');
    // Click into text field and type saved mnemonic
    page.getTextArea().click();
    page.getTextArea().sendKeys(mnemonic);
    // Click 'Continue' button -> Proceed to Step 3
    page.getContinueButton().click();

    // Check Step 3 tab selected
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    // Check form control name
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('walletDir');
    // Leave default data value
    // Click 'Continue' button -> Proceed to Step 4
    page.getContinueButton().click();

    // Check Step 4 tab selected
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    // Check form control name
    expect(page.getFirstInput().getAttribute('formcontrolname')).toEqual('numAccounts');
    // Type '1' into input field (1 validator)
    page.getFirstInput().sendKeys(1);
    // Click 'Continue' button -> Proceed to Step 5
    page.getContinueButton().click();

    // Check Step 5 tab selected
    expect(page.getMatStepHeaderElement(5).getAttribute('aria-selected')).toEqual('true');
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
    // (Deposit Data tested in unit test)
  });

  it(`${ALLOWS_HD_ONBOARDING} w/ Appropriate forward navigation blocking (linear wizard)`, () => {
    /**
     * Tests linear property of form wizard, assuring that forward navigation (both with
     * 'Continue' button and with header tab navigation) is properly disabled until user
     * enters valid form data.
     *
     * Intended Pathway:
     * Home (/login) -> Onboarding (/onboarding) -> HD Wallet Wizard, Step 1 ->
     *  Step 2 -> Step 3 -> Step 4 -> Step 5 -> Complete
     *
     * TODO: Add error message testing to unit test
     */
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
    // Check Step 1 tab selected
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    // Check mnemonic is list of 24 space-separated lowercase words (note: English)
    expect(page.getMnemonicPhrase()).toMatch(/([a-z]+ ){23}[a-z]+/);
    // Store generated mnemonic phrase to simulate writing it down
    const mnemonic = page.getMnemonicPhrase();
    // Attempt improper navigation to steps 5, 4 and 3 via mat-step-header tabs
    // Click each unavailable tab, and check that Step 1 tab remains selected
    page.getMatStepHeaderElement(5).click();
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(4).click();
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(3).click();
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    // Click 'Confirm Mnemonic' tab -> Proceed to Step 2
    page.getMatStepHeaderElement(2).click();

    // Check Step 2 tab selected
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    // Attempt to continue with empty string, invalid string, and wrong mnemonic
    // ForEach: Click 'Continue', Check that Step 2 tab remains selected
    page.getContinueButton().click();
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    page.getTextArea().sendKeys('invalid');
    page.getContinueButton().click();
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    page.getTextArea().clear();
    page.getTextArea().sendKeys(mnemonic.then(value => value.substr(1)));
    page.getContinueButton().click();
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    page.getTextArea().clear();
    // Enter valid matching mnemonic
    page.getTextArea().sendKeys(mnemonic);
    // Click 'Wallet' tab -> Proceed to Step 3
    page.getMatStepHeaderElement(3).click();

    // Check Step 3 tab selected
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    // "Cut" default directory to test empty string
    const directory = page.getFirstInput().getAttribute('data-placeholder');
    // Replacement for .clear() method to update DOM correctly
    page.getFirstInput().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    try { page.getFirstInput().sendKeys(protractor.Key.chord(protractor.Key.COMMAND, 'a')); }
    catch (e) { return; }
    page.getFirstInput().sendKeys(protractor.Key.BACK_SPACE);
    // Attempt to continue with empty string
    page.getContinueButton().click();
    // Check that Step 3 tab remains selected
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    // "Paste" valid default directory again
    page.getFirstInput().sendKeys(directory);
    // Click 'Account Creation" tab -> Proceed to Step 4
    page.getMatStepHeaderElement(4).click();

    // Check Step 4 tab selected
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    // Attempt to continue without entering number of validators
    page.getContinueButton().click();
    // Check that correct error message populates
    // expect(page.getMatError()).toContain('Num accounts is required');
    // Check that Step 4 tab remains selected
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    // Type '1' into input field (1 validator)
    page.getFirstInput().sendKeys(1);
    // Click 'Continue' button -> Proceed to Step 5
    page.getContinueButton().click();

    /**
     * For Steps 2, 3, and 4 -- Should also add:
     *  expect(page.getContinueButton().getAttribute('disabled')).toEqual('true');
     * but this will fail right now as the styling on these buttons is not currently
     * affected by the validity of the form controls
     */

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
    // (Deposit Data tested in unit test)
  });

  it(`${ALLOWS_HD_ONBOARDING} w/ Complex navigation`, () => {
    /**
     * Tests user navigating through wizard using every 'Continue' or 'Previous'
     * button throughout, and also utilizing all header tab navigation links.
     *
     * Intended Pathway (Forward two, back one approach):
     * Home -> Onboarding (O) -> Step 1 (1) -> O -> 1 -> Step 2 (2) -> 1 -> 2 ->
     *  Step 3 (3) -> 2 -> 3 -> Step 4 (4) -> 3 -> 4 -> Step 5 (5) -> 4 -> 5 ->
     * [Using buttons to navigate] 4 -> 3 -> 2 -> 1 -> 2 -> 3 -> 4 -> 5 ->
     * [Using header tabs to navigate] 1 -> 2 -> 3 -> 4 -> 5 -> Complete
     *
     * TODO: Check form inputs have not changed after navigating away and returning
     */
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
    // Check Step 1 tab selected
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    // Click 'Previous' button -> Back to 'Onboarding'
    page.getPreviousButton().click();

    // Check: Onboarding Page
    expect(page.getOnboardingHeader()).toEqual('Create a Wallet');
    // Click 'HD Wallet' section -> Sets focus
    page.getHDWalletDiv().click();
    // Click 'Select Wallet' button -> Navigate to HD Wallet Wizard (Step 1)
    page.getActiveCardButton().click();

    // Check Step 1 tab selected
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    // Check mnemonic is list of 24 space-separated lowercase words (note: English)
    expect(page.getMnemonicPhrase()).toMatch(/([a-z]+ ){23}[a-z]+/);
    // Store generated mnemonic phrase to simulate writing it down
    const mnemonic = page.getMnemonicPhrase();
    // Click 'Continue' button -> Proceed to Step 2
    page.getContinueButton().click();

    // Check Step 2 tab selected
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    // Click 'Previous' button -> Back to Step 1
    page.getPreviousButton().click();

    // Check Step 1 tab selected
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    // Check 'mnemonic' has not changed
    expect(page.getMnemonicPhrase()).toEqual(mnemonic);
    // Click 'Continue' button -> Proceed to Step 2
    page.getContinueButton().click();

    // Check Step 2 tab selected
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    // Click into text field and type saved mnemonic
    page.getTextArea().click();
    page.getTextArea().sendKeys(mnemonic);
    // Click 'Continue' button -> Proceed to Step 3
    page.getContinueButton().click();

    // Check Step 3 tab selected
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    // Click 'Previous' button -> Back to Step 2
    page.getPreviousButton().click();

    // Check Step 2 tab selected
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    // TODO: Check textarea field has not changed
    // Click 'Continue' button -> Proceed to Step 3
    page.getContinueButton().click();

    // Check Step 3 tab selected
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    // Leave default data value, store value for later check
    const directory = page.getFirstInput().getAttribute('data-placeholder');
    // Click 'Continue' button -> Proceed to Step 4
    page.getContinueButton().click();

    // Check Step 4 tab selected
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    // Click 'Previous' button -> Back to Step 3
    page.getPreviousButton().click();

    // Check Step 3 tab selected
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    // TODO: Check input field has not changed
    // Click 'Continue' button -> Proceed to Step 4
    page.getContinueButton().click();

    // Check Step 4 tab selected
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    // Type '1' into input field (1 validator)
    page.getFirstInput().sendKeys(1);
    // Click 'Continue' button -> Proceed to Step 5
    page.getContinueButton().click();

    // Check Step 5 tab selected
    expect(page.getMatStepHeaderElement(5).getAttribute('aria-selected')).toEqual('true');
    // Type matching valid passwords
    page.getFirstInput().sendKeys('Valid$2020');
    page.getSecondInput().sendKeys('Valid$2020');
    // Click 'Previous' button -> Back to Step 4
    page.getPreviousButton().click();

    // Check Step 4 tab selected
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    // TODO: Check input field has not changed
    // Click 'Continue' button -> Proceed to Step 5
    page.getContinueButton().click();

    // Check Step 5 tab selected
    expect(page.getMatStepHeaderElement(5).getAttribute('aria-selected')).toEqual('true');
    // Check 'Create Wallet' button is not disabled (previously entered passwords persisted)
    expect(page.getContinueButton().getAttribute('ng-reflect-disabled')).toEqual('false');

    // With completed form, fully navigate all steps then submit
    // browser.sleep(700) utilized to allow for transition animation time.
    page.getPreviousButton().click().then(() => browser.sleep(700)); // Back to Step 4
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    page.getPreviousButton().click().then(() => browser.sleep(700)); // Back to Step 3
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    page.getPreviousButton().click().then(() => browser.sleep(700)); // Back to Step 2
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    page.getPreviousButton().click().then(() => browser.sleep(700)); // Back to Step 1
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    page.getContinueButton().click().then(() => browser.sleep(700)); // Proceed to Step 2
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    page.getContinueButton().click().then(() => browser.sleep(700)); // Proceed to Step 3
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    page.getContinueButton().click().then(() => browser.sleep(700)); // Proceed to Step 4
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    page.getContinueButton().click().then(() => browser.sleep(700)); // Proceed to Step 5
    expect(page.getMatStepHeaderElement(5).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(1).click().then(() => browser.sleep(700)); // Tab to Step 1
    expect(page.getMatStepHeaderElement(1).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(2).click().then(() => browser.sleep(700)); // Tab to Step 2
    expect(page.getMatStepHeaderElement(2).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(3).click().then(() => browser.sleep(700)); // Tab to Step 3
    expect(page.getMatStepHeaderElement(3).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(4).click().then(() => browser.sleep(700)); // Tab to Step 4
    expect(page.getMatStepHeaderElement(4).getAttribute('aria-selected')).toEqual('true');
    page.getMatStepHeaderElement(5).click().then(() => browser.sleep(700)); // Tab to Step 5
    expect(page.getMatStepHeaderElement(5).getAttribute('aria-selected')).toEqual('true');
    // Click 'Continue' button -> Proceed to wallet generation
    page.getContinueButton().click();
    // (Deposit Data tested in unit test)
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
