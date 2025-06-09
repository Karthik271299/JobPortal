// Validate required field
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== "";
};

// Validate email format
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone number (basic, 10-15 digits, optional + prefix)
export const isValidPhone = (phone) => {
  const regex = /^\+?[0-9]{10,15}$/;
  return regex.test(phone);
};

// Validate date format (YYYY-MM-DD) and date is not in future
export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  return !isNaN(date.getTime()) && date <= now;
};

// Validate string max length
export const maxLength = (value, max) => {
  if (!value) return true; // empty handled by required
  return value.length <= max;
};

// Validate file size (in bytes)
export const isValidFileSize = (file, minBytes = 10 * 1024, maxBytes = 2 * 1024 * 1024) => {
  if (!file) return false;
  return file.size >= minBytes && file.size <= maxBytes;
};

// Validate file type by mime
export const isValidFileType = (file, allowedTypes = ["image/jpeg", "image/png", "image/webp"]) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

// Validate postal code (simple alphanumeric, 3-10 chars)
export const isValidPostalCode = (postalCode) => {
  const regex = /^[a-zA-Z0-9\s\-]{3,10}$/;
  return regex.test(postalCode);
};

// Validate currency (positive number, max two decimals)
export const isValidCurrency = (value) => {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(value);
};

// Validate years of experience (number between 0 and 100)
export const isValidYearsExperience = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= 100;
};
