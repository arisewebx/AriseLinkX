// // // src/pages/admin/dashboard.jsx
// // import React, { useEffect, useState } from 'react';
// // import { BarLoader } from 'react-spinners';
// // import { 
// //   Users, 
// //   Link2, 
// //   MousePointer, 
// //   Crown,
// //   Shield, 
// //   Search,
// //   Filter,
// //   User
// // } from 'lucide-react';
// // import { Input } from '@/components/ui/input';
// // import Error from '@/components/error';
// // import useFetch from '@/hooks/use-fetch';
// // import { UrlState } from '@/context';
// // import { getAllUsers } from '@/db/apiAdmin';
// // import { getUrls } from '@/db/apiUrls';
// // import { getClicksForUrls } from '@/db/apiClicks';

// // // Import separated components
// // import UserDetailsModal from '@/components/admin/UserDetailsModal';
// // import QuickActionsSection from '@/components/admin/QuickActionsSection';
// // import BulkActionsModal from '@/components/admin/BulkActionsModal';
// // import AnalyticsModal from '@/components/admin/LinkAnalyticsModal';
// // import UserActivityModal from '@/components/admin/UserActivityModal';
// // import UserStatsCard from '@/components/admin/UserStatsCard';
// // import UserTableRow from '@/components/admin/UserTableRow';

// // const AdminDashboard = () => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [userFilter, setUserFilter] = useState("all"); // all, active, banned, admin
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [showUserModal, setShowUserModal] = useState(false);
  
// //   // Modal states
// //   const [selectedUsers, setSelectedUsers] = useState([]);
// //   const [showBulkModal, setShowBulkModal] = useState(false);
// //   const [showUserActivity, setShowUserActivity] = useState(false);
// //   const [showAnalytics, setShowAnalytics] = useState(false);

// //   const { user: currentUser } = UrlState();
  
// //   // Fetch all users
// //   const { loading: usersLoading, error: usersError, data: users, fn: fnUsers } = useFetch(getAllUsers);
  
// //   // Fetch all URLs for platform stats
// //   const { loading: urlsLoading, data: allUrls, fn: fnUrls } = useFetch(getUrls);
  
// //   // Fetch all clicks for platform stats
// //   const { loading: clicksLoading, data: allClicks, fn: fnClicks } = useFetch(getClicksForUrls);

// //   useEffect(() => {
// //     fnUsers();
// //     fnUrls();
// //   }, []);

// //   useEffect(() => {
// //     if (allUrls?.length) {
// //       const urlIds = allUrls.map(url => url.id);
// //       fnClicks(urlIds);
// //     }
// //   }, [allUrls]);

// //   // Calculate platform statistics
// //   const platformStats = {
// //     totalUsers: users?.length || 0,
// //     activeUsers: users?.filter(u => u.status === 'active' && !u.banned).length || 0,
// //     bannedUsers: users?.filter(u => u.banned).length || 0,
// //     adminUsers: users?.filter(u => u.isAdmin).length || 0,
    
// //     totalLinks: users?.reduce((total, user) => {
// //       return total + (user.linksCount || user.links_count || 0);
// //     }, 0) || 0,
    
// //     totalClicks: users?.reduce((total, user) => {
// //       return total + (user.totalClicks || user.total_clicks || 0);
// //     }, 0) || 0,
    
// //     avgClicksPerLink: (() => {
// //       const totalLinks = users?.reduce((total, user) => total + (user.linksCount || user.links_count || 0), 0) || 0;
// //       const totalClicks = users?.reduce((total, user) => total + (user.totalClicks || user.total_clicks || 0), 0) || 0;
// //       return totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;
// //     })(),
    
// //     recentSignups: users?.filter(u => {
// //       const created = new Date(u.created_at);
// //       const weekAgo = new Date();
// //       weekAgo.setDate(weekAgo.getDate() - 7);
// //       return created > weekAgo;
// //     }).length || 0
// //   };

// //   // Filter users based on search and status
// //   const filteredUsers = users?.filter(user => {
// //     const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
// //     const matchesFilter = userFilter === "all" || 
// //                          (userFilter === "active" && user.status === 'active' && !user.banned) ||
// //                          (userFilter === "banned" && user.banned) ||
// //                          (userFilter === "admin" && user.isAdmin);
// //     return matchesSearch && matchesFilter;
// //   }) || [];

