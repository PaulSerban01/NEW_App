/**
 * <rurio-summary-bar>
 * Fixed sub-header. Holds a date-range picker on the left and an
 * optional button group of views on the right.
 *
 * Add the `static` attribute — <rurio-summary-bar static> — to drop the
 * fixed positioning and spacer, e.g. when mounted inside an already-fixed
 * container such as the app-header.
 *
 * Configure via the .config property:
 *
 *   bar.config = {
 *     dateRange: {
 *       start: "2025-09-01",            // ISO date
 *       end:   "2026-08-31",
 *       presets: [{ id, label, start, end }, …],
 *       ariaLabel: "Interval"
 *     },
 *     views: [
 *       { id: "list", icon: "list",  href: "#/parcels", label: "Listă" },
 *       { id: "map",  icon: "globe", href: "#/map",     label: "Hartă" }
 *     ],
 *     activeView: "list"
 *   };
 *
 * Auto-syncs activeView from `rurio:route-change` events.
 * Fires bubbling `rurio:summary-change` events with { start, end } when the
 * date range changes.
 */

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatRangeLabel(dr) {
  if (!dr) return "Alege interval";
  const { start, end, presets = [] } = dr;
  const match = presets.find(p => p.start === start && p.end === end);
  if (match) return match.label;
  if (!start || !end) return "Alege interval";
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}

