/* ==========================================================================
   SUBTLE CURSOR-REACTIVE COORDINATE MATRIX (SPARSE MINIMALIST FIELD)
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});

  function initBgField() {
    const canvas = document.getElementById('bg-field');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let dpr = 1;
    const SPACING = 48;
    const RADIUS = 155;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    function render() {
      ctx.clearRect(0, 0, width, height);

      const isBone = XLR.state.theme === 'bone';
      const baseRgb = isBone ? '17, 17, 17' : '244, 244, 238';
      const px = XLR.state.pointer.x;
      const py = XLR.state.pointer.y;
      const hasPointer = XLR.state.pointer.active && !XLR.state.reducedMotion;

      const offsetX = (width % SPACING) * 0.5;
      const offsetY = (height % SPACING) * 0.5;

      for (let y = offsetY; y < height; y += SPACING) {
        for (let x = offsetX; x < width; x += SPACING) {
          let dx = x - px;
          let dy = y - py;
          let distSq = dx * dx + dy * dy;

          if (hasPointer && distSq < RADIUS * RADIUS) {
            const dist = Math.sqrt(distSq) || 1;
            const factor = 1 - dist / RADIUS;
            const push = factor * factor * 5.5;
            const rx = x + (dx / dist) * push;
            const ry = y + (dy / dist) * push;
            const alpha = (0.09 + factor * 0.36).toFixed(3);

            ctx.fillStyle = 'rgba(' + baseRgb + ',' + alpha + ')';
            if (factor > 0.58) {
              // Crisp micro-crosshair near cursor
              ctx.fillRect(rx - 2.5, ry - 0.5, 5, 1);
              ctx.fillRect(rx - 0.5, ry - 2.5, 1, 5);
            } else {
              ctx.fillRect(rx - 0.75, ry - 0.75, 1.5, 1.5);
            }
          } else {
            ctx.fillStyle = 'rgba(' + baseRgb + ',0.065)';
            ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
          }
        }
      }

      if (!XLR.state.reducedMotion) {
        requestAnimationFrame(render);
      }
    }

    XLR.on('themechange', function () {
      if (XLR.state.reducedMotion) render();
    });

    requestAnimationFrame(render);
  }

  XLR.initBgField = initBgField;
})();
