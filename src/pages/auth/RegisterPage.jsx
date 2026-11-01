/**
 * RegisterPage.jsx
 *
 * Create account form with:
 * - Full name, email, password, confirm password
 * - Real-time password strength bar
 * - Validation on blur and on submit
 * - Immediate login after registration
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/layout/AuthCard';
import FormInput from '../../components/common/FormInput';
import PasswordStrengthBar from '../../components/auth/PasswordStrengthBar';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validators';

function RegisterPage() {
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirm: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const updateField = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Validate a single field when user leaves it
  const validateField = (field) => () => {
    let error = '';
    if (field === 'name')     error = validateName(fields.name);
    if (field === 'email')    error = validateEmail(fields.email);
    if (field === 'password') error = validatePassword(fields.password);
    if (field === 'confirm')  error = validateConfirmPassword(fields.password, fields.confirm);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const newErrors = {
      name:     validateName(fields.name),
      email:    validateEmail(fields.email),
      password: validatePassword(fields.password),
      confirm:  validateConfirmPassword(fields.password, fields.confirm),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    const result = await register(fields.name, fields.email, fields.password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Welcome to FocusNest, ${fields.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } else {
      // The most common error here is duplicate email
      if (result.error?.includes('email already exists')) {
        setErrors((prev) => ({ ...prev, email: result.error }));
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <AuthCard>
      <Link to="/login" className="auth-back-link">
        ← Back to login
      </Link>

      <h1 className="auth-heading">Create your account ✨</h1>
      <p className="auth-subheading">Start your focus journey today</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormInput
          id="reg-name"
          label="Full name"
          type="text"
          value={fields.name}
          onChange={updateField('name')}
          onBlur={validateField('name')}
          error={errors.name}
          placeholder="Alex Johnson"
          autoComplete="name"
          disabled={isSubmitting}
        />

        <FormInput
          id="reg-email"
          label="Email address"
          type="email"
          value={fields.email}
          onChange={updateField('email')}
          onBlur={validateField('email')}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting}
        />

        <div>
          <FormInput
            id="reg-password"
            label="Password"
            type="password"
            value={fields.password}
            onChange={updateField('password')}
            onBlur={validateField('password')}
            error={errors.password}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          {/* Password strength bar — updates as the user types */}
          <PasswordStrengthBar password={fields.password} />
        </div>

        <FormInput
          id="reg-confirm"
          label="Confirm password"
          type="password"
          value={fields.confirm}
          onChange={updateField('confirm')}
          onBlur={validateField('confirm')}
          error={errors.confirm}
          placeholder="Re-enter your password"
          autoComplete="new-password"
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
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign in →
        </Link>
      </div>
    </AuthCard>
  );
}

export default RegisterPage;
