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
// Vehicle images live in images/utilaje/Farm/utilaje/ as `${prefix}_${brand}.png`.
const IMG_BASE = "images/utilaje/Farm/utilaje";
const BRAND = {
  Case:"Case IH", Class:"Claas", DeutzFahr:"Deutz-Fahr", Fendt:"Fendt", JD:"John Deere",
  Kubota:"Kubota", MF:"Massey Ferguson", NH:"New Holland", Steyr:"Steyr",
  Valtra:"Valtra", Chalenger:"Challenger",
};

// Vehicle families → the brand renders that exist for each.
const FLEET = [
  { prefix:"A1", tip:"Tractor",        categorie:"Utilaje",     model:"Seria 5",  brands:["Case","Class","DeutzFahr","Fendt","JD","Kubota","MF","NH","Steyr","Valtra"] },
  { prefix:"B1", tip:"Tractor",        categorie:"Utilaje",     model:"Seria 8",  brands:["Class","DeutzFahr","Fendt","JD","Kubota","MF","NH","Steyr","Valtra"] },
  { prefix:"D",  tip:"Tractor șenile", categorie:"Utilaje",     model:"Track",    brands:["Case","Chalenger","Fendt","JD"] },
  { prefix:"H",  tip:"Combină",        categorie:"Utilaje",     model:"Recoltat", brands:["Case","Class","DeutzFahr","Fendt","JD","Kubota","MF","NH","Steyr","Valtra"] },
  { prefix:"S",  tip:"Stropitoare",    categorie:"Echipamente", model:"Boom 36m", brands:["Case","Fendt","JD","Kubota","NH","Steyr","Valtra"] },
];
const SINGLES = [
  { img:"Atv",  tip:"ATV",    categorie:"Autovehicule", name:"ATV Quad",       model:"4x4 Outlander" },
  { img:"Auto", tip:"SUV",    categorie:"Autovehicule", name:"Pickup Câmp",    model:"Ranger Raptor" },
  { img:"Tir",  tip:"Camion", categorie:"Autovehicule", name:"Camion Cereale", model:"Trailer basculabil" },
];

// Deterministic pools — keep prototype data stable (no randomness).
const FARMS     = ["Agro Vest Holdings", "Ferma Sud", "Agro Transilvania"];
const LOCATIONS = ["Parcela 12 Nord", "Parcela 7 Est", "Bază Cluj-Napoca", "Atelier Timișoara", "Bază Brașov", "DN1 → Sibiu", "Parcela 4 Vest", "Bază Arad"];
const STATUSES  = ["active", "driving", "idle", "maintenance", "offline"];
const TAGS      = { active:["Activ","GPS"], driving:["Activ","GPS"], idle:["Inactiv"], maintenance:["Defect"], offline:["Inactiv"] };
const LASTACT   = ["2026-06-07T08:14:00","2026-06-07T07:42:00","2026-06-06T19:05:00","2026-06-05T16:30:00","2026-06-03T11:10:00","2026-06-07T06:20:00","2026-06-06T17:48:00","2026-05-20T10:00:00"];
const LITERS    = [540, 1280, 6200, 0, 16000, 580, 65, 0, 320, 140, 900, 2400, 75];

const UTILAJE = (() => {
  const out = [];
  let i = 0;
  const push = (o) => {
    const status = STATUSES[i % STATUSES.length];
    const e = {
      id: `ut-${String(i + 1).padStart(3, "0")}`,
      farm: FARMS[i % FARMS.length],
      location: LOCATIONS[i % LOCATIONS.length],
      lastActive: LASTACT[i % LASTACT.length],
      liters: LITERS[i % LITERS.length],
      status,
      statusTags: TAGS[status],
      ...o,
    };
    if (status === "driving") e.speed = 12 + (i % 6) * 11;
    out.push(e);
    i++;
  };
  FLEET.forEach(g => g.brands.forEach(b => push({
    name: `${g.tip} ${BRAND[b]}`,
    model: `${BRAND[b]} ${g.model}`,
    categorie: g.categorie,
    tip: g.tip,
    img: `${IMG_BASE}/${g.prefix}_${b}.png`,
  })));
  SINGLES.forEach(s => push({
    name: s.name, model: s.model, categorie: s.categorie, tip: s.tip,
    img: `${IMG_BASE}/${s.img}.png`,
  }));
  return out;
})();

const STATUS = {
  driving:     { label:"În deplasare", intent:"success" },
  active:      { label:"Activ",        intent:"success" },
  idle:        { label:"În repaus",    intent:"neutral" },
  maintenance: { label:"Mentenanță",   intent:"warning" },
  offline:     { label:"Offline",      intent:"neutral" },
};

