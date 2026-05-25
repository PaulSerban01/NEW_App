import * as pages from "../pages/index.js";

const subscribers = new Set();

export function parseHash(hash = location.hash) {
  const cleaned = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!cleaned) return { page: "home", id: null, raw: "#/" };
  const [page, id = null] = cleaned.split("/");
  return { page, id, raw: `#/${cleaned}` };
}

export function navigate(path) {
  const target = path.startsWith("#") ? path : `#/${path.replace(/^\/+/, "")}`;
  if (location.hash === target) return;
  location.hash = target;
}

export function getRoute() {
  return parseHash();
}

export function onRouteChange(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

function emit(route) {
  subscribers.forEach(cb => { try { cb(route); } catch (e) { console.error(e); } });
  document.dispatchEvent(new CustomEvent("rurio:route-change", { detail: route }));
}

function ensurePage(id) {
  return pages[id] || pages.home;
}

function applyShellState(route) {
  const root = document.documentElement;
  root.setAttribute("data-route-page", route.page);
  if (route.id) root.setAttribute("data-route-id", route.id);
  else root.removeAttribute("data-route-id");
  root.toggleAttribute("data-has-detail", !!route.id);
}

function refreshIcons() {
  document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
}

function render(route) {
  const listPane = document.getElementById("pane-list");
  const detailPane = document.getElementById("pane-detail");
  if (!listPane || !detailPane) return;

  // Per-page header rows are transient — clear them before the next page renders.
  // A page that wants header rows re-populates #header-extras inside its render().
  const headerExtras = document.getElementById("header-extras");
  if (headerExtras) headerExtras.innerHTML = "";

  const mod = ensurePage(route.page);

  if (typeof mod.render === "function") {
    mod.render(listPane, { route });
  }

  detailPane.innerHTML = "";
  if (route.id && typeof mod.renderDetail === "function") {
    mod.renderDetail(route.id, detailPane, { route });
  } else if (typeof mod.renderDetailEmpty === "function") {
    mod.renderDetailEmpty(detailPane, { route });
  }

  applyShellState(route);
  refreshIcons();
  emit(route);
}

export function start() {
  window.addEventListener("hashchange", () => render(parseHash()));
  if (!location.hash || location.hash === "#") {
    history.replaceState(null, "", "#/");
  }
  render(parseHash());
}
