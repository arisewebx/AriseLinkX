// // src/components/admin/LinkAnalyticsModal.jsx
// import React, { useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import { XCircle, Link as LinkIcon, MousePointer, TrendingUp } from 'lucide-react';

// const LinkAnalyticsModal = ({ 
//   isOpen, 
//   onClose, 
//   allUrls, 
//   allClicks, 
//   platformStats 
// }) => {
  
//   if (!isOpen) return null;

//   // Calculate top performing links
//   const topLinks = useMemo(() => {
//     if (!allUrls || !allClicks) return [];

//     // Group clicks by URL ID and count them
//     const clicksByUrl = allClicks.reduce((acc, click) => {
//       acc[click.url_id] = (acc[click.url_id] || 0) + 1;
//       return acc;
//     }, {});

//     // Merge with URL data and sort by clicks
//     return allUrls
//       .map(url => ({
//         id: url.id,
//         title: url.title || 'Untitled',
//         short_url: url.short_url,
//         original_url: url.original_url,
//         clicks: clicksByUrl[url.id] || 0,
//         created: new Date(url.created_at).toLocaleDateString(),
//         user_id: url.user_id
//       }))
//       .sort((a, b) => b.clicks - a.clicks)
//       .slice(0, 10); // Top 10 links
//   }, [allUrls, allClicks]);

//   const analyticsData = {
//     totalLinks: platformStats.totalLinks,
//     totalClicks: platformStats.totalClicks,
//     avgClicksPerLink: platformStats.avgClicksPerLink,
//     clickThroughRate: platformStats.totalLinks > 0 
//       ? ((platformStats.totalClicks / platformStats.totalLinks) * 100).toFixed(1)
//       : 0
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-white flex items-center gap-3">
//             <TrendingUp className="w-6 h-6 text-blue-400" />
//             Link Analytics & Performance
//           </h3>
//           <Button onClick={onClose} className="bg-transparent hover:bg-white/10 p-2">
//             <XCircle className="w-5 h-5 text-gray-400" />
//           </Button>
//         </div>
        
//         {/* Analytics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 rounded-xl border border-blue-500/20">
//             <div className="flex items-center gap-3 mb-3">
//               <LinkIcon className="w-8 h-8 text-blue-400" />
//               <div>
//                 <h4 className="text-white font-semibold">Total Links</h4>
//                 <p className="text-blue-300 text-2xl font-bold">{analyticsData.totalLinks}</p>
//               </div>
//             </div>
//             <p className="text-gray-400 text-sm">Active short links</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/20">
//             <div className="flex items-center gap-3 mb-3">
//               <MousePointer className="w-8 h-8 text-green-400" />
//               <div>
//                 <h4 className="text-white font-semibold">Total Clicks</h4>
//                 <p className="text-green-300 text-2xl font-bold">{analyticsData.totalClicks.toLocaleString()}</p>
//               </div>
//             </div>
//             <p className="text-gray-400 text-sm">All-time clicks</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
//             <div className="flex items-center gap-3 mb-3">
//               <TrendingUp className="w-8 h-8 text-purple-400" />
//               <div>
//                 <h4 className="text-white font-semibold">Avg CTR</h4>
//                 <p className="text-purple-300 text-2xl font-bold">{analyticsData.avgClicksPerLink}</p>
//               </div>
//             </div>
//             <p className="text-gray-400 text-sm">Clicks per link</p>
//           </div>
//         </div>
        
//         {/* Top Performing Links */}
//         <div className="bg-white/5 p-6 rounded-xl">
//           <h4 className="text-white font-semibold mb-4">Top Performing Links</h4>
//           {topLinks.length > 0 ? (
//             <div className="space-y-3">
//               {topLinks.map((link, index) => (
//                 <div key={link.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                       {index + 1}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="text-white font-medium truncate">{link.title}</div>
//                       <div className="text-gray-400 text-sm truncate">
//                         /{link.short_url} → {link.original_url}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right flex-shrink-0 ml-4">
//                     <div className="text-green-400 font-semibold">{link.clicks} clicks</div>
//                     <div className="text-gray-400 text-sm">{link.created}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-400">No links data available</p>
//             </div>
//           )}
//         </div>

//         {/* Additional Analytics Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//           <div className="bg-white/5 p-6 rounded-xl">
//             <h4 className="text-white font-semibold mb-4">Recent Activity</h4>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Links Created Today</span>
//                 <span className="text-blue-400 font-semibold">
//                   {allUrls?.filter(url => {
//                     const created = new Date(url.created_at);
//                     const today = new Date();
//                     return created.toDateString() === today.toDateString();
//                   }).length || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Links This Week</span>
//                 <span className="text-green-400 font-semibold">
//                   {allUrls?.filter(url => {
//                     const created = new Date(url.created_at);
//                     const weekAgo = new Date();
//                     weekAgo.setDate(weekAgo.getDate() - 7);
//                     return created > weekAgo;
//                   }).length || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Most Active Hour</span>
//                 <span className="text-purple-400 font-semibold">
//                   {new Date().getHours()}:00
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/5 p-6 rounded-xl">
//             <h4 className="text-white font-semibold mb-4">Performance Metrics</h4>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Click Rate</span>
//                 <span className="text-orange-400 font-semibold">{analyticsData.clickThroughRate}%</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Active Links</span>
//                 <span className="text-cyan-400 font-semibold">{analyticsData.totalLinks}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Total Engagement</span>
//                 <span className="text-pink-400 font-semibold">{analyticsData.totalClicks}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LinkAnalyticsModal;
// src/components/admin/AnalyticsModal.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  XCircle, 
  Users, 
  Link2, 
  MousePointer,
  Calendar,
  Globe,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';

