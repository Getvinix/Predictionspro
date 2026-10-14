import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import type { TipComment } from '../../types/index.ts';
import { fetchTipComments, postTipComment, formatRelativeTime, getUserIdentifier } from '../../utils/api.ts';

interface DiscussionSectionProps {
  tipId: string;
  dayNumber: number;
}

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({ tipId, dayNumber }) => {
  const [comments, setComments] = useState<TipComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadComments();
    const storedName = localStorage.getItem('rollover_punter_nickname') || getUserIdentifier().split(' ')[0];
    setAuthorName(storedName);
  }, [tipId]);

  const loadComments = async () => {
    try {
      const data = await fetchTipComments(tipId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const savedNickname = authorName.trim() || 'Punter';
      localStorage.setItem('rollover_punter_nickname', savedNickname);
      const newComment = await postTipComment(tipId, commentText.trim(), savedNickname, 'Member');
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = (comId: string) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(comId)) {
        next.delete(comId);
      } else {
        next.add(comId);
      }
      return next;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Community Discussion & Banter</h2>
            <p className="text-xs text-slate-400">
              Live feedback & member comments for Day {dayNumber}
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
          {comments.length} Comments
        </span>
      </div>

      {/* Comment Input */}
      <form onSubmit={handlePost} className="mt-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Your handle (e.g. Alex_Bet)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-48 bg-slate-900 border border-slate-750 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Share booking issues, match updates or confidence
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Join the discussion on today's rollover slip..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-750 text-sm text-white placeholder-slate-500 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No comments yet on Day {dayNumber}. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => {
            const isLiked = likedComments.has(comment.id);
            const totalLikes = (comment.likes || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={comment.id}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">{comment.authorName}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                        comment.authorBadge === 'Verified Bettor'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : comment.authorBadge === 'Veteran'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : comment.authorBadge === 'Admin'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {comment.authorBadge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {formatRelativeTime(comment.timestamp)}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs mt-0.5">{comment.text}</p>

                <div className="mt-2 flex items-center justify-end">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 text-[11px] transition ${
                      isLiked ? 'text-rose-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{totalLikes > 0 ? totalLikes : ''}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
