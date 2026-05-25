import { parcels, getParcel, STATUS_LABELS, parcelTileUrl, FILTER_CATEGORIES } from "../data/parcels.js";
import { cultureColor } from "../data/cultures.js";

// Parcel detail view lives in its own file; re-exported so the router calls it
// as parcels.renderDetail and map.js's `renderParcelDetail` keeps working.
export { render as renderDetail } from "./parcel-detail.js";

export const meta = {
  id: "parcels",
  label: "Lista terenuri",
  detailLabel: "Teren",
  icon: "wheat",
  showInNav: true,
};

// Shared summary-bar config (also used by the map view).
export const SUMMARY_CONFIG = {
  dateRange: {
    ariaLabel: "Interval",
    start: "2025-09-01",
    end: "2026-08-31",
    presets: [
      { id: "2023-2024", label: "Sezon 2023-2024", start: "2023-09-01", end: "2024-08-31" },
      { id: "2024-2025", label: "Sezon 2024-2025", start: "2024-09-01", end: "2025-08-31" },
      { id: "2025-2026", label: "Sezon 2025-2026", start: "2025-09-01", end: "2026-08-31" },
      { id: "2026-2027", label: "Sezon 2026-2027", start: "2026-09-01", end: "2027-08-31" },
      { id: "apia-2024-2025", label: "Apia 2024-2025", start: "2024-10-01", end: "2025-09-30" },
      { id: "apia-2025-2026", label: "Apia 2025-2026", start: "2025-10-01", end: "2026-09-30" },
    ],
  },
  views: [
    { id: "list", icon: "list",  href: "#/parcels", label: "Listă" },
    { id: "map",  icon: "globe", href: "#/map",     label: "Hartă" },
  ],
  activeView: "list",
};

/* ──────────────────────────────────────────────────────────────
   Filter + sort state (module-level so it survives re-renders).
   ────────────────────────────────────────────────────────────── */
const filterState = {
  culture: new Set(),
  property: new Set(),
  works: new Set(),
};

const SORT_OPTIONS = [
  { id: "name",      label: "Nume A-Z",      fn: (a, b) => a.name.localeCompare(b.name) },
  { id: "area-desc", label: "Suprafață ↓",   fn: (a, b) => b.area - a.area },
  { id: "area-asc",  label: "Suprafață ↑",   fn: (a, b) => a.area - b.area },
  { id: "date-desc", label: "Recent semănat",fn: (a, b) => (b.sownAt || "").localeCompare(a.sownAt || "") },
];
let sortIdx = 0;

function matchesFilters(p) {
  if (filterState.culture.size  && !filterState.culture.has(p.crop))      return false;
  if (filterState.property.size && !filterState.property.has(p.property)) return false;
  if (filterState.works.size && !(p.works || []).some(w => filterState.works.has(w))) return false;
  return true;
}

function visibleCount() {
  return parcels.filter(matchesFilters).length;
}

