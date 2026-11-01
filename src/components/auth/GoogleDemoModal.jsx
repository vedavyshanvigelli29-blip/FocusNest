/**
 * GoogleDemoModal.jsx
 *
 * Simulates the Google "Choose an account" popup for this frontend demo.
 *
 * Important: This is NOT real Google OAuth. It's a UI demonstration
 * that mimics the look and feel of Google's account selector.
 * The "Demo Mode" badge makes this clear to users and professors.
 *
 * Flow:
 * 1. Modal opens when user clicks "Continue with Google"
 * 2. User clicks a demo account
 * 3. User clicks "Continue"
 * 4. onSelectAccount() is called with the chosen account object
 */

import { useState } from 'react';

// Hardcoded demo accounts — these represent fictional users
const DEMO_ACCOUNTS = [
  {
    id: 'google_demo_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@gmail.com',
    avatar: 'AJ',
    avatarColor: '#4285f4',
  },
  {
    id: 'google_demo_2',
    name: 'Jordan Lee',
    email: 'jordan.lee@gmail.com',
    avatar: 'JL',
    avatarColor: '#34a853',
  },
  {
    id: 'google_demo_3',
    name: 'Sam Rivera',
    email: 'sam.rivera@gmail.com',
    avatar: 'SR',
    avatarColor: '#ea4335',
  },
];

// Outer guard — only renders the modal DOM when isOpen is true.
// Hooks live in GoogleDemoModalInner so they're never called conditionally.
function GoogleDemoModal({ isOpen, onClose, onSelectAccount }) {
  if (!isOpen) return null;
  return <GoogleDemoModalInner onClose={onClose} onSelectAccount={onSelectAccount} />;
}

// Inner component — all hooks live here, always called in the same order.
function GoogleDemoModalInner({ onClose, onSelectAccount }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.id === selectedId);

  const handleContinue = () => {
    if (selectedAccount) {
      onSelectAccount(selectedAccount);
    }
  };

  // Close the modal if user clicks the dark overlay (outside the card)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Choose a Google account">
      <div className="modal-content">

        {/* Header */}
        <div className="google-modal-header">
          <div className="google-modal-logo">
            {/* Google "G" logo using colored squares */}
            <GoogleLogo />
          </div>
          <h2 className="google-modal-title">Choose an account</h2>
          <p className="google-modal-subtitle">to continue to FocusNest</p>
          {/* Clear demo indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            <span className="demo-badge">⚡ Demo Mode</span>
          </div>
        </div>

        {/* Account list */}
        <div className="google-accounts-list" role="listbox" aria-label="Google accounts">
          {DEMO_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className={`google-account-item ${selectedId === account.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(account.id)}
              role="option"
              aria-selected={selectedId === account.id}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedId(account.id)}
            >
              <div
                className="google-account-avatar"
                style={{ backgroundColor: account.avatarColor }}
              >
                {account.avatar}
              </div>
              <div className="google-account-info">
                <div className="google-account-name">{account.name}</div>
                <div className="google-account-email">{account.email}</div>
              </div>
              {/* Checkmark for selected account */}
              {selectedId === account.id && (
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="google-modal-footer">
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleContinue}
            disabled={!selectedAccount}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Google-style "G" logo using CSS
function GoogleLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default GoogleDemoModal;
