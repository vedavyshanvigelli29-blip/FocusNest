/**
 * AuthCard.jsx
 *
 * The centered white card container used by all auth pages.
 * Wrapping all auth pages in this consistent shell means
 * they all share the same layout, shadow, and border radius
 * without repeating that code in every page.
 */

function AuthCard({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}

export default AuthCard;
