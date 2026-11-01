/**
 * Sidebar.jsx
 *
 * The main navigation sidebar. Shows the app logo, nav links,
 * current user info, and logout button.
 *
 * On mobile (<1024px), it slides in as a drawer triggered by
 * the hamburger button in the Navbar.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

// Navigation items — add or remove pages here
const NAV_ITEMS = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/tasks',     icon: '✅', label: 'Tasks' },
  { path: '/timer',     icon: '⏱️', label: 'Focus Timer' },
  { path: '/goals',     icon: '🎯', label: 'Daily Goals' },
  { path: '/analytics', icon: '📈', label: 'Analytics' },
  { path: '/settings',  icon: '⚙️', label: 'Settings' },
];

function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
    navigate('/');
    onClose(); // Close mobile sidebar
  };

  return (
    <>
      {/* Dark overlay behind sidebar on mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        {/* Brand / Logo */}
        <NavLink to="/dashboard" className="sidebar-brand" onClick={onClose}>
          <div className="sidebar-brand-icon">🎯</div>
          <span className="sidebar-brand-name">FocusNest</span>
        </NavLink>

        {/* Navigation links */}
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User info + Logout */}
        <div className="sidebar-footer">
          {currentUser && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {currentUser.avatar}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{currentUser.name}</div>
                <div className="sidebar-user-email">{currentUser.email}</div>
              </div>
            </div>
          )}

          <button
            className="sidebar-logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <div className="confirm-dialog-icon">👋</div>
            <h2 className="confirm-dialog-title">Sign out?</h2>
            <p className="confirm-dialog-message">
              Are you sure you want to sign out of FocusNest?
            </p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
