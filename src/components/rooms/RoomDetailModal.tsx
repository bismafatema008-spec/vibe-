import React, { useState } from 'react';
import { X, Users, Trophy, MessageSquare, Send, Plus, Check } from 'lucide-react';
import { Room, RoomPost } from '../../types';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onToggleJoin: (roomId: string) => void;
  onAddPost: (roomId: string, content: string) => void;
  onReactPost: (roomId: string, postId: string, emoji: string) => void;
  onAddComment: (roomId: string, postId: string, commentText: string) => void;
  onToggleChallengeJoin: (roomId: string) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onToggleJoin,
  onAddPost,
  onReactPost,
  onAddComment,
  onToggleChallengeJoin,
}) => {
  const [newPostText, setNewPostText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  if (!room) return null;

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onAddPost(room.id, newPostText.trim());
    setNewPostText('');
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(room.id, postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#0f0f15] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] bg-zinc-900/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
              {room.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  {room.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Users size={12} className="text-zinc-500" />
                  <span>{room.memberCount.toLocaleString()} members</span>
                </span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{room.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleJoin(room.id)}
              className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all ${
                room.isJoined
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
              }`}
            >
              {room.isJoined ? 'Joined' : '+ Join Room'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Room Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Room Tagline */}
          <p className="text-xs text-zinc-400 italic">
            "{room.tagline}"
          </p>

          {/* Active Community Challenge Card */}
          {room.activeChallenge && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-zinc-900 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Trophy size={14} className="text-amber-400" />
                  <span>Active Room Challenge</span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {room.activeChallenge.daysLeft}d left
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {room.activeChallenge.title}
                </p>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {room.activeChallenge.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-400">
                  🔥 {room.activeChallenge.participants} participating
                </span>
                <button
                  onClick={() => onToggleChallengeJoin(room.id)}
                  className={`py-1 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    room.activeChallenge.joined
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {room.activeChallenge.joined ? (
                    <>
                      <Check size={12} />
                      <span>Joined!</span>
                    </>
                  ) : (
                    <span>Participate</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* New Post Creator */}
          <form onSubmit={handlePostSubmit} className="p-3 rounded-2xl glass-card border-white/[0.08] space-y-2">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`Share a thought or ask the ${room.name} crew...`}
              rows={2}
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <span className="text-[10px] text-zinc-500">
                Authentic vibes only · No toxic metrics
              </span>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="py-1 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Send size={11} />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Post Feed */}
          <div className="space-y-3">
            {room.posts.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 glass-card rounded-2xl p-4">
                No posts yet in this room. Be the first to break the ice!
              </div>
            ) : (
              room.posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-2xl glass-card border-white/[0.07] space-y-2.5"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">
                            {post.author.name}
                          </span>
                          {post.author.tag && (
                            <span className="text-[10px] text-purple-400">
                              · {post.author.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {post.author.handle} · {post.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Emoji Reactions & Comments Toggle */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['🔥', '🫶', '💀', '💯'].map((emoji) => {
                        const count = post.reactions[emoji] || 0;
                        const isUser = post.userReaction === emoji;
                        return (
                          <button
                            key={emoji}
                            onClick={() => onReactPost(room.id, post.id, emoji)}
                            className={`px-2 py-0.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                              isUser
                                ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                                : 'bg-zinc-900/60 border-white/[0.05] text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <span>{emoji}</span>
                            {count > 0 && <span className="text-[10px]">{count}</span>}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post.id ? null : post.id
                        )
                      }
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <MessageSquare size={12} />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>

                  {/* Comments section if opened */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-2 pt-2 border-t border-white/[0.04] space-y-2">
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-2 rounded-xl bg-zinc-900/50 text-[11px] space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-zinc-400">
                              <span className="font-semibold text-zinc-300">
                                {comment.author}
                              </span>
                              <span>{comment.timestamp}</span>
                            </div>
                            <p className="text-zinc-300">{comment.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add comment input */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit(post.id);
                          }}
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="p-1.5 rounded-xl bg-purple-600 text-white"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
