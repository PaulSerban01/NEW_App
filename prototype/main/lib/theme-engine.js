const KEYS = {
  palette: "rurio-palette",
  mode: "rurio-mode",
  fontScale: "rurio-font-scale",
};

const PALETTES = ["teal", "palette-2", "palette-3"];
const MODES = ["light", "dark"];
const FONT_SCALES = { small: 0.875, medium: 1, large: 1.125 };

const root = document.documentElement;

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try { localStorage.setItem(key, String(value)); } catch {}
}

function detectMode() {
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function emit(detail) {
  document.dispatchEvent(new CustomEvent("rurio:theme-change", { detail }));
}

export function getPalette() { return root.getAttribute("data-palette") || "teal"; }
export function getMode() { return root.getAttribute("data-mode") || "light"; }
export function getFontScale() { return parseFloat(root.style.getPropertyValue("--font-scale")) || 1; }

export function setPalette(id) {
  if (!PALETTES.includes(id)) return;
  root.setAttribute("data-palette", id);
  write(KEYS.palette, id);
  emit({ palette: id });
}

export function setMode(id) {
  if (!MODES.includes(id)) return;
  root.setAttribute("data-mode", id);
  write(KEYS.mode, id);
  emit({ mode: id });
}

export function setFontScale(value) {
  const n = typeof value === "string" ? FONT_SCALES[value] : value;
  if (typeof n !== "number" || !isFinite(n)) return;
  root.style.setProperty("--font-scale", String(n));
  write(KEYS.fontScale, n);
  emit({ fontScale: n });
}

export function init() {
  const palette = read(KEYS.palette, "teal");
  const mode = read(KEYS.mode, detectMode());
  const fontScale = parseFloat(read(KEYS.fontScale, "1")) || 1;

  root.setAttribute("data-palette", PALETTES.includes(palette) ? palette : "teal");
  root.setAttribute("data-mode", MODES.includes(mode) ? mode : "light");
  root.style.setProperty("--font-scale", String(fontScale));
}

export const palettes = PALETTES;
export const modes = MODES;
export const fontScales = FONT_SCALES;

init();
