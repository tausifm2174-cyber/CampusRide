import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Manages state synchronized with browser localStorage with safe serialization
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - Fallback value if storage is empty or corrupted
 */
export function useLocalStorage(key, initialValue) {
  // Read initial data from localStorage
  const [value, setValue] = useState(() => {
    try {
      const storedItem = localStorage.getItem(key);
      if (storedItem !== null) {
        return JSON.parse(storedItem);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  // Store updated values in localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