// //   // Event handlers
// //   const handleUserClick = (user) => {
// //     console.log('Clicked user object:', user);
// //     console.log('User ID to pass:', user.id);
// //     setSelectedUser(user);
// //     setShowUserModal(true);
// //   };

// //   const handleUserUpdate = () => {
// //     fnUsers(); // Refresh users list
// //   };

// //   const handleExportUsers = () => {
// //     if (!users?.length) return;
    
// //     const csvData = users.map(user => ({
// //       Email: user.email,
// //       Name: user.name,
// //       Status: user.status,
// //       Banned: user.banned ? 'Yes' : 'No',
// //       Admin: user.isAdmin ? 'Yes' : 'No',
// //       'Links Count': user.linksCount,
// //       'Total Clicks': user.totalClicks,
// //       'Joined Date': new Date(user.created_at).toLocaleDateString(),
// //       'Last Sign In': user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'
// //     }));
    
// //     const csvContent = [
// //       Object.keys(csvData[0]).join(','),
// //       ...csvData.map(row => Object.values(row).join(','))
// //     ].join('\n');
    
// //     const blob = new Blob([csvContent], { type: 'text/csv' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   const handleUserSelect = (userId) => {
// //     setSelectedUsers(prev => 
// //       prev.includes(userId) 
// //         ? prev.filter(id => id !== userId)
// //         : [...prev, userId]
// //     );
// //   };

// //   const handleSelectAll = () => {
// //     if (selectedUsers.length === filteredUsers.length) {
// //       setSelectedUsers([]);
// //     } else {
// //       setSelectedUsers(filteredUsers.map(user => user.id));
// //     }
// //   };

// //   const handleBulkBan = async () => {
// //     console.log('Banning users:', selectedUsers);
// //     alert(`Banning ${selectedUsers.length} users...`);
// //     setSelectedUsers([]);
// //     setShowBulkModal(false);
// //     // Add your API call here
// //   };

// //   const handleBulkUnban = async () => {
// //     console.log('Unbanning users:', selectedUsers);
// //     alert(`Unbanning ${selectedUsers.length} users...`);
// //     setSelectedUsers([]);
// //     setShowBulkModal(false);
// //     // Add your API call here
// //   };

// //   const handleBulkDelete = async () => {
// //     if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
// //       console.log('Deleting users:', selectedUsers);
// //       alert(`Deleting ${selectedUsers.length} users...`);
// //       setSelectedUsers([]);
// //       setShowBulkModal(false);
// //       // Add your API call here
// //     }
// //   };

// //   // Stats data for cards
// //   const statsData = [
// //     {
// //       title: "Total Users",
// //       value: platformStats.totalUsers,
// //       subtitle: `${platformStats.recentSignups} new this week`,
// //       icon: Users,
// //       color: "from-blue-500 to-cyan-500",
// //       bgColor: "from-blue-500/20 to-cyan-500/20"
// //     },
// //     {
// //       title: "Platform Links",
// //       value: platformStats.totalLinks,
// //       subtitle: `Avg ${platformStats.avgClicksPerLink} clicks/link`,
// //       icon: Link2,
// //       color: "from-purple-500 to-pink-500",
// //       bgColor: "from-purple-500/20 to-pink-500/20"
// //     },
// //     {
// //       title: "Total Clicks",
// //       value: platformStats.totalClicks.toLocaleString(),
// //       subtitle: "Platform-wide engagement",
// //       icon: MousePointer,
// //       color: "from-green-500 to-emerald-500",
// //       bgColor: "from-green-500/20 to-emerald-500/20"
// //     },
// //     {
// //       title: "Admin Users",
// //       value: platformStats.adminUsers,
// //       subtitle: `${platformStats.bannedUsers} banned users`,
// //       icon: Crown,
// //       color: "from-yellow-500 to-orange-500",
// //       bgColor: "from-yellow-500/20 to-orange-500/20"
// //     }
// //   ];

// //   return (
// //     <div className="min-h-screen p-6 space-y-8">
// //       {/* Loading Bar */}
// //       {(usersLoading || urlsLoading || clicksLoading) && (
// //         <div className="relative">
// //           <BarLoader 
// //             width="100%" 
// //             color="#ef4444" 
// //             height={3}
// //             className="rounded-full"
// //           />
// //           <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50 animate-pulse"></div>
// //         </div>
// //       )}

