/**
 * ToastContext.jsx
 *
 * Provides a global toast notification system.
 * Any component can call useToast() and show a message without
 * having to manage its own notification state.
 *
 * Usage in any component:
 *   const toast = useToast();
 *   toast.success('Task created!');
 *   toast.error('Something went wrong');
 *   toast.warning('Are you sure?');
 *   toast.info('Tip: you can...');
 *
 * The useToast hook lives in src/hooks/useToast.js to keep this file
 * component-only and satisfy Vite Fast Refresh requirements.
 */

import { createContext, useState, useCallback, useEffect } from 'react';

// Named export so useToast.js can import it directly.
export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error:   (msg, duration) => addToast(msg, 'error',   duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info:    (msg, duration) => addToast(msg, 'info',    duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* ToastContainer renders the actual toast elements */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// ─── ToastContainer ────────────────────────────────────────────────────────
// Renders a stack of toast messages in the bottom-right corner.
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// ─── ToastItem ─────────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }) {
  const icons = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  };

  const handleRemove = () => onRemove(toast.id);

  return (
    <div
      className={`toast toast-${toast.type}`}
      style={{ '--toast-duration': `${toast.duration}ms` }}
    >
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={handleRemove}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
      {/* Auto-dismiss progress bar */}
      <AutoDismiss duration={toast.duration} onDone={handleRemove} />
    </div>
  );
}

// Handles the auto-dismiss timer
function AutoDismiss({ duration, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer); // cleanup if toast is manually dismissed
  }, [duration, onDone]);
  return null;
}
