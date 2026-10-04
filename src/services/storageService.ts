import { Task, Streak, Room, UserVibeContext, FocusSession, DailyReflection } from '../types';
import {
  INITIAL_TASKS,
  INITIAL_STREAKS,
  INITIAL_ROOMS,
  INITIAL_VIBE_CONTEXT,
} from '../data/initialData';

const STORAGE_KEYS = {
  TASKS: 'vibe_tasks_v3',
  STREAKS: 'vibe_streaks_v3',
  ROOMS: 'vibe_rooms_v3',
  CONTEXT: 'vibe_user_context_v3',
  FOCUS_SESSIONS: 'vibe_focus_sessions_v3',
  REFLECTIONS: 'vibe_reflections_v3',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Storage read error for key: ${key}`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Storage write error for key: ${key}`, err);
  }
}

export const StorageService = {
  // Tasks
  getTasks: async (): Promise<Task[]> => {
    return safeGet<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },
  saveTasks: async (tasks: Task[]): Promise<void> => {
    safeSet(STORAGE_KEYS.TASKS, tasks);
  },

  // Streaks
  getStreaks: async (): Promise<Streak[]> => {
    return safeGet<Streak[]>(STORAGE_KEYS.STREAKS, INITIAL_STREAKS);
  },
  saveStreaks: async (streaks: Streak[]): Promise<void> => {
    safeSet(STORAGE_KEYS.STREAKS, streaks);
  },

  // Rooms
  getRooms: async (): Promise<Room[]> => {
    return safeGet<Room[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  },
  saveRooms: async (rooms: Room[]): Promise<void> => {
    safeSet(STORAGE_KEYS.ROOMS, rooms);
  },

  // Central User Vibe Context
  getVibeContext: async (): Promise<UserVibeContext> => {
    return safeGet<UserVibeContext>(STORAGE_KEYS.CONTEXT, INITIAL_VIBE_CONTEXT);
  },
  saveVibeContext: async (context: UserVibeContext): Promise<void> => {
    safeSet(STORAGE_KEYS.CONTEXT, context);
  },
  getProfile: async (): Promise<UserVibeContext> => {
    return safeGet<UserVibeContext>(STORAGE_KEYS.CONTEXT, INITIAL_VIBE_CONTEXT);
  },
  saveProfile: async (context: UserVibeContext): Promise<void> => {
    safeSet(STORAGE_KEYS.CONTEXT, context);
  },

  // Focus Sessions
  getFocusSessions: async (): Promise<FocusSession[]> => {
    return safeGet<FocusSession[]>(STORAGE_KEYS.FOCUS_SESSIONS, [
      {
        id: 'fs-1',
        taskTitle: 'Database Indexing Review',
        minutes: 25,
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'fs-2',
        taskTitle: 'React Canvas Assignment Draft',
        minutes: 30,
        completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ]);
  },
  saveFocusSessions: async (sessions: FocusSession[]): Promise<void> => {
    safeSet(STORAGE_KEYS.FOCUS_SESSIONS, sessions);
  },

  // Daily Reflections
  getReflections: async (): Promise<DailyReflection[]> => {
    return safeGet<DailyReflection[]>(STORAGE_KEYS.REFLECTIONS, []);
  },
  saveReflections: async (reflections: DailyReflection[]): Promise<void> => {
    safeSet(STORAGE_KEYS.REFLECTIONS, reflections);
  },

  // Reset Everything
  resetAll: async (): Promise<{
    tasks: Task[];
    streaks: Streak[];
    rooms: Room[];
    context: UserVibeContext;
    profile: UserVibeContext;
    focusSessions: FocusSession[];
    reflections: DailyReflection[];
  }> => {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.STREAKS);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.CONTEXT);
    localStorage.removeItem(STORAGE_KEYS.FOCUS_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);

    return {
      tasks: INITIAL_TASKS,
      streaks: INITIAL_STREAKS,
      rooms: INITIAL_ROOMS,
      context: INITIAL_VIBE_CONTEXT,
      profile: INITIAL_VIBE_CONTEXT,
      focusSessions: [],
      reflections: [],
    };
  },
};
