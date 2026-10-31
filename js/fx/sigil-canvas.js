/* ==========================================================================
   REAL-TIME 3D SDF RAYMARCHER + 4x4 BAYER 1-BIT DITHERED SIGIL
   4 Morphable Topologies: Octa-Sigil, Zero-Trust Cage, Cipher Rings, Vault Core
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});

  // Classic 4x4 Ordered Bayer Matrix (0..15)
  const BAYER = [
     0,  8,  2, 10,
    12,  4, 14,  6,
     3, 11,  1,  9,
    15,  7, 13,  5
  ];

  function smin(a, b, k) {
    const h = Math.max(k - Math.abs(a - b), 0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  }

  function rotY(x, z, c, s) {
    return [x * c + z * s, -x * s + z * c];
  }

  function rotX(y, z, c, s) {
    return [y * c - z * s, y * s + z * c];
  }

  // Topology 0: Brutalist 6-Pointed Chrome Star + Octahedron Core
  function sdfOctaSigil(x, y, z) {
    const ax = Math.abs(x);
    const ay = Math.abs(y);
    const az = Math.abs(z);

    const oct = (ax + ay + az - 0.72) * 0.57735;

    const sx = Math.max(ax - 1.22, (ay + az) * 0.7071 - 0.21 * (1.26 - ax * 0.72));
    const sy = Math.max(ay - 1.22, (ax + az) * 0.7071 - 0.21 * (1.26 - ay * 0.72));
    const sz = Math.max(az - 1.22, (ax + ay) * 0.7071 - 0.21 * (1.26 - az * 0.72));

    const spikes = Math.min(sx, Math.min(sy, sz));
    return smin(oct, spikes, 0.11);
  }

  // Topology 1: Hollow Zero-Trust Box Frame + Levitating Inner Core
  function sdfZeroTrustCage(x, y, z) {
    const b = 0.78;
    const e = 0.088;
    const px = Math.abs(x) - b;
    const py = Math.abs(y) - b;
    const pz = Math.abs(z) - b;

    const qx = Math.abs(px + e) - e;
    const qy = Math.abs(py + e) - e;
    const qz = Math.abs(pz + e) - e;

    const d1 =
      Math.hypot(Math.max(px, 0), Math.max(qy, 0), Math.max(qz, 0)) +
      Math.min(Math.max(px, Math.max(qy, qz)), 0);
    const d2 =
      Math.hypot(Math.max(qx, 0), Math.max(py, 0), Math.max(qz, 0)) +
      Math.min(Math.max(qx, Math.max(py, qz)), 0);
    const d3 =
      Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(pz, 0)) +
      Math.min(Math.max(qx, Math.max(qy, pz)), 0);

    const frame = Math.min(d1, Math.min(d2, d3));
    const core = (Math.abs(x) + Math.abs(y) + Math.abs(z) - 0.52) * 0.57735;
    return Math.min(frame, core);
  }

  // Topology 2: Interlocked Orthogonal Cipher Rings + Singularity
  function sdfCipherRings(x, y, z) {
    const t1 = Math.hypot(Math.hypot(x, y) - 0.82, z) - 0.145;
    const t2 = Math.hypot(Math.hypot(y, z) - 0.62, x) - 0.125;
    const core = Math.hypot(x, y, z) - 0.23;
    return Math.min(Math.min(t1, t2), core);
  }

  // Topology 3: Carved Gyroid Cryptographic Vault Core
  function sdfVaultCore(x, y, z) {
    const sphere = Math.hypot(x, y, z) - 0.96;
    const k = 4.3;
    const gyroid =
      (Math.abs(
        Math.sin(x * k) * Math.cos(y * k) +
          Math.sin(y * k) * Math.cos(z * k) +
          Math.sin(z * k) * Math.cos(x * k)
      ) -
        0.34) /
      k;
    return Math.max(sphere, gyroid);
  }

  const SDFS = [sdfOctaSigil, sdfZeroTrustCage, sdfCipherRings, sdfVaultCore];

  function initSigil() {
    const canvas = document.getElementById('sigil-canvas');
    const wrap = document.getElementById('sigil-wrap');
    const caption = document.getElementById('sigil-caption');
    if (!canvas) return;

    const SIZE = 104;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(SIZE, SIZE);
    const buf = imgData.data;

    let fromIdx = 0;
    let toIdx = 0;
    let morph = 1;
    let shockwave = -1;
    let spinBoost = 0;
    let angleY = 0.45;
    let angleX = 0.32;
    let lastTime = performance.now();

    function evalSdf(x, y, z) {
      if (morph >= 0.999) {
        return SDFS[toIdx](x, y, z);
      }
      const a = SDFS[fromIdx](x, y, z);
      const b = SDFS[toIdx](x, y, z);
      const t = morph * morph * (3 - 2 * morph);
      return a + (b - a) * t;
    }

    function cycleTopology() {
      fromIdx = toIdx;
      toIdx = (toIdx + 1) % SDFS.length;
      XLR.state.topology = toIdx;
      morph = 0;
      shockwave = 0;
      spinBoost = 2.6;
      if (caption && XLR.scramble) {
        XLR.scramble(caption, XLR.state.topologyNames[toIdx], 260);
      }
      if (XLR.audio) XLR.audio.play('morph');
    }

    if (wrap) {
      wrap.addEventListener('click', cycleTopology);
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cycleTopology();
        }
      });
    }

    function renderFrame(now) {
      const dt = Math.min(0.05, (now - lastTime) * 0.001);
      lastTime = now;

      if (!XLR.state.reducedMotion) {
        spinBoost *= Math.pow(0.06, dt);
        angleY += dt * (0.68 + spinBoost);
        angleX = 0.34 + Math.sin(now * 0.0009) * 0.2 + XLR.state.pointer.ny * 0.28;
      }

      if (morph < 1) {
        morph = Math.min(1, morph + dt * 2.4);
      }
      if (shockwave >= 0) {
        shockwave += dt * 2.8;
        if (shockwave > 1.5) shockwave = -1;
      }

      const cy = Math.cos(angleY + XLR.state.pointer.nx * 0.35);
      const sy = Math.sin(angleY + XLR.state.pointer.nx * 0.35);
      const cx = Math.cos(angleX);
      const sx = Math.sin(angleX);

      // Ink color from current theme polarity
      const isBone = XLR.state.theme === 'bone';
      const inkR = isBone ? 17 : 244;
      const inkG = isBone ? 17 : 244;
      const inkB = isBone ? 17 : 238;

      // Key light direction (steered subtly by pointer)
      let lx = -0.52 + XLR.state.pointer.nx * 0.45;
      let ly = 0.68 - XLR.state.pointer.ny * 0.45;
      let lz = 0.78;
      const lLen = Math.hypot(lx, ly, lz) || 1;
      lx /= lLen;
      ly /= lLen;
      lz /= lLen;

      const roZ = 3.38;
      const boundR2 = 1.48 * 1.48;
      const roDotRo = roZ * roZ;

      let pIdx = 0;

      for (let py = 0; py < SIZE; py++) {
        const v = 1 - ((py + 0.5) / SIZE) * 2;
        const bayerRow = (py & 3) << 2;

        for (let px = 0; px < SIZE; px++) {
          const u = ((px + 0.5) / SIZE) * 2 - 1;

          // Ray direction
          let rdx = u * 0.76;
          let rdy = v * 0.76;
          let rdz = -1.5;
          const invLen = 1 / Math.hypot(rdx, rdy, rdz);
          rdx *= invLen;
          rdy *= invLen;
          rdz *= invLen;

          // Fast ray-sphere bounding check
          const bDot = roZ * rdz;
          const disc = bDot * bDot - (roDotRo - boundR2);

          let alpha = 0;

          if (disc >= 0) {
            const sqrtD = Math.sqrt(disc);
            let t = Math.max(0.1, -bDot - sqrtD);
            const tMax = -bDot + sqrtD;
            let hit = false;

            for (let step = 0; step < 24; step++) {
              const wx = rdx * t;
              const wy = rdy * t;
              const wz = roZ + rdz * t;

              // Rotate into object space
              const ryz = rotX(wy, wz, cx, sx);
              const y1 = ryz[0];
              const xz2 = rotY(wx, ryz[1], cy, sy);
              const d = evalSdf(xz2[0], y1, xz2[1]);

              if (d < 0.0035) {
                hit = true;
                break;
              }
              t += d;
              if (t > tMax) break;
            }

            if (hit) {
              const wx = rdx * t;
              const wy = rdy * t;
              const wz = roZ + rdz * t;
              const ryz = rotX(wy, wz, cx, sx);
              const y1 = ryz[0];
              const xz2 = rotY(wx, ryz[1], cy, sy);
              const ox = xz2[0];
              const oy = y1;
              const oz = xz2[1];

              // Tetrahedral SDF normal (only 4 evals!)
              const e = 0.004;
              const d1 = evalSdf(ox + e, oy - e, oz - e);
              const d2 = evalSdf(ox - e, oy - e, oz + e);
              const d3 = evalSdf(ox - e, oy + e, oz - e);
              const d4 = evalSdf(ox + e, oy + e, oz + e);

              let nx = d1 - d2 - d3 + d4;
              let ny = -d1 - d2 + d3 + d4;
              let nz = -d1 + d2 - d3 + d4;
              const nInv = 1 / (Math.hypot(nx, ny, nz) || 1);
              nx *= nInv;
              ny *= nInv;
              nz *= nInv;

              // Rotate normal back to world space: invY(-cy, sy) then invX(cx, -sx)
              const wnxz = rotY(nx, nz, cy, -sy);
              const wnyz = rotX(ny, wnxz[1], cx, -sx);
              const wnx = wnxz[0];
              const wny = wnyz[0];
              const wnz = wnyz[1];

              const diff = Math.max(0, wnx * lx + wny * ly + wnz * lz);
              const rim = Math.pow(
                1 - Math.max(0, -(wnx * rdx + wny * rdy + wnz * rdz)),
                2.5
              );

              // Half-vector specular
              let hx = lx - rdx;
              let hy = ly - rdy;
              let hz = lz - rdz;
              const hInv = 1 / (Math.hypot(hx, hy, hz) || 1);
              hx *= hInv;
              hy *= hInv;
              hz *= hInv;
              const spec = Math.pow(
                Math.max(0, wnx * hx + wny * hy + wnz * hz),
                14
              );

              let lum = 0.10 + diff * 0.68 + rim * 0.42 + spec * 0.55;

              if (shockwave >= 0) {
                const rad = Math.hypot(u, v);
                const wave = Math.max(0, 1 - Math.abs(rad - shockwave) * 5.5);
                lum += wave * 0.55;
              }

              const threshold = (BAYER[bayerRow + (px & 3)] + 0.5) / 16;
              if (lum > threshold) {
                alpha = 255;
              }
            }
          } else if (shockwave >= 0) {
            // Subtle shockwave ring in void around object on click
            const rad = Math.hypot(u, v);
            const ring = Math.max(0, 1 - Math.abs(rad - shockwave) * 9.0) * (1 - shockwave / 1.5);
            const threshold = (BAYER[bayerRow + (px & 3)] + 0.5) / 16;
            if (ring * 0.48 > threshold) {
              alpha = 255;
            }
          }

          buf[pIdx] = inkR;
          buf[pIdx + 1] = inkG;
          buf[pIdx + 2] = inkB;
          buf[pIdx + 3] = alpha;
          pIdx += 4;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      if (!XLR.state.reducedMotion || morph < 1 || shockwave >= 0) {
        requestAnimationFrame(renderFrame);
      }
    }

    XLR.on('themechange', function () {
      if (XLR.state.reducedMotion) renderFrame(performance.now());
    });

    XLR.cycleTopology = cycleTopology;
    requestAnimationFrame(renderFrame);
  }

  XLR.initSigil = initSigil;
})();