/* ───────── Filters ───────── */
const FILTER_CATEGORIES = {
  categorie: { label:"Categorie", options:["Utilaje", "Echipamente", "Autovehicule"] },
  tip:       { label:"TIP",       options:["Tractor", "Tractor șenile", "Combină", "Stropitoare", "ATV", "SUV", "Camion"] },
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
    <div class="flex items-center gap-2 text-base text-fg-muted">
      <i data-lucide="${icon}" class="size-4 shrink-0 text-fg-subtle"></i>
      <span class="shrink-0 text-fg-subtle">${label}:</span>
      <span class="min-w-0 truncate font-medium text-fg">${value}</span>
    </div>
  `;
}
function statusBadge(u) {
  const s = STATUS[u.status] || STATUS.offline;
  const speed = u.status === "driving" && typeof u.speed === "number"
    ? ` · ${u.speed} km/h` : "";
  return `<rurio-badge intent="${s.intent}" dot>${s.label}${speed}</rurio-badge>`;
}

function utilajCard(u) {
  return `
    <li data-utilaj-id="${u.id}"
        class="relative flex gap-3 overflow-hidden rounded-xl bg-surface py-3 pl-3 pr-5 shadow-sm transition-shadow hover:shadow-md">

      <div class="relative w-24 shrink-0 overflow-hidden rounded-md bg-subtle ring-1 ring-border-subtle">
        <img src="${u.img}" alt="${u.name}" loading="lazy" class="h-full w-full object-contain p-1" />
        <input type="checkbox"
               data-utilaj-cb="${u.id}"
               aria-label="Selectează ${u.name}"
               class="absolute left-1.5 top-1.5 size-4 cursor-pointer rounded-md accent-accent shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface" />
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">${u.farm}</p>
        <h3 class="mt-0.5 truncate text-lg font-bold text-fg">${u.name}</h3>
        <p class="mt-0.5 truncate text-base text-fg-muted">${u.model} <span class="text-fg-subtle">·</span> ${u.tip}</p>

        <div class="mt-2 space-y-1">
          ${detail("fuel",    "Litri",       `${u.liters.toLocaleString("ro-RO")} L`)}
          ${detail("clock",   "Ultima act.", formatDateTime(u.lastActive))}
          ${detail("map-pin", "Locație",     u.location)}
        </div>
        <div class="mt-2">${statusBadge(u)}</div>
      </div>
    </li>
  `;
}

/* ───────── Filter UI ───────── */
function filterBadge(category, value) {
  const isOn = filterState[category].has(value);
  return `
    <rurio-badge selectable shape="pill"
                 data-filter-badge
                 data-category="${category}"
                 data-value="${value}"
                 value="${value}"
                 ${isOn ? "selected" : ""}>${value}</rurio-badge>
  `;
}
function filterSection(category) {
  const cfg = FILTER_CATEGORIES[category];
  return `
    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wider text-fg-subtle">${cfg.label}</h3>
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
      chips.push(
        `<rurio-badge intent="accent" shape="pill" removable
                      data-active-chip data-category="${cat}" data-value="${val}" value="${val}">${val}</rurio-badge>`
      );
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
  // Selectable <rurio-badge> chips bubble `rurio:badge-toggle` when toggled.
  target.addEventListener("rurio:badge-toggle", (e) => {
    const badge = e.target.closest("[data-filter-badge]");
    if (!badge) return;
    const cat = badge.dataset.category, val = badge.dataset.value;
    if (e.detail.selected) filterState[cat].add(val);
    else filterState[cat].delete(val);
    applyFiltersToDOM(target);
    renderActiveChips(target);
  });
}

function bindActiveFiltersBar(target) {
  // Removable <rurio-badge> active chips bubble `rurio:badge-remove`.
  target.addEventListener("rurio:badge-remove", (e) => {
    const chip = e.target.closest("[data-active-chip]");
    if (!chip) return;
    const cat = chip.dataset.category, val = chip.dataset.value;
    filterState[cat]?.delete(val);
    const badge = target.querySelector(`[data-filter-badge][data-category="${cat}"][data-value="${val}"]`);
    if (badge) badge.removeAttribute("selected");
    applyFiltersToDOM(target);
    renderActiveChips(target);
  });
  target.querySelector("[data-reset-filters]")?.addEventListener("click", () => {
    for (const cat of Object.keys(filterState)) filterState[cat].clear();
    target.querySelectorAll("[data-filter-badge]").forEach(b => b.removeAttribute("selected"));
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
          <span class="text-base font-medium">Toate</span>
        </label>
        <div class="ml-auto flex items-center gap-1">
          <button type="button" data-toolbar-sort
                  class="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-base font-medium hover:bg-subtle">
            <i data-lucide="arrow-up-down" class="size-4 text-neutral-500 dark:text-neutral-400"></i>
            <span data-sort-label>${currentSortLabel}</span>
          </button>
          <button type="button" data-toolbar-filter aria-expanded="false"
                  class="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-base font-medium hover:bg-subtle">
            <i data-lucide="sliders-horizontal" class="size-4 text-neutral-500 dark:text-neutral-400"></i>
            <span>Filtre</span>
          </button>
        </div>
      </div>
    `;
  }

  target.innerHTML = `
    <!-- FILTER PANEL -->
    <div data-filter-panel hidden
         class="fixed inset-x-0 top-(--app-header-h) z-20 max-h-[70dvh] overflow-y-auto border-b border-border-subtle bg-surface px-3 py-4 space-y-4 shadow-lg sm:px-6">
      ${filterSection("categorie")}
      ${filterSection("tip")}
      ${filterSection("status")}
    </div>

    <!-- ACTIVE FILTERS BAR -->
    <div data-active-filters-bar hidden
         class="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface px-3 py-2">
      <span class="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Filtre active</span>
      <div data-active-chips class="flex flex-wrap items-center gap-1.5"></div>
      <button type="button" data-reset-filters
              class="ml-auto text-base font-medium text-accent-text underline underline-offset-2 hover:text-accent">
        Reset
      </button>
    </div>

    <section class="px-4 pt-6 pb-12 sm:px-6 xl:px-8 xl:pt-10">
      <div class="mx-auto max-w-2xl xl:mx-0">

        <header class="flex items-baseline justify-between gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-fg">Utilaje</h1>
          <p class="text-base font-medium tabular-nums text-fg-muted">
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
