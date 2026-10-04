import { Task, BrainDumpPlan, WhatRnResult, UserVibeContext, DailyReflection } from '../types';

export const AIService = {
  /**
   * 9-Step Intelligent Brain Dump
   */
  analyzeBrainDump: async (dumpText: string, userContext?: UserVibeContext): Promise<BrainDumpPlan> => {
    try {
      const response = await fetch('/api/gemini/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dumpText, userContext }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      return {
        heroHeading: data.heroHeading || 'I GOT YOU.',
        situationSummary:
          data.situationSummary ||
          `You're carrying ${data.tasks?.length || 3} things right now. Don't attack all of them at once.`,
        emotionalCheck:
          data.emotionalCheck ||
          'Your brain was juggling multiple priorities. We just removed the pressure so you only have to touch one move.',
        nowMove: data.nowMove || {
          title: data.tasks?.[0]?.title || 'Review your top priority document for 20m',
          duration: `${data.tasks?.[0]?.estimatedMinutes || 25} min`,
          why: 'Knock this out first to drop mental resistance.',
        },
        thenMove: data.thenMove,
        canWaitList: data.canWaitList || [
          'Non-urgent messages can wait until later.',
          'Everything with no deadline today is safely parked.',
        ],
        tasks: data.tasks || [],
        reminders: data.reminders || [
          'Hydrate before your focus session',
          'Put your phone on Do Not Disturb',
        ],
      };
    } catch (err) {
      console.warn('AIService: brain dump server fallback engaged:', err);
      return generateLocalBrainDumpPlan(dumpText, userContext);
    }
  },

  /**
   * Signature "WHAT SHOULD I DO RN?" Engine
   */
  getWhatShouldIDoRn: async (
    tasks: Task[],
    userContext?: UserVibeContext,
    skipTitle?: string,
    notFeelingReason?: string
  ): Promise<WhatRnResult> => {
    try {
      const response = await fetch('/api/gemini/what-rn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          userContext,
          skipTitle,
          notFeelingReason,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      return {
        recommendation: data.recommendation,
        taskId: data.taskId,
        category: data.category || 'Focus',
        estimatedMinutes: data.estimatedMinutes || 25,
        timeNeededText: data.timeNeededText || `${data.estimatedMinutes || 25} minutes`,
        whyThis:
          data.whyThis ||
          "It's the closest deadline, you're already stressed about it, and finishing one chunk will make the rest of tonight easier.",
        procrastinationHack:
          data.procrastinationHack ||
          "The 2-Minute Rule: Just open the file, write 1 sentence or bullet point. Friction vanishes once you start.",
        hypeQuote: data.hypeQuote || "Future you is gonna be so grateful you didn't leave this for 1 AM.",
        alternativeOptions: data.alternativeOptions || [
          'Do a 5-minute desk declutter & drink water',
          'Review just 1 slide or paragraph',
          'Draft a 3-bullet plan for tomorrow',
        ],
      };
    } catch (err) {
      console.warn('AIService: what-rn server fallback engaged:', err);
      return generateLocalWhatRn(tasks, userContext, skipTitle, notFeelingReason);
    }
  },

  /**
   * Deep Daily Reflection and Pattern Synthesis
   */
  getVibeReflection: async (
    userContextOrMood: UserVibeContext | string,
    reflectionDataOrEnergy?: Partial<DailyReflection> | number,
    maybeAnswer?: string
  ): Promise<{
    headline: string;
    reflection: string;
    aiSummary: string;
    aiPatternInsight: string;
    actions: string[];
  }> => {
    let userContext: any = undefined;
    let reflectionData: any = {};

    if (typeof userContextOrMood === 'string') {
      reflectionData = {
        mood: userContextOrMood,
        energy: typeof reflectionDataOrEnergy === 'number' ? reflectionDataOrEnergy : 8,
        onYourMind: maybeAnswer,
      };
    } else {
      userContext = userContextOrMood;
      if (typeof reflectionDataOrEnergy === 'object') {
        reflectionData = reflectionDataOrEnergy;
      }
    }

    try {
      const response = await fetch('/api/gemini/vibe-reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext,
          reflectionData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const summary = data.aiSummary || data.reflection || 'Take a deep breath and protect your energy tonight.';
      const pattern = data.aiPatternInsight || data.headline || 'One small move generates momentum.';

      return {
        headline: summary,
        reflection: summary,
        aiSummary: summary,
        aiPatternInsight: pattern,
        actions: data.actions || [
          'Take a 2-minute breath break',
          'Tackle the top item on your list for 15 minutes',
          'Put your phone in another room',
        ],
      };
    } catch (err) {
      console.warn('AIService: vibe-reflect server fallback engaged:', err);
      const summary = reflectionData?.onYourMind
        ? `You're currently holding: "${reflectionData.onYourMind}". You don't have to carry the whole week at once. Take it one bite at a time.`
        : 'You do not have to conquer everything today. Pick 1 priority, execute it without perfectionism, and protect your headspace.';
      const pattern = 'You tend to get more done when you start with one 15-minute low friction win rather than staring at the full to-do list.';

      return {
        headline: summary,
        reflection: summary,
        aiSummary: summary,
        aiPatternInsight: pattern,
        actions: [
          'Do a 2-minute physical reset: drink water, stretch wrists & neck',
          'Put phone face down or turn on Do Not Disturb',
          'Set a 20-minute timer and just focus on one single task',
        ],
      };
    }
  },
};

// --- Local Resilient Generators ---
function generateLocalBrainDumpPlan(dumpText: string, userContext?: UserVibeContext): BrainDumpPlan {
  const lower = dumpText.toLowerCase();
  const tasks: Task[] = [];
  const canWait: string[] = [];
  let id = 1;

  if (lower.includes('exam') || lower.includes('study') || lower.includes('test')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Review high-yield exam slides & key summary notes',
      category: 'Study',
      deadline: 'Tomorrow 9:00 AM',
      estimatedMinutes: 25,
      priority: 'high',
      suggestedSlot: 'Right now (First win)',
      reminder: 'Bookmark key formula sheet',
      completed: false,
    });
  }

  if (lower.includes('assignment') || lower.includes('homework') || lower.includes('canvas')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Complete and submit pending assignment section',
      category: 'College',
      deadline: 'Tonight 11:59 PM',
      estimatedMinutes: 35,
      priority: 'high',
      suggestedSlot: 'After exam review',
      reminder: 'Check rubric before submitting',
      completed: false,
    });
  }

  if (lower.includes('friend') || lower.includes('call') || lower.includes('text')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Quick 10-minute catch up call with friend',
      category: 'Social',
      deadline: 'Today evening',
      estimatedMinutes: 10,
      priority: 'medium',
      suggestedSlot: 'Dinner break',
      completed: false,
    });
    canWait.push('Non-urgent catchup can happen during dinner or tomorrow morning.');
  }

  if (lower.includes('workout') || lower.includes('gym') || lower.includes('run')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: '25-minute brisk walk or quick workout to clear head',
      category: 'Health',
      deadline: 'Today',
      estimatedMinutes: 25,
      priority: 'medium',
      suggestedSlot: 'Late afternoon reset',
      completed: false,
    });
  }

  if (lower.includes('portfolio') || lower.includes('code') || lower.includes('project')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Polish portfolio hero section & live links',
      category: 'Career',
      deadline: 'This weekend',
      estimatedMinutes: 25,
      priority: 'medium',
      suggestedSlot: 'Late night chill session',
      completed: false,
    });
    canWait.push('Your portfolio has no strict deadline tonight—park it for tomorrow with zero guilt.');
  }

  if (tasks.length === 0) {
    tasks.push(
      {
        id: `task-${Date.now()}-${id++}`,
        title: 'Tackle the #1 source of mental friction for 20 minutes',
        category: 'Focus',
        deadline: 'Today',
        estimatedMinutes: 20,
        priority: 'high',
        suggestedSlot: 'First win',
        completed: false,
      },
      {
        id: `task-${Date.now()}-${id++}`,
        title: 'Chug 500ml cold water & organize workspace',
        category: 'Health',
        deadline: 'Next 5m',
        estimatedMinutes: 5,
        priority: 'low',
        suggestedSlot: 'Immediate reset',
        completed: false,
      }
    );
  }

  return {
    heroHeading: 'I GOT YOU.',
    situationSummary: `You're carrying ${tasks.length} things right now. Don't attack all of them.`,
    emotionalCheck: 'Your brain was overloaded. We just filtered out the non-urgent noise so you only need to make one move.',
    nowMove: {
      title: tasks[0].title,
      duration: `${tasks[0].estimatedMinutes} min`,
      why: 'It has the closest deadline and finishing it drops your stress immediately.',
    },
    thenMove: tasks[1]
      ? {
          title: tasks[1].title,
          duration: `${tasks[1].estimatedMinutes} min`,
          why: 'Quick follow-up once you ride the momentum of the first win.',
        }
      : undefined,
    canWaitList: canWait.length > 0 ? canWait : [
      'Anything not due in the next 24 hours can safely wait.',
      'Take perfectionism off the table tonight.',
    ],
    tasks,
    reminders: [
      'Drink water before starting',
      'Put phone on Do Not Disturb',
    ],
  };
}

