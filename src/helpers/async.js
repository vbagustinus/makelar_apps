// mmkvStorage.js
import { createMMKV } from 'react-native-mmkv';

export const storage = new createMMKV();

export const zustandMMKVStorage = {
  getItem: key => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key, value) => {
    console.log('Item set:', key, value);

    storage.set(key, value);
  },
  removeItem: key => {
    storage.remove(key);
  },
};

/**
 * Get a string value by key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {string | null} - The value associated with the key, or null if not found.
 */
const getString = key => {
  try {
    return storage.getString(key) || null;
  } catch (err) {
    console.error(`Error getting string with key "${key}":`, err);
    throw err;
  }
};

/**
 * Get a boolean value by key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {boolean | null} - The value associated with the key, or null if not found.
 */
const getBoolean = key => {
  try {
    const value = storage.getBoolean(key);
    return value === undefined ? null : value; // MMKV returns undefined for missing keys
  } catch (err) {
    console.error(`Error getting boolean with key "${key}":`, err);
    throw err;
  }
};

/**
 * Get a number value by key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {number | null} - The value associated with the key, or null if not found.
 */
const getNumber = key => {
  try {
    const value = storage.getNumber(key);
    return value === undefined ? null : value; // MMKV returns undefined for missing keys
  } catch (err) {
    console.error(`Error getting number with key "${key}":`, err);
    throw err;
  }
};

/**
 * Set an item with key and value.
 * @param {string} key - The key to store the value under.
 * @param {string | number | boolean} value - The value to store.
 */
const setItem = (key, value) => {
  try {
    if (typeof value === 'string') {
      storage.set(key, value);
    } else if (typeof value === 'number') {
      storage.set(key, value);
    } else if (typeof value === 'boolean') {
      storage.set(key, value);
    } else {
      throw new Error(
        `Invalid value type: ${typeof value}. MMKV supports only string, number, or boolean.`,
      );
    }
  } catch (err) {
    console.error(
      `Error setting item with key "${key}" and value "${value}":`,
      err,
    );
    throw err;
  }
};

/**
 * Get all keys stored in MMKV.
 * @returns {string[]} - An array of all keys in storage.
 */
const getAllKeys = () => {
  try {
    return storage.getAllKeys();
  } catch (err) {
    console.error('Error getting all keys:', err);
    throw err;
  }
};

/**
 * Remove an item by key.
 * @param {string} key - The key of the item to remove.
 */
const removeItem = key => {
  try {
    storage.remove(key);
  } catch (err) {
    console.error(`Error removing item with key "${key}":`, err);
    throw err;
  }
};

export { getString, getBoolean, getNumber, setItem, getAllKeys, removeItem };