/* ───────── helpers ───────── */
function mountSummaryBar(root, activeView) {
  const bar = root?.querySelector("rurio-summary-bar");
  if (bar) bar.config = { ...SUMMARY_CONFIG, activeView };
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

/* ───────── markup builders ───────── */
function listItem(p, idx, activeId) {
  const isActive = p.id === activeId;
  const cardState = isActive ? "bg-accent-subtle" : "hover:shadow-md";
  const color = cultureColor(p.crop);
  const tile = parcelTileUrl(idx);

  return `
    <li data-parcel-id="${p.id}"
        class="relative flex cursor-pointer gap-3 overflow-hidden rounded-xl bg-surface py-3 pl-3 pr-5 shadow-sm transition-shadow ${cardState}">

      <span aria-hidden="true" class="absolute inset-y-0 right-0 w-1.5" style="background:${color};"></span>

      <div class="relative w-24 shrink-0 overflow-hidden rounded-md ring-1 ring-border-subtle">
        <img src="${tile}" alt="Hartă ${p.name}" loading="lazy" class="h-full w-full object-cover" />
        <input type="checkbox"
               data-parcel-cb="${p.id}"
               aria-label="Selectează ${p.name}"
               class="absolute left-1.5 top-1.5 size-4 cursor-pointer rounded-md accent-accent shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <p class="truncate text-sm font-semibold text-fg">${p.name}</p>
          <p class="shrink-0 text-sm font-semibold tabular-nums text-fg">
            ${p.area.toFixed(1)}<span class="ml-0.5 text-xs font-medium text-fg-muted"> ha</span>
          </p>
        </div>
        <p class="mt-0.5 truncate text-xs text-fg-muted">${p.apia}</p>
        <p class="truncate text-xs text-fg-muted">${p.pl}</p>
        <p class="mt-2 truncate text-sm font-semibold uppercase tracking-wide" style="color:${color};">${p.crop}</p>
        <p class="truncate text-xs text-fg-muted">${p.soi} <span class="text-fg-subtle">·</span> ${p.norm}</p>
        <div class="mt-2 flex items-center justify-between gap-2">
          <span class="text-xs text-fg-subtle">${formatDate(p.sownAt)}</span>
          <span class="inline-flex items-center rounded-md bg-subtle px-2 py-0.5 text-xs font-medium text-fg-muted ring-1 ring-border-subtle ring-inset">
            ${STATUS_LABELS[p.status] || p.status}
          </span>
        </div>
      </div>
    </li>
  `;
}

function filterBadge(category, value) {
  // Culture badges use the colored dot-style flat badge from Tailwind Plus,
  // colorized per crop via the cultures.js palette.
  if (category === "culture") return cultureFilterBadge(value);

  const isOn = filterState[category].has(value);
  return `
    <button type="button"
            data-filter-badge
            data-category="${category}"
            data-value="${value}"
            aria-pressed="${isOn}"
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition
                   bg-surface text-fg-muted ring-border-subtle hover:bg-subtle
                   aria-pressed:bg-accent aria-pressed:text-accent-fg aria-pressed:ring-accent">
      ${value}
    </button>
  `;
}

// Tailwind Plus "flat badge with colored dot" — constant neutral surface +
// ring + text; only the leading dot picks up the culture color.
// Active (selected as a filter): fills with the culture color for clear
// pressed feedback; dot hides since the whole pill is now in that color.
function cultureFilterBadge(value) {
  const color = cultureColor(value);
  const isOn = filterState.culture.has(value);
  return `
    <button type="button"
            data-filter-badge
            data-category="culture"
            data-value="${value}"
            aria-pressed="${isOn}"
            style="--c:${color};"
            class="group inline-flex items-center gap-x-1.5 rounded-sm px-2 py-1 text-xs font-medium ring-1 ring-inset transition
                   bg-surface text-fg ring-border-subtle hover:bg-subtle
                   aria-pressed:bg-(--c) aria-pressed:text-white aria-pressed:ring-(--c)">
      <svg viewBox="0 0 6 6" aria-hidden="true"
           class="size-1.5 fill-(--c) group-aria-pressed:hidden">
        <circle cx="3" cy="3" r="3" />
      </svg>
      ${value}
    </button>
  `;
}

function filterSection(category) {
  const cfg = FILTER_CATEGORIES[category];
  return `
    <div>
      <h3 class="text-xs font-semibold uppercase tracking-wider text-fg-subtle">${cfg.label}</h3>
      <div class="mt-2 flex flex-wrap gap-2">
        ${cfg.options.map(opt => filterBadge(category, opt)).join("")}
      </div>
    </div>
  `;
}

/* ───────── filter / sort DOM application ───────── */
function applyFiltersToDOM(target) {
  target.querySelectorAll("li[data-parcel-id]").forEach(li => {
    const p = parcels.find(x => x.id === li.dataset.parcelId);
    if (!p) return;
    li.classList.toggle("hidden", !matchesFilters(p));
  });
  // Refresh count label.
  const count = target.querySelector("[data-count-label]");
  if (count) {
    const n = visibleCount();
    count.textContent = `${n} sole`;
  }
}

function applySortToDOM(target) {
  const list = target.querySelector("[data-parcels-list]");
  if (!list) return;
  const items = Array.from(list.children);
  const fn = SORT_OPTIONS[sortIdx].fn;
  items.sort((a, b) => {
    const pA = parcels.find(p => p.id === a.dataset.parcelId);
    const pB = parcels.find(p => p.id === b.dataset.parcelId);
    return fn(pA, pB);
  });
  items.forEach(item => list.appendChild(item));
}

function renderActiveChips(target) {
  const wrap = target.querySelector("[data-active-chips]");
  const bar  = target.querySelector("[data-active-filters-bar]");
  if (!wrap || !bar) return;

  const chips = [];
  for (const cat of Object.keys(filterState)) {
    for (const val of filterState[cat]) {
      chips.push(`
        <span class="inline-flex items-center gap-0.5 rounded-full bg-accent-subtle py-0.5 pl-2.5 pr-1 text-xs font-medium text-accent-text">
          <span class="truncate max-w-40">${val}</span>
          <button type="button"
                  data-remove-filter
                  data-category="${cat}"
                  data-value="${val}"
                  aria-label="Elimină filtru ${val}"
                  class="flex size-4 items-center justify-center rounded-full hover:bg-accent hover:text-accent-fg">
            <i data-lucide="x" class="size-3"></i>
          </button>
        </span>
      `);
    }
  }
  wrap.innerHTML = chips.join("");
  bar.hidden = chips.length === 0;
  document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
}

/* ───────── bindings ───────── */
function bindListClicks(target) {
  const list = target.querySelector("[data-parcels-list]");
  if (!list) return;
  list.addEventListener("click", (e) => {
    if (e.target.closest('input[type="checkbox"]')) return;
    const li = e.target.closest("li[data-parcel-id]");
    if (li) window.location.hash = `#/parcels/${li.dataset.parcelId}`;
  });
}

function bindToolbar(toolbarRoot, target) {
  // Toolbar controls live in the app-header; the filter panel + parcel list
  // stay in the list pane — so the two roots differ.
  const all     = toolbarRoot?.querySelector("[data-toolbar-all]");
  const sortBtn = toolbarRoot?.querySelector("[data-toolbar-sort]");
  const sortLbl = toolbarRoot?.querySelector("[data-sort-label]");
  const filter  = toolbarRoot?.querySelector("[data-toolbar-filter]");
  const panel   = target.querySelector("[data-filter-panel]");
  const chev    = toolbarRoot?.querySelector("[data-filter-chev]");

  // "Toate": (un)check all VISIBLE parcel cards.
  all?.addEventListener("change", () => {
    const checked = all.checked;
    target.querySelectorAll('li[data-parcel-id]:not(.hidden) input[data-parcel-cb]').forEach(cb => {
      cb.checked = checked;
    });
  });

  // Sort cycle.
  sortBtn?.addEventListener("click", () => {
    sortIdx = (sortIdx + 1) % SORT_OPTIONS.length;
    if (sortLbl) sortLbl.textContent = SORT_OPTIONS[sortIdx].label;
    applySortToDOM(target);
  });

  // Toggle filter panel.
  filter?.addEventListener("click", () => {
    if (!panel) return;
    panel.hidden = !panel.hidden;
    filter.setAttribute("aria-expanded", String(!panel.hidden));
    chev?.classList.toggle("rotate-180", !panel.hidden);
  });
}

function bindFilterBadges(target) {
  target.querySelectorAll("[data-filter-badge]").forEach(badge => {
    const cat = badge.dataset.category;
    const val = badge.dataset.value;
    badge.addEventListener("click", () => {
      const isOn = badge.getAttribute("aria-pressed") === "true";
      if (isOn) {
        filterState[cat].delete(val);
        badge.setAttribute("aria-pressed", "false");
      } else {
        filterState[cat].add(val);
        badge.setAttribute("aria-pressed", "true");
      }
      applyFiltersToDOM(target);
      renderActiveChips(target);
    });
  });
}

function bindActiveFiltersBar(target) {
  // Remove a single filter when its chip × is clicked.
  target.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-filter]");
    if (!btn) return;
    const cat = btn.dataset.category;
    const val = btn.dataset.value;
    filterState[cat]?.delete(val);
    const badge = target.querySelector(`[data-filter-badge][data-category="${cat}"][data-value="${val}"]`);
    if (badge) badge.setAttribute("aria-pressed", "false");
    applyFiltersToDOM(target);
    renderActiveChips(target);
  });

  // Reset all.
  const reset = target.querySelector("[data-reset-filters]");
  reset?.addEventListener("click", () => {
    for (const cat of Object.keys(filterState)) filterState[cat].clear();
    target.querySelectorAll("[data-filter-badge]").forEach(b => b.setAttribute("aria-pressed", "false"));
    applyFiltersToDOM(target);
    renderActiveChips(target);
  });
}

