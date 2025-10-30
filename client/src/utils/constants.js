// API endpoints
export const API_ENDPOINTS = {
  POSTS: '/posts',
  CATEGORIES: '/categories',
  AUTH: '/auth',
  USERS: '/users'
};

// Application constants
export const APP_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_EXCERPT_LENGTH: 300,
  MAX_BIO_LENGTH: 500,
  POSTS_PER_PAGE: 10,
  FEATURED_POSTS_COUNT: 6
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Post statuses
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};