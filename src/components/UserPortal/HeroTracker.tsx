import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Target,
  AlertTriangle,
} from 'lucide-react';
import type { ChallengeSummary, RolloverTip } from '../../types/index.ts';

interface HeroTrackerProps {
  challenge: ChallengeSummary | null;
  tips: RolloverTip[];
  currency: string;
  onSelectDay: (dayNumber: number) => void;
  selectedDayNumber: number;
}

export const HeroTracker: React.FC<HeroTrackerProps> = ({
  challenge,
  tips,
  currency,
  onSelectDay,
  selectedDayNumber,
}) => {
  if (!challenge) return null;

  const currentDay = challenge.currentDay;
  const totalDays = challenge.totalDays || 10;
  const progressPercent = Math.min(
    100,
    Math.round(((challenge.currentBankroll - challenge.startingStake) / (challenge.targetBankroll - challenge.startingStake)) * 100)
  );
  const growthMultiplier = (challenge.currentBankroll / challenge.startingStake).toFixed(1);

  // Map each day number to its tip if available
  const tipsByDay = new Map<number, RolloverTip>();
  tips.forEach((t) => tipsByDay.set(t.dayNumber, t));

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Active Rollover
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Updated Today
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {challenge.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Pure compound interest strategy: Stake winnings from previous day into safe low-risk odds (1.30–1.40). No greed, high discipline.
          </p>
        </div>

        {/* Bankroll Overview Widget */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/70 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Starting Stake</div>
            <div className="text-base sm:text-lg font-bold text-slate-300">
              {currency}{challenge.startingStake.toFixed(2)}
            </div>
          </div>
          <div className="border-x border-slate-800 px-2 sm:px-3">
            <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Current Bankroll
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-400">
              {currency}{challenge.currentBankroll.toFixed(2)}
            </div>
            <div className="text-[10px] text-emerald-500 font-semibold">
              +{growthMultiplier}x Return
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Goal Target
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-300">
              {currency}{challenge.targetBankroll.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400">Day {totalDays} End</div>
          </div>
        </div>
      </div>

      {/* Visual Roadmap / 10-Day Step Track */}
      <div className="relative z-10 pt-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-emerald-400" />
            Rollover Step Progression (Click a day to view slip)
          </span>
          <span className="text-slate-400">
            Streak: <strong className="text-amber-400">{challenge.currentStreak} Days Won</strong>
          </span>
        </div>

        {/* Scrollable Day Steps */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
            const tip = tipsByDay.get(dayNum);
            const isWon = tip?.status === 'WON';
            const isLost = tip?.status === 'LOST';
            const isPending = tip?.status === 'PENDING';
            const isCurrent = dayNum === currentDay;
            const isSelected = dayNum === selectedDayNumber;

            return (
              <button
                key={dayNum}
                onClick={() => onSelectDay(dayNum)}
                className={`flex-shrink-0 flex flex-col items-center p-2.5 sm:p-3 rounded-xl border transition group text-left min-w-[80px] sm:min-w-[95px] relative ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : isWon
                    ? 'bg-emerald-950/40 border-emerald-600/40 hover:bg-emerald-900/30'
                    : isPending
                    ? 'bg-amber-950/40 border-amber-500/50 hover:bg-amber-900/30 animate-pulse'
                    : isLost
                    ? 'bg-rose-950/30 border-rose-800/40 hover:bg-rose-900/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                {/* Status indicator top right */}
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-[11px] font-extrabold uppercase ${
                      isWon
                        ? 'text-emerald-400'
                        : isPending
                        ? 'text-amber-400'
                        : isLost
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    Day {dayNum}
                  </span>
                  {isWon ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                  ) : isPending ? (
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ) : isLost ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-600" />
                  )}
                </div>

                {/* Odds or Stake preview */}
                <div className="w-full">
                  <div className="text-[12px] font-bold text-white truncate">
                    {tip ? `@${tip.totalOdds.toFixed(2)}` : '~1.35'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {tip ? `${currency}${tip.currentStake.toFixed(1)}` : 'Upcoming'}
                  </div>
                </div>

                {/* Sub-label badge */}
                {isCurrent && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full shadow">
                    TODAY
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
            <span>Progress: {progressPercent}% of target bankroll</span>
            <span>
              Remaining to goal: {currency}
              {(challenge.targetBankroll - challenge.currentBankroll).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
