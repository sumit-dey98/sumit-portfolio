/**
 * Shared debug flag.
 *
 * Enabled when the `VITE_DEBUG` env var is truthy at build time, OR toggled at
 * runtime from the console:
 *
 *   __debug.on()        // enable
 *   __debug.off()       // disable
 *   __debug.toggle()    // flip
 *   __debug.enabled     // read current state
 *
 * Runtime changes persist to localStorage so they survive reloads.
 */
const LS_KEY = 'debug-mode';

function envDebug() {
  const v = import.meta.env?.VITE_DEBUG;
  return v === '1' || v === 'true' || v === true;
}

function lsDebug() {
  try {
    return localStorage.getItem(LS_KEY) === '1';
  } catch {
    return false;
  }
}

let _enabled = envDebug() || lsDebug();

export function isDebug() {
  return _enabled;
}

function setDebug(on) {
  _enabled = !!on;
  try {
    if (_enabled) localStorage.setItem(LS_KEY, '1');
    else localStorage.removeItem(LS_KEY);
  } catch { /* ignore */ }
  return _enabled;
}

// Expose a console handle for runtime toggling.
if (typeof window !== 'undefined') {
  window.__debug = {
    on: () => setDebug(true),
    off: () => setDebug(false),
    toggle: () => setDebug(!_enabled),
    get enabled() { return _enabled; },
  };
}
