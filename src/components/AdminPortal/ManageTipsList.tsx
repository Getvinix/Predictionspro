import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import type { RolloverTip, TipStatus } from '../../types/index.ts';
import { updateTipStatus, deleteTip, formatOdds, type OddsFormat } from '../../utils/api.ts';

interface ManageTipsListProps {
  tips: RolloverTip[];
  currency: string;
  oddsFormat: OddsFormat;
  onRefresh: () => void;
  onOpenUploadModal: () => void;
  onEditTip: (tip: RolloverTip) => void;
}

export const ManageTipsList: React.FC<ManageTipsListProps> = ({
  tips,
  currency,
  oddsFormat,
  onRefresh,
  onOpenUploadModal,
  onEditTip,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: TipStatus) => {
    setUpdatingId(id);
    try {
      await updateTipStatus(id, newStatus);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, dayNumber: number) => {
    if (window.confirm(`Are you sure you want to permanently delete Day ${dayNumber} slip?`)) {
      setUpdatingId(id);
      try {
        await deleteTip(id);
        onRefresh();
      } catch (err) {
        console.error(err);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Manage Rollover Challenge Slips ({tips.length})
          </h3>
          <p className="text-xs text-slate-400">
            Settle match outcomes, track results, and update bankroll compounding
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>Upload Next Day Slip</span>
        </button>
      </div>

      <div className="space-y-3">
        {tips.map((tip) => {
          const isWon = tip.status === 'WON';
          const isLost = tip.status === 'LOST';
          const isPending = tip.status === 'PENDING';
          const isUpdating = updatingId === tip.id;

          return (
            <div
              key={tip.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3"
            >
              {/* Slip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 ${
                      isWon
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isLost
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    Day {tip.dayNumber}
                  </span>
                  <span className="text-xs text-slate-400">{tip.date}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Total Odds: <strong className="text-emerald-400">@{formatOdds(tip.totalOdds, oddsFormat)}</strong>
                  </span>
                </div>

                {/* Settle Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Set Status:</span>
                  <button
                    disabled={isUpdating || isWon}
                    onClick={() => handleStatusChange(tip.id, 'WON')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isWon
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'bg-slate-800 text-emerald-400 hover:bg-emerald-950/50 border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Won</span>
                  </button>

                  <button
                    disabled={isUpdating || isLost}
                    onClick={() => handleStatusChange(tip.id, 'LOST')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isLost
                        ? 'bg-rose-500 text-white font-black shadow'
                        : 'bg-slate-800 text-rose-400 hover:bg-rose-950/50 border border-slate-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Lost</span>
                  </button>

                  <button
                    disabled={isUpdating || isPending}
                    onClick={() => handleStatusChange(tip.id, 'PENDING')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isPending
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-800 text-amber-400 hover:bg-amber-950/50 border border-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => onEditTip(tip)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-xs font-semibold transition flex items-center gap-1"
                    title="Edit match games, odds, and booking codes"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Games</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleDelete(tip.id, tip.dayNumber)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition ml-1"
                    title="Delete Tip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Legs Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {tip.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {m.homeTeam} vs {m.awayTeam}
                      </div>
                      <div className="text-[11px] text-emerald-400 truncate">
                        {m.prediction} (@{m.odds})
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{m.kickoffTime}</span>
                  </div>
                ))}
              </div>

              {/* Booking Codes & Live Engagement Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-1 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Codes:</span>
                  {tip.bookingCodes?.map((b, i) => (
                    <span key={i} className="font-mono text-slate-300 font-semibold bg-slate-800 px-1.5 py-0.5 rounded">
                      {b.bookmaker}: {b.code}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span>👁️ {tip.viewsCount || 0} views</span>
                  <span>📋 {tip.copiesCount || 0} copied</span>
                  <span>🎯 {tip.followedCount || 0} followed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
