export const meta = {
  id: "activitate",
  label: "Activitate",
  icon: "activity",
  showInNav: true,
};

/* Prototype role + people lists for the report filters. */
const ROLES = [
  { value: "",              label: "Toate rolurile" },
  { value: "administrator", label: "Administrator" },
  { value: "manager",       label: "Manager" },
  { value: "operator",      label: "Operator" },
  { value: "tehnician",     label: "Tehnician" },
  { value: "agronom",       label: "Inginer agronom" },
];

const PEOPLE = [
  { value: "",              label: "Toate persoanele" },
  { value: "ion-popescu",   label: "Ion Popescu" },
  { value: "maria-ionescu", label: "Maria Ionescu" },
  { value: "george-vasile", label: "George Vasile" },
  { value: "andrei-stoica", label: "Andrei Stoica" },
  { value: "elena-dumitru", label: "Elena Dumitru" },
];

const LABEL_CLS = "block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle";
const SELECT_CLS =
  "w-full cursor-pointer appearance-none rounded-lg bg-surface px-3 py-2.5 pr-9 text-base font-medium text-fg " +
  "ring-1 ring-inset ring-border-subtle focus:outline-none focus:ring-2 focus:ring-accent transition-shadow";
const INPUT_DATE_CLS =
  "w-full rounded-lg bg-surface px-3 py-2.5 text-base font-medium text-fg ring-1 ring-inset ring-border-subtle " +
  "focus:outline-none focus:ring-2 focus:ring-accent transition-shadow";

function selectField({ id, label, options }) {
  return `
    <div>
      <label for="${id}" class="${LABEL_CLS}">${label}</label>
      <div class="relative mt-1.5">
        <select id="${id}" class="${SELECT_CLS}">
          ${options.map(o => `<option value="${o.value}">${o.label}</option>`).join("")}
        </select>
        <i data-lucide="chevron-down"
           class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"></i>
      </div>
    </div>
  `;
}

export function render(target) {
  target.innerHTML = `
    <section class="px-4 pt-6 pb-12 sm:px-6 xl:px-8 xl:pt-10">
      <div class="max-w-2xl mx-auto xl:mx-0">

        <header>
          <p class="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Configurator firme</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Activitate</h1>
        </header>

        <form class="mt-6 space-y-4" data-form-activitate novalidate>

          ${selectField({ id: "act-rol",      label: "Rol",      options: ROLES })}
          ${selectField({ id: "act-persoana", label: "Persoană", options: PEOPLE })}

          <div>
            <span class="${LABEL_CLS}">Interval</span>
            <div class="mt-1.5 grid grid-cols-2 gap-2">
              <input type="date" id="act-from" aria-label="De la"   class="${INPUT_DATE_CLS}" />
              <input type="date" id="act-to"   aria-label="Până la" class="${INPUT_DATE_CLS}" />
            </div>
          </div>

          <button type="button" data-action-generate
                  class="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-base font-semibold text-accent-fg transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
            <i data-lucide="file-down" class="size-4"></i>
            Generează excel
          </button>

        </form>

      </div>
    </section>
  `;

  target.querySelector("[data-action-generate]")
    ?.addEventListener("click", () => alert("Generare raport excel"));
}
