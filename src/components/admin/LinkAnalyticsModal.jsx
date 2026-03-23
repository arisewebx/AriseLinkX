import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, Users, Link2, MousePointer, Calendar,
  BarChart3, PieChart, Download, Smartphone,
  Monitor, MapPin, Trophy, Activity
} from 'lucide-react';

const AnalyticsModal = ({ isOpen, onClose, platformStats, allUrls = [], allClicks = [], users = [] }) => {
  if (!isOpen) return null;

  const now = new Date();
  const todayStr = now.toDateString();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  // ── Derived metrics ──────────────────────────────────────────
  const weeklyGrowth = platformStats.totalUsers > 0
    ? ((platformStats.recentSignups / platformStats.totalUsers) * 100).toFixed(1) : 0;
  const avgLinksPerUser = platformStats.totalUsers > 0
    ? (platformStats.totalLinks / platformStats.totalUsers).toFixed(1) : 0;
  const avgClicksPerLink = platformStats.totalLinks > 0
    ? (platformStats.totalClicks / platformStats.totalLinks).toFixed(1) : 0;
  const userEngagementRate = platformStats.totalUsers > 0
    ? ((platformStats.activeUsers / platformStats.totalUsers) * 100).toFixed(1) : 0;

  // ── Time-based activity ──────────────────────────────────────
  const clicksToday = allClicks.filter(c => new Date(c.created_at).toDateString() === todayStr).length;
  const clicksThisWeek = allClicks.filter(c => new Date(c.created_at) >= weekAgo).length;
  const linksThisWeek = allUrls.filter(u => new Date(u.created_at) >= weekAgo).length;
  const linksToday = allUrls.filter(u => new Date(u.created_at).toDateString() === todayStr).length;

  // ── Device breakdown ─────────────────────────────────────────
  const deviceCounts = useMemo(() => {
    const counts = {};
    allClicks.forEach(c => {
      const d = c.device || 'desktop';
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allClicks]);

  // ── Top countries ────────────────────────────────────────────
  const topCountries = useMemo(() => {
    const counts = {};
    allClicks.forEach(c => { if (c.country) counts[c.country] = (counts[c.country] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [allClicks]);

  // ── Top performing links ─────────────────────────────────────
  const topLinks = useMemo(() => {
    const clickMap = {};
    allClicks.forEach(c => { clickMap[c.url_id] = (clickMap[c.url_id] || 0) + 1; });
    return allUrls
      .map(u => ({ ...u, clickCount: clickMap[u.id] || 0 }))
      .filter(u => u.clickCount > 0)
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5);
  }, [allUrls, allClicks]);

  // ── Top active users ─────────────────────────────────────────
  const topUsers = useMemo(() => {
    return [...(users || [])]
      .sort((a, b) => (b.linksCount || 0) - (a.linksCount || 0))
      .slice(0, 3);
  }, [users]);

  // ── Export ───────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', platformStats.totalUsers],
      ['Active Users', platformStats.activeUsers],
      ['Banned Users', platformStats.bannedUsers],
      ['Admin Users', platformStats.adminUsers],
      ['Total Links', platformStats.totalLinks],
      ['Total Clicks', platformStats.totalClicks],
      ['Clicks Today', clicksToday],
      ['Clicks This Week', clicksThisWeek],
      ['Links Today', linksToday],
      ['Links This Week', linksThisWeek],
      ['Avg Clicks / Link', avgClicksPerLink],
      ['Avg Links / User', avgLinksPerUser],
      ['Weekly Growth %', `${weeklyGrowth}%`],
      ['Active User Rate', `${userEngagementRate}%`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deviceIcon = (d) => d === 'mobile' ? Smartphone : Monitor;
  const maxClicks = topLinks[0]?.clickCount || 1;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Platform Analytics
          </h3>
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" />Export CSV
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xl leading-none">×</button>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Weekly Growth", value: `+${weeklyGrowth}%`, sub: `${platformStats.recentSignups} new signups`, icon: Users, color: "text-blue-500 bg-blue-50" },
              { label: "Links / User", value: avgLinksPerUser, sub: "Avg per user", icon: Link2, color: "text-orange-500 bg-orange-50" },
              { label: "Clicks / Link", value: avgClicksPerLink, sub: "Avg per link", icon: MousePointer, color: "text-green-500 bg-green-50" },
              { label: "Active Rate", value: `${userEngagementRate}%`, sub: `${platformStats.activeUsers} of ${platformStats.totalUsers} users`, icon: BarChart3, color: "text-purple-500 bg-purple-50" },
            ].map((m) => (
              <div key={m.label} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${m.color}`}>
                    <m.icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{m.value}</p>
                <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Activity + User Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Recent Activity */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />Recent Activity
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Clicks today", value: clicksToday, accent: "text-green-600" },
                  { label: "Clicks this week", value: clicksThisWeek, accent: "text-blue-600" },
                  { label: "Links created today", value: linksToday, accent: "text-orange-500" },
                  { label: "Links this week", value: linksThisWeek, accent: "text-purple-600" },
                  { label: "New users (7 days)", value: platformStats.recentSignups, accent: "text-gray-700" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{r.label}</span>
                    <span className={`text-sm font-bold ${r.accent}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Status */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-orange-500" />User Status
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Active Users", value: platformStats.activeUsers, bar: "bg-green-500", text: "text-green-600" },
                  { label: "Banned Users", value: platformStats.bannedUsers, bar: "bg-red-400", text: "text-red-500" },
                  { label: "Admin Users", value: platformStats.adminUsers, bar: "bg-orange-500", text: "text-orange-500" },
                  { label: "Total Links", value: platformStats.totalLinks, bar: "bg-blue-400", text: "text-blue-600" },
                  { label: "Total Clicks", value: platformStats.totalClicks, bar: "bg-purple-400", text: "text-purple-600" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500 w-28 shrink-0">{s.label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className={`${s.bar} h-1.5 rounded-full`}
                        style={{ width: `${Math.min((s.value / Math.max(platformStats.totalClicks, platformStats.totalUsers, 1)) * 100, 100)}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${s.text} w-8 text-right shrink-0`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Device Breakdown + Top Countries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Device Breakdown */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-orange-500" />Device Breakdown
              </h4>
              {deviceCounts.length > 0 ? (
                <div className="space-y-3">
                  {deviceCounts.map(([device, count]) => {
                    const Icon = deviceIcon(device);
                    const pct = allClicks.length > 0 ? ((count / allClicks.length) * 100).toFixed(0) : 0;
                    return (
                      <div key={device} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 capitalize">{device}</span>
                            <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No click data yet</p>
              )}
            </div>

            {/* Top Countries */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />Top Countries
              </h4>
              {topCountries.length > 0 ? (
                <div className="space-y-3">
                  {topCountries.map(([country, count], i) => {
                    const pct = allClicks.length > 0 ? ((count / allClicks.length) * 100).toFixed(0) : 0;
                    return (
                      <div key={country} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-4 shrink-0">#{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{country}</span>
                            <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No location data yet</p>
              )}
            </div>
          </div>

          {/* Top Performing Links */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-500" />Top Performing Links
            </h4>
            {topLinks.length > 0 ? (
              <div className="space-y-3">
                {topLinks.map((link, i) => (
                  <div key={link.id} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 shrink-0 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1 gap-2">
                        <span className="text-sm text-gray-700 truncate font-medium">{link.title || link.short_url}</span>
                        <span className="text-xs text-gray-500 shrink-0">{link.clickCount} clicks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${(link.clickCount / maxClicks) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No links with clicks yet</p>
            )}
          </div>

          {/* Top Active Users */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />Most Active Users
            </h4>
            {topUsers.length > 0 ? (
              <div className="space-y-3">
                {topUsers.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{u.name || u.email}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-orange-500">{u.linksCount || 0}</p>
                      <p className="text-xs text-gray-400">links</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No user data</p>
            )}
          </div>

          {/* Summary row */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1.5 text-sm text-gray-600">
              <p>Total users: <span className="font-semibold text-gray-900">{platformStats.totalUsers}</span></p>
              <p>Total links: <span className="font-semibold text-gray-900">{platformStats.totalLinks}</span></p>
              <p>Total clicks: <span className="font-semibold text-gray-900">{platformStats.totalClicks.toLocaleString()}</span></p>
              <p>Weekly growth: <span className="font-semibold text-gray-900">{weeklyGrowth}%</span></p>
              <p>Avg links/user: <span className="font-semibold text-gray-900">{avgLinksPerUser}</span></p>
              <p>Avg clicks/link: <span className="font-semibold text-gray-900">{avgClicksPerLink}</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
