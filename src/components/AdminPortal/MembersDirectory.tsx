import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Award,
  Crown,
  Clock,
  Mail,
  Phone,
  Copy,
  RefreshCw,
} from 'lucide-react';
import type { UserMember } from '../../types/index.ts';
import {
  fetchAdminMembers,
  updateAdminMember,
  deleteAdminMember,
  formatRelativeTime,
} from '../../utils/api.ts';

export const MembersDirectory: React.FC = () => {
  const [members, setMembers] = useState<UserMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      const data = await fetchAdminMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleRoleChange = async (id: string, newRole: 'member' | 'verified' | 'veteran') => {
    setUpdatingId(id);
    try {
      const updated = await updateAdminMember(id, { role: newRole });
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      console.error(err);
      alert('Failed to update member role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'suspended') => {
    setUpdatingId(id);
    try {
      const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const updated = await updateAdminMember(id, { status: nextStatus });
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove member account for ${name}?`)) {
      setUpdatingId(id);
      try {
        await deleteAdminMember(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleExportCSV = () => {
    if (members.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'JoinedAt', 'LastActive', 'CodesCopied', 'TipsFollowed'];
    const rows = members.map((m) => [
      m.id,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email.replace(/"/g, '""')}"`,
      `"${(m.phone || '').replace(/"/g, '""')}"`,
      m.role,
      m.status,
      m.joinedAt,
      m.lastActiveAt,
      m.codesCopiedCount || 0,
      m.tipsFollowedCount || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rollover_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filtered = members.filter((m) => {
    if (roleFilter !== 'all' && m.role !== roleFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalVerified = members.filter((m) => m.role === 'verified').length;
  const totalFollows = members.reduce((acc, m) => acc + (m.tipsFollowedCount || 0), 0);
  const totalCopies = members.reduce((acc, m) => acc + (m.codesCopiedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Members</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{members.length}</div>
          <div className="text-[11px] text-indigo-300 font-medium mt-1">100% Free Members</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Verified Bettors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{totalVerified}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Active community punters</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Codes Copied</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{totalCopies}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">By registered members</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Bets Followed</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-300 mt-2">{totalFollows}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Total slip commitments</div>
        </div>
      </div>

      {/* Control & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Registered Members Directory ({members.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Manage member accounts, promote to VIP status, and track engagement
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadMembers}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Role:</span>
            {['all', 'verified', 'veteran', 'member'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                  roleFilter === r
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Status:</span>
            {['all', 'active', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                  statusFilter === s
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Member</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Activity</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No members match current search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const isVerified = m.role === 'verified';
                  const isVeteran = m.role === 'veteran';
                  const isActive = m.status === 'active';

                  return (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition">
                      {/* Name & Avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isVerified
                                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40'
                                : isVeteran
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {m.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {isVerified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Active: {formatRelativeTime(m.lastActiveAt)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{m.email}</span>
                        </div>
                        {m.phone && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{m.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role Selector */}
                      <td className="px-4 py-3.5">
                        <select
                          value={m.role}
                          disabled={updatingId === m.id}
                          onChange={(e) => handleRoleChange(m.id, e.target.value as any)}
                          className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : isVeteran
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="member">Community Member</option>
                          <option value="verified">✅ Verified Bettor</option>
                          <option value="veteran">🏅 Veteran Punter</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button
                          disabled={updatingId === m.id}
                          onClick={() => handleToggleStatus(m.id, m.status)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border transition flex items-center gap-1 ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <span>{m.status}</span>
                        </button>
                      </td>

                      {/* Engagement Counts */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="text-[11px]">
                          📋 <span className="font-bold text-emerald-400">{m.codesCopiedCount || 0}</span> codes
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          🎯 <span className="font-bold text-white">{m.tipsFollowedCount || 0}</span> bets placed
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {new Date(m.joinedAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          disabled={updatingId === m.id}
                          onClick={() => handleDelete(m.id, m.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                          title="Delete Member Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
