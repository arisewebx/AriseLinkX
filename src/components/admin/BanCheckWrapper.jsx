// src/components/BanCheckWrapper.jsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Ban, 
  AlertTriangle, 
  LogOut,
  Mail,
  Clock
} from 'lucide-react';
import { getCurrentUserBanStatus } from '@/db/apiAdmin';
import { logout } from '@/db/apiAuth';
import { UrlState } from '@/context';

const BannedUserScreen = ({ banInfo, onLogout }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Animated ban icon */}
        <div className="text-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Ban className="w-12 h-12 text-red-400" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-red-500/30 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Account Suspended</h1>
          <p className="text-gray-400">Your account has been temporarily suspended</p>
        </div>

        {/* Ban details card */}
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2">Suspension Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account:</span>
                  <span className="text-white">{banInfo.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{formatDate(banInfo.bannedAt)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Reason:</span>
                  <span className="text-red-300 font-medium">{banInfo.banReason}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            What happens next?
          </h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Our team will review your account within 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>You'll receive an email update about your account status</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>If you believe this is an error, contact our support team</span>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 border border-red-500/30 text-white py-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          
          <Button
            onClick={() => window.open('mailto:support@yourapp.com?subject=Account Suspension Appeal', '_blank')}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            Account ID: {banInfo.userId?.slice(-8)}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>Last checked: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BanCheckWrapper = ({ children }) => {
  const [banStatus, setBanStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const { user } = UrlState();

  useEffect(() => {
    // Only check ban status if user is logged in
    if (user) {
      setChecking(true);
      checkBanStatus();
    } else {
      // User not logged in, no need to check
      setBanStatus(null);
      setChecking(false);
    }
  }, [user]);

  const checkBanStatus = async () => {
    try {
      const status = await getCurrentUserBanStatus();
      setBanStatus(status);
    } catch (error) {
      console.error('Ban check failed:', error);
      setBanStatus({ isBanned: false });
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear ban status and redirect
      setBanStatus(null);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      window.location.href = '/auth';
    }
  };

  // Show loading state only for authenticated users
  if (checking && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Checking account status...</p>
        </div>
      </div>
    );
  }

  // Show ban screen if user is authenticated and banned
  if (user && banStatus?.isBanned) {
    return <BannedUserScreen banInfo={banStatus} onLogout={handleLogout} />;
  }

  // Show normal app for:
  // - Non-authenticated users (public pages)
  // - Authenticated users who are not banned
  return children;
};

export default BanCheckWrapper;