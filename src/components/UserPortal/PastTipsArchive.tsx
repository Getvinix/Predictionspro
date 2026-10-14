import React from 'react';
import { History, CheckCircle2, XCircle, Clock, Trophy, Flame } from 'lucide-react';
import type { RolloverTip } from '../../types/index.ts';
import { formatOdds, type OddsFormat } from '../../utils/api.ts';

interface PastTipsArchiveProps {
  tips: RolloverTip[];
  currency: string;
  oddsFormat: OddsFormat;
  onSelectTip: (tip: RolloverTip) => void;
}

export const PastTipsArchive: React.FC<PastTipsArchiveProps> = ({
  tips,
  currency,
  oddsFormat,
  onSelectTip,
}) => {
  const settledTips = tips.filter((t) => t.status === 'WON' || t.status === 'LOST');
  const wonCount = tips.filter((t) => t.status === 'WON').length;
  const winRate = settledTips.length > 0 ? Math.round((wonCount / settledTips.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header & Overall Performance Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/10">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Historical Rollover Slips & Archives
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                100% transparent track record of all settled stages and challenges
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Rate</div>
              <div className="text-lg font-black text-emerald-400">{winRate}%</div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Settled Slips</div>
              <div className="text-lg font-black text-slate-200">{wonCount}/{settledTips.length} Won</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slips Cards */}
      <div className="space-y-4">
        {tips.map((tip) => {
          const isWon = tip.status === 'WON';
          const isLost = tip.status === 'LOST';
          const isPending = tip.status === 'PENDING';

          return (
            <div
              key={tip.id}
              onClick={() => onSelectTip(tip)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer hover:border-slate-650 ${
                isWon
                  ? 'bg-slate-900/90 border-emerald-900/40 hover:bg-slate-850'
                  : isLost
                  ? 'bg-slate-900/90 border-rose-900/40 hover:bg-slate-850'
                  : 'bg-slate-900/90 border-amber-900/40 hover:bg-slate-850'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 ${
                      isWon
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isLost
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isWon ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isLost ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    Day {tip.dayNumber} of {tip.totalDays}
                  </div>
                  <span className="text-xs text-slate-400">{tip.date}</span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 mr-1.5">Odds:</span>
                    <strong className="text-emerald-400 font-mono">
                      @{formatOdds(tip.totalOdds, oddsFormat)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 mr-1.5">Stake:</span>
                    <strong className="text-slate-200">
                      {currency}{tip.currentStake.toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 mr-1.5">Payout:</span>
                    <strong className="text-emerald-400 font-bold">
                      {currency}{tip.targetPayout.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Matches summary */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {tip.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 truncate">
                        {m.homeTeam} vs {m.awayTeam}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        {m.prediction}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-slate-400 text-[11px]">
                        @{formatOdds(m.odds, oddsFormat)}
                      </span>
                      {m.score && (
                        <div className="text-[10px] font-bold text-slate-300">FT: {m.score}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
