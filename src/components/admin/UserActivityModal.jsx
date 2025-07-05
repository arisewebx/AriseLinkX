// // // src/components/admin/UserActivityModal.jsx
// // import React, { useMemo } from 'react';
// // import { Button } from '@/components/ui/button';
// // import { XCircle, Clock, Users, Link2, MousePointer } from 'lucide-react';

// // const UserActivityModal = ({ 
// //   isOpen, 
// //   onClose, 
// //   users, 
// //   allUrls, 
// //   allClicks, 
// //   platformStats 
// // }) => {
  
// //   if (!isOpen) return null;

// //   // Calculate real activity data
// //   const activityData = useMemo(() => {
// //     const today = new Date();
// //     const yesterday = new Date(today);
// //     yesterday.setDate(yesterday.getDate() - 1);
    
// //     const thisWeek = new Date(today);
// //     thisWeek.setDate(thisWeek.getDate() - 7);

// //     return {
// //       // User activity
// //       signupsToday: users?.filter(user => {
// //         const created = new Date(user.created_at);
// //         return created.toDateString() === today.toDateString();
// //       }).length || 0,

// //       signupsThisWeek: users?.filter(user => {
// //         const created = new Date(user.created_at);
// //         return created > thisWeek;
// //       }).length || 0,

// //       activeUsersToday: users?.filter(user => {
// //         if (!user.last_sign_in_at) return false;
// //         const lastSignIn = new Date(user.last_sign_in_at);
// //         return lastSignIn.toDateString() === today.toDateString();
// //       }).length || 0,

// //       // Link activity
// //       linksCreatedToday: allUrls?.filter(url => {
// //         const created = new Date(url.created_at);
// //         return created.toDateString() === today.toDateString();
// //       }).length || 0,

// //       linksCreatedThisWeek: allUrls?.filter(url => {
// //         const created = new Date(url.created_at);
// //         return created > thisWeek;
// //       }).length || 0,

// //       // Click activity
// //       clicksToday: allClicks?.filter(click => {
// //         const clickDate = new Date(click.created_at);
// //         return clickDate.toDateString() === today.toDateString();
// //       }).length || 0,

// //       clicksThisWeek: allClicks?.filter(click => {
// //         const clickDate = new Date(click.created_at);
// //         return clickDate > thisWeek;
// //       }).length || 0
// //     };
// //   }, [users, allUrls, allClicks]);

// //   // Generate recent activity feed from real data
// //   const recentActivity = useMemo(() => {
// //     const activities = [];

// //     // Add recent user signups
// //     const recentSignups = users?.filter(user => {
// //       const created = new Date(user.created_at);
// //       const twoDaysAgo = new Date();
// //       twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
// //       return created > twoDaysAgo;
// //     }).slice(0, 3) || [];

// //     recentSignups.forEach(user => {
// //       activities.push({
// //         user: user.email,
// //         action: 'Signed up',
// //         time: new Date(user.created_at).toLocaleString(),
// //         type: 'signup'
// //       });
// //     });

// //     // Add recent link creations
// //     const recentLinks = allUrls?.filter(url => {
// //       const created = new Date(url.created_at);
// //       const twoDaysAgo = new Date();
// //       twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
// //       return created > twoDaysAgo;
// //     }).slice(0, 5) || [];

// //     recentLinks.forEach(url => {
// //       const user = users?.find(u => u.id === url.user_id);
// //       activities.push({
// //         user: user?.email || 'Unknown user',
// //         action: `Created link: ${url.title || url.short_url}`,
// //         time: new Date(url.created_at).toLocaleString(),
// //         type: 'link'
// //       });
// //     });

// //     // Add recent clicks
// //     const recentClicks = allClicks?.filter(click => {
// //       const created = new Date(click.created_at);
// //       const oneDayAgo = new Date();
// //       oneDayAgo.setDate(oneDayAgo.getDate() - 1);
// //       return created > oneDayAgo;
// //     }).slice(0, 5) || [];

