import React, { useState } from 'react';
import { X, Copy, Check, Share2, Flame, Send } from 'lucide-react';
import type { RolloverTip } from '../types/index.ts';
import { logUserActivity } from '../utils/api.ts';

interface ShareSlipModalProps {
  tip: RolloverTip | null;
  currency: string;
  onClose: () => void;
}

export const ShareSlipModal: React.FC<ShareSlipModalProps> = ({ tip, currency, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!tip) return null;

  const matchLines = tip.matches
    .map((m) => `⚽ ${m.homeTeam} vs ${m.awayTeam}\n👉 Pick: ${m.prediction} (@${m.odds})`)
    .join('\n\n');

  const codesLine = tip.bookingCodes.map((b) => `🔹 ${b.bookmaker}: ${b.code}`).join('\n');

  const shareText = `🔥 ROLLOVER PRO - DAY ${tip.dayNumber} OF ${tip.totalDays} 🔥\n\n💰 Stake: ${currency}${tip.currentStake} ➡️ Target: ${currency}${tip.targetPayout}\n🎯 Total Odds: @${tip.totalOdds.toFixed(2)}\n\n${matchLines}\n\n📋 BOOKING CODES:\n${codesLine}\n\nStrict compounding discipline. Let’s cash out together! 🚀`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      await logUserActivity(
        'slip_shared',
        'conversion',
        `Shared Day ${tip.dayNumber} Rollover Slip text to clipboard`,
        { tipId: tip.id, dayNumber: tip.dayNumber }
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    logUserActivity(
      'slip_shared',
      'conversion',
      `Shared Day ${tip.dayNumber} Rollover Slip to WhatsApp`,
      { tipId: tip.id, platform: 'whatsapp' }
    );
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    logUserActivity(
      'slip_shared',
      'conversion',
      `Shared Day ${tip.dayNumber} Rollover Slip to Telegram`,
      { tipId: tip.id, platform: 'telegram' }
    );
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Share Day {tip.dayNumber} Rollover Slip</h3>
            <p className="text-xs text-slate-400">
              Formatted for WhatsApp, Telegram, Twitter, or punters group
            </p>
          </div>
        </div>

        {/* Text Preview Box */}
        <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Text!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-200 font-bold text-xs sm:text-sm transition"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-900/60 hover:bg-sky-800/60 border border-sky-700/40 text-sky-200 font-bold text-xs sm:text-sm transition"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
};
