/**
 * <rurio-bottom-nav>
 * Fixed-bottom mobile tab bar. Hidden on xl (desktop uses the persistent sidebar).
 *
 * 5 slots: Meniu · Planifică · Quick action (colored Iconify icon) · Mesaje · Cameră.
 * The "Meniu" item dispatches `rurio:nav-toggle` on document so the shell drawer opens.
 * Other items are anchor links to hash routes; the active one is highlighted
 * by listening to `rurio:route-change`.
 */
const ITEMS = [
  { id: "menu",     label: "Meniu",     icon: "menu",          action: "menu" },
  { id: "planning", label: "Planifică", icon: "notebook-pen",  href: "#/planning" },
  { id: "quick",    label: "",          iconify: "fluent-emoji-flat:high-voltage", href: "#/quick", primary: true },
  { id: "messages", label: "Mesaje",    icon: "message-circle",href: "#/messages" },
  { id: "camera",   label: "Cameră",    icon: "camera",        href: "#/camera" },
];

class RurioBottomNav extends HTMLElement {
  static get observedAttributes() { return ["active-id"]; }

  constructor() {
    super();
    this._onRoute = (e) => {
      const id = e.detail?.page;
      if (id) this.setAttribute("active-id", id);
    };
    this._onClick = (e) => {
      const trigger = e.target.closest("[data-action]");
      if (!trigger) return;
      if (trigger.dataset.action === "menu") {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("rurio:nav-toggle"));
      }
    };
  }

  connectedCallback() {
    document.addEventListener("rurio:route-change", this._onRoute);
    this.addEventListener("click", this._onClick);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener("rurio:route-change", this._onRoute);
    this.removeEventListener("click", this._onClick);
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const active = this.getAttribute("active-id") || "";

    const itemsHtml = ITEMS.map(it => {
      const isActive = it.id === active;
      const tag = it.action ? "button" : "a";
      const href = it.href ? `href="${it.href}"` : "";
      const type = it.action ? `type="button"` : "";
      const dataAttr = it.action ? `data-action="${it.action}"` : `data-bnav="${it.id}"`;

      // Color tone — neutral-500 in light mode, lighter neutral in dark
      // so labels and icons stay readable on dark surfaces.
      const tone = isActive
        ? "text-accent-text"
        : "text-neutral-500 dark:text-neutral-300 hover:text-fg";

      // Primary (zap) item — colored icon, visually emphasized.
      if (it.primary) {
        return `
          <li class="flex flex-1 items-center justify-center">
            <a ${href} data-bnav="${it.id}"
               class="flex size-12 items-center justify-center rounded-full bg-accent-subtle ring-1 ring-border-subtle shadow-sm hover:bg-accent-subtle/80 transition no-underline">
              <iconify-icon icon="${it.iconify}" width="28" height="28" aria-hidden="true"></iconify-icon>
              <span class="sr-only">Acțiune rapidă</span>
            </a>
          </li>
        `;
      }

      const iconHtml = `<i data-lucide="${it.icon}" class="size-5"></i>`;

      return `
        <li class="flex-1">
          <${tag} ${href} ${type} ${dataAttr}
                  aria-current="${isActive ? "page" : "false"}"
                  class="relative flex h-full w-full flex-col items-center justify-center gap-1.5 transition-colors no-underline ${tone}">
            ${isActive ? `<span aria-hidden="true" class="absolute top-0 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-accent"></span>` : ""}
            ${iconHtml}
            ${it.label ? `<span class="text-sm font-normal leading-none">${it.label}</span>` : ""}
          </${tag}>
        </li>
      `;
    }).join("");

    this.innerHTML = `
      <nav aria-label="Bară de navigare jos"
           class="fixed inset-x-0 bottom-0 z-40 xl:hidden bg-surface border-t border-border-subtle rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.04)] pt-0.5 pb-[calc(0.125rem+env(safe-area-inset-bottom,0))]">
        <ul role="list" class="flex h-16 items-stretch justify-around px-1">
          ${itemsHtml}
        </ul>
      </nav>
    `;

    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }
}

if (!customElements.get("rurio-bottom-nav")) {
  customElements.define("rurio-bottom-nav", RurioBottomNav);
}
