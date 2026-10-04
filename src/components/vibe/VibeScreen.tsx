import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BatteryCharging,
  Wind,
  Clock,
  Send,
  Check,
  ChevronRight,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, Task } from '../../types';
import { MOOD_OPTIONS } from '../../data/initialData';
import { BreathingModal } from './BreathingModal';
import { FocusSoundscape } from './FocusSoundscape';
import { AIService } from '../../services/aiService';

interface VibeScreenProps {
  profile: UserProfile;
  tasks: Task[];
  onUpdateMood: (mood: string) => void;
  onUpdateEnergy: (energy: number) => void;
  onStartFocus: (title: string, mins: number) => void;
  onOpenBrainDump: () => void;
}

export const VibeScreen: React.FC<VibeScreenProps> = ({
  profile,
  tasks,
  onUpdateMood,
  onUpdateEnergy,
  onStartFocus,
  onOpenBrainDump,
}) => {
  const [reflection, setReflection] = useState<{
    headline: string;
    reflection: string;
    actions: string[];
  } | null>(null);
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  // Reflection Question State
  const [reflectionInput, setReflectionInput] = useState('');
  const [answeredPrompt, setAnsweredPrompt] = useState<string | null>(null);

  const currentMoodObj =
    MOOD_OPTIONS.find((m) => profile.currentMood.includes(m.label)) || MOOD_OPTIONS[0];

  const fetchReflection = async (mood: string, energy: number, answer?: string) => {
    setLoadingReflection(true);
    try {
      const data = await AIService.getVibeReflection(mood, energy, answer);
      setReflection(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReflection(false);
    }
  };

  useEffect(() => {
    fetchReflection(profile.currentMood, profile.energyLevel);
  }, [profile.currentMood, profile.energyLevel]);

  const handleMoodSelect = (mood: (typeof MOOD_OPTIONS)[0]) => {
    const formatted = `${mood.emoji} ${mood.label}`;
    onUpdateMood(formatted);
    setReflectionInput('');
    setAnsweredPrompt(null);
    fetchReflection(formatted, profile.energyLevel);
  };

  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    setAnsweredPrompt(reflectionInput.trim());
    fetchReflection(profile.currentMood, profile.energyLevel, reflectionInput.trim());
  };

  return (
    <div className="space-y-5 pb-24 px-4 pt-1">
      {/* Header */}
      <div>
        <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase">
          Energy & Mindset Hub
        </span>
        <h1 className="text-2xl font-black text-white font-display">
          Vibe Check
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Tune your internal frequency. Productivity follows emotional clarity.
        </p>
      </div>

      {/* 1. Functional Mood Check-In (with exact moods from prompt) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-300">
          How are you feeling right now?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = profile.currentMood.includes(mood.label);
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500/60 shadow-lg shadow-purple-500/20'
                    : 'glass-card border-white/[0.06] hover:bg-zinc-900/60'
                }`}
              >
                <span className="text-2xl block mb-1">{mood.emoji}</span>
                <p className="text-xs font-bold text-white">{mood.label}</p>
                {isSelected && (
                  <div className="mt-1 flex items-center justify-center text-[10px] text-purple-300 font-semibold gap-0.5">
                    <Check size={11} />
                    <span>Active</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Optional Reflection Question Card */}
      <div className="p-4 rounded-2xl glass-card border-purple-500/25 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
            <HelpCircle size={15} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              Quick Reflection Question
            </span>
            <p className="text-xs font-bold text-white mt-0.5">
              {currentMoodObj.question}
            </p>
          </div>
        </div>

        {answeredPrompt ? (
          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-zinc-300 flex items-center justify-between">
            <span className="truncate italic">"{answeredPrompt}"</span>
            <button
              onClick={() => {
                setAnsweredPrompt(null);
                setReflectionInput('');
              }}
              className="text-[10px] text-purple-400 hover:text-purple-200 ml-2"
            >
              Change
            </button>
          </div>
        ) : (
          <form onSubmit={handleReflectionSubmit} className="space-y-2">
            <input
              type="text"
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="1 sentence is enough..."
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-between items-center text-[11px] text-zinc-500">
              <span>Optional · Tailors AI recommendations</span>
              <button
                type="submit"
                disabled={!reflectionInput.trim()}
                className="py-1 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Reflect</span>
                <Send size={11} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Energy Level Battery Slider */}
      <div className="p-4 rounded-2xl glass-card border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <BatteryCharging size={14} className="text-purple-400" />
            <span>Energy Reserve</span>
          </div>
          <span className="text-xs font-bold text-purple-300">
            {profile.energyLevel} / 10
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={profile.energyLevel}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onUpdateEnergy(val);
          }}
          className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
          <span>1 (Exhausted)</span>
          <span>5 (Cruising)</span>
          <span>10 (Overclocked)</span>
        </div>
      </div>

      {/* 4. AI Vibe Reflection & Personalized Suggestion */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-zinc-900/70 to-zinc-950 border border-purple-500/30 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Sparkles size={13} />
            </div>
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Personalized AI Guidance
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500">Live Insight</span>
        </div>

        {loadingReflection ? (
          <div className="py-4 text-center text-xs text-zinc-400 animate-pulse">
            Formulating personal guidance...
          </div>
        ) : reflection ? (
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white font-display">
              {reflection.headline}
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              "{reflection.reflection}"
            </p>

            {/* Micro-moves */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-zinc-400">
                Tailored micro-moves for right now:
              </span>
              {reflection.actions.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-zinc-300 p-2 rounded-xl bg-zinc-900/60 border border-white/[0.04]"
                >
                  <span className="text-purple-400 font-bold">·</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* 5. Quick Reset & Focus Tools */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Quick Planning & Mental Tools
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {/* Cortisol Reset */}
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="p-3.5 rounded-2xl glass-card border-white/[0.08] hover:border-purple-500/30 text-left space-y-1.5 transition-all group active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wind size={15} />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              2-Min Cortisol Drop
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Guided box-breathing to kill anxiety
            </p>
          </button>

          {/* Anti-Procrastination Sprint */}
          <button
            onClick={() => onStartFocus('5-Minute Anti-Procrastination Sprint', 5)}
            className="p-3.5 rounded-2xl glass-card border-white/[0.08] hover:border-purple-500/30 text-left space-y-1.5 transition-all group active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock size={15} />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              5-Min Kickstart
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Micro-sprint to bypass starting resistance
            </p>
          </button>
        </div>

        {/* Ambient Focus Soundscape */}
        <FocusSoundscape />
      </div>

      {/* Breathing Modal */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />
    </div>
  );
};
