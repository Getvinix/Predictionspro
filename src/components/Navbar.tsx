import React from 'react';
import {
  Flame,
  Shield,
  Activity,
  Calculator,
  History,
  Ticket,
  Lock,
  Unlock,
  Sparkles,
  User,
  LogOut,
  Crown,
} from 'lucide-react';
import type { OddsFormat } from '../utils/api.ts';
import type { ChallengeSummary, UserMember } from '../types/index.ts';
import { WhatsAppNavTab } from './WhatsAppContact.tsx';

interface NavbarProps {
  currentTab: 'tips' | 'calculator' | 'archive' | 'admin';
  setCurrentTab: (tab: 'tips' | 'calculator' | 'archive' | 'admin') => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  activeChallenge: ChallengeSummary | null;
  oddsFormat: OddsFormat;
  setOddsFormat: (fmt: OddsFormat) => void;
  currency: string;
  setCurrency: (c: string) => void;
  onOpenAdminLogin: () => void;
  currentMember: UserMember | null;
  onOpenAuthModal: () => void;
  onMemberLogout: () => void;
  onOpenWhatsAppModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isAdmin,
  setIsAdmin,
  activeChallenge,
  oddsFormat,
  setOddsFormat,
  currency,
  setCurrency,
  onOpenAdminLogin,
  currentMember,
  onOpenAuthModal,
  onMemberLogout,
  onOpenWhatsAppModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('tips')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
                <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                    Rollover<span className="text-emerald-400">Pro</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    LIVE CHALLENGE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
                  Daily Disciplined Sports Betting Compounding
                </p>
              </div>
            </button>

            {/* Streak & Day Pill on Desktop */}
            {activeChallenge && (
              <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
                <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">Day:</span>
                  <span className="font-bold text-emerald-400">
                    {activeChallenge.currentDay}/{activeChallenge.totalDays}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{activeChallenge.currentStreak} Streak</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('tips')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                currentTab === 'tips'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Today's Slip</span>
            </button>

            <button
              onClick={() => setCurrentTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                currentTab === 'calculator'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Bankroll</span> Calculator
            </button>

            <button
              onClick={() => setCurrentTab('archive')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                currentTab === 'archive'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Archives</span>
            </button>

            {/* WhatsApp Contact Tab */}
            <WhatsAppNavTab onOpenModal={onOpenWhatsAppModal} />

            {/* Admin Hub - strictly visible only to authenticated administrator */}
            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`ml-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/60'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="hidden xs:inline">Admin Hub</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>
            )}
          </nav>

          {/* Right Action: Member Auth Status & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Member Auth Status */}
            {currentMember ? (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                    currentMember.role === 'verified'
                      ? 'bg-emerald-500 text-slate-950'
                      : currentMember.role === 'veteran'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {currentMember.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-slate-200 leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[90px]">{currentMember.name.split(' ')[0]}</span>
                    {currentMember.role === 'verified' && <Sparkles className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-emerald-400">
                    {currentMember.role === 'verified' ? 'Verified Bettor' : currentMember.role}
                  </span>
                </div>
                <button
                  onClick={onMemberLogout}
                  className="text-slate-400 hover:text-rose-400 ml-1 p-0.5 transition"
                  title="Sign out of bettor account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Odds Format Selector (Desktop) */}
            <div className="hidden xl:flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
              {(['decimal', 'fractional', 'american'] as OddsFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOddsFormat(fmt)}
                  className={`px-2 py-1 rounded capitalize transition ${
                    oddsFormat === fmt
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Currency Selector (Desktop) */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="hidden lg:block bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="₦">NGN (₦)</option>
              <option value="KSh">KES (KSh)</option>
              <option value="GH₵">GHS (GH₵)</option>
              <option value="R">ZAR (R)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
