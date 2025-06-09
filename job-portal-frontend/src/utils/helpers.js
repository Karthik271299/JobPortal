import { format } from "date-fns";

/**
 * Format a date string or Date object to the given format
 * @param {string | Date} date
 * @param {string} formatStr - date-fns compatible format string
 * @returns {string} formatted date or empty string if invalid
 */
export const formatDate = (date, formatStr = "yyyy-MM-dd") => {
  try {
    if (!date) return "";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (isNaN(parsedDate)) return "";
    return format(parsedDate, formatStr);
  } catch {
    return "";
  }
};

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Safely get nested property value
 * @param {object} obj
 * @param {string[]} keys - array of keys for nested lookup
 * @param {*} defaultValue
 * @returns {*}
 */
export const getNested = (obj, keys, defaultValue = null) => {
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
};

/**
 * Debounce function to limit how often a function can run
 * Useful for input validation or search input
 * @param {function} func
 * @param {number} wait - milliseconds
 * @returns {function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Simple delay/promise-based timeout
 * @param {number} ms - milliseconds
 * @returns {Promise}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};