function bindListFab(target) {
  const fab = target.querySelector("[data-list-fab]");
  const menu = target.querySelector("[data-list-actions-menu]");
  if (!fab || !menu) return;

  const deleteBtn = menu.querySelector("[data-action-delete]");
  const badge = menu.querySelector("[data-delete-count]");

  function countChecked() {
    return target.querySelectorAll('input[data-parcel-cb]:checked').length;
  }
  function refreshSelectionState() {
    const n = countChecked();
    if (deleteBtn) deleteBtn.disabled = n === 0;
    if (badge) {
      badge.hidden = n === 0;
      badge.textContent = String(n);
    }
  }

  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    refreshSelectionState();
    menu.hidden = false;
    fab.setAttribute("aria-expanded", "true");
  }

  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.hidden) openMenu(); else closeMenu();
  });

  menu.querySelectorAll("button[data-action-label]").forEach((item) => {
    item.addEventListener("click", () => {
      if (item.disabled) return;
      const label = item.dataset.actionLabel;
      if (item.hasAttribute("data-action-delete")) {
        const n = countChecked();
        alert(`${label} (${n} ${n === 1 ? "parcelă" : "parcele"})`);
      } else {
        alert(label);
      }
      closeMenu();
    });
  });
  menu.querySelectorAll("[data-action-navigate]").forEach((item) => {
    item.addEventListener("click", () => closeMenu());
  });

  const handleOutsideClick = (e) => {
    if (!menu.isConnected) {
      document.removeEventListener("click", handleOutsideClick);
      return;
    }
    if (!menu.hidden && !menu.contains(e.target) && !fab.contains(e.target)) closeMenu();
  };
  const handleKey = (e) => {
    if (!menu.isConnected) {
      document.removeEventListener("keydown", handleKey);
      return;
    }
    if (e.key === "Escape" && !menu.hidden) closeMenu();
  };
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleKey);
}

