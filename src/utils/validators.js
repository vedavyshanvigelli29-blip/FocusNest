/**
 * validators.js
 *
 * Pure validation functions — they take a value and return
 * an error message string, or an empty string if valid.
 *
 * Using pure functions (no side effects) makes these easy to
 * test and reuse across any form in the app.
 */

/**
 * Checks that a value is not empty.
 * @param {string} value
 * @param {string} fieldName - Used in the error message, e.g. "Full name"
 * @returns {string} error message or ''
 */
export function validateRequired(value, fieldName = 'This field') {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return '';
}

/**
 * Checks that an email address looks valid.
 * Uses a standard regex pattern.
 * @param {string} email
 * @returns {string} error message or ''
 */
export function validateEmail(email) {
  const required = validateRequired(email, 'Email address');
  if (required) return required;

  // Standard email regex — checks for something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return '';
}

/**
 * Checks that a password meets minimum length requirements.
 * @param {string} password
 * @returns {string} error message or ''
 */
export function validatePassword(password) {
  const required = validateRequired(password, 'Password');
  if (required) return required;

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return '';
}

/**
 * Checks that the confirm password field matches the original password.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string} error message or ''
 */
export function validateConfirmPassword(password, confirmPassword) {
  const required = validateRequired(confirmPassword, 'Please confirm your password');
  if (required) return 'Please confirm your password';

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
}

/**
 * Checks that a name meets minimum length requirements.
 * @param {string} name
 * @returns {string} error message or ''
 */
export function validateName(name) {
  const required = validateRequired(name, 'Full name');
  if (required) return required;

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  return '';
}

/**
 * Calculates password strength for the visual indicator.
 * Returns: 'weak' | 'fair' | 'good' | 'strong'
 * @param {string} password
 * @returns {{ level: string, score: number, label: string }}
 */
export function getPasswordStrength(password) {
  if (!password || password.length === 0) {
    return { level: 'none', score: 0, label: '' };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;       // Has uppercase
  if (/[0-9]/.test(password)) score++;       // Has number
  if (/[^A-Za-z0-9]/.test(password)) score++; // Has special char

  if (score <= 1) return { level: 'weak', score: 1, label: 'Weak' };
  if (score === 2) return { level: 'fair', score: 2, label: 'Fair' };
  if (score === 3) return { level: 'good', score: 3, label: 'Good' };
  return { level: 'strong', score: 4, label: 'Strong' };
}
