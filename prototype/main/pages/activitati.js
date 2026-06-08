import { getParcel } from "../data/parcels.js";

// Visual metadata per activity type. Full class names (no interpolation) so
// Tailwind's scanner keeps them in the build.
const TYPE_META = {
  arat:       { icon: "tractor",        bg: "bg-amber-100",   color: "text-amber-600" },
  lucrari:    { icon: "tractor",        bg: "bg-amber-100",   color: "text-amber-600" },
  semanat:    { icon: "sprout",         bg: "bg-emerald-100", color: "text-emerald-600" },
  erbicidat:  { icon: "spray-can",      bg: "bg-sky-100",     color: "text-sky-600" },
  tratament:  { icon: "spray-can",      bg: "bg-sky-100",     color: "text-sky-600" },
  fertilizat: { icon: "flask-conical",  bg: "bg-lime-100",    color: "text-lime-600" },
  recoltat:   { icon: "wheat",          bg: "bg-yellow-100",  color: "text-yellow-700" },
  irigare:    { icon: "droplets",       bg: "bg-cyan-100",    color: "text-cyan-600" },
  inspectie:  { icon: "eye",            bg: "bg-violet-100",  color: "text-violet-600" },
  nota:       { icon: "notebook-pen",   bg: "bg-slate-100",   color: "text-slate-600" },
  alerta:     { icon: "triangle-alert", bg: "bg-rose-100",    color: "text-rose-600" },
};
const TYPE_DEFAULT = { icon: "activity", bg: "bg-slate-100", color: "text-slate-600" };
const typeMeta = (k) => TYPE_META[k] || TYPE_DEFAULT;

// Activity log for the parcel — newest first. ISO date for ordering.
const ACTIVITIES = [
  { date: "2026-04-18", time: "09:20", who: "Vasile Dumitru", role: "Operator", type: "tratament",  title: "Tratament insecticid",        detail: "Insecticid aplicat, doză 0.3 l/ha — erbicidator John Deere R740i" },
  { date: "2026-04-02", time: "07:45", who: "Ion Popescu",    role: "Operator", type: "fertilizat", title: "Fertilizare azotată",         detail: "Azotat 150 kg/ha pe toată suprafața" },
  { date: "2026-03-28", time: "14:10", who: "Maria Ionescu",  role: "Agronom",  type: "inspectie",  title: "Inspecție teren",             detail: "Verificare stadiu vegetativ — fără probleme majore, dezvoltare uniformă" },
  { date: "2026-03-24", time: "10:00", who: "Vasile Dumitru", role: "Operator", type: "tratament",  title: "Tratament fungicid",          detail: "Fungicid preventiv împotriva phomei" },
  { date: "2026-03-15", time: "16:30", who: "ConnAgri AI",    role: "Sistem",   type: "alerta",     title: "Alertă deficit hidric",       detail: "NDMI scăzut detectat (0.18) — recomandare monitorizare precipitații" },
  { date: "2026-02-28", time: "08:00", who: "Ion Popescu",    role: "Operator", type: "lucrari",    title: "Lucrări de discuit",          detail: "Pregătire pat germinativ zona de nord" },
  { date: "2026-01-18", time: "11:00", who: "Andrei Marin",   role: "Manager",  type: "nota",       title: "Notă adăugată",               detail: "Asigurare cultură reînnoită pentru sezon" },
  { date: "2025-11-05", time: "09:30", who: "Vasile Dumitru", role: "Operator", type: "erbicidat",  title: "Erbicidat post-emergent",     detail: "Combatere buruieni dicotiledonate" },
  { date: "2025-10-12", time: "07:00", who: "Ion Popescu",    role: "Operator", type: "fertilizat", title: "Fertilizare de bază (NPK)",   detail: "Îngrășământ complex 16-16-16, 200 kg/ha" },
  { date: "2025-10-10", time: "06:30", who: "Ion Popescu",    role: "Operator", type: "semanat",    title: "Semănat",                     detail: "Rapiță hibrid, normă 50.000 boabe/ha" },
  { date: "2025-09-28", time: "07:15", who: "Ion Popescu",    role: "Operator", type: "arat",       title: "Arătură de bază",             detail: "Adâncime 28 cm" },
  { date: "2025-09-15", time: "10:00", who: "Maria Ionescu",  role: "Agronom",  type: "nota",       title: "Notă adăugată",               detail: "Sămânță recepționată și verificată" },
];