/* ───────── render ───────── */
export function render(target, ctx) {
  const activeId = ctx?.route?.id || null;
  const totalArea = parcels.reduce((s, p) => s + p.area, 0);
  const currentSortLabel = SORT_OPTIONS[sortIdx].label;

  // Summary bar + toolbar live inside the fixed app-header (#header-extras),
  // so they stay pinned above the list. Skipped when a parcel detail is open —
  // the detail view replaces the list and shouldn't carry the list controls.
  const headerExtras = document.getElementById("header-extras");
  if (headerExtras && !activeId) {
    headerExtras.innerHTML = `
      <rurio-summary-bar static></rurio-summary-bar>

      <!-- TOOLBAR (no longer fixed — the app-header owns positioning + the divider) -->
      <div class="toolbar flex items-center gap-2 bg-surface px-3 py-2 text-neutral-700 dark:text-neutral-300">
        <label class="flex cursor-pointer items-center gap-2 select-none">
          <input type="checkbox" data-toolbar-all class="size-4 cursor-pointer rounded-md accent-accent" />
          <span class="text-sm font-medium">Toate</span>
        </label>

        <div class="ml-auto flex items-center gap-1">
          <button type="button" data-toolbar-sort
                  class="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-subtle">
            <i data-lucide="arrow-up-down" class="size-4 text-neutral-500 dark:text-neutral-400"></i>
            <span data-sort-label>${currentSortLabel}</span>
          </button>

          <button type="button" data-toolbar-filter aria-expanded="false"
                  class="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-subtle">
            <i data-lucide="search" class="size-4 text-neutral-500 dark:text-neutral-400"></i>
            <span>Cauta / Filtre</span>
          </button>
        </div>
      </div>
    `;
  }

  target.innerHTML = `
    <!-- FILTER PANEL (full-width, hidden until toggled) -->
    <div data-filter-panel hidden
         class="border-b border-border-subtle bg-surface px-3 py-4 space-y-4 sm:px-6">
      ${filterSection("culture")}
      ${filterSection("property")}
      ${filterSection("works")}
    </div>

    <!-- ACTIVE FILTERS BAR (hidden when no filters) -->
    <div data-active-filters-bar hidden
         class="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface px-3 py-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Filtre active</span>
      <div data-active-chips class="flex flex-wrap items-center gap-1.5"></div>
      <button type="button" data-reset-filters
              class="ml-auto text-sm font-medium text-accent-text underline underline-offset-2 hover:text-accent">
        Reset
      </button>
    </div>

    <section class="min-h-dvh bg-neutral-50 px-3 pt-6 pb-10 dark:bg-neutral-800 sm:px-6 xl:px-8 xl:pt-10">
      <div class="max-w-3xl mx-auto xl:mx-0">

        <header class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Resurse</p>
          <div class="mt-1 flex items-end justify-between gap-3">
            <h1 class="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Terenuri</h1>
            <div class="text-right">
              <div class="text-base font-bold tabular-nums text-fg">${totalArea.toFixed(1)} ha</div>
              <div class="text-xs text-fg-subtle" data-count-label>${parcels.length} sole</div>
            </div>
          </div>
        </header>

        <ul data-parcels-list role="list" class="space-y-3">
          ${parcels.map((p, i) => listItem(p, i, activeId)).join("")}
        </ul>

      </div>
    </section>

    <!-- FAB + actions menu (fixed bottom-right above the bottom nav) -->
    <div class="pointer-events-none fixed right-0 z-30 p-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0))] xl:bottom-0">
      <div class="pointer-events-auto relative">
        <button type="button" data-list-fab aria-label="Acțiuni listă" aria-haspopup="menu" aria-expanded="false"
                class="flex size-12 items-center justify-center rounded-full bg-accent text-accent-fg shadow-lg transition hover:shadow-xl hover:bg-accent-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
          <i data-lucide="ellipsis-vertical" class="size-5"></i>
        </button>
        <ul data-list-actions-menu role="menu" hidden
            class="absolute right-0 bottom-full mb-2 w-60 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border-subtle">
          <li><button type="button" role="menuitem" data-action-label="Adauga teren"
                      class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-fg transition-colors hover:bg-accent hover:text-accent-fg">
            <i data-lucide="plus" class="size-4"></i><span>Adauga teren</span>
          </button></li>
          <li><button type="button" role="menuitem" data-action-label="Editeaza teren"
                      class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-fg transition-colors hover:bg-accent hover:text-accent-fg">
            <i data-lucide="pencil" class="size-4"></i><span>Editeaza teren</span>
          </button></li>
          <li><button type="button" role="menuitem" data-action-label="Importa teren"
                      class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-fg transition-colors hover:bg-accent hover:text-accent-fg">
            <i data-lucide="upload" class="size-4"></i><span>Importa teren</span>
          </button></li>
          <li><button type="button" role="menuitem" data-action-label="Exporta teren"
                      class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-fg transition-colors hover:bg-accent hover:text-accent-fg">
            <i data-lucide="download" class="size-4"></i><span>Exporta teren</span>
          </button></li>
          <li><a role="menuitem" href="#/map" data-action-navigate
                 class="flex w-full items-center gap-3 px-4 py-2 text-sm text-fg transition-colors hover:bg-accent hover:text-accent-fg no-underline">
            <i data-lucide="globe" class="size-4"></i><span>Deschide harta</span>
          </a></li>
          <li class="border-t border-border-subtle">
            <button type="button" role="menuitem" data-action-delete data-action-label="Sterge teren" disabled
                    class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-danger-text transition-colors hover:bg-danger-subtle disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
              <i data-lucide="trash-2" class="size-4"></i>
              <span class="flex-1">Sterge teren</span>
              <span data-delete-count hidden
                    class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-xs font-semibold text-danger-fg">0</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  `;

  mountSummaryBar(headerExtras, "list");
  bindListClicks(target);
  bindToolbar(headerExtras?.querySelector(".toolbar"), target);
  bindFilterBadges(target);
  bindActiveFiltersBar(target);
  bindListFab(target);

  // Re-apply persisted state on each render.
  applyFiltersToDOM(target);
  applySortToDOM(target);
  renderActiveChips(target);
}

export function renderDetailEmpty(target) {
  target.innerHTML = `
    <div class="hidden xl:flex h-full items-center justify-center p-8 text-center">
      <div class="max-w-xs">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-subtle text-fg-subtle">
          <i data-lucide="map-pin" class="size-6"></i>
        </div>
        <p class="mt-3 text-sm font-medium text-fg-muted">Selectează o parcelă</p>
        <p class="mt-1 text-xs text-fg-subtle">Detaliile apar aici pe desktop.</p>
      </div>
    </div>
  `;
}
