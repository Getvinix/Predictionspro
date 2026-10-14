import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle,
  Flame,
  ShieldCheck,
  Calendar,
  DollarSign,
  Info,
  Clock,
  Sparkles,
  Edit3,
  Dices,
} from 'lucide-react';
import type { RolloverTip, MatchSelection, BookingCode, RiskLevel, MatchStatus } from '../../types/index.ts';
import { createTip, updateTip } from '../../utils/api.ts';

interface UploadTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currency: string;
  suggestedDay: number;
  currentBankroll: number;
  initialTip?: RolloverTip | null;
}

export const UploadTipModal: React.FC<UploadTipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currency,
  suggestedDay,
  currentBankroll,
  initialTip,
}) => {
  const isEditing = Boolean(initialTip);

  const [dayNumber, setDayNumber] = useState<number>(initialTip?.dayNumber || suggestedDay);
  const [totalDays, setTotalDays] = useState<number>(initialTip?.totalDays || 10);
  const [date, setDate] = useState<string>(
    initialTip?.date || new Date().toISOString().split('T')[0]
  );
  const [currentStake, setCurrentStake] = useState<number>(
    initialTip?.currentStake || currentBankroll || 20
  );
  const [confidence, setConfidence] = useState<number>(initialTip?.confidence || 95);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(initialTip?.riskLevel || 'Safe');
  const [adminNote, setAdminNote] = useState<string>(
    initialTip?.adminNote ||
      'Strict compounding rules: Staking total previous winnings into safe low-margin picks. Lock in early before odds drop!'
  );

  const [matches, setMatches] = useState<MatchSelection[]>(
    initialTip?.matches || [
      {
        id: 'm-' + Date.now() + '-1',
        sport: 'Football / Soccer',
        league: 'UEFA Champions League',
        homeTeam: 'Real Madrid',
        awayTeam: 'Lille',
        kickoffTime: '20:00 GMT',
        prediction: 'Real Madrid Win or Draw (1X)',
        marketType: 'Double Chance 1X',
        odds: 1.18,
        reasoning: 'Madrid unbeaten in 18 home European games with key attackers available.',
        matchStatus: 'PENDING',
        score: '',
      },
      {
        id: 'm-' + Date.now() + '-2',
        sport: 'Football / Soccer',
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Bournemouth',
        kickoffTime: '17:30 GMT',
        prediction: 'Over 1.5 Total Match Goals',
        marketType: 'Over 1.5 Goals',
        odds: 1.15,
        reasoning: 'Both teams feature heavy transition football; last 5 meetings saw at least 2 goals.',
        matchStatus: 'PENDING',
        score: '',
      },
    ]
  );

  const [bookingCodes, setBookingCodes] = useState<BookingCode[]>(
    initialTip?.bookingCodes || [
      { bookmaker: 'SportyBet', code: '8XZ991', region: 'Global' },
      { bookmaker: '1xBet', code: 'ROLL-10D', region: 'Global' },
      { bookmaker: 'Bet9ja', code: 'B9J-4412', region: 'Nigeria' },
      { bookmaker: 'Betway', code: 'BW-5520', region: 'Kenya/UK' },
    ]
  );

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialTip) {
      setDayNumber(initialTip.dayNumber);
      setTotalDays(initialTip.totalDays);
      setDate(initialTip.date);
      setCurrentStake(initialTip.currentStake);
      setConfidence(initialTip.confidence);
      setRiskLevel(initialTip.riskLevel);
      setAdminNote(initialTip.adminNote || '');
      setMatches(initialTip.matches || []);
      setBookingCodes(initialTip.bookingCodes || []);
    } else {
      setDayNumber(suggestedDay);
      setCurrentStake(currentBankroll || 20);
    }
  }, [initialTip, suggestedDay, currentBankroll]);

  if (!isOpen) return null;

  // Auto calculate combined total odds
  const computedTotalOdds = Number(
    matches.reduce((acc, m) => acc * (Number(m.odds) || 1), 1).toFixed(2)
  );
  const projectedPayout = Number((currentStake * computedTotalOdds).toFixed(2));

  // Match Leg Helpers
  const handleAddMatch = () => {
    setMatches((prev) => [
      ...prev,
      {
        id: 'm-' + Date.now() + '-' + (prev.length + 1),
        sport: 'Football / Soccer',
        league: 'Premier League',
        homeTeam: '',
        awayTeam: '',
        kickoffTime: '19:45 GMT',
        prediction: '',
        marketType: 'Over 1.5 Goals',
        odds: 1.2,
        reasoning: '',
        matchStatus: 'PENDING',
        score: '',
      },
    ]);
  };

  const handleUpdateMatch = (index: number, field: keyof MatchSelection, value: any) => {
    setMatches((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveMatch = (index: number) => {
    if (matches.length <= 1) return;
    setMatches((prev) => prev.filter((_, i) => i !== index));
  };

  // Preset Template Loader
  const handleLoadPreset = (type: 'ucl' | 'epl' | 'safe') => {
    if (type === 'ucl') {
      setMatches([
        {
          id: 'm-' + Date.now() + '-1',
          sport: 'Football / Soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Bayern Munich',
          awayTeam: 'Sporting CP',
          kickoffTime: '20:00 GMT',
          prediction: 'Bayern Munich to Win & Over 1.5 Goals',
          marketType: '1 & Over 1.5',
          odds: 1.24,
          reasoning: 'Bayern averaging 3.2 goals at Allianz Arena in European competition.',
          matchStatus: 'PENDING',
        },
        {
          id: 'm-' + Date.now() + '-2',
          sport: 'Football / Soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Inter Milan',
          awayTeam: 'Benfica',
          kickoffTime: '20:00 GMT',
          prediction: 'Inter Milan Win or Draw (1X)',
          marketType: 'Double Chance 1X',
          odds: 1.14,
          reasoning: 'Inter solid home record with clean sheets in 4 of last 5 matches.',
          matchStatus: 'PENDING',
        },
      ]);
    } else if (type === 'epl') {
      setMatches([
        {
          id: 'm-' + Date.now() + '-1',
          sport: 'Football / Soccer',
          league: 'Premier League',
          homeTeam: 'Manchester City',
          awayTeam: 'Brighton',
          kickoffTime: '15:00 GMT',
          prediction: 'Over 2.5 Total Match Goals',
          marketType: 'Over 2.5 Goals',
          odds: 1.28,
          reasoning: 'Both teams rank top 3 in attacking transitions; last 6 H2H averaged 3.8 goals.',
          matchStatus: 'PENDING',
        },
        {
          id: 'm-' + Date.now() + '-2',
          sport: 'Football / Soccer',
          league: 'Premier League',
          homeTeam: 'Liverpool',
          awayTeam: 'Everton',
          kickoffTime: '12:30 GMT',
          prediction: 'Liverpool Win or Draw (1X)',
          marketType: 'Double Chance 1X',
          odds: 1.11,
          reasoning: 'Merseyside Derby at Anfield: Liverpool undefeated in derby at home since 2021.',
          matchStatus: 'PENDING',
        },
      ]);
    } else {
      setMatches([
        {
          id: 'm-' + Date.now() + '-1',
          sport: 'Football / Soccer',
          league: 'La Liga',
          homeTeam: 'Barcelona',
          awayTeam: 'Alaves',
          kickoffTime: '19:00 GMT',
          prediction: 'Barcelona Win or Draw (1X)',
          marketType: 'Double Chance 1X',
          odds: 1.12,
          reasoning: 'High possession dominance and 85% home win percentage.',
          matchStatus: 'PENDING',
        },
        {
          id: 'm-' + Date.now() + '-2',
          sport: 'Football / Soccer',
          league: 'Bundesliga',
          homeTeam: 'Bayer Leverkusen',
          awayTeam: 'Freiburg',
          kickoffTime: '15:30 GMT',
          prediction: 'Over 1.5 Total Match Goals',
          marketType: 'Over 1.5 Goals',
          odds: 1.16,
          reasoning: 'Leverkusen games have seen over 1.5 goals in 19 consecutive home ties.',
          matchStatus: 'PENDING',
        },
      ]);
    }
  };

  // Booking Code Helpers
  const handleAddBookingCode = () => {
    setBookingCodes((prev) => [...prev, { bookmaker: 'SportyBet', code: '', region: 'Global' }]);
  };

  const handleUpdateBookingCode = (index: number, field: keyof BookingCode, value: string) => {
    setBookingCodes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveBookingCode = (index: number) => {
    setBookingCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (matches.length === 0) {
      alert('Please include at least one match leg.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<RolloverTip> = {
        dayNumber,
        totalDays,
        date,
        currentStake,
        totalOdds: computedTotalOdds,
        targetPayout: projectedPayout,
        confidence,
        riskLevel,
        adminNote,
        matches,
        bookingCodes: bookingCodes.filter((b) => b.code.trim().length > 0),
      };

      if (isEditing && initialTip) {
        await updateTip(initialTip.id, payload);
      } else {
        await createTip({
          ...payload,
          status: 'PENDING',
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save tip:', err);
      alert('Failed to save tip. Please check server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl relative text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {isEditing ? <Edit3 className="w-6 h-6" /> : <Flame className="w-6 h-6 fill-current" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              {isEditing ? `Edit Rollover Slip & Games (Day ${dayNumber})` : 'Upload Daily Rollover Slip'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEditing
                ? 'Modify games, kickoffs, predictions, odds, scores, and booking codes'
                : 'Publish new challenge stage with match analysis and multi-bookmaker booking codes'}
            </p>
          </div>
        </div>

        {/* Quick Presets for New Uploads */}
        {!isEditing && (
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 mb-5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Dices className="w-4 h-4 text-emerald-400" />
              <span>Quick Game Presets:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleLoadPreset('safe')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] text-emerald-400 font-semibold border border-slate-700 transition"
              >
                European Double Chance (~1.30)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('ucl')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] text-indigo-300 font-semibold border border-slate-700 transition"
              >
                Champions League Night (~1.41)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('epl')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] text-amber-300 font-semibold border border-slate-700 transition"
              >
                Premier League Goals (~1.42)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Challenge Parameters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Challenge Day #
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Total Goal Days
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Kickoff Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Stake Amount ({currency})
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={currentStake}
                onChange={(e) => setCurrentStake(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Computed Odds Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs text-slate-400">Total Computed Slip Odds:</span>
                <span className="text-lg font-black text-emerald-400 ml-2">
                  @{computedTotalOdds.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Projected Return:</span>
              <span className="text-base font-black text-amber-300 ml-2">
                {currency}{projectedPayout.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Match Legs / Games Editor Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Games & Match Selections ({matches.length} Legs)</span>
              </label>
              <button
                type="button"
                onClick={handleAddMatch}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Game Leg</span>
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400">Game Leg #{idx + 1}</span>
                      {isEditing && (
                        <select
                          value={m.matchStatus || 'PENDING'}
                          onChange={(e) => handleUpdateMatch(idx, 'matchStatus', e.target.value as MatchStatus)}
                          className="bg-slate-900 border border-slate-700 text-[10px] font-bold text-white rounded px-2 py-0.5"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="WON">WON ✅</option>
                          <option value="LOST">LOST ❌</option>
                          <option value="LIVE">LIVE 🔴</option>
                        </select>
                      )}
                    </div>
                    {matches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMatch(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Game</span>
                      </button>
                    )}
                  </div>

                  {/* League & Teams & Kickoff */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="League (e.g. Premier League)"
                        value={m.league}
                        onChange={(e) => handleUpdateMatch(idx, 'league', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Home Team"
                        value={m.homeTeam}
                        onChange={(e) => handleUpdateMatch(idx, 'homeTeam', e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Away Team"
                        value={m.awayTeam}
                        onChange={(e) => handleUpdateMatch(idx, 'awayTeam', e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Kickoff (e.g. 20:00 GMT)"
                        value={m.kickoffTime}
                        onChange={(e) => handleUpdateMatch(idx, 'kickoffTime', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Prediction Market & Odds & Optional Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Prediction (e.g. Real Madrid Win or Draw (1X) & Over 1.5 Goals)"
                        value={m.prediction}
                        onChange={(e) => handleUpdateMatch(idx, 'prediction', e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        min="1.01"
                        placeholder="Odds (e.g. 1.25)"
                        value={m.odds}
                        onChange={(e) => handleUpdateMatch(idx, 'odds', Number(e.target.value))}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Final Score (e.g. 2 - 1)"
                        value={m.score || ''}
                        onChange={(e) => handleUpdateMatch(idx, 'score', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Tactical Reasoning */}
                  <div>
                    <input
                      type="text"
                      placeholder="Tactical Reasoning (e.g. High scoring H2H history, key players returning)"
                      value={m.reasoning}
                      onChange={(e) => handleUpdateMatch(idx, 'reasoning', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Codes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Booking Codes (Multi-Bookmaker)
              </label>
              <button
                type="button"
                onClick={handleAddBookingCode}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 hover:bg-indigo-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {bookingCodes.map((bc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2"
                >
                  <select
                    value={bc.bookmaker}
                    onChange={(e) => handleUpdateBookingCode(idx, 'bookmaker', e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    <option value="SportyBet">SportyBet</option>
                    <option value="1xBet">1xBet</option>
                    <option value="Bet9ja">Bet9ja</option>
                    <option value="Betway">Betway</option>
                    <option value="WilliamHill">WilliamHill</option>
                    <option value="BetKing">BetKing</option>
                    <option value="22Bet">22Bet</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Booking Code (e.g. 8XZ991)"
                    value={bc.code}
                    onChange={(e) => handleUpdateBookingCode(idx, 'code', e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono font-bold rounded-lg px-2.5 py-1.5 uppercase"
                  />

                  <input
                    type="text"
                    placeholder="Region (e.g. Global)"
                    value={bc.region}
                    onChange={(e) => handleUpdateBookingCode(idx, 'region', e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1.5"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveBookingCode(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Strategy Advice */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Admin Strategy Note for Bettors
            </label>
            <textarea
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Advice on staking, match timing, or bankroll discipline..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {submitting
                  ? isEditing
                    ? 'Saving Changes...'
                    : 'Publishing Slip...'
                  : isEditing
                  ? 'Update Slip & Games'
                  : 'Publish Rollover Slip'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
