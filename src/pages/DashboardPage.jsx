/**
 * DashboardPage.jsx
 *
 * The main dashboard — the first page users see after logging in.
 */

import { useState } from 'react';

import { useAuth } from '../hooks/useAuth';
import { useTask } from '../hooks/useTask';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatCard from '../components/dashboard/StatCard';
import TodayTasks from '../components/dashboard/TodayTasks';
import FocusPreviewCard from '../components/dashboard/FocusPreviewCard';
import ProductivityCard from '../components/dashboard/ProductivityCard';
import QuickActions from '../components/dashboard/QuickActions';
import AddTaskModal from '../components/dashboard/AddTaskModal';
import GoalPreviewCard from '../components/dashboard/GoalPreviewCard';

function DashboardPage() {
  const { currentUser } = useAuth();

  const {
    totalTasks,
    completedTasks,
    pendingTasks,
  } = useTask();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  /* Read streak from LocalStorage */
  const [streak] = useLocalStorage(
    STORAGE_KEYS.STREAK,
    { current: 0 }
  );

  const currentStreak = streak?.current ?? 0;

  /* Streak label */
  const streakLabel =
    currentStreak === 1
      ? '1 day'
      : `${currentStreak} days`;

  /* Completion percentage */
  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  return (
    <>
      <div className="dashboard">

        {/* =====================================================
            WELCOME BANNER
            ===================================================== */}

        <WelcomeBanner
          userName={currentUser?.name}
        />


        {/* =====================================================
            STATISTICS
            ===================================================== */}

        <div className="stats-grid">

          {/* Total Tasks */}
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon="📋"
            color="primary"
            subtitle="All time"
          />


          {/* Completed */}
          <StatCard
            title="Completed"
            value={completedTasks}
            icon="✅"
            color="success"
            subtitle={
              totalTasks > 0
                ? `${completionPercentage}% done`
                : 'None yet'
            }
          />


          {/* Pending */}
          <StatCard
            title="Pending"
            value={pendingTasks}
            icon="⏳"
            color="warning"
            subtitle={
              pendingTasks === 0
                ? 'All clear!'
                : 'To do'
            }
          />


          {/* Streak */}
          <StatCard
            title="Streak"
            value={currentStreak}
            icon="🔥"
            color="info"
            subtitle={
              currentStreak > 0
                ? streakLabel
                : 'Start today!'
            }
          />

        </div>


        {/* =====================================================
            QUICK ACTIONS
            ===================================================== */}

        <QuickActions
          onAddTask={() => setIsAddTaskOpen(true)}
        />


        {/* =====================================================
            MAIN DASHBOARD GRID
            ===================================================== */}

        <div className="dashboard-grid">

          {/* -------------------------------------------------
              LEFT SIDE
              ------------------------------------------------- */}

          <TodayTasks />


          {/* -------------------------------------------------
              RIGHT SIDE
              ------------------------------------------------- */}

          <div className="dashboard-sidebar">

            {/* Focus Timer */}
            <FocusPreviewCard />

            {/* Productivity */}
            <ProductivityCard />

            {/* Daily Goals */}
            <GoalPreviewCard />

          </div>

        </div>

      </div>


      {/* =====================================================
          ADD TASK MODAL
          ===================================================== */}

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

    </>
  );
}

export default DashboardPage;