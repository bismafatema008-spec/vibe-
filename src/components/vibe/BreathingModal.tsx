import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  useEffect(() => {
    if (!isOpen) return;

    // 4-4-4-2 box breathing pattern (total 14s cycle)
    const phases: { name: 'Inhale' | 'Hold' | 'Exhale' | 'Rest'; duration: number }[] = [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Rest', duration: 2 },
    ];

    let currentIdx = 0;
    let timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let phaseTimer: NodeJS.Timeout;
    const runCycle = () => {
      const current = phases[currentIdx];
      setPhase(current.name);
      phaseTimer = setTimeout(() => {
        currentIdx = (currentIdx + 1) % phases.length;
        runCycle();
      }, current.duration * 1000);
    };

    runCycle();

    return () => {
      clearInterval(timer);
      clearTimeout(phaseTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0f0f15] border border-purple-500/30 p-6 text-center space-y-6 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-purple-400 font-semibold uppercase tracking-wider">
            <Heart size={14} className="fill-purple-400/30" />
            <span>2-Min Cortisol Reset</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Deep Nervous System Reset
          </h3>
          <p className="text-xs text-zinc-400">
            Slow down your heart rate. Your brain works better calm.
          </p>
        </div>

        {/* Breathing Animation Circle */}
        <div className="relative py-8 flex items-center justify-center">
          <div
            className={`w-40 h-40 rounded-full border-2 border-purple-500/40 flex flex-col items-center justify-center transition-all duration-1000 ${
              phase === 'Inhale'
                ? 'scale-125 bg-purple-600/20 shadow-2xl shadow-purple-500/40'
                : phase === 'Hold'
                ? 'scale-125 bg-indigo-600/30 shadow-2xl shadow-indigo-500/40'
                : phase === 'Exhale'
                ? 'scale-90 bg-purple-950/20'
                : 'scale-95 bg-zinc-900/40'
            }`}
          >
            <span className="text-xl font-black text-white font-display tracking-wide">
              {phase}
            </span>
            <span className="text-[11px] text-purple-300 font-medium mt-1">
              {phase === 'Inhale' && 'Slow through nose'}
              {phase === 'Hold' && 'Hold still'}
              {phase === 'Exhale' && 'Gentle release'}
              {phase === 'Rest' && 'Soft pause'}
            </span>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-medium">
          {mins}:{secs < 10 ? `0${secs}` : secs} remaining
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
        >
          Finished Early
        </button>
      </div>
    </div>
  );
};
