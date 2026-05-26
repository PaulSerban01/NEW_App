import * as home from "./home.js";
import * as parcels from "./parcels.js";
import * as map from "./map.js";
import * as profile from "./profile.js";
import * as profileinfo from "./profileinfo.js";
import * as securitate from "./securitate.js";
import * as notificari from "./notificari.js";
import * as preferinte from "./preferinte.js";
import * as dispozitive from "./dispozitive.js";
import * as activitate from "./activitate.js";
import * as activitateCont from "./activitate-cont.js";
import * as utilizator from "./utilizator.js";
import { stubPage } from "./_stub.js";

/* Profile sub-pages (reached from the profile hub; hidden from side nav). */
const termeni     = stubPage({ id: "termeni",     label: "Termeni și condiții", icon: "file-text" });

/* Side-nav stub pages. */
const dashadmin = stubPage({ id: "dashadmin", label: "Dash admin",         icon: "bar-chart-3",     showInNav: true });
const dashops   = stubPage({ id: "dashops",   label: "Dash ops",           icon: "trending-up",     showInNav: true });
const operator  = stubPage({ id: "operator",  label: "Ecran operator",     icon: "wrench",          showInNav: true });
const firme     = stubPage({ id: "firme",     label: "Configurator firme", icon: "building-2",      showInNav: true });
const echipa    = stubPage({ id: "echipa",    label: "Echipa",             icon: "users",           showInNav: true });
const stocuri   = stubPage({ id: "stocuri",   label: "Stocuri",            icon: "package",         showInNav: true });
const utilaje   = stubPage({ id: "utilaje",   label: "Utilaje",            icon: "tractor",         showInNav: true });
const jurnal    = stubPage({ id: "jurnal",    label: "Jurnal de câmp",     icon: "wheat",           showInNav: true });
const arenda    = stubPage({ id: "arenda",    label: "Arenda",             icon: "file-text",       showInNav: true });
const mesagerie = stubPage({ id: "mesagerie", label: "Mesagerie",          icon: "messages-square", showInNav: true });
const galerie   = stubPage({ id: "galerie",   label: "Galerie foto",       icon: "images",          showInNav: true });

/* Bottom-nav stubs (hidden from the side nav). */
const planning = stubPage({ id: "planning", label: "Planifică",      icon: "notebook-pen" });
const quick    = stubPage({ id: "quick",    label: "Acțiune rapidă", icon: "zap" });
const messages = stubPage({ id: "messages", label: "Mesaje",         icon: "message-circle" });
const camera   = stubPage({ id: "camera",   label: "Cameră",         icon: "camera" });

export {
  home, parcels, map, profile,
  dashadmin, dashops, operator, firme, echipa, stocuri, utilaje,
  jurnal, arenda, mesagerie, galerie,
  planning, quick, messages, camera,
  profileinfo, securitate, notificari, preferinte, dispozitive, activitate, activitateCont, termeni, utilizator,
};

/* ──────────────────────────────────────────────────────────────
   Convert a page module → flat nav-item shape consumed by <rurio-nav>.
   ────────────────────────────────────────────────────────────── */
function toNavItem(p, { disabled = false } = {}) {
  return {
    id: p.meta.id,
    label: p.meta.label,
    icon: p.meta.icon,
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
    toNavItem(activitate),
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
  { title: "CONT", items: [toNavItem(profile)] },
];

/* Flat list — kept for any consumer that wants every nav-visible item. */
export const navItems = navGroups.flatMap(g => g.items);
