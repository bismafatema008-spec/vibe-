export type TabType = 'home' | 'vibe' | 'rooms' | 'progress' | 'profile';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'Study' | 'College' | 'Career' | 'Social' | 'Health' | 'Life' | 'Focus' | 'Admin';

export type WorkingStyle =
  | 'Short bursts'
  | 'Deep focus'
  | 'One thing at a time'
  | 'Flexible planning'
  | 'Strict schedule'
  | 'Depends on my mood';

export type AvailableTimeOption =
  | '15–30 min'
  | '30–60 min'
  | '1–2 hours'
  | '2–4 hours'
  | 'Different every day';

export type VibeExpectation =
  | 'Tell me what to do'
  | 'Help me plan'
  | 'Help me prioritize'
  | 'Help me get motivated'
  | 'Help me stop procrastinating'
  | 'Just listen'
  | 'Break everything into tiny steps';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  deadline?: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  energyRequired?: 'low' | 'medium' | 'high';
  suggestedSlot?: string;
  reminder?: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface BrainDumpPlan {
  heroHeading: string;
  situationSummary: string;
  emotionalCheck: string;
  nowMove: {
    title: string;
    duration: string;
    why: string;
  };
  thenMove?: {
    title: string;
    duration: string;
    why: string;
  };
  canWaitList: string[];
  tasks: Task[];
  reminders: string[];
}

export interface WhatRnResult {
  recommendation: string;
  taskId?: string;
  category: string;
  estimatedMinutes: number;
  whyThis: string;
  timeNeededText: string;
  procrastinationHack: string;
  hypeQuote: string;
  alternativeOptions?: string[];
}

export interface FocusSession {
  id: string;
  taskTitle: string;
  minutes: number;
  completedAt: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  mood: string;
  onYourMind?: string;
  wentWell?: string;
  drainingYou?: string;
  tomorrowVision?: string;
  aiSummary?: string;
  aiPatternInsight?: string;
}

export interface RoomComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface RoomPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
    tag?: string;
  };
  content: string;
  timestamp: string;
  reactions: {
    [emoji: string]: number;
  };
  userReaction?: string;
  comments: RoomComment[];
}

export interface RoomChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  joined: boolean;
}

export interface Room {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  bannerColor: string;
  memberCount: number;
  category: string;
  isJoined: boolean;
  activeChallenge?: RoomChallenge;
  posts: RoomPost[];
}

export interface Streak {
  id: string;
  name: string;
  icon: string;
  count: number;
  unit: string;
  color: string;
  lastCheckedToday: boolean;
  categoryLink?: TaskCategory;
}

export interface UserGoal {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface MoodReflection {
  id?: string;
  mood: string;
  energyLevel: number;
  answer?: string;
  headline?: string;
  reflection?: string;
  aiSummary?: string;
  aiPatternInsight?: string;
  actions: string[];
}

export interface UserVibeContext {
  userName: string;
  name: string; // compatibility
  username: string;
  avatar: string;
  bio: string;
  currentSituation: string[]; // e.g. ["College", "Exams", "Coding", "Job search"]
  customSituation?: string;
  goals: UserGoal[];
  currentStressors: string; // The literal raw dump of whatever is stressing them out
  workingStyle: WorkingStyle;
  availableTime: AvailableTimeOption;
  currentMood: string; // "🔥 Locked in", "😌 Chill", etc.
  customMood?: string;
  energyLevel: number;
  todayFocusMinutes: number;
  weeklyFocusMinutes: number;
  personalityTone: 'Witty Gen-Z' | 'Chill Mentor' | 'Hype Bestie' | 'Raw & Direct';
  aiIntensity: 'Balanced' | 'High Energy' | 'Minimalist';
  themeColor: string;
  joinedRoomIds: string[];
  whatYouWantFromVibe: VibeExpectation;
  interests: string[];
  settings: {
    smartNudges: boolean;
    incognitoDump: boolean;
    ambientSoundEnabled: boolean;
    hapticFeedback: boolean;
  };
}

export type UserProfile = UserVibeContext;
