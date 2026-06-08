/**
 * <rurio-nav>
 * Light-DOM web component. Renders a vertical nav list, optionally grouped
 * into sections (each with an optional subtitle) separated by dividers.
 *
 * Attributes:
 *   active-id — the currently active item id
 *
 * Properties:
 *   .groups = [{ title?: string, items: NavItem[] }, …]   — preferred
 *   .items  = NavItem[]                                   — flat fallback
 *   NavItem = { id, label, icon?, href }
 *
 * Events:
 *   listens for `rurio:route-change` on document → updates active-id
 */

function renderNavItem(it, active) {
  const isActive = it.id === active;
  const isDisabled = !!it.disabled;

  let cls;
  if (isDisabled) {
    cls = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-fg-subtle opacity-50 cursor-not-allowed select-none";
  } else if (isActive) {
    cls = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-semibold bg-accent text-accent-fg";
  } else {
    cls = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-fg-muted hover:bg-subtle hover:text-fg";
  }

  const iconCls = `shrink-0${isDisabled ? " grayscale" : ""}`;
  const icon = it.icon
    ? `<i data-lucide="${it.icon}" class="size-5 ${iconCls}"></i>`
    : "";

  // Disabled rows render as non-interactive spans (no link, not in tab order).
  if (isDisabled) {
    return `
      <li>
        <span data-nav-item="${it.id}" aria-disabled="true" class="${cls}">
          ${icon}
          <span class="truncate">${it.label}</span>
        </span>
      </li>
    `;
  }

  return `
    <li>
      <a href="${it.href}"
         data-nav-item="${it.id}"
         aria-current="${isActive ? "page" : "false"}"
         class="${cls}">
        ${icon}
        <span class="truncate">${it.label}</span>
      </a>
    </li>
  `;
}

class RurioNav extends HTMLElement {
  static get observedAttributes() { return ["active-id"]; }

  constructor() {
    super();
    this._items = [];
    this._groups = null;
    this._onRoute = (e) => {
      const id = e.detail?.page;
      if (id) this.setAttribute("active-id", id);
    };
  }

  connectedCallback() {
    document.addEventListener("rurio:route-change", this._onRoute);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener("rurio:route-change", this._onRoute);
  }

  attributeChangedCallback() {
    this.render();
  }

  set items(value) {
    this._items = Array.isArray(value) ? value : [];
    this._groups = null;
    this.render();
  }
  get items() { return this._items; }

  set groups(value) {
    this._groups = Array.isArray(value) ? value : null;
    this.render();
  }
  get groups() { return this._groups; }

  render() {
    const active = this.getAttribute("active-id") || "";
    const groups = this._groups || (this._items.length ? [{ items: this._items }] : []);

    const sectionsHtml = groups
      .map(g => {
        const items = (g.items || []).filter(Boolean);
        if (items.length === 0) return "";
        const titleHtml = g.title
          ? `<h3 class="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">${g.title}</h3>`
          : "";
        const itemsHtml = items.map(it => renderNavItem(it, active)).join("");
        return `
          <div class="px-2">
            ${titleHtml}
            <ul role="list" class="space-y-1">${itemsHtml}</ul>
          </div>
        `;
      })
      .filter(Boolean)
      .join('<hr aria-hidden="true" class="mx-3 my-2 border-border-subtle">');

    this.innerHTML = `
      <nav aria-label="Navigare principală" class="h-full flex flex-col">
        <div class="px-4 py-5 border-b border-border-subtle">
          <div class="text-base font-bold text-fg">Rurio</div>
          <div class="text-xs text-fg-subtle">Prototype · test</div>
        </div>
        <div class="flex-1 overflow-y-auto py-2 space-y-0">
          ${sectionsHtml}
        </div>
      </nav>
    `;

    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }
}

if (!customElements.get("rurio-nav")) {
  customElements.define("rurio-nav", RurioNav);
}
