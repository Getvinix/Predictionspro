import React, { useState, useEffect } from 'react';
import {
  Activity,
  Copy,
  Eye,
  Users,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Shield,
  Smartphone,
  Monitor,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import type { ActivityLog, SystemMetrics } from '../../types/index.ts';
import {
  fetchActivities,
  fetchSystemMetrics,
  clearAllActivities,
  formatRelativeTime,
} from '../../utils/api.ts';

export const ActivityMonitor: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);

  const loadData = async () => {
    try {
      const [actData, metricsData] = await Promise.all([
        fetchActivities({
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          actorType: actorFilter !== 'all' ? actorFilter : undefined,
          search: searchQuery.trim() || undefined,
          limit: 150,
        }),
        fetchSystemMetrics(),
      ]);
      setActivities(actData.activities);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load activity monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, actorFilter, searchQuery]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData();
    }, 3500);
    return () => clearInterval(interval);
  }, [autoRefresh, categoryFilter, actorFilter, searchQuery]);

  const handleClearActivities = async () => {
    if (window.confirm('Are you sure you want to clear all activity logs?')) {
      await clearAllActivities();
      loadData();
    }
  };

  const handleExportCSV = () => {
    if (activities.length === 0) return;
    const headers = ['ID', 'Timestamp', 'ActorType', 'Actor', 'ActionType', 'Category', 'Details', 'Device'];
    const rows = activities.map((a) => [
      a.id,
      a.timestamp,
      a.actorType,
      `"${a.actorIdentifier.replace(/"/g, '""')}"`,
      a.actionType,
      a.category,
      `"${a.details.replace(/"/g, '""')}"`,
      `"${a.device.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rollover_activities_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for category badge colors
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'conversion':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'management':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'community':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'engagement':
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Activity KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Code Copies</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics ? metrics.totalCopies.toLocaleString() : '...'}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span>High conversion action</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Slip Impressions</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics ? metrics.totalViews.toLocaleString() : '...'}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Active view sessions
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Bettors Online</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2 flex items-center gap-2">
            <span>{metrics ? metrics.activeVisitorsNow : '...'}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Live on tips page right now
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monitored Actions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {activities.length}
          </div>
          <div className="text-[11px] text-indigo-300 font-medium mt-1">
            Streamed in real-time
          </div>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title & Live Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Live Activity Monitoring Stream
                </h3>
                {autoRefresh && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE POLLING
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Tracking every user booking code copy, slip view, bet follow, reaction, and admin update
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                autoRefresh
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  : 'bg-indigo-600 text-white border-indigo-500'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto (3s)' : 'Paused'}</span>
            </button>

            <button
              onClick={loadData}
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

            <button
              onClick={handleClearActivities}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/50 text-xs font-semibold transition flex items-center gap-1.5"
              title="Clear activity log history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user, country, booking code, or pick..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'conversion', label: 'Codes / Bets' },
              { id: 'engagement', label: 'Views & Calc' },
              { id: 'community', label: 'Reactions' },
              { id: 'management', label: 'Admin Logs' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  categoryFilter === cat.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Actor Type Filter */}
          <div className="flex items-center justify-end gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px]">Actor:</span>
            {['all', 'user', 'admin'].map((actor) => (
              <button
                key={actor}
                onClick={() => setActorFilter(actor)}
                className={`px-2.5 py-1 rounded capitalize transition ${
                  actorFilter === actor
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {actor}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Logs Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
          <span>Real-Time Stream ({activities.length} Events)</span>
          <span>Click any row for detailed inspection</span>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            {loading ? 'Streaming activity logs...' : 'No activity records match your current filters.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
            {activities.map((act) => {
              const isUser = act.actorType === 'user';
              const isMobile = act.device?.toLowerCase().includes('mobile');

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className="p-3.5 sm:p-4 hover:bg-slate-800/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs group"
                >
                  {/* Left: Indicator, Actor & Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        act.category === 'conversion'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : act.category === 'management'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : act.category === 'community'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      {act.category === 'conversion' ? (
                        <Copy className="w-3.5 h-3.5" />
                      ) : act.category === 'management' ? (
                        <Shield className="w-3.5 h-3.5" />
                      ) : act.category === 'community' ? (
                        <Flame className="w-3.5 h-3.5" />
                      ) : (
                        <Activity className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-slate-200 truncate">
                          {act.actorIdentifier}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase border ${getCategoryBadge(
                            act.category
                          )}`}
                        >
                          {act.category}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          {isMobile ? (
                            <Smartphone className="w-3 h-3" />
                          ) : (
                            <Monitor className="w-3 h-3" />
                          )}
                          {act.device}
                        </span>
                      </div>

                      <p className="text-slate-300 font-medium leading-relaxed group-hover:text-white transition">
                        {act.details}
                      </p>
                    </div>
                  </div>

                  {/* Right: Timestamp & Action Type */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between text-right flex-shrink-0 gap-1 border-t sm:border-0 border-slate-800 pt-1 sm:pt-0">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatRelativeTime(act.timestamp)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Details Inspector Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h4 className="text-base font-bold text-white">Event Log Inspector</h4>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Actor:</span>
                <span className="font-bold text-white">{selectedActivity.actorIdentifier}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Action Description:</span>
                <span className="font-medium text-slate-200">{selectedActivity.details}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Category:</span>
                  <span className="font-semibold text-emerald-400 uppercase">{selectedActivity.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Action Code:</span>
                  <span className="font-mono text-amber-300">{selectedActivity.actionType}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Timestamp:</span>
                <span className="font-mono text-slate-300">
                  {new Date(selectedActivity.timestamp).toLocaleString()} ({selectedActivity.timestamp})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Device Info:</span>
                <span className="text-slate-300">{selectedActivity.device}</span>
              </div>
              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Raw Event Payload:</span>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
