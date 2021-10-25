'use strict';

import Pages from "./pages.js";
import Logger from "./logger.js";

export default class SignIn {
  isSignUpPage = true;

  constructor(isSignUpPage) {
    this.isSignUpPage = isSignUpPage
  }

  async init() {
    try {
      this._listenForButtonClicks();

      firebase.auth().onAuthStateChanged(currentUser => {
        try {
          if (currentUser) { window.location.href = Pages.HOME.uri }
          else {
            document.getElementById('loadingAuthStatusSpinner').style.visibility = 'hidden';
            document.getElementById('container').style.visibility = 'visible';
            console.log("User is signed out");
          }
        }
        catch (e) {
          Logger.error(e);
          Logger.showErrorMessage(e);
        }
      });
    }
    catch (e) {
      Logger.error(e);
      Logger.showErrorMessage(e);
    }
  }

  _listenForButtonClicks() {
    //password input enter click
    document.getElementById("passwordInput").addEventListener('keyup', async event => {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (this.isSignUpPage) { await this._signUpWithEmailPassword() }
        else { await this._signInWithEmailPassword() }
      }
    });

    document.getElementById("signInUpButton").addEventListener('click', async event => {
      if (this.isSignUpPage) { await this._signUpWithEmailPassword() }
      else { await this._signInWithEmailPassword() }
    });

    //reset password button
    if (!this.isSignUpPage) {
      document.getElementById('resetPasswordButton').addEventListener('click', async () => {
        await this._resetPassword();
      });
    }
  }

  async _signUpWithEmailPassword() {
    document.getElementById('loadingAuthStatusSpinner').style.visibility = 'visible';

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    }
    catch (e) {
      document.getElementById('loadingAuthStatusSpinner').style.visibility = 'hidden';
      const errorCode = e.code;
      const errorMessage = e.message;

      switch (errorCode) {
        case 'auth/email-already-in-use':
          Logger.showWarning(`That email is already in use. Go to the sign in if you already have an account.`);
          break;
        case 'auth/invalid-email':
          Logger.showWarning(`That's not a valid email for some reason. Try using a different email.`);
          break;
        case 'auth/weak-password':
          Logger.showWarning(`That password isn't strong enough. Make it greater than 6 characters and add a number.`);
          break;
        default:
          console.error(`Unexpected error during sign up. Error code: ${errorCode} and error message: ${errorMessage}`);
          await Logger.error(e);
          Logger.showWarning(`Sorry, something went wrong while signing up. Try again and contact us if the issue continues.`);
          break;
      }
    }
  }

  async _signInWithEmailPassword() {
    document.getElementById('loadingAuthStatusSpinner').style.visibility = 'visible';

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      window.location.href = Pages.HOME.uri;
    }
    catch (error) {
      document.getElementById('loadingAuthStatusSpinner').style.visibility = 'hidden';
      const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case 'auth/user-not-found':
          Logger.showWarning(`We couldn't find an account with that email. <a href="${Pages.SIGN_UP.uri}">Sign up here</a> if you need to make an account.`);
          break;
        case 'auth/user-disabled':
          Logger.showWarning(`The account for that email was disabled. Contact us at donaldbough@gmail.com for more information.`);
          break;
        case 'auth/invalid-email':
          Logger.showWarning(`That's not a valid email for some reason. Try using a different email.`);
          break;
        case 'auth/wrong-password':
          Logger.showWarning(`That password was incorrect. Try again or reset your password below.`);
          break;
        default:
          console.error(`Unexpected error during sign up. Error code: ${errorCode} and error message: ${errorMessage}`);
          await Logger.error(error);
          await Logger.showWarning(`Sorry, something went wrong while signing in. Try again and contact us if the issue continues.`);
          break;
      }
    }
  }

  async _resetPassword() {
    document.getElementById('loadingAuthStatusSpinner').style.visibility = 'visible';

    const email = document.getElementById('emailInput').value.trim();
    if (email === '') {
      Logger.showWarning('Enter the email you want to reset first, then click reset again.');
      document.getElementById('loadingAuthStatusSpinner').style.visibility = 'hidden';
      return;
    }
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      document.getElementById('loadingAuthStatusSpinner').style.visibility = 'hidden';
      Logger.showMessage('✅ Great! We sent a password reset link to your email. Once you change it, come back here and login again.')
    }
    catch (error) {
      await Logger.error(error);
      document.getElementById('loadingAuthStatusSpinner').style.visibility = 'hidden';
      Logger.showWarning(`Sorry, we couldn't send a password reset email. Try again and contact us if the issue continues.`);
    }
  }
}
