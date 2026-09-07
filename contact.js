(function () {
  const cfg = window.SITE_CONFIG || {};
  const c = cfg.contact || {};
  const s = cfg.social || {};

  // ---- Populate the info card from config.js ----
  const set = (id, fn) => { const el = document.getElementById(id); if (el) fn(el); };
  set('info-phone', el => { el.href = 'tel:' + (c.phone || '').replace(/\s/g, ''); el.textContent = c.phone || ''; });
  set('info-email', el => { el.href = 'mailto:' + (c.email || ''); el.textContent = c.email || ''; });
  set('info-whatsapp', el => { el.href = c.whatsapp || '#'; });
  set('info-address', el => { el.textContent = c.address || ''; });
  set('info-response', el => { el.textContent = c.responseTime || ''; });
  set('info-instagram', el => { el.href = s.instagram || '#'; });
  set('map-frame', el => { if (c.mapsEmbedSrc) el.src = c.mapsEmbedSrc; });

  // ---- Form handling ----
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const successPanel = document.getElementById('form-success');
  const successEmailEl = document.getElementById('success-email');
  const resetBtn = document.getElementById('success-reset');

  function showStatus(type, msg) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status is-' + type;
  }

  function showSuccess(email) {
    if (successEmailEl) successEmailEl.textContent = email || 'your inbox';
    form.hidden = true;
    successPanel.hidden = false;
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      successPanel.hidden = true;
      form.hidden = false;
      showStatus('', '');
      const nameField = document.getElementById('name');
      if (nameField) nameField.focus();
    });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    // Honeypot: real visitors never see or fill this field. If it's filled,
    // quietly pretend to succeed rather than tipping off the bot that it was caught.
    if (form.website.value) {
      showSuccess(form.email.value);
      form.reset();
      return;
    }

    const endpoint = cfg.formEndpoint;
    if (!endpoint || endpoint.indexOf('PASTE_') === 0) {
      showStatus('error', 'The enquiry form isn\'t connected yet – please email us directly at ' + (c.email || 'info@emeraldgrove.co.in') + ' for now.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    showStatus('', '');

    const submittedEmail = form.email.value;
    const formData = new FormData(form);

    // Apps Script web apps don't return usable CORS headers for a cross-origin fetch
    // to read, so we submit with mode:'no-cors' and treat a resolved promise as
    // success – we genuinely can't inspect the response, only whether the request went out.
    fetch(endpoint, { method: 'POST', mode: 'no-cors', body: formData })
      .then(function () {
        showSuccess(submittedEmail);
        form.reset();
      })
      .catch(function () {
        showStatus('error', 'Something went wrong sending that. Please try again, or email us directly at ' + (c.email || 'info@emeraldgrove.co.in') + '.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send enquiry';
      });
  });
})();
