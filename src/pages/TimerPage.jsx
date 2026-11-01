import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils/storageKeys";

function TimerPage() {
  const FOCUS_TIME = 25 * 60;
  const SHORT_BREAK_TIME = 5 * 60;

  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const [sessions, setSessions] = useLocalStorage(
    STORAGE_KEYS.SESSIONS,
    []
  );

  const [sessionCount, setSessionCount] = useState(0);

  /* =====================================================
     TIMER
     ===================================================== */

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsRunning(false);

          /* Save completed focus session */
          if (mode === "focus") {
            const newSession = {
              id: `session_${Date.now()}`,
              type: "focus",
              duration: 25,
              date: new Date().toISOString(),
            };

            setSessions((previousSessions) => [
              ...previousSessions,
              newSession,
            ]);

            setSessionCount((previous) => previous + 1);

            setMode("break");

            return SHORT_BREAK_TIME;
          }

          /* Break completed */
          setMode("focus");

          return FOCUS_TIME;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, setSessions]);

  /* =====================================================
     MODE CHANGE
     ===================================================== */

  const changeMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);

    if (newMode === "focus") {
      setTimeLeft(FOCUS_TIME);
    } else {
      setTimeLeft(SHORT_BREAK_TIME);
    }
  };

  /* =====================================================
     RESET
     ===================================================== */

  const handleReset = () => {
    setIsRunning(false);

    if (mode === "focus") {
      setTimeLeft(FOCUS_TIME);
    } else {
      setTimeLeft(SHORT_BREAK_TIME);
    }
  };

  /* =====================================================
     SKIP
     ===================================================== */

  const handleSkip = () => {
    setIsRunning(false);

    if (mode === "focus") {
      setMode("break");
      setTimeLeft(SHORT_BREAK_TIME);
    } else {
      setMode("focus");
      setTimeLeft(FOCUS_TIME);
    }
  };

  /* =====================================================
     TIME DISPLAY
     ===================================================== */

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeLeft % 60)
    .toString()
    .padStart(2, "0");

  const totalTime =
    mode === "focus" ? FOCUS_TIME : SHORT_BREAK_TIME;

  const progress =
    ((totalTime - timeLeft) / totalTime) * 100;

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="page-content timer-page">

      {/* Header */}
      <div className="timer-header">
        <div>
          <h1 className="page-title">Focus Timer</h1>

          <p className="page-subtitle">
            Stay focused, take meaningful breaks, and get things done.
          </p>
        </div>
      </div>

      {/* Timer Container */}
      <div className="timer-container">

        {/* Mode Switch */}
        <div className="timer-mode-switch">

          <button
            className={mode === "focus" ? "active" : ""}
            onClick={() => changeMode("focus")}
          >
            🎯 Focus
          </button>

          <button
            className={mode === "break" ? "active" : ""}
            onClick={() => changeMode("break")}
          >
            ☕ Short Break
          </button>

        </div>

        {/* Mode Label */}
        <div className="timer-mode-label">
          {mode === "focus"
            ? "Time to focus"
            : "Take a short break"}
        </div>

        {/* Circular Timer */}
        <div className="timer-circle">

          <div className="timer-progress">

            <svg
              viewBox="0 0 220 220"
              className="timer-svg"
            >

              <circle
                className="timer-circle-bg"
                cx="110"
                cy="110"
                r="95"
              />

              <circle
                className="timer-circle-progress"
                cx="110"
                cy="110"
                r="95"
                style={{
                  strokeDasharray: `${2 * Math.PI * 95}`,
                  strokeDashoffset:
                    `${2 * Math.PI * 95 * (1 - progress / 100)}`,
                }}
              />

            </svg>

            <div className="timer-time">
              {minutes}:{seconds}
            </div>

          </div>

        </div>

        {/* Start / Pause */}
        <button
          className="timer-start-btn"
          onClick={() =>
            setIsRunning((previous) => !previous)
          }
        >
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>

        {/* Secondary Controls */}
        <div className="timer-secondary-controls">

          <button onClick={handleReset}>
            🔄 Reset
          </button>

          <button onClick={handleSkip}>
            ⏭️ Skip
          </button>

        </div>

        {/* Session Count */}
        <div className="timer-session-card">

          <div className="session-icon">
            🏆
          </div>

          <div>
            <span>
              Focus Sessions Completed
            </span>

            <strong>
              {sessionCount}
            </strong>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TimerPage;