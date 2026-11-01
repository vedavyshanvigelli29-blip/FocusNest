/**
 * Navbar.jsx
 *
 * Top navigation bar showing:
 * - Hamburger menu (mobile only)
 * - Current page title
 * - Theme toggle (light/dark mode)
 * - User avatar + name
 */

import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Map route paths to human-readable page titles
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/tasks':     'Tasks',
  '/timer':     'Focus Timer',
  '/goals':     'Daily Goals',
  '/analytics': 'Analytics',
  '/settings':  'Settings',
};

function Navbar({ onMenuClick, isDark, onThemeToggle }) {
  const location = useLocation();
  const { currentUser } = useAuth();
  const pageTitle = PAGE_TITLES[location.pathname] || 'FocusNest';

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Hamburger — only visible on mobile via CSS */}
        <button
          className="hamburger-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <h1 className="navbar-page-title">{pageTitle}</h1>
      </div>

      <div className="navbar-right">
        {/* Light / dark mode toggle */}
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* User avatar */}
        {currentUser && (
          <div className="navbar-user" title={currentUser.name}>
            <div className="navbar-avatar" aria-label={`Logged in as ${currentUser.name}`}>
              {currentUser.avatar}
            </div>
            <span className="navbar-user-name">{currentUser.name.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
