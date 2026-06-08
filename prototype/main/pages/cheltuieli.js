import { getParcel } from "../data/parcels.js";
import { selectControl } from "../lib/select.js";

// Cost-category metadata (icon + colours + label), keyed by `key`. Amounts are
// derived from the transactions below, so a date range can re-aggregate them.
const COST_CATEGORIES = [
  { key: "seminte",      label: "Semințe",                 icon: "wheat",         iconColor: "text-emerald-600", bar: "bg-emerald-500" },
  { key: "ingrasaminte", label: "Îngrășăminte",            icon: "flask-conical", iconColor: "text-lime-600",    bar: "bg-lime-500" },
  { key: "tratamente",   label: "Tratamente fitosanitare", icon: "spray-can",     iconColor: "text-sky-600",     bar: "bg-sky-500" },
  { key: "combustibil",  label: "Combustibil",             icon: "fuel",          iconColor: "text-amber-600",   bar: "bg-amber-500" },
  { key: "lucrari",      label: "Lucrări mecanizate",      icon: "tractor",       iconColor: "text-violet-600",  bar: "bg-violet-500" },
  { key: "altele",       label: "Altele",                  icon: "ellipsis",      iconColor: "text-slate-500",   bar: "bg-slate-400" },
];
const CAT_BY_KEY = Object.fromEntries(COST_CATEGORIES.map(c => [c.key, c]));

// Expense entries (ISO date for easy range comparison). Newest first.
const TRANSACTIONS = [
  { date: "2026-04-18", catKey: "tratamente",   label: "Tratament insecticid",         amount: 1540 },
  { date: "2026-04-02", catKey: "ingrasaminte", label: "Aplicare îngrășământ azotat",  amount: 4850 },
  { date: "2026-03-24", catKey: "tratamente",   label: "Tratament fungicid",           amount: 2130 },
  { date: "2026-03-12", catKey: "combustibil",  label: "Motorină utilaje",             amount: 1780 },
  { date: "2026-03-05", catKey: "ingrasaminte", label: "Fertilizare azotată (prima)",  amount: 2750 },
  { date: "2026-02-28", catKey: "lucrari",      label: "Lucrări de discuit",           amount: 1200 },
  { date: "2026-01-18", catKey: "altele",       label: "Asigurare cultură",            amount: 950 },
  { date: "2025-11-20", catKey: "combustibil",  label: "Motorină utilaje",             amount: 1320 },
  { date: "2025-11-05", catKey: "tratamente",   label: "Erbicid post-emergent",        amount: 1680 },
  { date: "2025-10-12", catKey: "ingrasaminte", label: "Îngrășământ de bază (NPK)",    amount: 3900 },
  { date: "2025-10-10", catKey: "lucrari",      label: "Semănat",                      amount: 1450 },
  { date: "2025-09-28", catKey: "lucrari",      label: "Arătură de bază",              amount: 2200 },
  { date: "2025-09-15", catKey: "seminte",      label: "Sămânță rapiță hibrid",        amount: 3640 },
];

const MONTHS_RO = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"];

// Transactions keep a newest → oldest invariant; re-sort after inserts.
function sortTransactions() {
  TRANSACTIONS.sort((a, b) => (a.date < b.date ? 1 : -1));
}
function dataSpan() {
  return { min: TRANSACTIONS[TRANSACTIONS.length - 1].date, max: TRANSACTIONS[0].date };
}

