/**
 * AddTaskModal.jsx
 *
 * Modal dialog for adding a new task from the Dashboard.
 * Uses the existing FormInput component and TaskContext.
 *
 * WHY the wrapper pattern?
 * React's Rules of Hooks say hooks must be called in the same order
 * on every render — you cannot call them conditionally or after a
 * conditional return. The outer <AddTaskModal> component renders null
 * when closed; all hooks live in the always-mounted inner component.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 */

import { useState } from 'react';
import FormInput from '../common/FormInput';
import { useTask } from '../../hooks/useTask';
import { useToast } from '../../hooks/useToast';
import { todayISO } from '../../utils/dateHelpers';

const PRIORITIES = [
  { value: 'low',    label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high',   label: '🔴 High' },
];

// Outer guard — only renders the modal DOM when isOpen is true.
// Hooks are kept inside AddTaskModalInner so they always run in the same order.
function AddTaskModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return <AddTaskModalInner onClose={onClose} />;
}

// Inner component — rendered only when the modal is open.
// All hooks live here, so they're always called (never conditionally).
function AddTaskModalInner({ onClose }) {
  const { addTask } = useTask();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(todayISO());
  const [dueTime, setDueTime] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Task title is required');
      return;
    }
    addTask({ title, priority, dueDate: dueDate || null, dueTime: dueTime || null });
    toast.success('Task added!');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add new task"
    >
      <div className="modal-content add-task-modal">
        <div className="add-task-modal__header">
          <h2 className="add-task-modal__title">Add New Task</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-task-modal__form">
          <FormInput
            id="task-title"
            label="Task title"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
            error={titleError}
            placeholder="What do you need to do?"
            autoComplete="off"
          />

          {/* Priority selector */}
          <div className="form-field">
            <label className="form-label" htmlFor="task-priority">Priority</label>
            <div className="priority-selector" id="task-priority">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`priority-btn ${priority === p.value ? 'active' : ''} priority-btn--${p.value}`}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date + time */}
          <div className="add-task-modal__row">
            <div className="form-field">
              <label className="form-label" htmlFor="task-due-date">Due date</label>
              <input
                id="task-due-date"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={todayISO()}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="task-due-time">
                Due time{' '}
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                id="task-due-time"
                type="time"
                className="form-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="add-task-modal__actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
