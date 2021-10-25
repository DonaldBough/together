'use strict';

import Pages from "./pages.js";

export default class Navbar {
  static init() {
    document.getElementById('todayNavButton').addEventListener('click', () => {
      window.location.href = Pages.HOME.uri;
    });

    document.getElementById('profileNavButton').addEventListener('click', () => {
      window.location.href = Pages.PROFILE.uri;
    });
  }
}