const AnalyticsModal = ({ isOpen, onClose, platformStats }) => {
  if (!isOpen) return null;

  const weeklyGrowth = platformStats.totalUsers > 0 ? ((platformStats.recentSignups / platformStats.totalUsers) * 100).toFixed(1) : 0;
  const avgLinksPerUser = platformStats.totalUsers > 0 ? (platformStats.totalLinks / platformStats.totalUsers).toFixed(1) : 0;
  const clickThroughRate = platformStats.totalLinks > 0 ? ((platformStats.totalClicks / platformStats.totalLinks) * 100).toFixed(1) : 0;
  const userEngagementRate = platformStats.totalUsers > 0 ? ((platformStats.activeUsers / platformStats.totalUsers) * 100).toFixed(1) : 0;

  const handleExportAnalytics = () => {
    const analyticsData = {
      'Platform Statistics': {
        'Total Users': platformStats.totalUsers,
        'Active Users': platformStats.activeUsers,
        'Banned Users': platformStats.bannedUsers,
        'Admin Users': platformStats.adminUsers,
        'Total Links': platformStats.totalLinks,
        'Total Clicks': platformStats.totalClicks,
        'Recent Signups (7 days)': platformStats.recentSignups
      },
      'Calculated Metrics': {
        'Weekly Growth Rate': `${weeklyGrowth}%`,
        'Average Links per User': avgLinksPerUser,
        'Click Through Rate': `${clickThroughRate}%`,
        'User Engagement Rate': `${userEngagementRate}%`,
        'Average Clicks per Link': platformStats.avgClicksPerLink
      }
    };
    
    const csvContent = [
      'Metric,Value',
      ...Object.entries(analyticsData['Platform Statistics']).map(([key, value]) => `${key},${value}`),
      '',
      'Calculated Metrics,',
      ...Object.entries(analyticsData['Calculated Metrics']).map(([key, value]) => `${key},${value}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Platform Analytics
          </h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportAnalytics}
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onClose}
              className="bg-transparent hover:bg-white/10 p-2"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </Button>
          </div>
        </div>
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="text-white font-semibold">User Growth</h4>
                <p className="text-blue-300 text-2xl font-bold">+{weeklyGrowth}%</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Weekly growth rate</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Link2 className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="text-white font-semibold">Avg Links/User</h4>
                <p className="text-green-300 text-2xl font-bold">{avgLinksPerUser}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Links per user average</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <MousePointer className="w-8 h-8 text-purple-400" />
              <div>
                <h4 className="text-white font-semibold">Click Rate</h4>
                <p className="text-purple-300 text-2xl font-bold">{clickThroughRate}%</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Click-through rate</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-8 h-8 text-orange-400" />
              <div>
                <h4 className="text-white font-semibold">Engagement</h4>
                <p className="text-orange-300 text-2xl font-bold">{userEngagementRate}%</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">User engagement rate</p>
          </div>
        </div>
        
        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              User Status Distribution
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Active Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: `${(platformStats.activeUsers / platformStats.totalUsers) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-green-400 font-semibold min-w-[3rem] text-right">
                    {platformStats.activeUsers}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Banned Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{width: `${(platformStats.bannedUsers / platformStats.totalUsers) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-red-400 font-semibold min-w-[3rem] text-right">
                    {platformStats.bannedUsers}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Admin Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{width: `${(platformStats.adminUsers / platformStats.totalUsers) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-yellow-400 font-semibold min-w-[3rem] text-right">
                    {platformStats.adminUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Platform Activity
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Links</span>
                <span className="text-blue-400 font-semibold">{platformStats.totalLinks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Clicks</span>
                <span className="text-purple-400 font-semibold">{platformStats.totalClicks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg Clicks/Link</span>
                <span className="text-green-400 font-semibold">{platformStats.avgClicksPerLink}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">New Users (7 days)</span>
                <span className="text-cyan-400 font-semibold">{platformStats.recentSignups}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Insights */}
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-6 rounded-xl border border-violet-500/20">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            Performance Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-violet-300 font-medium mb-2">Growth Trends</h5>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Weekly user growth: {weeklyGrowth}%</li>
                <li>• User engagement rate: {userEngagementRate}%</li>
                <li>• Active user ratio: {((platformStats.activeUsers / platformStats.totalUsers) * 100).toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <h5 className="text-violet-300 font-medium mb-2">Link Performance</h5>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Average links per user: {avgLinksPerUser}</li>
                <li>• Click-through rate: {clickThroughRate}%</li>
                <li>• Total platform clicks: {platformStats.totalClicks.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;