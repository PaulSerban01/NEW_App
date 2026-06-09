import { parcels, parcelPolygon, BASE_LAT, BASE_LNG, FILTER_CATEGORIES } from "../data/parcels.js";
import { cultureColor } from "../data/cultures.js";
import { SUMMARY_CONFIG, renderDetail as renderParcelDetail } from "./parcels.js";

export const meta = {
  id: "map",
  label: "Harta terenuri",
  detailLabel: "Teren",
  icon: "globe",
  showInNav: true,
};

/* ──────────────────────────────────────────────────────────────
   Map toolbar selects — module-level state survives re-renders.
   ────────────────────────────────────────────────────────────── */
const MAP_VIEW_OPTIONS = [
  { value: "satellite-2d", label: "Satelit 2D" },
  { value: "satellite-3d", label: "Satelit 3D" },
  { value: "terrain",      label: "Teren" },
];

const MAP_LAYER_OPTIONS = [
  { value: "cultivated", label: "Suprafețe cultivate" },
  { value: "satellite-imagery", label: "Imagini satelitare" },
  { value: "weather-radar", label: "Radar meteo" },
  { value: "cadastre", label: "Cadastru (eTera)" },
  { value: "equipment", label: "Utilaje pe hartă" },
];

const mapToolbarState = {
  view: "satellite-2d",
  layer: "cultivated",
};

/* ──────────────────────────────────────────────────────────────
   Map filter panel state (Cauta button). Independent of the list
   page's filterState — each view can be filtered separately.
   ────────────────────────────────────────────────────────────── */
const mapFilterState = {
  culture: new Set(),
  property: new Set(),
};
let mapSearchQuery = "";

function mapMatches(p) {
  if (mapFilterState.culture.size  && !mapFilterState.culture.has(p.crop))      return false;
  if (mapFilterState.property.size && !mapFilterState.property.has(p.property)) return false;
  if (mapSearchQuery) {
    const q = mapSearchQuery.toLowerCase();
    const hay = `${p.name} ${p.apia} ${p.pl} ${p.crop}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

/* Tailwind Plus "flat badge with colored dot" — constant neutral surface,
   only the leading dot is culture-colored. Selected: fills with culture color. */
function mapCultureBadge(value) {
  const color = cultureColor(value);
  const isOn = mapFilterState.culture.has(value);
  return `
    <rurio-badge selectable shape="pill" dot
                 color="${color}"
                 data-map-filter-badge
                 data-map-cat="culture"
                 data-map-value="${value}"
                 value="${value}"
                 ${isOn ? "selected" : ""}>${value}</rurio-badge>
  `;
}

function mapPropertyBadge(value) {
  const isOn = mapFilterState.property.has(value);
  return `
    <rurio-badge selectable shape="pill"
                 data-map-filter-badge
                 data-map-cat="property"
                 data-map-value="${value}"
                 value="${value}"
                 ${isOn ? "selected" : ""}>${value}</rurio-badge>
  `;
}

function bindMapFilter(toolbarRoot, panelRoot) {
  // The "Cauta" trigger lives in the toolbar (app-header); the panel + its
  // controls live in the list pane — so the two roots differ.
  const trigger = toolbarRoot?.querySelector("[data-map-search]");
  const panel   = panelRoot.querySelector("[data-map-filter-panel]");
  const search  = panelRoot.querySelector("[data-map-search-input]");
  if (!trigger || !panel) return;

  function close() {
    if (panel.hidden) return;
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }
  function open() {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
    setTimeout(() => search?.focus(), 0);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hidden) open(); else close();
  });
  panelRoot.querySelector("[data-map-filter-close]")?.addEventListener("click", close);

  // Search input
  search?.addEventListener("input", () => {
    mapSearchQuery = search.value || "";
  });

  // Badges — selectable <rurio-badge> bubble `rurio:badge-toggle`.
  panelRoot.addEventListener("rurio:badge-toggle", (e) => {
    const b = e.target.closest("[data-map-filter-badge]");
    if (!b) return;
    const cat = b.dataset.mapCat, val = b.dataset.mapValue;
    if (e.detail.selected) mapFilterState[cat].add(val);
    else mapFilterState[cat].delete(val);
  });
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

let _leafletPromise = null;
let _mapInstance = null;

function ensureLeaflet() {
  if (window.L) return Promise.resolve();
  if (_leafletPromise) return _leafletPromise;

  _leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = LEAFLET_CSS;
      document.head.appendChild(css);
    }
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      const wait = () => (window.L ? resolve() : setTimeout(wait, 40));
      wait();
      return;
    }
    const s = document.createElement("script");
    s.src = LEAFLET_JS;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });

  return _leafletPromise;
}

function initMap(container, activeId) {
  if (_mapInstance) {
    try { _mapInstance.remove(); } catch {}
    _mapInstance = null;
  }

  const map = L.map(container, {
    zoomControl: false,
    attributionControl: false,
  }).setView([BASE_LAT, BASE_LNG], 14);

  // Esri World Imagery (satellite). Free attribution-only tier — fine for prototyping.
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles © Esri — Esri, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
      maxZoom: 18,
    }
  ).addTo(map);

  const all = [];
  parcels.forEach((p, i) => {
    const isActive = p.id === activeId;
    const fill   = cultureColor(p.crop);                 // culture-based fill
    const stroke = isActive ? "#fff" : fill;             // white outline when selected

    const polygon = L.polygon(parcelPolygon(p, i), {
      color: stroke,
      weight: isActive ? 4 : 2,
      fillColor: fill,
      fillOpacity: isActive ? 0.6 : 0.35,
    }).addTo(map);

    polygon.bindTooltip(
      `<strong>${p.name}</strong><br>${p.area.toFixed(1)} ha · ${p.crop}`,
      { sticky: true, direction: "top", offset: [0, -4] }
    );
    polygon.on("click", () => {
      window.location.hash = `#/map/${p.id}`;
    });

    all.push(polygon);
  });

  // Fit the view to the polygon cloud so they're nicely framed on first paint.
  if (all.length) {
    const group = L.featureGroup(all);
    map.fitBounds(group.getBounds().pad(0.15));
  }

  _mapInstance = map;
}

