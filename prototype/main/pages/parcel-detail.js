import { getParcel } from "../data/parcels.js";

/* Dashboard stats — not in the parcel data model; hardcoded for the prototype. */
const STATS = {
  satNDVI:    "06 Apr",
  cheltuieli: "1.247 LEI/ha",
  activitati: "4 înregistrate",
  comentarii: "3 noi",
  fotografii: "12 poze",
  carbon:     "B+ 1.42 t/ha",
};

/* One coloured stat tile in the dashboard grid. */
function statCard({ bg, label, value, icon, dot }) {
  return `
    <div class="relative aspect-square overflow-hidden rounded-2xl ${bg} p-4 text-white shadow-sm">
      ${dot ? `<span class="absolute right-3 top-3 size-2.5 rounded-full bg-orange-400 ring-2 ring-white/30"></span>` : ""}
      <div class="text-[11px] font-medium uppercase tracking-wide text-white/80">${label}</div>
      <div class="mt-1 text-base font-bold leading-tight">${value}</div>
      <i data-lucide="${icon}" class="absolute bottom-3 right-3 size-7 text-white"></i>
    </div>
  `;
}

/* One row in the expanded "Risc & Predicții" list. */
function riskRow({ bg, ring, icon, iconColor, text }) {
  return `
    <div class="flex items-start gap-3 rounded-xl ${bg} ${ring ? `ring-1 ring-inset ${ring}` : ""} p-3">
      <i data-lucide="${icon}" class="mt-0.5 size-5 shrink-0 ${iconColor}"></i>
      <p class="flex-1 text-sm leading-snug text-slate-700">${text}</p>
    </div>
  `;
}

