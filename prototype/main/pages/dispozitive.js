export const meta = {
  id: "dispozitive",
  label: "Dispozitive",
  icon: "smartphone",
  showInNav: false,
};

/* Devices currently signed in to the account (prototype data). */
const DEVICES = [
  { icon: "smartphone",        name: "iPhone 14 Pro",      meta: "Activ acum · București",        current: true  },
  { icon: "tablet-smartphone", name: "Samsung Galaxy Tab", meta: "Acum 2 zile · București",       current: false },
  { icon: "laptop",            name: "MacBook Pro",        meta: "Acum 6 zile · Cluj-Napoca",     current: false },
  { icon: "monitor",           name: "Windows PC",         meta: "Acum 3 săptămâni · Timișoara",  current: false },
];

function deviceRow({ icon, name, meta, current }, last) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  const action = current
    ? `<rurio-badge intent="success">Acest dispozitiv</rurio-badge>`
    : `<button type="button" data-device="${name}"
               class="rounded-md px-2 py-1 text-sm font-semibold text-danger-text transition-colors hover:bg-danger-subtle">Deconectează</button>`;
  return `
    <div class="${lastCls} flex items-center gap-3 px-4 py-3.5">
      <i data-lucide="${icon}" class="size-5 shrink-0 text-fg-muted"></i>
      <div class="min-w-0 flex-1">
        <p class="text-base font-medium text-fg">${name}</p>
        <p class="mt-0.5 text-sm text-fg-muted">${meta}</p>
      </div>
      <div class="shrink-0">${action}</div>
    </div>
  `;
}

export function render(target) {
  target.innerHTML = `
    <section class="flex min-h-full flex-col">
      <div class="flex-1 p-4">
        <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
          ${DEVICES.map((d, i) => deviceRow(d, i === DEVICES.length - 1)).join("")}
        </div>
      </div>

      <div class="sticky bottom-0 z-10 flex gap-3 border-t border-border-subtle bg-canvas px-4 py-3">
        <a href="#/utilizator"
           class="flex-1 rounded-lg bg-surface px-4 py-3 text-center text-base font-semibold text-fg ring-1 ring-inset ring-border-default hover:bg-subtle">
          Anulează
        </a>
        <button type="button" data-save
                class="flex-1 rounded-lg bg-accent px-4 py-3 text-center text-base font-semibold text-accent-fg hover:bg-accent-hover">
          Salvează
        </button>
      </div>
    </section>
  `;

  target.querySelectorAll("[data-device]").forEach(btn => {
    btn.addEventListener("click", () => alert(`Deconectare: ${btn.dataset.device}`));
  });
  target.querySelector("[data-save]")?.addEventListener("click", () => {
    location.hash = "#/utilizator";
  });
}
