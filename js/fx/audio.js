/* ==========================================================================
   TACTILE MICRO-AUDIO SYNTHESIZER (WEB AUDIO API — ZERO EXTERNAL FILES)
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});
  let ctx = null;

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  function play(type) {
    if (!XLR.state.sfx) return;
    const ac = ensureContext();
    if (!ac) return;

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain);
    gain.connect(ac.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1320, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.018);
      gain.gain.setValueAtTime(0.022, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
      osc.start(now);
      osc.stop(now + 0.02);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.045);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'switch' || type === 'morph') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);
      gain.gain.setValueAtTime(0.032, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'glitch') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.09);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.095);
    }
  }

  function toggle() {
    XLR.state.sfx = !XLR.state.sfx;
    if (XLR.state.sfx) {
      ensureContext();
      play('switch');
    }
    XLR.emit('sfxchange', XLR.state.sfx);
    return XLR.state.sfx;
  }

  XLR.audio = { play: play, toggle: toggle };
})();
