import React, { useState } from 'react';
import {
  Phone,
  Copy,
  Check,
  ExternalLink,
  X,
  Clock,
  Users,
  MessageCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const WHATSAPP_NUMBER = '254732884645';
export const WHATSAPP_FORMATTED = '+254 732 884 645';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello RolloverPro Support, I have an inquiry regarding today's daily rollover tips."
)}`;
export const WHATSAPP_GROUP_URL =
  'https://chat.whatsapp.com/Ly1iCt01PRz7aXDZgJAzqv?s=sh&p=a&mlu=4&ilr=4';

// Official WhatsApp SVG Icon
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.83.491 3.548 1.345 5.035L2 22.062l5.176-1.328c1.432.784 3.069 1.233 4.855 1.233 5.536 0 10.031-4.495 10.031-10.031C22.062 6.495 17.567 2 12.031 2zm5.828 14.184c-.244.685-1.217 1.256-1.706 1.314-.49.058-.936.273-3.155-.595-2.22-.868-3.649-3.11-3.76-3.257-.11-.148-.897-1.194-.897-2.278 0-1.084.568-1.618.77-1.84.203-.222.443-.277.59-.277.148 0 .296.002.424.009.136.007.318-.052.497.378.185.443.628 1.53.684 1.64.056.111.093.241.019.388-.074.148-.111.24-.222.37-.111.129-.234.288-.334.387-.11.111-.226.232-.097.453.13.222.576.949 1.235 1.536.85.758 1.567.994 1.789 1.104.222.111.352.093.481-.055.13-.148.556-.648.704-.87.148-.222.296-.185.499-.111.204.074 1.295.611 1.517.722.222.111.37.166.425.259.055.093.055.537-.189 1.222z" />
  </svg>
);

// WhatsApp Navigation Tab Component for Navbar
export const WhatsAppNavTab: React.FC<{ onOpenModal?: () => void }> = ({ onOpenModal }) => {
  return (
    <button
      onClick={() => {
        if (onOpenModal) {
          onOpenModal();
        } else {
          window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
        }
      }}
      className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 shadow-sm active:scale-95 group"
      title="Join our WhatsApp Group & Contact Us (+254 732 884 645)"
    >
      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition shadow-sm">
        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
      </div>
      <span className="font-bold">WhatsApp</span>
      <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Group & Support
      </span>
    </button>
  );
};

// Sleek Group Banner for In-Feed Callouts
export const WhatsAppGroupBanner: React.FC<{ onOpenModal?: () => void }> = ({ onOpenModal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_GROUP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 p-4 sm:p-5 shadow-xl shadow-emerald-950/20 mb-6">
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <WhatsAppIcon className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold tracking-wider uppercase border border-emerald-500/30">
                Official Community
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-emerald-400" /> Free Group Access
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">
              Join Our Official Rollover WhatsApp Group
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Receive live slip releases, winning bet alerts, fast booking codes, and discuss strategies with verified bettors.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>Join WhatsApp Group</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleCopyLink}
            className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            title="Copy Group Invite Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="px-3 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-750 text-xs font-semibold transition"
              title="More WhatsApp options & 1-on-1 contact"
            >
              Support Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Floating WhatsApp Widget on bottom right
export const WhatsAppFloat: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
    >
      <button
        onClick={onOpenModal}
        className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-400/40"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-950" />
        </span>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-slate-950">
          <WhatsAppIcon className="w-4 h-4 fill-current" />
        </div>
        <div className="text-left leading-tight hidden xs:block">
          <div className="text-xs font-black tracking-wide">WhatsApp Hub</div>
          <div className="text-[10px] font-bold text-slate-900 opacity-90">
            Group & Direct Chat
          </div>
        </div>
      </button>
    </aside>
  );
};

// Interactive Contact Us & Group Invite Modal
export const WhatsAppContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState(false);

  if (!isOpen) return null;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_FORMATTED);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleCopyGroup = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_GROUP_URL);
      setCopiedGroup(true);
      setTimeout(() => setCopiedGroup(false), 2000);
    } catch {
      setCopiedGroup(true);
      setTimeout(() => setCopiedGroup(false), 2000);
    }
  };

  const handleOpenDirectChat = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGroup = () => {
    window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* WhatsApp Big Icon Header */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30 mx-auto mb-3">
            <WhatsAppIcon className="w-9 h-9 fill-current" />
          </div>
          <h3 className="text-xl font-black text-white">RolloverPro WhatsApp Hub</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Join our community for daily slips or chat directly with our management team.
          </p>
        </div>

        <div className="space-y-4">
          {/* SECTION 1: WHATSAPP GROUP INVITE */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-950 border border-emerald-500/40 shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Official WhatsApp Group
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase">
                      Active
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">Daily ticket updates & live wins</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              Follow the link to join our official bettor community. Never miss a low-odds compounding slip!
            </p>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              <button
                onClick={handleOpenGroup}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>Join Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyGroup}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                {copiedGroup ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGroup ? 'Link Copied!' : 'Copy Group Link'}</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: DIRECT WHATSAPP 1-ON-1 SUPPORT */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    1-on-1 Direct Support
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-black text-white">
                    {WHATSAPP_FORMATTED}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyPhone}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Copy phone number"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={handleOpenDirectChat}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>24/7 Response Time</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Service</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
