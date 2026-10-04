import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Plus,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sliders,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Task, UserVibeContext, TaskPriority, TaskCategory } from '../../types';
import { TaskCard } from './TaskCard';

interface HomeScreenProps {
  userContext: UserVibeContext;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updated: Partial<Task>) => void;
  onOpenWhatRn: () => void;
  onOpenBrainDump: () => void;
  onOpenMoodPicker: () => void;
  onOpenTuneVibe: () => void;
  onStartFocus: (taskTitle: string, minutes: number) => void;
  onAddNewTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userContext,
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onOpenWhatRn,
  onOpenBrainDump,
  onOpenMoodPicker,
  onOpenTuneVibe,
  onStartFocus,
  onAddNewTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Focus');
  const [newMinutes, setNewMinutes] = useState(25);
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDeadline, setNewDeadline] = useState('');

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Single recommended next action
  const nextTask =
    tasks.find((t) => !t.completed && t.priority === 'high') ||
    tasks.find((t) => !t.completed);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNewTask({
      title: newTitle.trim(),
      category: newCategory,
      estimatedMinutes: Number(newMinutes) || 20,
      priority: newPriority,
      deadline: newDeadline.trim() || undefined,
      suggestedSlot: 'Today',
    });

    setNewTitle('');
    setNewDeadline('');
    setIsAddingTask(false);
  };

  // Generate dynamic contextual insight
  const getContextualSubtext = () => {
    const sitCount = userContext.currentSituation?.length || 0;
    if (userContext.currentStressors && userContext.currentStressors.length > 5) {
      return "You have a lot going on today. Let's make it smaller.";
    }
    if (sitCount > 2) {
      return `Balancing ${userContext.currentSituation.slice(0, 2).join(' & ')}. One bite at a time.`;
    }
    return 'Your moves are set. Let’s create some momentum.';
  };

  return (
    <div className="space-y-5 pb-24 px-4 pt-1">
      {/* 1. Dynamic Personalized Greeting & Context */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold text-purple-400 tracking-wider uppercase">
            Personal Companion
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Hey {userContext.userName || 'there'} 👋
          </h1>
          <p className="text-xs text-zinc-300 mt-0.5 leading-snug">
            {getContextualSubtext()}
          </p>
        </div>

        <button
          onClick={onOpenTuneVibe}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-zinc-900 border border-white/10 hover:border-purple-500/40 text-[11px] text-zinc-300 hover:text-white transition-all shadow-sm"
          title="Tune My VIBE Context"
        >
          <Sliders size={12} className="text-purple-400" />
          <span>My VIBE</span>
        </button>
      </div>

      {/* 2. Current Mood Card */}
      <button
        onClick={onOpenMoodPicker}
        className="w-full text-left p-3.5 rounded-2xl glass-card border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
            {userContext.currentMood.split(' ')[0]}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Current Vibe
            </span>
            <p className="text-sm font-semibold text-white">
              {userContext.customMood || userContext.currentMood}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-400 group-hover:text-purple-300 transition-colors">
          <span>Change</span>
          <ChevronRight size={14} />
        </div>
      </button>

      {/* 3. Large "WHAT SHOULD I DO RN?" Hero Button */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
        <button
          onClick={onOpenWhatRn}
          className="relative w-full py-5 px-6 rounded-3xl bg-[#111117] border border-white/20 text-white shadow-2xl flex items-center justify-between active:scale-[0.98] transition-all overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase font-extrabold text-purple-300">
                Decision Paralysis Fix
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-display">
                WHAT SHOULD I DO RN?
              </h2>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-purple-200 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight size={18} />
          </div>
        </button>
      </div>

      {/* 4. "YOUR MOVE" AI-Recommended Next Priority */}
      {nextTask && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-purple-500/30 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-purple-400 font-extrabold uppercase tracking-wider text-[11px]">
              <Sparkles size={13} />
              <span>Your Move</span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {nextTask.estimatedMinutes} mins
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white leading-snug truncate">
                {nextTask.title}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                <span>{nextTask.category}</span>
                {nextTask.deadline && (
                  <>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-amber-300/90">{nextTask.deadline}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => onStartFocus(nextTask.title, nextTask.estimatedMinutes)}
              className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1"
            >
              <span>Start</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* 5. Today's Tasks Section with Progress */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Today's Tasks
            </h3>
            <span className="text-xs text-zinc-400">
              {completedCount} of {totalCount} done · {progressPercent}% vibe achieved
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900/80 rounded-xl border border-white/[0.06]">
            {(['all', 'pending', 'completed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                  filter === mode
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/[0.04] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Task Form Drawer or Inline Triggers */}
        {isAddingTask ? (
          <form
            onSubmit={handleTaskSubmit}
            className="p-4 rounded-2xl glass-card border-purple-500/40 space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Add New Task</span>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to get done?"
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              autoFocus
            />

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                  className="w-full p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                >
                  {['Study', 'College', 'Career', 'Social', 'Health', 'Life', 'Focus'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Minutes</label>
                <input
                  type="number"
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(parseInt(e.target.value) || 20)}
                  className="w-full p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">Deadline (optional)</label>
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="e.g. Tonight 11:59 PM, Tomorrow 9 AM"
                className="w-full p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="py-1.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all"
              >
                Add Task
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-purple-300 transition-colors"
            >
              <Plus size={14} />
              <span>Add a task</span>
            </button>
            <button
              onClick={onOpenBrainDump}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              <Sparkles size={12} />
              <span>Full Brain Dump</span>
            </button>
          </div>
        )}

        {/* Task Cards List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center glass-card rounded-2xl border-white/[0.05] p-6 space-y-2">
              <CheckCircle2 size={28} className="mx-auto text-emerald-400/80" />
              <p className="text-sm font-medium text-zinc-200">
                {filter === 'pending'
                  ? 'All tasks completed! Huge W.'
                  : filter === 'completed'
                  ? 'No completed tasks yet.'
                  : 'No tasks on your board.'}
              </p>
              <p className="text-xs text-zinc-500">
                Dump whatever messy thoughts you have or add a quick action.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                onSelectForFocus={(t) => onStartFocus(t.title, t.estimatedMinutes)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Brain Dump Button */}
      <div className="fixed bottom-20 right-4 z-30 max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onOpenBrainDump}
          className="group flex items-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/40 border border-purple-400/30 active:scale-95 transition-all glow-purple"
        >
          <Sparkles
            size={16}
            className="text-purple-200 group-hover:rotate-12 transition-transform"
          />
          <span>Brain Dump 💭</span>
        </button>
      </div>
    </div>
  );
};
