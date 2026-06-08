/**
 * <rurio-badge>
 * Inline status badge / chip. Tailwind-class based, themed with design-system tokens.
 * Pattern adapted from Tailwind Plus "Badges", mapped onto our 6 semantic intents.
 *
 * DISPLAY attributes
 *   intent     semantic: neutral (default) · accent · success · warning · danger · info
 *              Tailwind colors: gray · red · yellow · green · blue · indigo · purple · pink
 *              (read from the --{color}-* primitives in tokens.css; AA-verified)
 *   shape      rounded (default, rounded-md) · pill (rounded-full)
 *   size       base (default, text-base/16px) · sm (text-sm/14px)
 *   outline    boolean — adds a 1px inset ring in the intent color
 *   dot        boolean — leading colored dot (uses the text/custom color)
 *   removable  boolean — trailing × button; on click removes the badge and
 *              dispatches `rurio:badge-remove` (bubbles, detail = { value, label })
 *   label      optional text; falls back to the element's text content
 *   value      optional payload echoed in events
 *
 * SELECTABLE (filter-toggle) attributes
 *   selectable boolean — renders an interactive on/off toggle (role=button,
 *              keyboard-operable). On toggle, dispatches `rurio:badge-toggle`
 *              (bubbles, detail = { value, label, selected }).
 *   selected   boolean — the pressed state (reflected to aria-pressed).
 *   color      CSS color — tints the leading dot (display mode) and the SELECTED
 *              fill (selectable mode). Used for per-crop culture chips.
 *
 * Examples
 *   <rurio-badge intent="success">Activ</rurio-badge>
 *   <rurio-badge intent="warning" shape="pill" dot>În așteptare</rurio-badge>
 *   <rurio-badge intent="accent" removable value="grau">Grâu</rurio-badge>
 *   <rurio-badge selectable shape="pill" value="arenda">Arendă</rurio-badge>
 *   <rurio-badge selectable shape="pill" dot color="#3b7bdb" value="grau">Grâu</rurio-badge>
 *
 * NOTE for Tailwind: every class string below is a complete literal so the
 * scanner (prototype/main/src/input.css @source) can see and compile them.
 * Do NOT build class names by concatenation.
 */

// Flat fill: subtle background + readable intent text color.
// The semantic intents read from our semantic tokens; the Tailwind named colors
// read from the --{color}-* primitives in tokens.css. Text levels are AA-verified
// against the -100 background (yellow/green need -800; the rest pass at -700).
const FLAT = {
  // semantic intents
  neutral: "bg-subtle text-fg-muted",
  accent:  "bg-accent-subtle text-accent-text",
  success: "bg-success-subtle text-success-text",
  warning: "bg-warning-subtle text-warning-text",
  danger:  "bg-danger-subtle text-danger-text",
  info:    "bg-info-subtle text-info-text",
  // Tailwind named colors
  gray:    "bg-(--gray-100) text-(--gray-700)",
  red:     "bg-(--red-100) text-(--red-700)",
  yellow:  "bg-(--yellow-100) text-(--yellow-800)",
  green:   "bg-(--green-100) text-(--green-800)",
  blue:    "bg-(--blue-100) text-(--blue-700)",
  indigo:  "bg-(--indigo-100) text-(--indigo-700)",
  purple:  "bg-(--purple-100) text-(--purple-700)",
  pink:    "bg-(--pink-100) text-(--pink-700)",
};

// Outline: 1px inset ring. Semantic intents use their border token; Tailwind
// colors use a soft -300 ring (decorative — not subject to AA).
const RING = {
  neutral: "ring-1 ring-inset ring-border-subtle",
  accent:  "ring-1 ring-inset ring-accent-border",
  success: "ring-1 ring-inset ring-success-border",
  warning: "ring-1 ring-inset ring-warning-border",
  danger:  "ring-1 ring-inset ring-danger-border",
  info:    "ring-1 ring-inset ring-info-border",
  gray:    "ring-1 ring-inset ring-(--gray-300)",
  red:     "ring-1 ring-inset ring-(--red-300)",
  yellow:  "ring-1 ring-inset ring-(--yellow-300)",
  green:   "ring-1 ring-inset ring-(--green-300)",
  blue:    "ring-1 ring-inset ring-(--blue-300)",
  indigo:  "ring-1 ring-inset ring-(--indigo-300)",
  purple:  "ring-1 ring-inset ring-(--purple-300)",
  pink:    "ring-1 ring-inset ring-(--pink-300)",
};

// Sizes. `base` is the default at text-base (16px); `sm` is text-sm (14px).
const SIZE = {
  sm:   "gap-x-1 px-2 py-0.5 text-sm",
  base: "gap-x-1.5 px-2.5 py-1 text-base",
};

const SHAPE = { rounded: "rounded-md", pill: "rounded-full" };

// Selectable (toggle) state classes — full literals for the scanner.
const SELECT_BASE = "inline-flex items-center align-middle font-medium whitespace-nowrap cursor-pointer select-none transition-colors ring-1 ring-inset";
const SELECT = {
  // [hasCustomColor][isSelected]
  plainOff:  "bg-surface text-fg-muted ring-border-subtle hover:bg-subtle",
  plainOn:   "bg-accent text-accent-fg ring-accent",
  colorOff:  "bg-surface text-fg ring-border-subtle hover:bg-subtle",
  colorOn:   "bg-(--c) text-white ring-(--c)",
};

