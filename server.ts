import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// Resilient Fallback Generators for Instant Offline / No-Key Mode
// -------------------------------------------------------------
function generateFallbackBrainDump(dumpText: string, userContext?: any) {
  const lower = dumpText.toLowerCase();
  const tasks = [];
  let id = 1;

  if (lower.includes('exam') || lower.includes('study') || lower.includes('test')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Review high-yield exam slides & key summary sheet',
      category: 'Study',
      deadline: 'Tomorrow 9:00 AM',
      estimatedMinutes: 25,
      priority: 'high',
      suggestedSlot: 'Right now (First win)',
      completed: false,
    });
  }

  if (lower.includes('assignment') || lower.includes('homework') || lower.includes('canvas')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Finish pending assignment section 2',
      category: 'College',
      deadline: 'Tonight 11:59 PM',
      estimatedMinutes: 30,
      priority: 'high',
      suggestedSlot: 'After exam review',
      completed: false,
    });
  }

  if (lower.includes('friend') || lower.includes('call') || lower.includes('text')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Quick 10-min catch up call with friend',
      category: 'Social',
      deadline: 'Today evening',
      estimatedMinutes: 10,
      priority: 'low',
      suggestedSlot: 'Dinner break',
      completed: false,
    });
  }

  if (lower.includes('workout') || lower.includes('gym') || lower.includes('walk')) {
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

  if (lower.includes('portfolio') || lower.includes('code') || lower.includes('coding') || lower.includes('build')) {
    tasks.push({
      id: `task-${Date.now()}-${id++}`,
      title: 'Tweak portfolio hero copy & live demo links',
      category: 'Career',
      deadline: 'This weekend',
      estimatedMinutes: 25,
      priority: 'medium',
      suggestedSlot: 'Late night chill',
      completed: false,
    });
  }

  if (tasks.length === 0) {
    tasks.push(
      {
        id: `task-${Date.now()}-${id++}`,
        title: 'Tackle the #1 item on your mind for just 20 minutes',
        category: 'Focus',
        deadline: 'Today',
        estimatedMinutes: 20,
        priority: 'high',
        suggestedSlot: 'First win',
        completed: false,
      },
      {
        id: `task-${Date.now()}-${id++}`,
        title: 'Drink 500ml water and clear physical desk of clutter',
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
    heroHeading: "I GOT YOU.",
    situationSummary: `You're carrying ${tasks.length} different things right now. Don't attack all of them at once.`,
    emotionalCheck: "Your brain was doing mental gymnastics. We just stripped away the pressure so you only have to touch one thing.",
    nowMove: {
      title: tasks[0].title,
      duration: `${tasks[0].estimatedMinutes} min`,
      why: "It has the most urgency and clearing it drops your cortisol immediately.",
    },
    thenMove: tasks[1]
      ? {
          title: tasks[1].title,
          duration: `${tasks[1].estimatedMinutes} min`,
          why: "Solid follow-up once you ride the first wave of momentum.",
        }
      : undefined,
    canWaitList: [
      "Your portfolio can wait until tomorrow.",
      "Non-urgent messages can wait until your dinner break.",
      "Everything not due in the next 24 hours is parked safely.",
    ],
    tasks,
    reminders: [
      "Hydrate before sitting down to focus.",
      "Put phone face down in another room.",
    ],
  };
}

function generateFallbackWhatRn(tasks: any[], userContext?: any, skipTitle?: string, notFeelingReason?: string) {
  const pending = tasks.filter((t: any) => !t.completed && t.title !== skipTitle);
  const target = pending.find((t: any) => t.priority === 'high') || pending[0] || {
    title: 'Spend 15 minutes organizing your notes and setting up one file',
    category: 'Focus',
    estimatedMinutes: 15,
  };

  const reasonAdj = notFeelingReason ? `Since you're feeling "${notFeelingReason}", let's make this ridiculously low friction.` : '';

  return {
    recommendation: target.title,
    taskId: target.id,
    category: target.category || 'Focus',
    estimatedMinutes: target.estimatedMinutes || 25,
    timeNeededText: `${target.estimatedMinutes || 25} minutes`,
    whyThis: `Do this first. ${reasonAdj} It is your closest priority, you've been carrying the stress of it, and knocking out just 20-30 minutes will make the rest of your night infinitely lighter.`,
    procrastinationHack: "The 2-Minute Rule: Just open the document and type 1 bullet point or sentence. You don't have to finish it now—just touch it.",
    hypeQuote: "Future you is gonna be so grateful you didn't leave this for 1 AM.",
    alternativeOptions: [
      'Do a 5-minute desk declutter & drink water',
      'Read just 2 pages or review 1 slide',
      'Draft a 3-bullet plan for tomorrow',
    ],
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Brain Dump Analyzer
app.post('/api/gemini/brain-dump', async (req: Request, res: Response) => {
  const { dumpText, userContext } = req.body;
  if (!dumpText || typeof dumpText !== 'string') {
    res.status(400).json({ error: 'Dump text is required' });
    return;
  }

  if (!ai) {
    res.json(generateFallbackBrainDump(dumpText, userContext));
    return;
  }

  try {
    const contextPrompt = userContext
      ? `User's Life Context:
- What's going on: ${JSON.stringify(userContext.currentSituation || [])}
- What they are trying to achieve: ${JSON.stringify(userContext.goals || [])}
- Current stressors: "${userContext.currentStressors || 'None specified'}"
- How they work: ${userContext.workingStyle || 'Flexible planning'}
- Available time: ${userContext.availableTime || '1–2 hours'}
- Current vibe: ${userContext.currentMood || '🔥 Locked in'}
- What they want from VIBE: ${userContext.whatYouWantFromVibe || 'Tell me what to do'}`
      : 'User context: College student / young builder.';

    const prompt = `User's raw mental brain dump:
"""${dumpText}"""

${contextPrompt}

CRITICAL INSTRUCTIONS:
Do NOT simply convert every sentence into a mechanical checklist!
Follow these 9 intelligence steps:
1. Understand the situation.
2. Detect urgency & deadlines.
3. Detect emotional overload.
4. Identify what actually matters right now.
5. Remove unnecessary pressure.
6. Break large tasks into manageable actions (15-45 mins each).
7. Decide what should happen NOW ("nowMove").
8. Suggest what can wait ("canWaitList" - list 2-3 specific things the user should NOT stress about today!).
9. Respond with the exact hero heading "I GOT YOU."

Return valid JSON adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are VIBE — an empathetic, hyper-smart Gen-Z AI life companion.
Your motto: "Dump your chaos. Get your next move."
You speak like a supportive, brilliant best friend: concise, warm, witty, realistic, and never judgmental.
Your purpose is to untangle overwhelming thoughts and tell the user:
"I GOT YOU. You're carrying X things right now. Don't attack all of them. Here is your move NOW, and here is what can wait."`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heroHeading: { type: Type.STRING },
            situationSummary: { type: Type.STRING },
            emotionalCheck: { type: Type.STRING },
            nowMove: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                why: { type: Type.STRING },
              },
              required: ['title', 'duration', 'why'],
            },
            thenMove: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                why: { type: Type.STRING },
              },
            },
            canWaitList: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  priority: { type: Type.STRING },
                  suggestedSlot: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN },
                },
                required: ['title', 'category', 'estimatedMinutes', 'priority'],
              },
            },
            reminders: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['heroHeading', 'situationSummary', 'nowMove', 'canWaitList', 'tasks'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    if (!parsed.tasks || parsed.tasks.length === 0) {
      res.json(generateFallbackBrainDump(dumpText, userContext));
      return;
    }

    parsed.tasks = parsed.tasks.map((t: any, idx: number) => ({
      ...t,
      id: t.id || `task-${Date.now()}-${idx + 1}`,
      completed: false,
    }));

    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini brain-dump error, using fallback:', err?.message || err);
    res.json(generateFallbackBrainDump(dumpText, userContext));
  }
});

