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
    const txt = isBone ? 'MODE: BONE' : 'MODE: VOID';
    if (XLR.scramble) {
      XLR.scramble(btn, txt, 220);
    } else {
      btn.textContent = txt;
    }
  }

  function updateSfxButton() {
    const btn = document.getElementById('sfx-toggle');
    if (!btn) return;
    const on = XLR.state.sfx;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'SFX: ON' : 'SFX: OFF';
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

    // Live UTC clock
    const clockEl = document.getElementById('hud-clock');
    function tickClock() {
      if (!clockEl) return;
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      clockEl.textContent = hh + ':' + mm + ':' + ss + ' UTC';
    }
    tickClock();
    setInterval(tickClock, 1000);

    // Deterministic-looking ephemeral session fingerprint
    const hashEl = document.getElementById('hud-hash');
    if (hashEl) {
      const hex = '0123456789abcdef';
      let fp = '';
      for (let i = 0; i < 8; i++) {
        fp += hex[(Math.random() * 16) | 0];
      }
      hashEl.textContent = '// SHA:' + fp;
    }
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
        if (!value) return;

        function notify() {
          if (XLR.audio) XLR.audio.play('switch');
          if (toast) {
            if (XLR.scramble) {
              XLR.scramble(toast, '[ COPIED TO CLIPBOARD // ' + value + ' ]', 240);
            } else {
              toast.textContent = '[ COPIED TO CLIPBOARD // ' + value + ' ]';
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
