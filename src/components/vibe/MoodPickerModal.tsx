import React from 'react';
import { X, Check } from 'lucide-react';
import { MOOD_OPTIONS } from '../../data/initialData';

interface MoodPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: string;
  onSelectMood: (mood: string) => void;
}

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onSelectMood,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#111116] border border-white/10 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Set Today's Vibe
            </h3>
            <p className="text-xs text-zinc-400">
              How's your headspace right now?
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = currentMood.includes(mood.label);
            return (
              <button
                key={mood.id}
                onClick={() => {
                  onSelectMood(`${mood.emoji} ${mood.label}`);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-purple-950/50 border-purple-500/50'
                    : 'glass-card border-white/[0.06] hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mood.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{mood.label}</p>
                    <p className="text-[10px] text-zinc-400">{mood.desc}</p>
                  </div>
                </div>
                {isSelected && <Check size={16} className="text-purple-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
