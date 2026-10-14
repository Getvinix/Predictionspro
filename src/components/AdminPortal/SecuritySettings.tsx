import React, { useState } from 'react';
import { Key, Shield, Check, AlertCircle } from 'lucide-react';
import { changeAdminPin } from '../../utils/api.ts';

export const SecuritySettings: React.FC = () => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPin || !newPin) return;
    setLoading(true);
    setMsg(null);

    try {
      const res = await changeAdminPin(oldPin, newPin);
      if (res.success) {
        setMsg({ type: 'success', text: 'Admin PIN successfully updated!' });
        setOldPin('');
        setNewPin('');
      } else {
        setMsg({ type: 'error', text: res.message || 'Failed to change PIN.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error connecting to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Security & Admin PIN Settings</h3>
          <p className="text-xs text-slate-400">Update the access PIN required to unlock this Admin Hub</p>
        </div>
      </div>

      <form onSubmit={handleChangePin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Current PIN</label>
          <input
            type="password"
            placeholder="Enter current PIN"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl px-3.5 py-2 font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">New Security PIN</label>
          <input
            type="password"
            placeholder="Enter new PIN (min 4 characters)"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-750 text-xs text-white rounded-xl px-3.5 py-2 font-mono"
          />
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
          disabled={loading || !oldPin || !newPin}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
        >
          {loading ? 'Saving...' : 'Update Admin PIN'}
        </button>
      </form>
    </div>
  );
};
