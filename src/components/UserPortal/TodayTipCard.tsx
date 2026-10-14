import React, { useState, useEffect } from 'react';
import {
  Flame,
  Copy,
  Check,
  Share2,
  DollarSign,
  Clock,
  ShieldCheck,
  Award,
  Users,
  Target,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  KeyRound,
} from 'lucide-react';
import { RolloverTip, UserMember } from '../../types/index.ts';
import { WHATSAPP_GROUP_URL, WhatsAppIcon } from '../WhatsAppContact.tsx';
import {
  formatOdds,
  type OddsFormat,
  trackBookingCodeCopy,
  trackTipFollow,
  addTipReaction,
  logUserActivity,
} from '../../utils/api.ts';

interface TodayTipCardProps {
  tip: RolloverTip;
  currency: string;
  oddsFormat: OddsFormat;
  onRefresh?: () => void;
  onOpenShareModal: (tip: RolloverTip) => void;
  currentMember: UserMember | null;
  onOpenAuthModal: () => void;
}

export const TodayTipCard: React.FC<TodayTipCardProps> = ({
  tip,
  currency,
  oddsFormat,
  onRefresh,
  onOpenShareModal,
  currentMember,
  onOpenAuthModal,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hasFollowed, setHasFollowed] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(tip.followedCount || 0);
  const [localReactions, setLocalReactions] = useState(
    tip.reactions || { fire: 0, target: 0, money: 0, cold: 0 }
  );
  const [customStake, setCustomStake] = useState<number>(tip.currentStake);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(true);

  useEffect(() => {
    setLocalReactions(tip.reactions || { fire: 0, target: 0, money: 0, cold: 0 });
    setFollowersCount(tip.followedCount || 0);
    setCustomStake(tip.currentStake);
  }, [tip]);

  const handleCopyCode = async (bookmaker: string, code: string) => {
    if (!currentMember) {
      onOpenAuthModal();
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      await trackBookingCodeCopy(tip.id, bookmaker, code);
      setTimeout(() => setCopiedCode(null), 2500);
      onRefresh?.();
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleFollowTip = async () => {
    if (!currentMember) {
      onOpenAuthModal();
      return;
    }
    if (hasFollowed) return;
    setHasFollowed(true);
    setFollowersCount((prev) => prev + 1);
    try {
      const newCount = await trackTipFollow(tip.id, customStake);
      setFollowersCount(newCount);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReaction = async (type: 'fire' | 'target' | 'money' | 'cold') => {
    if (!currentMember) {
      onOpenAuthModal();
      return;
    }
    setLocalReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));
    try {
      const res = await addTipReaction(tip.id, type);
      if (res.reactions) setLocalReactions(res.reactions);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    }
  };

  const potentialReturn = (customStake * tip.totalOdds).toFixed(2);
  const profitReturn = (customStake * tip.totalOdds - customStake).toFixed(2);

  const isWon = tip.status === 'WON';
  const isPending = tip.status === 'PENDING';
  const isLost = tip.status === 'LOST';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* Header Banner */}
      <div
        className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isWon
            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
            : isLost
            ? 'bg-rose-950/40 border-rose-800/40 text-rose-200'
            : 'bg-gradient-to-r from-slate-800/90 via-slate-850 to-slate-900 border-slate-750 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1 rounded-lg font-black text-sm uppercase tracking-wide flex items-center gap-1.5 ${
              isWon
                ? 'bg-emerald-500 text-slate-950'
                : isLost
                ? 'bg-rose-500 text-white'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            Day {tip.dayNumber} of {tip.totalDays}
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tip.date}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              isWon
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : isLost
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
            }`}
          >
            {isWon ? 'WON & CASHED OUT' : isLost ? 'SETTLED LOST' : 'ACTIVE / TODAY’S SLIP'}
          </span>
        </div>

        {/* Total Odds & Confidence */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Total Odds</div>
            <div className="text-xl font-black text-emerald-400">
              @{formatOdds(tip.totalOdds, oddsFormat)}
            </div>
          </div>
          <div className="text-right border-l border-slate-700/60 pl-3">
            <div className="text-[11px] text-slate-400">Safety Index</div>
            <div className="text-sm font-extrabold text-amber-300 flex items-center justify-end gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {tip.confidence}%
            </div>
          </div>
        </div>
      </div>

      {/* Admin Note / Strategy Box */}
      {tip.adminNote && (
        <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 font-semibold mr-1">Admin Strategy:</strong>
            {tip.adminNote}
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
          <span>MATCH SELECTIONS ({tip.matches.length} LEGS)</span>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 text-[11px]"
          >
            {showAnalysis ? 'Collapse Tactical Notes' : 'View Tactical Notes'}
            {showAnalysis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Client Sign In Gateway Reminder */}
        {!currentMember && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-amber-200">
                  Client Sign-In Required to Access Full Tips
                </div>
                <div className="text-slate-400 text-[11px]">
                  Sign in or create your free account to reveal exact picks, analysis, and instant booking codes • No VIP subscriptions
                </div>
              </div>
            </div>
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In to Access Tips</span>
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          {tip.matches.map((match, idx) => {
            const legWon = match.matchStatus === 'WON';
            const legLost = match.matchStatus === 'LOST';

            return (
              <div
                key={match.id || idx}
                className={`p-3.5 sm:p-4 rounded-xl border transition ${
                  legWon
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : legLost
                    ? 'bg-rose-950/20 border-rose-800/40'
                    : 'bg-slate-800/50 border-slate-750 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  {/* League & Kickoff */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-750 text-slate-300 border border-slate-700">
                      {match.sport} • {match.league}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {match.kickoffTime}
                    </span>
                  </div>

                  {/* Leg Odds Badge */}
                  <div className="flex items-center gap-2">
                    {match.score && (
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-200 text-xs font-bold border border-slate-800">
                        FT: {match.score}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      @{formatOdds(match.odds, oddsFormat)}
                    </span>
                    {legWon && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black">
                        WON
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Teams & Prediction */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-slate-100 text-sm sm:text-base">
                    {match.homeTeam} <span className="text-slate-500 font-normal">vs</span> {match.awayTeam}
                  </div>

                  {/* Prediction Pill: Protected if not signed in */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Selection:</span>
                    {currentMember ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs sm:text-sm">
                        {match.prediction}
                      </span>
                    ) : (
                      <button
                        onClick={onOpenAuthModal}
                        className="px-3 py-1 rounded-lg bg-slate-950/90 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-900 transition"
                      >
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Sign In to Unlock Pick</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tactical Analysis */}
                {showAnalysis && match.reasoning && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-emerald-400 font-medium">Why this pick:</span>
                    {currentMember ? (
                      <span>{match.reasoning}</span>
                    ) : (
                      <span className="text-slate-500 italic">
                        {match.reasoning.substring(0, 35)}... (Full tactical reasoning unlocked for signed-in members)
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Booking Codes Hub: Sign In Required Barrier */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-inner relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Copy className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Instant Bookmaker Booking Codes
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              One-click copy to load slip in your betting app
            </span>
          </div>

          {currentMember ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {tip.bookingCodes && tip.bookingCodes.length > 0 ? (
                  tip.bookingCodes.map((bc, idx) => {
                    const isCopied = copiedCode === bc.code;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCopyCode(bc.bookmaker, bc.code)}
                        className={`p-2.5 rounded-lg border text-left transition group relative flex flex-col justify-between ${
                          isCopied
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span
                            className={`text-[11px] font-bold truncate ${
                              isCopied ? 'text-slate-950' : 'text-slate-300'
                            }`}
                          >
                            {bc.bookmaker}
                          </span>
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-slate-950" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition" />
                          )}
                        </div>
                        <div
                          className={`font-mono text-xs sm:text-sm font-extrabold tracking-wider ${
                            isCopied ? 'text-slate-950' : 'text-emerald-400'
                          }`}
                        >
                          {bc.code}
                        </div>
                        {bc.region && (
                          <span
                            className={`text-[9px] mt-0.5 truncate ${
                              isCopied ? 'text-slate-900' : 'text-slate-500'
                            }`}
                          >
                            {bc.region}
                          </span>
                        )}
                        {isCopied && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-black bg-slate-950 text-emerald-400 shadow">
                            COPIED!
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full text-xs text-slate-400 py-2">
                    Booking codes loading... Please place matches manually or check back in a few minutes.
                  </div>
                )}
              </div>

              {/* Instant alerts banner */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>Codes sync automatically with bookmaker odd updates.</span>
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
                  title="Join official WhatsApp group"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Join WhatsApp Group for live drops</span>
                </a>
              </div>
            </>
          ) : (
            /* Locked Member Gate */
            <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Free Member Sign In Required
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  SportyBet, 1xBet, Bet9ja, Betway, and William Hill booking codes are 100% free. Sign in or create a free bettor account in 10 seconds to reveal.
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span>✨ 100% Free Forever • No VIP Subscriptions or Charges</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={onOpenAuthModal}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In / Create Free Account</span>
                </button>
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Join WhatsApp Group</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Stake & Projected Returns Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Your Stake for Day {tip.dayNumber}</span>
              <span className="text-emerald-400 font-semibold">
                Recommended: {currency}{tip.currentStake.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-bold">{currency}</span>
              <input
                type="number"
                step="1"
                min="1"
                value={customStake}
                onChange={(e) => setCustomStake(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto text-center sm:text-right">
            <div className="bg-slate-900 sm:bg-transparent p-2.5 rounded-lg border sm:border-0 border-slate-800">
              <div className="text-[11px] text-slate-400">Total Payout</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                {currency}{potentialReturn}
              </div>
            </div>
            <div className="bg-slate-900 sm:bg-transparent p-2.5 rounded-lg border sm:border-0 border-slate-800">
              <div className="text-[11px] text-slate-400">Net Profit</div>
              <div className="text-base sm:text-lg font-black text-amber-300">
                +{currency}{profitReturn}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement & Reaction Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Reaction Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleReaction('fire')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition active:scale-95"
            >
              <span>🔥</span>
              <span className="font-bold">{localReactions.fire || 0}</span>
            </button>
            <button
              onClick={() => handleReaction('target')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition active:scale-95"
            >
              <span>🎯</span>
              <span className="font-bold">{localReactions.target || 0}</span>
            </button>
            <button
              onClick={() => handleReaction('money')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition active:scale-95"
            >
              <span>💰</span>
              <span className="font-bold">{localReactions.money || 0}</span>
            </button>
            <button
              onClick={() => handleReaction('cold')}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-xs font-semibold text-slate-400 flex items-center gap-1 transition active:scale-95"
              title="Risky / Needs caution"
            >
              <span>❄️</span>
              <span className="text-[11px]">{localReactions.cold || 0}</span>
            </button>
          </div>

          {/* Follow & Share Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFollowTip}
              disabled={hasFollowed}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                hasFollowed
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95'
              }`}
            >
              {hasFollowed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Following ({followersCount})</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>I Bet This ({followersCount})</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenShareModal(tip)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
