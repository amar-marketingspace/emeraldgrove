(function () {
  const cfg = window.SITE_CONFIG || {};

  // Two colour variants of the same mark: emerald monochrome for light
  // backgrounds (the header, normally), full gold+sage for dark backgrounds
  // (the footer, always; the header only when on-dark is set).
  function brandLockupInner(variant) {
    const src = variant === 'dark'
      ? 'assets/images/logo/logo-dark.png'
      : 'assets/images/logo/logo-light.png';
    return `<img class="brand-mark" src="${src}" alt="" aria-hidden="true" width="44" height="44">
      <span class="brand-text">
        <span class="brand-name">Emerald Grove</span>
        <span class="brand-sub">Events &amp; Spaces</span>
      </span>`;
  }

  const SOCIAL_ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 8h2V4.5h-2.5A3.5 3.5 0 0 0 11 8v2H9v3.5h2V21h3.5v-7.5H17l.5-3.5h-3V8.4c0-.3.2-.4.4-.4Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>'
  };

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const dark = this.hasAttribute('on-dark');
      const current = this.getAttribute('current') || '';
      const navItems = (cfg.nav || [])
        .filter(item => item.href !== cfg.ctaHref)
        .map(item => {
          const isCurrent = item.href === current;
          return `<li><a href="${item.href}" ${isCurrent ? 'aria-current="page"' : ''}>${item.label}</a></li>`;
        }).join('');

      this.innerHTML = `
        <header class="site-header${dark ? ' on-dark' : ''}">
          <div class="container">
            <a href="index.html" class="brand-lockup" aria-label="${cfg.brandName || ''} – home">
              ${brandLockupInner(dark ? 'dark' : 'light')}
            </a>
            <nav class="main-nav" id="main-nav">
              <ul>${navItems}</ul>
              <a class="btn btn--primary" href="${cfg.ctaHref || '#'}">${cfg.ctaLabel || 'Enquire now'}</a>
            </nav>
            <button class="nav-toggle" aria-label="Open menu" aria-controls="main-nav" aria-expanded="false">
              <span></span>
            </button>
          </div>
        </header>`;

      const headerEl = this.querySelector('.site-header');
      const toggle = this.querySelector('.nav-toggle');
      const nav = this.querySelector('#main-nav');

      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });

      const onScroll = () => headerEl.classList.toggle('is-scrolled', window.scrollY > 12);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const c = cfg.contact || {};
      const s = cfg.social || {};
      const navItems = (cfg.nav || []).map(item => `<li><a href="${item.href}">${item.label}</a></li>`).join('');
      const year = new Date().getFullYear();
      const directionsUrl = c.mapsUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.address || ''));

      this.innerHTML = `
        <footer class="site-footer">
          <div class="texture-grove" aria-hidden="true"></div>
          <div class="container" style="position:relative;">
            <div class="footer-grid">
              <div class="footer-brand">
                <a href="index.html" class="brand-lockup" aria-label="${cfg.brandName || ''} – home">
                  ${brandLockupInner('dark')}
                </a>
                <p>${cfg.tagline || ''} A flexible premium space in ${cfg.location || ''}, built for weddings, corporate offsites, creator shoots, community meetups and wellness sessions alike.</p>
                <div class="footer-social">
                  <a href="${s.instagram || '#'}" aria-label="Instagram">${SOCIAL_ICONS.instagram}</a>
                  <a href="${s.youtube || '#'}" aria-label="YouTube">${SOCIAL_ICONS.youtube}</a>
                  <a href="${s.facebook || '#'}" aria-label="Facebook">${SOCIAL_ICONS.facebook}</a>
                </div>
              </div>
              <div>
                <h4>Explore</h4>
                <ul>${navItems}<li><a href="policies.html">Policies</a></li></ul>
              </div>
              <div>
                <h4>Get in touch</h4>
                <ul>
                  <li><a href="tel:${(c.phone || '').replace(/\s/g,'')}">${c.phone || ''}</a></li>
                  <li><a href="mailto:${c.email || ''}">${c.email || ''}</a></li>
                  <li><a href="${c.whatsapp || '#'}">WhatsApp us</a></li>
                </ul>
              </div>
              <div>
                <h4>Visit</h4>
                <p>${c.address || ''}</p>
                <p style="margin-top:8px;">${c.responseTime || ''}</p>
                <a href="${directionsUrl}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:6px; margin-top:10px; color:var(--color-brass-light); font-size:var(--fs-small); font-weight:700;">
                  ${SOCIAL_ICONS.pin.replace('width="24"','width="15"').replace('height="24"','height="15"')}
                  Get directions
                </a>
              </div>
            </div>
            <div class="footer-bottom">
              <span>&copy; ${year} ${cfg.brandName || ''}. All rights reserved.</span>
              <span><a href="policies.html">Terms &amp; policies</a></span>
            </div>
          </div>
        </footer>`;
    }
  }

  customElements.define('site-header', SiteHeader);
  customElements.define('site-footer', SiteFooter);
})();