function selectWidget(id, options, selected) {
  const current = options.find(o => o.value === selected) || options[0];
  return `
    <div class="relative" data-map-select="${id}">
      <button type="button"
              data-map-trigger="${id}"
              aria-haspopup="listbox"
              aria-expanded="false"
              class="inline-flex max-w-44 items-center gap-1.5 rounded-md px-2 py-1.5 text-base font-medium hover:bg-subtle">
        <span class="truncate" data-map-label="${id}">${current.label}</span>
        <i data-lucide="chevron-down" data-map-chev="${id}" class="size-4 shrink-0 transition-transform text-neutral-500 dark:text-neutral-400"></i>
      </button>
      <ul role="listbox" data-map-list="${id}" hidden
          class="absolute left-0 top-full z-30 mt-1 min-w-52 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border-subtle">
        ${options.map(o => {
          const isSelected = o.value === selected;
          const state = isSelected
            ? "bg-accent text-accent-fg font-semibold hover:bg-accent-hover"
            : "text-fg font-normal hover:bg-accent hover:text-accent-fg";
          return `
            <li role="option"
                data-map-option="${id}"
                data-map-value="${o.value}"
                aria-selected="${isSelected}"
                class="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2 text-base transition-colors ${state}">
              <span class="truncate">${o.label}</span>
              ${isSelected ? `<i data-lucide="check" class="size-4 shrink-0"></i>` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    </div>
  `;
}

function bindMapToolbar(target) {
  const triggers = target.querySelectorAll("[data-map-trigger]");
  const lists    = target.querySelectorAll("[data-map-list]");

  function closeAll() {
    lists.forEach(l => { l.hidden = true; });
    triggers.forEach(t => {
      t.setAttribute("aria-expanded", "false");
      const id = t.dataset.mapTrigger;
      target.querySelector(`[data-map-chev="${id}"]`)?.classList.remove("rotate-180");
    });
  }

  triggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = trigger.dataset.mapTrigger;
      const list = target.querySelector(`[data-map-list="${id}"]`);
      const chev = target.querySelector(`[data-map-chev="${id}"]`);
      const willOpen = list.hidden;
      closeAll();
      if (willOpen) {
        list.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        chev?.classList.add("rotate-180");
      }
    });
  });

  target.querySelectorAll("[data-map-option]").forEach(opt => {
    opt.addEventListener("click", () => {
      const id  = opt.dataset.mapOption;
      const val = opt.dataset.mapValue;
      mapToolbarState[id] = val;

      // Update label.
      const options = id === "view" ? MAP_VIEW_OPTIONS : MAP_LAYER_OPTIONS;
      const newLabel = options.find(o => o.value === val)?.label || val;
      const labelEl = target.querySelector(`[data-map-label="${id}"]`);
      if (labelEl) labelEl.textContent = newLabel;

      // Re-render the affected list so the selected styling updates.
      const list = target.querySelector(`[data-map-list="${id}"]`);
      if (list) {
        list.innerHTML = options.map(o => {
          const isSel = o.value === val;
          const st = isSel
            ? "bg-accent text-accent-fg font-semibold hover:bg-accent-hover"
            : "text-fg font-normal hover:bg-accent hover:text-accent-fg";
          return `
            <li role="option" data-map-option="${id}" data-map-value="${o.value}" aria-selected="${isSel}"
                class="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2 text-base transition-colors ${st}">
              <span class="truncate">${o.label}</span>
              ${isSel ? `<i data-lucide="check" class="size-4 shrink-0"></i>` : ""}
            </li>`;
        }).join("");
        // Re-bind new option nodes.
        list.querySelectorAll("[data-map-option]").forEach(o => {
          o.addEventListener("click", () => opt.click()); // recursion-safe: this branch unused after re-render
        });
      }

      closeAll();
      document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
    });
  });

  // Cauta button is wired separately in bindMapFilter (toggles the panel).

  // Close lists on outside click / Escape.
  const onDocClick = (e) => {
    if (!target.isConnected) {
      document.removeEventListener("click", onDocClick);
      return;
    }
    if (!e.target.closest("[data-map-select]")) closeAll();
  };
  const onKey = (e) => {
    if (!target.isConnected) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (e.key === "Escape") closeAll();
  };
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
}

export function render(target, ctx) {
  const activeId = ctx?.route?.id || null;

  // Summary bar + map toolbar live inside the fixed app-header (#header-extras),
  // so they stay pinned above the map. Skipped when a parcel detail is open —
  // the detail view replaces the list and shouldn't carry the map controls.
  const headerExtras = document.getElementById("header-extras");
  if (headerExtras && !activeId) {
    headerExtras.innerHTML = `
      <rurio-summary-bar static></rurio-summary-bar>

      <!-- MAP TOOLBAR (border-b dropped — the app-header owns the single divider) -->
      <div class="map-toolbar flex items-center bg-surface px-3 py-2 text-neutral-700 dark:text-neutral-300">
        ${selectWidget("view",  MAP_VIEW_OPTIONS,  mapToolbarState.view)}
        ${selectWidget("layer", MAP_LAYER_OPTIONS, mapToolbarState.layer)}

        <button type="button" data-map-search aria-expanded="false" aria-haspopup="dialog"
                class="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-base font-medium hover:bg-subtle">
          <i data-lucide="search" class="size-4 text-neutral-500 dark:text-neutral-400"></i>
          <span>Cauta</span>
        </button>
      </div>
    `;
  }

  target.innerHTML = `
    <!-- MAP FILTER PANEL (overlays the map when "Cauta" is pressed) -->
    <div class="relative flex-1 min-h-0">
      <div data-map-filter-panel hidden
           class="absolute inset-x-0 top-0 z-20 space-y-4 border-b border-border-subtle bg-surface px-3 py-4 shadow-lg sm:px-6">
        <!-- Search -->
        <div class="relative">
          <i data-lucide="search" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"></i>
          <input type="search" data-map-search-input
                 placeholder="Cauta teren sau filtreaza..."
                 class="w-full rounded-md bg-surface py-2 pl-9 pr-9 text-base text-fg ring-1 ring-inset ring-border-subtle placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent" />
          <button type="button" data-map-filter-close
                  aria-label="Închide panou"
                  class="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-fg-subtle hover:bg-subtle hover:text-fg">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>

        <!-- Cultură -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Cultură</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            ${FILTER_CATEGORIES.culture.options.map(mapCultureBadge).join("")}
          </div>
        </div>

        <!-- Proprietate -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Proprietate</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            ${FILTER_CATEGORIES.property.options.map(mapPropertyBadge).join("")}
          </div>
        </div>
      </div>

      <div id="parcels-map-container"
           class="relative isolate h-full xl:h-[calc(100dvh-6.75rem)] bg-subtle">
        <div class="absolute inset-0 flex items-center justify-center text-base text-fg-subtle">
          Se încarcă harta…
        </div>
      </div>
    </div>

    <!-- Floating map controls — LEFT.
         Container: fixed, left-anchored, sits right above the bottom nav on mobile
         (clears bottom-nav height + iOS safe area); on desktop just bottom of viewport.
         pointer-events-none on the wrapper lets map gestures pass through the
         transparent padding; pointer-events-auto on the FAB cluster restores them. -->
    <div class="pointer-events-none fixed left-0 z-10 p-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0))] xl:bottom-0">
      <div class="pointer-events-auto flex flex-col gap-2">
        <button type="button" aria-label="Mărește"
                data-map-fab="zoom-in"
                class="flex size-12 items-center justify-center rounded-full bg-surface text-fg shadow-md transition hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <i data-lucide="zoom-in" class="size-5"></i>
        </button>
        <button type="button" aria-label="Micșorează"
                data-map-fab="zoom-out"
                class="flex size-12 items-center justify-center rounded-full bg-surface text-fg shadow-md transition hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <i data-lucide="zoom-out" class="size-5"></i>
        </button>
        <button type="button" aria-label="Măsoară suprafața"
                data-map-fab="measure"
                class="flex size-12 items-center justify-center rounded-full bg-surface text-fg shadow-md transition hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <i data-lucide="ruler" class="size-5"></i>
        </button>
        <button type="button" aria-label="Comută vizibilitate"
                data-map-fab="visibility"
                class="flex size-12 items-center justify-center rounded-full bg-surface text-fg shadow-md transition hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <i data-lucide="eye" class="size-5"></i>
        </button>
      </div>
    </div>

    <!-- Floating map controls — RIGHT.
         Third FAB is accent-colored and opens an action menu (listbox-style popover). -->
    <div class="pointer-events-none fixed right-0 z-10 p-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0))] xl:bottom-0">
      <div class="pointer-events-auto flex flex-col gap-2">
        <button type="button" aria-label="Focalizare"
                data-map-fab="focus"
                class="flex size-12 items-center justify-center rounded-full bg-surface text-fg shadow-md transition hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <i data-lucide="focus" class="size-5"></i>
        </button>
        <button type="button" aria-label="Pin pe hartă"
                data-map-fab="pin"
                class="flex size-12 items-center justify-center rounded-full bg-surface text-fg shadow-md transition hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <i data-lucide="map-pin" class="size-5"></i>
        </button>

        <!-- "Add" FAB + its popover menu — own relative wrapper so the menu
             positions directly above this button, not above the whole cluster. -->
        <div class="relative">
          <button type="button"
                  data-map-fab="add"
                aria-label="Adaugă"
                aria-haspopup="menu"
                aria-expanded="false"
                class="flex size-12 items-center justify-center rounded-full bg-accent text-accent-fg shadow-md transition hover:shadow-lg hover:bg-accent-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
          <i data-lucide="ellipsis-vertical" class="size-5"></i>
        </button>

        <!-- Action menu — pops up above the cluster, right-aligned -->
        <ul data-actions-menu role="menu" hidden
            class="absolute right-0 bottom-full mb-2 w-56 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border-subtle">
          <li>
            <button type="button" role="menuitem" data-action-label="Importa terenuri"
                    class="flex w-full items-center gap-3 px-4 py-2 text-left text-base text-fg transition-colors hover:bg-accent hover:text-accent-fg">
              <i data-lucide="upload" class="size-4"></i>
              <span>Importa terenuri</span>
            </button>
          </li>
          <li>
            <button type="button" role="menuitem" data-action-label="Exporta terenuri"
                    class="flex w-full items-center gap-3 px-4 py-2 text-left text-base text-fg transition-colors hover:bg-accent hover:text-accent-fg">
              <i data-lucide="download" class="size-4"></i>
              <span>Exporta terenuri</span>
            </button>
          </li>
          <li>
            <button type="button" role="menuitem" data-action-label="Deseneaza teren nou"
                    class="flex w-full items-center gap-3 px-4 py-2 text-left text-base text-fg transition-colors hover:bg-accent hover:text-accent-fg">
              <i data-lucide="pencil-ruler" class="size-4"></i>
              <span>Deseneaza teren nou</span>
            </button>
          </li>
          <li>
            <button type="button" role="menuitem" data-action-label="Adauga punct de interes"
                    class="flex w-full items-center gap-3 px-4 py-2 text-left text-base text-fg transition-colors hover:bg-accent hover:text-accent-fg">
              <i data-lucide="map-pin-plus" class="size-4"></i>
              <span>Adauga punct de interes</span>
            </button>
          </li>
        </ul>
        </div>
      </div>
    </div>
  `;

  // Left-side measure button
  target.querySelector('[data-map-fab="measure"]')
    ?.addEventListener("click", () => alert("Masoara suprafata"));

  // Right-side actions menu
  const addBtn = target.querySelector('[data-map-fab="add"]');
  const menu = target.querySelector("[data-actions-menu]");

  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    addBtn?.setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    addBtn?.setAttribute("aria-expanded", "true");
  }

  addBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.hidden) openMenu(); else closeMenu();
  });

  menu?.querySelectorAll("[data-action-label]").forEach((item) => {
    item.addEventListener("click", () => {
      alert(item.dataset.actionLabel);
      closeMenu();
    });
  });

  // Close on outside click / Escape — bail out gracefully if elements are gone.
  const handleOutsideClick = (e) => {
    if (!menu || !menu.isConnected) {
      document.removeEventListener("click", handleOutsideClick);
      return;
    }
    if (!menu.hidden && !menu.contains(e.target) && e.target !== addBtn && !addBtn?.contains(e.target)) {
      closeMenu();
    }
  };
  const handleKeydown = (e) => {
    if (!menu || !menu.isConnected) {
      document.removeEventListener("keydown", handleKeydown);
      return;
    }
    if (e.key === "Escape" && !menu.hidden) closeMenu();
  };
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);

  const bar = headerExtras?.querySelector("rurio-summary-bar");
  if (bar) bar.config = { ...SUMMARY_CONFIG, activeView: "map" };

  // The toolbar now lives in #header-extras — bind against that root.
  // Its presence also gates the filter wiring (absent while a detail is open).
  const toolbarEl = headerExtras?.querySelector(".map-toolbar");
  if (toolbarEl) {
    bindMapToolbar(toolbarEl);
    bindMapFilter(toolbarEl, target);
  }

  const container = target.querySelector("#parcels-map-container");

  ensureLeaflet()
    .then(() => {
      if (!container.isConnected) return;
      container.innerHTML = "";
      initMap(container, activeId);
    })
    .catch((err) => {
      console.error("Leaflet load failed:", err);
      if (!container.isConnected) return;
      container.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center p-6 text-center text-base text-danger-text">
          Nu s-a putut încărca harta. Verifică conexiunea la internet.
        </div>`;
    });
}

// Detail pane reuses the parcels-page detail (same data + layout).
export const renderDetail = renderParcelDetail;

export function renderDetailEmpty(target) {
  target.innerHTML = `
    <div class="hidden xl:flex h-full items-center justify-center p-8 text-center">
      <div class="max-w-xs">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-subtle text-fg-subtle">
          <i data-lucide="globe" class="size-6"></i>
        </div>
        <p class="mt-3 text-base font-medium text-fg-muted">Apasă pe o parcelă</p>
        <p class="mt-1 text-sm text-fg-subtle">Detaliile parcelei selectate apar aici.</p>
      </div>
    </div>
  `;
}
