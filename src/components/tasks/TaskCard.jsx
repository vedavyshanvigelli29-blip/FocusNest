import React from "react";
import { useTask } from "../../hooks/useTask";

function TaskCard({ task, onEdit }) {
  const { toggleTask, deleteTask } = useTask();

  const priorityClass = `task-priority ${task.priority}`;

  return (
    <div className={`task-card ${task.status === "completed" ? "completed" : ""}`}>
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={() => toggleTask(task.id)}
          className="task-checkbox"
        />

        <div className="task-content">
          <h3>{task.title}</h3>

          {task.description && (
            <p>{task.description}</p>
          )}

          <div className="task-meta">
            <span className={priorityClass}>
              {task.priority}
            </span>

            {task.dueDate && (
              <span className="task-date">
                📅 {task.dueDate}
              </span>
            )}

            {task.dueTime && (
              <span className="task-time">
                ⏰ {task.dueTime}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={() => {
            if (window.confirm("Delete this task?")) {
              deleteTask(task.id);
            }
          }}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskCard;