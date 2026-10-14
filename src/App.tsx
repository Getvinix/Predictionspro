import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroTracker } from './components/UserPortal/HeroTracker.tsx';
import { TodayTipCard } from './components/UserPortal/TodayTipCard.tsx';
import { DiscussionSection } from './components/UserPortal/DiscussionSection.tsx';
import { CompoundCalculator } from './components/UserPortal/CompoundCalculator.tsx';
import { PastTipsArchive } from './components/UserPortal/PastTipsArchive.tsx';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard.tsx';
import { AdminLoginModal } from './components/AdminPortal/AdminLoginModal.tsx';
import { ShareSlipModal } from './components/ShareSlipModal.tsx';
import { AnnouncementBanner } from './components/UserPortal/AnnouncementBanner.tsx';
import { AuthModal } from './components/UserPortal/AuthModal.tsx';
import {
  WhatsAppContactModal,
  WhatsAppFloat,
  WhatsAppGroupBanner,
  WHATSAPP_GROUP_URL,
  WhatsAppIcon,
} from './components/WhatsAppContact.tsx';
import type { RolloverTip, ChallengeSummary, Announcement, UserMember } from './types/index.ts';
import {
  fetchTipsAndChallenge,
  fetchAnnouncements,
  trackTipView,
  getStoredMember,
  clearMemberSession,
  type OddsFormat,
} from './utils/api.ts';
import { Flame, Shield, Heart, ArrowUpRight, Lock } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'tips' | 'calculator' | 'archive' | 'admin'>('tips');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [currentMember, setCurrentMember] = useState<UserMember | null>(null);

  const [tips, setTips] = useState<RolloverTip[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeSummary | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(4);
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>('decimal');
  const [currency, setCurrency] = useState<string>('$');
  const [shareModalTip, setShareModalTip] = useState<RolloverTip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data
  const loadData = async () => {
    try {
      const [tipData, annData] = await Promise.all([
        fetchTipsAndChallenge(),
        fetchAnnouncements(),
      ]);
      setTips(tipData.tips);
      setActiveChallenge(tipData.activeChallenge);
      setAnnouncements(annData);

      // Find the active or latest tip
      const activeTip = tipData.tips.find((t) => t.status === 'PENDING') || tipData.tips[0];
      if (activeTip) {
        setSelectedDayNumber(activeTip.dayNumber);
        trackTipView(activeTip.id);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check local admin token
    const token = localStorage.getItem('rollover_admin_token');
    if (token) {
      setIsAdmin(true);
    }
    // Check member session
    const storedMember = getStoredMember();
    if (storedMember) {
      setCurrentMember(storedMember);
    }
    loadData();
  }, []);

  const handleSelectDay = (dayNum: number) => {
    setSelectedDayNumber(dayNum);
    const tip = tips.find((t) => t.dayNumber === dayNum);
    if (tip) {
      trackTipView(tip.id);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('rollover_admin_token');
    setIsAdmin(false);
    setCurrentTab('tips');
  };

  const handleMemberLogout = () => {
    clearMemberSession();
    setCurrentMember(null);
  };

  const handleMemberAuthSuccess = (member: UserMember) => {
    setCurrentMember(member);
    setIsAuthModalOpen(false);
  };

  // Currently selected tip
  const selectedTip =
    tips.find((t) => t.dayNumber === selectedDayNumber) ||
    tips.find((t) => t.status === 'PENDING') ||
    tips[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activeChallenge={activeChallenge}
        oddsFormat={oddsFormat}
        setOddsFormat={setOddsFormat}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        currentMember={currentMember}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onMemberLogout={handleMemberLogout}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Global Announcements */}
        {announcements.length > 0 && <AnnouncementBanner announcements={announcements} />}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading Rollover Pro Daily Hub...
            </span>
          </div>
        ) : (
          <>
            {/* USER PORTAL: TIPS TAB */}
            {currentTab === 'tips' && (
              <div className="space-y-6">
                {/* 10-Day Ladder Progress Tracker */}
                <HeroTracker
                  challenge={activeChallenge}
                  tips={tips}
                  currency={currency}
                  onSelectDay={handleSelectDay}
                  selectedDayNumber={selectedDayNumber}
                />

                {/* WhatsApp Group & Community Invite Banner */}
                <WhatsAppGroupBanner onOpenModal={() => setIsWhatsAppModalOpen(true)} />

                {/* Selected Day's Official Slip */}
                {selectedTip ? (
                  <TodayTipCard
                    tip={selectedTip}
                    currency={currency}
                    oddsFormat={oddsFormat}
                    onRefresh={loadData}
                    onOpenShareModal={(t) => setShareModalTip(t)}
                    currentMember={currentMember}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  />
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
                    <p className="text-sm font-semibold">
                      No rollover slip published yet for Day {selectedDayNumber}.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Check back later or view the archive.
                    </p>
                  </div>
                )}

                {/* Match Community Discussion */}
                {selectedTip && (
                  <DiscussionSection
                    tipId={selectedTip.id}
                    dayNumber={selectedTip.dayNumber}
                  />
                )}
              </div>
            )}

            {/* USER PORTAL: CALCULATOR TAB */}
            {currentTab === 'calculator' && <CompoundCalculator currency={currency} />}

            {/* USER PORTAL: ARCHIVE TAB */}
            {currentTab === 'archive' && (
              <PastTipsArchive
                tips={tips}
                currency={currency}
                oddsFormat={oddsFormat}
                onSelectTip={(tip) => {
                  setSelectedDayNumber(tip.dayNumber);
                  setCurrentTab('tips');
                }}
              />
            )}

            {/* ADMIN PORTAL: ACTIVITY MONITOR & MANAGEMENT */}
            {currentTab === 'admin' && (
              <AdminDashboard
                tips={tips}
                announcements={announcements}
                activeChallenge={activeChallenge}
                currency={currency}
                oddsFormat={oddsFormat}
                onRefresh={loadData}
                onLogout={handleAdminLogout}
                onSwitchToUserView={() => setCurrentTab('tips')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
              RP
            </div>
            <span className="font-bold text-slate-200">RolloverPro</span>
            <span className="text-slate-600">•</span>
            <span>Disciplined Low-Odds Daily Compounding</span>
          </div>

          <div className="text-slate-500 text-center sm:text-right text-[11px] max-w-md">
            Bet responsibly. Rollovers require mathematical discipline. Never stake more than you can comfortably afford to lose.
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30"
              title="Join official WhatsApp group"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>Join WhatsApp Group</span>
            </a>

            <button
              onClick={() => {
                if (isAdmin) setCurrentTab('admin');
                else setIsAdminLoginOpen(true);
              }}
              className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Console' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Client Member Sign-In / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleMemberAuthSuccess}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setCurrentTab('admin');
        }}
      />

      {/* Share Slip Modal */}
      <ShareSlipModal
        tip={shareModalTip}
        currency={currency}
        onClose={() => setShareModalTip(null)}
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <WhatsAppFloat onOpenModal={() => setIsWhatsAppModalOpen(true)} />

      {/* WhatsApp Contact Us Modal */}
      <WhatsAppContactModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </div>
  );
}
