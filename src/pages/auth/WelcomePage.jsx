/**
 * WelcomePage.jsx
 *
 * The first screen users see when they open FocusNest.
 * Presents two paths: Google (demo) or Email login.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/layout/AuthCard';
import GoogleDemoModal from '../../components/auth/GoogleDemoModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

function WelcomePage() {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // User picked a Google demo account → simulate OAuth loading
  const handleGoogleAccountSelect = async (account) => {
    setIsGoogleModalOpen(false);
    setIsGoogleLoading(true);

    // Simulate the 1.5s OAuth redirect delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await loginWithGoogle(account);
    setIsGoogleLoading(false);

    if (result.success) {
      toast.success(`Welcome, ${account.name}!`);
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <>
      <AuthCard>
        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🎯</div>
          <span className="auth-logo-text">FocusNest</span>
        </div>

        <div className="welcome-card animate-fadeInUp">
          <h1 className="auth-heading">Welcome back</h1>
          <p className="welcome-tagline">
            Your personal space for deep focus,<br />task mastery, and daily progress.
          </p>

          <div className="welcome-actions">
            {/* Google Demo Button */}
            <button
              className="btn btn-google btn-full"
              onClick={() => setIsGoogleModalOpen(true)}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Email Login Button */}
            <Link to="/login" className="btn btn-primary btn-full">
              ✉️&nbsp; Continue with Email
            </Link>
          </div>

          <div className="auth-footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one for free →
            </Link>
          </div>
        </div>
      </AuthCard>

      {/* Google Demo Account Selector Modal */}
      <GoogleDemoModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

      {/* Loading overlay while "OAuth" is processing */}
      {isGoogleLoading && (
        <div className="auth-loading-overlay">
          <div className="auth-loading-card">
            <div className="auth-loading-spinner" />
            <GoogleIcon />
            <p className="auth-loading-text">Signing you in with Google…</p>
          </div>
        </div>
      )}
    </>
  );
}

// Inline Google SVG to avoid importing an icon library
function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default WelcomePage;
