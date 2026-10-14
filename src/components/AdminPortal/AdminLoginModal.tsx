import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, AlertCircle } from 'lucide-react';
import { verifyAdminPin } from '../../utils/api.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError('');

    try {
      const valid = await verifyAdminPin(pin.trim());
      if (valid) {
        localStorage.setItem('rollover_admin_token', 'true');
        onSuccess();
        onClose();
      } else {
        setError('Incorrect Admin PIN. Please try again.');
      }
    } catch {
      setError('Connection error verifying PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white">Admin Hub Access</h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter authorized security PIN to manage tips and view live user activity logs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Admin Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter PIN (e.g. admin123)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
            {error && (
              <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300">
            💡 Default demo PIN is: <strong className="text-indigo-200 font-mono">admin123</strong> or <strong className="text-indigo-200 font-mono">1234</strong>
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Verifying...' : 'Unlock Admin Hub'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