// 2. "WHAT SHOULD I DO RN?" Decider
app.post('/api/gemini/what-rn', async (req: Request, res: Response) => {
  const { tasks, userContext, skipTitle, notFeelingReason } = req.body;

  if (!ai) {
    res.json(generateFallbackWhatRn(tasks || [], userContext, skipTitle, notFeelingReason));
    return;
  }

  try {
    const contextStr = userContext
      ? `USER'S PERSONAL CONTEXT:
- Name: ${userContext.userName || 'User'}
- Life Areas: ${JSON.stringify(userContext.currentSituation || [])}
- Goals: ${JSON.stringify(userContext.goals || [])}
- Stressors: "${userContext.currentStressors || 'None'}"
- Working Style: ${userContext.workingStyle || 'Deep focus'}
- Available Time: ${userContext.availableTime || '30–60 min'}
- Current Vibe: ${userContext.currentMood || '🔥 Locked in'}
- Wants from VIBE: ${userContext.whatYouWantFromVibe || 'Tell me what to do'}`
      : 'Standard context: University / creator balancing deadlines.';

    const prompt = `Pending Tasks:
${JSON.stringify(tasks || [])}

${contextStr}

${skipTitle ? `User previously rejected / said NOT FEELING IT to: "${skipTitle}"` : ''}
${notFeelingReason ? `User's reason for rejecting: "${notFeelingReason}"` : ''}

INSTRUCTIONS:
Analyze the user's deadlines, current vibe, available time, working style, stress level, and what they specifically want from VIBE.
Recommend EXACTLY ONE single next action. Not a list of 10 things.
Tone: smart, supportive Gen-Z friend (e.g., "Do your assignment for 25 minutes. It's the closest deadline, you're already stressed about it, and finishing one chunk will make the rest of tonight easier.")
Never be judgmental. Never say "You should work harder" or "Stop procrastinating". Sound like: "Okay, you're clearly overloaded. Let's make this stupidly easy."
Fill out: recommendation, category, estimatedMinutes, timeNeededText, whyThis, procrastinationHack, hypeQuote, alternativeOptions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are VIBE's signature "WHAT SHOULD I DO RN?" engine.
You recommend EXACTLY ONE next action with deep contextual empathy.
Return structured JSON.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedMinutes: { type: Type.INTEGER },
            timeNeededText: { type: Type.STRING },
            whyThis: { type: Type.STRING },
            procrastinationHack: { type: Type.STRING },
            hypeQuote: { type: Type.STRING },
            alternativeOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['recommendation', 'category', 'estimatedMinutes', 'whyThis', 'procrastinationHack', 'hypeQuote'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    if (!parsed.recommendation) {
      res.json(generateFallbackWhatRn(tasks || [], userContext, skipTitle, notFeelingReason));
      return;
    }

    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini what-rn error, using fallback:', err?.message || err);
    res.json(generateFallbackWhatRn(tasks || [], userContext, skipTitle, notFeelingReason));
  }
});

// 3. Vibe Reflection & Daily Reset
app.post('/api/gemini/vibe-reflect', async (req: Request, res: Response) => {
  const { userContext, reflectionData } = req.body;

  const fallbackReflection = {
    aiSummary: reflectionData?.onYourMind
      ? `You're navigating: "${reflectionData.onYourMind}". You don't have to carry the whole week at once. Protect your peace tonight.`
      : 'You do not have to conquer everything today. Pick 1 priority, execute it without perfectionism, and protect your headspace tonight.',
    aiPatternInsight: 'You consistently get more done when you start with one 15-minute micro-win instead of looking at the mountain.',
    actions: [
      'Do a 2-minute physical reset: drink water, stretch wrists & neck',
      'Put phone face down or turn on Do Not Disturb',
      'Set a 20-minute timer and just focus on one single task',
    ],
  };

  if (!ai) {
    res.json(fallbackReflection);
    return;
  }

  try {
    const prompt = `User's Reflection Check-in:
- Mood: ${reflectionData?.mood || userContext?.currentMood || '🔥 Locked in'}
- What is on your mind: "${reflectionData?.onYourMind || 'Not entered'}"
- What went well today: "${reflectionData?.wentWell || 'Not entered'}"
- What is draining you: "${reflectionData?.drainingYou || 'Not entered'}"
- What do you want tomorrow to look like: "${reflectionData?.tomorrowVision || 'Not entered'}"
- User Goals: ${JSON.stringify(userContext?.goals || [])}
- User Stressors: "${userContext?.currentStressors || 'None'}"

Synthesize this reflection:
1. "aiSummary": Short, deeply empathetic distillation of where their head is at right now (Gen-Z casual, grounding, zero corporate fluff).
2. "aiPatternInsight": One constructive, encouraging pattern insight (e.g. "You've been coding more consistently this week." or "You tend to feel drained when you let assignments pile up till 9 PM. Starting 30 mins earlier makes all the difference.").
3. "actions": 3 realistic, immediate grounding moves.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are VIBE's personal reflection mentor. Grounded, empathetic, Gen-Z casual, positive and realistic.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiSummary: { type: Type.STRING },
            aiPatternInsight: { type: Type.STRING },
            actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['aiSummary', 'aiPatternInsight', 'actions'],
        },
      },
    });

    res.json(JSON.parse(response.text?.trim() || '{}'));
  } catch (err: any) {
    console.error('Vibe reflect error:', err?.message || err);
    res.json(fallbackReflection);
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ VIBE server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
