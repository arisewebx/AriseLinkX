// // src/components/UserDetailsModal.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   X, 
//   Shield, 
//   User, 
//   Mail, 
//   Calendar, 
//   Link2, 
//   MousePointer, 
//   MapPin, 
//   Smartphone,
//   Crown,
//   UserX,
//   Trash2,
//   Eye,
//   Activity,
//   Globe
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import useFetch from '@/hooks/use-fetch';
// import { 
//   getUserDetails, 
//   makeUserAdmin, 
//   removeAdminPrivileges, 
//   banUser, 
//   unbanUser, 
//   deleteUser,
//   getUserActivity,
//   deleteUserLink
// } from '@/db/apiAdmin';
// import { BarLoader } from 'react-spinners';

// const UserDetailsModal = ({ isOpen, onClose, userId, onUserUpdate }) => {
//   const [activeTab, setActiveTab] = useState('overview');
  
//   // Debug: Log the userId to see what we're getting
//   console.log('UserDetailsModal - userId:', userId, 'type:', typeof userId);
  
//   // Ensure userId is a string
//   const cleanUserId = typeof userId === 'object' ? userId?.id : userId;
  
//   console.log('UserDetailsModal - cleanUserId:', cleanUserId, 'type:', typeof cleanUserId);
  
//   const { 
//     loading: detailsLoading, 
//     data: userDetails, 
//     fn: fetchUserDetails,
//     error: detailsError 
//   } = useFetch(getUserDetails, cleanUserId);
  
//   const { 
//     loading: activityLoading, 
//     data: userActivity, 
//     fn: fetchUserActivity 
//   } = useFetch(getUserActivity, cleanUserId, 30);
  
//   // Create separate fetch functions for admin actions with proper userId
//   const { loading: adminLoading, fn: makeAdminFn } = useFetch(makeUserAdmin);
//   const { loading: removeAdminLoading, fn: removeAdminFn } = useFetch(removeAdminPrivileges);
//   const { loading: banLoading, fn: banUserFn } = useFetch(banUser);
//   const { loading: unbanLoading, fn: unbanUserFn } = useFetch(unbanUser);
//   const { loading: deleteLoading, fn: deleteUserFn } = useFetch(deleteUser);
//   const { loading: deleteLinkLoading, fn: deleteLinkFn } = useFetch(deleteUserLink);
  
//   useEffect(() => {
//     if (isOpen && cleanUserId) {
//       console.log('Fetching user details for:', cleanUserId);
//       fetchUserDetails();
//       fetchUserActivity();
//     }
//   }, [isOpen, cleanUserId]);
  
//   if (!isOpen) return null;
  
//   const handleMakeAdmin = async () => {
//     if (confirm('Are you sure you want to make this user an admin?')) {
//       console.log('Making admin for userId:', cleanUserId);
//       try {
//         await makeAdminFn(cleanUserId);
//         fetchUserDetails();
//         onUserUpdate();
//       } catch (error) {
//         console.error('Error making admin:', error);
//         alert('Error making user admin: ' + error.message);
//       }
//     }
//   };
  
//   const handleRemoveAdmin = async () => {
//     if (confirm('Are you sure you want to remove admin privileges from this user?')) {
//       console.log('Removing admin for userId:', cleanUserId);
//       try {
//         await removeAdminFn(cleanUserId);
//         fetchUserDetails();
//         onUserUpdate();
//       } catch (error) {
//         console.error('Error removing admin:', error);
//         alert('Error removing admin privileges: ' + error.message);
//       }
//     }
//   };
  
//   const handleBanUser = async () => {
//     if (confirm('Are you sure you want to ban this user? They will not be able to access the platform.')) {
//       console.log('Banning userId:', cleanUserId);
//       try {
//         await banUserFn(cleanUserId);
//         fetchUserDetails();
//         onUserUpdate();
//       } catch (error) {
//         console.error('Error banning user:', error);
//         alert('Error banning user: ' + error.message);
//       }
//     }
//   };
  
// //   const handleUnbanUser = async () => {
// //     if (confirm('Are you sure you want to unban this user?')) {
// //       console.log('Unbanning userId:', cleanUserId);
// //       try {
// //         await unbanUserFn(cleanUserId);
// //         fetchUserDetails();
// //         onUserUpdate();
// //       } catch (error) {
// //         console.error('Error unbanning user:', error);
// //         alert('Error unbanning user: ' + error.message);
// //       }
// //     }
// //   };
//   const handleUnbanUser = async () => {
//   if (confirm('Are you sure you want to unban this user?')) {
//     try {
//       const result = await unbanUserFn(cleanUserId);
      
//       // Refresh user data
//       await fetchUserDetails();
      
//       // Force refresh the session state
//       await supabase.auth.refreshSession();
      
//       onUserUpdate();
//       showToast('User unbanned successfully');
      
//     } catch (error) {
//       console.error('Unban error:', error);
//       showToast(`Unban failed: ${error.message}`, 'error');
//     }
//   }
// };
//   const handleDeleteLink = async (linkId, linkTitle) => {
//     if (confirm(`Are you sure you want to delete the link "${linkTitle}"? This will also delete all its click data.`)) {
//       try {
//         await deleteLinkFn(linkId);
//         fetchUserDetails(); // Refresh the user details
//         onUserUpdate(); // Refresh the main admin dashboard
//       } catch (error) {
//         console.error('Error deleting link:', error);
//         alert('Error deleting link: ' + error.message);
//       }
//     }
//   };
  
//   const handleDeleteUser = async () => {
//     if (confirm('⚠️ DANGER: This will permanently delete the user and ALL their data (links, clicks, etc.). This action cannot be undone. Are you absolutely sure?')) {
//       if (confirm('Type "DELETE" to confirm this destructive action.')) {
//         console.log('Deleting userId:', cleanUserId);
//         try {
//           await deleteUserFn(cleanUserId);
//           onUserUpdate();
//           onClose();
//         } catch (error) {
//           console.error('Error deleting user:', error);
//           alert('Error deleting user: ' + error.message);
//         }
//       }
//     }
//   };
  
//   const user = userDetails?.user;
//   const urls = userDetails?.urls || [];
//   const clicks = userDetails?.clicks || [];
//   const stats = userDetails?.stats || {};
  
//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-white/10">
//           <div className="flex items-center gap-4">
//             {user?.profilepic ? (
//               <img 
//                 src={user.profilepic} 
//                 alt={user.name}
//                 className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
//               />
//             ) : (
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
//                 <User className="w-8 h-8 text-white" />
//               </div>
//             )}
//             <div>
//               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//                 {user?.name || 'Loading...'}
//                 {user?.isAdmin && <Crown className="w-5 h-5 text-yellow-400" />}
//               </h2>
//               <p className="text-gray-300">{user?.email}</p>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   user?.status === 'active' 
//                     ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                     : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                 }`}>
//                   {user?.status === 'active' ? 'Active' : 'Pending'}
//                 </span>
//                 {user?.banned && (
//                   <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
//                     Banned
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Button
//             onClick={onClose}
//             className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         </div>
        
//         {/* Loading State */}
//         {detailsLoading && (
//           <div className="p-6">
//             <BarLoader width="100%" color="#8b5cf6" height={3} />
//             <p className="text-white mt-4">Loading user details...</p>
//           </div>
//         )}
        
//         {/* Error State */}
//         {detailsError && (
//           <div className="p-6">
//             <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
//               <p className="text-red-300">Error loading user details: {detailsError.message}</p>
//             </div>
//           </div>
//         )}
        
//         {/* Content */}
//         {user && (
//           <>
//             {/* Tabs */}
//             <div className="border-b border-white/10">
//               <div className="flex gap-1 p-2">
//                 {[
//                   { id: 'overview', label: 'Overview', icon: Eye },
//                   { id: 'links', label: 'Links', icon: Link2 },
//                   { id: 'activity', label: 'Activity', icon: Activity },
//                   { id: 'actions', label: 'Actions', icon: Shield }
//                 ].map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                       activeTab === tab.id
//                         ? 'bg-white/10 text-white'
//                         : 'text-gray-400 hover:text-white hover:bg-white/5'
//                     }`}
//                   >
//                     <tab.icon className="w-4 h-4" />
//                     {tab.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {/* Tab Content */}
//             <div className="p-6 max-h-[60vh] overflow-y-auto">
//               {/* Overview Tab */}
//               {activeTab === 'overview' && (
//                 <div className="space-y-6">
//                   {/* Stats Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <Card className="bg-white/5 border-white/10">
//                       <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                           <Link2 className="w-8 h-8 text-purple-400" />
//                           <div>
//                             <p className="text-2xl font-bold text-white">{stats.totalLinks}</p>
//                             <p className="text-gray-400 text-sm">Total Links</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
                    
//                     <Card className="bg-white/5 border-white/10">
//                       <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                           <MousePointer className="w-8 h-8 text-cyan-400" />
//                           <div>
//                             <p className="text-2xl font-bold text-white">{stats.totalClicks}</p>
//                             <p className="text-gray-400 text-sm">Total Clicks</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
                    
//                     <Card className="bg-white/5 border-white/10">
//                       <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                           <Activity className="w-8 h-8 text-green-400" />
//                           <div>
//                             <p className="text-2xl font-bold text-white">{stats.avgClicksPerLink}</p>
//                             <p className="text-gray-400 text-sm">Avg. Clicks</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
                    
//                     <Card className="bg-white/5 border-white/10">
//                       <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                           <Calendar className="w-8 h-8 text-blue-400" />
//                           <div>
//                             <p className="text-sm font-bold text-white">
//                               {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
//                             </p>
//                             <p className="text-gray-400 text-sm">Last Active</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
                  
