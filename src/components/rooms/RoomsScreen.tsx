import React, { useState } from 'react';
import { Users, Trophy, Plus, Search, ChevronRight, MessageSquare } from 'lucide-react';
import { Room } from '../../types';

interface RoomsScreenProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onToggleJoin: (roomId: string) => void;
  onOpenCreateRoom?: () => void;
}

export const RoomsScreen: React.FC<RoomsScreenProps> = ({
  rooms,
  onSelectRoom,
  onToggleJoin,
}) => {
  const [tab, setTab] = useState<'joined' | 'explore'>('joined');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Academic', 'Tech', 'Creative', 'Career', 'Vibe', 'Community'];

  const filteredRooms = rooms.filter((r) => {
    if (tab === 'joined' && !r.isJoined) return false;
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (search.trim()) {
      return (
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tagline.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  const activeChallenges = rooms
    .filter((r) => r.isJoined && r.activeChallenge)
    .map((r) => ({ roomName: r.name, challenge: r.activeChallenge! }));

  return (
    <div className="space-y-5 pb-24 px-4 pt-1">
      {/* Header */}
      <div>
        <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase">
          Micro-Communities
        </span>
        <h1 className="text-2xl font-black text-white font-display">
          Rooms
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Find your people. Safe, supportive spaces without follower metrics or vanity.
        </p>
      </div>

      {/* Live Challenges In Your Rooms ticker */}
      {activeChallenges.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-zinc-900 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Trophy size={14} className="fill-amber-400/20" />
              <span>Live Room Challenges</span>
            </div>
            <span className="text-[11px] text-purple-300">
              {activeChallenges.length} active
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {activeChallenges.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-60 p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06] text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-semibold text-purple-300 truncate">
                    {item.roomName}
                  </span>
                  <span>{item.challenge.daysLeft}d left</span>
                </div>
                <p className="font-bold text-white text-xs line-clamp-1">
                  {item.challenge.title}
                </p>
                <div className="text-[10px] text-zinc-400">
                  🔥 {item.challenge.participants} members locked in
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Segmented Tab */}
          <div className="flex items-center p-1 bg-zinc-900/80 rounded-xl border border-white/[0.06] text-xs">
            <button
              onClick={() => setTab('joined')}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-colors ${
                tab === 'joined'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              My Rooms ({rooms.filter((r) => r.isJoined).length})
            </button>
            <button
              onClick={() => setTab('explore')}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-colors ${
                tab === 'explore'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Explore All ({rooms.length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-[160px]">
            <Search size={13} className="absolute left-2.5 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full py-1.5 pl-7 pr-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Category Filter Pills (Functional interactive buttons) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white/15 text-white font-semibold border border-white/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms List */}
      <div className="space-y-2.5">
        {filteredRooms.length === 0 ? (
          <div className="py-12 text-center glass-card rounded-2xl border-white/[0.05] p-6 space-y-2">
            <Users size={28} className="mx-auto text-zinc-500" />
            <p className="text-sm font-semibold text-zinc-200">
              {tab === 'joined' ? "You haven't joined any rooms in this category yet" : 'No rooms found'}
            </p>
            <p className="text-xs text-zinc-500">
              {tab === 'joined' ? 'Switch to Explore All to discover awesome spaces!' : 'Try a different search term.'}
            </p>
            {tab === 'joined' && (
              <button
                onClick={() => setTab('explore')}
                className="mt-2 py-2 px-4 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Browse Explore
              </button>
            )}
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className="p-3.5 rounded-2xl glass-card-interactive border-white/[0.08] flex items-center justify-between gap-3 group"
            >
              <div
                onClick={() => onSelectRoom(room)}
                className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {room.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {room.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {room.tagline}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1">
                    <span>{room.memberCount.toLocaleString()} members</span>
                    <span aria-hidden="true">·</span>
                    <span>{room.category}</span>
                    {room.posts.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5">
                          <MessageSquare size={10} />
                          {room.posts.length} posts
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onToggleJoin(room.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    room.isJoined
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                  }`}
                >
                  {room.isJoined ? 'Joined' : 'Join'}
                </button>
                <button
                  onClick={() => onSelectRoom(room)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
