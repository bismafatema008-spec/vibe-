import React, { useState } from 'react';
import { Check, Clock, AlertCircle, Trash2, Edit3, X, CheckCheck } from 'lucide-react';
import { Task, TaskPriority, TaskCategory } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, updated: Partial<Task>) => void;
  onSelectForFocus?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onSelectForFocus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editMinutes, setEditMinutes] = useState(task.estimatedMinutes);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editCategory, setEditCategory] = useState<TaskCategory>(task.category);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'text-rose-400';
      case 'medium':
        return 'text-amber-400';
      default:
        return 'text-zinc-400';
    }
  };

  const handleSave = () => {
    if (onEdit && editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        estimatedMinutes: Number(editMinutes) || 20,
        priority: editPriority,
        category: editCategory,
      });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-zinc-900/30 border-white/[0.04] opacity-65'
          : 'glass-card border-white/[0.08] hover:border-purple-500/30 hover:bg-zinc-900/70'
      }`}
    >
      {isEditing ? (
        /* Edit Mode */
        <div className="p-3.5 space-y-2.5">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 rounded-xl bg-zinc-900 border border-purple-500/40 text-xs text-white focus:outline-none"
            placeholder="Task title"
            autoFocus
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
          <div className="flex justify-end gap-1.5 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="py-1 px-2.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-1 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        /* Normal View */
        <div className="p-3.5 flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'border-zinc-600 hover:border-purple-400 bg-zinc-900/60'
            }`}
            aria-label={task.completed ? 'Undo complete' : 'Mark complete'}
          >
            {task.completed && <Check size={12} strokeWidth={3} />}
          </button>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium leading-snug break-words transition-all ${
                task.completed
                  ? 'line-through text-zinc-500'
                  : 'text-zinc-100 group-hover:text-white'
              }`}
            >
              {task.title}
            </p>

            {/* Unboxed Metadata with clean typographic separators */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5 text-[11px] text-zinc-400">
              <span className="text-zinc-300 font-medium">{task.category}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-zinc-500" />
                <span>{task.estimatedMinutes}m</span>
              </span>
              {task.deadline && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-zinc-400">{task.deadline}</span>
                </>
              )}
              {task.priority === 'high' && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className={`flex items-center gap-0.5 font-medium ${getPriorityColor()}`}>
                    <AlertCircle size={11} />
                    <span>high prio</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity self-center">
            {!task.completed && onSelectForFocus && (
              <button
                onClick={() => onSelectForFocus(task)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 whitespace-nowrap"
                title="Focus Timer"
              >
                Focus
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors"
                title="Edit Task"
              >
                <Edit3 size={13} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
