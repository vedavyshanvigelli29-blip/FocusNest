
import React, { useEffect, useState } from "react";

function GoalsPage() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("focusnest_goals");

    return savedGoals
      ? JSON.parse(savedGoals)
      : [
          {
            id: 1,
            title: "Complete Java Practice",
            description: "Solve 5 Java problems today",
            target: 5,
            progress: 2,
          },
          {
            id: 2,
            title: "Study for 2 Hours",
            description: "Focus on college subjects",
            target: 2,
            progress: 1,
          },
        ];
  });

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "focusnest_goals",
      JSON.stringify(goals)
    );
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();

    if (!title.trim() || !target) {
      return;
    }

    const newGoal = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      target: Number(target),
      progress: 0,
    };

    setGoals((previous) => [newGoal, ...previous]);

    setTitle("");
    setDescription("");
    setTarget("");

    setShowModal(false);
  };

  const increaseProgress = (id) => {
    setGoals((previous) =>
      previous.map((goal) => {
        if (goal.id !== id) return goal;

        return {
          ...goal,
          progress: Math.min(
            goal.progress + 1,
            goal.target
          ),
        };
      })
    );
  };

  const decreaseProgress = (id) => {
    setGoals((previous) =>
      previous.map((goal) => {
        if (goal.id !== id) return goal;

        return {
          ...goal,
          progress: Math.max(
            goal.progress - 1,
            0
          ),
        };
      })
    );
  };

  const deleteGoal = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    setGoals((previous) =>
      previous.filter((goal) => goal.id !== id)
    );
  };

  const completedGoals = goals.filter(
    (goal) => goal.progress >= goal.target
  ).length;

  const totalProgress = goals.reduce(
    (total, goal) => {
      if (goal.target === 0) return total;

      return (
        total +
        Math.min(
          (goal.progress / goal.target) * 100,
          100
        )
      );
    },
    0
  );

  const overallProgress =
    goals.length > 0
      ? Math.round(totalProgress / goals.length)
      : 0;

  return (
    <div className="page-content goals-page">

      {/* Header */}
      <div className="goals-header">

        <div>
          <h1 className="page-title">
            Daily Goals
          </h1>

          <p className="page-subtitle">
            Set goals, track your progress, and make
            every day count.
          </p>
        </div>

        <button
          className="add-goal-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Goal
        </button>

      </div>

      {/* Statistics */}
      <div className="goal-stat-grid">

        <div className="goal-stat-card">
          <div className="goal-stat-icon purple">
            🎯
          </div>

          <div>
            <span>Total Goals</span>
            <strong>{goals.length}</strong>
          </div>
        </div>

        <div className="goal-stat-card">
          <div className="goal-stat-icon green">
            ✅
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedGoals}</strong>
          </div>
        </div>

        <div className="goal-stat-card">
          <div className="goal-stat-icon blue">
            📈
          </div>

          <div>
            <span>Overall Progress</span>
            <strong>{overallProgress}%</strong>
          </div>
        </div>

      </div>

      {/* Goals */}
      <div className="goals-section">

        <div className="goals-section-header">

          <div>
            <h2>Your Goals</h2>

            <span>
              {goals.length} goal
              {goals.length !== 1 ? "s" : ""}
            </span>
          </div>

          <span className="today-label">
            Today
          </span>

        </div>

        {goals.length === 0 ? (

          <div className="empty-goals">

            <div className="empty-goal-icon">
              🎯
            </div>

            <h3>
              No goals yet
            </h3>

            <p>
              Create your first daily goal and start
              making progress.
            </p>

            <button
              className="add-goal-btn"
              onClick={() => setShowModal(true)}
            >
              + Create Goal
            </button>

          </div>

        ) : (

          <div className="goals-list">

            {goals.map((goal) => {

              const percentage =
                goal.target > 0
                  ? Math.min(
                      Math.round(
                        (goal.progress /
                          goal.target) *
                          100
                      ),
                      100
                    )
                  : 0;

              const completed =
                goal.progress >= goal.target;

              return (
                <div
                  className={`goal-card ${
                    completed
                      ? "goal-completed"
                      : ""
                  }`}
                  key={goal.id}
                >

                  <div className="goal-card-top">

                    <div className="goal-info">

                      <div className="goal-check">
                        {completed ? "✓" : "🎯"}
                      </div>

                      <div>
                        <h3>
                          {goal.title}
                        </h3>

                        {goal.description && (
                          <p>
                            {goal.description}
                          </p>
                        )}
                      </div>

                    </div>

                    <button
                      className="goal-delete-btn"
                      onClick={() =>
                        deleteGoal(goal.id)
                      }
                      title="Delete goal"
                    >
                      🗑️
                    </button>

                  </div>

                  {/* Progress */}
                  <div className="goal-progress-area">

                    <div className="goal-progress-info">

                      <span>
                        Progress
                      </span>

                      <strong>
                        {goal.progress} /{" "}
                        {goal.target}
                      </strong>

                    </div>

                    <div className="goal-progress-bar">

                      <div
                        className="goal-progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <div className="goal-percentage">
                      {percentage}% complete
                    </div>

                  </div>

                  {/* Controls */}
                  <div className="goal-controls">

                    <button
                      onClick={() =>
                        decreaseProgress(goal.id)
                      }
                      disabled={
                        goal.progress === 0
                      }
                    >
                      −
                    </button>

                    <span>
                      Update Progress
                    </span>

                    <button
                      onClick={() =>
                        increaseProgress(goal.id)
                      }
                      disabled={
                        goal.progress >=
                        goal.target
                      }
                    >
                      +
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div
          className="goal-modal-overlay"
          onMouseDown={() =>
            setShowModal(false)
          }
        >

          <div
            className="goal-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="goal-modal-header">

              <div>
                <h2>
                  Create New Goal
                </h2>

                <p>
                  Set something meaningful to
                  accomplish today.
                </p>
              </div>

              <button
                className="goal-close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={addGoal}>

              <label>
                Goal Title
              </label>

              <input
                type="text"
                placeholder="e.g. Complete 5 coding problems"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <label>
                Description
              </label>

              <textarea
                placeholder="What do you want to achieve?"
                rows="3"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <label>
                Target
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={target}
                onChange={(e) =>
                  setTarget(e.target.value)
                }
              />

              <div className="goal-modal-actions">

                <button
                  type="button"
                  className="goal-cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="goal-save-btn"
                >
                  Create Goal
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default GoalsPage;
