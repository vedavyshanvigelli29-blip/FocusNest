/**
 * LoginPage.jsx
 *
 * Email + password login form with:
 * - Field-level validation on blur and on submit
 * - Password show/hide toggle (via FormInput)
 * - Loading state while processing
 * - Toast notification on error
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/layout/AuthCard';
import FormInput from '../../components/common/FormInput';
import GoogleDemoModal from '../../components/auth/GoogleDemoModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateEmail, validatePassword } from '../../utils/validators';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Validate a single field when the user leaves it (on blur)
  const validateField = (field, value) => {
    let error = '';
    if (field === 'email')    error = validateEmail(value);
    if (field === 'password') error = validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Validate all fields at once before submitting
  const validateAll = () => {
    const emailError    = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed. Please try again.');
      // Shake effect on the form for visual feedback
      setErrors((prev) => ({ ...prev, password: result.error }));
    }
  };

  const handleGoogleSelect = async (account) => {
    setIsGoogleModalOpen(false);
    setIsGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const result = await loginWithGoogle(account);
    setIsGoogleLoading(false);
    if (result.success) {
      toast.success(`Welcome, ${account.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Google sign-in failed.');
    }
  };

  return (
    <>
      <AuthCard>
        <Link to="/" className="auth-back-link">
          ← Back
        </Link>

        <h1 className="auth-heading">Welcome back 👋</h1>
        <p className="auth-subheading">Sign in to your FocusNest account</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <FormInput
            id="login-email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField('email', email)}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
          />

          <FormInput
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validateField('password', password)}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isSubmitting}
          />

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: 'var(--font-size-sm)' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
            style={{ marginTop: 'var(--space-2)' }}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button
          className="btn btn-google btn-full"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={isSubmitting}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one →
          </Link>
        </div>
      </AuthCard>

      <GoogleDemoModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleSelect}
      />

      {isGoogleLoading && (
        <div className="auth-loading-overlay">
          <div className="auth-loading-card">
            <div className="auth-loading-spinner" />
            <p className="auth-loading-text">Signing you in with Google…</p>
          </div>
        </div>
      )}
    </>
  );
}

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

export default LoginPage;
