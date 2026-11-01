/**
 * StatCard.jsx
 *
 * A reusable statistics card used in the Dashboard.
 * Displays a label, a large number, an icon, and an optional trend/change indicator.
 *
 * Props:
 * - title: string — e.g. "Total Tasks"
 * - value: number | string — the big number shown
 * - icon: string — emoji or text icon
 * - color: 'primary' | 'success' | 'warning' | 'info' — controls the accent color
 * - subtitle: string (optional) — small text below the value
 */

function StatCard({ title, value, icon, color = 'primary', subtitle }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__header">
        <span className="stat-card__label">{title}</span>
        <div className={`stat-card__icon-wrapper stat-card__icon-wrapper--${color}`}>
          <span className="stat-card__icon">{icon}</span>
        </div>
      </div>
      <div className="stat-card__value">{value}</div>
      {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
    </div>
  );
}

export default StatCard;