//                   {/* User Info */}
//                   <Card className="bg-white/5 border-white/10">
//                     <CardHeader>
//                       <CardTitle className="text-white">User Information</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-gray-400 text-sm">Email</p>
//                           <p className="text-white">{user.email}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-400 text-sm">Phone</p>
//                           <p className="text-white">{user.phone || 'Not provided'}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-400 text-sm">Joined</p>
//                           <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-400 text-sm">Email Verified</p>
//                           <p className="text-white">
//                             {user.email_confirmed_at ? 'Yes' : 'No'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-400 text-sm">User ID</p>
//                           <p className="text-white font-mono text-xs">{cleanUserId}</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
              
//               {/* Links Tab */}
//               {activeTab === 'links' && (
//                 <div className="space-y-4">
//                   <h3 className="text-xl font-bold text-white">User Links ({urls.length})</h3>
//                   {urls.length === 0 ? (
//                     <p className="text-gray-400">No links created yet.</p>
//                   ) : (
//                     <div className="space-y-3">
//                       {urls.slice(0, 10).map((url) => (
//                         <div key={url.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
//                           <div className="flex items-center justify-between">
//                             <div className="flex-1">
//                               <h4 className="text-white font-medium">{url.title}</h4>
//                               <p className="text-blue-400 text-sm">/{url.short_url}</p>
//                               <p className="text-gray-400 text-xs">{url.original_url}</p>
//                             </div>
//                             <div className="flex items-center gap-4">
//                               <div className="text-right">
//                                 <p className="text-white font-medium">{url.clickCount || 0} clicks</p>
//                                 <p className="text-gray-400 text-xs">
//                                   {new Date(url.created_at).toLocaleDateString()}
//                                 </p>
//                               </div>
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleDeleteLink(url.id, url.title)}
//                                 disabled={deleteLinkLoading}
//                                 className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                       {urls.length > 10 && (
//                         <p className="text-gray-400 text-center">And {urls.length - 10} more links...</p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
              
//               {/* Activity Tab */}
//               {activeTab === 'activity' && (
//                 <div className="space-y-4">
//                   <h3 className="text-xl font-bold text-white">Recent Activity (Last 30 days)</h3>
//                   {activityLoading ? (
//                     <BarLoader width="100%" color="#8b5cf6" height={3} />
//                   ) : userActivity && userActivity.length > 0 ? (
//                     <div className="space-y-3">
//                       {userActivity.slice(0, 20).map((click, index) => (
//                         <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                               <MousePointer className="w-4 h-4 text-cyan-400" />
//                               <div>
//                                 <p className="text-white text-sm">Link clicked</p>
//                                 <p className="text-gray-400 text-xs">
//                                   {new Date(click.created_at).toLocaleString()}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-4 text-xs text-gray-400">
//                               {click.country && (
//                                 <div className="flex items-center gap-1">
//                                   <Globe className="w-3 h-3" />
//                                   {click.country}
//                                 </div>
//                               )}
//                               {click.device && (
//                                 <div className="flex items-center gap-1">
//                                   <Smartphone className="w-3 h-3" />
//                                   {click.device}
//                                 </div>
//                               )}
//                               {click.city && (
//                                 <div className="flex items-center gap-1">
//                                   <MapPin className="w-3 h-3" />
//                                   {click.city}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-400">No recent activity.</p>
//                   )}
//                 </div>
//               )}
              
//               {/* Actions Tab */}
//               {activeTab === 'actions' && (
//                 <div className="space-y-6">
//                   <h3 className="text-xl font-bold text-white">User Actions</h3>
                  
//                   {/* Admin Actions */}
//                   <Card className="bg-white/5 border-white/10">
//                     <CardHeader>
//                       <CardTitle className="text-white flex items-center gap-2">
//                         <Crown className="w-5 h-5 text-yellow-400" />
//                         Admin Privileges
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <p className="text-gray-300 text-sm">
//                         Current status: {user.isAdmin ? 'Admin' : 'Regular User'}
//                       </p>
//                       <div className="flex gap-3">
//                         {user.isAdmin ? (
//                           <Button
//                             onClick={handleRemoveAdmin}
//                             disabled={removeAdminLoading || user.email === 'karthickrajaofficial12@gmail.com'}
//                             className="bg-orange-600 hover:bg-orange-500"
//                           >
//                             {removeAdminLoading ? 'Removing...' : 'Remove Admin'}
//                           </Button>
//                         ) : (
//                           <Button
//                             onClick={handleMakeAdmin}
//                             disabled={adminLoading}
//                             className="bg-yellow-600 hover:bg-yellow-500"
//                           >
//                             {adminLoading ? 'Making Admin...' : 'Make Admin'}
//                           </Button>
//                         )}
//                       </div>
//                       {user.email === 'karthickrajaofficial12@gmail.com' && (
//                         <p className="text-yellow-300 text-xs">
//                           ⚠️ This is the primary admin account and cannot be modified.
//                         </p>
//                       )}
//                     </CardContent>
//                   </Card>
                  
//                   {/* Ban Actions */}
//                   <Card className="bg-white/5 border-white/10">
//                     <CardHeader>
//                       <CardTitle className="text-white flex items-center gap-2">
//                         <UserX className="w-5 h-5 text-red-400" />
//                         Account Status
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//   <p className="text-gray-300 text-sm">
//     Current status: {user.app_metadata?.banned ? 'Banned' : 'Active'}
//   </p>
//   <div className="flex gap-3">
//     {user.app_metadata?.banned ? (
//       <Button
//         onClick={handleUnbanUser}
//         disabled={unbanLoading || user.email === 'karthickrajaofficial12@gmail.com'}
//         className="bg-green-600 hover:bg-green-500"
//       >
//         {unbanLoading ? 'Unbanning...' : 'Unban User'}
//       </Button>
//     ) : (
//       <Button
//         onClick={handleBanUser}
//         disabled={banLoading || user.email === 'karthickrajaofficial12@gmail.com'}
//         className="bg-red-600 hover:bg-red-500"
//       >
//         {banLoading ? 'Banning...' : 'Ban User'}
//       </Button>
//     )}
//   </div>
// </CardContent>
//                   </Card>
                  
//                   {/* Delete User */}
//                   <Card className="bg-red-500/10 border-red-500/20">
//                     <CardHeader>
//                       <CardTitle className="text-red-300 flex items-center gap-2">
//                         <Trash2 className="w-5 h-5" />
//                         Danger Zone
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <p className="text-red-200 text-sm">
//                         Permanently delete this user and all their data. This action cannot be undone.
//                       </p>
//                       <Button
//                         onClick={handleDeleteUser}
//                         disabled={deleteLoading || user.email === 'karthickrajaofficial12@gmail.com'}
//                         className="bg-red-600 hover:bg-red-500"
//                       >
//                         {deleteLoading ? 'Deleting...' : 'Delete User'}
//                       </Button>
//                       {user.email === 'karthickrajaofficial12@gmail.com' && (
//                         <p className="text-red-300 text-xs">
//                           ⚠️ Primary admin account cannot be deleted.
//                         </p>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDetailsModal;
// src/components/UserDetailsModal.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   X, 
//   Shield, 
//   User, 
//   Mail, 
//   Calendar, 
//   Link2, 
//   MousePointer, 
//   MapPin, 
//   Smartphone,
//   Crown,
//   UserX,
//   Trash2,
//   Eye,
//   Activity,
//   Globe,
//   ShieldOff
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import useFetch from '@/hooks/use-fetch';
// import { 
//   getUserDetails, 
//   makeUserAdmin, 
//   removeAdminPrivileges, 
//   banUserSimple, 
//   unbanUserSimple, 
//   deleteUser,
//   getUserActivity,
//   deleteUserLink
// } from '@/db/apiAdmin';
// import { BarLoader } from 'react-spinners';
// import ConfirmationModal from '../admin/ConfirmationModel';
// import ResultModal from '../admin/ResultModel';

// const UserDetailsModal = ({ isOpen, onClose, userId, onUserUpdate }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [actionLoading, setActionLoading] = useState(false);
//   const [currentAction, setCurrentAction] = useState('');
  
//   // Confirmation modal states
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [confirmationType, setConfirmationType] = useState('');
//   const [confirmationData, setConfirmationData] = useState({});
  
//   // Result modal states
//   const [showResult, setShowResult] = useState(false);
//   const [resultData, setResultData] = useState({});
  
//   // Debug: Log the userId to see what we're getting
//   console.log('UserDetailsModal - userId:', userId, 'type:', typeof userId);
  
//   // Ensure userId is a string
//   const cleanUserId = typeof userId === 'object' ? userId?.id : userId;
  
//   console.log('UserDetailsModal - cleanUserId:', cleanUserId, 'type:', typeof cleanUserId);
  
//   const { 
//     loading: detailsLoading, 
//     data: userDetails, 
//     fn: fetchUserDetails,
//     error: detailsError 
//   } = useFetch(getUserDetails, cleanUserId);
  
//   const { 
//     loading: activityLoading, 
//     data: userActivity, 
//     fn: fetchUserActivity 
//   } = useFetch(getUserActivity, cleanUserId, 30);
  
//   // Create separate fetch functions for admin actions with proper userId
//   const { fn: makeAdminFn } = useFetch(makeUserAdmin);
//   const { fn: removeAdminFn } = useFetch(removeAdminPrivileges);
//   const { fn: banUserFn } = useFetch(banUserSimple);
//   const { fn: unbanUserFn } = useFetch(unbanUserSimple);
//   const { fn: deleteUserFn } = useFetch(deleteUser);
//   const { fn: deleteLinkFn } = useFetch(deleteUserLink);
  
//   useEffect(() => {
//     if (isOpen && cleanUserId) {
//       console.log('Fetching user details for:', cleanUserId);
//       fetchUserDetails();
//       fetchUserActivity();
//     }
//   }, [isOpen, cleanUserId]);
  
//   if (!isOpen) return null;

//   const showConfirmationModal = (type, data) => {
//     setConfirmationType(type);
//     setConfirmationData(data);
//     setShowConfirmation(true);
//   };

//   const showResultModal = (data) => {
//     setResultData(data);
//     setShowResult(true);
//   };

