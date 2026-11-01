/**
 * WelcomeBanner.jsx
 *
 * The top welcome section of the dashboard.
 * Shows a greeting, the user's name, today's date, and a daily motivation quote.
 */

import { getGreeting, formatDateLong, getDailyMotivation } from '../../utils/dateHelpers';

function WelcomeBanner({ userName }) {
  const greeting = getGreeting();
  const firstName = userName ? userName.split(' ')[0] : 'there';

  return (
    <div className="welcome-banner">
      <div className="welcome-banner__text">
        <h1 className="welcome-banner__heading">
          {greeting}, {firstName} 👋
        </h1>
        <p className="welcome-banner__motivation">{getDailyMotivation()}</p>
        <p className="welcome-banner__date">{formatDateLong()}</p>
      </div>
      <div className="welcome-banner__graphic" aria-hidden="true">
        <div className="welcome-banner__graphic-inner">
          <span className="welcome-banner__graphic-emoji">🎯</span>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
