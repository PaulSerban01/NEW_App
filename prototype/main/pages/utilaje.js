export const meta = {
  id: "utilaje",
  label: "Lista utilaje",
  icon: "tractor",
  showInNav: true,
};

/* ──────────────────────────────────────────────────────────────
   PROTOTYPE DATA
   Each item carries:
   • categorie / tip → used by the filter badges (matched by exact label)
   • statusTags     → used by the status filter (any-tag matches)
   • status         → used for the visible badge on the card
   ────────────────────────────────────────────────────────────── */
const UTILAJE = [
  { id:"ut-001", farm:"Agro Vest Holdings", name:"Tractorul Mare",   model:"John Deere 7R 330",       categorie:"Utilaje",      tip:"Tractor",     liters:540,   lastActive:"2026-05-29T08:14:00", location:"Parcela 12 Nord",     status:"driving",     speed:14, statusTags:["Activ","GPS"] },
  { id:"ut-002", farm:"Agro Vest Holdings", name:"Recoltatorul",     model:"Claas Lexion 8900",       categorie:"Utilaje",      tip:"Combina",     liters:1280,  lastActive:"2026-05-29T07:42:00", location:"Parcela 7 Est",       status:"active",                statusTags:["Activ","GPS"] },
  { id:"ut-003", farm:"Ferma Sud",          name:"Stropitorul",      model:"Amazone UX 6201",         categorie:"Echipamente",  tip:"Stropitoare", liters:6200,  lastActive:"2026-05-28T19:05:00", location:"Bază Cluj-Napoca",    status:"idle",                  statusTags:["Inactiv"] },
  { id:"ut-004", farm:"Ferma Sud",          name:"Plug Mare",        model:"Lemken Diamant 16",       categorie:"Agregate",     tip:"Plug",        liters:0,     lastActive:"2026-05-25T16:30:00", location:"Atelier Timișoara",   status:"maintenance",           statusTags:["Defect"] },
  { id:"ut-005", farm:"Agro Vest Holdings", name:"Cisterna Apă",     model:"Joskin Modulo2 16000",    categorie:"Echipamente",  tip:"Stropitoare", liters:16000, lastActive:"2026-05-22T11:10:00", location:"Bază Brașov",         status:"offline",               statusTags:["Inactiv"] },
  { id:"ut-006", farm:"Agro Vest Holdings", name:"Camion Logistică", model:"MAN TGS 26.470",          categorie:"Autovehicule", tip:"Camion",      liters:580,   lastActive:"2026-05-29T06:20:00", location:"DN1 → Sibiu",         status:"driving",     speed:78, statusTags:["Activ","GPS"] },
  { id:"ut-007", farm:"Ferma Sud",          name:"Pickup Câmp",      model:"Ford Ranger Raptor",      categorie:"Autovehicule", tip:"SUV",         liters:65,    lastActive:"2026-05-28T17:48:00", location:"Bază Cluj-Napoca",    status:"idle",                  statusTags:["Inactiv"] },
  { id:"ut-008", farm:"Agro Vest Holdings", name:"Drona Scout",      model:"DJI Mavic 3 Multispectral", categorie:"Echipamente", tip:"Drona",     liters:0,     lastActive:"2026-05-29T05:55:00", location:"Parcela 12 Nord",     status:"active",                statusTags:["Activ","GPS"] },
  { id:"ut-009", farm:"Ferma Sud",          name:"Semănătoare",      model:"Väderstad Tempo V12",     categorie:"Agregate",     tip:"Semanatoarice", liters:0,   lastActive:"2026-04-15T10:00:00", location:"Atelier Timișoara",   status:"maintenance",           statusTags:["Defect"] },
];

const STATUS = {
  driving:     { label:"În deplasare", cls:"bg-success-subtle text-success-text ring-success-text/20", dot:"fill-success" },
  active:      { label:"Activ",        cls:"bg-success-subtle text-success-text ring-success-text/20", dot:"fill-success" },
  idle:        { label:"În repaus",    cls:"bg-subtle text-fg-muted ring-border-subtle",               dot:"fill-fg-subtle" },
  maintenance: { label:"Mentenanță",   cls:"bg-warning-subtle text-warning-text ring-warning-text/20", dot:"fill-warning" },
  offline:     { label:"Offline",      cls:"bg-subtle text-fg-muted ring-border-subtle",               dot:"fill-fg-subtle" },
};

