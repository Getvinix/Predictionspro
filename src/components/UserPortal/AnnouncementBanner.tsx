import React, { useState } from 'react';
import { Bell, Flame, CheckCircle, AlertTriangle, X } from 'lucide-react';
import type { Announcement } from '../../types/index.ts';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcements }) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const activeList = announcements.filter((a) => !dismissed.has(a.id));
  if (activeList.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {activeList.map((ann) => {
        const isLive = ann.type === 'live';
        const isSuccess = ann.type === 'success';
        const isAlert = ann.type === 'alert';

        return (
          <div
            key={ann.id}
            className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 text-xs shadow-md transition ${
              isLive
                ? 'bg-rose-950/40 border-rose-600/40 text-rose-200'
                : isSuccess
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
                : isAlert
                ? 'bg-amber-950/40 border-amber-600/40 text-amber-200'
                : 'bg-indigo-950/40 border-indigo-600/40 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex-shrink-0">
                {isLive ? (
                  <Flame className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
                ) : isSuccess ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Bell className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-extrabold mr-2 text-white">{ann.title}</span>
                <span className="opacity-90">{ann.message}</span>
              </div>
            </div>

            <button
              onClick={() => setDismissed((prev) => new Set([...prev, ann.id]))}
              className="text-slate-400 hover:text-white p-1 flex-shrink-0"
              title="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
