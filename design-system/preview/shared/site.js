/* ============================================================
   RURIO DOCS — SITE RUNTIME
   • Injects sidebar and topbar into every page
   • Manages theme (palette × mode) with localStorage
   • Manages device-frame choice (ios | android) with localStorage
   • Highlights active nav item based on current URL
   ============================================================ */

(function () {
  'use strict';

  // ── NAV CONFIG ──────────────────────────────────────────
  const NAV = [
    { label: 'Foundations', pages: [
      { href: '/index.html', label: 'Overview' },
      { href: '/foundations/tokens.html', label: 'Token architecture' },
      { href: '/foundations/colors.html', label: 'Colors' },
      { href: '/foundations/typography.html', label: 'Typography' },
      { href: '/foundations/spacing.html', label: 'Spacing' },
      { href: '/foundations/radii.html', label: 'Radii' },
      { href: '/foundations/shadows.html', label: 'Shadows' },
      { href: '/foundations/motion.html', label: 'Motion' },
      { href: '/foundations/accessibility.html', label: 'Accessibility' },
    ]},
    { label: 'Components', pages: [
      { href: '/components/app-header.html', label: 'App header' },
      { href: '/components/avatar.html', label: 'Avatar' },
      { href: '/components/sheet.html', label: 'Bottom sheet', stub: true },
      { href: '/components/tab-bar.html', label: 'Bottom tab bar', stub: true },
      { href: '/components/button.html', label: 'Button' },
      { href: '/components/button-group.html', label: 'Button group' },
      { href: '/components/card.html', label: 'Card' },
      { href: '/components/checkbox.html', label: 'Checkbox' },
      { href: '/components/chip.html', label: 'Chip & badge' },
      { href: '/components/date-picker.html', label: 'Date picker', stub: true },
      { href: '/components/divider.html', label: 'Divider' },
      { href: '/components/dropdown.html', label: 'Dropdown' },
      { href: '/components/empty.html', label: 'Empty state', stub: true },
      { href: '/components/form.html', label: 'Form', stub: true },
      { href: '/components/input.html', label: 'Input' },
      { href: '/components/list-item.html', label: 'List item', stub: true },
      { href: '/components/radio.html', label: 'Radio' },
      { href: '/components/select.html', label: 'Select' },
      { href: '/components/slider.html', label: 'Slider', stub: true },
      { href: '/components/switch.html', label: 'Switch / Toggle' },
      { href: '/components/tabs.html', label: 'Tabs', stub: true },
      { href: '/components/textarea.html', label: 'Textarea' },
      { href: '/components/toast.html', label: 'Toast', stub: true },
      { href: '/components/nav-bar.html', label: 'Top nav bar', stub: true },
    ]},
  ];

  const PALETTES = [
    { id: 'teal',      name: 'Teal',      swatch: '#00686A', swatchDark: '#23F7DD' },
    { id: 'palette-2', name: 'Palette 2', swatch: '#5A35A0', swatchDark: '#A98DE3' },
    { id: 'palette-3', name: 'Palette 3', swatch: '#B93D14', swatchDark: '#FF8D66' },
  ];

  // ── PATH HELPERS ────────────────────────────────────────
  // Pages can live at depth 0 (index.html) or depth 1 (foundations/x.html).
  // We compute a root prefix so href="/..." works on file:// + server alike.
  function computeRoot() {
    // Use the <script src> that loaded us as the anchor.
    const scripts = document.querySelectorAll('script[src$="site.js"], script[src*="shared/site.js"]');
    const s = scripts[scripts.length - 1];
    if (!s) return './';
    const src = s.getAttribute('src') || '';
    // Count the "../" and relative depth
    // if src starts with "shared/..." we're at root; if "../shared/..." we're 1 deep
    const up = (src.match(/\.\.\//g) || []).length;
    if (up === 0) return './';
    return '../'.repeat(up);
  }

  const ROOT = computeRoot();
  function rootify(href) {
    if (!href) return href;
    if (href.startsWith('/')) return ROOT + href.slice(1);
    return href;
  }

  function currentPath() {
    // Normalize: strip trailing slash, map "/" → "/index.html"
    let p = window.location.pathname.replace(/\\/g, '/');
    if (p.endsWith('/')) p += 'index.html';
    return p;
  }

  function matchesActive(href, current) {
    // href is like "/components/button.html" → compare against pathname suffix
    return current.endsWith(href);
  }

  // ── THEME ENGINE ────────────────────────────────────────
  function getTheme() {
    try {
      return {
        palette: localStorage.getItem('rurio-palette') || 'teal',
        mode:    localStorage.getItem('rurio-mode')    || 'light',
      };
    } catch { return { palette: 'teal', mode: 'light' }; }
  }
  function setTheme({ palette, mode }) {
    const html = document.documentElement;
    if (palette) { html.setAttribute('data-palette', palette); try { localStorage.setItem('rurio-palette', palette); } catch {} }
    if (mode)    { html.setAttribute('data-mode', mode);       try { localStorage.setItem('rurio-mode', mode); } catch {} }
    renderTopbar();
  }
  function applyThemeFromStorage() {
    const { palette, mode } = getTheme();
    document.documentElement.setAttribute('data-palette', palette);
    document.documentElement.setAttribute('data-mode', mode);
  }

  // ── DEVICE FRAME CHOICE ─────────────────────────────────
  function getFrame() { try { return localStorage.getItem('rurio-frame') || 'ios'; } catch { return 'ios'; } }
  function setFrame(f) {
    try { localStorage.setItem('rurio-frame', f); } catch {}
    document.documentElement.setAttribute('data-frame', f);
    renderTopbar();
    window.dispatchEvent(new CustomEvent('rurio:framechange', { detail: { frame: f }}));
  }
  function applyFrameFromStorage() {
    document.documentElement.setAttribute('data-frame', getFrame());
  }

  // ── ICONS ───────────────────────────────────────────────
  const ICONS = {
    logo: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M4 20 Q 12 2 20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="14" r="2.4" fill="currentColor"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    iphone: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>`,
    android: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M10 19h4"/></svg>`,
  };

  // ── RENDER SIDEBAR ──────────────────────────────────────
  function renderSidebar() {
    const mount = document.getElementById('ds-sidebar');
    if (!mount) return;
    const cur = currentPath();

    const groupsHtml = NAV.map(group => `
      <div class="ds-sidebar__group">
        <div class="ds-sidebar__group-label">${group.label}</div>
        <ul role="list" class="ds-sidebar__list">
          ${group.pages.map(p => `
            <li>
              <a class="ds-sidebar__item ${matchesActive(p.href, cur) ? 'is-active' : ''}" href="${rootify(p.href)}">
                <span>${p.label}</span>
                ${p.stub ? '<span class="ds-sidebar__tag">Soon</span>' : ''}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    mount.innerHTML = `
      <a class="ds-sidebar__brand" href="${rootify('/index.html')}">
        <div class="ds-sidebar__logo">${ICONS.logo}</div>
        <div>
          <div class="ds-sidebar__title">Rurio</div>
          <div class="ds-sidebar__subtitle">Design System · v0.1</div>
        </div>
      </a>
      <nav class="ds-sidebar__nav" aria-label="Docs navigation">${groupsHtml}</nav>
      <div class="ds-sidebar__footer">
        <a class="ds-sidebar__exit" href="${ROOT}../../index.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 17l-5-5 5-5"/><path d="M21 12H9"/><path d="M9 21V3"/></svg>
          Iesire design system
        </a>
        <div class="ds-sidebar__footer-line">React Native · WCAG 2.2 AA</div>
      </div>
    `;
  }

  // ── RENDER TOPBAR ───────────────────────────────────────
  function renderTopbar() {
    const mount = document.getElementById('ds-topbar');
    if (!mount) return;
    const { palette, mode } = getTheme();
    const frame = getFrame();

    // Breadcrumbs from page data attributes
    const crumb = document.body.getAttribute('data-crumb') || '';
    const title = document.body.getAttribute('data-title') || '';
    const crumbsHtml = crumb
      ? `<div class="ds-crumbs">
          <span>${crumb}</span>
          <span class="ds-crumbs__sep">/</span>
          <span class="ds-crumbs__current">${title}</span>
         </div>`
      : `<div class="ds-crumbs"><span class="ds-crumbs__current">${title}</span></div>`;

    // Show frame toggle only on pages that want it
    const showFrameToggle = document.body.hasAttribute('data-show-frame-toggle');
    const frameToggleHtml = showFrameToggle ? `
      <div class="ds-frame-toggle" role="radiogroup" aria-label="Device frame">
        <button class="ds-frame-toggle__btn ${frame === 'ios' ? 'is-active' : ''}" data-frame="ios" aria-pressed="${frame === 'ios'}">
          ${ICONS.iphone}<span>iOS</span>
        </button>
        <button class="ds-frame-toggle__btn ${frame === 'android' ? 'is-active' : ''}" data-frame="android" aria-pressed="${frame === 'android'}">
          ${ICONS.android}<span>Android</span>
        </button>
      </div>
    ` : '';

    const paletteHtml = `
      <div class="ds-palette-picker" role="radiogroup" aria-label="Palette">
        ${PALETTES.map(p => `
          <button class="ds-palette-picker__btn ${palette === p.id ? 'is-active' : ''}" data-palette="${p.id}" aria-pressed="${palette === p.id}">
            <span class="ds-palette-picker__swatch" style="background:${mode === 'dark' ? p.swatchDark : p.swatch}"></span>
            <span>${p.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    const modeHtml = `
      <button class="ds-icon-btn" id="ds-mode-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">
        ${mode === 'light' ? ICONS.moon : ICONS.sun}
      </button>
    `;

    mount.innerHTML = `
      ${crumbsHtml}
      <div class="ds-topbar__controls">
        ${frameToggleHtml}
        ${paletteHtml}
        ${modeHtml}
      </div>
    `;

    // Wire up
    mount.querySelectorAll('[data-palette]').forEach(btn => {
      btn.addEventListener('click', () => setTheme({ palette: btn.dataset.palette }));
    });
    mount.querySelectorAll('[data-frame]').forEach(btn => {
      btn.addEventListener('click', () => setFrame(btn.dataset.frame));
    });
    const mt = mount.querySelector('#ds-mode-toggle');
    if (mt) mt.addEventListener('click', () => {
      const m = getTheme().mode === 'light' ? 'dark' : 'light';
      setTheme({ mode: m });
    });
  }

  // ── INIT ────────────────────────────────────────────────
  applyThemeFromStorage();
  applyFrameFromStorage();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  function init() {
    renderSidebar();
    renderTopbar();
  }

  // Expose a minimal API
  window.Rurio = { setTheme, getTheme, setFrame, getFrame };
})();
