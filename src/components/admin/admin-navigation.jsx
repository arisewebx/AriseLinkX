import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Users, Link2, BarChart3, Settings, AlertTriangle } from 'lucide-react';
import { UrlState } from '@/context';

const AdminNavigation = () => {
  const location = useLocation();
  const { user } = UrlState();

  // Check if user is admin
  const isAdmin = (user) => {
    return user?.user_metadata?.role === 'admin' || 
           user?.app_metadata?.role === 'admin' ||
           user?.email === 'admin@shortlinktics.com'; // Example admin email
  };

  // Don't render if user is not admin
  if (!user || !isAdmin(user)) {
    return null;
  }

  const adminNavItems = [
    {
      path: '/admin/dashboard',
      name: 'Admin Dashboard',
      icon: Shield,
      description: 'System overview'
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: Users,
      description: 'User management'
    },
    {
      path: '/admin/links',
      name: 'Links',
      icon: Link2,
      description: 'Link moderation'
    },
    {
      path: '/admin/analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Platform stats'
    },
    {
      path: '/admin/reports',
      name: 'Reports',
      icon: AlertTriangle,
      description: 'Flagged content'
    },
    {
      path: '/admin/settings',
      name: 'Admin Settings',
      icon: Settings,
      description: 'System config'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="border-t border-white/10 mt-4 pt-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Shield className="w-4 h-4 text-red-400" />
        <span className="text-sm font-medium text-red-400 uppercase tracking-wide">
          Admin Panel
        </span>
      </div>
      
      <nav className="space-y-1">
        {adminNavItems.map((item) => {
          const isActive = isActivePath(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                  {item.description}
                </div>
              </div>
              
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400"></div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Admin Badge */}
      <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-300 font-medium">Admin Access</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          You have administrative privileges
        </p>
      </div>
    </div>
  );
};

export default AdminNavigation;