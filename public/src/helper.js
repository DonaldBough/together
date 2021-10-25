import Logger from "./logger.js";

export default class Helper {
  static setButtonToLoading(buttonId, message = 'Loading') {
    const button = document.getElementById(buttonId);
    if (!button) {
      Logger.error(`Tried to set button to loading that didn't exist for id: ${buttonId}`);
      return;
    }
    window.myPreviousButtonId = buttonId;
    window.myPreviousButtonHtml = button.innerHTML;
    button.classList.add('disabled');
    button.innerHTML = `
      <span style="color: white;">${message}...</span>
      <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
    `;
  }

  static stopButtonLoading(newButtonHTML) {
    if (!window.myPreviousButtonId) {
      Logger.error(`Couldn't find previous button id when stopping button loading.`);
      return;
    }
    const buttonId = window.myPreviousButtonId;
    const button = document.getElementById(buttonId);
    if (!button) {
      Logger.error(`Tried to stop button loading that didn't exist for id: ${buttonId}`);
      return;
    }
    if (!window.myPreviousButtonHtml) {
      Logger.error(`No previous button html set for button id: ${buttonId}`);
      return;
    }
    button.innerHTML = newButtonHTML || window.myPreviousButtonHtml;
    button.classList.remove('disabled');
  }

  static confettiTime() {
    try {
      if (!window.confetti) { throw new Error('Confetti was falsy during confetti time :( ') }

      //from https://github.com/catdad/canvas-confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.2 }
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.8 }
      });
    }
    catch (error) {
      this.logError(error);
    }
  }
}