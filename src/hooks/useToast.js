/**
 * useToast.js
 *
 * The useToast hook — how any component triggers toast notifications.
 * Kept in its own file so this file exports only a hook,
 * satisfying Vite Fast Refresh's requirement that a file
 * export either only components OR only hooks/values.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Done!');
 */
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a <ToastProvider>');
  return context;
}
