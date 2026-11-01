/**
 * GoalContext.jsx — Goal state management
 * Exports only GoalProvider (component-only file for Vite Fast Refresh).
 * The useGoal hook lives in src/hooks/useGoal.js.
 *
 * Goal data shape:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   targetDate: string | null,  // "YYYY-MM-DD"
 *   completed: boolean,
 *   completedAt: string | null, // ISO datetime
 *   createdAt: string,
 * }
 */
import { useCallback } from 'react';
import { GoalContext } from './goalContextObject';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

const genId = () => `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export function GoalProvider({ children }) {
  const [goals, setGoals] = useLocalStorage(STORAGE_KEYS.GOALS, []);

  const addGoal = useCallback(({ title, description = '', targetDate = null }) => {
    const g = {
      id: genId(),
      title: title.trim(),
      description: description.trim(),
      targetDate,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [g, ...prev]);
    return g;
  }, [setGoals]);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, [setGoals]);

  const toggleGoal = useCallback((id) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const completing = !g.completed;
      return { ...g, completed: completing, completedAt: completing ? new Date().toISOString() : null };
    }));
  }, [setGoals]);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, [setGoals]);

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, toggleGoal, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
}
