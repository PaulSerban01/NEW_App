/**
 * Culture → color attribution system.
 * Each cultivated plant gets a distinctive color used for:
 *   – the vertical stripe on the parcel list cards
 *   – the polygon fill on the map (could be wired later)
 *   – chips, legends, charts, …
 *
 * Colors are hex literals (applied via inline `style`) so they don't need
 * Tailwind class registration. Pick once per crop and reuse everywhere.
 */
export const CULTURES = {
  "Grâu de toamnă":   { color: "#B45309", label: "Grâu de toamnă"   }, // amber-700
  "Porumb":           { color: "#CA8A04", label: "Porumb"           }, // yellow-600
  "Floarea-soarelui": { color: "#EA580C", label: "Floarea-soarelui" }, // orange-600
  "Rapiță":           { color: "#FACC15", label: "Rapiță"           }, // yellow-400
  "Orz":              { color: "#65A30D", label: "Orz"              }, // lime-600
  "Soia":             { color: "#16A34A", label: "Soia"             }, // green-600
  "Lucernă":          { color: "#0D9488", label: "Lucernă"          }, // teal-600
  "Sole în repaus":   { color: "#A8A29E", label: "Sole în repaus"   }, // stone-400
};

const FALLBACK = "#94A3B8"; // slate-400

export function cultureColor(crop) {
  return CULTURES[crop]?.color || FALLBACK;
}

export function cultureLabel(crop) {
  return CULTURES[crop]?.label || crop;
}
