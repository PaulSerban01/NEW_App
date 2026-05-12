export const meta = {
  id: "profileinfo",
  label: "Date cont",
  icon: "user-round",
  showInNav: false,
};

/* Hardcoded user data (prototype). */
const USER = {
  nume: "Popescu",
  prenume: "Ion",
  email: "ion.popescu@rurio.eu",
  telefon: "+40 723 456 789",
  limba: "ro",
};

function label(forId, text) {
  return `<label for="${forId}" class="block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">${text}</label>`;
}

const INPUT_BASE =
  "mt-1.5 w-full rounded-lg bg-surface px-3 py-2.5 text-sm text-fg ring-1 ring-inset ring-border-subtle " +
  "focus:outline-none focus:ring-2 focus:ring-accent transition-shadow";

const INPUT_DISABLED =
  "mt-1.5 w-full rounded-lg bg-subtle px-3 py-2.5 text-sm text-fg-muted ring-1 ring-inset ring-border-subtle cursor-not-allowed";

export function render(target) {
  target.innerHTML = `
    <section class="px-4 pt-6 pb-12">
      <form class="space-y-4" data-form-account novalidate>

        <div>
          ${label("acc-nume", "Nume")}
          <input id="acc-nume" name="nume" type="text" autocomplete="family-name"
                 value="${USER.nume}" class="${INPUT_BASE}" />
        </div>

        <div>
          ${label("acc-prenume", "Prenume")}
          <input id="acc-prenume" name="prenume" type="text" autocomplete="given-name"
                 value="${USER.prenume}" class="${INPUT_BASE}" />
        </div>

        <div>
          ${label("acc-email", "Email")}
          <input id="acc-email" name="email" type="email" autocomplete="email" disabled
                 value="${USER.email}" class="${INPUT_DISABLED}" />
        </div>

        <div>
          ${label("acc-telefon", "Telefon")}
          <input id="acc-telefon" name="telefon" type="tel" autocomplete="tel" disabled
                 value="${USER.telefon}" class="${INPUT_DISABLED}" />
        </div>

        <div>
          ${label("acc-lang", "Limba")}
          <div class="relative mt-1.5">
            <select id="acc-lang" name="limba"
                    class="w-full cursor-pointer appearance-none rounded-lg bg-surface px-3 py-2.5 pr-9 text-sm font-medium text-fg ring-1 ring-inset ring-border-subtle focus:outline-none focus:ring-2 focus:ring-accent transition-shadow">
              <option value="ro" ${USER.limba === "ro" ? "selected" : ""}>Română (RO)</option>
              <option value="en" ${USER.limba === "en" ? "selected" : ""}>English (EN)</option>
            </select>
            <i data-lucide="chevron-down"
               class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"></i>
          </div>
        </div>

      </form>
    </section>
  `;
}
