/**
 * useTimer.js
 *
 * A reliable countdown timer hook using useRef for the interval ID.
 * useRef is critical here — interval IDs must NOT be stored in useState
 * because updating state causes re-renders, which would restart the timer.
 *
 * Usage:
 *   const { timeLeft, isRunning, mode, start, pause, reset, skip, sessions } = useTimer();
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

const MODES = {
  focus:      { label: 'Focus',       defaultMinutes: 25 },
  shortBreak: { label: 'Short Break', defaultMinutes: 5  },
  longBreak:  { label: 'Long Break',  defaultMinutes: 15 },
};

// After this many focus sessions, take a long break
const LONG_BREAK_INTERVAL = 4;

export function useTimer() {
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS, {
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
  });

  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);

  const getDuration = useCallback((mode) => {
    if (mode === 'focus')      return (settings?.focusDuration      ?? 25) * 60;
    if (mode === 'shortBreak') return (settings?.breakDuration       ?? 5)  * 60;
    if (mode === 'longBreak')  return (settings?.longBreakDuration   ?? 15) * 60;
    return 25 * 60;
  }, [settings]);

  const [mode, setMode]         = useState('focus');
  const [timeLeft, setTimeLeft] = useState(() => getDuration('focus'));
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0); // focus sessions this timer instance

  // Store interval ID in a ref — never in state — so updates don't restart the timer
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(null); // callback set by the page

  // Keep timeLeft in sync when settings change (only when not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getDuration(mode));
    }
  }, [settings, mode, getDuration, isRunning]);

  // Core countdown tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            // Notify the page that a session completed
            if (onCompleteRef.current) onCompleteRef.current(mode);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const start  = useCallback(() => setIsRunning(true),  []);
  const pause  = useCallback(() => { clearInterval(intervalRef.current); setIsRunning(false); }, []);
  const reset  = useCallback(() => { clearInterval(intervalRef.current); setIsRunning(false); setTimeLeft(getDuration(mode)); }, [getDuration, mode]);

  const skip = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    // Determine next mode
    const newCount = mode === 'focus' ? sessionCount + 1 : sessionCount;
    if (mode === 'focus') setSessionCount(newCount);
    const nextMode = mode !== 'focus'
      ? 'focus'
      : newCount % LONG_BREAK_INTERVAL === 0 ? 'longBreak' : 'shortBreak';
    setMode(nextMode);
    setTimeLeft(getDuration(nextMode));
  }, [mode, sessionCount, getDuration]);

  const switchMode = useCallback((newMode) => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  }, [getDuration]);

  // Called when a focus session completes — records it to LocalStorage
  const recordSession = useCallback((completedMode, durationMinutes) => {
    if (completedMode !== 'focus') return;
    const record = {
      id: `sess_${Date.now()}`,
      date: new Date().toISOString(),
      duration: durationMinutes,
      type: 'focus',
    };
    setSessions((prev) => [...prev, record]);
    setSessionCount((c) => c + 1);
    const newCount = sessionCount + 1;
    const nextMode = newCount % LONG_BREAK_INTERVAL === 0 ? 'longBreak' : 'shortBreak';
    setMode(nextMode);
    setTimeLeft(getDuration(nextMode));
  }, [setSessions, sessionCount, getDuration]);

  // Register the on-complete callback from the page
  const setOnComplete = useCallback((fn) => { onCompleteRef.current = fn; }, []);

  // Today's stats derived from persisted sessions
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => s.type === 'focus' && new Date(s.date).toDateString() === today
  );
  const todayFocusMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Format seconds → "MM:SS"
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    mode,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    sessionCount,
    todaySessions: todaySessions.length,
    todayFocusMinutes,
    allSessions: sessions,
    modeLabel: MODES[mode]?.label ?? 'Focus',
    totalDuration: getDuration(mode),
    start,
    pause,
    reset,
    skip,
    switchMode,
    recordSession,
    setOnComplete,
  };
}
