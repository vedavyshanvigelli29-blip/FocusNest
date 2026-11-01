import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../utils/storageKeys";

function GoalPreviewCard() {
  const navigate = useNavigate();

  const [goals] = useLocalStorage(STORAGE_KEYS.GOALS, []);

  const totalGoals = goals.length;

  const completedGoals = goals.filter(
    (goal) => goal.progress >= goal.target
  ).length;

  const overallProgress =
    totalGoals === 0
      ? 0
      : Math.round(
          (goals.reduce(
            (sum, goal) =>
              sum + Math.min(goal.progress / goal.target, 1),
            0
          ) /
            totalGoals) *
            100
        );

  return (
    <div className="dashboard-card goal-preview-card">

      <div className="dashboard-card__header">
        <div>
          <h2 className="dashboard-card__title">
            Daily Goals
          </h2>

          <p className="dashboard-card__subtitle">
            Track your progress
          </p>
        </div>

        <button
          className="goal-view-btn"
          onClick={() => navigate("/goals")}
        >
          View All
        </button>
      </div>

      {/* Overall progress */}
      <div className="goal-overall">

        <div className="goal-overall__top">
          <span>Overall Progress</span>

          <strong>{overallProgress}%</strong>
        </div>

        <div className="goal-progress-bar">
          <div
            className="goal-progress-bar__fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <span className="goal-overall__count">
          {completedGoals} of {totalGoals} goals completed
        </span>

      </div>

      {/* Goals */}
      <div className="goal-preview-list">

        {goals.length === 0 ? (
          <div className="goal-empty">

            <span className="goal-empty__icon">
              🎯
            </span>

            <p>No goals created yet.</p>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/goals")}
            >
              + Add Goal
            </button>

          </div>
        ) : (
          goals.slice(0, 3).map((goal) => {

            const progress =
              goal.target === 0
                ? 0
                : Math.min(
                    Math.round(
                      (goal.progress / goal.target) * 100
                    ),
                    100
                  );

            const completed =
              goal.progress >= goal.target;

            return (
              <div
                className="goal-preview-item"
                key={goal.id}
              >

                <div className="goal-preview-item__top">

                  <span className="goal-preview-item__title">
                    {completed ? "✅" : "🎯"} {goal.title}
                  </span>

                  <span className="goal-preview-item__value">
                    {goal.progress}/{goal.target}
                  </span>

                </div>

                <div className="goal-progress-bar small">

                  <div
                    className="goal-progress-bar__fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default GoalPreviewCard;