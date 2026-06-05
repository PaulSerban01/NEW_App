export const meta = {
  id: "home",
  label: "Acasă",
  icon: "home",
  showInNav: true,
};

/* Workspaces shown in the switcher drawer (prototype data). */
const WORKSPACES = [
  { initials: "AV", name: "Agro Vest Holdings",  sub: "Firma A › PL ferma1", active: true  },
  { initials: "TC", name: "TerraCrop SRL",       sub: "Firma B › PL nord",   active: false },
  { initials: "DF", name: "Danube Farms",        sub: "Firma C › PL est",    active: false },
  { initials: "GP", name: "Green Plains Agro",   sub: "Firma D › PL sud",    active: false },
  { initials: "SA", name: "Solaris Agricultură", sub: "Firma E › PL vest",   active: false },
  { initials: "CM", name: "Câmpia Mănăștur",     sub: "Firma F › PL centru", active: false },
  { initials: "RA", name: "Recolta de Aur",      sub: "Firma G › PL luncă",  active: false },
  { initials: "HV", name: "Holda Verde",         sub: "Firma H › PL deal",   active: false },
];

function workspaceItem({ initials, name, sub, active }) {
  return `
    <button type="button" data-ws-item="${name}"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${active ? "bg-accent-subtle" : "hover:bg-subtle"}">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-fg">${initials}</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-base font-semibold text-fg">${name}</span>
        <span class="block truncate text-sm text-fg-muted">${sub}</span>
      </span>
      ${active ? `<i data-lucide="check" class="size-5 shrink-0 text-accent-text"></i>` : ""}
    </button>
  `;
}

