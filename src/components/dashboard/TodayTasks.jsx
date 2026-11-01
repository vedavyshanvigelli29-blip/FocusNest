/**
 * TodayTasks.jsx
 *
 * Shows today's tasks on the Dashboard.
 * Each task has a checkbox to toggle completion.
 *
 * All task data comes from TaskContext, so changes
 * are immediately reflected throughout the application.
 */

import { useState } from "react";
import { useTask } from "../../hooks/useTask";
import {
  isToday,
  formatDateShort,
  formatTime,
} from "../../utils/dateHelpers";
import AddTaskModal from "./AddTaskModal";

const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function TodayTasks() {
  const { tasks, toggleTask } = useTask();

  const [isModalOpen, setIsModalOpen] = useState(false);

  /*
   * Tasks with today's due date.
   */
  const todayTasks = tasks.filter(
    (task) => task.dueDate && isToday(task.dueDate)
  );

  /*
   * Pending tasks without a due date.
   * These are shown as general tasks for today.
   */
  const undatedPending = tasks
    .filter(
      (task) =>
        !task.dueDate &&
        task.status === "pending"
    )
    .slice(
      0,
      Math.max(0, 5 - todayTasks.length)
    );

  /*
   * Maximum 5 tasks are displayed on the dashboard.
   */
  const displayTasks = [
    ...todayTasks,
    ...undatedPending,
  ].slice(0, 5);

  /*
   * Calculate completion based on the tasks
   * actually displayed on the dashboard.
   */
  const completedDisplayTasks = displayTasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <>
      <div className="dashboard-card">

        {/* Header */}
        <div className="dashboard-card__header">

          <div>
            <h2 className="dashboard-card__title">
              Today's Tasks
            </h2>

            <p className="dashboard-card__subtitle">
              {completedDisplayTasks} of{" "}
              {displayTasks.length} completed
            </p>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Task
          </button>

        </div>

        {/* Task List */}
        <div className="task-list">

          {displayTasks.length === 0 ? (

            <div className="task-empty-state">

              <span className="task-empty-state__icon">
                ✅
              </span>

              <p className="task-empty-state__text">
                No tasks for today
              </p>

              <p className="task-empty-state__hint">
                Click "+ Add Task" to get started
              </p>

            </div>

          ) : (

            displayTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
              />
            ))

          )}

        </div>

        {/* More Tasks */}
        {tasks.length > displayTasks.length && (
          <div className="task-list__footer">

            <span className="task-list__more">
              {tasks.length - displayTasks.length} more tasks
            </span>

          </div>
        )}

      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </>
  );
}

/*
 * Individual task row.
 */
function TaskRow({ task, onToggle }) {

  const isCompleted =
    task.status === "completed";

  return (
    <div
      className={`task-row ${
        isCompleted
          ? "task-row--completed"
          : ""
      }`}
    >

      {/* Checkbox */}
      <button
        className={`task-checkbox ${
          isCompleted
            ? "task-checkbox--checked"
            : ""
        }`}
        onClick={() => onToggle(task.id)}
        aria-label={
          isCompleted
            ? `Mark "${task.title}" as pending`
            : `Complete "${task.title}"`
        }
        role="checkbox"
        aria-checked={isCompleted}
      >
        {isCompleted && (
          <span className="task-checkbox__check">
            ✓
          </span>
        )}
      </button>

      {/* Task Information */}
      <div className="task-row__info">

        <span
          className={`task-row__title ${
            isCompleted
              ? "task-row__title--done"
              : ""
          }`}
        >
          {task.title}
        </span>

        <div className="task-row__meta">

          {task.dueDate && (
            <span className="task-row__due">

              📅 {formatDateShort(task.dueDate)}

              {task.dueTime &&
                ` · ${formatTime(task.dueTime)}`}

            </span>
          )}

        </div>

      </div>

      {/* Priority */}
      <span
        className={`priority-badge priority-badge--${task.priority}`}
      >
        {PRIORITY_LABELS[task.priority]}
      </span>

    </div>
  );
}

export default TodayTasks;