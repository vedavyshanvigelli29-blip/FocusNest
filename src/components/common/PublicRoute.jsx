/**
 * PublicRoute.jsx
 *
 * The opposite of ProtectedRoute — this prevents logged-in users
 * from visiting auth pages (login, register, etc.).
 *
 * If you're already logged in and try to visit /login, you'll be
 * redirected straight to /dashboard instead.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="full-page-loader">
        <div className="full-page-spinner" />
      </div>
    );
  }

  // Already logged in → skip auth pages, go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → render the auth page
  return <Outlet />;
}

export default PublicRoute;