/* ───────── Filters ───────── */
const FILTER_CATEGORIES = {
  categorie: { label:"Categorie", options:["Utilaje", "Agregate", "Autovehicule", "Echipamente"] },
  tip:       { label:"TIP",       options:["Tractor", "Combina", "Plug", "Semanatoarice", "Stropitoare", "SUV", "Camion", "Drona"] },
  status:    { label:"Status",    options:["Activ", "Defect", "Inactiv", "GPS"] },
};
const filterState = { categorie:new Set(), tip:new Set(), status:new Set() };

function matchesFilters(u) {
  if (filterState.categorie.size && !filterState.categorie.has(u.categorie)) return false;
  if (filterState.tip.size       && !filterState.tip.has(u.tip))             return false;
  if (filterState.status.size    && !(u.statusTags || []).some(t => filterState.status.has(t))) return false;
  return true;
}
function visibleCount() { return UTILAJE.filter(matchesFilters).length; }

/* ───────── Sort ───────── */
const SORT_OPTIONS = [
  { id:"name",   label:"Nume A-Z",       fn:(a,b)=>a.name.localeCompare(b.name) },
  { id:"recent", label:"Recent activ",   fn:(a,b)=>(b.lastActive||"").localeCompare(a.lastActive||"") },
  { id:"liters", label:"Litri ↓",        fn:(a,b)=>b.liters-a.liters },
  { id:"farm",   label:"Fermă A-Z",      fn:(a,b)=>a.farm.localeCompare(b.farm) },
];
let sortIdx = 0;

/* ───────── helpers ───────── */
function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ro-RO", {
    day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit",
  });
}
function detail(icon, label, value) {
  return `
    <div class="flex items-center gap-2 text-xs text-fg-muted">
      <i data-lucide="${icon}" class="size-4 shrink-0 text-fg-subtle"></i>
      <span class="text-fg-subtle">${label}:</span>
      <span class="truncate font-medium text-fg">${value}</span>
    </div>
  `;
}
function statusBadge(u) {
  const s = STATUS[u.status] || STATUS.offline;
  const speed = u.status === "driving" && typeof u.speed === "number"
    ? ` <span class="text-fg-muted">·</span> <span class="tabular-nums">${u.speed} km/h</span>` : "";
  return `
    <span class="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}">
      <svg viewBox="0 0 6 6" aria-hidden="true" class="size-1.5 ${s.dot}"><circle cx="3" cy="3" r="3"/></svg>
      ${s.label}${speed}
    </span>
  `;
}

