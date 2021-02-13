import 'alpinejs';

import confetti from 'canvas-confetti';

window.LANDING_PAGE_MODEL = {
  api: {
    baseUrl: 'https://api.proptee.co.uk/v0',

    waitinglist: {
      join(emailAddress) {
        const email = encodeURIComponent(emailAddress);
        const referredBy = encodeURIComponent(STATE.waitingList.info.referredByCode || '');

        return fetch(`${LANDING_PAGE_MODEL.api.baseUrl}/waitinglist/investor-join?email=${email}&referredBy=${referredBy}`).then(function (res) {
          console.log(res.status, res.statusText);
          return res.json();
        });
      },

      bump(emailAddress, upOrDown) {
        const email = encodeURIComponent(emailAddress);
        const uod = encodeURIComponent(upOrDown);

        return fetch(`${LANDING_PAGE_MODEL.api.baseUrl}/waitinglist/bump?email=${email}&uod=${uod}`).then(function (res) {
          console.log(res.status, res.statusText);
          if (res.status === 204) {
            throw new Error(`BUMP_RESPONSE_204_REACHED_END`);
          }
          if (res.status === 400) {
            throw new Error(`You've run out of bumps today.`);
          }
          return res.json();
        });
      },
    },
  },

  waitingList: {
    signedInEmail: localStorage.getItem('waitingList.signedInEmail'),

    form: {
      emailAddress: '',
      submitting: false,
      showingForm: !localStorage.getItem('waitingList.signedInEmail'),
      showingCongrats: !!localStorage.getItem('waitingList.signedInEmail'),

      /**
       * @param {String} emailAddress
       */
      submit(emailAddress, formLabel) {
        STATE.waitingList.form.submitting = true;

        emailAddress = (emailAddress && emailAddress.trim()) || '';

        if (!emailAddress || emailAddress.length <= 0) {
          alert('Email address cannot be empty. Try again!');
          STATE.waitingList.form.submitting = false;
          return;
        }

        joinWaitingList(emailAddress, formLabel);
      },

      signOut() {
        console.log('signing out');
        localStorage.clear();
        setTimeout(function () {
          STATE.waitingList.form.showingForm = true;
          STATE.waitingList.signedInEmail = '';
        }, 200);
        STATE.waitingList.form.showingCongrats = false;
      },
    },

    info: {
      positionInQueue: localStorage.getItem('waitingList.info.positionInQueue') || localStorage.getItem('waitingList.info.peopleAheadOfYou') + 1,
      totalQueueLength: localStorage.getItem('waitingList.info.totalQueueLength'),
      referralCount: localStorage.getItem('waitingList.info.referralCount'),
      referralCode: localStorage.getItem('waitingList.info.referralCode'),
      referredByCode: localStorage.getItem('waitingList.info.referredByCode'),
    },

    socialLinks: {
      facebook: localStorage.getItem('waitingList.socialLinks.facebook'),
      twitter: localStorage.getItem('waitingList.socialLinks.twitter'),
      messenger: localStorage.getItem('waitingList.socialLinks.messenger'),
      whatsapp: localStorage.getItem('waitingList.socialLinks.whatsapp'),
    },

    easterEgg: {
      bumpsLeftLastCheckedAt: localStorage.getItem('waitingList.easterEgg.bumpsLeftLastCheckedAt'),
      showNoBumpsLeftAlert: false,
      showNoBumpsLeftAlertTimeoutId: undefined,
      showNeedToSignInToBump: false,
      showNeedToSignInToBumpTimeoutId: undefined,

      up: {
        bumpsLeftToday: localStorage.getItem('waitingList.easterEgg.up.bumpsLeftToday'),
        isAnimatingBtn: false,
        animationTimeoutId: undefined,
        optimisticUpdateTimeoutId: undefined,

        bump() {
          window.STATE.waitingList.easterEgg.bump('up');
        },
      },

      down: {
        bumpsLeftToday: localStorage.getItem('waitingList.easterEgg.down.bumpsLeftToday'),
        isAnimatingBtn: false,
        animationTimeoutId: undefined,
        optimisticUpdateTimeoutId: undefined,

        bump() {
          window.STATE.waitingList.easterEgg.bump('down');
        },
      },

      bump(upOrDown) {
        if (window.STATE.waitingList.easterEgg.showNeedToSignInToBump) {
          // this happens when they click too quickly on the easter eggs
          // and we're already showing a toast
          return;
        }

        if (!window.STATE.waitingList.signedInEmail) {
          // not signed in on email list, tell them to sign in first
          clearTimeout(window.STATE.waitingList.easterEgg.showNeedToSignInToBumpTimeoutId);
          window.STATE.waitingList.easterEgg.showNeedToSignInToBump = true;
          window.STATE.waitingList.easterEgg.showNeedToSignInToBumpTimeoutId = setTimeout(function () {
            window.STATE.waitingList.easterEgg.showNeedToSignInToBump = false;
          }, 2000);
          return;
        }

        if (window.STATE.waitingList.easterEgg[upOrDown].isAnimatingBtn) {
          return;
        }

        if (window.STATE.waitingList.easterEgg.showNoBumpsLeftAlert) {
          return;
        }

        // if the bump happens a day or more after the last check, refresh the page first
        if (new Date(window.STATE.waitingList.easterEgg.bumpsLeftLastCheckedAt).toISOString().substring(0, 10) != new Date().toISOString().substring(0, 10)) {
          location.reload();
        }

        if (window.STATE.waitingList.easterEgg[upOrDown].bumpsLeftToday <= 0) {
          clearTimeout(window.STATE.waitingList.easterEgg.showNoBumpsLeftAlertTimeoutId);
          window.STATE.waitingList.easterEgg.showNoBumpsLeftAlert = true;
          window.STATE.waitingList.easterEgg.showNoBumpsLeftAlertTimeoutId = setTimeout(function () {
            window.STATE.waitingList.easterEgg.showNoBumpsLeftAlert = false;
          }, 700);
          return;
        }

        function setAnimating(durationMs) {
          console.log('animating bump', upOrDown);
          return new Promise(function (resolve) {
            clearTimeout(window.STATE.waitingList.easterEgg[upOrDown].animationTimeoutId);
            clearTimeout(window.STATE.waitingList.easterEgg[upOrDown].optimisticUpdateTimeoutId);
            window.STATE.waitingList.easterEgg[upOrDown].isAnimatingBtn = true;
            window.STATE.waitingList.easterEgg[upOrDown].animationTimeoutId = setTimeout(function () {
              window.STATE.waitingList.easterEgg[upOrDown].isAnimatingBtn = false;
              resolve();
            }, durationMs);
            window.STATE.waitingList.easterEgg[upOrDown].optimisticUpdateTimeoutId = setTimeout(function () {
              if (upOrDown === 'up') {
                if (window.STATE.waitingList.info.positionInQueue > 1) {
                  window.STATE.waitingList.info.positionInQueue--;
                }
              }

              if (upOrDown === 'down') {
                if (window.STATE.waitingList.info.positionInQueue < 440) {
                  window.STATE.waitingList.info.positionInQueue++;
                }
              }
            }, durationMs / 2);
          });
        }

        function makeRequestToServer() {
          return LANDING_PAGE_MODEL.api.waitinglist.bump(window.STATE.waitingList.signedInEmail, upOrDown);
        }

        Promise.all([setAnimating(500), makeRequestToServer()])
          .then(function ([_, info]) {
            console.log('got bump json response', info);
            checkInfoOrThrow(info);

            // success only
            console.log('bump success');

            // save for later
            updateAppStateAndLocalStorage(info);

            // track event
            if (window.ga) {
              window.ga('send', 'event', 'Waiting List Forms', 'bump', upOrDown);
            }
          })
          .catch(function (err) {
            // fail only
            if (err && err.message && err.message.includes('BUMP_RESPONSE_204_REACHED_END')) {
              // don't do anything
              return;
            }
            console.error('error bumping', err);
            alert(`Error Bumping: ${err && err.message}`);
          });
      },
    },
  },

  cookies: {
    showCookieNotice: localStorage.getItem('cookies.showCookieNotice') !== 'false',

    ack() {
      STATE.cookies.showCookieNotice = false;
      localStorage.setItem('cookies.showCookieNotice', 'false');
    },
  },

  init() {
    window.STATE = this; // save reference to Alpine.js model state
    checkReferredByCode();
    updateWaitingListPosition();
  },
};

