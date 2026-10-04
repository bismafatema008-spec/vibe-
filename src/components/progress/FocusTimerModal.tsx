import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  initialMinutes: number;
  onSessionComplete: (minutes: number) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  initialMinutes,
  onSessionComplete,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTotalSeconds(initialMinutes * 60);
    setSecondsLeft(initialMinutes * 60);
    setIsActive(true);
    setIsCompleted(false);
  }, [initialMinutes, taskTitle, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            onSessionComplete(initialMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progressPercent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0f0f15] border border-purple-500/30 p-6 text-center space-y-6 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
            Deep Focus Mode
          </span>
          <h3 className="text-base font-bold text-white font-display line-clamp-2 px-4">
            {taskTitle}
          </h3>
        </div>

        {/* Circular Display */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center">
            {/* SVG circle track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-purple-600 transition-all duration-500"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 - (565.48 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            <span className="text-4xl font-black text-white font-display tracking-tight">
              {mins}:{secs < 10 ? `0${secs}` : secs}
            </span>
            <span className="text-xs text-zinc-400 mt-1">
              {isActive ? 'Locked In' : isCompleted ? 'Session Complete!' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Completion Announcement */}
        {isCompleted ? (
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-sm">
              <Sparkles size={16} />
              <span>Huge W! Focus Sprint Complete!</span>
            </div>
            <p className="text-xs text-zinc-300">
              Logged +{initialMinutes} mins to your focus stats.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          /* Controls */
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setSecondsLeft(totalSeconds);
                setIsActive(false);
              }}
              className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              {isActive ? (
                <>
                  <Pause size={16} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setIsCompleted(true);
                onSessionComplete(initialMinutes);
              }}
              className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60 transition-colors"
              title="Finish Early"
            >
              <Check size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
