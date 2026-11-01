/**
 * useLocalStorage.js
 *
 * A custom React hook that works exactly like useState, but also
 * saves the value to LocalStorage so it survives page refreshes.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('focusnest_tasks', []);
 *
 * - Reading: on first render, it loads the value from LocalStorage.
 *   If nothing is stored yet, it uses the defaultValue you provide.
 * - Writing: calling setTasks(newValue) updates both React state
 *   AND saves the new value to LocalStorage automatically.
 */

import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultValue) {
  // Initialize state by reading from LocalStorage.
  // The function form of useState runs only once on the first render —
  // this avoids re-reading LocalStorage on every re-render.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If nothing is stored, return the default value
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (_err) {
      // If parsing fails (e.g. corrupted data), fall back to the default.
      // We intentionally do not log here to keep the console clean.
      return defaultValue;
    }
  });

  // Whenever storedValue changes, save it to LocalStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (_err) {
      // Write failed (e.g. storage quota exceeded) — silently ignore.
      // The app continues to work in memory; data just won't persist.
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
