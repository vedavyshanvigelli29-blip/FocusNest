/**
 * FocusPreviewCard.jsx
 *
 * A preview card for the Pomodoro focus timer on the Dashboard.
 * Shows the default timer duration and a "Start Focus" button
 * that navigates to the full Timer page.
 *
 * The timer does NOT tick here — this is a dashboard summary only.
 * Full timer functionality lives in TimerPage.
 */

import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storageKeys';

// Default Pomodoro settings — used until the user customizes them in Settings
const DEFAULT_SETTINGS = {
  focusDuration: 25,
  breakDuration: 5,
};

function FocusPreviewCard() {
  const navigate = useNavigate();
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  const focusDuration = settings?.focusDuration ?? DEFAULT_SETTINGS.focusDuration;

  // Count today's completed focus sessions
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => s.type === 'focus' && new Date(s.date).toDateString() === today
  );
  const todayFocusMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Format minutes into "Xh Ym" or just "Xm"
  const formatFocusTime = (minutes) => {
    if (minutes === 0) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="dashboard-card focus-preview-card">
      <div className="dashboard-card__header">
        <h2 className="dashboard-card__title">Focus Timer</h2>
        <span className="focus-badge">Pomodoro</span>
      </div>

      {/* Timer display */}
      <div className="focus-timer-display">
        <div className="focus-timer-ring">
          <svg viewBox="0 0 120 120" className="focus-timer-ring__svg" aria-hidden="true">
            {/* Background ring */}
            <circle cx="60" cy="60" r="50" fill="none" strokeWidth="6" className="focus-timer-ring__track" />
            {/* Progress arc — static at 100% since this is just a preview */}
            <circle
              cx="60" cy="60" r="50"
              fill="none" strokeWidth="6"
              strokeLinecap="round"
              className="focus-timer-ring__progress"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset="0"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="focus-timer-ring__center">
            <span className="focus-timer-ring__time">{focusDuration}:00</span>
            <span className="focus-timer-ring__label">Ready</span>
          </div>
        </div>
      </div>

      {/* Today's focus stats */}
      <div className="focus-stats">
        <div className="focus-stat">
          <span className="focus-stat__value">{todaySessions.length}</span>
          <span className="focus-stat__label">Sessions today</span>
        </div>
        <div className="focus-stat-divider" />
        <div className="focus-stat">
          <span className="focus-stat__value">{formatFocusTime(todayFocusMinutes)}</span>
          <span className="focus-stat__label">Focus time</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={() => navigate('/timer')}
        style={{ marginTop: 'var(--space-4)' }}
      >
        ▶ Start Focus Session
      </button>
    </div>
  );
}

export default FocusPreviewCard;
