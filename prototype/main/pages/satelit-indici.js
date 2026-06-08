import { getParcel } from "../data/parcels.js";

// Spectral index layers toggled on the displayed image. NDVI is the default.
const INDICES = ["NDVI", "NDRE", "LAI"];

// Display metadata for each index card (array order = render order). The actual
// values are per-capture and live in SATELLITE_IMAGES[*].indices.
const INDEX_META = [
  { key: "NDVI", name: "NDVI (Normalized Difference Vegetation Index)", icon: "bar-chart-2", iconColor: "text-teal-600",   valColor: "text-teal-700",   bar: "bg-emerald-500", scale: 1 },
  { key: "NDMI", name: "NDMI (Normalized Difference Moisture Index)",   icon: "droplets",    iconColor: "text-sky-600",    valColor: "text-sky-700",    bar: "bg-sky-500",     scale: 1 },
  { key: "EVI",  name: "EVI (Enhanced Vegetation Index)",               icon: "leaf",        iconColor: "text-amber-600",  valColor: "text-amber-700",  bar: "bg-amber-500",   scale: 1 },
  { key: "LAI",  name: "LAI (Leaf Area Index)",                         icon: "layers",      iconColor: "text-lime-600",   valColor: "text-lime-700",   bar: "bg-lime-500",    scale: 5 },
  { key: "NDRE", name: "NDRE (Normalized Difference Red Edge)",         icon: "sprout",      iconColor: "text-green-600",  valColor: "text-green-700",  bar: "bg-green-500",   scale: 1 },
  { key: "SAVI", name: "SAVI (Soil Adjusted Vegetation Index)",         icon: "mountain",    iconColor: "text-orange-600", valColor: "text-orange-700", bar: "bg-orange-500",  scale: 1 },
];

// Bar fill % for an index value (LAI runs 0–5, the others 0–1).
function indexPct(meta, v) {
  return Math.max(4, Math.min(100, Math.round((v / meta.scale) * 100)));
}

// Format an index value (LAI keeps one decimal, the rest two).
function fmtIndex(key, v) {
  return key === "LAI" ? v.toFixed(1) : v.toFixed(2);
}

// Short status line derived from the index value.
function indexDesc(key, v) {
  if (key === "NDMI") {
    if (v >= 0.30) return "Umiditate adecvată a vegetației";
    if (v >= 0.15) return "Deficit hidric moderat — recomandat irigare";
    return "Deficit hidric sever — irigare urgentă";
  }
  if (key === "LAI") {
    if (v >= 3.0) return "Suprafață foliară densă";
    if (v >= 1.5) return "Suprafață foliară în dezvoltare";
    return "Suprafață foliară redusă";
  }
  if (v >= 0.60) return "Vegetație sănătoasă și bine dezvoltată";
  if (v >= 0.45) return "Vegetație în dezvoltare normală";
  return "Vegetație timpurie sau rară";
}