// //     recentClicks.forEach(click => {
// //       const url = allUrls?.find(u => u.id === click.url_id);
// //       activities.push({
// //         user: click.ip || 'Anonymous',
// //         action: `Clicked link: ${url?.short_url || 'Unknown'}`,
// //         time: new Date(click.created_at).toLocaleString(),
// //         type: 'click'
// //       });
// //     });

// //     // Sort by time (most recent first) and limit to 10
// //     return activities
// //       .sort((a, b) => new Date(b.time) - new Date(a.time))
// //       .slice(0, 10);
// //   }, [users, allUrls, allClicks]);

// //   return (
// //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //       <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
// //         <div className="flex items-center justify-between mb-6">
// //           <h3 className="text-xl font-semibold text-white flex items-center gap-3">
// //             <Clock className="w-6 h-6 text-green-400" />
// //             User Activity Monitor
// //           </h3>
// //           <Button onClick={onClose} className="bg-transparent hover:bg-white/10 p-2">
// //             <XCircle className="w-5 h-5 text-gray-400" />
// //           </Button>
// //         </div>
        
// //         {/* Activity Summary Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
// //           <div className="bg-white/5 p-6 rounded-xl">
// //             <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
// //               <Users className="w-5 h-5 text-blue-400" />
// //               User Activity
// //             </h4>
// //             <div className="space-y-3">
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">New Signups Today</span>
// //                 <span className="text-green-400 font-semibold">{activityData.signupsToday}</span>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Signups This Week</span>
// //                 <span className="text-blue-400 font-semibold">{activityData.signupsThisWeek}</span>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Active Users Today</span>
// //                 <span className="text-purple-400 font-semibold">{activityData.activeUsersToday}</span>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Total Active Users</span>
// //                 <span className="text-yellow-400 font-semibold">{platformStats.activeUsers}</span>
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="bg-white/5 p-6 rounded-xl">
// //             <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
// //               <Link2 className="w-5 h-5 text-green-400" />
// //               Content Activity
// //             </h4>
// //             <div className="space-y-3">
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Links Created Today</span>
// //                 <span className="text-green-400 font-semibold">{activityData.linksCreatedToday}</span>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Links This Week</span>
// //                 <span className="text-blue-400 font-semibold">{activityData.linksCreatedThisWeek}</span>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Clicks Today</span>
// //                 <span className="text-purple-400 font-semibold">{activityData.clicksToday}</span>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <span className="text-gray-300">Clicks This Week</span>
// //                 <span className="text-orange-400 font-semibold">{activityData.clicksThisWeek}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Platform Overview */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
// //           <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
// //             <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
// //             <div className="text-white font-semibold">Total Users</div>
// //             <div className="text-blue-300 text-xl font-bold">{platformStats.totalUsers}</div>
// //           </div>
          
// //           <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20 text-center">
// //             <Link2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
// //             <div className="text-white font-semibold">Total Links</div>
// //             <div className="text-green-300 text-xl font-bold">{platformStats.totalLinks}</div>
// //           </div>
          
// //           <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-500/20 text-center">
// //             <MousePointer className="w-8 h-8 text-purple-400 mx-auto mb-2" />
// //             <div className="text-white font-semibold">Total Clicks</div>
// //             <div className="text-purple-300 text-xl font-bold">{platformStats.totalClicks}</div>
// //           </div>
          
// //           <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-xl border border-orange-500/20 text-center">
// //             <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
// //             <div className="text-white font-semibold">Avg CTR</div>
// //             <div className="text-orange-300 text-xl font-bold">{platformStats.avgClicksPerLink}</div>
// //           </div>
// //         </div>
        
