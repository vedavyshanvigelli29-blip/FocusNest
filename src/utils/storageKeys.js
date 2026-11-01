/**
 * storageKeys.js
 *
 * All LocalStorage key names are defined here as constants.
 * This prevents typos and makes it easy to find every place
 * where data is stored or read.
 *
 * Rule: Never write a raw string like 'focusnest_tasks' in a component.
 * Always import and use these constants instead.
 */

export const STORAGE_KEYS = {
  // Auth
  USERS: 'focusnest_users',           // Array of user profile objects
  CREDENTIALS: 'focusnest_credentials', // Array of { userId, email, passwordEncoded }
  SESSION: 'focusnest_session',        // Currently active session object

  // App data
  TASKS: 'focusnest_tasks',           // Array of task objects
  GOALS: 'focusnest_goals',           // Array of goal objects
  SESSIONS: 'focusnest_sessions',     // Array of completed Pomodoro sessions
  STREAK: 'focusnest_streak',         // Streak tracking object
  SETTINGS: 'focusnest_settings',     // User preferences (theme, timer durations)
  ANALYTICS: 'focusnest_analytics',   // Daily stats object
};
