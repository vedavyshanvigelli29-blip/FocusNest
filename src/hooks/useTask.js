/**
 * useTask.js
 *
 * Hook for consuming TaskContext.
 * Kept in its own file to satisfy Vite Fast Refresh.
 *
 * Usage:
 *   const { tasks, addTask, toggleTask, totalTasks } = useTask();
 */
import { useContext } from 'react';
import { TaskContext } from '../context/taskContextObject';

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used inside a <TaskProvider>');
  }
  return context;
}