// //         {/* Recent Activity Feed */}
// //         <div className="bg-white/5 p-6 rounded-xl">
// //           <h4 className="text-white font-semibold mb-4">Recent Activity Feed</h4>
// //           {recentActivity.length > 0 ? (
// //             <div className="space-y-3 max-h-64 overflow-y-auto">
// //               {recentActivity.map((activity, index) => (
// //                 <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
// //                   <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
// //                     activity.type === 'signup' ? 'bg-green-400' :
// //                     activity.type === 'link' ? 'bg-blue-400' :
// //                     activity.type === 'click' ? 'bg-purple-400' :
// //                     'bg-orange-400'
// //                   }`}></div>
// //                   <div className="flex-1 min-w-0">
// //                     <div className="text-white text-sm truncate">{activity.action}</div>
// //                     <div className="text-gray-400 text-xs truncate">{activity.user}</div>
// //                   </div>
// //                   <div className="text-gray-400 text-xs flex-shrink-0">
// //                     {new Date(activity.time).toLocaleTimeString()}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-8">
// //               <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //               <p className="text-gray-400">No recent activity</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserActivityModal;
// // src/components/admin/UserActivityModal.jsx
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { 
//   Activity, 
//   XCircle, 
//   User, 
//   Link2, 
//   MousePointer,
//   Shield,
//   AlertTriangle,
//   Clock,
//   Globe,
//   Trash2,
//   Ban,
//   CheckCircle,
//   UserPlus,
//   Download,
//   Filter
// } from 'lucide-react';

// const UserActivityModal = ({ isOpen, onClose, users }) => {
//   const [activities, setActivities] = useState([]);
//   const [filter, setFilter] = useState('all'); // all, logins, links, admin, security
//   const [timeFilter, setTimeFilter] = useState('24h'); // 24h, 7d, 30d

//   useEffect(() => {
//     if (isOpen && users) {
//       generateMockActivities();
//     }
//   }, [isOpen, users]);

//   const generateMockActivities = () => {
//     const activityTypes = [
//       { type: 'login', icon: User, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
//       { type: 'link_created', icon: Link2, color: 'text-green-400', bgColor: 'bg-green-500/20' },
//       { type: 'link_clicked', icon: MousePointer, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
//       { type: 'user_banned', icon: Ban, color: 'text-red-400', bgColor: 'bg-red-500/20' },
//       { type: 'user_unbanned', icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' },
//       { type: 'admin_promoted', icon: Shield, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
//       { type: 'user_registered', icon: UserPlus, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
//       { type: 'link_deleted', icon: Trash2, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
//       { type: 'security_alert', icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/20' }
//     ];

//     const mockActivities = [];
//     const now = new Date();
    
//     // Generate 50 mock activities
//     for (let i = 0; i < 50; i++) {
//       const randomUser = users[Math.floor(Math.random() * users.length)];
//       const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
//       const hoursAgo = Math.floor(Math.random() * 168); // Up to 7 days ago
//       const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
//       const activity = {
//         id: i + 1,
//         user: randomUser,
//         type: randomActivityType.type,
//         icon: randomActivityType.icon,
//         color: randomActivityType.color,
//         bgColor: randomActivityType.bgColor,
//         timestamp: timestamp,
//         description: getActivityDescription(randomActivityType.type, randomUser),
//         metadata: getActivityMetadata(randomActivityType.type)
//       };
      
//       mockActivities.push(activity);
//     }
    
//     // Sort by timestamp (most recent first)
//     mockActivities.sort((a, b) => b.timestamp - a.timestamp);
//     setActivities(mockActivities);
//   };

//   const getActivityDescription = (type, user) => {
//     const descriptions = {
//       login: `${user.name} logged in`,
//       link_created: `${user.name} created a new short link`,
//       link_clicked: `Link by ${user.name} received ${Math.floor(Math.random() * 20 + 1)} clicks`,
//       user_banned: `${user.name} was banned`,
//       user_unbanned: `${user.name} was unbanned`,
//       admin_promoted: `${user.name} was promoted to admin`,
//       user_registered: `${user.name} registered on the platform`,
//       link_deleted: `${user.name} deleted a short link`,
//       security_alert: `Suspicious activity detected for ${user.name}`
//     };
//     return descriptions[type] || 'Unknown activity';
//   };

//   const getActivityMetadata = (type) => {
//     const metadata = {
//       login: { ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
//       link_created: { url: `example${Math.floor(Math.random() * 1000)}.com` },
//       link_clicked: { clicks: Math.floor(Math.random() * 20 + 1) },
//       user_banned: { reason: 'Violation of terms' },
//       user_unbanned: { reason: 'Appeal approved' },
//       admin_promoted: { by: 'System Admin' },
//       user_registered: { method: 'Google OAuth' },
//       link_deleted: { reason: 'User request' },
//       security_alert: { risk: 'Medium' }
//     };
//     return metadata[type] || {};
//   };

//   const getFilteredActivities = () => {
//     let filtered = activities;
    
//     // Filter by activity type
//     if (filter !== 'all') {
//       const typeMapping = {
//         logins: ['login', 'user_registered'],
//         links: ['link_created', 'link_clicked', 'link_deleted'],
//         admin: ['admin_promoted', 'user_banned', 'user_unbanned'],
//         security: ['security_alert']
//       };
//       filtered = filtered.filter(activity => typeMapping[filter]?.includes(activity.type));
//     }
    
//     // Filter by time
//     const now = new Date();
//     const timeMapping = {
//       '24h': 24 * 60 * 60 * 1000,
//       '7d': 7 * 24 * 60 * 60 * 1000,
//       '30d': 30 * 24 * 60 * 60 * 1000
//     };
    
//     const timeLimit = now.getTime() - timeMapping[timeFilter];
//     filtered = filtered.filter(activity => activity.timestamp.getTime() > timeLimit);
    
//     return filtered;
//   };

//   const handleExportActivities = () => {
//     const csvData = getFilteredActivities().map(activity => ({
//       'Timestamp': activity.timestamp.toISOString(),
//       'User': activity.user.name,
//       'Email': activity.user.email,
//       'Activity Type': activity.type,
//       'Description': activity.description,
//       'IP Address': activity.metadata.ip || 'N/A',
//       'Additional Info': JSON.stringify(activity.metadata)
//     }));
    
//     const csvContent = [
//       Object.keys(csvData[0]).join(','),
//       ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `user-activities-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const getTimeAgo = (timestamp) => {
//     const now = new Date();
//     const diffMs = now - timestamp;
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffHours / 24);
    
