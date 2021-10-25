'use strict';

export default class Logger {
  static error(error, isSlackError = false) {
    console.error(`${error} - ${error?.stack}`);
  }

  static showWarning(message) {
    alert('⚠️🤷 ' + message);
  }

  static showMessage(message) {
    alert(message);
  }

  static showErrorMessage(error = {}, actionCausingError, errorSolution) {
    const formattedMessage = this._getFormattedErrorMessage(error, actionCausingError, errorSolution);
    Logger._showErrorMessage(formattedMessage, error);
  }

  static _showErrorMessage(message, error) {
    prompt(message, `${error}\n\n${error?.stack}`);
  }

  static logDebug(message) {
    console.warn(message);
  }

  static _getFormattedErrorMessage(error, actionCausingError, errorSolution = 'try refreshing the page or try again later') {
    let displayMessage;

    if (actionCausingError) {
      displayMessage = `❌🙃 Sorry, we had a problem ${actionCausingError}. For now ${errorSolution}.`;
    }
    else {
      displayMessage = `❌🙃 Sorry, we ran into an error, ${errorSolution}`
    }

    displayMessage +=
        `\n\nIf this keeps happening, copy and send this technical jargon to donaldbough@gmail.com so we can fix it:`;

    return displayMessage;
  }
}