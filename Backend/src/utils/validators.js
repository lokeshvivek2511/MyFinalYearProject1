// Backend/src/utils/validators.js

export const isEmpty = (value) => {
  return value === undefined || value === null || value === "";
};

export const validateRequiredFields = (fields, body) => {
  for (const field of fields) {
    if (isEmpty(body[field])) {
      return `${field} is required`;
    }
  }
  return null;
};