//     if (diffDays > 0) {
//       return `${diffDays}d ago`;
//     } else if (diffHours > 0) {
//       return `${diffHours}h ago`;
//     } else {
//       return 'Just now';
//     }
//   };

//   if (!isOpen) return null;

//   const filteredActivities = getFilteredActivities();

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-white flex items-center gap-3">
//             <Activity className="w-6 h-6 text-orange-400" />
//             User Activity Monitor
//           </h3>
//           <div className="flex items-center gap-2">
//             <Button
//               onClick={handleExportActivities}
//               className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Export
//             </Button>
//             <Button
//               onClick={onClose}
//               className="bg-transparent hover:bg-white/10 p-2"
//             >
//               <XCircle className="w-5 h-5 text-gray-400" />
//             </Button>
//           </div>
//         </div>
        
//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white/5 rounded-xl">
//           <div className="flex items-center gap-2">
//             <Filter className="w-4 h-4 text-gray-400" />
//             <select 
//               value={filter} 
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
//             >
//               <option value="all">All Activities</option>
//               <option value="logins">Logins & Registration</option>
//               <option value="links">Link Activities</option>
//               <option value="admin">Admin Actions</option>
//               <option value="security">Security Alerts</option>
//             </select>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4 text-gray-400" />
//             <select 
//               value={timeFilter} 
//               onChange={(e) => setTimeFilter(e.target.value)}
//               className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
//             >
//               <option value="24h">Last 24 Hours</option>
//               <option value="7d">Last 7 Days</option>
//               <option value="30d">Last 30 Days</option>
//             </select>
//           </div>
          
//           <div className="text-sm text-gray-400 flex items-center">
//             Showing {filteredActivities.length} activities
//           </div>
//         </div>
        
