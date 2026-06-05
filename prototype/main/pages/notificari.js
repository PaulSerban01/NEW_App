import { selectControl } from "../lib/select.js";

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

function selectField({ id, label, options }) {
  return `
    <div>
      <label for="${id}" class="${LABEL_CLS}">${label}</label>
      ${selectControl({ id, options })}
    </div>
  `;
}

function toggleRow({ id, title, subtitle, on, last }) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  return `
    <div class="${lastCls} flex items-center justify-between gap-3 px-4 py-3.5">
      <div class="min-w-0 flex-1">
        <p class="text-base font-medium text-fg">${title}</p>
        <p class="mt-0.5 text-sm text-fg-muted">${subtitle}</p>
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
    <section class="flex min-h-full flex-col">
      <div class="flex-1 space-y-6 p-4">

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