export function render(target) {
  target.innerHTML = `
    <!-- Active workspace bar — full-width; the whole bar opens the switcher drawer -->
    <button type="button" data-workspace-trigger
            class="workspace-bar flex w-full items-center gap-3 border-b border-border-subtle bg-surface px-4 py-3 text-left transition-colors hover:bg-subtle">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-base font-bold text-accent-fg">AV</span>
      <span class="min-w-0 flex-1">
        <span class="block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Spațiu de lucru activ</span>
        <span class="block truncate text-base font-semibold text-fg">Agro Vest Holdings</span>
        <span class="mt-0.5 flex items-center gap-1 truncate text-sm text-fg-muted">
          <span>Firma A</span>
          <i data-lucide="chevron-right" class="size-3 shrink-0"></i>
          <span>PL ferma1</span>
        </span>
      </span>
      <span class="flex size-9 shrink-0 items-center justify-center text-fg-muted">
        <i data-lucide="chevron-right" class="size-5"></i>
      </span>
    </button>

    <section class="px-4 pt-6 pb-10 sm:px-6 xl:px-8 xl:pt-10">
      <div class="max-w-2xl mx-auto xl:mx-0">
        <p class="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Acasă</p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Bun venit în Rurio</h1>
        <p class="mt-2 text-base text-fg-muted">
          Acesta este shell-ul adaptiv. Pe telefon și iPad e o singură coloană; de la 1280px în sus
          se desface în 3 panouri (meniu · pagină · detaliu).
        </p>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="#/profile" class="group flex items-center gap-3 rounded-xl border border-border-subtle bg-surface p-4 transition hover:border-border hover:shadow-sm">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent-text">
              <i data-lucide="user" class="size-5"></i>
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-base font-semibold text-fg">Profilul meu</div>
              <div class="text-sm text-fg-muted truncate">Temă, mod și mărime text</div>
            </div>
            <i data-lucide="chevron-right" class="size-4 shrink-0 text-fg-subtle transition group-hover:translate-x-0.5"></i>
          </a>

          <div class="rounded-xl border border-border-subtle bg-surface p-4 opacity-60">
            <div class="flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-subtle text-fg-subtle">
                <i data-lucide="wheat" class="size-5"></i>
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-base font-semibold text-fg">Parcele</div>
                <div class="text-sm text-fg-muted truncate">În curând</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Workspace switcher — bottom drawer -->
    <div data-ws-backdrop
         class="fixed inset-0 z-50 bg-black/40 opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <div data-ws-sheet
         class="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] translate-y-full flex-col rounded-t-2xl bg-surface shadow-xl transition-transform duration-300 ease-out"
         role="dialog" aria-modal="true" aria-label="Spațiile mele de lucru">

      <!-- Header (fixed) -->
      <div class="flex shrink-0 items-center justify-between gap-3 px-4 pt-4 pb-3">
        <h2 class="text-lg font-bold text-fg">Spațiile mele de lucru</h2>
        <button type="button" data-ws-close aria-label="Închide"
                class="flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg">
          <i data-lucide="x" class="size-5"></i>
        </button>
      </div>

      <!-- Search (fixed) -->
      <div class="shrink-0 px-4 pb-3">
        <div class="relative">
          <i data-lucide="search" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"></i>
          <input type="search" data-ws-search placeholder="Caută spațiu de lucru..."
                 class="w-full rounded-lg bg-surface py-2.5 pl-9 pr-3 text-base text-fg ring-1 ring-inset ring-border-subtle placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>

      <!-- Workspace list (the only scrollable region) — capped at ~6 rows -->
      <div data-ws-list class="max-h-96 min-h-0 space-y-1 overflow-y-auto px-3 pb-2">
        ${WORKSPACES.map(workspaceItem).join("")}
      </div>

      <!-- Footer (fixed) -->
      <div class="shrink-0 border-t border-border-subtle p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0))]">
        <button type="button" data-ws-manage
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-surface px-4 py-3 text-base font-semibold text-fg ring-1 ring-inset ring-border-subtle transition-colors hover:bg-subtle">
          <i data-lucide="settings" class="size-4"></i>
          Gestionează
        </button>
      </div>
    </div>
  `;

  /* ── Workspace drawer wiring ───────────────────────────────── */
  const backdrop = target.querySelector("[data-ws-backdrop]");
  const sheet = target.querySelector("[data-ws-sheet]");
  const search = target.querySelector("[data-ws-search]");

  function openDrawer() {
    sheet.classList.remove("translate-y-full");
    backdrop.classList.remove("opacity-0", "pointer-events-none");
  }
  function closeDrawer() {
    sheet.classList.add("translate-y-full");
    backdrop.classList.add("opacity-0", "pointer-events-none");
  }

  target.querySelector("[data-workspace-trigger]")?.addEventListener("click", openDrawer);
  target.querySelector("[data-ws-close]")?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  // Filter the workspace list by name as you type.
  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    target.querySelectorAll("[data-ws-item]").forEach(item => {
      item.classList.toggle("hidden", !item.dataset.wsItem.toLowerCase().includes(q));
    });
  });

  // Selecting a workspace closes the drawer (prototype — no real switch yet).
  target.querySelectorAll("[data-ws-item]").forEach(item => {
    item.addEventListener("click", closeDrawer);
  });

  target.querySelector("[data-ws-manage]")
    ?.addEventListener("click", () => alert("Gestionează spațiile de lucru"));

  // Escape closes the drawer; listener self-removes once the page is gone.
  const onKey = (e) => {
    if (!sheet?.isConnected) { document.removeEventListener("keydown", onKey); return; }
    if (e.key === "Escape") closeDrawer();
  };
  document.addEventListener("keydown", onKey);
}

export function renderDetailEmpty(target) {
  target.innerHTML = `
    <div class="hidden xl:flex h-full items-center justify-center p-8 text-center">
      <div class="max-w-xs">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-subtle text-fg-subtle">
          <i data-lucide="layout-panel-left" class="size-6"></i>
        </div>
        <p class="mt-3 text-base font-medium text-fg-muted">Selectează ceva pentru detalii</p>
        <p class="mt-1 text-sm text-fg-subtle">Acest panou apare doar pe desktop.</p>
      </div>
    </div>
  `;
}