function utilajCard(u) {
  return `
    <li data-utilaj-id="${u.id}"
        class="relative overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-border-subtle transition-shadow hover:shadow-md">
      <div class="flex gap-3 p-3">

        <div class="flex shrink-0 flex-col items-center gap-2">
          <input type="checkbox"
                 data-utilaj-cb="${u.id}"
                 aria-label="Selectează ${u.name}"
                 class="size-4 cursor-pointer rounded-md accent-accent shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface" />
          <div class="flex size-14 items-center justify-center rounded-lg bg-accent-subtle text-accent-text">
            <i data-lucide="tractor" class="size-7"></i>
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">${u.farm}</p>
          <h3 class="mt-0.5 truncate text-base font-bold text-fg">${u.name}</h3>
          <p class="mt-0.5 truncate text-xs text-fg-muted">${u.model} <span class="text-fg-subtle">·</span> ${u.tip}</p>

          <div class="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            ${detail("fuel",    "Litri",       `${u.liters.toLocaleString("ro-RO")} L`)}
            ${detail("clock",   "Ultima act.", formatDateTime(u.lastActive))}
            ${detail("map-pin", "Locație",     u.location)}
            <div class="flex items-center gap-2 text-xs">
              <i data-lucide="activity" class="size-4 shrink-0 text-fg-subtle"></i>
              <span class="text-fg-subtle">Status:</span>
              ${statusBadge(u)}
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
}

/* ───────── Filter UI ───────── */
function filterBadge(category, value) {
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

/* ───────── DOM application ───────── */
function applyFiltersToDOM(target) {
  target.querySelectorAll("li[data-utilaj-id]").forEach(li => {
    const u = UTILAJE.find(x => x.id === li.dataset.utilajId);
    if (!u) return;
    li.classList.toggle("hidden", !matchesFilters(u));
  });
  const count = target.querySelector("[data-count-label]");
  if (count) count.textContent = `${visibleCount()} utilaje`;
}
function applySortToDOM(target) {
  const list = target.querySelector("[data-utilaje-list]");
  if (!list) return;
  const items = Array.from(list.children);
  const fn = SORT_OPTIONS[sortIdx].fn;
  items.sort((a, b) => {
    const ua = UTILAJE.find(x => x.id === a.dataset.utilajId);
    const ub = UTILAJE.find(x => x.id === b.dataset.utilajId);
    return fn(ua, ub);
  });
  items.forEach(li => list.appendChild(li));
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
function bindToolbar(toolbarRoot, target) {
  const all     = toolbarRoot?.querySelector("[data-toolbar-all]");
  const sortBtn = toolbarRoot?.querySelector("[data-toolbar-sort]");
  const sortLbl = toolbarRoot?.querySelector("[data-sort-label]");
  const filter  = toolbarRoot?.querySelector("[data-toolbar-filter]");
  const panel   = target.querySelector("[data-filter-panel]");

  // "Toate": (un)check all VISIBLE utilaj cards.
  all?.addEventListener("change", () => {
    const checked = all.checked;
    target.querySelectorAll('li[data-utilaj-id]:not(.hidden) input[data-utilaj-cb]').forEach(cb => {
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
  });

  // Keep "Toate" in sync with individual checkboxes.
  target.addEventListener("change", (e) => {
    if (!e.target.matches('input[data-utilaj-cb]')) return;
    const visible = target.querySelectorAll('li[data-utilaj-id]:not(.hidden) input[data-utilaj-cb]');
    const allChecked = visible.length > 0 && Array.from(visible).every(cb => cb.checked);
    if (all) all.checked = allChecked;
  });
}

function bindFilterBadges(target) {
  target.querySelectorAll("[data-filter-badge]").forEach(badge => {
    const cat = badge.dataset.category;
    const val = badge.dataset.value;
    badge.addEventListener("click", () => {
      const isOn = badge.getAttribute("aria-pressed") === "true";
      if (isOn) { filterState[cat].delete(val); badge.setAttribute("aria-pressed", "false"); }
      else      { filterState[cat].add(val);    badge.setAttribute("aria-pressed", "true"); }
      applyFiltersToDOM(target);
      renderActiveChips(target);
    });
  });
}

function bindActiveFiltersBar(target) {
  target.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-filter]");
    if (!btn) return;
    const cat = btn.dataset.category, val = btn.dataset.value;
    filterState[cat]?.delete(val);
    const badge = target.querySelector(`[data-filter-badge][data-category="${cat}"][data-value="${val}"]`);
    if (badge) badge.setAttribute("aria-pressed", "false");
    applyFiltersToDOM(target);
    renderActiveChips(target);
  });
  target.querySelector("[data-reset-filters]")?.addEventListener("click", () => {
    for (const cat of Object.keys(filterState)) filterState[cat].clear();
    target.querySelectorAll("[data-filter-badge]").forEach(b => b.setAttribute("aria-pressed", "false"));
    applyFiltersToDOM(target);
    renderActiveChips(target);
  });
}

/* ───────── render ───────── */
export function render(target) {
  const total = UTILAJE.length;
  const currentSortLabel = SORT_OPTIONS[sortIdx].label;

  // Toolbar mounts in the fixed app-header, same pattern as parcels.
  const headerExtras = document.getElementById("header-extras");
  if (headerExtras) {
    headerExtras.innerHTML = `
      <div class="toolbar flex items-center gap-2 border-t border-border-subtle bg-surface px-3 py-2 text-neutral-700 dark:text-neutral-300">
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
    <!-- FILTER PANEL -->
    <div data-filter-panel hidden
         class="border-b border-border-subtle bg-surface px-3 py-4 space-y-4 sm:px-6">
      ${filterSection("categorie")}
      ${filterSection("tip")}
      ${filterSection("status")}
    </div>

    <!-- ACTIVE FILTERS BAR -->
    <div data-active-filters-bar hidden
         class="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface px-3 py-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Filtre active</span>
      <div data-active-chips class="flex flex-wrap items-center gap-1.5"></div>
      <button type="button" data-reset-filters
              class="ml-auto text-sm font-medium text-accent-text underline underline-offset-2 hover:text-accent">
        Reset
      </button>
    </div>

    <section class="px-4 pt-6 pb-12 sm:px-6 xl:px-8 xl:pt-10">
      <div class="mx-auto max-w-2xl xl:mx-0">

        <header class="flex items-baseline justify-between gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Utilaje</h1>
          <p class="text-sm font-medium tabular-nums text-fg-muted">
            <span class="text-fg" data-count-label>${total} utilaje</span>
          </p>
        </header>

        <ul data-utilaje-list role="list" class="mt-5 space-y-3">
          ${UTILAJE.map(utilajCard).join("")}
        </ul>

      </div>
    </section>
  `;

  bindToolbar(headerExtras?.querySelector(".toolbar"), target);
  bindFilterBadges(target);
  bindActiveFiltersBar(target);
  applyFiltersToDOM(target);
  applySortToDOM(target);
  renderActiveChips(target);

  document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
}
