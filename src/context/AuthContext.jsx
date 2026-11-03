/**
 * AuthContext.jsx
 *
 * Authentication is handled by the FocusNest backend.
 * Frontend → Render Backend → MongoDB Atlas
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';

export const AuthContext = createContext(null);

// Your deployed Render backend
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://focusnest-backend-67pm.onrender.com';

// ─── Helper: generate initials ────────────────────────────────────────────────
const getInitials = (name) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ─── Auth Provider ────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore login session after page refresh
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION);

      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);

        if (session.user) {
          setCurrentUser(session.user);
        }
      }
    } catch (_err) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── LOGIN ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.message || 'Invalid email or password',
        };
      }

      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: getInitials(data.user.name),
        authMethod: 'email',
      };

      // Save session locally
      const session = {
        user,
        loginAt: new Date().toISOString(),
        authMethod: 'email',
      };

      localStorage.setItem(
        STORAGE_KEYS.SESSION,
        JSON.stringify(session)
      );

      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        error: 'Unable to connect to server. Please try again.',
      };
    }
  }, []);

  // ─── GOOGLE DEMO LOGIN ─────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (demoAccount) => {
    try {
      const user = {
        id: `google_${Date.now()}`,
        name: demoAccount.name,
        email: demoAccount.email,
        avatar: demoAccount.avatar,
        authMethod: 'google',
        createdAt: new Date().toISOString(),
      };

      const session = {
        user,
        loginAt: new Date().toISOString(),
        authMethod: 'google',
      };

      localStorage.setItem(
        STORAGE_KEYS.SESSION,
        JSON.stringify(session)
      );

      setCurrentUser(user);

      return {
        success: true,
        isNewUser: true,
      };
    } catch (_err) {
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }
  }, []);

  // ─── REGISTER ──────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.message || 'Registration failed',
        };
      }

      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: getInitials(data.user.name),
        authMethod: 'email',
        createdAt: new Date().toISOString(),
      };

      // Save session locally after successful backend registration
      const session = {
        user,
        loginAt: new Date().toISOString(),
        authMethod: 'email',
      };

      localStorage.setItem(
        STORAGE_KEYS.SESSION,
        JSON.stringify(session)
      );

      setCurrentUser(user);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Registration error:', error);

      return {
        success: false,
        error: 'Unable to connect to server. Please try again.',
      };
    }
  }, []);

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    isAuthenticated: currentUser !== null,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}