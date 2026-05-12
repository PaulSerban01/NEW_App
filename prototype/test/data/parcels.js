/**
 * Hardcoded sample data for the Parcels list page.
 * Each parcel has: identity, agricultural details, geographic placement, status.
 * Romanian copy to match the prototype's domain language.
 */
export const parcels = [
  { id: "12n", name: "Parcela 12 Nord",   apia: "BF 152 Parcela 17a", pl: "PL ferma1", crop: "Grâu de toamnă",   soi: "Genesi",        norm: "60k/ha",   area: 67.8, status: "active", region: "Nord",   sownAt: "2025-10-12", property: "Propriu",     works: ["Arat", "Semănat", "Erbicidat"] },
  { id: "7w",  name: "Parcela 7 Vest",    apia: "BF 089 Parcela 12b", pl: "PL ferma1", crop: "Porumb",           soi: "Pioneer P9415", norm: "75k/ha",   area: 42.3, status: "active", region: "Vest",   sownAt: "2026-04-08", property: "Arendat",     works: ["Arat", "Semănat"] },
  { id: "3s",  name: "Parcela 3 Sud",     apia: "BF 047 Parcela 03",  pl: "PL ferma2", crop: "Floarea-soarelui", soi: "ES Bella",      norm: "65k/ha",   area: 28.5, status: "active", region: "Sud",    sownAt: "2026-04-15", property: "Propriu",     works: ["Semănat", "Fertilizat"] },
  { id: "15e", name: "Parcela 15 Est",    apia: "BF 201 Parcela 08c", pl: "PL ferma2", crop: "Rapiță",           soi: "Architect",     norm: "50k/ha",   area: 31.2, status: "active", region: "Est",    sownAt: "2025-09-04", property: "Concesionat", works: ["Arat", "Semănat", "Erbicidat", "Recoltat"] },
  { id: "22c", name: "Parcela 22 Centru", apia: "BF 318 Parcela 22",  pl: "PL ferma1", crop: "Orz",              soi: "Cassia",        norm: "320kg/ha", area: 19.6, status: "active", region: "Centru", sownAt: "2025-10-20", property: "Propriu",     works: ["Arat", "Semănat"] },
  { id: "9n",  name: "Parcela 9 Nord",    apia: "BF 134 Parcela 09",  pl: "PL ferma1", crop: "Grâu de toamnă",   soi: "Avenue",        norm: "65k/ha",   area: 55.0, status: "active", region: "Nord",   sownAt: "2025-10-10", property: "Propriu",     works: ["Arat", "Semănat", "Fertilizat"] },
  { id: "4w",  name: "Parcela 4 Vest",    apia: "BF 064 Parcela 04",  pl: "PL ferma2", crop: "Sole în repaus",   soi: "—",             norm: "—",        area:  8.4, status: "fallow", region: "Vest",   sownAt: null,         property: "Arendat",     works: [] },
  { id: "18s", name: "Parcela 18 Sud",    apia: "BF 256 Parcela 18a", pl: "PL ferma2", crop: "Floarea-soarelui", soi: "Subaru HTS",    norm: "60k/ha",   area: 22.1, status: "active", region: "Sud",    sownAt: "2026-04-12", property: "Concesionat", works: ["Semănat"] },
];

export function getParcel(id) {
  return parcels.find(p => p.id === id) || null;
}

export const STATUS_LABELS = {
  active: "În cultură",
  fallow: "În repaus",
};

// Filter category options surfaced in the toolbar.
export const FILTER_CATEGORIES = {
  culture: {
    label: "Cultură",
    options: ["Grâu de toamnă", "Porumb", "Floarea-soarelui", "Rapiță", "Orz"],
  },
  property: {
    label: "Proprietate",
    options: ["Propriu", "Arendat", "Concesionat"],
  },
  works: {
    label: "Lucrări agricole",
    options: ["Arat", "Semănat", "Erbicidat", "Fertilizat", "Recoltat"],
  },
};

/* =====================================================================
   Synthetic geography — same grid layout used by parcels list (thumbnails)
   and the map page (polygons). Centered on the Banat plain (south-west
   Romania). Replace with real coords when wiring real data.
   ===================================================================== */
export const BASE_LAT = 45.7;
export const BASE_LNG = 21.5;

export function parcelCenter(idx) {
  const cols = 4;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return {
    lat: BASE_LAT + (row - 1) * 0.014,
    lng: BASE_LNG + (col - 1.5) * 0.020,
  };
}

export function parcelPolygon(p, idx) {
  const { lat, lng } = parcelCenter(idx);
  const sideKm = Math.max(0.18, Math.sqrt(p.area * 0.01)); // 1 ha = 0.01 km²
  const dLat = sideKm / 111;
  const dLng = sideKm / (111 * Math.cos(lat * Math.PI / 180));
  return [
    [lat - dLat / 2, lng - dLng / 2],
    [lat - dLat / 2, lng + dLng / 2],
    [lat + dLat / 2, lng + dLng / 2],
    [lat + dLat / 2, lng - dLng / 2],
  ];
}

/* Esri World Imagery tile URL centered on the parcel.
   Direct <img src> — no library needed. */
export function parcelTileUrl(idx, zoom = 16) {
  const { lat, lng } = parcelCenter(idx);
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const radLat = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(radLat) + 1 / Math.cos(radLat)) / Math.PI) / 2) * n
  );
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
}