function generateLocalWhatRn(
  tasks: Task[],
  userContext?: UserVibeContext,
  skipTitle?: string,
  notFeelingReason?: string
): WhatRnResult {
  const pending = tasks.filter((t) => !t.completed && t.title !== skipTitle);
  const target = pending.find((t) => t.priority === 'high') || pending[0] || {
    id: 'instant-1',
    title: 'Do a 15-minute quick sprint on your highest leverage task',
    category: 'Focus' as const,
    estimatedMinutes: 15,
  };

  const reasonAdj = notFeelingReason ? `Since you're feeling "${notFeelingReason}", let's make this ridiculously low friction.` : '';

  return {
    recommendation: target.title,
    taskId: target.id,
    category: target.category,
    estimatedMinutes: target.estimatedMinutes || 25,
    timeNeededText: `${target.estimatedMinutes || 25} minutes`,
    whyThis: `Do this first. ${reasonAdj} It is your closest deadline, you're already stressed about it, and finishing one chunk will make the rest of tonight easier.`,
    procrastinationHack: "The 2-Minute Rule: Just open the document and type 1 bullet point or sentence. You don't have to finish it now—just touch it.",
    hypeQuote: "Future you is gonna be so grateful you didn't leave this for 1 AM.",
    alternativeOptions: [
      'Do a 5-minute desk declutter & drink water',
      'Review just 1 slide or paragraph',
      'Draft a 3-bullet plan for tomorrow',
    ],
  };
}
