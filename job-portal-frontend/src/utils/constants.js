// Gender options for dropdowns
export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

// Country options (example, extend as needed)
export const COUNTRY_OPTIONS = [
  { label: "United States", value: "US" },
  { label: "India", value: "IN" },
  { label: "United Kingdom", value: "UK" },
  { label: "Canada", value: "CA" },
  { label: "Australia", value: "AU" },
];

// Skill proficiency levels
export const PROFICIENCY_LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" },
];

// Maximum lengths for various inputs
export const MAX_LENGTHS = {
  summary: 500,
  firstName: 50,
  lastName: 50,
  city: 50,
  state: 50,
  postalCode: 10,
};

// Date format constants for date-fns or display
export const DATE_FORMAT = "yyyy-MM-dd";

// API response status codes (customize as needed)
export const API_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
