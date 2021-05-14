import 'alpinejs';

window.LANDING_PAGE_MODEL = {
  cookies: {
    showCookieNotice: localStorage.getItem('cookies.showCookieNotice') !== 'false',

    ack() {
      STATE.cookies.showCookieNotice = false;
      localStorage.setItem('cookies.showCookieNotice', 'false');
    },
  },
  init() {
    window.STATE = this; // save reference to Alpine.js model state
  },
};
