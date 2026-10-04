import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Shield,
  Bell,
  Check,
  Edit3,
  Settings,
  Plus,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Image as ImageIcon,
} from 'lucide-react';
import { UserProfile, Room } from '../../types';

interface ProfileScreenProps {
  profile: UserProfile;
  rooms: Room[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetDemoData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  rooms,
  onUpdateProfile,
  onResetDemoData,
}) => {
  // Editing Mode
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [usernameInput, setUsernameInput] = useState(profile.username);
  const [bioInput, setBioInput] = useState(profile.bio);
  const [avatarInput, setAvatarInput] = useState(profile.avatar);

  // Interest Tag Adder
  const [newInterest, setNewInterest] = useState('');

  // Preset aesthetic avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  ];

  const personalities: ('Witty Gen-Z' | 'Chill Mentor' | 'Hype Bestie' | 'Raw & Direct')[] = [
    'Witty Gen-Z',
    'Chill Mentor',
    'Hype Bestie',
    'Raw & Direct',
  ];

  const handleSaveInfo = () => {
    onUpdateProfile({
      name: nameInput.trim() || profile.name,
      username: usernameInput.trim().replace(/^@/, '') || profile.username,
      bio: bioInput.trim() || profile.bio,
      avatar: avatarInput || profile.avatar,
    });
    setIsEditingInfo(false);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (!profile.interests.includes(newInterest.trim())) {
      onUpdateProfile({
        interests: [...profile.interests, newInterest.trim()],
      });
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (tag: string) => {
    onUpdateProfile({
      interests: profile.interests.filter((i) => i !== tag),
    });
  };

  const toggleSetting = (key: keyof UserProfile['settings']) => {
    onUpdateProfile({
      settings: {
        ...profile.settings,
        [key]: !profile.settings[key],
      },
    });
  };

  const joinedRooms = rooms.filter((r) => r.isJoined);

  return (
    <div className="space-y-5 pb-24 px-4 pt-1">
      {/* 1. Header Profile Hero Card */}
      <div className="relative p-5 rounded-3xl glass-card border-white/[0.08] overflow-hidden space-y-4 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-[#0f0f15]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black text-white font-display">
                {profile.name}
              </h2>
              <p className="text-xs text-purple-300 font-medium">
                @{profile.username}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                <span>{profile.currentMood}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{profile.todayFocusMinutes}m focused</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Edit3 size={13} />
            <span>{isEditingInfo ? 'Close' : 'Edit'}</span>
          </button>
        </div>

        {/* Edit Profile Form Overlay / Expandable */}
        {isEditingInfo ? (
          <div className="pt-3 border-t border-white/[0.06] space-y-3 relative z-10 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase font-semibold">Avatar Preset</label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {avatarPresets.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setAvatarInput(url)}
                    className={`relative rounded-xl overflow-hidden flex-shrink-0 ring-2 transition-all ${
                      avatarInput === url ? 'ring-purple-500 scale-105' : 'ring-transparent opacity-60'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-10 h-10 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Display Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-0.5">Bio</label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={2}
                className="w-full p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditingInfo(false)}
                className="py-1.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 pt-1 border-t border-white/[0.04]">
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "{profile.bio}"
            </p>
          </div>
        )}
      </div>

      {/* 2. AI Companion Personality Tuner */}
      <div className="p-4 rounded-2xl glass-card border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-display">
              AI Companion Persona
            </h3>
            <p className="text-[10px] text-zinc-400">
              Customize how VIBE speaks to you in recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {personalities.map((tone) => {
            const isSelected = profile.personalityTone === tone;
            return (
              <button
                key={tone}
                onClick={() => onUpdateProfile({ personalityTone: tone })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-purple-950/50 border-purple-500/50 text-white font-bold'
                    : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{tone}</span>
                  {isSelected && <Check size={12} className="text-purple-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Joined Rooms Overview */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
            <User size={14} className="text-purple-400" />
            <span>My Active Rooms ({joinedRooms.length})</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {joinedRooms.map((room) => (
            <div
              key={room.id}
              className="flex-shrink-0 w-36 p-3 rounded-2xl glass-card border-white/[0.08] text-center space-y-1"
            >
              <span className="text-2xl">{room.icon}</span>
              <p className="text-xs font-bold text-white truncate">
                {room.name}
              </p>
              <p className="text-[10px] text-zinc-400">
                {room.memberCount} members
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interests & Aesthetic Tags (Editable) */}
      <div className="p-4 rounded-2xl glass-card border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-300">
            Interests & Aesthetic Tags
          </h3>
          <span className="text-[10px] text-zinc-500">Tap ✕ to remove</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-white/[0.06] text-xs text-zinc-300"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveInterest(tag)}
                className="text-zinc-500 hover:text-rose-400"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddInterest} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add new interest (e.g. Synthwave, Coffee)"
            className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm"
          >
            Add
          </button>
        </form>
      </div>

      {/* 5. Settings & Privacy Sections */}
      <div className="p-4 rounded-2xl glass-card border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-zinc-400" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Settings & Privacy
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {/* Smart Nudges */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 text-zinc-300">
              <Bell size={13} />
              <span>Smart Vibe Nudges</span>
            </div>
            <button
              onClick={() => toggleSetting('smartNudges')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                profile.settings.smartNudges ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.settings.smartNudges ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Incognito Dump Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 text-zinc-300">
              <Shield size={13} />
              <span>Incognito Brain Dump (Zero Server Storage)</span>
            </div>
            <button
              onClick={() => toggleSetting('incognitoDump')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                profile.settings.incognitoDump ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.settings.incognitoDump ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Ambient Soundscape Autoplay */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 text-zinc-300">
              <Volume2 size={13} />
              <span>Ambient Audio Effects</span>
            </div>
            <button
              onClick={() => toggleSetting('ambientSoundEnabled')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                profile.settings.ambientSoundEnabled ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.settings.ambientSoundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">VIBE Mobile App · v1.2</span>
          <button
            onClick={onResetDemoData}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