export function render(id, target) {
  const p = getParcel(id);
  if (!p) {
    target.innerHTML = `
      <div class="flex h-full items-center justify-center p-8 text-center">
        <div class="max-w-xs">
          <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <i data-lucide="search-x" class="size-6"></i>
          </div>
          <p class="mt-3 text-sm font-medium text-slate-700">Parcela nu a fost găsită</p>
          <a href="#/parcels" class="mt-3 inline-block text-sm font-semibold text-teal-700 hover:underline">Înapoi la listă</a>
        </div>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="bg-slate-50 pb-28">

      <!-- HERO — stylised map preview + parcel info (split view) -->
      <div class="grid grid-cols-2 gap-3 p-4">

        <!-- Map preview -->
        <div class="relative h-44 overflow-hidden rounded-2xl bg-teal-900">
          <svg viewBox="0 0 100 100" class="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <polygon points="22,18 78,12 90,52 65,90 18,82 8,40"
                     fill="#7dd3fc" fill-opacity="0.85" stroke="#bae6fd" stroke-width="1.5" />
          </svg>
          <div class="absolute right-2 top-2 flex size-12 flex-col items-center justify-center rounded-full bg-white/10 text-white ring-2 ring-white/80 backdrop-blur-sm">
            <span class="text-sm font-bold leading-none">B+</span>
            <span class="mt-0.5 text-[8px] font-medium leading-none">CO₂</span>
          </div>
        </div>

        <!-- Parcel info -->
        <div class="flex flex-col rounded-2xl bg-white p-3 shadow-sm">
          <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">${p.apia}</div>
          <div class="text-sm font-bold text-slate-800">${p.name}</div>
          <div class="mt-0.5 text-[11px] text-slate-500">${p.pl}</div>

          <div class="mt-2 flex flex-wrap items-baseline gap-x-1.5">
            <span class="text-2xl font-bold leading-none text-teal-800">${p.area.toFixed(1)}</span>
            <span class="text-sm font-semibold text-teal-800">ha</span>
            <span class="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800">${p.property || "Propriu"}</span>
          </div>

          <div class="mt-1.5 flex items-center gap-1.5">
            <i data-lucide="sprout" class="size-4 shrink-0 text-amber-600"></i>
            <span class="text-xs font-bold text-amber-700">${p.crop}</span>
          </div>
          <div class="pl-5 text-[11px] text-slate-500">${p.soi}</div>

          <button type="button" data-action-navigheaza
                  class="mt-auto flex items-center justify-center gap-1.5 rounded-full bg-teal-800 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-900">
            <i data-lucide="truck" class="size-3.5"></i>
            Navighează
          </button>
        </div>
      </div>

      <!-- FIELD NOTES + REMINDER/TASKS -->
      <div class="mx-4 overflow-hidden rounded-xl bg-white shadow-sm">
        <div class="relative border-b border-slate-100 p-4">
          <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <i data-lucide="notebook-pen" class="size-3.5"></i>
            NOTIȚE TEREN
          </div>
          <p class="mt-1.5 pr-10 text-sm leading-snug text-slate-700">
            Sol argilos în zona de NE. Drenaj slab după ploi. Nu aplica tratamente când e umed.
          </p>
          <button type="button" data-action-note-settings aria-label="Setări notițe"
                  class="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-teal-800 text-white shadow-md hover:bg-teal-900">
            <i data-lucide="settings" class="size-4"></i>
          </button>
        </div>
        <div class="grid grid-cols-2 divide-x divide-slate-100">
          <div class="p-3">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <i data-lucide="bell" class="size-3.5"></i>
              REMINDER
            </div>
            <p class="mt-1 text-xs font-semibold text-amber-600">15 Apr — Inspecție dronă</p>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <i data-lucide="square-check" class="size-3.5"></i>
              TASKS
            </div>
            <p class="mt-1 text-sm font-bold text-teal-800">2 active / 5 total</p>
          </div>
        </div>
      </div>

      <!-- RISC & PREDICTII — collapsible; shows 1 (active warning) by default, all 4 when expanded -->
      <div class="mx-4 mt-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-amber-200">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <i data-lucide="triangle-alert" class="size-4 text-amber-500"></i>
            Risc & Predicții
          </div>
          <div class="flex items-center gap-1.5 text-[10px] font-bold">
            <span class="inline-flex items-center gap-0.5 text-emerald-600"><i data-lucide="sprout" class="size-3.5"></i>▼</span>
            <span class="inline-flex items-center gap-0.5 text-emerald-600"><i data-lucide="bug" class="size-3.5"></i>▼</span>
            <span class="inline-flex items-center gap-0.5 text-emerald-600"><i data-lucide="sprout" class="size-3.5"></i>▼</span>
            <span class="inline-flex items-center gap-0.5 text-amber-600"><i data-lucide="droplets" class="size-3.5"></i>▶</span>
          </div>
        </div>

        <div class="mt-2 space-y-2">
          ${riskRow({ bg: "bg-amber-50", ring: "ring-amber-200", icon: "droplets", iconColor: "text-sky-600",
            text: "<strong>Deficit hidric — risc mediu.</strong> NDMI 0.18 și fără ploi 12 zile. Prognoza: ploi 15 mm mâine. Dacă nu plouă, irigați zona C înainte de fertilizare." })}

          <div data-risk-extra hidden class="space-y-2">
            ${riskRow({ bg: "bg-emerald-50", icon: "sprout", iconColor: "text-emerald-600",
              text: "<strong>Boli — risc scăzut.</strong> NDVI stabil, temperatura sub pragul de infecție. Fără tratament necesar momentan." })}
            ${riskRow({ bg: "bg-emerald-50", icon: "bug", iconColor: "text-emerald-600",
              text: "<strong>Dăunători — risc scăzut.</strong> Nicio captură în capcane. Monitorizați gândacul de rapiță după 15°C constant." })}
            ${riskRow({ bg: "bg-emerald-50", icon: "sprout", iconColor: "text-emerald-600",
              text: "<strong>Buruieni — risc scăzut.</strong> Tratament erbicid aplicat 22 Mar — efect vizibil pe satelit, acoperire bună." })}
          </div>
        </div>

        <button type="button" data-risk-toggle
                class="mx-auto mt-2 flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-800">
          <span>Vezi detalii</span>
          <i data-lucide="chevron-down" data-risk-toggle-chev class="size-3.5 transition-transform"></i>
        </button>
      </div>

      <!-- GRID DASHBOARD (2-col, 8 cards) -->
      <div class="mt-3 grid grid-cols-2 gap-3 px-4">
        ${statCard({ bg: "bg-teal-700",    label: "Satelit & NDVI",     value: `Ultima: ${STATS.satNDVI}`, icon: "satellite" })}
        ${statCard({ bg: "bg-emerald-700", label: "Cheltuieli",         value: STATS.cheltuieli,            icon: "wallet" })}
        ${statCard({ bg: "bg-sky-700",     label: "Rezumat Activități", value: STATS.activitati,            icon: "wheat" })}
        ${statCard({ bg: "bg-violet-700",  label: "Comentarii & Note",  value: STATS.comentarii,            icon: "message-square" })}
        ${statCard({ bg: "bg-amber-800",   label: "Fotografii",         value: STATS.fotografii,            icon: "camera" })}
        ${statCard({ bg: "bg-teal-900",    label: "Info Teren",         value: "Cadastru & detalii",        icon: "settings" })}
        ${statCard({ bg: "bg-amber-900",   label: "Analize Sol",        value: "pH, NPK, humus",            icon: "flask-conical", dot: true })}
        ${statCard({ bg: "bg-cyan-800",    label: "Proprietate",        value: "Arendă / Propriu",          icon: "file-text" })}
      </div>

      <!-- DOCUMENTS + CARBON (2-col row) -->
      <div class="mt-3 grid grid-cols-2 gap-3 px-4">
        ${statCard({ bg: "bg-sky-700",     label: "Documente", value: "Contract, extras CF", icon: "file" })}
        ${statCard({ bg: "bg-emerald-800", label: "Carbon",    value: STATS.carbon,           icon: "leaf" })}
      </div>

    </div>

    <!-- FAB — clears the fixed bottom nav (4.25rem) -->
    <button type="button" data-parcel-fab aria-label="Acțiune rapidă"
            class="fixed right-4 z-30 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0))] flex size-14 items-center justify-center rounded-full bg-teal-800 text-white shadow-lg hover:bg-teal-900 active:scale-95">
      <i data-lucide="list-plus" class="size-6"></i>
    </button>
  `;

  /* ── Bindings ────────────────────────────────────────────── */
  target.querySelector("[data-action-navigheaza]")
    ?.addEventListener("click", () => alert("Navighează către teren"));
  target.querySelector("[data-action-note-settings]")
    ?.addEventListener("click", () => alert("Setări notițe"));
  // Toggle the collapsed risk rows; only the chevron rotates so the section
  // visually stays anchored — clicking expands to 4 rows, clicking again collapses to 1.
  const riskToggle = target.querySelector("[data-risk-toggle]");
  const riskExtra = target.querySelector("[data-risk-extra]");
  const riskChev = target.querySelector("[data-risk-toggle-chev]");
  riskToggle?.addEventListener("click", () => {
    const willOpen = riskExtra.hasAttribute("hidden");
    if (willOpen) riskExtra.removeAttribute("hidden");
    else riskExtra.setAttribute("hidden", "");
    riskChev?.classList.toggle("rotate-180", willOpen);
  });
  target.querySelector("[data-parcel-fab]")
    ?.addEventListener("click", () => alert("Acțiune rapidă"));
}
