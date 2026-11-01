import React, { useMemo, useState } from "react";
import { useTask } from "../hooks/useTask";
import TaskCard from "../components/tasks/TaskCard";
import AddTaskModal from "../components/tasks/TaskModel";

function TasksPage() {
  const {
    tasks,
    totalTasks,
    completedTasks,
    pendingTasks,
  } = useTask();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && task.status === "pending") ||
        (filter === "completed" && task.status === "completed") ||
        (filter === "high" && task.priority === "high");

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  return (
    <div className="page-content tasks-page">

      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">
            Organize your work and stay productive.
          </p>
        </div>

        <button
          className="add-task-main-btn"
          onClick={openCreateModal}
        >
          + Add Task
        </button>
      </div>

      {/* Statistics */}
      <div className="task-stat-grid">

        <div className="task-stat-card">
          <div className="stat-icon blue">📋</div>
          <div>
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="stat-icon orange">⏳</div>
          <div>
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

      </div>

      {/* Search + Filters */}
      <div className="task-toolbar">

        <div className="task-search">
          🔍
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="task-filters">

          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button
            className={filter === "high" ? "active" : ""}
            onClick={() => setFilter("high")}
          >
            🔥 High Priority
          </button>

        </div>

      </div>

      {/* Task list */}
      <div className="tasks-section">

        <div className="tasks-section-header">
          <div>
            <h2>
              {filter === "all"
                ? "All Tasks"
                : filter === "pending"
                ? "Pending Tasks"
                : filter === "completed"
                ? "Completed Tasks"
                : "High Priority Tasks"}
            </h2>

            <span>{filteredTasks.length} tasks</span>
          </div>

          <button
            className="quick-add-btn"
            onClick={openCreateModal}
          >
            + New Task
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-tasks">

            <div className="empty-task-icon">
              📝
            </div>

            <h3>
              {search
                ? "No tasks found"
                : "No tasks yet"}
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "Create your first task and start being productive."}
            </p>

            {!search && (
              <button
                className="add-task-main-btn"
                onClick={openCreateModal}
              >
                + Create Your First Task
              </button>
            )}

          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
              />
            ))}
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingTask={editingTask}
      />

    </div>
  );
}

export default TasksPage;