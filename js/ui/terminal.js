/* ==========================================================================
   INTERACTIVE DEVSECOPS TERMINAL (xlrenv@void:~$)
   ========================================================================== */
(function () {
  'use strict';

  const XLR = (window.XLR = window.XLR || {});

  function initTerminal() {
    const out = document.getElementById('shell-output');
    const form = document.getElementById('shell-form');
    const input = document.getElementById('shell-input');
    if (!out || !form || !input) return;

    let auditRunning = false;

    function printLine(text, cls, asHtml) {
      const div = document.createElement('div');
      div.className = 'shell-line' + (cls ? ' ' + cls : '');
      if (asHtml) {
        div.innerHTML = text;
      } else {
        div.textContent = text;
      }
      out.appendChild(div);
      out.scrollTop = out.scrollHeight;
    }

    function runAudit() {
      if (auditRunning) return;
      auditRunning = true;

      const steps = [
        '[SCAN] checking kernel hardening & sysctl...',
        '<span class="shell-tag-ok">[OK]</span> kernel.kptr_restrict = 2 // dmesg_restrict = 1',
        '<span class="shell-tag-ok">[OK]</span> eBPF LSM runtime hooks active',
        '<span class="shell-tag-ok">[OK]</span> container supply-chain cosign / SLSA verified',
        '<span class="shell-tag-ok">[OK]</span> zero-trust mTLS mesh // 0 exposed CVEs'
      ];

      steps.forEach(function (line, idx) {
        setTimeout(function () {
          printLine(line, idx === 0 ? 'shell-line--muted' : 'shell-line--ok', idx > 0);
          if (XLR.audio) XLR.audio.play('hover');
          if (idx === steps.length - 1) auditRunning = false;
        }, idx * 170);
      });
    }

    function exec(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      printLine('xlrenv@node:~$ ' + rawCmd.trim(), 'shell-line--cmd');

      if (cmd === 'help' || cmd === '?') {
        printLine(
          'commands: whoami · stack · audit · links · invert · morph · glitch · clear',
          'shell-line--muted'
        );
      } else if (cmd === 'whoami') {
        printLine('xlrenv');
      } else if (cmd === 'id') {
        printLine('uid=0(xlrenv) gid=0(xlrenv) groups=0(devsecops)');
      } else if (cmd === 'stack' || cmd === 'skills') {
        printLine('01 INFRA   :: k8s · terraform · linux · docker · nix');
        printLine('02 SECOPS  :: sast/dast · trivy · vault · cosign · opa');
        printLine('03 NETWORK :: wireguard · ebpf · nftables · bgp · mtls');
        printLine('04 OFFENSE :: threat modeling · reverse · kernel hardening');
      } else if (cmd === 'audit' || cmd === 'sec' || cmd === 'scan') {
        runAudit();
      } else if (cmd === 'links' || cmd === 'contact') {
        printLine('tg      -> https://t.me/xlrenv');
        printLine('discord -> https://discord.gg/VN5H48YkRr');
        printLine('github  -> https://github.com/xlrenv');
        printLine('mail    -> xlrenv@proton.me');
        printLine('channel -> https://t.me/bt0hub');
      } else if (cmd === 'invert' || cmd === 'theme' || cmd === 'bone' || cmd === 'void') {
        const next = XLR.toggleTheme();
        printLine('polarity switched -> ' + next.toUpperCase());
      } else if (cmd === 'morph' || cmd === 'sigil') {
        if (XLR.cycleTopology) XLR.cycleTopology();
        printLine('sigil topology -> ' + XLR.state.topologyNames[XLR.state.topology]);
      } else if (cmd === 'glitch') {
        XLR.triggerGlitch();
        printLine('signal distortion pulse injected.');
      } else if (cmd === 'clear' || cmd === 'cls') {
        out.innerHTML = '';
      } else {
        printLine('unknown directive: "' + cmd + '" — type "help"', 'shell-line--muted');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      if (XLR.audio) XLR.audio.play('click');
      exec(val);
    });

    document.querySelectorAll('[data-shell-cmd]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        if (XLR.audio) XLR.audio.play('click');
        exec(pill.getAttribute('data-shell-cmd'));
      });
    });

    // Initial minimal boot greeting
    printLine('XLRENV SECURE SHELL v2.4 — type "help" or select a directive below', 'shell-line--muted');
  }

  XLR.initTerminal = initTerminal;
})();