// Sample satellite captures, most recent first — index 0 is the default
// selection. Each capture carries its own indices + AI interpretation so
// selecting a date in the carousel updates the whole page. `monthIdx` points
// into MONTHLY_NDVI so the evolution chart can end on the selected reading.
const SATELLITE_IMAGES = [
  {
    date: "06 Apr 2026", sat: "Sentinel-2", monthIdx: 11,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/35134/22547",
    indices: { NDVI: 0.72, NDMI: 0.18, EVI: 0.64, LAI: 3.2, NDRE: 0.41, SAVI: 0.58 },
    ai: {
      summary: "Cultura de rapiță de toamnă prezintă o stare generală bună. Indicele NDVI a crescut constant din ianuarie (<strong>+0.37</strong>), indicând o dezvoltare normală.",
      warning: "NDMI scăzut (0.18) sugerează un deficit hidric moderat. Recomandăm monitorizarea precipitațiilor din următoarele 5 zile. Dacă nu plouă, luați în considerare irigarea — cultura este în stadiu critic de dezvoltare.",
      note: "Zona de Nord-Est a parcelei prezintă valori NDVI mai scăzute (0.45) — posibilă problemă de drenaj sau compactare sol. Recomandăm inspecție teren.",
    },
  },
  {
    date: "30 Mar 2026", sat: "Sentinel-2", monthIdx: 10,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/35134/22548",
    indices: { NDVI: 0.68, NDMI: 0.22, EVI: 0.60, LAI: 2.9, NDRE: 0.38, SAVI: 0.55 },
    ai: {
      summary: "Dezvoltare viguroasă, NDVI 0.68 în creștere față de săptămâna precedentă. Cultura intră în plină vegetație de primăvară.",
      note: "Rezerva de umiditate (NDMI 0.22) este încă suficientă, dar în scădere — urmăriți evoluția în următoarele captări.",
    },
  },
  {
    date: "23 Mar 2026", sat: "Sentinel-2", monthIdx: 10,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/35134/22549",
    indices: { NDVI: 0.62, NDMI: 0.25, EVI: 0.55, LAI: 2.5, NDRE: 0.34, SAVI: 0.50 },
    ai: {
      summary: "NDVI 0.62 — vegetația se dezvoltă constant. Acoperirea foliară (LAI 2.5) confirmă o cultură uniformă pe cea mai mare parte a parcelei.",
      note: "Indicii de vigoare se încadrează în limitele normale pentru acest stadiu fenologic.",
    },
  },
  {
    date: "16 Mar 2026", sat: "Landsat-9", monthIdx: 10,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/35134/22550",
    indices: { NDVI: 0.55, NDMI: 0.29, EVI: 0.48, LAI: 2.1, NDRE: 0.30, SAVI: 0.45 },
    ai: {
      summary: "Vegetația iese din repaus, NDVI 0.55. Reluarea creșterii este vizibilă pe întreaga suprafață.",
      note: "Umiditate bună (NDMI 0.29) — condiții favorabile pentru pornirea în vegetație.",
    },
  },
  {
    date: "09 Mar 2026", sat: "Sentinel-2", monthIdx: 10,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/35134/22551",
    indices: { NDVI: 0.48, NDMI: 0.33, EVI: 0.42, LAI: 1.7, NDRE: 0.26, SAVI: 0.39 },
    ai: {
      summary: "Început de primăvară, NDVI 0.48 în ușoară creștere. Cultura reia activitatea după iarnă.",
      note: "Rezervă de umiditate ridicată (NDMI 0.33) în urma precipitațiilor de iarnă.",
    },
  },
  {
    date: "02 Mar 2026", sat: "Landsat-9", monthIdx: 10,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/35134/22552",
    indices: { NDVI: 0.40, NDMI: 0.36, EVI: 0.35, LAI: 1.4, NDRE: 0.22, SAVI: 0.33 },
    ai: {
      summary: "Ieșire din repausul de iarnă, NDVI 0.40 — valori specifice începutului de sezon. Vegetația este încă rară.",
      note: "Umiditatea solului este la nivel maxim sezonier (NDMI 0.36); fără risc hidric momentan.",
    },
  },
];

// Monthly NDVI history (oldest → newest, 12 months). The evolution chart ends on
// the month of the selected capture (using that capture's NDVI), then slices the
// most recent N months based on the range dropdown.
const MONTHLY_NDVI = [
  { label: "Mai", ndvi: 0.30 },
  { label: "Iun", ndvi: 0.25 },
  { label: "Iul", ndvi: 0.20 },
  { label: "Aug", ndvi: 0.35 },
  { label: "Sep", ndvi: 0.42 },
  { label: "Oct", ndvi: 0.50 },
  { label: "Noi", ndvi: 0.46 },
  { label: "Dec", ndvi: 0.40 },
  { label: "Ian", ndvi: 0.48 },
  { label: "Feb", ndvi: 0.55 },
  { label: "Mar", ndvi: 0.62 },
  { label: "Apr", ndvi: 0.72 },
];

// NDVI series ending on the selected capture's month/reading.
function ndviSeries(imgIdx) {
  const img = SATELLITE_IMAGES[imgIdx];
  const head = MONTHLY_NDVI.slice(0, img.monthIdx);
  return [...head, { label: MONTHLY_NDVI[img.monthIdx].label, ndvi: img.indices.NDVI }];
}

