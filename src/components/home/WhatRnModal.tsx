import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Timer,
  CheckCircle2,
  RotateCcw,
  Zap,
  ArrowRight,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { Task, WhatRnResult, UserVibeContext } from '../../types';
import { AIService } from '../../services/aiService';

interface WhatRnModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  userContext: UserVibeContext;
  onStartFocus: (taskTitle: string, minutes: number) => void;
  onCompleteTask: (taskId: string) => void;
}

export const WhatRnModal: React.FC<WhatRnModalProps> = ({
  isOpen,
  onClose,
  tasks,
  userContext,
  onStartFocus,
  onCompleteTask,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhatRnResult | null>(null);
  const [matchedTaskId, setMatchedTaskId] = useState<string | null>(null);

  // "Not Feeling It" flow
  const [isNotFeelingIt, setIsNotFeelingIt] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const notFeelingReasons = [
    'Too tired / brain is fried',
    'Too big / need something tiny',
    'Rather do something physical',
    'Want to reset workspace first',
  ];

  const fetchDecision = async (skipTitle?: string, reason?: string) => {
    setLoading(true);
    setIsNotFeelingIt(false);
    try {
      const pendingTasks = tasks.filter((t) => !t.completed);
      const data = await AIService.getWhatShouldIDoRn(
        pendingTasks,
        userContext,
        skipTitle,
        reason
      );
      setResult(data);

      const matched = tasks.find(
        (t) =>
          !t.completed &&
          (t.title.toLowerCase().includes(data.recommendation.toLowerCase()) ||
            data.recommendation.toLowerCase().includes(t.title.toLowerCase()))
      );
      setMatchedTaskId(matched ? matched.id : data.taskId || pendingTasks[0]?.id || null);
    } catch (err) {
      console.error('Failed to get recommendation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsNotFeelingIt(false);
      setRejectionReason('');
      fetchDecision();
    }
  }, [isOpen]);

  const handlePickReasonAndRegenerate = (reason: string) => {
    setRejectionReason(reason);
    if (result) {
      fetchDecision(result.recommendation, reason);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#101017] border border-purple-500/30 p-6 shadow-2xl glow-hero overflow-hidden">
        {/* Glow background ambiance */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Zap size={16} className="fill-purple-300/40" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-extrabold">
                Your Single Move
              </span>
              <h3 className="text-base font-bold text-white font-display">
                WHAT SHOULD I DO RN?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 animate-pulse flex items-center justify-center">
                <Sparkles
                  size={26}
                  className="text-purple-400 animate-spin"
                  style={{ animationDuration: '3s' }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100">
                Checking your vibe, deadlines & energy...
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Cutting through 10 open tabs to give you ONE move.
              </p>
            </div>
          </div>
        ) : isNotFeelingIt ? (
          /* "Not Feeling It" Interactive Prompt */
          <div className="py-2 space-y-4 relative z-10 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] space-y-1.5 text-center">
              <span className="text-2xl block">😌</span>
              <h4 className="text-sm font-bold text-white">Totally fair. Zero judgment.</h4>
              <p className="text-xs text-zinc-400">
                Why are you not feeling that move right now?
              </p>
            </div>

            <div className="space-y-2">
              {notFeelingReasons.map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickReasonAndRegenerate(reason)}
                  className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-purple-950/40 border border-white/[0.06] hover:border-purple-500/40 text-left text-xs font-semibold text-zinc-300 hover:text-white transition-all active:scale-[0.99] flex items-center justify-between"
                >
                  <span>{reason}</span>
                  <ArrowRight size={13} className="text-zinc-500" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNotFeelingIt(false)}
              className="w-full py-2 text-center text-xs text-zinc-500 hover:text-zinc-300"
            >
              Back to current recommendation
            </button>
          </div>
        ) : result ? (
          /* The Single Clear Move */
          <div className="space-y-4 relative z-10 animate-in fade-in">
            {/* The Recommended Action Hero Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 via-zinc-900 to-zinc-950 border border-purple-500/40 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-purple-300 font-medium">
                <span className="font-bold text-purple-200">{result.category}</span>
                <span className="flex items-center gap-1 font-semibold">
                  <Clock size={12} />
                  <span>{result.timeNeededText || `${result.estimatedMinutes}m`}</span>
                </span>
              </div>
              <h4 className="text-xl font-black text-white leading-snug font-display">
                {result.recommendation}
              </h4>
            </div>

            {/* WHY THIS section */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/[0.08] space-y-1">
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-purple-400">
                WHY THIS
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                "{result.whyThis}"
              </p>
            </div>

            {/* TIME NEEDED & Anti-Procrastination Hack */}
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Anti-Procrastination Hack</span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  TIME NEEDED: {result.timeNeededText || `${result.estimatedMinutes}m`}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {result.procrastinationHack}
              </p>
            </div>

            {/* Hype Quote */}
            <p className="text-center text-[11px] text-zinc-400 italic">
              ✨ {result.hypeQuote}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* START NOW Button */}
              <button
                onClick={() => {
                  onStartFocus(result.recommendation, result.estimatedMinutes || 25);
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Timer size={16} />
                <span>START NOW ({result.timeNeededText || `${result.estimatedMinutes}m`})</span>
                <ArrowRight size={14} />
              </button>

              <div className="grid grid-cols-2 gap-2">
                {matchedTaskId && (
                  <button
                    onClick={() => {
                      onCompleteTask(matchedTaskId);
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    <span>Done with this</span>
                  </button>
                )}

                {/* NOT FEELING IT Button */}
                <button
                  onClick={() => setIsNotFeelingIt(true)}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>NOT FEELING IT</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
