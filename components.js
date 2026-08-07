(function () {
  const cfg = window.SITE_CONFIG || {};

  const LOGO_MARK = `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20,36 C12,30 12,18 20,11 C28,18 28,30 20,36 Z" transform="rotate(-32 20 36)" fill="#B08D4F"/>
      <path d="M20,36 C12,30 12,18 20,11 C28,18 28,30 20,36 Z" transform="rotate(32 20 36)" fill="#B08D4F"/>
      <path class="brand-mark-fg" d="M20,36 C10,29 11,13 20,4 C29,13 30,29 20,36 Z" fill="#1B4D3A"/>
    </svg>`;

  const SOCIAL_ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 8h2V4.5h-2.5A3.5 3.5 0 0 0 11 8v2H9v3.5h2V21h3.5v-7.5H17l.5-3.5h-3V8.4c0-.3.2-.4.4-.4Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12.5 17v-3.8c0-1.3.9-2.2 2-2.2s1.5.9 1.5 2.2V17"/></svg>'
  };

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const dark = this.hasAttribute('on-dark');
      const current = this.getAttribute('current') || '';
      const navItems = (cfg.nav || []).map(item => {
        const isCurrent = item.href === current;
        return `<li><a href="${item.href}" ${isCurrent ? 'aria-current="page"' : ''}>${item.label}</a></li>`;
      }).join('');

      this.innerHTML = `
        <header class="site-header${dark ? ' on-dark' : ''}">
          <div class="container">
            <a href="index.html" class="brand-lockup" aria-label="${cfg.brandName || ''} — home">
              ${LOGO_MARK}
              <span class="brand-name">${cfg.brandName || ''}</span>
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

      this.innerHTML = `
        <footer class="site-footer">
          <div class="texture-grove" aria-hidden="true"></div>
          <div class="container" style="position:relative;">
            <div class="footer-grid">
              <div class="footer-brand">
                <a href="index.html" class="brand-lockup" aria-label="${cfg.brandName || ''} — home">
                  ${LOGO_MARK}
                  <span class="brand-name" style="color:var(--color-ivory)">${cfg.brandName || ''}</span>
                </a>
                <p>${cfg.tagline || ''} A flexible premium space in ${cfg.location || ''}, built for weddings, corporate offsites, creator shoots, community meetups and wellness sessions alike.</p>
                <div class="footer-social">
                  <a href="${s.instagram || '#'}" aria-label="Instagram">${SOCIAL_ICONS.instagram}</a>
                  <a href="${s.youtube || '#'}" aria-label="YouTube">${SOCIAL_ICONS.youtube}</a>
                  <a href="${s.facebook || '#'}" aria-label="Facebook">${SOCIAL_ICONS.facebook}</a>
                  <a href="${s.linkedin || '#'}" aria-label="LinkedIn">${SOCIAL_ICONS.linkedin}</a>
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