class RurioSummaryBar extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._open = false;

    this._onRoute = (e) => this._syncActiveFromRoute(e.detail);

    this._onLocalClick = (e) => {
      const trigger = e.target.closest("[data-summary-trigger]");
      if (trigger) {
        e.stopPropagation();
        this._toggleList();
        return;
      }
      const preset = e.target.closest("[data-summary-preset]");
      if (preset) {
        e.stopPropagation();
        this._applyPreset(preset.dataset.summaryPreset);
        return;
      }
      const apply = e.target.closest("[data-summary-apply]");
      if (apply) {
        e.stopPropagation();
        this._applyCustomDates();
      }
    };

    this._onDocClick = (e) => {
      if (!this._open) return;
      if (!this.contains(e.target)) this._closeList();
    };

    this._onKeydown = (e) => {
      if (e.key === "Escape" && this._open) {
        e.stopPropagation();
        this._closeList();
        this.querySelector("[data-summary-trigger]")?.focus();
      }
    };
  }

  set config(value) {
    this._config = value;
    this.render();
  }
  get config() { return this._config; }

  connectedCallback() {
    document.addEventListener("rurio:route-change", this._onRoute);
    document.addEventListener("click", this._onDocClick, true);
    document.addEventListener("keydown", this._onKeydown);
    this.addEventListener("click", this._onLocalClick);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener("rurio:route-change", this._onRoute);
    document.removeEventListener("click", this._onDocClick, true);
    document.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("click", this._onLocalClick);
  }

  _syncActiveFromRoute(route) {
    if (!this._config?.views || !route) return;
    const match = this._config.views.find(v => {
      const page = (v.href || "").replace(/^#\/?/, "").split("/")[0];
      return page === route.page;
    });
    if (match && match.id !== this._config.activeView) {
      this._config.activeView = match.id;
      this.render();
    }
  }

  _toggleList()  { this._open = !this._open; this._reflectOpen(); }
  _closeList()   { if (!this._open) return; this._open = false; this._reflectOpen(); }

  _reflectOpen() {
    const trigger = this.querySelector("[data-summary-trigger]");
    const list = this.querySelector("[data-summary-list]");
    const chev = this.querySelector("[data-summary-chev]");
    if (trigger) trigger.setAttribute("aria-expanded", this._open ? "true" : "false");
    if (list) list.hidden = !this._open;
    if (chev) chev.classList.toggle("rotate-180", this._open);
  }

  _applyPreset(id) {
    if (!this._config?.dateRange?.presets) return;
    const p = this._config.dateRange.presets.find(x => x.id === id);
    if (!p) return;
    this._setRange(p.start, p.end);
  }

  _applyCustomDates() {
    const from = this.querySelector("[data-summary-from]");
    const to   = this.querySelector("[data-summary-to]");
    if (!from || !to) return;
    if (!from.value || !to.value) return;
    this._setRange(from.value, to.value);
  }

  _setRange(start, end) {
    if (!this._config?.dateRange) return;
    this._config.dateRange.start = start;
    this._config.dateRange.end   = end;
    this._open = false;
    this.render();
    this.dispatchEvent(new CustomEvent("rurio:summary-change", {
      detail: { start, end },
      bubbles: true,
    }));
  }

  render() {
    if (!this._config) { this.innerHTML = ""; return; }

    const dr = this._config.dateRange || {};
    const views = this._config.views || [];
    const active = this._config.activeView;
    const labelText = formatRangeLabel(dr);
    const presets = dr.presets || [];

    const presetsHtml = presets.length
      ? `
        <div class="border-b border-border-subtle py-1">
          <div class="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Predefinite</div>
          ${presets.map(p => {
            const isSel = p.start === dr.start && p.end === dr.end;
            const cls = isSel
              ? "bg-accent text-accent-fg font-semibold hover:bg-accent-hover"
              : "text-fg font-normal hover:bg-accent hover:text-accent-fg";
            return `
              <button type="button"
                      data-summary-preset="${p.id}"
                      class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-base transition-colors ${cls}">
                <span class="truncate">${p.label}</span>
                ${isSel ? `<i data-lucide="check" class="size-4 shrink-0"></i>` : ""}
              </button>
            `;
          }).join("")}
        </div>`
      : "";

    const viewBtns = views.map((v, i) => {
      const isActive = v.id === active;
      const isFirst = i === 0;
      const isLast  = i === views.length - 1;
      const radii  = isFirst ? "rounded-l-lg" : isLast ? "rounded-r-lg" : "";
      const offset = isFirst ? ""             : "-ml-px";
      const state  = isActive
        ? "bg-accent text-accent-fg ring-accent-border z-10"
        : "bg-surface text-fg hover:bg-subtle ring-border-subtle";
      return `
        <a href="${v.href}"
           data-view="${v.id}"
           aria-label="${v.label || v.id}"
           aria-current="${isActive ? "page" : "false"}"
           class="relative ${offset} inline-flex items-center justify-center size-10 ring-1 ring-inset transition-colors no-underline ${radii} ${state}">
          <i data-lucide="${v.icon}" class="size-4"></i>
        </a>
      `;
    }).join("");

    // `static` opts out of fixed positioning — used when the bar is mounted
    // inside an already-fixed container (the app-header on the map page).
    const isStatic = this.hasAttribute("static");
    const barClass = isStatic
      ? "summary-bar flex items-center gap-3 bg-surface p-3"
      : "summary-bar fixed inset-x-0 top-16 xl:top-0 z-20 flex items-center gap-3 bg-surface p-3";

    this.innerHTML = `
      <div class="${barClass}">

        <!-- Date-range picker (single component) -->
        <div class="relative flex-1" data-summary-wrapper>
          <button type="button"
                  data-summary-trigger
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-label="${dr.ariaLabel || "Interval"}"
                  class="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg bg-surface px-3 text-left text-base font-semibold text-fg ring-1 ring-inset ring-border-subtle hover:bg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors">
            <i data-lucide="calendar" class="size-4 shrink-0 text-fg-muted"></i>
            <span class="flex-1 truncate">${labelText}</span>
            <i data-lucide="chevron-down" data-summary-chev
               class="size-4 shrink-0 text-fg-muted transition-transform duration-150"></i>
          </button>

          <div role="dialog" aria-label="Selectează interval" data-summary-list hidden
               class="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-border-subtle">
            ${presetsHtml}
            <div class="space-y-3 p-3">
              <div>
                <label for="summary-date-from" class="block text-xs font-semibold uppercase tracking-wider text-fg-subtle">De la</label>
                <input type="date" id="summary-date-from" data-summary-from
                       value="${dr.start || ""}"
                       class="mt-1 w-full rounded-md bg-surface px-3 py-2 text-base text-fg ring-1 ring-inset ring-border-subtle focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label for="summary-date-to" class="block text-xs font-semibold uppercase tracking-wider text-fg-subtle">Până la</label>
                <input type="date" id="summary-date-to" data-summary-to
                       value="${dr.end || ""}"
                       class="mt-1 w-full rounded-md bg-surface px-3 py-2 text-base text-fg ring-1 ring-inset ring-border-subtle focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <button type="button" data-summary-apply
                      class="w-full rounded-md bg-accent py-2 text-base font-semibold text-accent-fg transition-colors hover:bg-accent-hover">
                Aplică
              </button>
            </div>
          </div>
        </div>

        ${views.length
          ? `<span class="isolate inline-flex shrink-0 rounded-lg shadow-xs">${viewBtns}</span>`
          : ""}
      </div>${isStatic ? "" : `

      <!-- Spacer reserving the bar's vertical space (the bar is position:fixed). -->
      <div aria-hidden="true" class="h-16"></div>`}
    `;

    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }
}

if (!customElements.get("rurio-summary-bar")) {
  customElements.define("rurio-summary-bar", RurioSummaryBar);
}
