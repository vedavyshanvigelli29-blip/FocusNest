
import React, { useMemo } from "react";
import { useTask } from "../hooks/useTask";

function AnalyticsPage() {
  const {
    tasks,
    totalTasks,
    completedTasks,
    pendingTasks,
  } = useTask();

  /* Goals from LocalStorage */
  const goals = useMemo(() => {
    try {
      const saved = localStorage.getItem("focusnest_goals");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  /* Focus sessions from LocalStorage */
  const focusSessions = Number(
    localStorage.getItem("focusnest_focus_sessions") || 0
  );

  /* Completion percentage */
  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  /* Goals statistics */
  const completedGoals = goals.filter(
    (goal) => goal.progress >= goal.target
  ).length;

  const goalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((total, goal) => {
            if (!goal.target) return total;

            return (
              total +
              Math.min(
                (goal.progress / goal.target) * 100,
                100
              )
            );
          }, 0) / goals.length
        )
      : 0;

  /* Priority statistics */
  const highPriority = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  const mediumPriority = tasks.filter(
    (task) => task.priority === "medium"
  ).length;

  const lowPriority = tasks.filter(
    (task) => task.priority === "low"
  ).length;

  /* Weekly task activity */
  const weekData = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);

      date.setDate(
        today.getDate() - (6 - index)
      );

      const dateString = date
        .toISOString()
        .split("T")[0];

      const completed = tasks.filter((task) => {
        if (!task.completedAt) return false;

        return (
          task.completedAt.split("T")[0] ===
          dateString
        );
      }).length;

      return {
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        completed,
      };
    });
  }, [tasks]);

  const maxActivity = Math.max(
    ...weekData.map((day) => day.completed),
    1
  );

  return (
    <div className="page-content analytics-page">

      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="page-title">
            Analytics
          </h1>

          <p className="page-subtitle">
            Understand your productivity and track
            your progress.
          </p>
        </div>

        <div className="analytics-period">
          📅 Last 7 Days
        </div>
      </div>

      {/* Main Statistics */}
      <div className="analytics-stat-grid">

        <div className="analytics-stat-card">
          <div className="analytics-icon purple">
            📋
          </div>

          <div>
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon green">
            ✅
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon orange">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-icon blue">
            🎯
          </div>

          <div>
            <span>Completion Rate</span>
            <strong>{completionRate}%</strong>
          </div>
        </div>

      </div>

      {/* Charts row */}
      <div className="analytics-grid">

        {/* Weekly Activity */}
        <div className="analytics-card activity-card">

          <div className="analytics-card-header">
            <div>
              <h2>Weekly Activity</h2>
              <p>
                Completed tasks over the last 7 days
              </p>
            </div>
          </div>

          <div className="activity-chart">

            {weekData.map((day) => {
              const height =
                day.completed === 0
                  ? 5
                  : Math.max(
                      (day.completed /
                        maxActivity) *
                        100,
                      10
                    );

              return (
                <div
                  className="activity-column"
                  key={day.day}
                >
                  <div className="activity-value">
                    {day.completed}
                  </div>

                  <div className="activity-bar-wrapper">
                    <div
                      className="activity-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span>
                    {day.day}
                  </span>
                </div>
              );
            })}

          </div>

        </div>

        {/* Completion */}
        <div className="analytics-card completion-card">

          <div className="analytics-card-header">
            <div>
              <h2>Task Completion</h2>
              <p>
                Overall task performance
              </p>
            </div>
          </div>

          <div className="completion-content">

            <div
              className="completion-circle"
              style={{
                background: `conic-gradient(
                  #6366f1 ${completionRate * 3.6}deg,
                  #29344f ${completionRate * 3.6}deg
                )`,
              }}
            >
              <div className="completion-circle-inner">
                <strong>
                  {completionRate}%
                </strong>
                <span>
                  Complete
                </span>
              </div>
            </div>

            <div className="completion-legend">

              <div>
                <span className="legend-dot completed-dot" />
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>

              <div>
                <span className="legend-dot pending-dot" />
                <span>Pending</span>
                <strong>{pendingTasks}</strong>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom row */}
      <div className="analytics-grid bottom-grid">

        {/* Priority */}
        <div className="analytics-card">

          <div className="analytics-card-header">
            <div>
              <h2>Task Priority</h2>
              <p>
                Distribution of your tasks
              </p>
            </div>
          </div>

          <div className="priority-list">

            <div className="priority-row">
              <div className="priority-label">
                <span className="priority-dot high" />
                <span>High</span>
              </div>

              <strong>{highPriority}</strong>
            </div>

            <div className="priority-progress">
              <div
                className="priority-fill high-fill"
                style={{
                  width: `${
                    totalTasks
                      ? (highPriority /
                          totalTasks) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="priority-row">
              <div className="priority-label">
                <span className="priority-dot medium" />
                <span>Medium</span>
              </div>

              <strong>{mediumPriority}</strong>
            </div>

            <div className="priority-progress">
              <div
                className="priority-fill medium-fill"
                style={{
                  width: `${
                    totalTasks
                      ? (mediumPriority /
                          totalTasks) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="priority-row">
              <div className="priority-label">
                <span className="priority-dot low" />
                <span>Low</span>
              </div>

              <strong>{lowPriority}</strong>
            </div>

            <div className="priority-progress">
              <div
                className="priority-fill low-fill"
                style={{
                  width: `${
                    totalTasks
                      ? (lowPriority /
                          totalTasks) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* Productivity Summary */}
        <div className="analytics-card">

          <div className="analytics-card-header">
            <div>
              <h2>Productivity Summary</h2>
              <p>
                Your current productivity overview
              </p>
            </div>
          </div>

          <div className="summary-list">

            <div className="summary-item">
              <div className="summary-icon">
                🍅
              </div>

              <div>
                <span>Focus Sessions</span>
                <strong>
                  {focusSessions}
                </strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon">
                🎯
              </div>

              <div>
                <span>Goals Completed</span>
                <strong>
                  {completedGoals} / {goals.length}
                </strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon">
                📈
              </div>

              <div>
                <span>Goal Progress</span>
                <strong>
                  {goalProgress}%
                </strong>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Productivity message */}
      <div className="analytics-insight">

        <div className="insight-icon">
          💡
        </div>

        <div>
          <h3>
            {completionRate >= 70
              ? "Excellent productivity!"
              : completionRate >= 40
              ? "You're making good progress!"
              : "Let's build your momentum!"}
          </h3>

          <p>
            {completionRate >= 70
              ? "You're completing most of your tasks. Keep up the great work."
              : completionRate >= 40
              ? "You're making steady progress. Keep focusing on your important tasks."
              : "Start with a few important tasks and use the Focus Timer to stay consistent."}
          </p>
        </div>

      </div>

    </div>
  );
}

export default AnalyticsPage;
