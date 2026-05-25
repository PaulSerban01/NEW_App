import {
  setPalette, setMode, setFontScale,
  getPalette, getMode, getFontScale,
} from "../lib/theme-engine.js";

export const meta = {
  id: "profile",
  label: "Profil",
  icon: "user",
  showInNav: true,
};

/* Hardcoded user (prototype). */
const USER = {
  name: "Ion Popescu",
  email: "ion.popescu@rurio.eu",
  workspace: "Agro Vest Holdings",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=192&h=192&q=80",
};

const PALETTES = [
  { id: "teal",      label: "Teal" },
  { id: "palette-2", label: "Mov" },
  { id: "palette-3", label: "Portocaliu" },
];
const MODES = [
  { id: "light", label: "Luminos",  icon: "sun" },
  { id: "dark",  label: "Întunecat", icon: "moon" },
];
const FONT_STEPS = [
  { id: "small",  label: "A−", value: 0.875 },
  { id: "medium", label: "A",  value: 1 },
  { id: "large",  label: "A+", value: 1.125 },
];

function fontKey(scale) {
  return scale < 1 ? "small" : scale > 1 ? "large" : "medium";
}

/* ────────────── markup helpers ────────────── */

function navRow({ icon, label, href, disabled = false, last = false }) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  if (disabled) {
    return `
      <div class="${lastCls} flex items-center gap-3 px-4 py-3.5 opacity-50 cursor-not-allowed select-none">
        <i data-lucide="${icon}" class="size-5 shrink-0 text-fg-muted"></i>
        <span class="flex-1 text-sm text-fg">${label}</span>
      </div>
    `;
  }
  return `
    <a href="${href}" class="${lastCls} flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-subtle">
      <i data-lucide="${icon}" class="size-5 shrink-0 text-fg-muted"></i>
      <span class="flex-1 text-sm font-medium text-fg">${label}</span>
      <i data-lucide="chevron-right" class="size-4 shrink-0 text-fg-subtle"></i>
    </a>
  `;
}

function controlRow({ label, control, last = false }) {
  const lastCls = last ? "" : "border-b border-border-subtle";
  return `
    <div class="${lastCls} flex items-center justify-between gap-3 px-4 py-3">
      <span class="text-sm font-medium text-fg">${label}</span>
      <div class="shrink-0">${control}</div>
    </div>
  `;
}

function section(title, contentHtml) {
  return `
    <div class="mt-5">
      ${title
        ? `<h2 class="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">${title}</h2>`
        : ""}
      <div class="mx-4 overflow-hidden rounded-2xl bg-surface ring-1 ring-border-subtle">
        ${contentHtml}
      </div>
    </div>
  `;
}

/* Tailwind Plus button-group (segmented control), brand-themed. */
function btnGroupItem(name, opt, activeId, position) {
  const isActive = opt.id === activeId;
  const radius = position === "first" ? "rounded-l-lg" : position === "last" ? "rounded-r-lg" : "";
  const offset = position === "first" ? "" : "-ml-px";
  const state = isActive
    ? "bg-accent text-accent-fg ring-accent-border z-10"
    : "bg-surface text-fg hover:bg-subtle ring-border-subtle";
  return `
    <button type="button"
            aria-pressed="${isActive}"
            data-${name}="${opt.id}"
            class="relative ${offset} inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${radius} ${state}">
      ${opt.icon ? `<i data-lucide="${opt.icon}" class="size-4"></i>` : ""}
      <span>${opt.label}</span>
    </button>
  `;
}

function buttonGroup(name, options, activeId) {
  return `
    <span class="isolate inline-flex rounded-lg shadow-xs" data-control="${name}">
      ${options.map((opt, i) => {
        const position = i === 0 ? "first" : i === options.length - 1 ? "last" : "middle";
        return btnGroupItem(name, opt, activeId, position);
      }).join("")}
    </span>
  `;
}

