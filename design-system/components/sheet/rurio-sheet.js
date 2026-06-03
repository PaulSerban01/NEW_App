/**
 * <rurio-sheet>
 * Reusable bottom sheet / action sheet that slides up from the bottom on mobile
 * and centers on larger screens. Backdrop click, Escape, and the X button close it.
 *
 * Usage — declarative:
 *
 *   <rurio-sheet id="sheet-add-teren" title="Adauga teren">
 *     ...content (any markup)...
 *   </rurio-sheet>
 *
 *   <button data-sheet-open="sheet-add-teren">Adauga teren</button>
 *
 *  Anywhere inside the sheet, an element with [data-sheet-close] will close it.
 *
 * Usage — imperative:
 *
 *   const sheet = document.querySelector('#sheet-add-teren');
 *   sheet.open();
 *   sheet.close();
 *   sheet.addEventListener('rurio:sheet-open', ...);
 *   sheet.addEventListener('rurio:sheet-close', ...);
 *
 * Attributes:
 *   • title         — header text
 *   • size          — "auto" (default), "tall" (max 92dvh), "full" (100dvh)
 *   • disable-backdrop-close — set to keep the sheet open when the backdrop is clicked
 */

/* One-time stylesheet injection — keeps the component self-contained without
   requiring a Tailwind rebuild. Tokens (--bg-surface, --border-subtle, etc.)
   are inherited from tokens.css. */
const STYLE_ID = "rurio-sheet-styles";
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    rurio-sheet {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      pointer-events: none;
    }
    @media (min-width: 640px) {
      rurio-sheet { align-items: center; }
    }
    rurio-sheet[aria-hidden="true"] { visibility: hidden; }
    rurio-sheet[data-open="true"]   { visibility: visible; pointer-events: auto; }

    .rn-sheet__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      opacity: 0;
      transition: opacity 200ms ease;
    }
    rurio-sheet[data-open="true"] .rn-sheet__backdrop { opacity: 1; }

    .rn-sheet__panel {
      position: relative;
      width: 100%;
      max-width: 520px;
      max-height: 92dvh;
      background: var(--bg-surface, #fff);
      color: var(--fg-default, #0a0a0a);
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
      transform: translateY(100%);
      transition: transform 260ms cubic-bezier(.3,0,0,1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    @media (min-width: 640px) {
      .rn-sheet__panel {
        border-radius: 1rem;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
        transform: translateY(20px) scale(0.98);
        opacity: 0;
        transition: transform 220ms cubic-bezier(.3,0,0,1), opacity 220ms ease;
      }
    }
    rurio-sheet[data-open="true"] .rn-sheet__panel {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    .rn-sheet__panel--tall { max-height: 92dvh; }
    .rn-sheet__panel--full { max-height: 100dvh; height: 100dvh; border-radius: 0; }

    .rn-sheet__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-bottom: 1px solid var(--border-subtle, rgba(0,0,0,0.08));
      flex-shrink: 0;
    }
    .rn-sheet__title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--fg-default, #0a0a0a);
    }
    .rn-sheet__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem; height: 2rem;
      border-radius: 0.5rem;
      border: 0; background: transparent;
      color: var(--fg-muted, #525252);
      cursor: pointer;
    }
    .rn-sheet__close:hover { background: var(--bg-subtle, rgba(0,0,0,0.04)); color: var(--fg-default, #0a0a0a); }

    .rn-sheet__body {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
  `;
  document.head.appendChild(style);
}

class RurioSheet extends HTMLElement {
  static get observedAttributes() { return ["title", "size"]; }

  constructor() {
    super();
    this._open = false;
    this._content = null;
    this._onKeydown = (e) => {
      if (e.key === "Escape" && this._open) this.close();
    };
  }

  connectedCallback() {
    injectStyles();
    // Capture children before we rewrite this element's DOM.
    const children = Array.from(this.childNodes);

    this.setAttribute("role", "dialog");
    this.setAttribute("aria-modal", "true");
    this.setAttribute("aria-hidden", "true");

    const titleText = this.getAttribute("title") || "";
    const size = this.getAttribute("size") || "auto";
    const sizeClass =
      size === "full" ? "rn-sheet__panel--full" :
      size === "tall" ? "rn-sheet__panel--tall" : "";

    this.innerHTML = `
      <div class="rn-sheet__backdrop" data-sheet-backdrop></div>
      <div class="rn-sheet__panel ${sizeClass}" role="document">
        <div class="rn-sheet__header">
          <h2 class="rn-sheet__title" data-sheet-title>${titleText}</h2>
          <button type="button" class="rn-sheet__close" data-sheet-close aria-label="Închide">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="rn-sheet__body" data-sheet-body></div>
      </div>
    `;

    this._content = this.querySelector("[data-sheet-body]");
    children.forEach(node => this._content.appendChild(node));

    this.addEventListener("click", (e) => {
      if (e.target.closest("[data-sheet-close]")) {
        this.close();
        return;
      }
      if (
        !this.hasAttribute("disable-backdrop-close") &&
        e.target.matches("[data-sheet-backdrop]")
      ) {
        this.close();
      }
    });
  }

  attributeChangedCallback(name, _old, value) {
    if (!this._content) return;
    if (name === "title") {
      const t = this.querySelector("[data-sheet-title]");
      if (t) t.textContent = value || "";
    }
  }

  open() {
    if (this._open) return;
    this._open = true;
    this.setAttribute("data-open", "true");
    this.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this._onKeydown);
    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
    this.dispatchEvent(new CustomEvent("rurio:sheet-open", { bubbles: true }));
    queueMicrotask(() => this.querySelector("[data-sheet-close]")?.focus());
  }

  close() {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute("data-open");
    this.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this._onKeydown);
    this.dispatchEvent(new CustomEvent("rurio:sheet-close", { bubbles: true }));
  }

  toggle() { this._open ? this.close() : this.open(); }
}

if (!customElements.get("rurio-sheet")) {
  customElements.define("rurio-sheet", RurioSheet);
}

/* Global delegated trigger: any [data-sheet-open="<id>"] opens that sheet. */
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-sheet-open]");
  if (!trigger) return;
  const id = trigger.getAttribute("data-sheet-open");
  const sheet = document.getElementById(id);
  if (sheet && typeof sheet.open === "function") {
    e.preventDefault();
    sheet.open();
  }
});
