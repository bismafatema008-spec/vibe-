/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TabType,
  Task,
  Room,
  Streak,
  UserProfile,
  FocusSession,
  MoodReflection,
} from './types';
import { StorageService } from './services/storageService';
import {
  INITIAL_TASKS,
  INITIAL_STREAKS,
  INITIAL_ROOMS,
  INITIAL_PROFILE,
} from './data/initialData';
import { MobileShell } from './components/layout/MobileShell';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { WhatRnModal } from './components/home/WhatRnModal';
import { BrainDumpModal } from './components/braindump/BrainDumpModal';
import { VibeScreen } from './components/vibe/VibeScreen';
import { MoodPickerModal } from './components/vibe/MoodPickerModal';
import { RoomsScreen } from './components/rooms/RoomsScreen';
import { RoomDetailModal } from './components/rooms/RoomDetailModal';
import { ProgressScreen } from './components/progress/ProgressScreen';
import { FocusTimerModal } from './components/progress/FocusTimerModal';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { MyVibeModal } from './components/setup/MyVibeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loaded, setLoaded] = useState(false);

  // Core Persistent State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [streaks, setStreaks] = useState<Streak[]>(INITIAL_STREAKS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  // Modals & Sheets
  const [isWhatRnOpen, setIsWhatRnOpen] = useState(false);
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [isMyVibeOpen, setIsMyVibeOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [focusTimerConfig, setFocusTimerConfig] = useState<{
    isOpen: boolean;
    title: string;
    minutes: number;
  }>({
    isOpen: false,
    title: '',
    minutes: 25,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Initial Load from Storage
  useEffect(() => {
    async function loadData() {
      const [storedTasks, storedStreaks, storedRooms, storedProfile, storedSessions] =
        await Promise.all([
          StorageService.getTasks(),
          StorageService.getStreaks(),
          StorageService.getRooms(),
          StorageService.getProfile(),
          StorageService.getFocusSessions(),
        ]);

      setTasks(storedTasks);
      setStreaks(storedStreaks);
      setRooms(storedRooms);
      setProfile(storedProfile);
      setFocusSessions(storedSessions);
      setLoaded(true);
    }
    loadData();
  }, []);

  // 2. Persist on change
  useEffect(() => {
    if (!loaded) return;
    StorageService.saveTasks(tasks);
  }, [tasks, loaded]);

  useEffect(() => {
    if (!loaded) return;
    StorageService.saveStreaks(streaks);
  }, [streaks, loaded]);

  useEffect(() => {
    if (!loaded) return;
    StorageService.saveRooms(rooms);
  }, [rooms, loaded]);

  useEffect(() => {
    if (!loaded) return;
    StorageService.saveProfile(profile);
  }, [profile, loaded]);

  useEffect(() => {
    if (!loaded) return;
    StorageService.saveFocusSessions(focusSessions);
  }, [focusSessions, loaded]);

  // Task Actions
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = !t.completed;
          showToast(newStatus ? '✨ Task marked done! Great momentum.' : 'Task reopened');
          return {
            ...t,
            completed: newStatus,
            completedAt: newStatus ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed');
  };

  const handleEditTask = (id: string, updated: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    showToast('Task updated');
  };

  const handleAddNewTask = (newTaskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...newTaskData,
      completed: false,
      createdAt: 'Today',
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('⚡️ New task locked in');
  };

  const handleAddTasksFromDump = (newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
    showToast(`🚀 ${newTasks.length} tasks added from Brain Dump!`);
  };

  const handleAddSingleTaskFromDump = (singleTask: Task) => {
    setTasks((prev) => [singleTask, ...prev]);
    showToast(`⚡️ Added "${singleTask.title.slice(0, 24)}..." to Today`);
  };

  // Streak Actions
  const handleCheckInStreak = (id: string) => {
    setStreaks((prev) =>
      prev.map((s) => {
        if (s.id === id && !s.lastCheckedToday) {
          showToast(`🔥 ${s.name} streak +1! Huge win.`);
          return { ...s, count: s.count + 1, lastCheckedToday: true };
        }
        return s;
      })
    );
  };

  const handleAddNewStreak = (name: string, icon: string, unit: string) => {
    const newStreak: Streak = {
      id: `streak-${Date.now()}`,
      name,
      icon: icon || '⚡️',
      count: 1,
      unit: unit || 'days',
      color: 'from-purple-500 to-indigo-500',
      lastCheckedToday: true,
    };
    setStreaks((prev) => [...prev, newStreak]);
    showToast(`🎯 Real life streak "${name}" started!`);
  };

  // Room Actions
  const handleToggleRoomJoin = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const next = !r.isJoined;
          showToast(next ? `🤝 Joined ${r.name}!` : `Left ${r.name}`);
          return {
            ...r,
            isJoined: next,
            memberCount: next ? r.memberCount + 1 : Math.max(r.memberCount - 1, 0),
          };
        }
        return r;
      })
    );
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom((prev) =>
        prev
          ? {
              ...prev,
              isJoined: !prev.isJoined,
              memberCount: !prev.isJoined
                ? prev.memberCount + 1
                : Math.max(prev.memberCount - 1, 0),
            }
          : null
      );
    }
  };

  const handleAddRoomPost = (roomId: string, content: string) => {
    const newPost = {
      id: `p-${Date.now()}`,
      author: {
        name: profile.name,
        handle: `@${profile.username}`,
        avatar: profile.avatar,
        tag: 'Member',
      },
      content,
      timestamp: 'Just now',
      reactions: { '🔥': 1 },
      userReaction: '🔥',
      comments: [],
    };

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return { ...r, posts: [newPost, ...r.posts] };
        }
        return r;
      })
    );

    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom((prev) =>
        prev ? { ...prev, posts: [newPost, ...prev.posts] } : null
      );
    }
    showToast('💬 Post dropped in room feed!');
  };

  const handleReactPost = (roomId: string, postId: string, emoji: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const updatedPosts = r.posts.map((p) => {
            if (p.id === postId) {
              const currentReactions = { ...p.reactions };
              const currentEmoji = p.userReaction;

              if (currentEmoji === emoji) {
                currentReactions[emoji] = Math.max((currentReactions[emoji] || 1) - 1, 0);
                return { ...p, reactions: currentReactions, userReaction: undefined };
              } else {
                if (currentEmoji && currentReactions[currentEmoji]) {
                  currentReactions[currentEmoji] = Math.max(currentReactions[currentEmoji] - 1, 0);
                }
                currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
                return { ...p, reactions: currentReactions, userReaction: emoji };
              }
            }
            return p;
          });
          return { ...r, posts: updatedPosts };
        }
        return r;
      })
    );

    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom((prev) => {
        if (!prev) return null;
        const updatedPosts = prev.posts.map((p) => {
          if (p.id === postId) {
            const currentReactions = { ...p.reactions };
            const currentEmoji = p.userReaction;
            if (currentEmoji === emoji) {
              currentReactions[emoji] = Math.max((currentReactions[emoji] || 1) - 1, 0);
              return { ...p, reactions: currentReactions, userReaction: undefined };
            } else {
              if (currentEmoji && currentReactions[currentEmoji]) {
                currentReactions[currentEmoji] = Math.max(currentReactions[currentEmoji] - 1, 0);
              }
              currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
              return { ...p, reactions: currentReactions, userReaction: emoji };
            }
          }
          return p;
        });
        return { ...prev, posts: updatedPosts };
      });
    }
  };

  const handleAddRoomComment = (roomId: string, postId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: profile.name,
      avatar: profile.avatar,
      content: commentText,
      timestamp: 'Just now',
    };

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const updatedPosts = r.posts.map((p) => {
            if (p.id === postId) {
              return { ...p, comments: [...p.comments, newComment] };
            }
            return p;
          });
          return { ...r, posts: updatedPosts };
        }
        return r;
      })
    );

    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom((prev) => {
        if (!prev) return null;
        const updatedPosts = prev.posts.map((p) => {
          if (p.id === postId) {
            return { ...p, comments: [...p.comments, newComment] };
          }
          return p;
        });
        return { ...prev, posts: updatedPosts };
      });
    }
    showToast('💬 Comment added!');
  };

  const handleToggleChallengeJoin = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId && r.activeChallenge) {
          const current = !!r.activeChallenge.joined;
          const next = !current;
          showToast(next ? '🏆 You joined the challenge!' : 'Left challenge');
          return {
            ...r,
            activeChallenge: {
              ...r.activeChallenge,
              joined: next,
              participants: next
                ? r.activeChallenge.participants + 1
                : Math.max(r.activeChallenge.participants - 1, 0),
            },
          };
        }
        return r;
      })
    );

    if (selectedRoom && selectedRoom.id === roomId && selectedRoom.activeChallenge) {
      setSelectedRoom((prev) => {
        if (!prev || !prev.activeChallenge) return prev;
        const current = !!prev.activeChallenge.joined;
        return {
          ...prev,
          activeChallenge: {
            ...prev.activeChallenge,
            joined: !current,
            participants: !current
              ? prev.activeChallenge.participants + 1
              : Math.max(prev.activeChallenge.participants - 1, 0),
          },
        };
      });
    }
  };

  // Focus Timer Launcher & Session Logger
  const handleStartFocus = (taskTitle: string, minutes: number) => {
    setFocusTimerConfig({
      isOpen: true,
      title: taskTitle || 'Deep Focus Sprint',
      minutes: minutes || 25,
    });
  };

  const handleSessionComplete = (minutes: number) => {
    const newSession: FocusSession = {
      id: `fs-${Date.now()}`,
      taskTitle: focusTimerConfig.title || 'Focus Sprint',
      minutes,
      completedAt: new Date().toISOString(),
    };

    setFocusSessions((prev) => [newSession, ...prev]);

    setProfile((prev) => ({
      ...prev,
      todayFocusMinutes: prev.todayFocusMinutes + minutes,
      weeklyFocusMinutes: prev.weeklyFocusMinutes + minutes,
    }));

    showToast(`⏱ +${minutes}m focus sprint logged!`);
  };

  // Goals CRUD
  const handleToggleGoal = (goalId: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, completed: !g.completed } : g
      ),
    }));
  };

  const handleAddGoal = (title: string) => {
    const newGoal = {
      id: `g-${Date.now()}`,
      title,
      completed: false,
    };
    setProfile((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
    showToast('🎯 Goal added!');
  };

  const handleDeleteGoal = (goalId: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
    showToast('Goal removed');
  };

  // Full Demo Reset
  const handleResetDemoData = async () => {
    const reset = await StorageService.resetAll();
    setTasks(reset.tasks);
    setStreaks(reset.streaks);
    setRooms(reset.rooms);
    setProfile(reset.profile);
    setFocusSessions([]);
    showToast('Demo data reset');
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const maxStreak = Math.max(...streaks.map((s) => s.count), 0);

  return (
    <MobileShell>
      {/* Toast Announcement */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 py-2 px-4 rounded-full bg-zinc-900/90 border border-purple-500/40 text-xs font-semibold text-white shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <TopHeader
        profile={profile}
        onOpenMoodPicker={() => setIsMoodPickerOpen(true)}
        onOpenBrainDump={() => setIsBrainDumpOpen(true)}
        onProfileClick={() => setActiveTab('profile')}
        streakCount={maxStreak}
      />

      {/* Main Tab Screen Content */}
      <main className="relative min-h-[calc(100vh-140px)]">
        {activeTab === 'home' && (
          <HomeScreen
            userContext={profile}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onOpenWhatRn={() => setIsWhatRnOpen(true)}
            onOpenBrainDump={() => setIsBrainDumpOpen(true)}
            onOpenMoodPicker={() => setIsMoodPickerOpen(true)}
            onOpenTuneVibe={() => setIsMyVibeOpen(true)}
            onStartFocus={handleStartFocus}
            onAddNewTask={handleAddNewTask}
          />
        )}

        {activeTab === 'vibe' && (
          <VibeScreen
            profile={profile}
            tasks={tasks}
            onUpdateMood={(m) => setProfile((p) => ({ ...p, currentMood: m }))}
            onUpdateEnergy={(e) => setProfile((p) => ({ ...p, energyLevel: e }))}
            onStartFocus={handleStartFocus}
            onOpenBrainDump={() => setIsBrainDumpOpen(true)}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomsScreen
            rooms={rooms}
            onSelectRoom={(r) => setSelectedRoom(r)}
            onToggleJoin={handleToggleRoomJoin}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            profile={profile}
            tasks={tasks}
            streaks={streaks}
            focusSessions={focusSessions}
            onCheckInStreak={handleCheckInStreak}
            onAddNewStreak={handleAddNewStreak}
            onOpenFocusTimer={handleStartFocus}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            rooms={rooms}
            onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Persistent Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTaskCount={pendingCount}
      />

      {/* Modals & Overlays */}
      <WhatRnModal
        isOpen={isWhatRnOpen}
        onClose={() => setIsWhatRnOpen(false)}
        tasks={tasks}
        userContext={profile}
        onStartFocus={handleStartFocus}
        onCompleteTask={handleToggleTask}
      />

      <BrainDumpModal
        isOpen={isBrainDumpOpen}
        onClose={() => setIsBrainDumpOpen(false)}
        onAddTasks={handleAddTasksFromDump}
        onAddSingleTask={handleAddSingleTaskFromDump}
        userContext={profile}
      />

      <MyVibeModal
        isOpen={isMyVibeOpen}
        onClose={() => setIsMyVibeOpen(false)}
        context={profile}
        onSaveContext={(updated) => {
          setProfile(updated);
          showToast('⚡️ My VIBE context updated!');
        }}
      />

      <MoodPickerModal
        isOpen={isMoodPickerOpen}
        onClose={() => setIsMoodPickerOpen(false)}
        currentMood={profile.currentMood}
        onSelectMood={(m) => setProfile((p) => ({ ...p, currentMood: m }))}
      />

      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onToggleJoin={handleToggleRoomJoin}
        onAddPost={handleAddRoomPost}
        onReactPost={handleReactPost}
        onAddComment={handleAddRoomComment}
        onToggleChallengeJoin={handleToggleChallengeJoin}
      />

      <FocusTimerModal
        isOpen={focusTimerConfig.isOpen}
        onClose={() =>
          setFocusTimerConfig((prev) => ({ ...prev, isOpen: false }))
        }
        taskTitle={focusTimerConfig.title}
        initialMinutes={focusTimerConfig.minutes}
        onSessionComplete={handleSessionComplete}
      />
    </MobileShell>
  );
}
