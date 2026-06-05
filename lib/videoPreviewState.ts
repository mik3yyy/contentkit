// Module-level mute preference shared across all video preview cards.
// Persists for the lifetime of the page; resets on hard reload.
let _globalMuted = true

export function getGlobalMuted(): boolean  { return _globalMuted }
export function setGlobalMuted(v: boolean) { _globalMuted = v }
