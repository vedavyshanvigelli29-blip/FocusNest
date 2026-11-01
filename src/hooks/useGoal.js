import { useContext } from 'react';
import { GoalContext } from '../context/goalContextObject';

export function useGoal() {
  const ctx = useContext(GoalContext);
  if (!ctx) throw new Error('useGoal must be inside GoalProvider');
  return ctx;
}
