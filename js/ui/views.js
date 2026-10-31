/* ==========================================================================
   VIEW NAVIGATION & KEYBOARD SHORTCUTS (INDEX / STACK / SHELL / CONTACT)
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});

  function setView(viewName) {
    const current = XLR.state.view;
    // Clicking the already-active button toggles back to pure minimal INDEX
    const next = current === viewName ? 'index' : viewName;

    XLR.state.view = next;
    document.body.setAttribute('data-view', next);

    const buttons = document.querySelectorAll('[data-view-btn]');
    buttons.forEach(function (btn) {
      const target = btn.getAttribute('data-view-btn');
      const active = target === next;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-expanded', active ? 'true' : 'false');
    });

    const panels = document.querySelectorAll('[data-view-panel]');
    panels.forEach(function (panel) {
      const target = panel.getAttribute('data-view-panel');
      const open = target === next;
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');

      if (open && XLR.scramble) {
        const heading = panel.querySelector('[data-panel-title]');
        if (heading) {
          XLR.scramble(heading, heading.getAttribute('data-text') || heading.textContent, 260);
        }
      }
    });

    if (next === 'shell') {
      const input = document.getElementById('shell-input');
      if (input) {
        setTimeout(function () {
          input.focus();
        }, 60);
      }
    }

    if (XLR.audio) XLR.audio.play('click');
    XLR.emit('viewchange', next);
  }

  function initViews() {
    document.querySelectorAll('[data-view-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setView(btn.getAttribute('data-view-btn'));
      });

      btn.addEventListener('mouseenter', function () {
        const label = btn.querySelector('.btn-label');
        if (label && XLR.scramble) {
          XLR.scramble(label, label.getAttribute('data-text'), 200);
        }
      });
    });

    document.querySelectorAll('[data-close-panel]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setView('index');
      });
    });

    // Global minimalist keyboard controls (ignored when typing inside shell input except Escape)
    window.addEventListener('keydown', function (e) {
      const inInput = document.activeElement && document.activeElement.tagName === 'INPUT';

      if (e.key === 'Escape') {
        if (XLR.state.view !== 'index') {
          e.preventDefault();
          setView('index');
        }
        return;
      }

      if (inInput || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '1') setView('stack');
      else if (e.key === '2' || e.key === '`' || e.key === '~') setView('shell');
      else if (e.key === '3') setView('contact');
      else if (e.key === '0') setView('index');
      else if (e.key === 'i' || e.key === 'I' || e.key === 'ш' || e.key === 'Ш') {
        XLR.toggleTheme();
      }
    });

    XLR.setView = setView;

    // Support URL hash or ?view= deep-link (#stack, #shell, #contact)
    const hashView = (window.location.hash || '').replace('#', '').toLowerCase();
    let initialView = hashView;
    if (!initialView) {
      try {
        initialView = (new URLSearchParams(window.location.search).get('view') || '').toLowerCase();
      } catch (_) {}
    }
    if (initialView === 'stack' || initialView === 'shell' || initialView === 'contact') {
      setView(initialView);
    }
  }

  XLR.initViews = initViews;
})();
