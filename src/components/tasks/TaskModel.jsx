import React, { useEffect, useState } from "react";
import { useTask } from "../../hooks/useTask";

function AddTaskModal({ isOpen, onClose, editingTask }) {
  const { addTask, updateTask } = useTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
      setDueDate(editingTask.dueDate || "");
      setDueTime(editingTask.dueTime || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
    }

    setError("");
  }, [editingTask, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="task-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
            <p>
              {editingTask
                ? "Update your task details."
                : "Add something you want to accomplish."}
            </p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input
            type="text"
            placeholder="e.g. Complete Java assignment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />

          <div className="form-row">
            <div>
              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label>Due Date</label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <label>Due Time</label>

          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="save-task-btn">
              {editingTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;