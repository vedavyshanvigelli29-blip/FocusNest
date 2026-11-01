/**
 * dateHelpers.js
 *
 * Pure helper functions for working with dates throughout the app.
 * "Pure" means they just take input and return output — no side effects.
 */

/**
 * Returns a greeting based on the current hour of the day.
 * @returns {'Good morning' | 'Good afternoon' | 'Good evening'}
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Formats a Date object into a human-friendly string.
 * e.g. "Sunday, November 1, 2026"
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function formatDateLong(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns a short date string like "Nov 1" or "Today" / "Tomorrow".
 * @param {string|Date} dateInput — ISO string or Date object
 * @returns {string}
 */
export function formatDateShort(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, tomorrow)) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Checks whether a date string/object falls on today's date.
 * @param {string|Date} dateInput
 * @returns {boolean}
 */
export function isToday(dateInput) {
  if (!dateInput) return false;
  return isSameDay(new Date(dateInput), new Date());
}

/**
 * Checks whether a date string/object is in the past (before today).
 * @param {string|Date} dateInput
 * @returns {boolean}
 */
export function isOverdue(dateInput) {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Helper: checks if two Date objects represent the same calendar day.
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Returns today's date as an ISO date string (YYYY-MM-DD).
 * Useful as a default value for date input fields.
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formats a time string (HH:MM) or ISO datetime for display.
 * @param {string} timeInput — "14:30" or ISO string
 * @returns {string} — "2:30 PM"
 */
export function formatTime(timeInput) {
  if (!timeInput) return '';
  // Handle plain HH:MM strings by constructing a temp Date
  const date = timeInput.includes('T')
    ? new Date(timeInput)
    : new Date(`1970-01-01T${timeInput}`);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Returns a short motivational quote — cycles through a set each day.
 * @returns {string}
 */
export function getDailyMotivation() {
  const quotes = [
    'Small steps every day lead to big results.',
    'Focus on progress, not perfection.',
    'Your future self will thank you for today.',
    'One task at a time — that\'s the way.',
    'Consistency beats intensity every time.',
    'Start before you\'re ready. Adjust as you go.',
    'The best time to start is always now.',
  ];
  // Pick a quote based on the day of the year so it changes daily
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
}