export function render(target, ctx) {
  const parcelId = ctx?.route?.id;
  const p = getParcel(parcelId);
  if (!p) {
    target.innerHTML = `
      <div class="flex h-full items-center justify-center p-8 text-center">
        <div class="max-w-xs">
          <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <i data-lucide="search-x" class="size-6"></i>
          </div>
          <p class="mt-3 text-base font-medium text-slate-700">Parcela nu a fost găsită</p>
          <a href="#/parcels" class="mt-3 inline-block text-base font-semibold text-teal-700 hover:underline">Înapoi la listă</a>
        </div>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="bg-slate-50 pb-28">

      <!-- HEADER with back button -->
      <div class="border-b border-slate-200 bg-white p-4 flex items-center gap-3">
        <button type="button" data-back-btn aria-label="Înapoi"
                class="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
          <i data-lucide="arrow-left" class="size-5"></i>
        </button>
        <div class="flex-1">
          <h1 class="text-xl font-bold text-slate-800">Satelit & Indici</h1>
          <p class="text-sm text-slate-500">${p.name}</p>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="p-4 space-y-4">

      <!-- ISTORIC IMAGINI - Card buttons with selected image display -->
      <div class="rounded-xl bg-white p-4 shadow-sm">
        <h2 class="text-base font-bold text-slate-800 mb-3">Istoric imagini</h2>

        <!-- Image display (tap to zoom) -->
        <button type="button" data-image-zoom-trigger aria-label="Mărire imagine"
                class="mb-4 block w-full text-left rounded-lg overflow-hidden bg-slate-200 relative cursor-pointer group" data-image-display>
          <img data-display-img src="${SATELLITE_IMAGES[0].url}" alt="Imagine satelit" class="w-full h-64 object-cover" />

          <!-- Index toggle buttons -->
          <div class="absolute top-3 right-3 flex gap-2" data-index-row>
            ${INDICES.map((ix, i) => `
              <rurio-badge selectable data-index-btn="${ix}" value="${ix}" ${i === 0 ? "selected" : ""}>${ix}</rurio-badge>
            `).join("")}
          </div>

          <!-- Image info overlay -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div class="flex items-end justify-between gap-2">
              <div class="text-white text-base">
                <div class="font-semibold" data-display-date>${SATELLITE_IMAGES[0].date}</div>
                <div class="text-sm text-gray-200" data-display-sat>${SATELLITE_IMAGES[0].sat}</div>
              </div>
              <div class="flex items-center gap-1 text-sm text-gray-200">
                <i data-lucide="search-plus" class="size-3"></i>
                <span>Apasă pentru mărire</span>
              </div>
            </div>
          </div>

          <!-- Hover hint overlay -->
          <span class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <i data-lucide="maximize-2" class="size-8 text-white"></i>
          </span>
        </button>

        <!-- Image cards carousel -->
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex gap-2" data-images-carousel>
            ${SATELLITE_IMAGES.map((img, idx) => `
              <button type="button" data-image-card="${idx}" class="shrink-0 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition ${idx === 0 ? 'ring-2 ring-teal-700' : ''}">
                <div class="text-sm font-semibold text-slate-800">${img.date}</div>
                <div class="text-sm text-slate-600">NDVI: ${fmtIndex("NDVI", img.indices.NDVI)}</div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>

        <!-- AI INTERPRETATION — collapsible; reveals the ConnAgri AI summary on tap -->
        <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-violet-200">
          <button type="button" data-ai-toggle aria-expanded="false" aria-controls="ai-interpretation"
                  class="flex w-full items-center justify-between gap-2">
            <span class="flex items-center gap-2">
              <span class="flex size-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                <i data-lucide="sparkles" class="size-4"></i>
              </span>
              <span class="text-base font-bold text-slate-800">Interpretare AI</span>
            </span>
            <i data-lucide="chevron-down" data-ai-chev class="size-4 text-slate-500 transition-transform"></i>
          </button>

          <div id="ai-interpretation" data-ai-content hidden class="mt-3 space-y-3">
            <div class="flex items-center gap-1.5 text-sm font-semibold text-violet-700">
              <i data-lucide="bot" class="size-3.5"></i>
              ConnAgri AI
            </div>
            <div data-ai-body class="space-y-3"></div>
          </div>
        </div>

        <!-- INDEX CARDS — rendered per selected capture -->
        <div data-indices class="space-y-4"></div>

        <!-- Historical Chart — range selectable via dropdown -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between gap-2">
            <h3 class="text-base font-bold text-slate-800">Evoluție NDVI</h3>
            <select data-ndvi-range aria-label="Interval evoluție NDVI"
                    class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600">
              <option value="3">3 luni</option>
              <option value="6" selected>6 luni</option>
              <option value="9">9 luni</option>
              <option value="12">12 luni</option>
            </select>
          </div>
          <div data-ndvi-chart class="flex items-end gap-1 justify-between h-24"></div>
          <div data-ndvi-labels class="mt-2 flex justify-between gap-1 text-[10px] text-slate-500"></div>
        </div>

      </div>

    </div>
  `;

  /* ── Image Viewer Modal ────────────────────────────────────────────── */
  const imageModal = document.createElement("div");
  imageModal.id = "image-viewer-modal";
  imageModal.setAttribute("role", "dialog");
  imageModal.setAttribute("aria-modal", "true");
  imageModal.setAttribute("aria-hidden", "true");
  imageModal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/80 opacity-0 pointer-events-none transition-opacity duration-200";
  imageModal.innerHTML = `
    <div class="relative w-11/12 max-h-[90vh] flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between gap-3 bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div data-image-info class="text-base font-medium text-white">Image</div>
        <button type="button" data-modal-close aria-label="Închide"
                class="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition">
          <i data-lucide="x" class="size-5"></i>
        </button>
      </div>

      <!-- Image container with zoom -->
      <div class="flex-1 overflow-hidden flex items-center justify-center bg-black">
        <div data-zoom-container class="relative w-full h-full flex items-center justify-center" style="touch-action: none;">
          <img data-zoom-image src="" alt="Satellite image" class="max-w-full max-h-full object-contain transition-transform" style="transform-origin: center;" />
        </div>
      </div>

      <!-- Footer with controls -->
      <div class="flex items-center justify-between gap-2 bg-slate-800 px-4 py-3 border-t border-slate-700">
        <div class="flex items-center gap-2">
          <button type="button" data-zoom-out aria-label="Dezoomează"
                  class="flex size-10 items-center justify-center rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white transition">
            <i data-lucide="minus" class="size-5"></i>
          </button>
          <div data-zoom-level class="min-w-12 text-center text-base font-medium text-slate-300 bg-slate-700 rounded px-2 py-1">100%</div>
          <button type="button" data-zoom-in aria-label="Zoom în"
                  class="flex size-10 items-center justify-center rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white transition">
            <i data-lucide="plus" class="size-5"></i>
          </button>
        </div>
        <button type="button" data-download-btn aria-label="Descarcă"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-600 transition text-base font-medium">
          <i data-lucide="download" class="size-4"></i>
          <span>Descarcă</span>
        </button>
      </div>
    </div>
  `;
  target.appendChild(imageModal);

  /* ── Bindings ────────────────────────────────────────────── */
  target.querySelector("[data-back-btn]")
    ?.addEventListener("click", () => window.history.back());

  // Currently selected history image (index 0 = most recent) and spectral index.
  let selectedImageIdx = 0;
  let selectedIndex = INDICES[0];

  const displayImg = target.querySelector("[data-display-img]");
  const displayDate = target.querySelector("[data-display-date]");
  const displaySat = target.querySelector("[data-display-sat]");
  const cards = target.querySelectorAll("[data-image-card]");
  const indexBtns = target.querySelectorAll("[data-index-btn]");
  const indicesWrap = target.querySelector("[data-indices]");
  const aiBody = target.querySelector("[data-ai-body]");
  const ndviChart = target.querySelector("[data-ndvi-chart]");
  const ndviLabels = target.querySelector("[data-ndvi-labels]");
  const ndviRange = target.querySelector("[data-ndvi-range]");

  // Render the six index cards for the selected capture.
  function renderIndices(idx) {
    const img = SATELLITE_IMAGES[idx];
    indicesWrap.innerHTML = INDEX_META.map(m => {
      const v = img.indices[m.key];
      return `
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="${m.icon}" class="size-5 ${m.iconColor}"></i>
              <h2 class="text-base font-bold text-slate-800">${m.name}</h2>
            </div>
            <span class="text-3xl font-bold ${m.valColor}">${fmtIndex(m.key, v)}</span>
          </div>
          <p class="mt-2 text-sm text-slate-600">Ultima actualizare: ${img.date}</p>
          <div class="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full ${m.bar}" style="width: ${indexPct(m, v)}%;"></div>
          </div>
          <p class="mt-2 text-sm text-slate-600">${indexDesc(m.key, v)}</p>
        </div>
      `;
    }).join("");
  }

  // Render the AI interpretation body for the selected capture.
  function renderAI(idx) {
    const ai = SATELLITE_IMAGES[idx].ai;
    aiBody.innerHTML = `
      <p class="text-base leading-relaxed text-slate-700">${ai.summary}</p>
      ${ai.warning ? `
        <div class="flex items-start gap-2 rounded-lg bg-amber-50 p-3 ring-1 ring-inset ring-amber-200">
          <i data-lucide="triangle-alert" class="mt-0.5 size-4 shrink-0 text-amber-500"></i>
          <p class="text-base leading-relaxed text-slate-700"><strong>Atenție:</strong> ${ai.warning}</p>
        </div>` : ""}
      ${ai.note ? `<p class="text-base leading-relaxed text-slate-700">${ai.note}</p>` : ""}
    `;
  }

  // NDVI evolution chart — most recent N months of the selected capture's
  // series; the newest bar (the selection) is teal.
  function renderNdviChart(months) {
    const data = ndviSeries(selectedImageIdx).slice(-months);
    ndviChart.innerHTML = data.map((m, i) => {
      const isLast = i === data.length - 1;
      return `<div class="flex-1 rounded-t ${isLast ? "bg-teal-500" : "bg-slate-300"}"
                   style="height: ${Math.round(m.ndvi * 100)}%;" title="${m.label}: ${m.ndvi}"></div>`;
    }).join("");
    ndviLabels.innerHTML = data.map(m => `<span class="flex-1 text-center">${m.label}</span>`).join("");
  }

  // History carousel — select a date card → swap the displayed image + meta,
  // move the highlight ring, and refresh the whole page (AI, indices, chart) to
  // reflect that capture. First card stays preselected on load.
  function selectImage(idx) {
    const img = SATELLITE_IMAGES[idx];
    if (!img) return;
    selectedImageIdx = idx;
    displayImg.src = img.url;
    displayDate.textContent = img.date;
    displaySat.textContent = img.sat;
    cards.forEach(card => {
      const active = Number(card.dataset.imageCard) === idx;
      card.classList.toggle("ring-2", active);
      card.classList.toggle("ring-teal-700", active);
    });
    renderIndices(idx);
    renderAI(idx);
    renderNdviChart(Number(ndviRange.value));
    // New <i data-lucide> nodes were injected — re-run the icon factory.
    document.dispatchEvent(new CustomEvent("rurio:icons-refresh"));
  }

  cards.forEach(card => {
    card.addEventListener("click", () => selectImage(Number(card.dataset.imageCard)));
  });

  // Spectral index toggle (NDVI / NDRE / LAI). Lives inside the zoom-trigger
  // button, so stop propagation to avoid opening the viewer.
  function selectSpectralIndex(ix) {
    selectedIndex = ix;
    indexBtns.forEach(btn => {
      if (btn.dataset.indexBtn === ix) btn.setAttribute("selected", "");
      else btn.removeAttribute("selected");
    });
  }

  // Index badges sit on top of the image-zoom button — stop their clicks/keys
  // from bubbling to it, and react to the badge's toggle event.
  const indexRow = target.querySelector("[data-index-row]");
  ["click", "keydown"].forEach(evt =>
    indexRow?.addEventListener(evt, (e) => e.stopPropagation()));
  indexRow?.addEventListener("rurio:badge-toggle", (e) => {
    const badge = e.target.closest("[data-index-btn]");
    if (!badge) return;
    selectSpectralIndex(badge.dataset.indexBtn);
  });

  // Tap the displayed image → open the zoom viewer on the current selection.
  target.querySelector("[data-image-zoom-trigger]")
    ?.addEventListener("click", () => openImageViewer(target, selectedImageIdx));

  // AI interpretation — collapse/expand; chevron rotates to signal state.
  const aiToggle = target.querySelector("[data-ai-toggle]");
  const aiContent = target.querySelector("[data-ai-content]");
  const aiChev = target.querySelector("[data-ai-chev]");
  aiToggle?.addEventListener("click", () => {
    const willOpen = aiContent.hasAttribute("hidden");
    aiContent.toggleAttribute("hidden", !willOpen);
    aiChev?.classList.toggle("rotate-180", willOpen);
    aiToggle.setAttribute("aria-expanded", String(willOpen));
  });

  // Re-render only the chart when the range changes (keeps current capture).
  ndviRange?.addEventListener("change", () => renderNdviChart(Number(ndviRange.value)));

  // Initial paint of the page for the default (most recent) capture.
  selectImage(0);

  // Image viewer close
  imageModal.querySelector("[data-modal-close]")?.addEventListener("click", () => closeImageViewer(target));
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) closeImageViewer(target);
  });

  // Zoom controls
  let currentZoom = 100;
  const zoomImage = imageModal.querySelector("[data-zoom-image]");
  const zoomLevel = imageModal.querySelector("[data-zoom-level]");

  function updateZoom() {
    zoomImage.style.transform = `scale(${currentZoom / 100})`;
    zoomLevel.textContent = `${currentZoom}%`;
  }

  imageModal.querySelector("[data-zoom-in]")?.addEventListener("click", () => {
    if (currentZoom < 300) {
      currentZoom = Math.min(300, currentZoom + 25);
      updateZoom();
    }
  });

  imageModal.querySelector("[data-zoom-out]")?.addEventListener("click", () => {
    if (currentZoom > 50) {
      currentZoom = Math.max(50, currentZoom - 25);
      updateZoom();
    }
  });

  // Touch zoom (pinch)
  let lastDistance = 0;
  imageModal.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastDistance > 0) {
        const delta = distance - lastDistance;
        if (Math.abs(delta) > 5) {
          currentZoom = Math.max(50, Math.min(300, currentZoom + delta / 10));
          updateZoom();
        }
      }
      lastDistance = distance;
    }
  }, { passive: false });

  imageModal.addEventListener("touchend", () => {
    lastDistance = 0;
  });

  // Download
  imageModal.querySelector("[data-download-btn]")?.addEventListener("click", () => {
    const img = imageModal.querySelector("[data-zoom-image]");
    const link = document.createElement("a");
    link.href = img.src;
    link.download = `satellite-${new Date().toISOString().split("T")[0]}.png`;
    link.click();
  });

  function openImageViewer(root, idx) {
    const img = SATELLITE_IMAGES[idx];
    if (!img) return;
    currentZoom = 100;
    zoomImage.src = img.url;
    imageModal.querySelector("[data-image-info]").textContent =
      `${img.date} • ${img.sat} • ${selectedIndex}: ${fmtIndex(selectedIndex, img.indices[selectedIndex])}`;
    updateZoom();
    imageModal.setAttribute("aria-hidden", "false");
    imageModal.classList.remove("opacity-0", "pointer-events-none");
  }

  function closeImageViewer(root) {
    currentZoom = 100;
    imageModal.setAttribute("aria-hidden", "true");
    imageModal.classList.add("opacity-0", "pointer-events-none");
  }
}

export function renderDetailEmpty(target) {
  target.innerHTML = "";
}
