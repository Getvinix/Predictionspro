import React, { useState } from 'react';
import { Shield, Check, AlertCircle, User, Lock, KeyRound } from 'lucide-react';
import { changeAdminCredentials } from '../../utils/api.ts';

export const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return;
    if (!newUsername.trim() && !newPassword.trim()) {
      setMsg({ type: 'error', text: 'Enter a new username or new password to update.' });
      return;
    }
    setLoading(true);
    setMsg(null);

    try {
      const res = await changeAdminCredentials(
        currentPassword.trim(),
        newUsername.trim() || undefined,
        newPassword.trim() || undefined
      );
      if (res.success) {
        setMsg({ type: 'success', text: 'Admin security credentials successfully updated!' });
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed to update credentials.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error connecting to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl max-w-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Administrator Security Credentials</h3>
          <p className="text-xs text-slate-400">
            Secure administrative login credentials. Never shared or visible to public visitors.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdateCredentials} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Current Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter current password to verify identity"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl pl-9 pr-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              New Admin Username (Leave blank to keep unchanged)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="New username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              New Admin Password (Leave blank to keep unchanged)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="New secure password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl pl-9 pr-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {msg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              msg.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
            }`}
          >
            {msg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msg.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !currentPassword || (!newUsername.trim() && !newPassword.trim())}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          <span>{loading ? 'Updating Credentials...' : 'Save Updated Credentials'}</span>
        </button>
      </form>
    </div>
  );
};
