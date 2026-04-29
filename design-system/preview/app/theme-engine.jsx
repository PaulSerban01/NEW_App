/* global React */
// Theme engine — reads/writes data-palette + data-mode on <html>,
// persists to localStorage, exposes useTheme().

const { createContext, useContext, useState, useEffect, useCallback } = React;

const PALETTES = [
  { id: 'teal',      name: 'Teal',      swatch: '#00686A', swatchDark: '#23F7DD', role: 'Main' },
  { id: 'palette-2', name: 'Palette 2', swatch: '#5A35A0', swatchDark: '#A98DE3', role: 'Test' },
  { id: 'palette-3', name: 'Palette 3', swatch: '#B93D14', swatchDark: '#FF8D66', role: 'Test' },
];

const ThemeCtx = createContext(null);

function readInitial() {
  try {
    const p = localStorage.getItem('rurio-palette') || 'teal';
    const m = localStorage.getItem('rurio-mode') || 'light';
    return { palette: p, mode: m };
  } catch { return { palette: 'teal', mode: 'light' }; }
}

function ThemeProvider({ children }) {
  const [{ palette, mode }, setState] = useState(readInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
    document.documentElement.setAttribute('data-mode', mode);
    try {
      localStorage.setItem('rurio-palette', palette);
      localStorage.setItem('rurio-mode', mode);
    } catch {}
  }, [palette, mode]);

  const setPalette = useCallback((p) => setState(s => ({ ...s, palette: p })), []);
  const setMode    = useCallback((m) => setState(s => ({ ...s, mode: m })), []);
  const toggleMode = useCallback(() => setState(s => ({ ...s, mode: s.mode === 'light' ? 'dark' : 'light' })), []);

  return (
    <ThemeCtx.Provider value={{ palette, mode, setPalette, setMode, toggleMode, palettes: PALETTES }}>
      {children}
    </ThemeCtx.Provider>
  );
}

function useTheme() { return useContext(ThemeCtx); }

Object.assign(window, { ThemeProvider, useTheme, PALETTES });
