import React from 'react';
import { Sparkles, Battery, Wifi, Flame } from 'lucide-react';
import { UserProfile } from '../../types';

interface TopHeaderProps {
  profile: UserProfile;
  onOpenMoodPicker: () => void;
  onOpenBrainDump: () => void;
  onProfileClick: () => void;
  streakCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  onOpenMoodPicker,
  onOpenBrainDump,
  onProfileClick,
  streakCount,
}) => {
  return (
    <header className="sticky top-0 z-30 pt-2 pb-3 px-4 backdrop-blur-md bg-[#08080a]/80 border-b border-white/[0.05]">
      {/* Mobile status bar simulation */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium pb-2 px-1">
        <span>9:41</span>
        <div className="w-20 h-4 bg-zinc-900/90 rounded-full mx-auto" />
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Wifi size={12} />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">100%</span>
            <Battery size={13} className="text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onProfileClick}
            className="relative rounded-full ring-2 ring-purple-500/30 p-0.5 transition-transform active:scale-95"
            title="View Profile"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#08080a]" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white font-display">
                VIBE
              </span>
              <span className="text-[10px] text-purple-400 font-medium">beta</span>
            </div>
            <button
              onClick={onOpenMoodPicker}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span>{profile.currentMood}</span>
              <span className="text-[9px] text-zinc-500">▾</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Real Life Streak Indicator */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-amber-300 font-medium">
            <Flame size={13} className="text-amber-400 fill-amber-400" />
            <span>{streakCount}d</span>
          </div>

          {/* Quick Brain Dump Action */}
          <button
            onClick={onOpenBrainDump}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 text-xs font-medium hover:border-purple-400/60 active:scale-95 transition-all"
          >
            <Sparkles size={12} className="text-purple-300" />
            <span>Dump</span>
          </button>
        </div>
      </div>
    </header>
  );
};