/* ── Date helpers (work on local YYYY-MM-DD, no timezone surprises) ── */
function isoToDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function dateToIso(dt) {
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${m}-${d}`;
}
function fmtDate(iso) {
  const dt = isoToDate(iso);
  return `${String(dt.getDate()).padStart(2, "0")} ${MONTHS_RO[dt.getMonth()]} ${dt.getFullYear()}`;
}
function fmtLei(n) {
  return Math.round(n).toLocaleString("ro-RO");
}

// Preset ranges, anchored to the latest transaction so they always hit data.
function presetRange(name, maxIso) {
  const ref = isoToDate(maxIso);
  const from = isoToDate(maxIso);
  if (name === "week") from.setDate(ref.getDate() - 6);
  else if (name === "month") from.setMonth(ref.getMonth() - 1);
  else if (name === "year") from.setFullYear(ref.getFullYear() - 1);
  else return { from: dataSpan().min, to: maxIso }; // "all"
  return { from: dateToIso(from), to: maxIso };
}

export function render(target, ctx) {
  const parcelId = ctx?.route?.id;
  const p = getParcel(parcelId);
  if (!p) {
    target.innerHTML = `
      <div class="flex h-full items-center justify-center p-8 text-center">
        <div class="max-w-xs">
          <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <i data-lucide="search-x" class="size-6"></i>
          </div>
          <p class="mt-3 text-base font-medium text-slate-700">Parcela nu a fost găsită</p>
          <a href="#/parcels" class="mt-3 inline-block text-base font-semibold text-teal-700 hover:underline">Înapoi la listă</a>
        </div>
      </div>
    `;
    return;
  }

  const PRESETS = [
    { name: "week",  label: "Săptămână" },
    { name: "month", label: "Lună" },
    { name: "year",  label: "An" },
    { name: "all",   label: "Tot" },
  ];

  let span = dataSpan();

  target.innerHTML = `
    <div class="bg-slate-50 pb-28">

      <!-- HEADER with back button -->
      <div class="border-b border-slate-200 bg-white p-4 flex items-center gap-3">
        <button type="button" data-back-btn aria-label="Înapoi"
                class="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
          <i data-lucide="arrow-left" class="size-5"></i>
        </button>
        <div class="flex-1">
          <h1 class="text-xl font-bold text-slate-800">Cheltuieli</h1>
          <p class="text-sm text-slate-500">${p.name}</p>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="p-4 space-y-4">

        <!-- PERIOADĂ — preset chips + custom range -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <div class="mb-3 flex items-center gap-2">
            <i data-lucide="calendar-range" class="size-4 text-teal-600"></i>
            <h2 class="text-base font-bold text-slate-800">Perioadă</h2>
          </div>
          <div class="mb-3 flex flex-wrap gap-2" data-presets>
            ${PRESETS.map(pr => `
              <rurio-badge selectable shape="pill" data-preset="${pr.name}" value="${pr.name}" ${pr.name === "all" ? "selected" : ""}>${pr.label}</rurio-badge>
            `).join("")}
          </div>
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">De la</span>
              <input type="date" data-from min="${span.min}" max="${span.max}" value="${span.min}"
                     class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </label>
            <label class="block">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Până la</span>
              <input type="date" data-to min="${span.min}" max="${span.max}" value="${span.max}"
                     class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </label>
          </div>
        </div>

        <!-- SUMMARY HERO -->
        <div class="rounded-xl bg-emerald-700 p-4 text-white shadow-sm">
          <div class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-100">
            <i data-lucide="wallet" class="size-4"></i>
            Total cheltuieli
          </div>
          <div class="mt-1 flex items-baseline gap-1.5">
            <span class="text-4xl font-bold leading-none" data-total>0</span>
            <span class="text-base font-semibold text-emerald-100">LEI</span>
          </div>
          <p class="mt-1 text-sm text-emerald-100" data-range-label></p>
          <div class="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-sm">
            <div>
              <div class="text-emerald-100">Pe hectar</div>
              <div class="font-bold"><span data-perha>0</span> LEI/ha</div>
            </div>
            <div class="text-center">
              <div class="text-emerald-100">Suprafață</div>
              <div class="font-bold">${p.area.toFixed(1)} ha</div>
            </div>
            <div class="text-right">
              <div class="text-emerald-100">Tranzacții</div>
              <div class="font-bold" data-count>0</div>
            </div>
          </div>
        </div>

        <!-- DISTRIBUȚIE PE CATEGORII -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 mb-3">Distribuție pe categorii</h2>
          <div class="space-y-3" data-breakdown></div>
        </div>

        <!-- EVOLUȚIE LUNARĂ -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <h3 class="text-base font-bold text-slate-800 mb-3">Evoluție lunară</h3>
          <div data-chart></div>
        </div>

        <!-- TRANZACȚII -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <h2 class="text-base font-bold text-slate-800 mb-3">Tranzacții</h2>
          <ul class="divide-y divide-slate-100" data-tx-list></ul>
        </div>

      </div>

      <!-- FAB — quick add expense; clears the fixed bottom nav (4.25rem) -->
      <button type="button" data-sheet-open="sheet-add-cheltuiala" aria-label="Adaugă cheltuială"
              class="fixed right-4 z-30 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0))] flex size-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800 active:scale-95">
        <i data-lucide="plus" class="size-6"></i>
      </button>

      <!-- ADD EXPENSE SHEET -->
      <rurio-sheet id="sheet-add-cheltuiala" title="Adaugă cheltuială">
        <form data-add-expense-form class="space-y-5" novalidate>
          <div>
            <label for="exp-label" class="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">Denumire cheltuială</label>
            <input id="exp-label" name="label" type="text" required
                   class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                   placeholder="ex. Tratament fungicid" />
          </div>

          <div>
            <label for="exp-category" class="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">Categorie</label>
            ${selectControl({
              id: "exp-category",
              name: "category",
              options: COST_CATEGORIES.map(c => ({ value: c.key, label: c.label })),
            })}
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="exp-amount" class="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">Sumă (LEI)</label>
              <input id="exp-amount" name="amount" type="number" min="0" step="any" inputmode="decimal" required
                     class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                     placeholder="0" />
            </div>
            <div>
              <label for="exp-date" class="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">Dată</label>
              <input id="exp-date" name="date" type="date" required value="${span.max}"
                     class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </div>
          </div>

          <div>
            <label for="exp-notes" class="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">Observații</label>
            <textarea id="exp-notes" name="notes" rows="3"
                      class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="Detalii, comentarii (opțional)"></textarea>
          </div>

          <p data-expense-error hidden class="text-sm font-medium text-rose-600">Completează denumirea, suma și data.</p>

          <hr class="border-t border-slate-200" />

          <div class="flex gap-3">
            <button type="button" data-sheet-close
                    class="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-center text-base font-semibold text-slate-800 hover:bg-slate-200">Anulează</button>
            <button type="submit"
                    class="flex-1 rounded-lg bg-emerald-700 px-4 py-3 text-center text-base font-semibold text-white hover:bg-emerald-800">Salvează</button>
          </div>
        </form>
      </rurio-sheet>

    </div>
  `;

  /* ── Element refs ────────────────────────────────────────── */
  const fromInput = target.querySelector("[data-from]");
  const toInput = target.querySelector("[data-to]");
  const presetBtns = target.querySelectorAll("[data-preset]");
  const totalEl = target.querySelector("[data-total]");
  const perHaEl = target.querySelector("[data-perha]");
  const countEl = target.querySelector("[data-count]");
  const rangeLabelEl = target.querySelector("[data-range-label]");
  const breakdownEl = target.querySelector("[data-breakdown]");
  const chartEl = target.querySelector("[data-chart]");
  const txListEl = target.querySelector("[data-tx-list]");

  const empty = (msg) => `<p class="py-6 text-center text-base text-slate-400">${msg}</p>`;

  /* ── Render the dynamic sections for [from, to] ──────────── */
  function applyRange(from, to) {
    const txs = TRANSACTIONS.filter(t => t.date >= from && t.date <= to);
    const total = txs.reduce((s, t) => s + t.amount, 0);

    // Hero
    totalEl.textContent = fmtLei(total);
    perHaEl.textContent = fmtLei(total / p.area);
    countEl.textContent = txs.length;
    rangeLabelEl.textContent = `${fmtDate(from)} – ${fmtDate(to)}`;

    // Category breakdown (skip empty, biggest first)
    const rows = COST_CATEGORIES
      .map(c => ({ ...c, amount: txs.filter(t => t.catKey === c.key).reduce((s, t) => s + t.amount, 0) }))
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    breakdownEl.innerHTML = rows.length ? rows.map(c => {
      const pct = total ? Math.round((c.amount / total) * 100) : 0;
      return `
        <div>
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <i data-lucide="${c.icon}" class="size-4 ${c.iconColor}"></i>
              <span class="text-base font-medium text-slate-700">${c.label}</span>
            </div>
            <div class="text-base font-bold text-slate-800">${fmtLei(c.amount)} <span class="text-sm font-normal text-slate-500">LEI</span></div>
          </div>
          <div class="mt-1.5 flex items-center gap-2">
            <div class="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full ${c.bar}" style="width: ${pct}%;"></div>
            </div>
            <span class="w-8 text-right text-[11px] font-semibold text-slate-500">${pct}%</span>
          </div>
        </div>
      `;
    }).join("") : empty("Nicio cheltuială în perioada selectată");

    // Monthly evolution (chronological)
    const byMonth = new Map();
    txs.forEach(t => { const k = t.date.slice(0, 7); byMonth.set(k, (byMonth.get(k) || 0) + t.amount); });
    const months = [...byMonth.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([k, lei]) => ({ label: MONTHS_RO[Number(k.slice(5, 7)) - 1], lei }));
    const maxSpend = Math.max(1, ...months.map(m => m.lei));
    chartEl.innerHTML = months.length ? `
      <div class="flex items-end gap-1 justify-between h-24">
        ${months.map((m, i) => {
          const isLast = i === months.length - 1;
          return `<div class="flex-1 rounded-t ${isLast ? "bg-emerald-500" : "bg-slate-300"}"
                       style="height: ${Math.max(6, Math.round((m.lei / maxSpend) * 100))}%;" title="${m.label}: ${fmtLei(m.lei)} LEI"></div>`;
        }).join("")}
      </div>
      <div class="mt-2 flex justify-between gap-1 text-[10px] text-slate-500">
        ${months.map(m => `<span class="flex-1 text-center">${m.label}</span>`).join("")}
      </div>
    ` : empty("Fără date pentru grafic");

    // Transactions list (newest first — TRANSACTIONS already sorted)
    txListEl.innerHTML = txs.length ? txs.map(t => {
      const c = CAT_BY_KEY[t.catKey];
      return `
        <li class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 ${c.iconColor}">
            <i data-lucide="${c.icon}" class="size-4"></i>
          </span>
          <div class="min-w-0 flex-1">
            <div class="truncate text-base font-medium text-slate-700">${t.label}</div>
            <div class="text-[11px] text-slate-500">${fmtDate(t.date)} • ${c.label}</div>
            ${t.notes ? `<div class="truncate text-[11px] text-slate-400">${t.notes}</div>` : ""}
          </div>
          <div class="shrink-0 text-base font-bold text-slate-800">${fmtLei(t.amount)} <span class="text-sm font-normal text-slate-500">LEI</span></div>
        </li>
      `;
    }).join("") : empty("Nicio tranzacție în perioada selectată");

    // New <i data-lucide> nodes were injected — re-run the icon factory.
    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }

  function setActivePreset(name) {
    presetBtns.forEach(b => {
      if (b.dataset.preset === name) b.setAttribute("selected", "");
      else b.removeAttribute("selected");
    });
  }

  /* ── Bindings ────────────────────────────────────────────── */
  target.querySelector("[data-back-btn]")
    ?.addEventListener("click", () => window.history.back());

  target.querySelector("[data-presets]")?.addEventListener("rurio:badge-toggle", (e) => {
    const badge = e.target.closest("[data-preset]");
    if (!badge) return;
    const { from, to } = presetRange(badge.dataset.preset, dataSpan().max);
    fromInput.value = from;
    toInput.value = to;
    setActivePreset(badge.dataset.preset);
    applyRange(from, to);
  });

  // Add expense — append to the in-memory list and reflect it immediately.
  const sheet = target.querySelector("#sheet-add-cheltuiala");
  const addForm = target.querySelector("[data-add-expense-form]");
  const expenseError = target.querySelector("[data-expense-error]");
  addForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const categoryEl = addForm.querySelector("#exp-category");
    const label = addForm.querySelector("[name='label']").value.trim();
    const category = categoryEl.value ?? categoryEl.getAttribute("value");
    const amount = parseFloat(addForm.querySelector("[name='amount']").value);
    const date = addForm.querySelector("[name='date']").value;
    const notes = addForm.querySelector("[name='notes']").value.trim();

    if (!label || !date || !CAT_BY_KEY[category] || Number.isNaN(amount) || amount < 0) {
      expenseError.hidden = false;
      return;
    }
    expenseError.hidden = true;

    TRANSACTIONS.push({ date, catKey: category, label, amount, notes });
    sortTransactions();
    span = dataSpan();

    // Relax filter bounds and make sure the new entry is inside the view.
    fromInput.min = span.min; fromInput.max = span.max;
    toInput.min = span.min; toInput.max = span.max;
    if (date < fromInput.value) fromInput.value = date;
    if (date > toInput.value) toInput.value = date;

    setActivePreset(null);
    applyRange(fromInput.value, toInput.value);

    addForm.reset();
    addForm.querySelector("[name='date']").value = span.max;
    // el-select is a custom element — reset() doesn't touch it.
    categoryEl.value = COST_CATEGORIES[0].key;
    sheet?.close();
  });

  // Custom dates → clear active preset, keep from ≤ to.
  function onCustomDate() {
    if (fromInput.value > toInput.value) {
      // Keep the range valid by syncing the other field to the changed one.
      if (document.activeElement === fromInput) toInput.value = fromInput.value;
      else fromInput.value = toInput.value;
    }
    setActivePreset(null);
    applyRange(fromInput.value, toInput.value);
  }
  fromInput.addEventListener("change", onCustomDate);
  toInput.addEventListener("change", onCustomDate);

  // Initial paint — full span ("Tot").
  applyRange(span.min, span.max);
}

export function renderDetailEmpty(target) {
  target.innerHTML = "";
}