const MONTHS_RO = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"];
function fmtDateTime(iso, time) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS_RO[Number(m) - 1]} ${y}${time ? `, ${time}` : ""}`;
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

  const persons = [...new Set(ACTIVITIES.map(a => a.who))];

  target.innerHTML = `
    <div class="bg-slate-50 pb-28">

      <!-- HEADER with back button -->
      <div class="border-b border-slate-200 bg-white p-4 flex items-center gap-3">
        <button type="button" data-back-btn aria-label="Înapoi"
                class="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
          <i data-lucide="arrow-left" class="size-5"></i>
        </button>
        <div class="flex-1">
          <h1 class="text-xl font-bold text-slate-800">Rezumat activități</h1>
          <p class="text-sm text-slate-500">${p.name}</p>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="p-4 space-y-4">

        <!-- SUMMARY -->
        <div class="grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-white p-4 shadow-sm">
          <div class="px-2 text-center">
            <div class="text-3xl font-bold text-sky-700">${ACTIVITIES.length}</div>
            <div class="text-[11px] text-slate-500">Activități</div>
          </div>
          <div class="px-2 text-center">
            <div class="text-3xl font-bold text-sky-700">${persons.length}</div>
            <div class="text-[11px] text-slate-500">Persoane</div>
          </div>
          <div class="px-2 text-center">
            <div class="text-base font-bold text-slate-800">${fmtDateTime(ACTIVITIES[0].date)}</div>
            <div class="text-[11px] text-slate-500">Ultima activitate</div>
          </div>
        </div>

        <!-- PERSON FILTER -->
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex gap-2" data-person-filter>
            <rurio-badge class="shrink-0" selectable shape="pill" data-person="" value="Toți" selected>Toți</rurio-badge>
            ${persons.map(name => `
              <rurio-badge class="shrink-0" selectable shape="pill" data-person="${name}" value="${name}">${name}</rurio-badge>
            `).join("")}
          </div>
        </div>

        <!-- TIMELINE -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <h2 class="mb-3 text-base font-bold text-slate-800">Istoric activități</h2>
          <div data-timeline></div>
        </div>

      </div>

    </div>
  `;

  const timelineEl = target.querySelector("[data-timeline]");
  const personBtns = target.querySelectorAll("[data-person]");

  function renderTimeline(person) {
    const list = person ? ACTIVITIES.filter(a => a.who === person) : ACTIVITIES;
    if (!list.length) {
      timelineEl.innerHTML = `<p class="py-6 text-center text-base text-slate-400">Nicio activitate</p>`;
      return;
    }
    timelineEl.innerHTML = `
      <ol class="relative">
        ${list.map((a, i) => {
          const t = typeMeta(a.type);
          const isLast = i === list.length - 1;
          return `
            <li class="flex gap-3">
              <div class="flex flex-col items-center">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-full ${t.bg} ${t.color}">
                  <i data-lucide="${t.icon}" class="size-4"></i>
                </span>
                ${isLast ? "" : `<span class="my-1 w-px flex-1 bg-slate-200"></span>`}
              </div>
              <div class="flex-1 ${isLast ? "" : "pb-5"}">
                <div class="text-base font-semibold text-slate-800">${a.title}</div>
                ${a.detail ? `<p class="mt-0.5 text-sm leading-snug text-slate-600">${a.detail}</p>` : ""}
                <div class="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-500">
                  <i data-lucide="user" class="size-3"></i>
                  <span class="font-medium text-slate-600">${a.who}</span>
                  <span>· ${a.role}</span>
                  <span class="text-slate-300">•</span>
                  <span>${fmtDateTime(a.date, a.time)}</span>
                </div>
              </div>
            </li>
          `;
        }).join("")}
      </ol>
    `;
    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }

  function setActivePerson(person) {
    personBtns.forEach(b => {
      if (b.dataset.person === person) b.setAttribute("selected", "");
      else b.removeAttribute("selected");
    });
  }

  /* ── Bindings ────────────────────────────────────────────── */
  target.querySelector("[data-back-btn]")
    ?.addEventListener("click", () => window.history.back());

  target.querySelector("[data-person-filter]")?.addEventListener("rurio:badge-toggle", (e) => {
    const badge = e.target.closest("[data-person]");
    if (!badge) return;
    setActivePerson(badge.dataset.person);
    renderTimeline(badge.dataset.person);
  });

  renderTimeline("");
}

export function renderDetailEmpty(target) {
  target.innerHTML = "";
}
