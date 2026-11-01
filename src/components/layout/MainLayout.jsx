/**
 * MainLayout.jsx
 *
 * The main application shell rendered after login.
 * It contains the Sidebar, Navbar, and the <Outlet /> where
 * page content is injected by React Router.
 *
 * It also manages:
 * - The mobile sidebar open/close state
 * - The light/dark theme toggle (stored in LocalStorage)
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Read the saved theme preference on first load
    return localStorage.getItem('focusnest_theme') === 'dark';
  });

  // Apply the theme to the <html> element whenever isDark changes.
  // CSS variables for dark mode activate when data-theme="dark" is set.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('focusnest_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />

        {/* <Outlet /> is where the matched page component renders */}
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
