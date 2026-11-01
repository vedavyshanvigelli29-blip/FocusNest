/**
 * PasswordStrengthBar.jsx
 *
 * Visual password strength indicator shown on the Register page.
 * It reads the current password and shows a colored progress bar
 * plus a text label (Weak / Fair / Good / Strong).
 *
 * This gives users real-time feedback as they type, encouraging
 * stronger passwords without blocking them from proceeding.
 */

import { getPasswordStrength } from '../../utils/validators';

function PasswordStrengthBar({ password }) {
  const strength = getPasswordStrength(password);

  // Don't render anything if the user hasn't started typing
  if (strength.level === 'none') return null;

  return (
    <div className="password-strength" aria-label={`Password strength: ${strength.label}`}>
      <div className="password-strength-bar">
        <div className={`password-strength-fill ${strength.level}`} />
      </div>
      <span className={`password-strength-label ${strength.level}`}>
        {strength.label}
      </span>
    </div>
  );
}

export default PasswordStrengthBar;
