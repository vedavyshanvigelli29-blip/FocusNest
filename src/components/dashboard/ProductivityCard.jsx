/**
 * ProductivityCard.jsx
 *
 * Shows a productivity summary on the Dashboard.
 * Calculates a productivity percentage based on tasks and sessions.
 */

import { useTask } from '../../hooks/useTask';
import useLocalStorage from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storageKeys';

function ProductivityCard() {
  const { totalTasks, completedTasks } = useTask();
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);

  // Productivity % = completed tasks / total tasks (0 if no tasks yet)
  const productivity = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Today's focus sessions count
  const today = new Date().toDateString();
  const todaySessionCount = sessions.filter(
    (s) => s.type === 'focus' && new Date(s.date).toDateString() === today
  ).length;

  // Color the ring based on productivity level
  const getRingColor = () => {
    if (productivity >= 75) return 'var(--color-success)';
    if (productivity >= 40) return 'var(--color-warning)';
    return 'var(--color-primary)';
  };

  // SVG arc math for the donut chart
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (productivity / 100) * circumference;

  return (
    <div className="dashboard-card productivity-card">
      <div className="dashboard-card__header">
        <h2 className="dashboard-card__title">Productivity</h2>
        <span className="dashboard-card__subtitle">Today&apos;s overview</span>
      </div>

      {/* Circular progress + percentage */}
      <div className="productivity-chart">
        <div className="productivity-donut">
          <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
            {/* Track */}
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="8" />
            {/* Progress */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={getRingColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="productivity-donut__center">
            <span className="productivity-donut__pct">{productivity}%</span>
          </div>
        </div>

        {/* Stats list */}
        <div className="productivity-stats">
          <ProductivityStat
            icon="✅"
            label="Tasks done"
            value={`${completedTasks} / ${totalTasks}`}
          />
          <ProductivityStat
            icon="⏱️"
            label="Focus sessions"
            value={todaySessionCount}
          />
          <ProductivityStat
            icon="📋"
            label="Pending"
            value={totalTasks - completedTasks}
          />
        </div>
      </div>
    </div>
  );
}

function ProductivityStat({ icon, label, value }) {
  return (
    <div className="productivity-stat-row">
      <span className="productivity-stat-row__icon">{icon}</span>
      <span className="productivity-stat-row__label">{label}</span>
      <span className="productivity-stat-row__value">{value}</span>
    </div>
  );
}

export default ProductivityCard;