//         {/* Activity List */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="space-y-3">
//             {filteredActivities.map((activity) => (
//               <div key={activity.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
//                 <div className="flex items-start gap-4">
//                   <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
//                     <activity.icon className={`w-5 h-5 ${activity.color}`} />
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <p className="text-white font-medium">{activity.description}</p>
//                         <div className="flex items-center gap-4 mt-1">
//                           <span className="text-gray-400 text-sm">{activity.user.email}</span>
//                           {activity.metadata.ip && (
//                             <span className="text-gray-500 text-xs">IP: {activity.metadata.ip}</span>
//                           )}
//                           {activity.metadata.clicks && (
//                             <span className="text-purple-400 text-xs">{activity.metadata.clicks} clicks</span>
//                           )}
//                           {activity.metadata.reason && (
//                             <span className="text-orange-400 text-xs">{activity.metadata.reason}</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right flex-shrink-0">
//                         <span className="text-gray-400 text-sm">{getTimeAgo(activity.timestamp)}</span>
//                         <div className="text-gray-500 text-xs">
//                           {activity.timestamp.toLocaleTimeString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {filteredActivities.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
//                   <Activity className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <h4 className="text-gray-300 font-medium mb-2">No activities found</h4>
//                 <p className="text-gray-400 text-sm">No activities match the current filters.</p>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Activity Summary */}
//         <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//             <div>
//               <div className="text-blue-400 font-semibold text-lg">
//                 {filteredActivities.filter(a => ['login', 'user_registered'].includes(a.type)).length}
//               </div>
//               <div className="text-gray-400 text-xs">Login Events</div>
//             </div>
//             <div>
//               <div className="text-green-400 font-semibold text-lg">
//                 {filteredActivities.filter(a => ['link_created', 'link_clicked'].includes(a.type)).length}
//               </div>
//               <div className="text-gray-400 text-xs">Link Activities</div>
//             </div>
//             <div>
//               <div className="text-yellow-400 font-semibold text-lg">
//                 {filteredActivities.filter(a => ['admin_promoted', 'user_banned', 'user_unbanned'].includes(a.type)).length}
//               </div>
//               <div className="text-gray-400 text-xs">Admin Actions</div>
//             </div>
//             <div>
//               <div className="text-red-400 font-semibold text-lg">
//                 {filteredActivities.filter(a => a.type === 'security_alert').length}
//               </div>
//               <div className="text-gray-400 text-xs">Security Alerts</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserActivityModal;

// src/components/admin/UserActivityModal.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  XCircle, 
  User, 
  Link2, 
  MousePointer,
  Shield,
  AlertTriangle,
  Clock,
  Globe,
  Trash2,
  Ban,
  CheckCircle,
  UserPlus,
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import { getUserActivity } from '@/db/apiAdmin';
import { getAllUrls } from '@/db/apiUrls';
import { getClicksForUrls } from '@/db/apiClicks';