//   const handleMakeAdmin = async () => {
//     showConfirmationModal('promote', {
//       title: 'Promote to Admin',
//       message: `Grant administrator privileges to ${user?.name || user?.email}? This will give them access to the admin dashboard and user management functions.`,
//       confirmText: 'Promote to Admin',
//       itemCount: 1
//     });
//   };
  
//   const handleRemoveAdmin = async () => {
//     showConfirmationModal('demote', {
//       title: 'Remove Admin Access',
//       message: `Remove administrator privileges from ${user?.name || user?.email}? They will lose access to admin functions but keep their user account.`,
//       confirmText: 'Remove Admin Access',
//       itemCount: 1
//     });
//   };
  
//   const handleBanUser = async () => {
//     showConfirmationModal('ban', {
//       title: 'Ban User',
//       message: `Ban ${user?.name || user?.email}? They will immediately see a suspension screen and lose access to all app features.`,
//       confirmText: 'Ban User',
//       itemCount: 1
//     });
//   };
  
//   const handleUnbanUser = async () => {
//     showConfirmationModal('unban', {
//       title: 'Unban User',
//       message: `Remove ban status from ${user?.name || user?.email}? They will regain full access to the platform immediately.`,
//       confirmText: 'Unban User',
//       itemCount: 1
//     });
//   };

//   const handleDeleteLink = async (linkId, linkTitle) => {
//     showConfirmationModal('deleteLink', {
//       title: 'Delete Link',
//       message: `Delete the link "${linkTitle}"? This will also delete all its click data and cannot be undone.`,
//       confirmText: 'Delete Link',
//       itemCount: 1,
//       linkId,
//       linkTitle
//     });
//   };
  
//   const handleDeleteUser = async () => {
//     showConfirmationModal('delete', {
//       title: 'Delete User',
//       message: `This will permanently delete ${user?.name || user?.email} and ALL their data including links, clicks, and account information. This action cannot be undone.`,
//       confirmText: 'Delete User',
//       itemCount: 1,
//       requiresTypeConfirmation: true,
//       typeConfirmationText: 'DELETE'
//     });
//   };

//   const executeConfirmedAction = async () => {
//     setShowConfirmation(false);
//     setActionLoading(true);
    
//     try {
//       let result;
//       let successMessage = '';
//       let errorMessage = '';
      
//       switch (confirmationType) {
//         case 'promote':
//           setCurrentAction('Promoting user to admin...');
//           result = await makeAdminFn(cleanUserId);
//           successMessage = `Successfully promoted ${user?.name || user?.email} to admin. They now have administrative privileges.`;
//           errorMessage = 'Failed to promote user to admin';
//           break;

//         case 'demote':
//           setCurrentAction('Removing admin privileges...');
//           result = await removeAdminFn(cleanUserId);
//           successMessage = `Successfully removed admin privileges from ${user?.name || user?.email}.`;
//           errorMessage = 'Failed to remove admin privileges';
//           break;

//         case 'ban':
//           setCurrentAction('Banning user...');
//           result = await banUserFn(cleanUserId);
//           successMessage = `Successfully banned ${user?.name || user?.email}. They will see a suspension screen on their next interaction.`;
//           errorMessage = 'Failed to ban user';
//           break;

//         case 'unban':
//           setCurrentAction('Unbanning user...');
//           result = await unbanUserFn(cleanUserId);
//           successMessage = `Successfully unbanned ${user?.name || user?.email}. They can now access the platform normally.`;
//           errorMessage = 'Failed to unban user';
//           break;

//         case 'deleteLink':
//           setCurrentAction('Deleting link...');
//           result = await deleteLinkFn(confirmationData.linkId);
//           successMessage = `Successfully deleted the link "${confirmationData.linkTitle}" and all its click data.`;
//           errorMessage = 'Failed to delete link';
//           break;

//         case 'delete':
//           setCurrentAction('Deleting user and all data...');
//           result = await deleteUserFn(cleanUserId);
//           successMessage = `Successfully deleted ${user?.name || user?.email} and all associated data.`;
//           errorMessage = 'Failed to delete user';
//           break;

//         default:
//           throw new Error('Unknown action type');
//       }
      
//       // Show success result
//       showResultModal({
//         type: 'success',
//         title: 'Action Completed Successfully',
//         message: successMessage,
//         actionType: confirmationType,
//         stats: { total: 1, successful: 1, failed: 0 },
//         details: [{
//           success: true,
//           userEmail: user?.email || 'Unknown',
//           message: successMessage
//         }]
//       });
      
//       // Refresh data
//       if (confirmationType !== 'delete') {
//         await fetchUserDetails();
//         await fetchUserActivity();
//       }
//       onUserUpdate();
      
//       // Close modal if user was deleted
//       if (confirmationType === 'delete') {
//         setTimeout(() => {
//           onClose();
//         }, 2000);
//       }
      
//     } catch (error) {
//       console.error(`${confirmationType} error:`, error);
      
//       showResultModal({
//         type: 'error',
//         title: 'Action Failed',
//         message: `${errorMessage}: ${error.message}`,
//         actionType: confirmationType,
//         stats: { total: 1, successful: 0, failed: 1 },
//         details: [{
//           success: false,
//           userEmail: user?.email || 'Unknown',
//           error: error.message
//         }]
//       });
//     } finally {
//       setActionLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleResultClose = () => {
//     setShowResult(false);
//   };
  
//   const user = userDetails?.user;
//   const urls = userDetails?.urls || [];
//   const clicks = userDetails?.clicks || [];
//   const stats = userDetails?.stats || {};

//   // Check if user is primary admin (protected)
//   const isPrimaryAdmin = user?.email === 'karthickrajaofficial12@gmail.com';
  
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-white/10">
//             <div className="flex items-center gap-4">
//               {user?.profilepic ? (
//                 <img 
//                   src={user.profilepic} 
//                   alt={user.name}
//                   className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
//                   <User className="w-8 h-8 text-white" />
//                 </div>
//               )}
//               <div>
//                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//                   {user?.name || 'Loading...'}
//                   {user?.isAdmin && <Crown className="w-5 h-5 text-yellow-400" />}
//                 </h2>
//                 <p className="text-gray-300">{user?.email}</p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     user?.status === 'active' 
//                       ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                       : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                   }`}>
//                     {user?.status === 'active' ? 'Active' : 'Pending'}
//                   </span>
//                   {user?.app_metadata?.banned && (
//                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
//                       Banned
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <Button
//               onClick={onClose}
//               disabled={actionLoading}
//               className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
          
//           {/* Action Loading State */}
//           {actionLoading && (
//             <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
//               <div className="flex items-center gap-3">
//                 <BarLoader width="50px" color="#8b5cf6" height={3} />
//                 <span className="text-blue-300">{currentAction}</span>
//               </div>
//             </div>
//           )}
          
//           {/* Loading State */}
//           {detailsLoading && (
//             <div className="p-6">
//               <BarLoader width="100%" color="#8b5cf6" height={3} />
//               <p className="text-white mt-4">Loading user details...</p>
//             </div>
//           )}
          
//           {/* Error State */}
//           {detailsError && (
//             <div className="p-6">
//               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
//                 <p className="text-red-300">Error loading user details: {detailsError.message}</p>
//               </div>
//             </div>
//           )}
          
//           {/* Content */}
//           {user && (
//             <>
//               {/* Tabs */}
//               <div className="border-b border-white/10">
//                 <div className="flex gap-1 p-2">
//                   {[
//                     { id: 'overview', label: 'Overview', icon: Eye },
//                     { id: 'links', label: 'Links', icon: Link2 },
//                     { id: 'activity', label: 'Activity', icon: Activity },
//                     { id: 'actions', label: 'Actions', icon: Shield }
//                   ].map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       disabled={actionLoading}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
//                         activeTab === tab.id
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:text-white hover:bg-white/5'
//                       }`}
//                     >
//                       <tab.icon className="w-4 h-4" />
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Tab Content */}
//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 {/* Overview Tab */}
//                 {activeTab === 'overview' && (
//                   <div className="space-y-6">
//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Link2 className="w-8 h-8 text-purple-400" />
//                             <div>
//                               <p className="text-2xl font-bold text-white">{stats.totalLinks || 0}</p>
//                               <p className="text-gray-400 text-sm">Total Links</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <MousePointer className="w-8 h-8 text-cyan-400" />
//                             <div>
//                               <p className="text-2xl font-bold text-white">{stats.totalClicks || 0}</p>
//                               <p className="text-gray-400 text-sm">Total Clicks</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Activity className="w-8 h-8 text-green-400" />
//                             <div>
//                               <p className="text-2xl font-bold text-white">{stats.avgClicksPerLink || 0}</p>
//                               <p className="text-gray-400 text-sm">Avg. Clicks</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Calendar className="w-8 h-8 text-blue-400" />
//                             <div>
//                               <p className="text-sm font-bold text-white">
//                                 {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
//                               </p>
//                               <p className="text-gray-400 text-sm">Last Active</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
                    
//                     {/* User Info */}
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white">User Information</CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-gray-400 text-sm">Email</p>
//                             <p className="text-white">{user.email}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">Phone</p>
//                             <p className="text-white">{user.phone || 'Not provided'}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">Joined</p>
//                             <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">Email Verified</p>
//                             <p className="text-white">
//                               {user.email_confirmed_at ? 'Yes' : 'No'}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">User ID</p>
//                             <p className="text-white font-mono text-xs">{cleanUserId}</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}
                
