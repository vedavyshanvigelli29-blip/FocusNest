/**
 * QuickActions.jsx
 *
 * A row of shortcut buttons on the Dashboard for the most common actions.
 * Each button either opens a modal or navigates to a page.
 *
 * Props:
 * - onAddTask: () => void — opens the Add Task modal
 */

import { useNavigate } from 'react-router-dom';

function QuickActions({ onAddTask }) {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'add-task',
      icon: '✅',
      label: 'Add Task',
      description: 'Create a new task',
      onClick: onAddTask,
      color: 'primary',
    },
    {
      id: 'start-focus',
      icon: '⏱️',
      label: 'Start Focus',
      description: 'Begin a session',
      onClick: () => navigate('/timer'),
      color: 'accent',
    },
    {
      id: 'add-goal',
      icon: '🎯',
      label: 'Add Goal',
      description: 'Set a daily goal',
      onClick: () => navigate('/goals'),
      color: 'success',
    },
    {
      id: 'view-analytics',
      icon: '📈',
      label: 'Analytics',
      description: 'View insights',
      onClick: () => navigate('/analytics'),
      color: 'info',
    },
  ];

  return (
    <div className="quick-actions">
      <h2 className="quick-actions__title">Quick Actions</h2>
      <div className="quick-actions__grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`quick-action-btn quick-action-btn--${action.color}`}
            onClick={action.onClick}
          >
            <span className="quick-action-btn__icon">{action.icon}</span>
            <span className="quick-action-btn__label">{action.label}</span>
            <span className="quick-action-btn__desc">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
