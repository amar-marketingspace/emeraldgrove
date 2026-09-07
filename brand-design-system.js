(function () {
  // ---- Click-to-copy: swatches ----
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      const hex = sw.getAttribute('data-hex');
      if (!hex) return;
      navigator.clipboard.writeText(hex).then(() => {
        sw.classList.add('is-copied');
        setTimeout(() => sw.classList.remove('is-copied'), 1400);
      });
    });
  });

  // ---- Click-to-copy: logo variant SVG code ----
  document.querySelectorAll('.logo-variant .cap button, .code-block .copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const el = document.getElementById(targetId);
      if (!el) return;
      const text = el.tagName === 'TEXTAREA' || el.tagName === 'PRE' ? el.textContent : el.outerHTML;
      navigator.clipboard.writeText(text.trim()).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1400);
      });
    });
  });

  // ---- Sidebar active-section tracking ----
  const sections = document.querySelectorAll('.ds-section[id]');
  const links = document.querySelectorAll('.ds-sidebar a');
  if (sections.length && links.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }
})();