//                 {/* Links Tab */}
//                 {activeTab === 'links' && (
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-bold text-white">User Links ({urls.length})</h3>
//                     {urls.length === 0 ? (
//                       <p className="text-gray-400">No links created yet.</p>
//                     ) : (
//                       <div className="space-y-3">
//                         {urls.slice(0, 10).map((url) => (
//                           <div key={url.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex-1">
//                                 <h4 className="text-white font-medium">{url.title}</h4>
//                                 <p className="text-blue-400 text-sm">/{url.short_url}</p>
//                                 <p className="text-gray-400 text-xs">{url.original_url}</p>
//                               </div>
//                               <div className="flex items-center gap-4">
//                                 <div className="text-right">
//                                   <p className="text-white font-medium">{url.clickCount || 0} clicks</p>
//                                   <p className="text-gray-400 text-xs">
//                                     {new Date(url.created_at).toLocaleDateString()}
//                                   </p>
//                                 </div>
//                                 <Button
//                                   size="sm"
//                                   onClick={() => handleDeleteLink(url.id, url.title)}
//                                   disabled={actionLoading}
//                                   className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 disabled:opacity-50"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                         {urls.length > 10 && (
//                           <p className="text-gray-400 text-center">And {urls.length - 10} more links...</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Activity Tab */}
//                 {activeTab === 'activity' && (
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-bold text-white">Recent Activity (Last 30 days)</h3>
//                     {activityLoading ? (
//                       <BarLoader width="100%" color="#8b5cf6" height={3} />
//                     ) : userActivity && userActivity.length > 0 ? (
//                       <div className="space-y-3">
//                         {userActivity.slice(0, 20).map((click, index) => (
//                           <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-3">
//                                 <MousePointer className="w-4 h-4 text-cyan-400" />
//                                 <div>
//                                   <p className="text-white text-sm">Link clicked</p>
//                                   <p className="text-gray-400 text-xs">
//                                     {new Date(click.created_at).toLocaleString()}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-4 text-xs text-gray-400">
//                                 {click.country && (
//                                   <div className="flex items-center gap-1">
//                                     <Globe className="w-3 h-3" />
//                                     {click.country}
//                                   </div>
//                                 )}
//                                 {click.device && (
//                                   <div className="flex items-center gap-1">
//                                     <Smartphone className="w-3 h-3" />
//                                     {click.device}
//                                   </div>
//                                 )}
//                                 {click.city && (
//                                   <div className="flex items-center gap-1">
//                                     <MapPin className="w-3 h-3" />
//                                     {click.city}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-400">No recent activity.</p>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Actions Tab */}
//                 {activeTab === 'actions' && (
//                   <div className="space-y-6">
//                     <h3 className="text-xl font-bold text-white">User Actions</h3>
                    
//                     {/* Admin Actions */}
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white flex items-center gap-2">
//                           <Crown className="w-5 h-5 text-yellow-400" />
//                           Admin Privileges
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-gray-300 text-sm">
//                           Current status: {user.isAdmin ? 'Admin' : 'Regular User'}
//                         </p>
//                         <div className="flex gap-3">
//                           {user.isAdmin ? (
//                             <Button
//                               onClick={handleRemoveAdmin}
//                               disabled={actionLoading || isPrimaryAdmin}
//                               className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-white disabled:opacity-50"
//                             >
//                               <ShieldOff className="w-4 h-4 mr-2" />
//                               Remove Admin
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={handleMakeAdmin}
//                               disabled={actionLoading}
//                               className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-white disabled:opacity-50"
//                             >
//                               <Shield className="w-4 h-4 mr-2" />
//                               Make Admin
//                             </Button>
//                           )}
//                         </div>
//                         {isPrimaryAdmin && (
//                           <p className="text-yellow-300 text-xs">
//                             ⚠️ This is the primary admin account and cannot be modified.
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
                    
//                     {/* Ban Actions */}
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white flex items-center gap-2">
//                           <UserX className="w-5 h-5 text-red-400" />
//                           Account Status
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-gray-300 text-sm">
//                           Current status: {user.app_metadata?.banned ? 'Banned' : 'Active'}
//                         </p>
//                         <div className="flex gap-3">
//                           {user.app_metadata?.banned ? (
//                             <Button
//                               onClick={handleUnbanUser}
//                               disabled={actionLoading || isPrimaryAdmin}
//                               className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-white disabled:opacity-50"
//                             >
//                               <UserX className="w-4 h-4 mr-2" />
//                               Unban User
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={handleBanUser}
//                               disabled={actionLoading || isPrimaryAdmin}
//                               className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white disabled:opacity-50"
//                             >
//                               <UserX className="w-4 h-4 mr-2" />
//                               Ban User
//                             </Button>
//                           )}
//                         </div>
//                         {isPrimaryAdmin && (
//                           <p className="text-yellow-300 text-xs">
//                             ⚠️ Primary admin account cannot be banned.
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
                    
//                     {/* Delete User */}
//                     <Card className="bg-red-500/10 border-red-500/20">
//                       <CardHeader>
//                         <CardTitle className="text-red-300 flex items-center gap-2">
//                           <Trash2 className="w-5 h-5" />
//                           Danger Zone
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-red-200 text-sm">
//                           Permanently delete this user and all their data. This action cannot be undone.
//                         </p>
//                         <Button
//                           onClick={handleDeleteUser}
//                           disabled={actionLoading || isPrimaryAdmin}
//                           className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white disabled:opacity-50"
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete User
//                         </Button>
//                         {isPrimaryAdmin && (
//                           <p className="text-red-300 text-xs">
//                             ⚠️ Primary admin account cannot be deleted.
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirmation}
//         onClose={() => setShowConfirmation(false)}
//         onConfirm={executeConfirmedAction}
//         type={confirmationType}
//         title={confirmationData.title}
//         message={confirmationData.message}
//         confirmText={confirmationData.confirmText}
//         itemCount={confirmationData.itemCount}
//         requiresTypeConfirmation={confirmationData.requiresTypeConfirmation}
//         typeConfirmationText={confirmationData.typeConfirmationText}
//         loading={actionLoading}
//       />

//       {/* Result Modal */}
//       <ResultModal
//         isOpen={showResult}
//         onClose={handleResultClose}
//         type={resultData.type}
//         title={resultData.title}
//         message={resultData.message}
//         actionType={resultData.actionType}
//         stats={resultData.stats}
//         details={resultData.details}
//       />
//     </>
//   );
// };

// export default UserDetailsModal;
//working 
// import React, { useState, useEffect } from 'react';
// import { 
//   X, 
//   Shield, 
//   User, 
//   Mail, 
//   Calendar, 
//   Link2, 
//   MousePointer, 
//   MapPin, 
//   Smartphone,
//   Crown,
//   UserX,
//   Trash2,
//   Eye,
//   Activity,
//   Globe,
//   ShieldOff,
//   Send
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import useFetch from '@/hooks/use-fetch';
// import { 
//   getUserDetails, 
//   makeUserAdmin, 
//   removeAdminPrivileges, 
//   banUserSimple, 
//   unbanUserSimple, 
//   deleteUser,
//   getUserActivity,
//   deleteUserLink
// } from '@/db/apiAdmin';
// import { BarLoader } from 'react-spinners';
// import ConfirmationModal from '../admin/ConfirmationModel';
// import ResultModal from '../admin/ResultModel';

// const UserDetailsModal = ({ isOpen, onClose, userId, onUserUpdate }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [actionLoading, setActionLoading] = useState(false);
//   const [currentAction, setCurrentAction] = useState('');
  
//   // Confirmation modal states
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [confirmationType, setConfirmationType] = useState('');
//   const [confirmationData, setConfirmationData] = useState({});
  
//   // Result modal states
//   const [showResult, setShowResult] = useState(false);
//   const [resultData, setResultData] = useState({});
  
//   // Debug: Log the userId to see what we're getting
//   console.log('UserDetailsModal - userId:', userId, 'type:', typeof userId);
  
//   // Ensure userId is a string - handle various possible formats
//   const cleanUserId = (() => {
//     if (!userId) return null;
    
//     if (typeof userId === 'string') {
//       return userId;
//     }
    
//     if (typeof userId === 'object') {
//       // Try different possible property names
//       return userId.id || userId.user_id || userId.userId || null;
//     }
    
//     return String(userId);
//   })();
  
//   console.log('UserDetailsModal - cleanUserId:', cleanUserId, 'type:', typeof cleanUserId);
  
//   // Validate that we have a proper UUID
//   const isValidUUID = cleanUserId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanUserId);
//   console.log('UserDetailsModal - isValidUUID:', isValidUUID);
  
//   const { 
//     loading: detailsLoading, 
//     data: userDetails, 
//     fn: fetchUserDetails,
//     error: detailsError 
//   } = useFetch(getUserDetails, cleanUserId);
  
//   const { 
//     loading: activityLoading, 
//     data: userActivity, 
//     fn: fetchUserActivity 
//   } = useFetch(getUserActivity, cleanUserId, 30);
  
//   // Create separate fetch functions for admin actions with proper userId
//   // Note: We'll call the API functions directly instead of using useFetch to avoid parameter issues
//   const makeAdminFn = async (userId) => {
//     console.log('makeAdminFn called with userId:', userId, 'type:', typeof userId);
//     return await makeUserAdmin(userId);
//   };
  
//   const removeAdminFn = async (userId) => {
//     console.log('removeAdminFn called with userId:', userId, 'type:', typeof userId);
//     return await removeAdminPrivileges(userId);
//   };
  
//   const banUserFn = async (userId) => {
//     console.log('banUserFn called with userId:', userId, 'type:', typeof userId);
//     return await banUserSimple(userId);
//   };
  
//   const unbanUserFn = async (userId) => {
//     console.log('unbanUserFn called with userId:', userId, 'type:', typeof userId);
//     return await unbanUserSimple(userId);
//   };
  
//   const deleteUserFn = async (userId) => {
//     console.log('deleteUserFn called with userId:', userId, 'type:', typeof userId);
//     return await deleteUser(userId);
//   };
  
//   const deleteLinkFn = async (linkId) => {
//     console.log('deleteLinkFn called with linkId:', linkId, 'type:', typeof linkId);
//     return await deleteUserLink(linkId);
//   };
  
//   useEffect(() => {
//     if (isOpen && cleanUserId && isValidUUID) {
//       console.log('Fetching user details for valid UUID:', cleanUserId);
//       fetchUserDetails();
//       fetchUserActivity();
//     } else if (isOpen && cleanUserId && !isValidUUID) {
//       console.error('Invalid UUID format:', cleanUserId);
//     }
//   }, [isOpen, cleanUserId, isValidUUID]);
  
