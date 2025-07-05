import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Shield, AlertTriangle } from 'lucide-react';
import { UrlState } from '@/context';

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isAdmin, userName } = UrlState();

  useEffect(() => {
    if (loading) return;

    if (!loading && !isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!loading && isAuthenticated && !isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, loading, isAuthenticated, isAdmin, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Verifying Admin Access</h2>
            <p className="text-gray-400">Please wait while we check your permissions...</p>
          </div>
          <div className="w-64 mx-auto">
            <BarLoader 
              width="100%" 
              color="#ef4444" 
              height={3}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if user is authenticated but not admin
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Access Denied
              </h1>
              
              <p className="text-gray-300 mb-2">
                You don't have administrator privileges to access this area.
              </p>
              
              <div className="bg-black/20 p-4 rounded-lg mb-6">
                <p className="text-gray-400 text-sm mb-2">Current user:</p>
                <p className="text-white font-mono text-sm">{user?.email}</p>
                <p className="text-gray-400 text-xs mt-2">Only Karthick Raja can access admin panel</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Go to Dashboard
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/10"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Authentication Required
              </h1>
              
              <p className="text-gray-300 mb-6">
                You must be logged in with administrator privileges to access this area.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is admin, render the protected component
  return (
    <div>
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4 mb-6 mx-6 mt-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-red-300 font-medium">🎉 Welcome Admin</h3>
            <p className="text-red-200 text-sm">
              Logged in as: {user?.user_metadata?.name || 'Karthick Raja'} ({user?.email}) - Full administrator access granted
            </p>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default RequireAdmin;