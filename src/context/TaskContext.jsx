/**
 * TaskContext.jsx
 *
 * Global state for the Tasks feature.
 * Provides CRUD operations for tasks, all persisted to LocalStorage.
 *
 * This file exports only the Provider component (TaskProvider).
 * The useTask hook lives in src/hooks/useTask.js — keeping them
 * separate satisfies Vite's Fast Refresh requirement.
 *
 * Task data shape:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   priority: 'low' | 'medium' | 'high',
 *   status: 'pending' | 'completed',
 *   dueDate: string | null,   // ISO date string "YYYY-MM-DD"
 *   dueTime: string | null,   // "HH:MM" 24-hour
 *   createdAt: string,        // ISO datetime
 *   completedAt: string|null, // ISO datetime or null
 * }
 */

import { useCallback } from 'react';
import { TaskContext } from './taskContextObject';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

const generateTaskId = () =>
  `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export function TaskProvider({ children }) {
  // useLocalStorage keeps tasks in sync with LocalStorage automatically
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);

  // ─── addTask ───────────────────────────────────────────────────────────────
  const addTask = useCallback(
    ({ title, description = '', priority = 'medium', dueDate = null, dueTime = null }) => {
      const newTask = {
        id: generateTaskId(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'pending',
        dueDate,
        dueTime,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    [setTasks]
  );

  // ─── toggleTask ─────────────────────────────────────────────────────────────
  // Flips a task between 'pending' and 'completed'.
  const toggleTask = useCallback(
    (taskId) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          const isCompleting = task.status === 'pending';
          return {
            ...task,
            status: isCompleting ? 'completed' : 'pending',
            completedAt: isCompleting ? new Date().toISOString() : null,
          };
        })
      );
    },
    [setTasks]
  );

  // ─── updateTask ────────────────────────────────────────────────────────────
  const updateTask = useCallback(
    (taskId, updates) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      );
    },
    [setTasks]
  );

  // ─── deleteTask ────────────────────────────────────────────────────────────
  const deleteTask = useCallback(
    (taskId) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    },
    [setTasks]
  );

  const value = {
    tasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    // Derived counts — computed here so every consumer gets the same numbers
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'completed').length,
    pendingTasks: tasks.filter((t) => t.status === 'pending').length,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
