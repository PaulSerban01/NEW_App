const LUCIDE_SRC = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";

let lucideReady;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function ensureLucide() {
  if (!lucideReady) {
    lucideReady = loadScript(LUCIDE_SRC).then(() => window.lucide);
  }
  return lucideReady;
}

export async function refreshLucide(root = document) {
  const lucide = await ensureLucide();
  if (lucide && typeof lucide.createIcons === "function") {
    lucide.createIcons({ nameAttr: "data-lucide", attrs: {}, ...(root === document ? {} : { root }) });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => refreshLucide());
} else {
  refreshLucide();
}

document.addEventListener("rurio:icons-refresh", () => refreshLucide());
