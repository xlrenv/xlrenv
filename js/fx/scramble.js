/* ==========================================================================
   CIPHER / HEX TEXT SCRAMBLE ENGINE
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});
  const GLYPHS = '01X/#_+=:;[]<>\\|';
  const activeTimers = new WeakMap();

  XLR.scramble = function (el, targetText, duration) {
    if (!el) return;
    const finalStr = targetText !== undefined ? targetText : el.getAttribute('data-text') || el.textContent;

    if (XLR.state && XLR.state.reducedMotion) {
      el.textContent = finalStr;
      return;
    }

    if (activeTimers.has(el)) {
      cancelAnimationFrame(activeTimers.get(el));
    }

    const totalMs = duration || 300;
    const start = performance.now();
    const len = finalStr.length;

    function step(now) {
      const progress = Math.min(1, (now - start) / totalMs);
      const settled = Math.floor(progress * len);
      let out = '';

      for (let i = 0; i < len; i++) {
        const ch = finalStr[i];
        if (ch === ' ') {
          out += ' ';
        } else if (i < settled) {
          out += ch;
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }

      el.textContent = out;

      if (progress < 1) {
        const id = requestAnimationFrame(step);
        activeTimers.set(el, id);
      } else {
        el.textContent = finalStr;
        activeTimers.delete(el);
      }
    }

    const id = requestAnimationFrame(step);
    activeTimers.set(el, id);
  };
})();