// //       {/* Header Section */}
// //       <div className="relative">
// //         <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
// //         <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
// //           <div className="flex items-center gap-4 mb-6">
// //             <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
// //               <Shield className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-3xl md:text-4xl font-extrabold text-white">
// //                 Admin Dashboard
// //               </h1>
// //               <p className="text-gray-300 text-lg">
// //                 Manage users, monitor links, and oversee platform activity
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         {statsData.map((stat, index) => (
// //           <UserStatsCard key={index} stat={stat} index={index} />
// //         ))}
// //       </div>

// //       {/* Quick Actions Section */}
// //       <QuickActionsSection 
// //         onExportUsers={handleExportUsers}
// //         onBulkActions={() => setShowBulkModal(true)}
// //         onUserActivity={() => setShowUserActivity(true)}
// //         onAnalytics={() => setShowAnalytics(true)}
// //       />

// //       {/* Users Management Section */}
// //       <div className="space-y-6">
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //           <div className="flex items-center gap-3">
// //             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
// //               <Users className="w-4 h-4 text-white" />
// //             </div>
// //             <h2 className="text-2xl md:text-3xl font-bold text-white">Users</h2>
// //             <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-white/10">
// //               <span className="text-sm text-gray-300">{filteredUsers.length} users</span>
// //             </div>
// //           </div>
          
// //           <div className="flex gap-2">
// //             <select 
// //               value={userFilter} 
// //               onChange={(e) => setUserFilter(e.target.value)}
// //               className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
// //             >
// //               <option value="all">All Users</option>
// //               <option value="active">Active</option>
// //               <option value="banned">Banned</option>
// //               <option value="admin">Admins</option>
// //             </select>
// //           </div>
// //         </div>

// //         {/* Search Filter */}
// //         <div className="relative max-w-md">
// //           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-sm"></div>
// //           <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1">
// //             <div className="relative">
// //               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //               <Input
// //                 type="text"
// //                 placeholder="Search users..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 className="pl-12 pr-12 py-3 bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
// //               />
// //               <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Error Display */}
// //         {usersError && (
// //           <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
// //             <Error message={usersError?.message} />
// //           </div>
// //         )}

// //         {/* Users Table */}
// //         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-white/5">
// //                 <tr>
// //                   <th className="text-left p-4 text-gray-300 font-medium">
// //                     <input
// //                       type="checkbox"
// //                       checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
// //                       onChange={handleSelectAll}
// //                       className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
// //                     />
// //                   </th>
// //                   <th className="text-left p-4 text-gray-300 font-medium">User</th>
// //                   <th className="text-left p-4 text-gray-300 font-medium">Status</th>
// //                   <th className="text-left p-4 text-gray-300 font-medium">Links</th>
// //                   <th className="text-left p-4 text-gray-300 font-medium">Clicks</th>
// //                   <th className="text-left p-4 text-gray-300 font-medium">Joined</th>
// //                   <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredUsers.map((user) => (
// //                   <UserTableRow
// //                     key={user.id}
// //                     user={user}
// //                     isSelected={selectedUsers.includes(user.id)}
// //                     onSelect={handleUserSelect}
// //                     onUserClick={handleUserClick}
// //                   />
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
          
// //           {filteredUsers.length === 0 && !usersLoading && (
// //             <div className="text-center py-16">
// //               <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
// //                 <Users className="w-10 h-10 text-gray-400" />
// //               </div>
// //               <h3 className="text-xl font-semibold text-gray-300 mb-2">
// //                 {searchQuery ? 'No users found' : 'No users yet'}
// //               </h3>
// //               <p className="text-gray-400 mb-6">
// //                 {searchQuery 
// //                   ? `No users match "${searchQuery}". Try a different search term.`
// //                   : 'No users have signed up yet.'
// //                 }
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modals */}
// //       <UserDetailsModal 
// //         isOpen={showUserModal}
// //         onClose={() => setShowUserModal(false)}
// //         userId={selectedUser?.id}
// //         onUserUpdate={handleUserUpdate}
// //       />

// //       <BulkActionsModal 
// //         isOpen={showBulkModal}
// //         onClose={() => setShowBulkModal(false)}
// //         selectedUsers={selectedUsers}
// //         filteredUsers={filteredUsers}
// //         onSelectAll={handleSelectAll}
// //         onBulkBan={handleBulkBan}
// //         onBulkUnban={handleBulkUnban}
// //         onBulkDelete={handleBulkDelete}
// //       />

// //       <UserActivityModal 
// //         isOpen={showUserActivity}
// //         onClose={() => setShowUserActivity(false)}
// //         users={users}
// //       />

// //       <AnalyticsModal 
// //         isOpen={showAnalytics}
// //         onClose={() => setShowAnalytics(false)}
// //         platformStats={platformStats}
// //       />
// //     </div>
// //   );
// // };

// // export default AdminDashboard;
// // src/pages/admin/dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { BarLoader } from 'react-spinners';
// import { 
//   Users, 
//   Link2, 
//   MousePointer, 
//   Crown,
//   Shield, 
//   Search,
//   Filter,
//   User
// } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import Error from '@/components/error';
// import useFetch from '@/hooks/use-fetch';
// import { UrlState } from '@/context';
// import { getAllUsers } from '@/db/apiAdmin';
// import { getUrls } from '@/db/apiUrls';
// import { getClicksForUrls } from '@/db/apiClicks';

// // Import separated components
// import UserDetailsModal from '@/components/admin/UserDetailsModal';
// import QuickActionsSection from '@/components/admin/QuickActionsSection';
// import BulkActionsModal from '@/components/admin/BulkActionsModal';
// import AnalyticsModal from '@/components/admin/LinkAnalyticsModal';
// import UserActivityModal from '@/components/admin/UserActivityModal';
// import UserStatsCard from '@/components/admin/UserStatsCard';
// import UserTableRow from '@/components/admin/UserTableRow';

// const AdminDashboard = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userFilter, setUserFilter] = useState("all"); // all, active, banned, admin
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
  
//   // Modal states
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showUserActivity, setShowUserActivity] = useState(false);
//   const [showAnalytics, setShowAnalytics] = useState(false);

//   const { user: currentUser } = UrlState();
  
//   // Fetch all users
//   const { loading: usersLoading, error: usersError, data: users, fn: fnUsers } = useFetch(getAllUsers);
  
//   // Fetch all URLs for platform stats
//   const { loading: urlsLoading, data: allUrls, fn: fnUrls } = useFetch(getUrls);
  
//   // Fetch all clicks for platform stats
//   const { loading: clicksLoading, data: allClicks, fn: fnClicks } = useFetch(getClicksForUrls);

//   useEffect(() => {
//     fnUsers();
//     fnUrls();
//   }, []);

//   useEffect(() => {
//     if (allUrls?.length) {
//       const urlIds = allUrls.map(url => url.id);
//       fnClicks(urlIds);
//     }
//   }, [allUrls]);

//   // Calculate platform statistics
//   const platformStats = {
//     totalUsers: users?.length || 0,
//     activeUsers: users?.filter(u => u.status === 'active' && !u.banned).length || 0,
//     bannedUsers: users?.filter(u => u.banned).length || 0,
//     adminUsers: users?.filter(u => u.isAdmin).length || 0,
    
//     totalLinks: users?.reduce((total, user) => {
//       return total + (user.linksCount || user.links_count || 0);
//     }, 0) || 0,
    
//     totalClicks: users?.reduce((total, user) => {
//       return total + (user.totalClicks || user.total_clicks || 0);
//     }, 0) || 0,
    
//     avgClicksPerLink: (() => {
//       const totalLinks = users?.reduce((total, user) => total + (user.linksCount || user.links_count || 0), 0) || 0;
//       const totalClicks = users?.reduce((total, user) => total + (user.totalClicks || user.total_clicks || 0), 0) || 0;
//       return totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;
//     })(),
    
//     recentSignups: users?.filter(u => {
//       const created = new Date(u.created_at);
//       const weekAgo = new Date();
//       weekAgo.setDate(weekAgo.getDate() - 7);
//       return created > weekAgo;
//     }).length || 0
//   };

//   // Filter users based on search and status
//   const filteredUsers = users?.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = userFilter === "all" || 
//                          (userFilter === "active" && user.status === 'active' && !user.banned) ||
//                          (userFilter === "banned" && user.banned) ||
//                          (userFilter === "admin" && user.isAdmin);
//     return matchesSearch && matchesFilter;
//   }) || [];

//   // Event handlers
//   const handleUserClick = (user) => {
//     console.log('Clicked user object:', user);
//     console.log('User ID to pass:', user.id);
//     setSelectedUser(user);
//     setShowUserModal(true);
//   };

//   const handleUserUpdate = () => {
//     fnUsers(); // Refresh users list
//   };

//   const handleExportUsers = () => {
//     if (!users?.length) return;
    
//     const csvData = users.map(user => ({
//       Email: user.email,
//       Name: user.name,
//       Status: user.status,
//       Banned: user.banned ? 'Yes' : 'No',
//       Admin: user.isAdmin ? 'Yes' : 'No',
//       'Links Count': user.linksCount,
//       'Total Clicks': user.totalClicks,
//       'Joined Date': new Date(user.created_at).toLocaleDateString(),
//       'Last Sign In': user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'
//     }));
    
//     const csvContent = [
//       Object.keys(csvData[0]).join(','),
//       ...csvData.map(row => Object.values(row).join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleUserSelect = (userId) => {
//     setSelectedUsers(prev => 
//       prev.includes(userId) 
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedUsers.length === filteredUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(filteredUsers.map(user => user.id));
//     }
//   };

//   // Bulk action handlers are now inside BulkActionsModal component

//   // Stats data for cards
//   const statsData = [
//     {
//       title: "Total Users",
//       value: platformStats.totalUsers,
//       subtitle: `${platformStats.recentSignups} new this week`,
//       icon: Users,
//       color: "from-blue-500 to-cyan-500",
//       bgColor: "from-blue-500/20 to-cyan-500/20"
//     },
//     {
//       title: "Platform Links",
//       value: platformStats.totalLinks,
//       subtitle: `Avg ${platformStats.avgClicksPerLink} clicks/link`,
//       icon: Link2,
//       color: "from-purple-500 to-pink-500",
//       bgColor: "from-purple-500/20 to-pink-500/20"
//     },
//     {
//       title: "Total Clicks",
//       value: platformStats.totalClicks.toLocaleString(),
//       subtitle: "Platform-wide engagement",
//       icon: MousePointer,
//       color: "from-green-500 to-emerald-500",
//       bgColor: "from-green-500/20 to-emerald-500/20"
//     },
//     {
//       title: "Admin Users",
//       value: platformStats.adminUsers,
//       subtitle: `${platformStats.bannedUsers} banned users`,
//       icon: Crown,
//       color: "from-yellow-500 to-orange-500",
//       bgColor: "from-yellow-500/20 to-orange-500/20"
//     }
//   ];

//   return (
//     <div className="min-h-screen p-6 space-y-8">
//       {/* Loading Bar */}
//       {(usersLoading || urlsLoading || clicksLoading) && (
//         <div className="relative">
//           <BarLoader 
//             width="100%" 
//             color="#ef4444" 
//             height={3}
//             className="rounded-full"
//           />
//           <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50 animate-pulse"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
//         <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
//               <Shield className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl md:text-4xl font-extrabold text-white">
//                 Admin Dashboard
//               </h1>
//               <p className="text-gray-300 text-lg">
//                 Manage users, monitor links, and oversee platform activity
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsData.map((stat, index) => (
//           <UserStatsCard key={index} stat={stat} index={index} />
//         ))}
//       </div>

//       {/* Quick Actions Section */}
//       <QuickActionsSection 
//         onExportUsers={handleExportUsers}
//         onBulkActions={() => setShowBulkModal(true)}
//         onUserActivity={() => setShowUserActivity(true)}
//         onAnalytics={() => setShowAnalytics(true)}
//       />

//       {/* Users Management Section */}
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
//               <Users className="w-4 h-4 text-white" />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-bold text-white">Users</h2>
//             <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-white/10">
//               <span className="text-sm text-gray-300">{filteredUsers.length} users</span>
//             </div>
//           </div>
          
//           <div className="flex gap-2">
//             <select 
//               value={userFilter} 
//               onChange={(e) => setUserFilter(e.target.value)}
//               className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
//             >
//               <option value="all">All Users</option>
//               <option value="active">Active</option>
//               <option value="banned">Banned</option>
//               <option value="admin">Admins</option>
//             </select>
//           </div>
//         </div>

//         {/* Search Filter */}
//         <div className="relative max-w-md">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-sm"></div>
//           <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-12 pr-12 py-3 bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
//               />
//               <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {usersError && (
//           <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
//             <Error message={usersError?.message} />
//           </div>
//         )}

//         {/* Users Table */}
//         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-white/5">
//                 <tr>
//                   <th className="text-left p-4 text-gray-300 font-medium">
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
//                       onChange={handleSelectAll}
//                       className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                     />
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-medium">User</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Status</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Links</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Clicks</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Joined</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <UserTableRow
//                     key={user.id}
//                     user={user}
//                     isSelected={selectedUsers.includes(user.id)}
//                     onSelect={handleUserSelect}
//                     onUserClick={handleUserClick}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredUsers.length === 0 && !usersLoading && (
//             <div className="text-center py-16">
//               <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
//                 <Users className="w-10 h-10 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-300 mb-2">
//                 {searchQuery ? 'No users found' : 'No users yet'}
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 {searchQuery 
//                   ? `No users match "${searchQuery}". Try a different search term.`
//                   : 'No users have signed up yet.'
//                 }
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       <UserDetailsModal 
//         isOpen={showUserModal}
//         onClose={() => setShowUserModal(false)}
//         userId={selectedUser?.id}
//         onUserUpdate={handleUserUpdate}
//       />

//       <BulkActionsModal 
//         isOpen={showBulkModal}
//         onClose={() => {
//           setShowBulkModal(false);
//           setSelectedUsers([]); // Clear selections when closing
//         }}
//         selectedUsers={selectedUsers}
//         filteredUsers={filteredUsers}
//         onSelectAll={handleSelectAll}
//         onRefreshUsers={handleUserUpdate} // Use existing refresh function
//         users={users} // Pass users array for email functionality
//       />

//       <UserActivityModal 
//         isOpen={showUserActivity}
//         onClose={() => setShowUserActivity(false)}
//         users={users}
//       />

//       <AnalyticsModal 
//         isOpen={showAnalytics}
//         onClose={() => setShowAnalytics(false)}
//         platformStats={platformStats}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;
// src/pages/admin/dashboard.jsx
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { 
  Users, 
  Link2, 
  MousePointer, 
  Crown,
  Shield, 
  Search,
  Filter,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Error from '@/components/error';
import useFetch from '@/hooks/use-fetch';
import { UrlState } from '@/context';
import { getAllUsers } from '@/db/apiAdmin';
import { getAllUrls } from '@/db/apiUrls'; // FIXED: Changed from getUrls to getAllUrls
import { getClicksForUrls } from '@/db/apiClicks';

// Import separated components
import UserDetailsModal from '@/components/admin/UserDetailsModal';
import QuickActionsSection from '@/components/admin/QuickActionsSection';
import BulkActionsModal from '@/components/admin/BulkActionsModal';
import AnalyticsModal from '@/components/admin/LinkAnalyticsModal'; // FIXED: Correct import path
import UserActivityModal from '@/components/admin/UserActivityModal';
import UserStatsCard from '@/components/admin/UserStatsCard';
import UserTableRow from '@/components/admin/UserTableRow';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all"); // all, active, banned, admin
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Modal states
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showUserActivity, setShowUserActivity] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const { user: currentUser } = UrlState();
  
  // Fetch all users
  const { loading: usersLoading, error: usersError, data: users, fn: fnUsers } = useFetch(getAllUsers);
  
  // Fetch all URLs for platform stats - FIXED: Using getAllUrls instead of getUrls
  const { loading: urlsLoading, data: allUrls, fn: fnUrls } = useFetch(getAllUrls);
  
  // Fetch all clicks for platform stats
  const { loading: clicksLoading, data: allClicks, fn: fnClicks } = useFetch(getClicksForUrls);

  useEffect(() => {
    fnUsers();
    fnUrls(); // Now calls getAllUrls() - no parameters needed!
  }, []);

  useEffect(() => {
    if (allUrls?.length) {
      const urlIds = allUrls.map(url => url.id);
      fnClicks(urlIds);
    }
  }, [allUrls]);

  // Calculate platform statistics
  const platformStats = {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter(u => u.status === 'active' && !u.banned).length || 0,
    bannedUsers: users?.filter(u => u.banned).length || 0,
    adminUsers: users?.filter(u => u.isAdmin).length || 0,
    
    totalLinks: users?.reduce((total, user) => {
      return total + (user.linksCount || user.links_count || 0);
    }, 0) || 0,
    
    totalClicks: users?.reduce((total, user) => {
      return total + (user.totalClicks || user.total_clicks || 0);
    }, 0) || 0,
    
    avgClicksPerLink: (() => {
      const totalLinks = users?.reduce((total, user) => total + (user.linksCount || user.links_count || 0), 0) || 0;
      const totalClicks = users?.reduce((total, user) => total + (user.totalClicks || user.total_clicks || 0), 0) || 0;
      return totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;
    })(),
    
    recentSignups: users?.filter(u => {
      const created = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length || 0
  };

  // Filter users based on search and status
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === "all" || 
                         (userFilter === "active" && user.status === 'active' && !user.banned) ||
                         (userFilter === "banned" && user.banned) ||
                         (userFilter === "admin" && user.isAdmin);
    return matchesSearch && matchesFilter;
  }) || [];

  // Event handlers
  const handleUserClick = (user) => {
    console.log('Clicked user object:', user);
    console.log('User ID to pass:', user.id);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserUpdate = () => {
    fnUsers(); // Refresh users list
  };

  const handleExportUsers = () => {
    if (!users?.length) return;
    
    const csvData = users.map(user => ({
      Email: user.email,
      Name: user.name,
      Status: user.status,
      Banned: user.banned ? 'Yes' : 'No',
      Admin: user.isAdmin ? 'Yes' : 'No',
      'Links Count': user.linksCount,
      'Total Clicks': user.totalClicks,
      'Joined Date': new Date(user.created_at).toLocaleDateString(),
      'Last Sign In': user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'
    }));
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Stats data for cards
  const statsData = [
    {
      title: "Total Users",
      value: platformStats.totalUsers,
      subtitle: `${platformStats.recentSignups} new this week`,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Platform Links",
      value: platformStats.totalLinks,
      subtitle: `Avg ${platformStats.avgClicksPerLink} clicks/link`,
      icon: Link2,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Total Clicks",
      value: platformStats.totalClicks.toLocaleString(),
      subtitle: "Platform-wide engagement",
      icon: MousePointer,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Admin Users",
      value: platformStats.adminUsers,
      subtitle: `${platformStats.bannedUsers} banned users`,
      icon: Crown,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Loading Bar */}
      {(usersLoading || urlsLoading || clicksLoading) && (
        <div className="relative">
          <BarLoader 
            width="100%" 
            color="#ef4444" 
            height={3}
            className="rounded-full"
          />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50 animate-pulse"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Manage users, monitor links, and oversee platform activity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <UserStatsCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Quick Actions Section */}
      <QuickActionsSection 
        onExportUsers={handleExportUsers}
        onBulkActions={() => setShowBulkModal(true)}
        onUserActivity={() => setShowUserActivity(true)}
        onAnalytics={() => setShowAnalytics(true)}
      />

      {/* Users Management Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Users</h2>
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-white/10">
              <span className="text-sm text-gray-300">{filteredUsers.length} users</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              value={userFilter} 
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-sm"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {usersError && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <Error message={usersError?.message} />
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left p-4 text-gray-300 font-medium">User</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Links</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Clicks</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Joined</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.includes(user.id)}
                    onSelect={handleUserSelect}
                    onUserClick={handleUserClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && !usersLoading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchQuery ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? `No users match "${searchQuery}". Try a different search term.`
                  : 'No users have signed up yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserDetailsModal 
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        userId={selectedUser?.id}
        onUserUpdate={handleUserUpdate}
      />

      <BulkActionsModal 
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setSelectedUsers([]); // Clear selections when closing
        }}
        selectedUsers={selectedUsers}
        filteredUsers={filteredUsers}
        onSelectAll={handleSelectAll}
        onRefreshUsers={handleUserUpdate} // Use existing refresh function
        users={users} // Pass users array for email functionality
      />

      <UserActivityModal 
        isOpen={showUserActivity}
        onClose={() => setShowUserActivity(false)}
        users={users}
      />

      <AnalyticsModal 
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        platformStats={platformStats}
      />
    </div>
  );
};

export default AdminDashboard;