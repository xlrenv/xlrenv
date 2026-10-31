/* ==========================================================================
   CORNER-BRACKET RETICLE CURSOR — MAGNETIC BOUNDING-BOX SNAP
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});

  function initCursor() {
    if (
      !window.matchMedia ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }

    const dot = document.getElementById('cursor-dot');
    const reticle = document.getElementById('cursor-reticle');
    if (!dot || !reticle) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let rw = 22;
    let rh = 22;
    let lockedEl = null;
    let visible = false;

    document.addEventListener(
      'mouseover',
      function (e) {
        const target = e.target.closest(
          'button, a, [data-reticle], #sigil-wrap'
        );
        if (target) {
          if (lockedEl !== target && XLR.audio) {
            XLR.audio.play('hover');
          }
          lockedEl = target;
          reticle.classList.add('is-locked');
        }
      },
      { passive: true }
    );

    document.addEventListener(
      'mouseout',
      function (e) {
        if (!lockedEl) return;
        const related = e.relatedTarget;
        if (!related || !lockedEl.contains(related)) {
          lockedEl = null;
          reticle.classList.remove('is-locked');
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'pointermove',
      function (e) {
        if (!visible) {
          visible = true;
          dot.style.opacity = '1';
          reticle.style.opacity = '1';
          rx = e.clientX;
          ry = e.clientY;
        }
        dot.style.transform =
          'translate3d(' + (e.clientX - 2) + 'px,' + (e.clientY - 2) + 'px,0)';
      },
      { passive: true }
    );

    function tick() {
      const px = XLR.state.pointer.x;
      const py = XLR.state.pointer.y;

      let tx = px;
      let ty = py;
      let tw = 22;
      let th = 22;

      if (lockedEl && document.body.contains(lockedEl)) {
        const rect = lockedEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          tx = rect.left + rect.width / 2;
          ty = rect.top + rect.height / 2;
          tw = rect.width + 10;
          th = rect.height + 10;
        } else {
          lockedEl = null;
          reticle.classList.remove('is-locked');
        }
      }

      const ease = XLR.state.reducedMotion ? 1 : 0.24;
      rx += (tx - rx) * ease;
      ry += (ty - ry) * ease;
      rw += (tw - rw) * ease;
      rh += (th - rh) * ease;

      reticle.style.width = rw.toFixed(1) + 'px';
      reticle.style.height = rh.toFixed(1) + 'px';
      reticle.style.transform =
        'translate3d(' +
        (rx - rw / 2).toFixed(1) +
        'px,' +
        (ry - rh / 2).toFixed(1) +
        'px,0)';

      requestAnimationFrame(tick);
    }

    dot.style.opacity = '0';
    reticle.style.opacity = '0';
    requestAnimationFrame(tick);
  }

  XLR.initCursor = initCursor;
})();