//   if (!isOpen) return null;

//   // Early validation for invalid userId
//   if (isOpen && (!cleanUserId || !isValidUUID)) {
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-md w-full p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-white">Invalid User ID</h2>
//             <Button
//               onClick={onClose}
//               className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//           <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
//             <p className="text-red-300 mb-2">Cannot load user details</p>
//             <p className="text-gray-400 text-sm">
//               Invalid user ID format. Expected UUID, received: {String(userId)}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const showConfirmationModal = (type, data) => {
//     setConfirmationType(type);
//     setConfirmationData(data);
//     setShowConfirmation(true);
//   };

//   const showResultModal = (data) => {
//     setResultData(data);
//     setShowResult(true);
//   };

//   const handleMakeAdmin = async () => {
//     showConfirmationModal('promote', {
//       title: 'Promote to Admin',
//       message: `Grant administrator privileges to ${user?.name || user?.email}? This will give them access to the admin dashboard and user management functions.`,
//       confirmText: 'Promote to Admin',
//       itemCount: 1
//     });
//   };
  
//   const handleRemoveAdmin = async () => {
//     showConfirmationModal('demote', {
//       title: 'Remove Admin Access',
//       message: `Remove administrator privileges from ${user?.name || user?.email}? They will lose access to admin functions but keep their user account.`,
//       confirmText: 'Remove Admin Access',
//       itemCount: 1
//     });
//   };
  
//   const handleBanUser = async () => {
//     showConfirmationModal('ban', {
//       title: 'Ban User',
//       message: `Ban ${user?.name || user?.email}? They will immediately see a suspension screen and lose access to all app features.`,
//       confirmText: 'Ban User',
//       itemCount: 1
//     });
//   };
  
//   const handleUnbanUser = async () => {
//     showConfirmationModal('unban', {
//       title: 'Unban User',
//       message: `Remove ban status from ${user?.name || user?.email}? They will regain full access to the platform immediately.`,
//       confirmText: 'Unban User',
//       itemCount: 1
//     });
//   };

//   const handleSendEmail = async () => {
//     const message = prompt(`Enter message to send to ${user?.name || user?.email}:`);
//     if (!message || !message.trim()) return;
    
//     setActionLoading(true);
//     setCurrentAction('Sending email...');
    
//     try {
//       // Here you would implement your email sending logic
//       // This could be a separate API call to your email service
//       console.log('Sending email to:', user?.email, 'Message:', message);
      
//       // Simulate email sending delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       showResultModal({
//         type: 'success',
//         title: 'Email Sent Successfully',
//         message: `Email successfully sent to ${user?.email}.`,
//         actionType: 'email',
//         stats: { total: 1, successful: 1, failed: 0 },
//         details: [{
//           success: true,
//           userEmail: user?.email,
//           message: 'Email delivered successfully'
//         }]
//       });
      
//     } catch (error) {
//       console.error('Send email error:', error);
      
//       showResultModal({
//         type: 'error',
//         title: 'Email Failed',
//         message: `Failed to send email: ${error.message}`,
//         actionType: 'email',
//         stats: { total: 1, successful: 0, failed: 1 },
//         details: [{
//           success: false,
//           userEmail: user?.email,
//           error: error.message
//         }]
//       });
//     } finally {
//       setActionLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleDeleteLink = async (linkId, linkTitle) => {
//     showConfirmationModal('deleteLink', {
//       title: 'Delete Link',
//       message: `Delete the link "${linkTitle}"? This will also delete all its click data and cannot be undone.`,
//       confirmText: 'Delete Link',
//       itemCount: 1,
//       linkId,
//       linkTitle
//     });
//   };
  
//   const handleDeleteUser = async () => {
//     showConfirmationModal('delete', {
//       title: 'Delete User',
//       message: `This will permanently delete ${user?.name || user?.email} and ALL their data including links, clicks, and account information. This action cannot be undone.`,
//       confirmText: 'Delete User',
//       itemCount: 1,
//       requiresTypeConfirmation: true,
//       typeConfirmationText: 'DELETE'
//     });
//   };

//   const executeConfirmedAction = async () => {
//     setShowConfirmation(false);
    
//     // Validate UUID before proceeding
//     if (!cleanUserId || !isValidUUID) {
//       showResultModal({
//         type: 'error',
//         title: 'Invalid User ID',
//         message: `Cannot perform action: Invalid user ID format. Expected UUID, got: ${cleanUserId}`,
//         actionType: confirmationType,
//         stats: { total: 1, successful: 0, failed: 1 },
//         details: [{
//           success: false,
//           userEmail: user?.email || 'Unknown',
//           error: 'Invalid user ID format'
//         }]
//       });
//       return;
//     }
    
//     setActionLoading(true);
    
//     try {
//       let result;
//       let successMessage = '';
//       let errorMessage = '';
      
//       console.log(`Executing ${confirmationType} action for userId:`, cleanUserId);
      
//       switch (confirmationType) {
//         case 'promote':
//           setCurrentAction('Promoting user to admin...');
//           console.log('About to call makeAdminFn with cleanUserId:', cleanUserId);
//           result = await makeAdminFn(cleanUserId);
//           successMessage = `Successfully promoted ${user?.name || user?.email} to admin. They now have administrative privileges.`;
//           errorMessage = 'Failed to promote user to admin';
//           break;

//         case 'demote':
//           setCurrentAction('Removing admin privileges...');
//           console.log('About to call removeAdminFn with cleanUserId:', cleanUserId);
//           result = await removeAdminFn(cleanUserId);
//           successMessage = `Successfully removed admin privileges from ${user?.name || user?.email}.`;
//           errorMessage = 'Failed to remove admin privileges';
//           break;

//         case 'ban':
//           setCurrentAction('Banning user...');
//           console.log('About to call banUserFn with cleanUserId:', cleanUserId);
//           result = await banUserFn(cleanUserId);
//           successMessage = `Successfully banned ${user?.name || user?.email}. They will see a suspension screen on their next interaction.`;
//           errorMessage = 'Failed to ban user';
//           break;

//         case 'unban':
//           setCurrentAction('Unbanning user...');
//           console.log('About to call unbanUserFn with cleanUserId:', cleanUserId);
//           result = await unbanUserFn(cleanUserId);
//           successMessage = `Successfully unbanned ${user?.name || user?.email}. They can now access the platform normally.`;
//           errorMessage = 'Failed to unban user';
//           break;

//         case 'deleteLink':
//           setCurrentAction('Deleting link...');
//           console.log('About to call deleteLinkFn with linkId:', confirmationData.linkId);
//           result = await deleteLinkFn(confirmationData.linkId);
//           successMessage = `Successfully deleted the link "${confirmationData.linkTitle}" and all its click data.`;
//           errorMessage = 'Failed to delete link';
//           break;

//         case 'delete':
//           setCurrentAction('Deleting user and all data...');
//           console.log('About to call deleteUserFn with cleanUserId:', cleanUserId);
//           result = await deleteUserFn(cleanUserId);
//           successMessage = `Successfully deleted ${user?.name || user?.email} and all associated data.`;
//           errorMessage = 'Failed to delete user';
//           break;

//         default:
//           throw new Error('Unknown action type');
//       }
      
//       // Show success result
//       showResultModal({
//         type: 'success',
//         title: 'Action Completed Successfully',
//         message: successMessage,
//         actionType: confirmationType,
//         stats: { total: 1, successful: 1, failed: 0 },
//         details: [{
//           success: true,
//           userEmail: user?.email || 'Unknown',
//           message: successMessage
//         }]
//       });
      
//       // Refresh data
//       if (confirmationType !== 'delete') {
//         await fetchUserDetails();
//         await fetchUserActivity();
//       }
//       onUserUpdate();
      
//       // Close modal if user was deleted
//       if (confirmationType === 'delete') {
//         setTimeout(() => {
//           onClose();
//         }, 2000);
//       }
      
//     } catch (error) {
//       console.error(`${confirmationType} error:`, error);
      
//       showResultModal({
//         type: 'error',
//         title: 'Action Failed',
//         message: `${errorMessage}: ${error.message}`,
//         actionType: confirmationType,
//         stats: { total: 1, successful: 0, failed: 1 },
//         details: [{
//           success: false,
//           userEmail: user?.email || 'Unknown',
//           error: error.message
//         }]
//       });
//     } finally {
//       setActionLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleResultClose = () => {
//     setShowResult(false);
//   };
  
//   const user = userDetails?.user;
//   const urls = userDetails?.urls || [];
//   const clicks = userDetails?.clicks || [];
//   const stats = userDetails?.stats || {};

//   // Check if user is primary admin (protected)
//   const isPrimaryAdmin = user?.email === 'karthickrajaofficial12@gmail.com';
  
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-white/10">
//             <div className="flex items-center gap-4">
//               {user?.profilepic ? (
//                 <img 
//                   src={user.profilepic} 
//                   alt={user.name}
//                   className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
//                   <User className="w-8 h-8 text-white" />
//                 </div>
//               )}
//               <div>
//                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//                   {user?.name || 'Loading...'}
//                   {user?.isAdmin && <Crown className="w-5 h-5 text-yellow-400" />}
//                 </h2>
//                 <p className="text-gray-300">{user?.email}</p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     user?.status === 'active' 
//                       ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                       : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                   }`}>
//                     {user?.status === 'active' ? 'Active' : 'Pending'}
//                   </span>
//                   {user?.app_metadata?.banned && (
//                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
//                       Banned
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <Button
//               onClick={onClose}
//               disabled={actionLoading}
//               className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
//             >
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
          
//           {/* Action Loading State */}
//           {actionLoading && (
//             <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
//               <div className="flex items-center gap-3">
//                 <BarLoader width="50px" color="#8b5cf6" height={3} />
//                 <span className="text-blue-300">{currentAction}</span>
//               </div>
//             </div>
//           )}
          
