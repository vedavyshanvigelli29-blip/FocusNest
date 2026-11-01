/**
 * ForgotPasswordPage.jsx
 *
 * Two-step forgot password flow:
 * Step 1 — User enters their email
 * Step 2 — Success message is shown (no actual email is sent — frontend demo)
 *
 * We always show the success message regardless of whether the email
 * exists in LocalStorage. This is standard security practice —
 * it prevents attackers from discovering which emails are registered.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../../components/layout/AuthCard';
import FormInput from '../../components/common/FormInput';
import { validateEmail } from '../../utils/validators';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    setEmailError(error);
    if (error) return;

    setIsSubmitting(true);
    // Simulate a brief API call delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmittedEmail(email);
    setIsSuccess(true);
  };

  return (
    <AuthCard>
      {!isSuccess ? (
        // ── Step 1: Enter email ──────────────────────────────────────────────
        <>
          <Link to="/login" className="auth-back-link">
            ← Back to login
          </Link>

          <h1 className="auth-heading">Reset your password 🔑</h1>
          <p className="auth-subheading">
            Enter your email address and we&apos;ll send you a reset link.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <FormInput
              id="forgot-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailError(validateEmail(email))}
              error={emailError}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
            />

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSubmitting}
              style={{ marginTop: 'var(--space-2)' }}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" />
                  Sending…
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Remember your password?{' '}
            <Link to="/login" className="auth-link">
              Sign in →
            </Link>
          </div>
        </>
      ) : (
        // ── Step 2: Success state ────────────────────────────────────────────
        <div className="success-state">
          <div className="success-icon">📬</div>
          <h2 className="success-title">Check your email</h2>
          <p className="success-message">
            If an account exists for{' '}
            <strong>{submittedEmail}</strong>, a password reset link
            has been sent. Check your inbox and spam folder.
          </p>
          <Link to="/login" className="btn btn-primary btn-full">
            Back to Login
          </Link>
        </div>
      )}
    </AuthCard>
  );
}

export default ForgotPasswordPage;
