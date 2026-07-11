// script.js — scroll reveals, coffee brew restart, form micro-interactions.
// No animation loops here: every motion is a CSS @keyframes/transition;
// JS only toggles classes to start/stop/replay them.

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll reveals (Jeton pattern) ----
  var revealTargets = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && revealTargets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    // No IntersectionObserver support: just show everything.
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Coffee brewing hero: restart via "Seduh Ulang" ----
  var brewBtn = document.getElementById('brewBtn');
  var cupLiquid = document.getElementById('cupLiquid');
  var cupLogo = document.getElementById('cupLogo');

  function restartCssAnimation(el) {
    if (!el) return;
    el.style.animation = 'none';
    // Force reflow so the browser forgets the previous animation run.
    void el.offsetWidth;
    el.style.animation = '';
  }

  if (brewBtn) {
    brewBtn.addEventListener('click', function () {
      if (reduceMotion) return; // nothing to replay, cup is already shown filled
      brewBtn.classList.add('is-replaying');
      restartCssAnimation(cupLiquid);
      restartCssAnimation(cupLogo);
      window.setTimeout(function () {
        brewBtn.classList.remove('is-replaying');
      }, 500);
    });
  }

  // ---- Form micro-interactions (frontend-only demo; real submit is the V2 add-on) ----
  var submitBtn = document.getElementById('submitBtn');
  var formMsg = document.getElementById('formMsg');
  var btnLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

  function showMessage(text, ok) {
    formMsg.textContent = text;
    formMsg.style.background = ok ? 'rgba(22,101,52,.2)' : 'rgba(193,68,14,.18)';
    formMsg.style.borderColor = ok ? 'rgba(22,101,52,.5)' : 'rgba(193,68,14,.5)';
    formMsg.style.color = ok ? '#86EFAC' : '#FCA5A5';
    formMsg.classList.add('show');
    formMsg.classList.remove('pop');
    // Small anticipation delay before the pop-in plays.
    window.setTimeout(function () { formMsg.classList.add('pop'); }, reduceMotion ? 0 : 300);
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var nama = document.getElementById('nama').value.trim();
      var wa = document.getElementById('wa').value.trim();

      if (!nama || !wa) {
        showMessage('Isi nama dan nomor WhatsApp dulu ya.', false);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      if (btnLabel) btnLabel.textContent = 'Menyeduh...';

      var payload = {
        nama: nama,
        wa: wa,
        minat: document.getElementById('minat').value,
        kota: document.getElementById('kota').value,
        source: 'wa_channel',
        event_origin: 'coc_ruangguru'
      };

      window.setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.classList.add('is-success');
        if (btnLabel) btnLabel.textContent = 'Terkirim!';

        showMessage('✓ Terkirim. Kami kabari lewat WhatsApp untuk agenda terdekat.', true);
        // V2: POST ke endpoint → simpan ke DB → trigger WA welcome message
        console.log('[DEMO] Payload V2:', payload);

        window.setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-success');
          if (btnLabel) btnLabel.textContent = 'Gabung Sahabat Kapal Api';
        }, 2200);
      }, reduceMotion ? 0 : 2000);
    });
  }
})();
