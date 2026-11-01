/**
 * AuthContext.jsx
 *
 * This is the heart of our authentication system.
 *
 * WHY Context? Any component in the app needs to know "is someone logged in?"
 * Without Context, we'd have to pass user data as props through every
 * component — that gets messy fast. Context lets any component access
 * auth state directly.
 *
 * What this file does:
 * 1. Creates the AuthContext (a shared data container)
 * 2. Creates AuthProvider (wraps the whole app, manages the state)
 *
 * The useAuth hook lives in src/hooks/useAuth.js to keep this file
 * component-only and satisfy Vite Fast Refresh requirements.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';

// Create the context with a default value of null.
// Named export so useAuth.js can import it directly.
export const AuthContext = createContext(null);

// ─── Helper: encode/decode password ──────────────────────────────────────────
// We use Base64 encoding so the password isn't visible as plaintext in
// browser DevTools. This is NOT real security — it's for demo presentation only.
const encode = (str) => btoa(str);
const decode = (str) => atob(str);

// ─── Helper: generate a simple unique ID ─────────────────────────────────────
const generateId = () => `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─── Helper: get initials from a name ────────────────────────────────────────
const getInitials = (name) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ─── AuthProvider Component ───────────────────────────────────────────────────
// Wrap your entire app in this component so every page can access auth state.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we read LocalStorage on startup

  // On app startup: read the saved session from LocalStorage.
  // If a session exists, load that user's profile.
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        // Find the matching user profile
        const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const user = users.find((u) => u.id === session.userId);
        if (user) {
          setCurrentUser(user);
        } else {
          // Session points to a user that doesn't exist — clear it
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      }
    } catch (_err) {
      // Corrupted data — clear the session
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } finally {
      // Always stop the loading state, whether we found a user or not
      setIsLoading(false);
    }
  }, []);

  // ─── login ─────────────────────────────────────────────────────────────────
  // Looks up the email + password in LocalStorage credentials.
  // Returns { success: true } or { success: false, error: 'message' }
  const login = useCallback(async (email, password) => {
    try {
      const credentialsRaw = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const credentials = credentialsRaw ? JSON.parse(credentialsRaw) : [];

      const credential = credentials.find(
        (c) => c.email.toLowerCase() === email.toLowerCase()
      );

      if (!credential || decode(credential.passwordEncoded) !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Credentials match — load the user profile
      const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const user = users.find((u) => u.id === credential.userId);

      if (!user) {
        return { success: false, error: 'Account not found. Please register.' };
      }

      // Save session to LocalStorage so it survives refreshes
      const session = { userId: user.id, loginAt: new Date().toISOString(), authMethod: 'email' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

      setCurrentUser(user);
      return { success: true };
    } catch (_err) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  // ─── loginWithGoogle ────────────────────────────────────────────────────────
  // Accepts a demo account object from the Google Demo Modal.
  // Creates a user profile if this Google account hasn't been used before.
  const loginWithGoogle = useCallback(async (demoAccount) => {
    try {
      const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      // Check if this Google demo account already has a profile.
      // Capture isNewUser BEFORE potentially pushing a new entry into the array.
      let user = users.find((u) => u.email === demoAccount.email);
      const isNewUser = !user;

      if (isNewUser) {
        // First time this Google account is used — create a profile
        user = {
          id: generateId(),
          name: demoAccount.name,
          email: demoAccount.email,
          avatar: demoAccount.avatar,
          authMethod: 'google',
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      // Save session
      const session = { userId: user.id, loginAt: new Date().toISOString(), authMethod: 'google' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

      setCurrentUser(user);
      return { success: true, isNewUser };
    } catch (_err) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  // ─── register ──────────────────────────────────────────────────────────────
  // Creates a new user account and logs them in immediately.
  const register = useCallback(async (name, email, password) => {
    try {
      const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      // Check if email is already taken
      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: 'An account with this email already exists' };
      }

      // Create the user profile (NO password stored here)
      const newUser = {
        id: generateId(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        avatar: getInitials(name),
        authMethod: 'email',
        createdAt: new Date().toISOString(),
      };

      // Save the profile
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Save the credentials separately with Base64-encoded password
      const credentialsRaw = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const credentials = credentialsRaw ? JSON.parse(credentialsRaw) : [];
      credentials.push({
        userId: newUser.id,
        email: newUser.email,
        passwordEncoded: encode(password),
      });
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));

      // Log the new user in immediately
      const session = { userId: newUser.id, loginAt: new Date().toISOString(), authMethod: 'email' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

      setCurrentUser(newUser);
      return { success: true };
    } catch (_err) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  // ─── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setCurrentUser(null);
  }, []);

  // The value object that every consumer of useAuth() will receive
  const value = {
    currentUser,
    isAuthenticated: currentUser !== null,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
