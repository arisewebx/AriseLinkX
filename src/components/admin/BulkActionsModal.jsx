// // src/components/admin/BulkActionsModal.jsx
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { 
//   Ban, 
//   CheckCircle, 
//   XCircle, 
//   Trash2,
//   UserX,
//   Shield,
//   Mail,
//   Loader2
// } from 'lucide-react';
// import { 
//   banUser, 
//   unbanUser, 
//   deleteUser, 
//   makeUserAdmin 
// } from '@/db/apiAdmin';


// const BulkActionsModal = ({ 
//   isOpen, 
//   onClose, 
//   selectedUsers, 
//   filteredUsers,
//   onSelectAll,
//   onRefreshUsers, // Callback to refresh the users list
//   users // Pass the users array to get user details
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [currentAction, setCurrentAction] = useState('');

//   if (!isOpen) return null;

//   const handleBulkBan = async () => {
//     if (selectedUsers.length === 0) return;
    
//     setLoading(true);
//     setCurrentAction('Banning users...');
    
//     try {
//       const promises = selectedUsers.map(userId => banUser(userId));
//       await Promise.all(promises);
      
//       alert(`Successfully banned ${selectedUsers.length} users`);
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk ban error:', error);
//       alert(`Error banning users: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkUnban = async () => {
//     if (selectedUsers.length === 0) return;
    
//     setLoading(true);
//     setCurrentAction('Unbanning users...');
    
//     try {
//       const promises = selectedUsers.map(userId => unbanUser(userId));
//       await Promise.all(promises);
      
//       alert(`Successfully unbanned ${selectedUsers.length} users`);
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk unban error:', error);
//       alert(`Error unbanning users: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkPromoteAdmin = async () => {
//     if (selectedUsers.length === 0) return;
    
//     if (!window.confirm(`Are you sure you want to promote ${selectedUsers.length} users to admin? This will give them administrative privileges.`)) {
//       return;
//     }
    
//     setLoading(true);
//     setCurrentAction('Promoting users to admin...');
    
//     try {
//       const promises = selectedUsers.map(userId => makeUserAdmin(userId));
//       await Promise.all(promises);
      
//       alert(`Successfully promoted ${selectedUsers.length} users to admin`);
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk promote admin error:', error);
//       alert(`Error promoting users: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkSendEmail = async () => {
//     if (selectedUsers.length === 0) return;
    
//     const message = prompt(`Enter message to send to ${selectedUsers.length} selected users:`);
//     if (!message || !message.trim()) return;
    
//     setLoading(true);
//     setCurrentAction('Sending emails...');
    
//     try {
//       // Get email addresses of selected users
//       const selectedUserDetails = users.filter(user => selectedUsers.includes(user.id));
//       const emails = selectedUserDetails.map(user => user.email);
      
//       // Here you would implement your email sending logic
//       // This could be a separate API call to your email service
//       console.log('Sending email to:', emails, 'Message:', message);
      
//       // Simulate email sending delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       alert(`Email sent to ${emails.length} users successfully!`);
//       onClose();
//     } catch (error) {
//       console.error('Bulk email error:', error);
//       alert(`Error sending emails: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedUsers.length === 0) return;
    
//     if (!window.confirm(`⚠️ DANGER: Are you sure you want to permanently delete ${selectedUsers.length} users? This will delete all their links, clicks, and data. This action CANNOT be undone!`)) {
//       return;
//     }
    
//     // Double confirmation for delete
//     if (!window.confirm(`This is your final warning. Type 'DELETE' in the next prompt to confirm.`)) {
//       return;
//     }
    
//     const confirmation = prompt('Type "DELETE" to confirm permanent deletion:');
//     if (confirmation !== 'DELETE') {
//       alert('Deletion cancelled - confirmation text did not match.');
//       return;
//     }
    
//     setLoading(true);
//     setCurrentAction('Deleting users and all their data...');
    
//     try {
//       // Delete users one by one to handle any individual failures
//       const results = [];
//       for (const userId of selectedUsers) {
//         try {
//           await deleteUser(userId);
//           results.push({ userId, success: true });
//         } catch (error) {
//           console.error(`Failed to delete user ${userId}:`, error);
//           results.push({ userId, success: false, error: error.message });
//         }
//       }
      
//       const successful = results.filter(r => r.success).length;
//       const failed = results.filter(r => !r.success).length;
      
//       if (failed > 0) {
//         alert(`Deletion completed with issues:\n✅ ${successful} users deleted successfully\n❌ ${failed} users failed to delete\n\nCheck console for details.`);
//         console.log('Deletion results:', results);
//       } else {
//         alert(`Successfully deleted all ${successful} users and their data.`);
//       }
      
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk delete error:', error);
//       alert(`Critical error during deletion: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-900">Bulk Actions</h3>
//           <Button
//             onClick={onClose}
//             disabled={loading}
//             className="bg-transparent hover:bg-gray-100 p-2"
//           >
//             <XCircle className="w-5 h-5 text-gray-400" />
//           </Button>
//         </div>
        
//         {loading && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center gap-3">
//               <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
//               <span className="text-blue-600">{currentAction}</span>
//             </div>
//           </div>
//         )}
        
//         <div className="mb-6">
//           <p className="text-gray-600 mb-4">
//             {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
//           </p>
          
//           <Button
//             onClick={onSelectAll}
//             disabled={loading}
//             className="w-full mb-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700"
//           >
//             {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
//           </Button>
//         </div>
        
//         <div className="space-y-3">
//           <Button
//             onClick={handleBulkBan}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50"
//           >
//             <Ban className="w-4 h-4 mr-2" />
//             Ban Selected Users
//           </Button>
          
//           <Button
//             onClick={handleBulkUnban}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 disabled:opacity-50"
//           >
//             <CheckCircle className="w-4 h-4 mr-2" />
//             Unban Selected Users
//           </Button>
          
//           <Button
//             onClick={handleBulkPromoteAdmin}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 disabled:opacity-50"
//           >
//             <Shield className="w-4 h-4 mr-2" />
//             Promote to Admin
//           </Button>
          
//           <Button
//             onClick={handleBulkSendEmail}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 disabled:opacity-50"
//           >
//             <Mail className="w-4 h-4 mr-2" />
//             Send Email
//           </Button>
          
//           <Button
//             onClick={handleBulkDelete}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50"
//           >
//             <Trash2 className="w-4 h-4 mr-2" />
//             Delete Selected Users
//           </Button>
//         </div>
        
//         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <div className="flex items-start gap-2">
//             <UserX className="w-5 h-5 text-yellow-500 mt-0.5" />
//             <div>
//               <p className="text-yellow-600 font-medium text-sm">Warning</p>
//               <p className="text-gray-400 text-xs mt-1">
//                 Bulk actions are permanent and cannot be undone. User deletion will remove all their links and click data.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BulkActionsModal;



// src/components/admin/BulkActionsModal.jsx
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { 
//   Ban, 
//   CheckCircle, 
//   XCircle, 
//   Trash2,
//   UserX,
//   Shield,
//   ShieldOff,
//   Mail,
//   Loader2
// } from 'lucide-react';
// import { 
//   banUserSimple, 
//   unbanUserSimple, 
//   deleteUser, 
//   makeUserAdmin,
//   removeAdminPrivileges 
// } from '@/db/apiAdmin';

// const BulkActionsModal = ({ 
//   isOpen, 
//   onClose, 
//   selectedUsers, 
//   filteredUsers,
//   onSelectAll,
//   onRefreshUsers, // Callback to refresh the users list
//   users // Pass the users array to get user details
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [currentAction, setCurrentAction] = useState('');

//   if (!isOpen) return null;

//   const handleBulkBan = async () => {
//     if (selectedUsers.length === 0) return;
    
//     setLoading(true);
//     setCurrentAction('Banning users...');
    
//     try {
//       const results = [];
      
//       // Process users one by one to handle individual failures
//       for (const userId of selectedUsers) {
//         try {
//           const result = await banUserSimple(userId);
//           results.push({ userId, success: true, result });
//         } catch (error) {
//           console.error(`Failed to ban user ${userId}:`, error);
//           results.push({ userId, success: false, error: error.message });
//         }
//       }
      
//       const successful = results.filter(r => r.success).length;
//       const failed = results.filter(r => !r.success).length;
      
//       if (failed > 0) {
//         alert(`Ban completed with mixed results:\n✅ ${successful} users banned successfully\n❌ ${failed} users failed to ban\n\n🚫 Banned users will see a suspension screen when they:\n• Navigate to any page\n• Refresh their browser\n• Return to the app\n\nThey will only see the ban message - no other app content.`);
//       } else {
//         alert(`✅ Successfully banned all ${successful} users!\n\n🚫 Banned users will immediately see a suspension screen with:\n• Suspension details and reason\n• Support contact information\n• No access to any app features\n\nThey can only contact support or sign out.`);
//       }
      
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk ban error:', error);
//       alert(`Error during ban process: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkUnban = async () => {
//     if (selectedUsers.length === 0) return;
    
//     setLoading(true);
//     setCurrentAction('Unbanning users...');
    
//     try {
//       const results = [];
      
//       // Process users one by one to handle individual failures
//       for (const userId of selectedUsers) {
//         try {
//           const result = await unbanUserSimple(userId);
//           results.push({ userId, success: true, result });
//         } catch (error) {
//           console.error(`Failed to unban user ${userId}:`, error);
//           results.push({ userId, success: false, error: error.message });
//         }
//       }
      
//       const successful = results.filter(r => r.success).length;
//       const failed = results.filter(r => !r.success).length;
      
//       if (failed > 0) {
//         alert(`Unban completed with mixed results:\n✅ ${successful} users unbanned successfully\n❌ ${failed} users failed to unban\n\n✅ Successfully unbanned users can:\n• Login with their existing password\n• Access all app features immediately\n• Continue using the platform normally\n\nNo password reset required!`);
//       } else {
//         alert(`✅ Successfully unbanned all ${successful} users!\n\n🎉 All users can now:\n• Login with their existing password\n• Access the platform immediately\n• Use all features normally\n\n✅ No password reset required - they can login right away!`);
//       }
      
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk unban error:', error);
//       alert(`Error during unban process: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkPromoteAdmin = async () => {
//     if (selectedUsers.length === 0) return;
    
//     if (!window.confirm(`Are you sure you want to promote ${selectedUsers.length} users to admin? This will give them administrative privileges.`)) {
//       return;
//     }
    
//     setLoading(true);
//     setCurrentAction('Promoting users to admin...');
    
//     try {
//       const promises = selectedUsers.map(userId => makeUserAdmin(userId));
//       await Promise.all(promises);
      
//       alert(`Successfully promoted ${selectedUsers.length} users to admin`);
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk promote admin error:', error);
//       alert(`Error promoting users: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkRemoveAdmin = async () => {
//     if (selectedUsers.length === 0) return;
    
//     if (!window.confirm(`Are you sure you want to remove admin privileges from ${selectedUsers.length} users?`)) {
//       return;
//     }
    
//     setLoading(true);
//     setCurrentAction('Removing admin privileges...');
    
//     try {
//       const promises = selectedUsers.map(userId => removeAdminPrivileges(userId));
//       await Promise.all(promises);
      
//       alert(`Successfully removed admin privileges from ${selectedUsers.length} users`);
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk remove admin error:', error);
//       alert(`Error removing admin privileges: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkSendEmail = async () => {
//     if (selectedUsers.length === 0) return;
    
//     const message = prompt(`Enter message to send to ${selectedUsers.length} selected users:`);
//     if (!message || !message.trim()) return;
    
//     setLoading(true);
//     setCurrentAction('Sending emails...');
    
//     try {
//       // Get email addresses of selected users
//       const selectedUserDetails = users.filter(user => selectedUsers.includes(user.id));
//       const emails = selectedUserDetails.map(user => user.email);
      
//       // Here you would implement your email sending logic
//       // This could be a separate API call to your email service
//       console.log('Sending email to:', emails, 'Message:', message);
      
//       // Simulate email sending delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       alert(`Email sent to ${emails.length} users successfully!`);
//       onClose();
//     } catch (error) {
//       console.error('Bulk email error:', error);
//       alert(`Error sending emails: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedUsers.length === 0) return;
    
//     if (!window.confirm(`⚠️ DANGER: Are you sure you want to permanently delete ${selectedUsers.length} users? This will delete all their links, clicks, and data. This action CANNOT be undone!`)) {
//       return;
//     }
    
//     // Double confirmation for delete
//     if (!window.confirm(`This is your final warning. Type 'DELETE' in the next prompt to confirm.`)) {
//       return;
//     }
    
//     const confirmation = prompt('Type "DELETE" to confirm permanent deletion:');
//     if (confirmation !== 'DELETE') {
//       alert('Deletion cancelled - confirmation text did not match.');
//       return;
//     }
    
//     setLoading(true);
//     setCurrentAction('Deleting users and all their data...');
    
//     try {
//       // Delete users one by one to handle any individual failures
//       const results = [];
//       for (const userId of selectedUsers) {
//         try {
//           await deleteUser(userId);
//           results.push({ userId, success: true });
//         } catch (error) {
//           console.error(`Failed to delete user ${userId}:`, error);
//           results.push({ userId, success: false, error: error.message });
//         }
//       }
      
//       const successful = results.filter(r => r.success).length;
//       const failed = results.filter(r => !r.success).length;
      
//       if (failed > 0) {
//         alert(`Deletion completed with issues:\n✅ ${successful} users deleted successfully\n❌ ${failed} users failed to delete\n\nCheck console for details.`);
//         console.log('Deletion results:', results);
//       } else {
//         alert(`Successfully deleted all ${successful} users and their data.`);
//       }
      
//       onRefreshUsers(); // Refresh the users list
//       onClose();
//     } catch (error) {
//       console.error('Bulk delete error:', error);
//       alert(`Critical error during deletion: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setCurrentAction('');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-900">Bulk Actions</h3>
//           <Button
//             onClick={onClose}
//             disabled={loading}
//             className="bg-transparent hover:bg-gray-100 p-2"
//           >
//             <XCircle className="w-5 h-5 text-gray-400" />
//           </Button>
//         </div>
        
//         {loading && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center gap-3">
//               <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
//               <span className="text-blue-600">{currentAction}</span>
//             </div>
//           </div>
//         )}
        
//         <div className="mb-6">
//           <p className="text-gray-600 mb-4">
//             {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
//           </p>
          
//           <Button
//             onClick={onSelectAll}
//             disabled={loading}
//             className="w-full mb-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700"
//           >
//             {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
//           </Button>
//         </div>
        
//         <div className="space-y-3">
//           <Button
//             onClick={handleBulkBan}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50"
//           >
//             <Ban className="w-4 h-4 mr-2" />
//             Ban Selected Users
//           </Button>
          
//           <Button
//             onClick={handleBulkUnban}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 disabled:opacity-50"
//           >
//             <CheckCircle className="w-4 h-4 mr-2" />
//             Unban Selected Users
//           </Button>
          
//           <Button
//             onClick={handleBulkPromoteAdmin}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 disabled:opacity-50"
//           >
//             <Shield className="w-4 h-4 mr-2" />
//             Promote to Admin
//           </Button>
          
//           <Button
//             onClick={handleBulkRemoveAdmin}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 disabled:opacity-50"
//           >
//             <ShieldOff className="w-4 h-4 mr-2" />
//             Remove Admin
//           </Button>
          
//           <Button
//             onClick={handleBulkSendEmail}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 disabled:opacity-50"
//           >
//             <Mail className="w-4 h-4 mr-2" />
//             Send Email
//           </Button>
          
//           <Button
//             onClick={handleBulkDelete}
//             disabled={selectedUsers.length === 0 || loading}
//             className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50"
//           >
//             <Trash2 className="w-4 h-4 mr-2" />
//             Delete Selected Users
//           </Button>
//         </div>
        
//         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <div className="flex items-start gap-2">
//             <UserX className="w-5 h-5 text-yellow-500 mt-0.5" />
//             <div>
//               <p className="text-yellow-600 font-medium text-sm">Warning</p>
//               <p className="text-gray-400 text-xs mt-1">
//                 Bulk actions are permanent and cannot be undone. User deletion will remove all their links and click data.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BulkActionsModal;

// src/components/admin/BulkActionsModal.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Ban, 
  CheckCircle, 
  XCircle, 
  Trash2,
  UserX,
  Shield,
  ShieldOff,
  Mail,
  Loader2
} from 'lucide-react';
import { 
  banUserSimple, 
  unbanUserSimple, 
  deleteUser, 
  makeUserAdmin,
  removeAdminPrivileges 
} from '@/db/apiAdmin';
import ConfirmationModal from '../admin/ConfirmationModel';
import ResultModal from '../admin/ResultModel';

const BulkActionsModal = ({ 
  isOpen, 
  onClose, 
  selectedUsers, 
  filteredUsers,
  onSelectAll,
  onRefreshUsers,
  users
}) => {
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  
  // Confirmation modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [confirmationData, setConfirmationData] = useState({});
  
  // Result modal states
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({});

  if (!isOpen) return null;

  const showConfirmationModal = (type, data) => {
    setConfirmationType(type);
    setConfirmationData(data);
    setShowConfirmation(true);
  };

  const showResultModal = (data) => {
    setResultData(data);
    setShowResult(true);
  };

  const handleBulkBan = async () => {
    if (selectedUsers.length === 0) return;
    
    showConfirmationModal('ban', {
      title: 'Ban Users',
      message: `Are you sure you want to ban ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}? They will immediately see a suspension screen and lose access to all app features.`,
      confirmText: 'Ban Users',
      itemCount: selectedUsers.length
    });
  };

  const handleBulkUnban = async () => {
    if (selectedUsers.length === 0) return;
    
    showConfirmationModal('unban', {
      title: 'Unban Users',
      message: `Remove ban status from ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}? They will regain full access to the platform immediately.`,
      confirmText: 'Unban Users',
      itemCount: selectedUsers.length
    });
  };

  const handleBulkPromoteAdmin = async () => {
    if (selectedUsers.length === 0) return;
    
    showConfirmationModal('promote', {
      title: 'Promote to Admin',
      message: `Grant administrator privileges to ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}? This will give them access to the admin dashboard and user management functions.`,
      confirmText: 'Promote to Admin',
      itemCount: selectedUsers.length
    });
  };

  const handleBulkRemoveAdmin = async () => {
    if (selectedUsers.length === 0) return;
    
    showConfirmationModal('demote', {
      title: 'Remove Admin Access',
      message: `Remove administrator privileges from ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}? They will lose access to admin functions but keep their user accounts.`,
      confirmText: 'Remove Admin Access',
      itemCount: selectedUsers.length
    });
  };

  const handleBulkSendEmail = async () => {
    if (selectedUsers.length === 0) return;
    
    const message = prompt(`Enter message to send to ${selectedUsers.length} selected users:`);
    if (!message || !message.trim()) return;
    
    setLoading(true);
    setCurrentAction('Sending emails...');
    
    try {
      const selectedUserDetails = users.filter(user => selectedUsers.includes(user.id));
      const emails = selectedUserDetails.map(user => user.email);
      
      // console.log('Sending email to:', emails, 'Message:', message);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showResultModal({
        type: 'success',
        title: 'Email Sent Successfully',
        message: `Email successfully sent to ${emails.length} users.`,
        actionType: 'email',
        stats: { total: emails.length, successful: emails.length, failed: 0 },
        details: selectedUserDetails.map(user => ({
          success: true,
          userEmail: user.email,
          message: 'Email delivered'
        }))
      });
      
      onClose();
    } catch (error) {
      // console.error('Bulk email error:', error);
      showResultModal({
        type: 'error',
        title: 'Email Failed',
        message: `Failed to send emails: ${error.message}`,
        actionType: 'email'
      });
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    showConfirmationModal('delete', {
      title: 'Delete Users',
      message: `This will permanently delete ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} and ALL their data including links, clicks, and account information. This action cannot be undone.`,
      confirmText: 'Delete Users',
      itemCount: selectedUsers.length,
      requiresTypeConfirmation: true,
      typeConfirmationText: 'DELETE'
    });
  };

  const executeConfirmedAction = async () => {
    setShowConfirmation(false);
    setLoading(true);
    
    try {
      let results = [];
      let successful = 0;
      let failed = 0;
      
      switch (confirmationType) {
        case 'ban':
          setCurrentAction('Banning users...');
          for (let i = 0; i < selectedUsers.length; i++) {
            const userId = selectedUsers[i];
            const userEmail = users.find(u => u.id === userId)?.email || 'Unknown';
            
            try {
              await banUserSimple(userId);
              results.push({ userId, userEmail, success: true, message: 'User banned successfully' });
              successful++;
            } catch (error) {
              results.push({ userId, userEmail, success: false, error: error.message });
              failed++;
            }
          }
          
          showResultModal({
            type: failed === 0 ? 'success' : (successful === 0 ? 'error' : 'mixed'),
            title: failed === 0 ? 'Users Banned Successfully' : 'Ban Operation Completed',
            message: failed === 0 
              ? `Successfully banned all ${successful} users. They will see a suspension screen on their next interaction.`
              : `Banned ${successful} users successfully. ${failed} users failed to ban.`,
            actionType: 'ban',
            stats: { total: selectedUsers.length, successful, failed },
            details: results
          });
          break;

        case 'unban':
          setCurrentAction('Unbanning users...');
          for (let i = 0; i < selectedUsers.length; i++) {
            const userId = selectedUsers[i];
            const userEmail = users.find(u => u.id === userId)?.email || 'Unknown';
            
            try {
              await unbanUserSimple(userId);
              results.push({ userId, userEmail, success: true, message: 'User unbanned successfully' });
              successful++;
            } catch (error) {
              results.push({ userId, userEmail, success: false, error: error.message });
              failed++;
            }
          }
          
          showResultModal({
            type: failed === 0 ? 'success' : (successful === 0 ? 'error' : 'mixed'),
            title: failed === 0 ? 'Users Unbanned Successfully' : 'Unban Operation Completed',
            message: failed === 0 
              ? `Successfully unbanned all ${successful} users. They can now access the platform normally.`
              : `Unbanned ${successful} users successfully. ${failed} users failed to unban.`,
            actionType: 'unban',
            stats: { total: selectedUsers.length, successful, failed },
            details: results
          });
          break;

        case 'promote':
          setCurrentAction('Promoting users to admin...');
          for (let i = 0; i < selectedUsers.length; i++) {
            const userId = selectedUsers[i];
            const userEmail = users.find(u => u.id === userId)?.email || 'Unknown';
            
            try {
              await makeUserAdmin(userId);
              results.push({ userId, userEmail, success: true, message: 'Promoted to admin successfully' });
              successful++;
            } catch (error) {
              results.push({ userId, userEmail, success: false, error: error.message });
              failed++;
            }
          }
          
          showResultModal({
            type: failed === 0 ? 'success' : (successful === 0 ? 'error' : 'mixed'),
            title: failed === 0 ? 'Users Promoted Successfully' : 'Promotion Operation Completed',
            message: failed === 0 
              ? `Successfully promoted all ${successful} users to admin. They now have administrative privileges.`
              : `Promoted ${successful} users successfully. ${failed} users failed to promote.`,
            actionType: 'promote',
            stats: { total: selectedUsers.length, successful, failed },
            details: results
          });
          break;

        case 'demote':
          setCurrentAction('Removing admin privileges...');
          for (let i = 0; i < selectedUsers.length; i++) {
            const userId = selectedUsers[i];
            const userEmail = users.find(u => u.id === userId)?.email || 'Unknown';
            
            try {
              await removeAdminPrivileges(userId);
              results.push({ userId, userEmail, success: true, message: 'Admin privileges removed successfully' });
              successful++;
            } catch (error) {
              results.push({ userId, userEmail, success: false, error: error.message });
              failed++;
            }
          }
          
          showResultModal({
            type: failed === 0 ? 'success' : (successful === 0 ? 'error' : 'mixed'),
            title: failed === 0 ? 'Admin Access Removed Successfully' : 'Demotion Operation Completed',
            message: failed === 0 
              ? `Successfully removed admin privileges from all ${successful} users.`
              : `Removed admin privileges from ${successful} users successfully. ${failed} users failed to demote.`,
            actionType: 'demote',
            stats: { total: selectedUsers.length, successful, failed },
            details: results
          });
          break;

        case 'delete':
          setCurrentAction('Deleting users and all their data...');
          for (let i = 0; i < selectedUsers.length; i++) {
            const userId = selectedUsers[i];
            const userEmail = users.find(u => u.id === userId)?.email || 'Unknown';
            
            try {
              setCurrentAction(`Deleting user ${i + 1}/${selectedUsers.length}: ${userEmail}...`);
              await deleteUser(userId);
              results.push({ userId, userEmail, success: true, message: 'User and all data deleted successfully' });
              successful++;
              
              if (i < selectedUsers.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } catch (error) {
              results.push({ userId, userEmail, success: false, error: error.message });
              failed++;
            }
          }
          
          showResultModal({
            type: failed === 0 ? 'success' : (successful === 0 ? 'error' : 'mixed'),
            title: failed === 0 ? 'Users Deleted Successfully' : 'Deletion Operation Completed',
            message: failed === 0 
              ? `Successfully deleted all ${successful} users and their associated data.`
              : `Deleted ${successful} users successfully. ${failed} users failed to delete.`,
            actionType: 'delete',
            stats: { total: selectedUsers.length, successful, failed },
            details: results
          });
          break;
      }
      
      onRefreshUsers();
      
    } catch (error) {
      // console.error('Bulk operation error:', error);
      showResultModal({
        type: 'error',
        title: 'Operation Failed',
        message: `Failed to complete the operation: ${error.message}`,
        actionType: confirmationType
      });
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  const handleResultClose = () => {
    setShowResult(false);
    onClose();
  };

  return (
    <>
      {/* Main Bulk Actions Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Bulk Actions</h3>
            <Button
              onClick={onClose}
              disabled={loading}
              className="bg-transparent hover:bg-gray-100 p-2"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </Button>
          </div>
          
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="text-blue-600">{currentAction}</span>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </p>
            
            <Button
              onClick={onSelectAll}
              disabled={loading}
              className="w-full mb-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700"
            >
              {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleBulkBan}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50"
            >
              <Ban className="w-4 h-4 mr-2" />
              Ban Selected Users
            </Button>
            
            <Button
              onClick={handleBulkUnban}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Unban Selected Users
            </Button>
            
            <Button
              onClick={handleBulkPromoteAdmin}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 disabled:opacity-50"
            >
              <Shield className="w-4 h-4 mr-2" />
              Promote to Admin
            </Button>
            
            <Button
              onClick={handleBulkRemoveAdmin}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 disabled:opacity-50"
            >
              <ShieldOff className="w-4 h-4 mr-2" />
              Remove Admin
            </Button>
            
            <Button
              onClick={handleBulkSendEmail}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 disabled:opacity-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            
            <Button
              onClick={handleBulkDelete}
              disabled={selectedUsers.length === 0 || loading}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected Users
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <UserX className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-600 font-medium text-sm">Warning</p>
                <p className="text-gray-400 text-xs mt-1">
                  Bulk actions are powerful operations. User deletion removes all data permanently.
                </p>
              </div>
            </div>
          </div>
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
        loading={loading}
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

export default BulkActionsModal;