function checkReferredByCode() {
  const url = new URL(document.location);
  const referredByCode = url.searchParams.get('r');
  if (typeof referredByCode === 'string' && referredByCode && referredByCode.length > 0) {
    localStorage.setItem('waitingList.info.referredByCode', referredByCode);
    STATE.waitingList.info.referredByCode = referredByCode;
  }
}

function joinWaitingList(emailAddress, formLabel) {
  const requestStartedAt = Date.now();

  LANDING_PAGE_MODEL.api.waitinglist
    .join(emailAddress)
    .then(function (info) {
      const requestEndedAt = Date.now();
      const requestDuration = requestEndedAt - requestStartedAt;
      const targetDuration = 500; // ms

      if (requestDuration >= targetDuration) {
        return info;
      } else {
        const delay = targetDuration - requestDuration;
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve(info);
          }, delay);
        });
      }
    })
    .then(function (info) {
      console.log('got json response', info);
      checkInfoOrThrow(info);

      // success only
      console.log('login success');

      // save for later
      updateAppStateAndLocalStorage(info);

      // celebrate
      shootConfetti();

      // track event
      if (window.ga) {
        window.ga('send', 'event', 'Waiting List Forms', 'submit', formLabel);
      }
    })
    .catch(function (err) {
      // fail only
      console.error(err);
      alert(`Error: ${err && err.message}`);
    })
    .then(function () {
      // both success and fail
      console.log('finally');

      // stop loading
      STATE.waitingList.form.emailAddress = '';
      STATE.waitingList.form.submitting = false;
    });
}

