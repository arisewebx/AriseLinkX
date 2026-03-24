
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

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
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
  const { loading: clicksLoading, data: allClicks, fn: fnClicks } = useFetch(getClicksForUrls, allUrls?.map(url => url.id) || []);

  useEffect(() => {
    fnUsers();
    fnUrls(); // Now calls getAllUrls() - no parameters needed!
  }, []);

  useEffect(() => {
    if (allUrls?.length) {
      fnClicks();
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

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
  const handleFilterChange = (e) => { setUserFilter(e.target.value); setCurrentPage(1); };

  // Event handlers
  const handleUserClick = (user) => {
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
    },
    {
      title: "Platform Links",
      value: platformStats.totalLinks,
      subtitle: `Avg ${platformStats.avgClicksPerLink} clicks/link`,
      icon: Link2,
    },
    {
      title: "Total Clicks",
      value: platformStats.totalClicks.toLocaleString(),
      subtitle: "Platform-wide engagement",
      icon: MousePointer,
    },
    {
      title: "Admin Users",
      value: platformStats.adminUsers,
      subtitle: `${platformStats.bannedUsers} banned users`,
      icon: Crown,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {(usersLoading || urlsLoading || clicksLoading) && (
        <BarLoader width="100%" color="#f97316" height={2} />
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-500">Manage users and monitor platform activity</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <UserStatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActionsSection
        onExportUsers={handleExportUsers}
        onBulkActions={() => setShowBulkModal(true)}
        onUserActivity={() => setShowUserActivity(true)}
        onAnalytics={() => setShowAnalytics(true)}
      />

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-semibold text-gray-900">Users</h2>
            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-0.5">
              {filteredUsers.length}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 h-8 text-sm border-gray-200 bg-gray-50 w-48"
              />
            </div>
            <select
              value={userFilter}
              onChange={handleFilterChange}
              className="px-3 h-8 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:border-orange-400"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {usersError && (
          <div className="p-4 mx-5 mt-4 bg-red-50 border border-red-200 rounded-lg">
            <Error message={usersError?.message} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Links</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Clicks</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
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
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {searchQuery ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-xs text-gray-400">
              {searchQuery ? `No users match "${searchQuery}"` : 'No users have signed up yet.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 h-8 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                        currentPage === p
                          ? 'bg-orange-500 border-orange-500 text-white font-medium'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 h-8 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
        onClose={() => { setShowBulkModal(false); setSelectedUsers([]); }}
        selectedUsers={selectedUsers}
        filteredUsers={filteredUsers}
        onSelectAll={handleSelectAll}
        onRefreshUsers={handleUserUpdate}
        users={users}
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
        allUrls={allUrls}
        allClicks={allClicks}
        users={users}
      />
    </div>
  );
};

export default AdminDashboard;