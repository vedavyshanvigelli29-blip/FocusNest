/**
 * ProtectedRoute.jsx
 *
 * Guards all app pages so only logged-in users can access them.
 *
 * How it works:
 * - While auth state is loading (reading LocalStorage), show a spinner
 * - If the user is NOT logged in, redirect them to / (welcome page)
 * - If the user IS logged in, render the requested page via <Outlet />
 *
 * <Outlet /> is a React Router concept — it renders whatever child
 * route matched. Think of ProtectedRoute as a "gate" that either
 * lets you through or sends you away.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't redirect until we've finished reading LocalStorage.
  // Without this check, logged-in users would briefly see a redirect
  // on every page refresh before their session loads.
  if (isLoading) {
    return (
      <div className="full-page-loader">
        <div className="full-page-spinner" />
      </div>
    );
  }

  // Not logged in → send to welcome page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Logged in → render the child route
  return <Outlet />;
}

export default ProtectedRoute;
