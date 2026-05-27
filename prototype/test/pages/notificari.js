export const meta = {
  id: "notificari",
  label: "Notificări",
  icon: "bell",
  showInNav: false,
};

const ALERTS = [
  { id: "meteo",      title: "Alerte meteo",      subtitle: "Avertizări vreme severă",     on: true  },
  { id: "boli",       title: "Alerte boli",       subtitle: "Detecție boli culturi",       on: true  },
  { id: "scadente",   title: "Alerte scadențe",   subtitle: "Documente și plăți",          on: true  },
  { id: "lucrari",    title: "Alerte lucrări",    subtitle: "Lucrări agricole programate", on: false },
  { id: "satelitare", title: "Alerte satelitare", subtitle: "Imagini noi disponibile",     on: true  },
  { id: "stocuri",    title: "Alerte stocuri",    subtitle: "Nivelul minim atins",         on: false },
];

const LABEL_CLS  = "block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle";
const SELECT_CLS =
  "w-full cursor-pointer appearance-none rounded-lg bg-surface px-3 py-2.5 pr-9 text-sm font-medium text-fg " +
  "ring-1 ring-inset ring-border-subtle focus:outline-none focus:ring-2 focus:ring-accent transition-shadow";

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

function toggleRow({ id, title, subtitle, on, last }) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  return `
    <div class="${lastCls} flex items-center justify-between gap-3 px-4 py-3.5">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-fg">${title}</p>
        <p class="mt-0.5 text-xs text-fg-muted">${subtitle}</p>
      </div>
      <label class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center" aria-label="${title}">
        <input type="checkbox" data-alert="${id}" class="peer sr-only" ${on ? "checked" : ""} />
        <span class="absolute inset-0 rounded-full bg-subtle ring-1 ring-inset ring-border-subtle transition-colors peer-checked:bg-accent peer-checked:ring-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas"></span>
        <span class="pointer-events-none absolute left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></span>
      </label>
    </div>
  `;
}

export function render(target) {
  target.innerHTML = `
    <section class="space-y-6 p-4">

      ${selectField({
        id: "notif-canal",
        label: "Canal",
        options: [
          { value: "push",  label: "Push"  },
          { value: "email", label: "Email" },
          { value: "sms",   label: "SMS"   },
        ],
      })}

      ${selectField({
        id: "notif-freq",
        label: "Frecvență",
        options: [
          { value: "instant", label: "Instant"       },
          { value: "digest",  label: "Digest zilnic" },
        ],
      })}

      <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
        ${ALERTS.map((a, i) => toggleRow({ ...a, last: i === ALERTS.length - 1 })).join("")}
      </div>

    </section>
  `;
}
