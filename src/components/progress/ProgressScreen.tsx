import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  Trophy,
  Sparkles,
  Target,
  Zap,
  Trash2,
  Calendar,
  Check,
} from 'lucide-react';
import { Streak, UserProfile, Task, FocusSession } from '../../types';

interface ProgressScreenProps {
  profile: UserProfile;
  tasks: Task[];
  streaks: Streak[];
  focusSessions: FocusSession[];
  onCheckInStreak: (id: string) => void;
  onAddNewStreak: (name: string, icon: string, unit: string) => void;
  onOpenFocusTimer: (title: string, mins: number) => void;
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (title: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  profile,
  tasks,
  streaks,
  focusSessions,
  onCheckInStreak,
  onAddNewStreak,
  onOpenFocusTimer,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
}) => {
  const [isAddingStreak, setIsAddingStreak] = useState(false);
  const [streakName, setStreakName] = useState('');
  const [streakIcon, setStreakIcon] = useState('🔥');
  const [streakUnit, setStreakUnit] = useState('days');

  // Goals
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  // Actual dynamic metrics from user data:
  const completedTasks = tasks.filter((t) => t.completed);
  const completedTodayCount = completedTasks.length;
  const totalTasks = tasks.length;

  const totalFocusMinutes = profile.todayFocusMinutes;
  const totalSessionsCompleted = focusSessions.length;

  // Calculate dynamic bonuses based on actual tasks:
  const studyTasksDone = completedTasks.filter(
    (t) => t.category === 'Study' || t.category === 'College'
  ).length;
  const codingTasksDone = completedTasks.filter(
    (t) =>
      t.title.toLowerCase().includes('code') ||
      t.title.toLowerCase().includes('react') ||
      t.title.toLowerCase().includes('database') ||
      t.title.toLowerCase().includes('portfolio')
  ).length;
  const applicationTasksDone = completedTasks.filter(
    (t) => t.category === 'Career'
  ).length;

  const handleCreateStreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streakName.trim()) return;
    onAddNewStreak(streakName.trim(), streakIcon, streakUnit);
    setStreakName('');
    setIsAddingStreak(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    onAddGoal(newGoalTitle.trim());
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  return (
    <div className="space-y-5 pb-24 px-4 pt-1">
      {/* Header */}
      <div>
        <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase">
          Momentum & Milestones
        </span>
        <h1 className="text-2xl font-black text-white font-display">
          Progress & Proof
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Real accomplishments driven by your actual task completions.
        </p>
      </div>

      {/* Top 3 Stat Cards Driven by Actual Data */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl glass-card border-white/[0.08] text-center space-y-1">
          <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/25 mx-auto flex items-center justify-center text-purple-400">
            <CheckCircle2 size={14} />
          </div>
          <span className="text-lg font-black text-white font-display">
            {completedTodayCount}/{totalTasks}
          </span>
          <p className="text-[10px] text-zinc-400">Tasks Done</p>
        </div>

        <div className="p-3 rounded-2xl glass-card border-white/[0.08] text-center space-y-1">
          <div className="w-7 h-7 rounded-xl bg-blue-500/15 border border-blue-500/25 mx-auto flex items-center justify-center text-blue-400">
            <Clock size={14} />
          </div>
          <span className="text-lg font-black text-white font-display">
            {totalFocusMinutes}m
          </span>
          <p className="text-[10px] text-zinc-400">Focus Time</p>
        </div>

        <div className="p-3 rounded-2xl glass-card border-white/[0.08] text-center space-y-1">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/25 mx-auto flex items-center justify-center text-amber-400">
            <Zap size={14} />
          </div>
          <span className="text-lg font-black text-white font-display">
            {totalSessionsCompleted}
          </span>
          <p className="text-[10px] text-zinc-400">Focus Sprints</p>
        </div>
      </div>

      {/* 1. Real Life Streaks (with actual completed task synergy) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame size={13} className="fill-amber-400/40" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              Real Life Streaks
            </h3>
          </div>

          <button
            onClick={() => setIsAddingStreak(true)}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            <Plus size={13} />
            <span>Add Streak</span>
          </button>
        </div>

        {/* Streaks Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {streaks.map((streak) => {
            // Add dynamic bonus count based on user's actual completed tasks
            let dynamicBonus = 0;
            if (streak.name.toLowerCase().includes('study')) dynamicBonus = studyTasksDone;
            if (streak.name.toLowerCase().includes('code')) dynamicBonus = codingTasksDone;
            if (streak.name.toLowerCase().includes('application')) dynamicBonus = applicationTasksDone;

            const displayCount = streak.count + (dynamicBonus > 0 ? dynamicBonus : 0);

            return (
              <div
                key={streak.id}
                className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  streak.lastCheckedToday
                    ? 'bg-gradient-to-br from-zinc-900/90 to-zinc-950 border-purple-500/30'
                    : 'glass-card border-white/[0.07]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{streak.icon}</span>
                  <button
                    onClick={() => onCheckInStreak(streak.id)}
                    disabled={streak.lastCheckedToday}
                    className={`text-[10px] font-semibold py-1 px-2.5 rounded-lg transition-all ${
                      streak.lastCheckedToday
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                    }`}
                  >
                    {streak.lastCheckedToday ? 'Checked in ✓' : 'Check in +1'}
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-display">
                      {displayCount}
                    </span>
                    <span className="text-[11px] text-zinc-400">{streak.unit}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200 mt-0.5 truncate">
                    {streak.name}
                  </p>
                  {dynamicBonus > 0 && (
                    <span className="text-[9px] text-purple-400 block mt-0.5">
                      +{dynamicBonus} from completed tasks
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Streak Form */}
        {isAddingStreak && (
          <form
            onSubmit={handleCreateStreak}
            className="p-3.5 rounded-2xl bg-zinc-900/95 border border-purple-500/40 space-y-2.5 animate-in fade-in"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>New Real Life Streak</span>
              <button
                type="button"
                onClick={() => setIsAddingStreak(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={streakIcon}
                onChange={(e) => setStreakIcon(e.target.value)}
                className="p-2 rounded-xl bg-zinc-800 border border-white/10 text-base text-white"
              >
                <option value="🔥">🔥</option>
                <option value="💻">💻</option>
                <option value="🎯">🎯</option>
                <option value="💧">💧</option>
                <option value="🏋️">🏋️</option>
                <option value="📚">📚</option>
                <option value="🎨">🎨</option>
              </select>
              <input
                type="text"
                value={streakName}
                onChange={(e) => setStreakName(e.target.value)}
                placeholder="Streak name (e.g. Days Coding)"
                className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingStreak(false)}
                className="py-1 px-3 rounded-xl bg-zinc-800 text-zinc-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1 px-4 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Focus Sessions Log */}
      <div className="p-4 rounded-2xl glass-card border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
            <Clock size={14} className="text-purple-400" />
            <span>Recent Focus Sessions</span>
          </div>
          <button
            onClick={() => onOpenFocusTimer('Quick Sprint', 25)}
            className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
          >
            + Start Sprint
          </button>
        </div>

        <div className="space-y-1.5">
          {focusSessions.length === 0 ? (
            <p className="text-xs text-zinc-500 py-3 text-center">
              No focus sessions logged yet. Tap Start Sprint!
            </p>
          ) : (
            focusSessions.slice(0, 4).map((session) => (
              <div
                key={session.id}
                className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.04] flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-semibold text-white truncate">
                    {session.taskTitle}
                  </p>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(session.completedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold text-[11px]">
                  +{session.minutes}m
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Core Goals Section with Add / Delete / Toggle */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
            <Target size={14} className="text-purple-400" />
            <span>Core Active Goals</span>
          </div>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-0.5"
          >
            <Plus size={12} />
            <span>Add Goal</span>
          </button>
        </div>

        {isAddingGoal && (
          <form
            onSubmit={handleCreateGoal}
            className="p-3 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-2 animate-in fade-in"
          >
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="What is your big milestone goal?"
              className="w-full p-2 rounded-xl bg-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="py-1 px-2.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1 px-3.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {profile.goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                goal.completed
                  ? 'bg-zinc-900/40 border-white/[0.04] opacity-60'
                  : 'glass-card border-white/[0.07] hover:border-purple-500/30'
              }`}
            >
              <div
                onClick={() => onToggleGoal(goal.id)}
                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    goal.completed
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'border-zinc-700 bg-zinc-900'
                  }`}
                >
                  {goal.completed && <Check size={12} strokeWidth={3} />}
                </div>
                <span
                  className={`text-xs font-medium truncate ${
                    goal.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                  }`}
                >
                  {goal.title}
                </span>
              </div>

              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                title="Delete goal"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
