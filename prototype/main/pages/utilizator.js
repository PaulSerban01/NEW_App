import * as profileinfo from "./profileinfo.js";
import * as securitate from "./securitate.js";
import * as notificari from "./notificari.js";
import * as preferinte from "./preferinte.js";
import * as dispozitive from "./dispozitive.js";
import * as activitate from "./activitate.js";

export const meta = {
  id: "utilizator",
  label: "Profil Utilizator",
  icon: "circle-user",
  showInNav: false,
};

/* Each entry is a collapsible section. `render` (when set) fills the panel from
   the matching page module — content and its bindings carry over intact. Entries
   without `render` are still placeholder stubs. */
const SECTIONS = [
  { id: "profileinfo", icon: "user-round",         label: "Date cont",   render: profileinfo.render },
  { id: "securitate",  icon: "shield-check",       label: "Securitate",  render: securitate.render  },
  { id: "notificari",  icon: "bell",               label: "Notificări",  render: notificari.render  },
  { id: "preferinte",  icon: "sliders-horizontal", label: "Preferințe",  render: preferinte.render },
  { id: "dispozitive", icon: "smartphone",         label: "Dispozitive", render: dispozitive.render },
  { id: "activitate",  icon: "activity",           label: "Activitate",  render: activitate.render },
];

const STUB_PLACEHOLDER = `
  <p class="px-4 py-6 text-sm text-fg-muted">
    Conținut în pregătire. Va fi adăugat în fazele următoare.
  </p>
`;

/* One native <details> collapsible — keyboard-accessible, no JS toggle needed. */
function collapsible({ id, icon, label }, isLast, isOpen) {
  return `
    <details class="group ${isLast ? "" : "border-b border-border-subtle"}"${isOpen ? " open" : ""}>
      <summary class="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 transition-colors hover:bg-subtle [&::-webkit-details-marker]:hidden">
        <i data-lucide="${icon}" class="size-5 shrink-0 text-fg-muted"></i>
        <span class="flex-1 text-sm font-medium text-fg">${label}</span>
        <i data-lucide="chevron-down" class="size-4 shrink-0 text-fg-subtle transition-transform group-open:rotate-180"></i>
      </summary>
      <div id="panel-${id}" class="border-t border-border-subtle"></div>
    </details>
  `;
}

export function render(target) {
  const cardsHtml = SECTIONS.map((s, i) => collapsible(s, i === SECTIONS.length - 1, i === 0)).join("");
  target.innerHTML = `
    <section class="px-4 pt-6 pb-12">
      <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
        ${cardsHtml}
      </div>
    </section>
  `;

  // Populate each panel — collapsed <details> still keep their content in the DOM,
  // so all panels are filled up front (and their icons hydrate via icons-refresh).
  SECTIONS.forEach(s => {
    const panel = target.querySelector(`#panel-${s.id}`);
    if (!panel) return;
    if (s.render) s.render(panel);
    else panel.innerHTML = STUB_PLACEHOLDER;
  });

  document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
}