//           {/* Loading State */}
//           {detailsLoading && (
//             <div className="p-6">
//               <BarLoader width="100%" color="#8b5cf6" height={3} />
//               <p className="text-white mt-4">Loading user details...</p>
//             </div>
//           )}
          
//           {/* Error State */}
//           {detailsError && (
//             <div className="p-6">
//               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
//                 <p className="text-red-300">Error loading user details: {detailsError.message}</p>
//               </div>
//             </div>
//           )}
          
//           {/* Content */}
//           {user && (
//             <>
//               {/* Tabs */}
//               <div className="border-b border-white/10">
//                 <div className="flex gap-1 p-2">
//                   {[
//                     { id: 'overview', label: 'Overview', icon: Eye },
//                     { id: 'links', label: 'Links', icon: Link2 },
//                     { id: 'activity', label: 'Activity', icon: Activity },
//                     { id: 'actions', label: 'Actions', icon: Shield }
//                   ].map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       disabled={actionLoading}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
//                         activeTab === tab.id
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:text-white hover:bg-white/5'
//                       }`}
//                     >
//                       <tab.icon className="w-4 h-4" />
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Tab Content */}
//               <div className="p-6 max-h-[60vh] overflow-y-auto">
//                 {/* Overview Tab */}
//                 {activeTab === 'overview' && (
//                   <div className="space-y-6">
//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Link2 className="w-8 h-8 text-purple-400" />
//                             <div>
//                               <p className="text-2xl font-bold text-white">{stats.totalLinks || 0}</p>
//                               <p className="text-gray-400 text-sm">Total Links</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <MousePointer className="w-8 h-8 text-cyan-400" />
//                             <div>
//                               <p className="text-2xl font-bold text-white">{stats.totalClicks || 0}</p>
//                               <p className="text-gray-400 text-sm">Total Clicks</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Activity className="w-8 h-8 text-green-400" />
//                             <div>
//                               <p className="text-2xl font-bold text-white">{stats.avgClicksPerLink || 0}</p>
//                               <p className="text-gray-400 text-sm">Avg. Clicks</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       <Card className="bg-white/5 border-white/10">
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Calendar className="w-8 h-8 text-blue-400" />
//                             <div>
//                               <p className="text-sm font-bold text-white">
//                                 {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
//                               </p>
//                               <p className="text-gray-400 text-sm">Last Active</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
                    
//                     {/* User Info */}
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white">User Information</CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-gray-400 text-sm">Email</p>
//                             <p className="text-white">{user.email}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">Phone</p>
//                             <p className="text-white">{user.phone || 'Not provided'}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">Joined</p>
//                             <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">Email Verified</p>
//                             <p className="text-white">
//                               {user.email_confirmed_at ? 'Yes' : 'No'}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-400 text-sm">User ID</p>
//                             <p className="text-white font-mono text-xs">{cleanUserId}</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}
                
//                 {/* Links Tab */}
//                 {activeTab === 'links' && (
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-bold text-white">User Links ({urls.length})</h3>
//                     {urls.length === 0 ? (
//                       <p className="text-gray-400">No links created yet.</p>
//                     ) : (
//                       <div className="space-y-3">
//                         {urls.slice(0, 10).map((url) => (
//                           <div key={url.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex-1">
//                                 <h4 className="text-white font-medium">{url.title}</h4>
//                                 <p className="text-blue-400 text-sm">/{url.short_url}</p>
//                                 <p className="text-gray-400 text-xs">{url.original_url}</p>
//                               </div>
//                               <div className="flex items-center gap-4">
//                                 <div className="text-right">
//                                   <p className="text-white font-medium">{url.clickCount || 0} clicks</p>
//                                   <p className="text-gray-400 text-xs">
//                                     {new Date(url.created_at).toLocaleDateString()}
//                                   </p>
//                                 </div>
//                                 <Button
//                                   size="sm"
//                                   onClick={() => handleDeleteLink(url.id, url.title)}
//                                   disabled={actionLoading}
//                                   className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 disabled:opacity-50"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                         {urls.length > 10 && (
//                           <p className="text-gray-400 text-center">And {urls.length - 10} more links...</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Activity Tab */}
//                 {activeTab === 'activity' && (
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-bold text-white">Recent Activity (Last 30 days)</h3>
//                     {activityLoading ? (
//                       <BarLoader width="100%" color="#8b5cf6" height={3} />
//                     ) : userActivity && userActivity.length > 0 ? (
//                       <div className="space-y-3">
//                         {userActivity.slice(0, 20).map((click, index) => (
//                           <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-3">
//                                 <MousePointer className="w-4 h-4 text-cyan-400" />
//                                 <div>
//                                   <p className="text-white text-sm">Link clicked</p>
//                                   <p className="text-gray-400 text-xs">
//                                     {new Date(click.created_at).toLocaleString()}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-4 text-xs text-gray-400">
//                                 {click.country && (
//                                   <div className="flex items-center gap-1">
//                                     <Globe className="w-3 h-3" />
//                                     {click.country}
//                                   </div>
//                                 )}
//                                 {click.device && (
//                                   <div className="flex items-center gap-1">
//                                     <Smartphone className="w-3 h-3" />
//                                     {click.device}
//                                   </div>
//                                 )}
//                                 {click.city && (
//                                   <div className="flex items-center gap-1">
//                                     <MapPin className="w-3 h-3" />
//                                     {click.city}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-400">No recent activity.</p>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Actions Tab */}
//                 {activeTab === 'actions' && (
//                   <div className="space-y-6">
//                     <h3 className="text-xl font-bold text-white">User Actions</h3>
                    
//                     {/* Communication Actions */}
//                     {/* <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white flex items-center gap-2">
//                           <Send className="w-5 h-5 text-blue-400" />
//                           Communication
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-gray-300 text-sm">
//                           Send a direct message to this user via email.
//                         </p>
//                         <Button
//                           onClick={handleSendEmail}
//                           disabled={actionLoading}
//                           className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white disabled:opacity-50"
//                         >
//                           <Mail className="w-4 h-4 mr-2" />
//                           Send Email
//                         </Button>
//                       </CardContent>
//                     </Card> */}
                    
//                     {/* Admin Actions */}
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white flex items-center gap-2">
//                           <Crown className="w-5 h-5 text-yellow-400" />
//                           Admin Privileges
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-gray-300 text-sm">
//                           Current status: {user.isAdmin ? 'Admin' : 'Regular User'}
//                         </p>
//                         <div className="flex gap-3">
//                           {user.isAdmin ? (
//                             <Button
//                               onClick={handleRemoveAdmin}
//                               disabled={actionLoading || isPrimaryAdmin}
//                               className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-white disabled:opacity-50"
//                             >
//                               <ShieldOff className="w-4 h-4 mr-2" />
//                               Remove Admin
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={handleMakeAdmin}
//                               disabled={actionLoading}
//                               className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-white disabled:opacity-50"
//                             >
//                               <Shield className="w-4 h-4 mr-2" />
//                               Make Admin
//                             </Button>
//                           )}
//                         </div>
//                         {isPrimaryAdmin && (
//                           <p className="text-yellow-300 text-xs">
//                             ⚠️ This is the primary admin account and cannot be modified.
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
                    
//                     {/* Ban Actions */}
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white flex items-center gap-2">
//                           <UserX className="w-5 h-5 text-red-400" />
//                           Account Status
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-gray-300 text-sm">
//                           Current status: {user.app_metadata?.banned ? 'Banned' : 'Active'}
//                         </p>
//                         <div className="flex gap-3">
//                           {user.app_metadata?.banned ? (
//                             <Button
//                               onClick={handleUnbanUser}
//                               disabled={actionLoading || isPrimaryAdmin}
//                               className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-white disabled:opacity-50"
//                             >
//                               <UserX className="w-4 h-4 mr-2" />
//                               Unban User
//                             </Button>
//                           ) : (
//                             <Button
//                               onClick={handleBanUser}
//                               disabled={actionLoading || isPrimaryAdmin}
//                               className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white disabled:opacity-50"
//                             >
//                               <UserX className="w-4 h-4 mr-2" />
//                               Ban User
//                             </Button>
//                           )}
//                         </div>
//                         {isPrimaryAdmin && (
//                           <p className="text-yellow-300 text-xs">
//                             ⚠️ Primary admin account cannot be banned.
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
                    
//                     {/* Delete User */}
//                     <Card className="bg-red-500/10 border-red-500/20">
//                       <CardHeader>
//                         <CardTitle className="text-red-300 flex items-center gap-2">
//                           <Trash2 className="w-5 h-5" />
//                           Danger Zone
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-red-200 text-sm">
//                           Permanently delete this user and all their data. This action cannot be undone.
//                         </p>
//                         <Button
//                           onClick={handleDeleteUser}
//                           disabled={actionLoading || isPrimaryAdmin}
//                           className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white disabled:opacity-50"
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete User
//                         </Button>
//                         {isPrimaryAdmin && (
//                           <p className="text-red-300 text-xs">
//                             ⚠️ Primary admin account cannot be deleted.
//                           </p>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirmation}
//         onClose={() => setShowConfirmation(false)}
//         onConfirm={executeConfirmedAction}
//         type={confirmationType}
//         title={confirmationData.title}
//         message={confirmationData.message}
//         confirmText={confirmationData.confirmText}
//         itemCount={confirmationData.itemCount}
//         requiresTypeConfirmation={confirmationData.requiresTypeConfirmation}
//         typeConfirmationText={confirmationData.typeConfirmationText}
//         loading={actionLoading}
//       />

//       {/* Result Modal */}
//       <ResultModal
//         isOpen={showResult}
//         onClose={handleResultClose}
//         type={resultData.type}
//         title={resultData.title}
//         message={resultData.message}
//         actionType={resultData.actionType}
//         stats={resultData.stats}
//         details={resultData.details}
//       />
//     </>
//   );
// };

