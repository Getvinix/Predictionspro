import React, { useState } from 'react';
import {
  Activity,
  Ticket,
  Plus,
  Megaphone,
  Key,
  LogOut,
  Eye,
  Shield,
  Flame,
  Award,
  Users,
} from 'lucide-react';
import type { RolloverTip, Announcement, ChallengeSummary } from '../../types/index.ts';
import type { OddsFormat } from '../../utils/api.ts';
import { ActivityMonitor } from './ActivityMonitor.tsx';
import { ManageTipsList } from './ManageTipsList.tsx';
import { MembersDirectory } from './MembersDirectory.tsx';
import { AnnouncementsManager } from './AnnouncementsManager.tsx';
import { SecuritySettings } from './SecuritySettings.tsx';
import { UploadTipModal } from './UploadTipModal.tsx';

interface AdminDashboardProps {
  tips: RolloverTip[];
  announcements: Announcement[];
  activeChallenge: ChallengeSummary | null;
  currency: string;
  oddsFormat: OddsFormat;
  onRefresh: () => void;
  onLogout: () => void;
  onSwitchToUserView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tips,
  announcements,
  activeChallenge,
  currency,
  oddsFormat,
  onRefresh,
  onLogout,
  onSwitchToUserView,
}) => {
  const [adminTab, setAdminTab] = useState<
    'activity' | 'members' | 'tips' | 'announcements' | 'security'
  >('activity');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<RolloverTip | null>(null);

  const nextSuggestedDay = activeChallenge ? activeChallenge.currentDay + 1 : tips.length + 1;

  const handleOpenNewUpload = () => {
    setEditingTip(null);
    setIsUploadOpen(true);
  };

  const handleOpenEditTip = (tip: RolloverTip) => {
    setEditingTip(tip);
    setIsUploadOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Status Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-700/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">Administrator Command Center</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-indigo-200/80">
              Session Active • Full tip publishing, game editing & registered members control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenNewUpload}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Day {nextSuggestedDay} Slip</span>
          </button>

          <button
            onClick={onSwitchToUserView}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Preview User View</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Lock Admin Console"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab('activity')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'activity'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Activity Monitor</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-black">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setAdminTab('members')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'members'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Members</span>
        </button>

        <button
          onClick={() => setAdminTab('tips')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'tips'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Manage Slips & Games ({tips.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('announcements')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'security'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security & PIN</span>
        </button>
      </div>

      {/* Tab Panels */}
      {adminTab === 'activity' && <ActivityMonitor />}

      {adminTab === 'members' && <MembersDirectory />}

      {adminTab === 'tips' && (
        <ManageTipsList
          tips={tips}
          currency={currency}
          oddsFormat={oddsFormat}
          onRefresh={onRefresh}
          onOpenUploadModal={handleOpenNewUpload}
          onEditTip={handleOpenEditTip}
        />
      )}

      {adminTab === 'announcements' && (
        <AnnouncementsManager announcements={announcements} onRefresh={onRefresh} />
      )}

      {adminTab === 'security' && <SecuritySettings />}

      {/* Upload & Edit Tip Modal */}
      <UploadTipModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingTip(null);
        }}
        onSuccess={() => {
          onRefresh();
          setAdminTab('tips');
          setEditingTip(null);
        }}
        currency={currency}
        suggestedDay={nextSuggestedDay}
        currentBankroll={activeChallenge?.currentBankroll || 20}
        initialTip={editingTip}
      />
    </div>
  );
};
