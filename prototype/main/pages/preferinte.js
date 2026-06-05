import { selectControl } from "../lib/select.js";

export const meta = {
  id: "preferinte",
  label: "Preferințe",
  icon: "sliders-horizontal",
  showInNav: false,
};

const LABEL_CLS = "block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle";

/* Each select's `options` is filled in once the lists are provided. */
const FIELDS = [
  { id: "pref-suprafata",   label: "Suprafață",   options: [
    { value: "ha",   label: "Hectare (HA)" },
    { value: "acri", label: "Acri" },
  ] },
  { id: "pref-greutate",    label: "Greutate",    options: [
    { value: "kg", label: "Kilograme (KG)" },
    { value: "t",  label: "Tone (T)" },
  ] },
  { id: "pref-moneda",      label: "Monedă",      options: [
    { value: "ron", label: "RON" },
    { value: "eur", label: "EUR" },
  ] },
  { id: "pref-format-data", label: "Format dată", options: [
    { value: "dd-mm-yyyy", label: "DD/MM/YYYY" },
    { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
  ] },
  { id: "pref-fus-orar",    label: "Fus orar",    options: [
    { value: "bucharest", label: "Bucharest" },
  ] },
  { id: "pref-harta",       label: "Hartă",       options: [
    { value: "satelit", label: "Satelit" },
    { value: "teren",   label: "Teren" },
  ] },
];

function selectField({ id, label, options }) {
  return `
    <div>
      <label for="${id}" class="${LABEL_CLS}">${label}</label>
      ${selectControl({ id, options })}
    </div>
  `;
}

export function render(target) {
  target.innerHTML = `
    <section class="flex min-h-full flex-col">
      <div class="flex-1 space-y-4 p-4">
        ${FIELDS.map(selectField).join("")}
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

  target.querySelector("[data-save]")?.addEventListener("click", () => {
    location.hash = "#/utilizator";
  });
}