const INTENTS = [
  "neutral", "accent", "success", "warning", "danger", "info",
  "gray", "red", "yellow", "green", "blue", "indigo", "purple", "pink",
];

const DOT_SVG =
  `<svg viewBox="0 0 6 6" aria-hidden="true" class="size-1.5 fill-current"><circle cx="3" cy="3" r="3" /></svg>`;
const DOT_SVG_COLOR =
  `<svg viewBox="0 0 6 6" aria-hidden="true" class="size-1.5 fill-(--c)"><circle cx="3" cy="3" r="3" /></svg>`;

// Trailing × uses a Lucide "x" icon (≥16px). Lucide is rendered by the global
// `rurio:icons-refresh` handler, which render() dispatches after inserting it.
const REMOVE_BTN =
  `<button type="button" data-badge-remove aria-label="Elimină"
           class="-mr-1 -ml-1.5 inline-flex size-6 items-center justify-center rounded-full">
     <i data-lucide="x" class="size-4"></i>
   </button>`;

class RurioBadge extends HTMLElement {
  static get observedAttributes() {
    return ["intent", "shape", "size", "outline", "dot", "removable", "label", "selectable", "selected", "color"];
  }

  constructor() {
    super();
    this._label = "";
    this._ready = false;

    this._onClick = (e) => {
      // Removable: clicking ANYWHERE on the chip (incl. the × button) removes it.
      if (this.hasAttribute("removable")) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("rurio:badge-remove", {
          bubbles: true,
          detail: { value: this.getAttribute("value") || this._label, label: this._label },
        }));
        this.remove();
        return;
      }
      // Selectable mode: toggle on/off.
      if (this.hasAttribute("selectable")) {
        e.preventDefault();
        this._toggle();
      }
    };

    this._onKeydown = (e) => {
      if (!this.hasAttribute("selectable")) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        this._toggle();
      }
    };
  }

  connectedCallback() {
    // Capture the label once, BEFORE the first render overwrites our innerHTML.
    // `_ready` gates attributeChangedCallback so an upgrade-time attribute
    // reaction can't render (and wipe the text node) before we've captured it.
    this._label = (this.getAttribute("label") || this.textContent || "").trim();
    this._ready = true;
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKeydown);
  }

  attributeChangedCallback(name) {
    if (name === "label") this._label = (this.getAttribute("label") || this._label || "").trim();
    if (this._ready) this.render();
  }

  _toggle() {
    const next = !this.hasAttribute("selected");
    if (next) this.setAttribute("selected", "");
    else this.removeAttribute("selected");
    this.dispatchEvent(new CustomEvent("rurio:badge-toggle", {
      bubbles: true,
      detail: { value: this.getAttribute("value") || this._label, label: this._label, selected: next },
    }));
  }

  render() {
    const shape = this.getAttribute("shape") === "pill" ? "pill" : "rounded";
    const size  = this.getAttribute("size") === "sm" ? "sm" : "base";

    if (this.hasAttribute("selectable")) {
      this._renderSelectable(shape, size);
      return;
    }

    const intent = INTENTS.includes(this.getAttribute("intent")) ? this.getAttribute("intent") : "neutral";
    const outline   = this.hasAttribute("outline");
    const dot       = this.hasAttribute("dot");
    const removable = this.hasAttribute("removable");
    const color     = this.getAttribute("color");

    const cls = [
      "inline-flex items-center align-middle font-medium whitespace-nowrap",
      SHAPE[shape], SIZE[size], FLAT[intent],
      outline ? RING[intent] : "",
      removable ? "cursor-pointer" : "",
    ].filter(Boolean).join(" ");

    // A custom `color` tints the leading dot (e.g. per-crop chips), keeping the
    // neutral fill — same look as the unselected Filtre culture chips.
    const styleAttr = color ? ` style="--c:${color}"` : "";
    const dotHtml = dot ? (color ? DOT_SVG_COLOR : DOT_SVG) : "";

    this.innerHTML =
      `<span${styleAttr} class="${cls}">${dotHtml}${this._label}${removable ? REMOVE_BTN : ""}</span>`;

    // The remove button uses a Lucide icon — ask the host app to render it.
    if (removable) document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }

  _renderSelectable(shape, size) {
    const selected = this.hasAttribute("selected");
    const color = this.getAttribute("color");
    const dot = this.hasAttribute("dot");

    // Host acts as the toggle button.
    this.setAttribute("role", "button");
    this.tabIndex = 0;
    this.setAttribute("aria-pressed", selected ? "true" : "false");

    const state = color
      ? (selected ? SELECT.colorOn : SELECT.colorOff)
      : (selected ? SELECT.plainOn : SELECT.plainOff);

    const styleAttr = color ? ` style="--c:${color}"` : "";
    // Keep the dot visible in BOTH states. Unselected with a custom color → the dot
    // shows that color on the neutral surface; selected → the surface is already
    // filled, so the dot uses the contrasting text color (fill-current) to stay visible.
    const dotHtml = dot ? ((color && !selected) ? DOT_SVG_COLOR : DOT_SVG) : "";

    const cls = [SELECT_BASE, SHAPE[shape], SIZE[size], state].join(" ");
    this.innerHTML = `<span${styleAttr} class="${cls}">${dotHtml}${this._label}</span>`;
  }
}

if (!customElements.get("rurio-badge")) {
  customElements.define("rurio-badge", RurioBadge);
}
