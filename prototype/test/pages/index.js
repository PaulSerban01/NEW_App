import * as home from "./home.js";
import * as parcels from "./parcels.js";
import * as map from "./map.js";
import * as profile from "./profile.js";
import * as profileinfo from "./profileinfo.js";
import * as securitate from "./securitate.js";
import * as notificari from "./notificari.js";
import { stubPage } from "./_stub.js";

/* Profile sub-pages (reached from the profile hub; hidden from side nav). */
const workspace   = stubPage({ id: "workspace",   label: "Workspace",         icon: "briefcase" });
const preferinte  = stubPage({ id: "preferinte",  label: "Preferințe",        icon: "sliders-horizontal" });
const dispozitive = stubPage({ id: "dispozitive", label: "Dispozitive",       icon: "smartphone" });
const activitate  = stubPage({ id: "activitate",  label: "Activitate",        icon: "activity" });
const termeni     = stubPage({ id: "termeni",     label: "Termeni și condiții", icon: "file-text" });

/* Side-nav stub pages (iconify-colored). */
const dashadmin = stubPage({ id: "dashadmin", label: "Dash admin",         iconify: "fluent-emoji-flat:bar-chart",        showInNav: true });
const dashops   = stubPage({ id: "dashops",   label: "Dash ops",           iconify: "fluent-emoji-flat:chart-increasing", showInNav: true });
const operator  = stubPage({ id: "operator",  label: "Ecran operator",     iconify: "fluent-emoji-flat:man-technologist", showInNav: true });
const firme     = stubPage({ id: "firme",     label: "Configurator firme", iconify: "fluent-emoji-flat:office-building",  showInNav: true });
const echipa    = stubPage({ id: "echipa",    label: "Echipa",             iconify: "fluent-emoji-flat:people-hugging",   showInNav: true });
const stocuri   = stubPage({ id: "stocuri",   label: "Stocuri",            iconify: "fluent-emoji-flat:package",          showInNav: true });
const utilaje   = stubPage({ id: "utilaje",   label: "Utilaje",            iconify: "fluent-emoji-flat:tractor",          showInNav: true });
const jurnal    = stubPage({ id: "jurnal",    label: "Jurnal de câmp",     iconify: "fluent-emoji-flat:notebook",         showInNav: true });
const arenda    = stubPage({ id: "arenda",    label: "Arenda",             iconify: "fluent-emoji-flat:page-with-curl",   showInNav: true });
const mesagerie = stubPage({ id: "mesagerie", label: "Mesagerie",          iconify: "fluent-emoji-flat:speech-balloon",   showInNav: true });
const galerie   = stubPage({ id: "galerie",   label: "Galerie foto",       iconify: "fluent-emoji-flat:framed-picture",   showInNav: true });

/* Bottom-nav stubs (hidden from the side nav). */
const planning = stubPage({ id: "planning", label: "Planifică",      icon: "notebook-pen" });
const quick    = stubPage({ id: "quick",    label: "Acțiune rapidă", iconify: "fluent-emoji-flat:high-voltage" });
const messages = stubPage({ id: "messages", label: "Mesaje",         icon: "message-circle" });
const camera   = stubPage({ id: "camera",   label: "Cameră",         icon: "camera" });

export {
  home, parcels, map, profile,
  dashadmin, dashops, operator, firme, echipa, stocuri, utilaje,
  jurnal, arenda, mesagerie, galerie,
  planning, quick, messages, camera,
  profileinfo, securitate, notificari, preferinte, dispozitive, activitate, termeni, workspace,
};

/* ──────────────────────────────────────────────────────────────
   Convert a page module → flat nav-item shape consumed by <rurio-nav>.
   ────────────────────────────────────────────────────────────── */
function toNavItem(p, { disabled = false } = {}) {
  return {
    id: p.meta.id,
    label: p.meta.label,
    icon: p.meta.icon,
    iconify: p.meta.iconify,
    href: `#/${p.meta.id === "home" ? "" : p.meta.id}`,
    disabled,
  };
}

/* Grouped side-nav: title is optional; missing title = ungrouped section
   (rendered between dividers but without a heading).
   For now only Acasă / Lista terenuri / Harta terenuri are live;
   every other entry is rendered as a disabled placeholder. */
export const navGroups = [
  { items: [toNavItem(home)] },
  { title: "PRINCIPAL", items: [
    toNavItem(dashadmin, { disabled: true }),
    toNavItem(dashops,   { disabled: true }),
    toNavItem(operator,  { disabled: true }),
    toNavItem(firme,     { disabled: true }),
  ]},
  { title: "RESURSE", items: [
    toNavItem(echipa,  { disabled: true }),
    toNavItem(stocuri, { disabled: true }),
    toNavItem(utilaje, { disabled: true }),
    toNavItem(parcels),
    toNavItem(map),
  ]},
  { title: "ORGANIZARE", items: [
    toNavItem(jurnal, { disabled: true }),
    toNavItem(arenda, { disabled: true }),
  ]},
  { title: "MEDIA", items: [
    toNavItem(mesagerie, { disabled: true }),
    toNavItem(galerie,   { disabled: true }),
  ]},
  { items: [toNavItem(profile, { disabled: true })] },
];

/* Flat list — kept for any consumer that wants every nav-visible item. */
export const navItems = navGroups.flatMap(g => g.items);
