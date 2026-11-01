/**
 * useAuth.js
 *
 * The useAuth hook — how any component reads auth state.
 * Kept in its own file so this file exports only a hook,
 * satisfying Vite Fast Refresh's requirement that a file
 * export either only components OR only hooks/values.
 *
 * Usage:
 *   const { currentUser, isAuthenticated, login, logout } = useAuth();
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // This error fires if you forget to wrap your app in <AuthProvider>
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}
