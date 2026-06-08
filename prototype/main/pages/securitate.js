export const meta = {
  id: "securitate",
  label: "Securitate",
  icon: "shield-check",
  showInNav: false,
};

function row({ label, value, last = false, disabled = false }) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  const stateCls = disabled ? "opacity-50 select-none" : "";
  return `
    <div class="${lastCls} ${stateCls} flex items-center justify-between gap-3 px-4 py-3">
      <span class="text-base font-medium text-fg ${disabled ? "line-through" : ""}">${label}</span>
      <div class="shrink-0">${value}</div>
    </div>
  `;
}

const chipNeutral = `<rurio-badge intent="neutral">Email + Parolă</rurio-badge>`;

const chipActive = `<rurio-badge intent="success" dot>Activ</rurio-badge>`;

const chipInactive = `<rurio-badge intent="neutral" dot>Inactiv</rurio-badge>`;

const dateValue = `
  <span class="text-base text-fg-muted tabular-nums">15 mar. 2026</span>
`;

export function render(target) {
  target.innerHTML = `
    <section class="flex min-h-full flex-col">
      <div class="flex-1 p-4">

        <!-- Status list -->
        <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
          ${row({ label: "Metodă autentificare",    value: chipNeutral })}
          ${row({ label: "Autentificare 2FA",       value: chipInactive, disabled: true })}
          ${row({ label: "Ultima schimbare parolă", value: dateValue, last: true })}
        </div>

        <!-- Actions -->
        <div class="mt-6 space-y-3">
          <button type="button" data-action-change-password
                  class="w-full rounded-lg bg-accent px-4 py-3 text-center text-base font-semibold text-accent-fg transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
            Schimbare parolă
          </button>
          <button type="button" data-action-recover
                  class="w-full rounded-lg bg-surface px-4 py-3 text-center text-base font-semibold text-fg ring-1 ring-inset ring-border-default transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
            Recuperare
          </button>
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

  target.querySelector("[data-action-change-password]")
    ?.addEventListener("click", () => alert("Schimbare parolă"));
  target.querySelector("[data-action-recover]")
    ?.addEventListener("click", () => alert("Recuperare cont"));
  target.querySelector("[data-save]")
    ?.addEventListener("click", () => { location.hash = "#/utilizator"; });
}
