import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { logUserActivity } from '../../utils/api.ts';

interface CompoundCalculatorProps {
  currency: string;
}

export const CompoundCalculator: React.FC<CompoundCalculatorProps> = ({ currency }) => {
  const [startingStake, setStartingStake] = useState<number>(20);
  const [days, setDays] = useState<number>(10);
  const [dailyOdds, setDailyOdds] = useState<number>(1.35);
  const [takeOutOriginalAtDay, setTakeOutOriginalAtDay] = useState<boolean>(true);

  // Generate day-by-day progression
  const schedule: Array<{
    day: number;
    startAmount: number;
    odds: number;
    payout: number;
    profit: number;
    note: string;
  }> = [];

  let running = startingStake;
  for (let i = 1; i <= days; i++) {
    const start = running;
    const payout = Number((start * dailyOdds).toFixed(2));
    const profit = Number((payout - startingStake).toFixed(2));

    let note = 'Compounding';
    if (i === 1) note = 'Starting sprint';
    if (i === 3) note = 'Initial stake doubled';
    if (i === 4 && takeOutOriginalAtDay) {
      note = 'Risk-Free: Original stake banked!';
    }
    if (i === days) note = 'Final Goal Target!';

    schedule.push({
      day: i,
      startAmount: start,
      odds: dailyOdds,
      payout,
      profit,
      note,
    });

    running = payout;
  }

  const finalPayout = schedule[schedule.length - 1]?.payout || 0;
  const totalGainMultiplier = (finalPayout / startingStake).toFixed(1);

  const handleSimulateActivity = () => {
    logUserActivity(
      'calculator_simulated',
      'engagement',
      `Simulated ${days}-day rollover: ${currency}${startingStake} -> ${currency}${finalPayout} @ ${dailyOdds} odds`,
      { startingStake, days, dailyOdds, finalPayout }
    );
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Rollover Compound Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Model exponential returns on low-odds accumulator rollover cycles
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Multiplier</div>
              <div className="text-lg font-black text-emerald-400">+{totalGainMultiplier}x Return</div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Final Bankroll</div>
              <div className="text-lg font-black text-amber-300">
                {currency}{finalPayout.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-800">
          {/* Starting Stake */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Starting Stake ({currency})
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">{currency}</span>
              <input
                type="number"
                min="1"
                step="5"
                value={startingStake}
                onChange={(e) => {
                  setStartingStake(Math.max(1, Number(e.target.value) || 1));
                  handleSimulateActivity();
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {[10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setStartingStake(val);
                    handleSimulateActivity();
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded font-semibold transition ${
                    startingStake === val
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {currency}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Target Days */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Challenge Duration</label>
              <span className="text-xs font-bold text-emerald-400">{days} Days</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={days}
              onChange={(e) => {
                setDays(Number(e.target.value));
                handleSimulateActivity();
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>3 Days (Quick)</span>
              <span>10 Days (Standard)</span>
              <span>15 Days (Elite)</span>
            </div>
          </div>

          {/* Average Odds */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Average Daily Odds</label>
              <span className="text-xs font-bold text-amber-300">@{dailyOdds.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.20"
              max="1.60"
              step="0.01"
              value={dailyOdds}
              onChange={(e) => {
                setDailyOdds(Number(e.target.value));
                handleSimulateActivity();
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1.20 (Ultra Safe)</span>
              <span>1.35 (Golden Mean)</span>
              <span>1.60 (Aggressive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progression Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Day-by-Day Compounding Ladder
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Based on {days} consecutive wins @ {dailyOdds.toFixed(2)} odds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Stake Amount</th>
                <th className="px-4 py-3">Odds</th>
                <th className="px-4 py-3">Daily Payout</th>
                <th className="px-4 py-3">Net Profit</th>
                <th className="px-4 py-3">Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {schedule.map((row) => (
                <tr
                  key={row.day}
                  className={`hover:bg-slate-800/40 transition ${
                    row.day === days ? 'bg-emerald-950/20 font-bold' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      Day {row.day}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {currency}{row.startAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-300">
                    @{row.odds.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-400">
                    {currency}{row.payout.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-semibold">
                    +{currency}{row.profit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.day === days
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : row.day === 3
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.note}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules of Golden Discipline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          The Golden Rules of Successful Rollovers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">1. Never Force High Odds</strong>
            Target 1.25 to 1.40 odds only. Double Chance (1X/X2) or Over 1.5 Goals are the highest statistical probability bets in football.
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">2. Secure Capital at Day 4</strong>
            Once your bankroll reaches 3x to 4x of your starting deposit, withdraw your initial stake. You are then playing purely on bookmaker profits!
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">3. Only One Daily Slip</strong>
            Do not gamble on live games or side tickets with your rollover funds. Compound discipline is the only path to 25x multiplication.
          </div>
        </div>
      </div>
    </div>
  );
};
