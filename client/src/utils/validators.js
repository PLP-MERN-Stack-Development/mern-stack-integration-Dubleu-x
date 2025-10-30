import { VALIDATION_PATTERNS } from './constants';

// Validation functions
export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (value && !VALIDATION_PATTERNS.EMAIL.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Cannot exceed ${max} characters`;
    }
    return null;
  },

  username: (value) => {
    if (value && !VALIDATION_PATTERNS.USERNAME.test(value)) {
      return 'Username can only contain letters, numbers, and underscores (3-30 characters)';
    }
    return null;
  },

  password: (value) => {
    if (value && value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  },

  confirmPassword: (password) => (value) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },

  url: (value) => {
    if (value && !isValidUrl(value)) {
      return 'Please enter a valid URL';
    }
    return null;
  }
};

// Helper function to validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Predefined validation rules
export const VALIDATION_RULES = {
  username: [
    validators.required,
    validators.minLength(3),
    validators.maxLength(30),
    validators.username
  ],

  email: [
    validators.required,
    validators.email
  ],

  password: [
    validators.required,
    validators.minLength(6)
  ],

  postTitle: [
    validators.required,
    validators.maxLength(200)
  ],

  postExcerpt: [
    validators.maxLength(300)
  ],

  bio: [
    validators.maxLength(500)
  ]
};