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
function statCard({ bg, label, value, icon, dot, action }) {
  const tag = action ? "button" : "div";
  const attrs = action ? `type="button" data-stat-action="${action}"` : "";
  const styles = action ? `cursor-pointer transition hover:shadow-md` : "";
  return `
    <${tag} ${attrs} class="relative aspect-square overflow-hidden rounded-2xl ${bg} p-4 text-white shadow-sm ${styles}">
      ${dot ? `<span class="absolute right-3 top-3 size-2.5 rounded-full bg-orange-400 ring-2 ring-white/30"></span>` : ""}
      <div class="text-[11px] font-medium uppercase tracking-wide text-white/80">${label}</div>
      <div class="mt-1 text-lg font-bold leading-tight">${value}</div>
      <i data-lucide="${icon}" class="absolute bottom-3 right-3 size-7 text-white"></i>
    </${tag}>
  `;
}

/* One row in the expanded "Risc & Predicții" list. */
function riskRow({ bg, ring, icon, iconColor, text }) {
  return `
    <div class="flex items-start gap-3 rounded-xl ${bg} ${ring ? `ring-1 ring-inset ${ring}` : ""} p-3">
      <i data-lucide="${icon}" class="mt-0.5 size-5 shrink-0 ${iconColor}"></i>
      <p class="flex-1 text-base leading-snug text-slate-700">${text}</p>
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
          <p class="mt-3 text-base font-medium text-slate-700">Parcela nu a fost găsită</p>
          <a href="#/parcels" class="mt-3 inline-block text-base font-semibold text-teal-700 hover:underline">Înapoi la listă</a>
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
            <span class="text-base font-bold leading-none">B+</span>
            <span class="mt-0.5 text-[8px] font-medium leading-none">CO₂</span>
          </div>
        </div>

        <!-- Parcel info -->
        <div class="flex flex-col rounded-2xl bg-white p-3 shadow-sm">
          <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">${p.apia}</div>
          <div class="text-base font-bold text-slate-800">${p.name}</div>
          <div class="mt-0.5 text-[11px] text-slate-500">${p.pl}</div>

          <div class="mt-2 flex flex-wrap items-baseline gap-x-1.5">
            <span class="text-3xl font-bold leading-none text-teal-800">${p.area.toFixed(1)}</span>
            <span class="text-base font-semibold text-teal-800">ha</span>
            <rurio-badge intent="info" shape="pill" size="sm">${p.property || "Propriu"}</rurio-badge>
          </div>

          <div class="mt-1.5 flex items-center gap-1.5">
            <i data-lucide="sprout" class="size-4 shrink-0 text-amber-600"></i>
            <span class="text-sm font-bold text-amber-700">${p.crop}</span>
          </div>
          <div class="pl-5 text-[11px] text-slate-500">${p.soi}</div>

          <button type="button" data-action-navigheaza
                  class="mt-auto flex items-center justify-center gap-1.5 rounded-full bg-teal-800 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-900">
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
          <p class="mt-1.5 pr-10 text-base leading-snug text-slate-700" data-notes-display>
            ${(p.notes && p.notes.length > 0) ? p.notes[0] : "Nicio notă adăugată"}
          </p>
          <button type="button" data-note-menu-btn aria-label="Opțiuni notițe" aria-haspopup="menu" aria-expanded="false"
                  class="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-teal-800 text-white shadow-md hover:bg-teal-900">
            <i data-lucide="plus" class="size-4"></i>
          </button>
          <ul data-note-menu role="menu" hidden
              class="absolute right-3 top-11 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200">
            <li><button type="button" role="menuitem" data-action-add-note
                        class="flex w-full items-center gap-3 px-4 py-2 text-left text-base text-slate-700 transition-colors hover:bg-slate-100">
              <i data-lucide="plus" class="size-4"></i><span>Adaugă notă</span>
            </button></li>
          </ul>
        </div>
        <div class="grid grid-cols-2 divide-x divide-slate-100">
          <div class="p-3">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <i data-lucide="bell" class="size-3.5"></i>
              REMINDER
            </div>
            <p class="mt-1 text-sm font-semibold text-amber-600">15 Apr — Inspecție dronă</p>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <i data-lucide="square-check" class="size-3.5"></i>
              TASKS
            </div>
            <p class="mt-1 text-base font-bold text-teal-800">2 active / 5 total</p>
          </div>
        </div>
      </div>

      <!-- RISC & PREDICTII — collapsible; shows 1 (active warning) by default, all 4 when expanded -->
      <div class="mx-4 mt-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-amber-200">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 text-base font-bold text-slate-800">
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
                class="mx-auto mt-2 flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-800">
          <span>Vezi detalii</span>
          <i data-lucide="chevron-down" data-risk-toggle-chev class="size-3.5 transition-transform"></i>
        </button>
      </div>

      <!-- GRID DASHBOARD (2-col, 8 cards) -->
      <div class="mt-3 grid grid-cols-2 gap-3 px-4">
        ${statCard({ bg: "bg-teal-700",    label: "Satelit & NDVI",     value: `Ultima: ${STATS.satNDVI}`, icon: "satellite", action: "satelit-indici" })}
        ${statCard({ bg: "bg-emerald-700", label: "Cheltuieli",         value: STATS.cheltuieli,            icon: "wallet", action: "cheltuieli" })}
        ${statCard({ bg: "bg-sky-700",     label: "Rezumat Activități", value: STATS.activitati,            icon: "wheat", action: "activitati" })}
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

    <!-- ADD NOTE SHEET -->
    <rurio-sheet id="sheet-add-note" title="Adaugă notă">
      <form data-add-note-form class="space-y-5" novalidate>
        <div>
          <label for="note-text" class="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Notă
          </label>
          <textarea id="note-text" name="note" rows="6" class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Scrie observațiile tale..."></textarea>
        </div>

        <hr class="border-t border-slate-200" />

        <div class="flex gap-3">
          <button type="button" data-sheet-close
                  class="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-center text-base font-semibold text-slate-800 hover:bg-slate-200">
            Anuleaza
          </button>
          <button type="submit"
                  class="flex-1 rounded-lg bg-teal-800 px-4 py-3 text-center text-base font-semibold text-white hover:bg-teal-900">
            Salveaza
          </button>
        </div>
      </form>
    </rurio-sheet>
  `;

  /* ── Bindings ────────────────────────────────────────────── */
  target.querySelector("[data-action-navigheaza]")
    ?.addEventListener("click", () => alert("Navighează către teren"));

  // Note menu toggle
  const noteMenuBtn = target.querySelector("[data-note-menu-btn]");
  const noteMenu = target.querySelector("[data-note-menu]");
  noteMenuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    noteMenu.hidden = !noteMenu.hidden;
    noteMenuBtn.setAttribute("aria-expanded", String(!noteMenu.hidden));
  });

  // Close menu on outside click
  document.addEventListener("click", () => {
    if (noteMenu?.isConnected && !noteMenu.hidden) {
      noteMenu.hidden = true;
      noteMenuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Add note action
  target.querySelector("[data-action-add-note]")
    ?.addEventListener("click", () => {
      noteMenu.hidden = true;
      noteMenuBtn.setAttribute("aria-expanded", "false");
      document.getElementById("sheet-add-note")?.open();
    });

  const addNoteForm = target.querySelector("[data-add-note-form]");
  addNoteForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const textarea = target.querySelector("[name='note']");
    const noteText = textarea?.value.trim();
    if (!noteText) return;

    p.notes = p.notes || [];
    p.notes.unshift(noteText); // prepend to show newest first
    target.querySelector("[data-notes-display]").textContent = p.notes[0];
    textarea.value = "";
    document.getElementById("sheet-add-note")?.close();
  });

  // Stat card navigation
  target.querySelectorAll("[data-stat-action]").forEach(card => {
    card.addEventListener("click", () => {
      const action = card.dataset.statAction;
      window.location.hash = `#/parcels/${id}/${action}`;
    });
  });
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
