import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Send, CheckCircle, Bell } from 'lucide-react';
import type { Announcement } from '../../types/index.ts';
import { postAnnouncement, deleteAnnouncement } from '../../utils/api.ts';

interface AnnouncementsManagerProps {
  announcements: Announcement[];
  onRefresh: () => void;
}

export const AnnouncementsManager: React.FC<AnnouncementsManagerProps> = ({
  announcements,
  onRefresh,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'live' | 'alert' | 'success' | 'info'>('live');
  const [submitting, setSubmitting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await postAnnouncement(title.trim(), message.trim(), type);
      setTitle('');
      setMessage('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Broadcast Global Announcement</h3>
            <p className="text-xs text-slate-400">
              Pins an alert banner to the top of all user panels in real-time
            </p>
          </div>
        </div>

        <form onSubmit={handlePost} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="Announcement Title (e.g. 🚨 Odds Dropping on SportyBet!)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="live">🔴 Live (Red/Urgent)</option>
                <option value="success">🟢 Success (Green/Win)</option>
                <option value="alert">🟡 Caution (Yellow)</option>
                <option value="info">🔵 Info (Blue)</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows={2}
              placeholder="Announcement Details or Instructions for Bettors..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-750 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow transition"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Broadcast to Bettors'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Announcements */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Announcements ({announcements.length})
        </h4>

        {announcements.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-xl">
            No active announcements. Broadcast one above to alert users.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <Bell className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">{ann.title}</div>
                  <p className="text-slate-300 mt-0.5">{ann.message}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(ann.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Remove Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
