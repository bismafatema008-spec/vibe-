import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
  Check,
  Bell,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Zap,
} from 'lucide-react';
import { Task, BrainDumpPlan, TaskPriority, TaskCategory, UserVibeContext } from '../../types';
import { AIService } from '../../services/aiService';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (newTasks: Task[]) => void;
  onAddSingleTask: (task: Task) => void;
  userContext: UserVibeContext;
}

export const BrainDumpModal: React.FC<BrainDumpModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
  onAddSingleTask,
  userContext,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<BrainDumpPlan | null>(null);
  const [addedTaskIds, setAddedTaskIds] = useState<Record<string, boolean>>({});

  // Editing single task
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>('Focus');
  const [editMinutes, setEditMinutes] = useState(25);
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');

  const samplePrompts = [
    'I have an exam tomorrow, my assignment is half done, I need to call my friend, I haven\'t coded in three days and I also want to work on my portfolio.',
    'Overwhelmed with 3 labs, internship applications, gym session, laundry and replying to recruiter emails.',
    'Too many ideas for my side project, need to buy groceries and submit CS301 quiz tonight.',
  ];

  const handleDumpSubmit = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const resultPlan = await AIService.analyzeBrainDump(inputText.trim(), userContext);
      setPlan(resultPlan);
      setAddedTaskIds({});
    } catch (err) {
      console.error('Brain dump error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChaos = () => {
    setInputText('');
    setPlan(null);
    setAddedTaskIds({});
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      tasks: plan.tasks.filter((t) => t.id !== taskId),
    });
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditMinutes(task.estimatedMinutes);
    setEditPriority(task.priority);
  };

  const handleSaveEdit = (taskId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      tasks: plan.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              title: editTitle.trim() || t.title,
              category: editCategory,
              estimatedMinutes: Number(editMinutes) || 20,
              priority: editPriority,
            }
          : t
      ),
    });
    setEditingTaskId(null);
  };

  const handleAddSingle = (task: Task) => {
    onAddSingleTask(task);
    setAddedTaskIds((prev) => ({ ...prev, [task.id]: true }));
  };

  const handleAcceptPlan = () => {
    if (!plan) return;
    const remainingTasks = plan.tasks.filter((t) => !addedTaskIds[t.id]);
    onAddTasks(remainingTasks.length > 0 ? remainingTasks : plan.tasks);
    handleResetAndClose();
  };

  const handleRejectPlan = () => {
    setPlan(null);
  };

  const handleResetAndClose = () => {
    setInputText('');
    setPlan(null);
    setAddedTaskIds({});
    setEditingTaskId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full h-full md:max-w-xl md:h-[90vh] md:rounded-3xl bg-[#0b0b10] border-0 md:border border-purple-500/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-80 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0e0e14]/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Brain Dump
              </h2>
              <p className="text-[11px] text-zinc-400">
                Dump your chaos. Get your next move.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {inputText && (
              <button
                onClick={handleClearChaos}
                className="py-1 px-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Clear my chaos"
              >
                <RotateCcw size={12} />
                <span>Clear my chaos</span>
              </button>
            )}
            <button
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
          {!plan ? (
            /* Input View */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  What is bouncing around in your head right now?
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. I have an exam tomorrow, my assignment is half done, I need to call my friend, I haven't coded in three days and I also want to work on my portfolio."
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none shadow-inner"
                  autoFocus
                />
              </div>

              {/* Sample Prompts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Tap to test real chaotic thought:
                </span>
                <div className="flex flex-col gap-1.5">
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(prompt)}
                      className="text-left text-xs p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/[0.06] hover:border-purple-500/30 text-zinc-300 transition-all active:scale-[0.99]"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 9-Step Intelligence Plan View */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* "I GOT YOU." Hero Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-zinc-900 border border-purple-500/30 text-center space-y-1 shadow-lg">
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-purple-400">
                  Untangled & Prioritized
                </span>
                <h3 className="text-3xl font-black text-white font-display tracking-tight">
                  {plan.heroHeading || 'I GOT YOU.'}
                </h3>
                <p className="text-xs text-zinc-200 max-w-sm mx-auto pt-1 leading-relaxed">
                  {plan.situationSummary}
                </p>
                {plan.emotionalCheck && (
                  <p className="text-[11px] text-purple-300 italic pt-0.5">
                    "{plan.emotionalCheck}"
                  </p>
                )}
              </div>

              {/* FIRST (Now Move) */}
              {plan.nowMove && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 via-zinc-900 to-zinc-950 border border-purple-500/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-purple-400 flex items-center gap-1">
                      <Zap size={12} className="fill-purple-400" />
                      <span>FIRST: DO THIS NOW</span>
                    </span>
                    <span className="text-zinc-400 font-semibold">{plan.nowMove.duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {plan.nowMove.title}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {plan.nowMove.why}
                  </p>
                </div>
              )}

              {/* THEN (Next Move) */}
              {plan.thenMove && (
                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/[0.08] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                      THEN: NEXT UP
                    </span>
                    <span className="text-zinc-400">{plan.thenMove.duration}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white">
                    {plan.thenMove.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {plan.thenMove.why}
                  </p>
                </div>
              )}

              {/* WHAT CAN WAIT (De-pressurize) */}
              {plan.canWaitList && plan.canWaitList.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.05] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                    <PauseCircle size={13} className="text-zinc-500" />
                    <span>THIS CAN SAFELY WAIT (Zero guilt)</span>
                  </div>
                  <div className="space-y-1">
                    {plan.canWaitList.map((waitItem, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-400">
                        <span className="text-purple-400/80">·</span>
                        <span>{waitItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Actionable Tasks List */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span className="font-bold text-zinc-200">
                    Extracted Action Items ({plan.tasks.length})
                  </span>
                  <span>Edit, delete or add to today</span>
                </div>

                {plan.tasks.map((task) => {
                  const isAdded = !!addedTaskIds[task.id];
                  const isEditing = editingTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                        isAdded
                          ? 'bg-zinc-900/40 border-white/[0.04] opacity-75'
                          : 'glass-card border-white/[0.08] hover:border-purple-500/40'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-2.5 pt-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full py-1.5 px-2.5 rounded-xl bg-zinc-900 border border-purple-500/50 text-xs text-white focus:outline-none"
                            placeholder="Task title..."
                          />
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-0.5">Category</label>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
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
                                value={editMinutes}
                                onChange={(e) => setEditMinutes(parseInt(e.target.value) || 15)}
                                className="w-full p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-0.5">Priority</label>
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                                className="w-full p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingTaskId(null)}
                              className="py-1 px-2.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(task.id)}
                              className="py-1 px-3 rounded-lg bg-purple-600 text-white text-xs font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white leading-snug break-words">
                              {task.title}
                            </p>
                            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-[11px] text-zinc-400">
                              <span className="text-purple-300 font-medium">
                                {task.category}
                              </span>
                              <span aria-hidden="true" className="text-zinc-600">·</span>
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                <span>{task.estimatedMinutes}m</span>
                              </span>
                              {task.deadline && (
                                <>
                                  <span aria-hidden="true" className="text-zinc-600">·</span>
                                  <span className="text-amber-300/90">{task.deadline}</span>
                                </>
                              )}
                              {task.priority === 'high' && (
                                <>
                                  <span aria-hidden="true" className="text-zinc-600">·</span>
                                  <span className="text-rose-400 font-medium flex items-center gap-0.5">
                                    <AlertCircle size={10} />
                                    <span>high</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleStartEdit(task)}
                              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                            <button
                              onClick={() => handleAddSingle(task)}
                              disabled={isAdded}
                              className={`py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                isAdded
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={12} />
                                  <span>Added</span>
                                </>
                              ) : (
                                <span>Add</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="relative z-10 p-4 border-t border-white/[0.08] bg-[#0c0c12]/95 backdrop-blur-md">
          {!plan ? (
            <button
              onClick={handleDumpSubmit}
              disabled={loading || !inputText.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <Sparkles size={16} className="animate-spin text-purple-200" />
                  <span>Understanding your chaos & filtering moves...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Untangle My Chaos</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRejectPlan}
                className="py-3 px-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-400 hover:text-white font-medium transition-colors"
              >
                Reject / Re-dump
              </button>
              <button
                onClick={handleAcceptPlan}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <CheckCircle2 size={16} />
                <span>Accept Plan & Add Everything ({plan.tasks.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
