export const meta = {
  id: "home",
  label: "Acasă",
  icon: "home",
  showInNav: true,
};

export function render(target) {
  target.innerHTML = `
    <section class="px-4 pt-6 pb-10 sm:px-6 xl:px-8 xl:pt-10">
      <div class="max-w-2xl mx-auto xl:mx-0">
        <p class="text-xs font-semibold uppercase tracking-wider text-fg-subtle">Acasă</p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">Bun venit în Rurio</h1>
        <p class="mt-2 text-sm text-fg-muted">
          Acesta este shell-ul adaptiv. Pe telefon și iPad e o singură coloană; de la 1280px în sus
          se desface în 3 panouri (meniu · pagină · detaliu).
        </p>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="#/profile" class="group flex items-center gap-3 rounded-xl border border-border-subtle bg-surface p-4 transition hover:border-border hover:shadow-sm">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent-text">
              <i data-lucide="user" class="size-5"></i>
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-fg">Profilul meu</div>
              <div class="text-xs text-fg-muted truncate">Temă, mod și mărime text</div>
            </div>
            <i data-lucide="chevron-right" class="size-4 shrink-0 text-fg-subtle transition group-hover:translate-x-0.5"></i>
          </a>

          <div class="rounded-xl border border-border-subtle bg-surface p-4 opacity-60">
            <div class="flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-subtle text-fg-subtle">
                <i data-lucide="wheat" class="size-5"></i>
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-fg">Parcele</div>
                <div class="text-xs text-fg-muted truncate">În curând</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderDetailEmpty(target) {
  target.innerHTML = `
    <div class="hidden xl:flex h-full items-center justify-center p-8 text-center">
      <div class="max-w-xs">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-subtle text-fg-subtle">
          <i data-lucide="layout-panel-left" class="size-6"></i>
        </div>
        <p class="mt-3 text-sm font-medium text-fg-muted">Selectează ceva pentru detalii</p>
        <p class="mt-1 text-xs text-fg-subtle">Acest panou apare doar pe desktop.</p>
      </div>
    </div>
  `;
}