function updateWaitingListPosition() {
  if (!STATE.waitingList.signedInEmail) {
    return;
  }

  LANDING_PAGE_MODEL.api.waitinglist
    .join(STATE.waitingList.signedInEmail)
    .then(function (info) {
      console.log('got json response', info);
      checkInfoOrThrow(info);

      // success only
      console.log('position refresh success');

      // save for later
      updateAppStateAndLocalStorage(info);
    })
    .catch(function (err) {
      // fail only
      console.error(err);
    });
}

function updateAppStateAndLocalStorage(info) {
  localStorage.setItem('waitingList.signedInEmail', info.email);
  STATE.waitingList.signedInEmail = info.email;

  setTimeout(function () {
    STATE.waitingList.form.showingCongrats = !!info.email;
  }, 200);
  STATE.waitingList.form.showingForm = !info.email;

  STATE.waitingList.info.positionInQueue = parseInt(info.position);
  localStorage.setItem('waitingList.info.positionInQueue', STATE.waitingList.info.positionInQueue);

  STATE.waitingList.info.totalQueueLength = parseInt(info.total);
  localStorage.setItem('waitingList.info.totalQueueLength', STATE.waitingList.info.totalQueueLength);

  STATE.waitingList.info.referralCount = parseInt(info.referralCount);
  localStorage.setItem('waitingList.info.referralCount', STATE.waitingList.info.referralCount);

  let refBaseURL = document.location.pathname.indexOf('/invest') === 0 ? 'https://proptee.io/invest' : 'https://proptee.io/';
  STATE.waitingList.info.referralCode = `${refBaseURL}?r=${info.refCode || '123'}`;
  localStorage.setItem('waitingList.info.referralCode', STATE.waitingList.info.referralCode);

  STATE.waitingList.socialLinks.facebook = createFacebookShareLink(STATE.waitingList.info.referralCode);
  localStorage.setItem('waitingList.socialLinks.facebook', STATE.waitingList.socialLinks.facebook);

  STATE.waitingList.socialLinks.twitter = createTwitterShareLink(parseInt(info.position), STATE.waitingList.info.referralCode);
  localStorage.setItem('waitingList.socialLinks.twitter', STATE.waitingList.socialLinks.twitter);

  STATE.waitingList.socialLinks.messenger = createMessengerShareLink(STATE.waitingList.info.referralCode);
  localStorage.setItem('waitingList.socialLinks.messenger', STATE.waitingList.socialLinks.messenger);

  STATE.waitingList.socialLinks.whatsapp = createWhatsAppShareLink(parseInt(info.position), STATE.waitingList.info.referralCode);
  localStorage.setItem('waitingList.socialLinks.whatsapp', STATE.waitingList.socialLinks.whatsapp);

  STATE.waitingList.easterEgg.up.bumpsLeftToday = parseInt(info.upBumpsLeftToday);
  localStorage.setItem('waitingList.easterEgg.up.bumpsLeftToday', STATE.waitingList.easterEgg.up.bumpsLeftToday);

  STATE.waitingList.easterEgg.down.bumpsLeftToday = parseInt(info.downBumpsLeftToday);
  localStorage.setItem('waitingList.easterEgg.down.bumpsLeftToday', STATE.waitingList.easterEgg.down.bumpsLeftToday);

  STATE.waitingList.easterEgg.bumpsLeftLastCheckedAt = Date.now();
  localStorage.setItem('waitingList.easterEgg.bumpsLeftLastCheckedAt', STATE.waitingList.easterEgg.bumpsLeftLastCheckedAt);
}