/* Custom palette dropdown (listbox pattern) — replaces the button-group for Paletă culori. */
function paletteSelect(activeId) {
  const current = PALETTES.find(p => p.id === activeId) || PALETTES[0];
  return `
    <div class="relative" data-control="palette">
      <button type="button"
              data-palette-trigger
              aria-haspopup="listbox"
              aria-expanded="false"
              class="flex h-9 cursor-pointer items-center gap-1.5 rounded-md bg-surface px-3 text-sm font-medium text-fg ring-1 ring-inset ring-border-subtle hover:bg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors">
        <span data-palette-label>${current.label}</span>
        <i data-lucide="chevron-down" data-palette-chev class="size-4 text-fg-muted transition-transform"></i>
      </button>
      <ul role="listbox" data-palette-list hidden
          class="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border-subtle">
        ${PALETTES.map(p => {
          const isSel = p.id === activeId;
          const cls = isSel
            ? "bg-accent text-accent-fg font-semibold hover:bg-accent-hover"
            : "text-fg font-normal hover:bg-accent hover:text-accent-fg";
          return `
            <li role="option" data-palette-option data-value="${p.id}" aria-selected="${isSel}"
                class="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${cls}">
              <span>${p.label}</span>
              ${isSel ? `<i data-lucide="check" class="size-4 shrink-0"></i>` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    </div>
  `;
}

/* ────────────── render ────────────── */
export function render(target) {
  const palette = getPalette();
  const mode = getMode();
  const font = fontKey(getFontScale());

  // CONT section items
  const contItems = [
    { icon: "user-round",          label: "Date cont",   href: "#/profileinfo" },
    { icon: "briefcase",           label: "Workspace",   href: "#/workspace"   },
    { icon: "shield-check",        label: "Securitate",  href: "#/securitate"  },
    { icon: "bell",                label: "Notificări",  href: "#/notificari"  },
    { icon: "sliders-horizontal",  label: "Preferințe",  href: "#/preferinte"  },
    { icon: "smartphone",          label: "Dispozitive", href: "#/dispozitive" },
    { icon: "activity",            label: "Activitate",  href: "#/activitate"  },
  ];
  const contHtml = contItems.map((it, i) => navRow({ ...it, last: i === contItems.length - 1 })).join("");

  // Setări aplicație (only disabled "Setări")
  const setariHtml = navRow({ icon: "settings", label: "Setări", disabled: true, last: true });

  // Accesibilitate
  const accesibilitateHtml = [
    controlRow({ label: "Paletă culori", control: paletteSelect(palette) }),
    controlRow({ label: "Mod afișare",   control: buttonGroup("mode", MODES, mode) }),
    controlRow({ label: "Mărime text",   control: buttonGroup("font", FONT_STEPS, font), last: true }),
  ].join("");

  // Legal
  const legalHtml = navRow({ icon: "file-text", label: "Termeni și condiții", href: "#/termeni", last: true });

  target.innerHTML = `
    <section class="pb-12">

      <!-- Header: avatar + name + email -->
      <header class="flex items-center gap-4 px-4 pt-6 pb-2">
        <div class="size-16 shrink-0 overflow-hidden rounded-full bg-accent ring-2 ring-surface">
          <img src="${USER.avatar}" alt="" loading="lazy" class="size-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-lg font-semibold text-fg">${USER.name}</p>
          <p class="truncate text-sm text-fg-muted">${USER.email}</p>
          <p class="truncate text-xs text-fg-subtle">${USER.workspace}</p>
        </div>
      </header>

      ${section("CONT", contHtml)}
      ${section("Setări aplicație", setariHtml)}
      ${section("ACCESIBILITATE", accesibilitateHtml)}
      ${section("LEGAL", legalHtml)}

      <!-- Exit buttons -->
      <div class="mt-8 space-y-3 px-4">
        <button type="button" data-exit-account
                class="w-full rounded-lg bg-danger px-4 py-3 text-center text-sm font-semibold text-danger-fg transition-colors hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
          Ieșire din cont
        </button>
        <a href="../../index.html" data-exit-prototype
           class="block w-full rounded-lg bg-surface px-4 py-3 text-center no-underline ring-1 ring-inset ring-border-default hover:bg-subtle">
          <span class="block text-sm font-semibold text-danger-text">Ieșire din prototype</span>
          <span class="mt-0.5 block text-[10px] font-normal text-fg-subtle">Doar pentru prototip</span>
        </a>
      </div>

    </section>
  `;

  bind(target);
}

/* ────────────── interactions ────────────── */

function bind(target) {
  // Mode segmented control
  const modeCtrl = target.querySelector('[data-control="mode"]');
  modeCtrl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mode]");
    if (!btn) return;
    setMode(btn.dataset.mode);
    refreshGroupActive(modeCtrl, "mode", btn.dataset.mode);
  });

  // Font segmented control
  const fontCtrl = target.querySelector('[data-control="font"]');
  fontCtrl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-font]");
    if (!btn) return;
    setFontScale(btn.dataset.font);
    refreshGroupActive(fontCtrl, "font", btn.dataset.font);
  });

  // Palette listbox dropdown
  bindPaletteSelect(target);

  // Exit buttons
  target.querySelector("[data-exit-account]")?.addEventListener("click", () => {
    alert("Ieșire din cont");
  });
  // "Iesire din prototype" is a plain anchor (../../index.html — the launcher
  // with prototype-main / prototype-test / design-system links). No JS needed.
}

function refreshGroupActive(scope, name, activeId) {
  scope.querySelectorAll(`[data-${name}]`).forEach(b => {
    const on = b.dataset[name] === activeId;
    b.setAttribute("aria-pressed", on);
    b.classList.toggle("bg-accent", on);
    b.classList.toggle("text-accent-fg", on);
    b.classList.toggle("ring-accent-border", on);
    b.classList.toggle("z-10", on);
    b.classList.toggle("bg-surface", !on);
    b.classList.toggle("text-fg", !on);
    b.classList.toggle("ring-border-subtle", !on);
    b.classList.toggle("hover:bg-subtle", !on);
  });
}

function bindPaletteSelect(target) {
  const wrap = target.querySelector('[data-control="palette"]');
  if (!wrap) return;
  const trigger = wrap.querySelector("[data-palette-trigger]");
  const list = wrap.querySelector("[data-palette-list]");
  const label = wrap.querySelector("[data-palette-label]");
  const chev = wrap.querySelector("[data-palette-chev]");

  function close() {
    if (list.hidden) return;
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    chev?.classList.remove("rotate-180");
  }
  function open() {
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    chev?.classList.add("rotate-180");
  }
  function pick(id) {
    setPalette(id);
    const p = PALETTES.find(x => x.id === id);
    if (label && p) label.textContent = p.label;
    list.querySelectorAll("[data-palette-option]").forEach(li => {
      const isSel = li.dataset.value === id;
      li.setAttribute("aria-selected", String(isSel));
      li.className = `flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
        isSel
          ? "bg-accent text-accent-fg font-semibold hover:bg-accent-hover"
          : "text-fg font-normal hover:bg-accent hover:text-accent-fg"
      }`;
      // Toggle the trailing check icon
      const check = li.querySelector('[data-lucide="check"], svg.lucide-check');
      if (isSel && !check) {
        li.insertAdjacentHTML("beforeend", `<i data-lucide="check" class="size-4 shrink-0"></i>`);
      } else if (!isSel && check) {
        check.remove();
      }
    });
    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
    close();
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (list.hidden) open(); else close();
  });
  list.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-palette-option]");
    if (!opt) return;
    e.stopPropagation();
    pick(opt.dataset.value);
  });

  const onDocClick = (e) => {
    if (!wrap.isConnected) { document.removeEventListener("click", onDocClick); return; }
    if (!wrap.contains(e.target)) close();
  };
  const onKey = (e) => {
    if (!wrap.isConnected) { document.removeEventListener("keydown", onKey); return; }
    if (e.key === "Escape" && !list.hidden) close();
  };
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
}