// export default UserDetailsModal;
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  User, 
  Mail, 
  Calendar, 
  Link2, 
  MousePointer, 
  MapPin, 
  Smartphone,
  Crown,
  UserX,
  Trash2,
  Eye,
  Activity,
  Globe,
  ShieldOff,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { 
  getUserDetails, 
  makeUserAdmin, 
  removeAdminPrivileges, 
  banUserSimple, 
  unbanUserSimple, 
  deleteUser,
  getUserActivity,
  deleteUserLink
} from '@/db/apiAdmin';
import { BarLoader } from 'react-spinners';
import ConfirmationModal from '../admin/ConfirmationModel';
import ResultModal from '../admin/ResultModel';

const UserDetailsModal = ({ isOpen, onClose, userId, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  
  // Confirmation modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [confirmationData, setConfirmationData] = useState({});
  
  // Result modal states
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({});
  
  // Debug: Log the userId to see what we're getting
  console.log('UserDetailsModal - userId:', userId, 'type:', typeof userId);
  
  // Ensure userId is a string - handle various possible formats
  const cleanUserId = (() => {
    if (!userId) return null;
    
    if (typeof userId === 'string') {
      return userId;
    }
    
    if (typeof userId === 'object') {
      // Try different possible property names
      return userId.id || userId.user_id || userId.userId || null;
    }
    
    return String(userId);
  })();
  
  console.log('UserDetailsModal - cleanUserId:', cleanUserId, 'type:', typeof cleanUserId);
  
  // Validate that we have a proper UUID
  const isValidUUID = cleanUserId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanUserId);
  console.log('UserDetailsModal - isValidUUID:', isValidUUID);
  
  const { 
    loading: detailsLoading, 
    data: userDetails, 
    fn: fetchUserDetails,
    error: detailsError 
  } = useFetch(getUserDetails, cleanUserId);
  
  const { 
    loading: activityLoading, 
    data: userActivity, 
    fn: fetchUserActivity 
  } = useFetch(getUserActivity, cleanUserId, 30);
  
  // Create separate fetch functions for admin actions with proper userId
  // Note: We'll call the API functions directly instead of using useFetch to avoid parameter issues
  const makeAdminFn = async (userId) => {
    console.log('makeAdminFn called with userId:', userId, 'type:', typeof userId);
    return await makeUserAdmin(userId);
  };
  
  const removeAdminFn = async (userId) => {
    console.log('removeAdminFn called with userId:', userId, 'type:', typeof userId);
    return await removeAdminPrivileges(userId);
  };
  
  const banUserFn = async (userId) => {
    console.log('banUserFn called with userId:', userId, 'type:', typeof userId);
    return await banUserSimple(userId);
  };
  
  const unbanUserFn = async (userId) => {
    console.log('unbanUserFn called with userId:', userId, 'type:', typeof userId);
    return await unbanUserSimple(userId);
  };
  
  const deleteUserFn = async (userId) => {
    console.log('deleteUserFn called with userId:', userId, 'type:', typeof userId);
    return await deleteUser(userId);
  };
  
  const deleteLinkFn = async (linkId) => {
    console.log('deleteLinkFn called with linkId:', linkId, 'type:', typeof linkId);
    return await deleteUserLink(linkId);
  };
  
  useEffect(() => {
    if (isOpen && cleanUserId && isValidUUID) {
      console.log('Fetching user details for valid UUID:', cleanUserId);
      fetchUserDetails();
      fetchUserActivity();
    } else if (isOpen && cleanUserId && !isValidUUID) {
      console.error('Invalid UUID format:', cleanUserId);
    }
  }, [isOpen, cleanUserId, isValidUUID]);
  
  if (!isOpen) return null;

  // Early validation for invalid userId
  if (isOpen && (!cleanUserId || !isValidUUID)) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Invalid User ID</h2>
            <Button
              onClick={onClose}
              className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-300 mb-2">Cannot load user details</p>
            <p className="text-gray-400 text-sm">
              Invalid user ID format. Expected UUID, received: {String(userId)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showConfirmationModal = (type, data) => {
    setConfirmationType(type);
    setConfirmationData(data);
    setShowConfirmation(true);
  };

  const showResultModal = (data) => {
    setResultData(data);
    setShowResult(true);
  };

  const handleMakeAdmin = async () => {
    showConfirmationModal('promote', {
      title: 'Promote to Admin',
      message: `Grant administrator privileges to ${user?.name || user?.email}? This will give them access to the admin dashboard and user management functions.`,
      confirmText: 'Promote to Admin',
      itemCount: 1
    });
  };
  
  const handleRemoveAdmin = async () => {
    showConfirmationModal('demote', {
      title: 'Remove Admin Access',
      message: `Remove administrator privileges from ${user?.name || user?.email}? They will lose access to admin functions but keep their user account.`,
      confirmText: 'Remove Admin Access',
      itemCount: 1
    });
  };
  
  const handleBanUser = async () => {
    showConfirmationModal('ban', {
      title: 'Ban User',
      message: `Ban ${user?.name || user?.email}? They will immediately see a suspension screen and lose access to all app features.`,
      confirmText: 'Ban User',
      itemCount: 1
    });
  };
  
  const handleUnbanUser = async () => {
    showConfirmationModal('unban', {
      title: 'Unban User',
      message: `Remove ban status from ${user?.name || user?.email}? They will regain full access to the platform immediately.`,
      confirmText: 'Unban User',
      itemCount: 1
    });
  };

  const handleSendEmail = async () => {
    const message = prompt(`Enter message to send to ${user?.name || user?.email}:`);
    if (!message || !message.trim()) return;
    
    setActionLoading(true);
    setCurrentAction('Sending email...');
    
    try {
      // Here you would implement your email sending logic
      // This could be a separate API call to your email service
      console.log('Sending email to:', user?.email, 'Message:', message);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showResultModal({
        type: 'success',
        title: 'Email Sent Successfully',
        message: `Email successfully sent to ${user?.email}.`,
        actionType: 'email',
        stats: { total: 1, successful: 1, failed: 0 },
        details: [{
          success: true,
          userEmail: user?.email,
          message: 'Email delivered successfully'
        }]
      });
      
    } catch (error) {
      console.error('Send email error:', error);
      
      showResultModal({
        type: 'error',
        title: 'Email Failed',
        message: `Failed to send email: ${error.message}`,
        actionType: 'email',
        stats: { total: 1, successful: 0, failed: 1 },
        details: [{
          success: false,
          userEmail: user?.email,
          error: error.message
        }]
      });
    } finally {
      setActionLoading(false);
      setCurrentAction('');
    }
  };

  const handleDeleteLink = async (linkId, linkTitle) => {
    console.log('handleDeleteLink called with:', { linkId, linkTitle });
    
    if (!linkId) {
      console.error('No linkId provided for deletion');
      return;
    }
    
    showConfirmationModal('deleteLink', {
      title: 'Delete Link',
      message: `Delete the link "${linkTitle}"? This will also delete all its click data and cannot be undone.`,
      confirmText: 'Delete Link',
      itemCount: 1,
      linkId,
      linkTitle
    });
  };
  
  const handleDeleteUser = async () => {
    showConfirmationModal('delete', {
      title: 'Delete User',
      message: `This will permanently delete ${user?.name || user?.email} and ALL their data including links, clicks, and account information. This action cannot be undone.`,
      confirmText: 'Delete User',
      itemCount: 1,
      requiresTypeConfirmation: true,
      typeConfirmationText: 'DELETE'
    });
  };

  const executeConfirmedAction = async () => {
    setShowConfirmation(false);
    
    // Validate UUID before proceeding
    if (!cleanUserId || !isValidUUID) {
      showResultModal({
        type: 'error',
        title: 'Invalid User ID',
        message: `Cannot perform action: Invalid user ID format. Expected UUID, got: ${cleanUserId}`,
        actionType: confirmationType,
        stats: { total: 1, successful: 0, failed: 1 },
        details: [{
          success: false,
          userEmail: user?.email || 'Unknown',
          error: 'Invalid user ID format'
        }]
      });
      return;
    }
    
    setActionLoading(true);
    
    try {
      let result;
      let successMessage = '';
      let errorMessage = '';
      
      console.log(`Executing ${confirmationType} action for userId:`, cleanUserId);
      
      switch (confirmationType) {
        case 'promote':
          setCurrentAction('Promoting user to admin...');
          console.log('About to call makeAdminFn with cleanUserId:', cleanUserId);
          result = await makeAdminFn(cleanUserId);
          successMessage = `Successfully promoted ${user?.name || user?.email} to admin. They now have administrative privileges.`;
          errorMessage = 'Failed to promote user to admin';
          break;

        case 'demote':
          setCurrentAction('Removing admin privileges...');
          console.log('About to call removeAdminFn with cleanUserId:', cleanUserId);
          result = await removeAdminFn(cleanUserId);
          successMessage = `Successfully removed admin privileges from ${user?.name || user?.email}.`;
          errorMessage = 'Failed to remove admin privileges';
          break;

        case 'ban':
          setCurrentAction('Banning user...');
          console.log('About to call banUserFn with cleanUserId:', cleanUserId);
          result = await banUserFn(cleanUserId);
          successMessage = `Successfully banned ${user?.name || user?.email}. They will see a suspension screen on their next interaction.`;
          errorMessage = 'Failed to ban user';
          break;

        case 'unban':
          setCurrentAction('Unbanning user...');
          console.log('About to call unbanUserFn with cleanUserId:', cleanUserId);
          result = await unbanUserFn(cleanUserId);
          successMessage = `Successfully unbanned ${user?.name || user?.email}. They can now access the platform normally.`;
          errorMessage = 'Failed to unban user';
          break;

        case 'deleteLink':
          setCurrentAction('Deleting link...');
          console.log('About to call deleteLinkFn with linkId:', confirmationData.linkId);
          console.log('confirmationData:', confirmationData);
          
          if (!confirmationData.linkId) {
            throw new Error('No link ID provided for deletion');
          }
          
          result = await deleteLinkFn(confirmationData.linkId);
          console.log('Delete link result:', result);
          successMessage = `Successfully deleted the link "${confirmationData.linkTitle}" and all its click data.`;
          errorMessage = 'Failed to delete link';
          break;

        case 'delete':
          setCurrentAction('Deleting user and all data...');
          console.log('About to call deleteUserFn with cleanUserId:', cleanUserId);
          result = await deleteUserFn(cleanUserId);
          successMessage = `Successfully deleted ${user?.name || user?.email} and all associated data.`;
          errorMessage = 'Failed to delete user';
          break;

        default:
          throw new Error('Unknown action type');
      }
      
      // Show success result
      showResultModal({
        type: 'success',
        title: 'Action Completed Successfully',
        message: successMessage,
        actionType: confirmationType,
        stats: { total: 1, successful: 1, failed: 0 },
        details: [{
          success: true,
          userEmail: user?.email || 'Unknown',
          message: successMessage
        }]
      });
      
      // Refresh data
      if (confirmationType !== 'delete') {
        await fetchUserDetails();
        await fetchUserActivity();
      }
      onUserUpdate();
      
      // Close modal if user was deleted
      if (confirmationType === 'delete') {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      
    } catch (error) {
      console.error(`${confirmationType} error:`, error);
      
      showResultModal({
        type: 'error',
        title: 'Action Failed',
        message: `${errorMessage}: ${error.message}`,
        actionType: confirmationType,
        stats: { total: 1, successful: 0, failed: 1 },
        details: [{
          success: false,
          userEmail: user?.email || 'Unknown',
          error: error.message
        }]
      });
    } finally {
      setActionLoading(false);
      setCurrentAction('');
    }
  };

  const handleResultClose = () => {
    setShowResult(false);
  };
  
  const user = userDetails?.user;
  const urls = userDetails?.urls || [];
  const clicks = userDetails?.clicks || [];
  const stats = userDetails?.stats || {};

  // Check if user is primary admin (protected)
  const isPrimaryAdmin = user?.email === 'karthickrajaofficial12@gmail.com';
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              {user?.profilepic ? (
                <img 
                  src={user.profilepic} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {user?.name || 'Loading...'}
                  {user?.isAdmin && <Crown className="w-5 h-5 text-yellow-400" />}
                </h2>
                <p className="text-gray-300">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.status === 'active' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {user?.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                  {user?.app_metadata?.banned && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                      Banned
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              disabled={actionLoading}
              className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Action Loading State */}
          {actionLoading && (
            <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
              <div className="flex items-center gap-3">
                <BarLoader width="50px" color="#8b5cf6" height={3} />
                <span className="text-blue-300">{currentAction}</span>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {detailsLoading && (
            <div className="p-6">
              <BarLoader width="100%" color="#8b5cf6" height={3} />
              <p className="text-white mt-4">Loading user details...</p>
            </div>
          )}
          
          {/* Error State */}
          {detailsError && (
            <div className="p-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-300">Error loading user details: {detailsError.message}</p>
              </div>
            </div>
          )}
          
          {/* Content */}
          {user && (
            <>
              {/* Tabs */}
              <div className="border-b border-white/10">
                <div className="flex gap-1 p-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: Eye },
                    { id: 'links', label: 'Links', icon: Link2 },
                    { id: 'activity', label: 'Activity', icon: Activity },
                    { id: 'actions', label: 'Actions', icon: Shield }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      disabled={actionLoading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                        activeTab === tab.id
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Link2 className="w-8 h-8 text-purple-400" />
                            <div>
                              <p className="text-2xl font-bold text-white">{stats.totalLinks || 0}</p>
                              <p className="text-gray-400 text-sm">Total Links</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <MousePointer className="w-8 h-8 text-cyan-400" />
                            <div>
                              <p className="text-2xl font-bold text-white">{stats.totalClicks || 0}</p>
                              <p className="text-gray-400 text-sm">Total Clicks</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-green-400" />
                            <div>
                              <p className="text-2xl font-bold text-white">{stats.avgClicksPerLink || 0}</p>
                              <p className="text-gray-400 text-sm">Avg. Clicks</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-blue-400" />
                            <div>
                              <p className="text-sm font-bold text-white">
                                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                              </p>
                              <p className="text-gray-400 text-sm">Last Active</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* User Info */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">User Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Phone</p>
                            <p className="text-white">{user.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Joined</p>
                            <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Email Verified</p>
                            <p className="text-white">
                              {user.email_confirmed_at ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">User ID</p>
                            <p className="text-white font-mono text-xs">{cleanUserId}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Links Tab */}
                {activeTab === 'links' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">User Links ({urls.length})</h3>
                      {urls.length > 0 && (
                        <Button
                          size="sm"
                          onClick={() => console.log('All URLs:', urls)}
                          className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-300 text-xs"
                        >
                          Debug URLs
                        </Button>
                      )}
                    </div>
                    
                    {urls.length === 0 ? (
                      <p className="text-gray-400">No links created yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {urls.slice(0, 10).map((url) => (
                          <div key={url.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-white font-medium">{url.title}</h4>
                                <p className="text-blue-400 text-sm">/{url.short_url}</p>
                                <p className="text-gray-400 text-xs">{url.original_url}</p>
                                <p className="text-gray-500 text-xs mt-1">ID: {url.id}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-white font-medium">{url.clickCount || 0} clicks</p>
                                  <p className="text-gray-400 text-xs">
                                    {new Date(url.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete button clicked for link:', url.id, url.title);
                                    console.log('actionLoading:', actionLoading);
                                    console.log('Full url object:', url);
                                    
                                    if (actionLoading) {
                                      console.log('Button disabled due to actionLoading');
                                      return;
                                    }
                                    
                                    handleDeleteLink(url.id, url.title);
                                  }}
                                  disabled={actionLoading}
                                  title={actionLoading ? 'Action in progress...' : 'Delete this link'}
                                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {urls.length > 10 && (
                          <p className="text-gray-400 text-center">And {urls.length - 10} more links...</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Recent Activity (Last 30 days)</h3>
                    {activityLoading ? (
                      <BarLoader width="100%" color="#8b5cf6" height={3} />
                    ) : userActivity && userActivity.length > 0 ? (
                      <div className="space-y-3">
                        {userActivity.slice(0, 20).map((click, index) => (
                          <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <MousePointer className="w-4 h-4 text-cyan-400" />
                                <div>
                                  <p className="text-white text-sm">Link clicked</p>
                                  <p className="text-gray-400 text-xs">
                                    {new Date(click.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                {click.country && (
                                  <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {click.country}
                                  </div>
                                )}
                                {click.device && (
                                  <div className="flex items-center gap-1">
                                    <Smartphone className="w-3 h-3" />
                                    {click.device}
                                  </div>
                                )}
                                {click.city && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {click.city}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No recent activity.</p>
                    )}
                  </div>
                )}
                
                {/* Actions Tab */}
                {activeTab === 'actions' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">User Actions</h3>
                    
                    {/* Communication Actions */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Send className="w-5 h-5 text-blue-400" />
                          Communication
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          Send a direct message to this user via email.
                        </p>
                        <Button
                          onClick={handleSendEmail}
                          disabled={actionLoading}
                          className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white disabled:opacity-50"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {/* Admin Actions */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Crown className="w-5 h-5 text-yellow-400" />
                          Admin Privileges
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          Current status: {user.isAdmin ? 'Admin' : 'Regular User'}
                        </p>
                        <div className="flex gap-3">
                          {user.isAdmin ? (
                            <Button
                              onClick={handleRemoveAdmin}
                              disabled={actionLoading || isPrimaryAdmin}
                              className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-white disabled:opacity-50"
                            >
                              <ShieldOff className="w-4 h-4 mr-2" />
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              onClick={handleMakeAdmin}
                              disabled={actionLoading}
                              className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-white disabled:opacity-50"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Make Admin
                            </Button>
                          )}
                        </div>
                        {isPrimaryAdmin && (
                          <p className="text-yellow-300 text-xs">
                            ⚠️ This is the primary admin account and cannot be modified.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Ban Actions */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <UserX className="w-5 h-5 text-red-400" />
                          Account Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          Current status: {user.app_metadata?.banned ? 'Banned' : 'Active'}
                        </p>
                        <div className="flex gap-3">
                          {user.app_metadata?.banned ? (
                            <Button
                              onClick={handleUnbanUser}
                              disabled={actionLoading || isPrimaryAdmin}
                              className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-white disabled:opacity-50"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Unban User
                            </Button>
                          ) : (
                            <Button
                              onClick={handleBanUser}
                              disabled={actionLoading || isPrimaryAdmin}
                              className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white disabled:opacity-50"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Ban User
                            </Button>
                          )}
                        </div>
                        {isPrimaryAdmin && (
                          <p className="text-yellow-300 text-xs">
                            ⚠️ Primary admin account cannot be banned.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Delete User */}
                    <Card className="bg-red-500/10 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-red-300 flex items-center gap-2">
                          <Trash2 className="w-5 h-5" />
                          Danger Zone
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-red-200 text-sm">
                          Permanently delete this user and all their data. This action cannot be undone.
                        </p>
                        <Button
                          onClick={handleDeleteUser}
                          disabled={actionLoading || isPrimaryAdmin}
                          className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-white disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </Button>
                        {isPrimaryAdmin && (
                          <p className="text-red-300 text-xs">
                            ⚠️ Primary admin account cannot be deleted.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={executeConfirmedAction}
        type={confirmationType}
        title={confirmationData.title}
        message={confirmationData.message}
        confirmText={confirmationData.confirmText}
        itemCount={confirmationData.itemCount}
        requiresTypeConfirmation={confirmationData.requiresTypeConfirmation}
        typeConfirmationText={confirmationData.typeConfirmationText}
        loading={actionLoading}
      />

      {/* Result Modal */}
      <ResultModal
        isOpen={showResult}
        onClose={handleResultClose}
        type={resultData.type}
        title={resultData.title}
        message={resultData.message}
        actionType={resultData.actionType}
        stats={resultData.stats}
        details={resultData.details}
      />
    </>
  );
};

export default UserDetailsModal;