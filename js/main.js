/* ==========================================================================
   MAIN BOOTSTRAP — CHOREOGRAPHY, HUD TELEMETRY & CLIPBOARD
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});

  function updateThemeButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isBone = XLR.state.theme === 'bone';
    btn.setAttribute('aria-pressed', isBone ? 'true' : 'false');
  }

  function updateSfxButton() {
    const btn = document.getElementById('sfx-toggle');
    if (!btn) return;
    const on = XLR.state.sfx;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function initHud() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        XLR.toggleTheme();
      });
    }

    const sfxBtn = document.getElementById('sfx-toggle');
    if (sfxBtn && XLR.audio) {
      sfxBtn.addEventListener('click', function () {
        XLR.audio.toggle();
      });
    }

    XLR.on('themechange', updateThemeButton);
    XLR.on('sfxchange', updateSfxButton);

    updateThemeButton();
    updateSfxButton();
  }

  function initHeroInteractions() {
    const roleEl = document.getElementById('hero-role-text');
    if (roleEl && XLR.scramble) {
      setTimeout(function () {
        XLR.scramble(roleEl, 'devsecops engineer', 480);
      }, 180);

      roleEl.parentElement.addEventListener('mouseenter', function () {
        XLR.scramble(roleEl, 'devsecops engineer', 260);
      });
    }

    const nickEl = document.getElementById('hero-nick');
    if (nickEl) {
      nickEl.addEventListener('click', function () {
        XLR.triggerGlitch();
      });
    }
  }

  function initCopyActions() {
    const toast = document.getElementById('copy-toast');
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const value = btn.getAttribute('data-copy');
        const customLabel = btn.getAttribute('data-copy-label');
        if (!value) return;

        function notify() {
          if (XLR.audio) XLR.audio.play('switch');
          if (toast) {
            const msg = customLabel || '[ COPIED TO CLIPBOARD // ' + value + ' ]';
            if (XLR.scramble) {
              XLR.scramble(toast, msg, 240);
            } else {
              toast.textContent = msg;
            }
          }
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(notify).catch(function () {
            fallbackCopy(value);
            notify();
          });
        } else {
          fallbackCopy(value);
          notify();
        }
      });
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (_) {}
    document.body.removeChild(ta);
  }

  document.addEventListener('DOMContentLoaded', function () {
    XLR.applyTheme(XLR.state.theme, false);
    if (XLR.initCursor) XLR.initCursor();
    if (XLR.initBgField) XLR.initBgField();
    if (XLR.initSigil) XLR.initSigil();
    if (XLR.initViews) XLR.initViews();
    if (XLR.initTerminal) XLR.initTerminal();
    initHud();
    initHeroInteractions();
    initCopyActions();
  });
})();
