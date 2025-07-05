// // src/components/admin/QuickActionsSection.jsx
// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { 
//   Download, 
//   CheckCircle, 
//   BarChart3, 
//   Clock, 
//   Settings, 
//   ShieldAlert,
//   Activity 
// } from 'lucide-react';

// const QuickActionsSection = ({ modalHandlers, users }) => {
  
//   const handleExportUsers = () => {
//     if (!users?.length) {
//       alert('No users to export');
//       return;
//     }
    
//     const csvData = users.map(user => ({
//       Email: user.email,
//       Name: user.name,
//       Status: user.status,
//       Banned: user.banned ? 'Yes' : 'No',
//       Admin: user.isAdmin ? 'Yes' : 'No',
//       'Links Count': user.linksCount || 0,
//       'Total Clicks': user.totalClicks || 0,
//       'Joined Date': new Date(user.created_at).toLocaleDateString(),
//       'Last Sign In': user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'
//     }));
    
//     const csvContent = [
//       Object.keys(csvData[0]).join(','),
//       ...csvData.map(row => Object.values(row).map(value => 
//         typeof value === 'string' && value.includes(',') ? `"${value}"` : value
//       ).join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="relative">
//       <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
//       <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//         <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
//           <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
//             <Activity className="w-4 h-4 text-white" />
//           </div>
//           Quick Actions
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Button 
//             onClick={handleExportUsers}
//             className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 text-white transition-all duration-300 hover:scale-105"
//           >
//             <Download className="w-5 h-5" />
//             <div className="text-left">
//               <div className="font-medium">Export Users</div>
//               <div className="text-xs text-gray-300">Download CSV</div>
//             </div>
//           </Button>
          
//           <Button 
//             onClick={() => modalHandlers.bulk.setShow(true)}
//             className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 text-white transition-all duration-300 hover:scale-105"
//           >
//             <CheckCircle className="w-5 h-5" />
//             <div className="text-left">
//               <div className="font-medium">Bulk Actions</div>
//               <div className="text-xs text-gray-300">Manage multiple users</div>
//             </div>
//           </Button>
          
//           <Button 
//             onClick={() => modalHandlers.analytics.setShow(true)}
//             className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 border border-red-500/30 text-white transition-all duration-300 hover:scale-105"
//           >
//             <BarChart3 className="w-5 h-5" />
//             <div className="text-left">
//               <div className="font-medium">Link Analytics</div>
//               <div className="text-xs text-gray-300">Performance insights</div>
//             </div>
//           </Button>
          
//           <Button 
//             onClick={() => modalHandlers.activity.setShow(true)}
//             className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 text-white transition-all duration-300 hover:scale-105"
//           >
//             <Clock className="w-5 h-5" />
//             <div className="text-left">
//               <div className="font-medium">User Activity</div>
//               <div className="text-xs text-gray-300">Monitor activity</div>
//             </div>
//           </Button>
//         </div>
        
//         {/* Second Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           <Button 
//             onClick={() => modalHandlers.settings.setShow(true)}
//             className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-orange-600/20 to-yellow-600/20 hover:from-orange-600/30 hover:to-yellow-600/30 border border-orange-500/30 text-white transition-all duration-300 hover:scale-105"
//           >
//             <Settings className="w-5 h-5" />
//             <div className="text-left">
//               <div className="font-medium">Platform Settings</div>
//               <div className="text-xs text-gray-300">Configure platform</div>
//             </div>
//           </Button>
          
//           <Button 
//             onClick={() => modalHandlers.security.setShow(true)}
//             className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 text-white transition-all duration-300 hover:scale-105"
//           >
//             <ShieldAlert className="w-5 h-5" />
//             <div className="text-left">
//               <div className="font-medium">Security Center</div>
//               <div className="text-xs text-gray-300">Security & moderation</div>
//             </div>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickActionsSection;
// src/components/admin/QuickActionsSection.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Globe,
  Activity 
} from 'lucide-react';

const QuickActionsSection = ({ 
  onExportUsers, 
  onBulkActions, 
  onUserActivity, 
  onAnalytics 
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            onClick={onExportUsers}
            className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 text-white transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Export Users</div>
              <div className="text-xs text-gray-300">Download CSV</div>
            </div>
          </Button>
          
          <Button 
            onClick={onBulkActions}
            className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 text-white transition-all duration-300 hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Bulk Actions</div>
              <div className="text-xs text-gray-300">Manage multiple users</div>
            </div>
          </Button>
          
          <Button 
            onClick={onUserActivity}
            className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 border border-red-500/30 text-white transition-all duration-300 hover:scale-105"
          >
            <AlertTriangle className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">User Activity</div>
              <div className="text-xs text-gray-300">Recent activities</div>
            </div>
          </Button>
          
          <Button 
            onClick={onAnalytics}
            className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 text-white transition-all duration-300 hover:scale-105"
          >
            <Globe className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Analytics</div>
              <div className="text-xs text-gray-300">View insights</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSection;