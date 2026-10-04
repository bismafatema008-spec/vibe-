import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Sliders,
  Clock,
  Briefcase,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';
import {
  UserVibeContext,
  WorkingStyle,
  AvailableTimeOption,
  VibeExpectation,
} from '../../types';
import { MOOD_OPTIONS } from '../../data/initialData';

interface MyVibeModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: UserVibeContext;
  onSaveContext: (updated: UserVibeContext) => void;
}

export const MyVibeModal: React.FC<MyVibeModalProps> = ({
  isOpen,
  onClose,
  context,
  onSaveContext,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [situations, setSituations] = useState<string[]>(context.currentSituation || []);
  const [goals, setGoals] = useState<{ id: string; title: string; completed: boolean }[]>(
    context.goals || []
  );
  const [newGoalInput, setNewGoalInput] = useState('');
  const [stressors, setStressors] = useState(context.currentStressors || '');
  const [workStyle, setWorkStyle] = useState<WorkingStyle>(context.workingStyle || 'Deep focus');
  const [availTime, setAvailTime] = useState<AvailableTimeOption>(context.availableTime || '1–2 hours');
  const [mood, setMood] = useState<string>(context.currentMood || '🔥 Locked in');
  const [customMoodInput, setCustomMoodInput] = useState(context.customMood || '');
  const [vibeExpectation, setVibeExpectation] = useState<VibeExpectation>(
    context.whatYouWantFromVibe || 'Tell me what to do'
  );

  if (!isOpen) return null;

  const lifeOptions = [
    'College',
    'Exams',
    'Coding',
    'Job search',
    'UGC/content creation',
    'Relationships/friends',
    'Fitness',
    'Personal goals',
    'Multiple things at once',
  ];

  const workStyleOptions: WorkingStyle[] = [
    'Short bursts',
    'Deep focus',
    'One thing at a time',
    'Flexible planning',
    'Strict schedule',
    'Depends on my mood',
  ];

  const timeOptions: AvailableTimeOption[] = [
    '15–30 min',
    '30–60 min',
    '1–2 hours',
    '2–4 hours',
    'Different every day',
  ];

  const expectationOptions: VibeExpectation[] = [
    'Tell me what to do',
    'Help me plan',
    'Help me prioritize',
    'Help me get motivated',
    'Help me stop procrastinating',
    'Just listen',
    'Break everything into tiny steps',
  ];

  const toggleSituation = (option: string) => {
    if (situations.includes(option)) {
      setSituations(situations.filter((s) => s !== option));
    } else {
      setSituations([...situations, option]);
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    setGoals([
      ...goals,
      {
        id: `g-${Date.now()}`,
        title: newGoalInput.trim(),
        completed: false,
      },
    ]);
    setNewGoalInput('');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleSave = () => {
    onSaveContext({
      ...context,
      currentSituation: situations,
      goals,
      currentStressors: stressors,
      workingStyle: workStyle,
      availableTime: availTime,
      currentMood: mood,
      customMood: customMoodInput.trim() || undefined,
      whatYouWantFromVibe: vibeExpectation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full h-full md:max-w-xl md:h-[88vh] md:rounded-3xl bg-[#0d0d12] border-0 md:border border-purple-500/25 shadow-2xl flex flex-col overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-80 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sliders size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                My VIBE Setup & Tuning
              </h2>
              <p className="text-[11px] text-zinc-400">
                Help VIBE understand your reality before recommending moves
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Questions Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Question 1: What's going on in your life right now? */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                1. What's going on in your life right now?
              </h3>
              <span className="text-[10px] text-zinc-400">Multiple allowed</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lifeOptions.map((opt) => {
                const isSelected = situations.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleSituation(opt)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30'
                        : 'bg-zinc-900/80 border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Question 2: What are you trying to achieve? */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                2. What are you trying to achieve?
              </h3>
              <span className="text-[10px] text-zinc-400">In your own words</span>
            </div>

            <div className="space-y-1.5">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.05] flex items-center justify-between text-xs text-zinc-200"
                >
                  <span className="truncate pr-2">"{g.title}"</span>
                  <button
                    onClick={() => handleRemoveGoal(g.id)}
                    className="text-zinc-500 hover:text-rose-400 p-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                placeholder="e.g. I want to build my portfolio / prepare for exams"
                className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Add
              </button>
            </form>
          </section>

          {/* Question 3: What's currently stressing you out? */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                3. What's currently stressing you out?
              </h3>
              <span className="text-[10px] text-purple-300">Feeds AI directly</span>
            </div>
            <textarea
              value={stressors}
              onChange={(e) => setStressors(e.target.value)}
              placeholder="Dump whatever is in your head right now (e.g. Exam next week, assignment pending, haven't worked on portfolio, and I keep procrastinating)..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </section>

          {/* Question 4: How do you like to work? */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">
              4. How do you like to work?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {workStyleOptions.map((ws) => (
                <button
                  key={ws}
                  onClick={() => setWorkStyle(ws)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    workStyle === ws
                      ? 'bg-purple-950/60 border-purple-500/60 text-white font-semibold shadow-sm'
                      : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{ws}</span>
                    {workStyle === ws && <Check size={13} className="text-purple-400" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Question 5: How much time do you actually have? */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">
              5. How much time do you actually have?
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {timeOptions.map((to) => (
                <button
                  key={to}
                  onClick={() => setAvailTime(to)}
                  className={`p-2 rounded-xl border text-center text-xs transition-all ${
                    availTime === to
                      ? 'bg-purple-950/60 border-purple-500/60 text-white font-semibold'
                      : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{to}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Question 6: What's your current vibe? */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">
              6. What's your current vibe?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = mood.includes(m.label);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMood(`${m.emoji} ${m.label}`);
                      setCustomMoodInput('');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-sm'
                        : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{m.emoji}</span>
                    <span className="text-xs font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customMoodInput}
              onChange={(e) => {
                setCustomMoodInput(e.target.value);
                if (e.target.value.trim()) setMood(`✨ ${e.target.value.trim()}`);
              }}
              placeholder="Or write custom mood text (e.g. 3 AM tea & caffeine flow)"
              className="w-full p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </section>

          {/* Question 7: What do you want from VIBE right now? */}
          <section className="space-y-2.5 pb-4">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">
              7. What do you want from VIBE right now?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {expectationOptions.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setVibeExpectation(exp)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    vibeExpectation === exp
                      ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-500/60 text-white font-semibold'
                      : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{exp}</span>
                    {vibeExpectation === exp && <Check size={12} className="text-purple-400" />}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Save Button */}
        <div className="p-4 border-t border-white/[0.08] bg-zinc-950/90 backdrop-blur-md flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400">
            Updates VIBE's brain for your life right now
          </span>
          <button
            onClick={handleSave}
            className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
          >
            Apply My VIBE ⚡️
          </button>
        </div>
      </div>
    </div>
  );
};
