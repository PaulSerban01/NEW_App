import { selectControl } from "../lib/select.js";

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
    <section class="flex min-h-full flex-col">
      <form class="flex-1 space-y-4 p-4" data-form-account novalidate>

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
          ${selectControl({
            id: "acc-lang",
            name: "limba",
            value: USER.limba,
            options: [
              { value: "ro", label: "Română (RO)" },
              { value: "en", label: "English (EN)" },
            ],
          })}
        </div>

      </form>

      <div class="sticky bottom-0 z-10 flex gap-3 border-t border-border-subtle bg-canvas px-4 py-3">
        <a href="#/utilizator"
           class="flex-1 rounded-lg bg-surface px-4 py-3 text-center text-sm font-semibold text-fg ring-1 ring-inset ring-border-default hover:bg-subtle">
          Anulează
        </a>
        <button type="button" data-save
                class="flex-1 rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-fg hover:bg-accent-hover">
          Salvează
        </button>
      </div>
    </section>
  `;

  target.querySelector("[data-save]")?.addEventListener("click", () => {
    location.hash = "#/utilizator";
  });
}
