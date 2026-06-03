export const meta = {
  id: "utilizator",
  label: "Profil Utilizator",
  icon: "circle-user",
  showInNav: false,
};

/* Each row navigates to its own page; sub-pages render their own forms with
   sticky Save + Cancel action bars and return here via the Cancel/back button. */
const SECTIONS = [
  { id: "profileinfo",     icon: "user-round",         label: "Date cont" },
  { id: "securitate",      icon: "shield-check",       label: "Securitate" },
  { id: "notificari",      icon: "bell",               label: "Notificări" },
  { id: "preferinte",      icon: "sliders-horizontal", label: "Preferințe" },
  { id: "dispozitive",     icon: "smartphone",         label: "Dispozitive" },
  { id: "activitate-cont", icon: "activity",           label: "Activitate cont" },
];

function navRow({ id, icon, label }, isLast) {
  const lastCls = isLast ? "" : "border-b border-border-subtle";
  return `
    <a href="#/${id}" class="${lastCls} flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-subtle">
      <i data-lucide="${icon}" class="size-5 shrink-0 text-fg-muted"></i>
      <span class="flex-1 text-sm font-medium text-fg">${label}</span>
      <i data-lucide="chevron-right" class="size-4 shrink-0 text-fg-subtle"></i>
    </a>
  `;
}

export function render(target) {
  const rows = SECTIONS.map((s, i) => navRow(s, i === SECTIONS.length - 1)).join("");
  target.innerHTML = `
    <section class="px-4 pt-6 pb-12">
      <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
        ${rows}
      </div>
    </section>
  `;

  document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
}
