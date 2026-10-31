/* ==========================================================================
   CORE STATE & EVENT BUS
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});
  const listeners = {};

  let savedTheme = 'void';
  try {
    const params = new URLSearchParams(window.location.search);
    const qTheme = params.get('theme');
    const t = qTheme || localStorage.getItem('xlrenv_theme');
    if (t === 'bone' || t === 'void') savedTheme = t;
  } catch (_) {}

  XLR.state = {
    theme: savedTheme,
    view: 'index',
    sfx: false,
    topology: 0,
    topologyNames: [
      '01 // OCTA-SIGIL',
      '02 // ZERO-TRUST CAGE',
      '03 // CIPHER RINGS',
      '04 // VAULT CORE'
    ],
    reducedMotion:
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    pointer: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      nx: 0,
      ny: 0,
      active: false
    }
  };

  XLR.on = function (event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  };

  XLR.emit = function (event, payload) {
    const list = listeners[event];
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      list[i](payload);
    }
  };

  XLR.applyTheme = function (theme, withFlash) {
    XLR.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('xlrenv_theme', theme);
    } catch (_) {}

    if (withFlash && !XLR.state.reducedMotion) {
      const flash = document.getElementById('shutter-flash');
      if (flash) {
        flash.classList.remove('is-active');
        void flash.offsetWidth;
        flash.classList.add('is-active');
      }
    }

    XLR.emit('themechange', theme);
  };

  XLR.toggleTheme = function () {
    const next = XLR.state.theme === 'void' ? 'bone' : 'void';
    XLR.applyTheme(next, true);
    if (XLR.audio) XLR.audio.play('switch');
    return next;
  };

  XLR.triggerGlitch = function () {
    if (XLR.state.reducedMotion) return;
    document.body.classList.remove('is-glitching');
    void document.body.offsetWidth;
    document.body.classList.add('is-glitching');
    if (XLR.audio) XLR.audio.play('glitch');
    setTimeout(function () {
      document.body.classList.remove('is-glitching');
    }, 260);
  };

  // Track normalized pointer coordinates globally
  window.addEventListener(
    'pointermove',
    function (e) {
      XLR.state.pointer.x = e.clientX;
      XLR.state.pointer.y = e.clientY;
      XLR.state.pointer.nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      XLR.state.pointer.ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
      XLR.state.pointer.active = true;
    },
    { passive: true }
  );
})();
