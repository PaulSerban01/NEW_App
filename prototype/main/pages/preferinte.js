export const meta = {
  id: "preferinte",
  label: "Preferințe",
  icon: "sliders-horizontal",
  showInNav: false,
};

const LABEL_CLS = "block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle";
const SELECT_CLS =
  "w-full cursor-pointer appearance-none rounded-lg bg-surface px-3 py-2.5 pr-9 text-sm font-medium text-fg " +
  "ring-1 ring-inset ring-border-subtle focus:outline-none focus:ring-2 focus:ring-accent transition-shadow";

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
  const opts = options.length
    ? options.map(o => `<option value="${o.value}">${o.label}</option>`).join("")
    : `<option>—</option>`;
  return `
    <div>
      <label for="${id}" class="${LABEL_CLS}">${label}</label>
      <div class="relative mt-1.5">
        <select id="${id}" class="${SELECT_CLS}">
          ${opts}
        </select>
        <i data-lucide="chevron-down"
           class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"></i>
      </div>
    </div>
  `;
}

export function render(target) {
  target.innerHTML = `
    <section class="space-y-4 p-4">
      ${FIELDS.map(selectField).join("")}
    </section>
  `;
}
