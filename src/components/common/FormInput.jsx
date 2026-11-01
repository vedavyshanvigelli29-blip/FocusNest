/**
 * FormInput.jsx
 *
 * A reusable, accessible form field component used across all auth forms.
 * It bundles together the label, input, error message, and optional
 * password show/hide toggle — so every form field looks and behaves
 * consistently without repeating the same HTML in every form.
 */

import { useState } from 'react';

/**
 * @param {object} props
 * @param {string} props.id          - Unique ID linking the label to the input (accessibility)
 * @param {string} props.label       - Visible label text
 * @param {string} [props.type]      - Input type: 'text', 'email', 'password' (default: 'text')
 * @param {string} props.value       - Controlled value from parent state
 * @param {function} props.onChange  - Called when user types
 * @param {function} [props.onBlur]  - Called when user leaves the field (triggers validation)
 * @param {string} [props.error]     - Error message to display (empty string = no error)
 * @param {string} [props.placeholder]
 * @param {string} [props.autoComplete]
 * @param {boolean} [props.disabled]
 */
function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error = '',
  placeholder = '',
  autoComplete,
  disabled = false,
}) {
  // For password fields, track whether the password is visible
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  // If it's a password field, toggle between 'text' and 'password'
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const hasError = error && error.length > 0;
  // aria-describedby links the input to the error message for screen readers
  const errorId = hasError ? `${id}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>

      <div className="form-input-wrapper">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errorId}
          className={[
            'form-input',
            hasError ? 'has-error' : '',
            isPasswordField ? 'with-toggle' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* Show/hide password toggle button */}
        {isPasswordField && (
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1} // Not in tab order — the input itself handles focus
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        )}
      </div>

      {/* Error message — only rendered when there's an error */}
      {hasError && (
        <p id={errorId} className="form-error" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