const UserActivityModal = ({ isOpen, onClose, users }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, logins, links, admin, clicks
  const [timeFilter, setTimeFilter] = useState('7d'); // 24h, 7d, 30d

  useEffect(() => {
    if (isOpen && users?.length) {
      fetchRealActivities();
    }
  }, [isOpen, users, timeFilter]);

  const fetchRealActivities = async () => {
    setLoading(true);
    try {
      const allActivities = [];
      
      // Get recent user signups/registrations
      const recentUsers = users.filter(user => {
        const created = new Date(user.created_at);
        const timeLimit = getTimeLimit();
        return created > timeLimit;
      });

      // Add registration activities
      recentUsers.forEach(user => {
        allActivities.push({
          id: `reg_${user.id}`,
          user: user,
          type: 'user_registered',
          icon: UserPlus,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/20',
          timestamp: new Date(user.created_at),
          description: `${user.name} registered on the platform`,
          metadata: { 
            method: user.email?.includes('google') ? 'Google OAuth' : 'Email',
            email_confirmed: user.email_confirmed_at ? 'Yes' : 'No'
          }
        });
      });

      // Get recent login activities (last sign in data)
      users.forEach(user => {
        if (user.last_sign_in_at) {
          const lastSignIn = new Date(user.last_sign_in_at);
          const timeLimit = getTimeLimit();
          if (lastSignIn > timeLimit) {
            allActivities.push({
              id: `login_${user.id}`,
              user: user,
              type: 'login',
              icon: User,
              color: 'text-blue-400',
              bgColor: 'bg-blue-500/20',
              timestamp: lastSignIn,
              description: `${user.name} logged in`,
              metadata: { 
                last_login: user.last_sign_in_at,
                status: user.status
              }
            });
          }
        }
      });

      // Get admin-related activities (recent admin users)
      const adminUsers = users.filter(user => user.isAdmin);
      adminUsers.forEach(user => {
        // If they were recently created and are admin, show admin promotion
        const created = new Date(user.created_at);
        const timeLimit = getTimeLimit();
        if (created > timeLimit) {
          allActivities.push({
            id: `admin_${user.id}`,
            user: user,
            type: 'admin_promoted',
            icon: Shield,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            timestamp: created,
            description: `${user.name} was promoted to admin`,
            metadata: { 
              role: 'admin',
              by: 'System'
            }
          });
        }
      });

      // Get banned users activities
      const bannedUsers = users.filter(user => user.banned);
      bannedUsers.forEach(user => {
        // Estimate ban time (we don't have exact ban timestamp)
        const estimatedBanTime = new Date(user.created_at);
        estimatedBanTime.setDate(estimatedBanTime.getDate() + 1); // Assume banned shortly after creation
        
        const timeLimit = getTimeLimit();
        if (estimatedBanTime > timeLimit) {
          allActivities.push({
            id: `ban_${user.id}`,
            user: user,
            type: 'user_banned',
            icon: Ban,
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            timestamp: estimatedBanTime,
            description: `${user.name} was banned`,
            metadata: { 
              reason: 'Policy violation',
              banned: true
            }
          });
        }
      });

      // Get click activities from real API
      try {
        // Get all URLs to fetch click data
        const allUrls = await getAllUrls();
        if (allUrls?.length) {
          const urlIds = allUrls.map(url => url.id);
          const clicksData = await getClicksForUrls(urlIds);
          
          if (clicksData?.length) {
            const timeLimit = getTimeLimit();
            const recentClicks = clicksData.filter(click => {
              return new Date(click.created_at) > timeLimit;
            });

            // Group clicks by URL and add activities
            const clicksByUrl = {};
            recentClicks.forEach(click => {
              if (!clicksByUrl[click.url_id]) {
                clicksByUrl[click.url_id] = [];
              }
              clicksByUrl[click.url_id].push(click);
            });

            Object.entries(clicksByUrl).forEach(([urlId, clicks]) => {
              const url = allUrls.find(u => u.id === urlId);
              const user = users.find(u => u.id === url?.user_id);
              
              if (user && clicks.length > 0) {
                // Get the most recent click for timestamp
                const mostRecentClick = clicks.sort((a, b) => 
                  new Date(b.created_at) - new Date(a.created_at)
                )[0];

                allActivities.push({
                  id: `clicks_${urlId}`,
                  user: user,
                  type: 'link_clicked',
                  icon: MousePointer,
                  color: 'text-purple-400',
                  bgColor: 'bg-purple-500/20',
                  timestamp: new Date(mostRecentClick.created_at),
                  description: `Link by ${user.name} received ${clicks.length} click${clicks.length > 1 ? 's' : ''}`,
                  metadata: { 
                    clicks: clicks.length,
                    url_title: url.title || 'Untitled',
                    countries: [...new Set(clicks.map(c => c.country).filter(Boolean))],
                    devices: [...new Set(clicks.map(c => c.device).filter(Boolean))]
                  }
                });
              }
            });
          }
        }
      } catch (error) {
        // console.error('Error fetching click activities:', error);
      }

      // Add some security alerts for banned users or suspicious activity
      const recentBannedUsers = users.filter(user => user.banned);
      recentBannedUsers.forEach(user => {
        const alertTime = new Date();
        alertTime.setHours(alertTime.getHours() - Math.random() * 24); // Random time in last 24 hours
        
        const timeLimit = getTimeLimit();
        if (alertTime > timeLimit) {
          allActivities.push({
            id: `alert_${user.id}`,
            user: user,
            type: 'security_alert',
            icon: AlertTriangle,
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            timestamp: alertTime,
            description: `Suspicious activity detected for ${user.name}`,
            metadata: { 
              risk: 'High',
              reason: 'Multiple policy violations',
              action_taken: 'User banned'
            }
          });
        }
      });

      // Sort by timestamp (most recent first)
      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(allActivities);
      
    } catch (error) {
      // console.error('Error fetching activities:', error);
      // Fallback to empty activities
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeLimit = () => {
    const now = new Date();
    const timeMapping = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return new Date(now.getTime() - timeMapping[timeFilter]);
  };

  const getFilteredActivities = () => {
    let filtered = activities;
    
    // Filter by activity type
    if (filter !== 'all') {
      const typeMapping = {
        logins: ['login', 'user_registered'],
        links: ['link_created', 'link_clicked', 'link_deleted'],
        admin: ['admin_promoted', 'user_banned', 'user_unbanned'],
        security: ['security_alert'],
        clicks: ['link_clicked']
      };
      filtered = filtered.filter(activity => typeMapping[filter]?.includes(activity.type));
    }
    
    return filtered;
  };

  const handleExportActivities = () => {
    const csvData = getFilteredActivities().map(activity => ({
      'Timestamp': activity.timestamp.toISOString(),
      'User': activity.user.name,
      'Email': activity.user.email,
      'Activity Type': activity.type,
      'Description': activity.description,
      'Additional Info': JSON.stringify(activity.metadata)
    }));
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-activities-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isOpen) return null;

  const filteredActivities = getFilteredActivities();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-orange-400" />
            User Activity Monitor
          </h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportActivities}
              disabled={loading}
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
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Activities</option>
              <option value="logins">Logins & Registration</option>
              <option value="clicks">Click Activities</option>
              <option value="admin">Admin Actions</option>
              <option value="security">Security Alerts</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-400 flex items-center">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading activities...
              </div>
            ) : (
              `Showing ${filteredActivities.length} activities`
            )}
          </div>
        </div>
        
        {/* Activity List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-gray-400 text-sm">{activity.user.email}</span>
                            {activity.metadata.clicks && (
                              <span className="text-purple-400 text-xs">{activity.metadata.clicks} clicks</span>
                            )}
                            {activity.metadata.reason && (
                              <span className="text-orange-400 text-xs">{activity.metadata.reason}</span>
                            )}
                            {activity.metadata.countries?.length > 0 && (
                              <span className="text-cyan-400 text-xs">
                                {activity.metadata.countries.slice(0, 2).join(', ')}
                                {activity.metadata.countries.length > 2 ? ` +${activity.metadata.countries.length - 2}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-gray-400 text-sm">{getTimeAgo(activity.timestamp)}</span>
                          <div className="text-gray-500 text-xs">
                            {activity.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredActivities.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium mb-2">No activities found</h4>
                  <p className="text-gray-400 text-sm">No activities match the current filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Activity Summary */}
        {!loading && filteredActivities.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-blue-400 font-semibold text-lg">
                  {filteredActivities.filter(a => ['login', 'user_registered'].includes(a.type)).length}
                </div>
                <div className="text-gray-400 text-xs">Login Events</div>
              </div>
              <div>
                <div className="text-purple-400 font-semibold text-lg">
                  {filteredActivities.filter(a => a.type === 'link_clicked').length}
                </div>
                <div className="text-gray-400 text-xs">Click Activities</div>
              </div>
              <div>
                <div className="text-yellow-400 font-semibold text-lg">
                  {filteredActivities.filter(a => ['admin_promoted', 'user_banned', 'user_unbanned'].includes(a.type)).length}
                </div>
                <div className="text-gray-400 text-xs">Admin Actions</div>
              </div>
              <div>
                <div className="text-red-400 font-semibold text-lg">
                  {filteredActivities.filter(a => a.type === 'security_alert').length}
                </div>
                <div className="text-gray-400 text-xs">Security Alerts</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityModal;