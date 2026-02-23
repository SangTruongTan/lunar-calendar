/**
 * dateChange.js — Lightweight pub/sub for midnight date transitions.
 *
 * The clock module calls `checkDateChange()` every tick.
 * When the calendar date rolls over (or jumps after a tab switch),
 * all registered listeners are invoked so that every date-dependent
 * widget re-renders with the new day.
 *
 * This avoids each module running its own timer and keeps
 * the date-change detection in a single, testable place.
 */

/** @type {string} YYYY-MM-DD of the last rendered date */
let lastDate = formatDate(new Date());

/** @type {Array<() => void>} */
const listeners = [];

/**
 * Format a Date to a comparable YYYY-MM-DD string.
 * @param {Date} d
 * @returns {string}
 */
function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Register a callback to run whenever the date changes.
 * Returns an unsubscribe function.
 * @param {() => void} fn
 * @returns {() => void}
 */
export function onDateChange(fn) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

/**
 * Called by the clock on every tick (and on visibility restore).
 * Compares today's date string against the last-known date.
 * If different, fires all listeners and updates the stored date.
 */
export function checkDateChange() {
  const today = formatDate(new Date());
  if (today !== lastDate) {
    lastDate = today;
    for (const fn of listeners) {
      try {
        fn();
      } catch (e) {
        console.error("[dateChange] listener error:", e);
      }
    }
  }
}
