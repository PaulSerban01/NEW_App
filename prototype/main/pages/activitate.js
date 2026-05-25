export const meta = {
  id: "activitate",
  label: "Activitate",
  icon: "activity",
  showInNav: false,
};

/* Recent account activity (prototype data). */
const ACTIVITY = [
  { icon: "log-in",             title: "Autentificare reușită",           meta: "Azi, 09:24 · iPhone 14 Pro" },
  { icon: "sliders-horizontal", title: "Preferințe actualizate",          meta: "Ieri, 18:02" },
  { icon: "map-pin-plus",       title: "Teren adăugat — Parcela 12 Nord", meta: "20 mai 2026, 14:30" },
  { icon: "shield-check",       title: "Parolă schimbată",                meta: "15 mai 2026, 11:10" },
  { icon: "download",           title: "Export terenuri (PDF)",           meta: "12 mai 2026, 16:45" },
  { icon: "log-in",             title: "Autentificare reușită",           meta: "10 mai 2026, 08:05 · MacBook Pro" },
];

function activityRow({ icon, title, meta }, last) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  return `
    <div class="${lastCls} flex items-start gap-3 px-4 py-3.5">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-subtle text-fg-muted">
        <i data-lucide="${icon}" class="size-4"></i>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-fg">${title}</p>
        <p class="mt-0.5 text-xs text-fg-muted">${meta}</p>
      </div>
    </div>
  `;
}

export function render(target) {
  target.innerHTML = `
    <section class="p-4">
      <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
        ${ACTIVITY.map((a, i) => activityRow(a, i === ACTIVITY.length - 1)).join("")}
      </div>
    </section>
  `;
}