function shootConfetti() {
  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  };

  function fire(particleRatio, opts) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function checkInfoOrThrow(info) {
  if (typeof info.email !== 'string') console.log(new Error('Bad response from server: missing email'));
  if (typeof info.position !== 'number') console.log(new Error('Bad response from server: missing position'));
  if (typeof info.total !== 'number') console.log(new Error('Bad response from server: missing total'));
  if (typeof info.referralCount !== 'number') console.log(new Error('Bad response from server: missing referralCount'));
  if (typeof info.refCode !== 'string') console.log(new Error('Bad response from server: missing refCode'));
  if (typeof info.upBumpsLeftToday !== 'number') console.log(new Error('Bad response from server: missing upBumpsLeftToday'));
  if (typeof info.downBumpsLeftToday !== 'number') console.log(new Error('Bad response from server: missing downBumpsLeftToday'));
}

function createFacebookShareLink(referralCodeLink) {
  return `https://www.facebook.com/sharer.php?u=${encodeURIComponent(referralCodeLink)}`;
}

function createTwitterShareLink(positionNum, referralCodeLink) {
  const text = `I just joined @PropteeApp and I'm #${positionNum} on the waiting list! 👉`;
  return `https://twitter.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralCodeLink)}&hashtags=GetProptee,RealEstate,PropertyInvestment`;
}

function createMessengerShareLink(referralCodeLink) {
  if (isMobile()) {
    return `fb-messenger://share?app_id=381603149471837&link=${encodeURIComponent(referralCodeLink)}`;
  } else {
    let redirectUri = document.location.pathname.indexOf('/invest') === 0 ? 'https://proptee.io/invest' : 'https://proptee.io/';
    return `https://www.facebook.com/dialog/send?app_id=381603149471837&link=${encodeURIComponent(referralCodeLink)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
}

function createWhatsAppShareLink(positionNum, referralCodeLink) {
  const msg = `I just joined Proptee and I'm #${positionNum} on the waiting list! #GetProptee #RealEstate #PropertyInvestment ${referralCodeLink}`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

function isMobile() {
  return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);
}
