import React, { useEffect, useState } from "react";
import { useTask } from "../hooks/useTask";

function SettingsPage() {
  const { tasks } = useTask();

  // ============================================
  // DEFAULT SETTINGS
  // ============================================

  const DEFAULT_NAME = "Alex Johnson";
  const DEFAULT_EMAIL = "alex.johnson@gmail.com";
  const DEFAULT_NOTIFICATIONS = true;
  const DEFAULT_SOUND = true;
  const DEFAULT_AUTO_START_BREAK = false;
  const DEFAULT_FOCUS_DURATION = 25;

  // ============================================
  // PROFILE STATE
  // ============================================

  const [name, setName] = useState(() => {
    return (
      localStorage.getItem("focusnest_name") ||
      DEFAULT_NAME
    );
  });

  const [email, setEmail] = useState(() => {
    return (
      localStorage.getItem("focusnest_email") ||
      DEFAULT_EMAIL
    );
  });

  // ============================================
  // NOTIFICATION STATE
  // ============================================

  const [notifications, setNotifications] = useState(() => {
    return (
      localStorage.getItem("focusnest_notifications") !==
      "false"
    );
  });

  const [sound, setSound] = useState(() => {
    return (
      localStorage.getItem("focusnest_sound") !==
      "false"
    );
  });

  // ============================================
  // TIMER STATE
  // ============================================

  const [autoStartBreak, setAutoStartBreak] = useState(() => {
    return (
      localStorage.getItem("focusnest_auto_break") ===
      "true"
    );
  });

  const [focusDuration, setFocusDuration] = useState(() => {
    return Number(
      localStorage.getItem("focusnest_focus_duration") ||
        DEFAULT_FOCUS_DURATION
    );
  });

  // ============================================
  // SUCCESS MESSAGE
  // ============================================

  const [message, setMessage] = useState("");

  // ============================================
  // SAVE NAME
  // ============================================

  useEffect(() => {
    localStorage.setItem(
      "focusnest_name",
      name
    );
  }, [name]);

  // ============================================
  // SAVE EMAIL
  // ============================================

  useEffect(() => {
    localStorage.setItem(
      "focusnest_email",
      email
    );
  }, [email]);

  // ============================================
  // SAVE NOTIFICATIONS
  // ============================================

  useEffect(() => {
    localStorage.setItem(
      "focusnest_notifications",
      String(notifications)
    );
  }, [notifications]);

  // ============================================
  // SAVE SOUND
  // ============================================

  useEffect(() => {
    localStorage.setItem(
      "focusnest_sound",
      String(sound)
    );
  }, [sound]);

  // ============================================
  // SAVE AUTO START BREAK
  // ============================================

  useEffect(() => {
    localStorage.setItem(
      "focusnest_auto_break",
      String(autoStartBreak)
    );
  }, [autoStartBreak]);

  // ============================================
  // SAVE FOCUS DURATION
  // ============================================

  useEffect(() => {
    localStorage.setItem(
      "focusnest_focus_duration",
      String(focusDuration)
    );
  }, [focusDuration]);

  // ============================================
  // SAVE PROFILE
  // ============================================

  const saveProfile = () => {
    localStorage.setItem(
      "focusnest_name",
      name
    );

    localStorage.setItem(
      "focusnest_email",
      email
    );

    setMessage(
      "Profile updated successfully!"
    );

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ============================================
  // DELETE ALL TASKS
  // ============================================

  const clearTasks = () => {
    const confirmed = window.confirm(
      "This will permanently delete all your tasks. Continue?"
    );

    if (!confirmed) return;

    // Correct TaskContext storage key
    localStorage.removeItem(
      "focusnest_tasks"
    );

    setMessage(
      "All tasks deleted successfully!"
    );

    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  // ============================================
  // DELETE ALL GOALS
  // ============================================

  const clearGoals = () => {
    const confirmed = window.confirm(
      "This will permanently delete all your goals. Continue?"
    );

    if (!confirmed) return;

    localStorage.removeItem(
      "focusnest_goals"
    );

    setMessage(
      "All goals deleted successfully!"
    );

    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  // ============================================
  // RESET COMPLETE FOCUSNEST APPLICATION
  // ============================================

  const resetSettings = () => {
    const confirmed = window.confirm(
      "This will reset all FocusNest data and settings. Tasks, goals, focus sessions and streak data will be deleted. Continue?"
    );

    if (!confirmed) return;

    // ==========================================
    // RESET PROFILE
    // ==========================================

    localStorage.setItem(
      "focusnest_name",
      DEFAULT_NAME
    );

    localStorage.setItem(
      "focusnest_email",
      DEFAULT_EMAIL
    );

    // ==========================================
    // RESET NOTIFICATIONS
    // ==========================================

    localStorage.setItem(
      "focusnest_notifications",
      String(DEFAULT_NOTIFICATIONS)
    );

    // ==========================================
    // RESET SOUND
    // ==========================================

    localStorage.setItem(
      "focusnest_sound",
      String(DEFAULT_SOUND)
    );

    // ==========================================
    // RESET AUTO BREAK
    // ==========================================

    localStorage.setItem(
      "focusnest_auto_break",
      String(DEFAULT_AUTO_START_BREAK)
    );

    // ==========================================
    // RESET FOCUS DURATION
    // ==========================================

    localStorage.setItem(
      "focusnest_focus_duration",
      String(DEFAULT_FOCUS_DURATION)
    );

    // ==========================================
    // RESET TASKS
    // ==========================================

    localStorage.removeItem(
      "focusnest_tasks"
    );

    // ==========================================
    // RESET GOALS
    // ==========================================

    localStorage.removeItem(
      "focusnest_goals"
    );

    // ==========================================
    // RESET FOCUS SESSIONS
    // ==========================================

    localStorage.removeItem(
      "focusnest_sessions"
    );

    // ==========================================
    // RESET STREAK
    // ==========================================

    localStorage.removeItem(
      "focusnest_streak"
    );

    // ==========================================
    // RESET ANALYTICS
    // ==========================================

    localStorage.removeItem(
      "focusnest_analytics"
    );

    // ==========================================
    // RESET REACT STATE
    // ==========================================

    setName(DEFAULT_NAME);

    setEmail(DEFAULT_EMAIL);

    setNotifications(
      DEFAULT_NOTIFICATIONS
    );

    setSound(
      DEFAULT_SOUND
    );

    setAutoStartBreak(
      DEFAULT_AUTO_START_BREAK
    );

    setFocusDuration(
      DEFAULT_FOCUS_DURATION
    );

    // ==========================================
    // SUCCESS MESSAGE
    // ==========================================

    setMessage(
      "FocusNest has been completely reset!"
    );

    // ==========================================
    // RELOAD APPLICATION
    // ==========================================

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page-content settings-page">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="settings-header">

        <div>

          <h1 className="page-title">
            Settings
          </h1>

          <p className="page-subtitle">
            Customize FocusNest according to your
            preferences.
          </p>

        </div>

      </div>

      {/* ========================================
          PROFILE
          ======================================== */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-section-icon purple">
            👤
          </div>

          <div>

            <h2>
              Profile
            </h2>

            <p>
              Manage your personal information.
            </p>

          </div>

        </div>

        <div className="settings-divider" />

        <div className="profile-settings">

          <div className="profile-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-form">

            <div className="settings-form-row">

              {/* Full Name */}

              <div className="settings-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              {/* Email */}

              <div className="settings-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            <button
              className="settings-primary-btn"
              onClick={saveProfile}
            >
              Save Changes
            </button>

          </div>

        </div>

      </section>

      {/* ========================================
          NOTIFICATIONS
          ======================================== */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-section-icon blue">
            🔔
          </div>

          <div>

            <h2>
              Notifications
            </h2>

            <p>
              Control how FocusNest keeps you informed.
            </p>

          </div>

        </div>

        <div className="settings-divider" />

        {/* Task Notifications */}

        <div className="setting-option">

          <div>

            <h3>
              Task Notifications
            </h3>

            <p>
              Receive reminders about upcoming tasks.
            </p>

          </div>

          <button
            className={`toggle-switch ${
              notifications ? "active" : ""
            }`}
            onClick={() =>
              setNotifications(
                !notifications
              )
            }
            aria-label="Toggle notifications"
          >

            <span />

          </button>

        </div>

        {/* Timer Sound */}

        <div className="setting-option">

          <div>

            <h3>
              Timer Sound
            </h3>

            <p>
              Play a sound when a focus session ends.
            </p>

          </div>

          <button
            className={`toggle-switch ${
              sound ? "active" : ""
            }`}
            onClick={() =>
              setSound(!sound)
            }
            aria-label="Toggle timer sound"
          >

            <span />

          </button>

        </div>

      </section>

      {/* ========================================
          FOCUS TIMER
          ======================================== */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-section-icon orange">
            🍅
          </div>

          <div>

            <h2>
              Focus Timer
            </h2>

            <p>
              Customize your productivity sessions.
            </p>

          </div>

        </div>

        <div className="settings-divider" />

        {/* Focus Duration */}

        <div className="setting-option">

          <div>

            <h3>
              Focus Duration
            </h3>

            <p>
              Choose how long a focus session should
              last.
            </p>

          </div>

          <select
            className="settings-select"
            value={focusDuration}
            onChange={(e) =>
              setFocusDuration(
                Number(e.target.value)
              )
            }
          >

            <option value={15}>
              15 minutes
            </option>

            <option value={20}>
              20 minutes
            </option>

            <option value={25}>
              25 minutes
            </option>

            <option value={30}>
              30 minutes
            </option>

            <option value={45}>
              45 minutes
            </option>

            <option value={60}>
              60 minutes
            </option>

          </select>

        </div>

        {/* Auto Start Break */}

        <div className="setting-option">

          <div>

            <h3>
              Auto Start Break
            </h3>

            <p>
              Automatically begin the break after a
              focus session.
            </p>

          </div>

          <button
            className={`toggle-switch ${
              autoStartBreak ? "active" : ""
            }`}
            onClick={() =>
              setAutoStartBreak(
                !autoStartBreak
              )
            }
            aria-label="Toggle auto start break"
          >

            <span />

          </button>

        </div>

      </section>

      {/* ========================================
          PRODUCTIVITY
          ======================================== */}

      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-section-icon green">
            📊
          </div>

          <div>

            <h2>
              Productivity
            </h2>

            <p>
              View your current productivity data.
            </p>

          </div>

        </div>

        <div className="settings-divider" />

        <div className="settings-mini-stats">

          {/* Total Tasks */}

          <div>

            <span>
              Total Tasks
            </span>

            <strong>
              {tasks.length}
            </strong>

          </div>

          {/* Completed Tasks */}

          <div>

            <span>
              Completed Tasks
            </span>

            <strong>

              {
                tasks.filter(
                  (task) =>
                    task.status === "completed"
                ).length
              }

            </strong>

          </div>

          {/* Pending Tasks */}

          <div>

            <span>
              Pending Tasks
            </span>

            <strong>

              {
                tasks.filter(
                  (task) =>
                    task.status === "pending"
                ).length
              }

            </strong>

          </div>

        </div>

      </section>

      {/* ========================================
          DATA MANAGEMENT
          ======================================== */}

      <section className="settings-card danger-card">

        <div className="settings-card-header">

          <div className="settings-section-icon red">
            🗑️
          </div>

          <div>

            <h2>
              Data Management
            </h2>

            <p>
              Manage your FocusNest stored data.
            </p>

          </div>

        </div>

        <div className="settings-divider" />

        {/* Delete Tasks */}

        <div className="data-actions">

          <div>

            <h3>
              Delete Tasks
            </h3>

            <p>
              Permanently remove all saved tasks.
            </p>

          </div>

          <button
            className="danger-btn"
            onClick={clearTasks}
          >
            Delete Tasks
          </button>

        </div>

        {/* Delete Goals */}

        <div className="data-actions">

          <div>

            <h3>
              Delete Goals
            </h3>

            <p>
              Permanently remove all saved goals.
            </p>

          </div>

          <button
            className="danger-btn"
            onClick={clearGoals}
          >
            Delete Goals
          </button>

        </div>

        {/* Reset Entire Application */}

        <div className="data-actions">

          <div>

            <h3>
              Reset FocusNest
            </h3>

            <p>
              Reset all tasks, goals, sessions,
              streaks and preferences to their defaults.
            </p>

          </div>

          <button
            className="reset-btn"
            onClick={resetSettings}
          >
            Reset
          </button>

        </div>

      </section>

      {/* ========================================
          SUCCESS MESSAGE
          ======================================== */}

      {message && (

        <div className="settings-success">
          ✅ {message}
        </div>

      )}

    </div>
  );
}

export default SettingsPage;