import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import { UrlState } from '@/context';
import CubeLoader from '@/components/cube-loader';

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isAdmin } = UrlState();

  useEffect(() => {
    if (loading) return;
    if (!loading && !isAuthenticated) { navigate('/auth'); return; }
    if (!loading && isAuthenticated && !isAdmin) { navigate('/dashboard'); return; }
  }, [user, loading, isAuthenticated, isAdmin, navigate]);

  if (loading) {
    return <CubeLoader />;
  }

  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-6">You don't have administrator privileges.</p>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-orange-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in with admin credentials to continue.</p>
          <button onClick={() => navigate('/auth')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Welcome Banner */}
      <div className="mx-4 mt-4 bg-orange-500 rounded-xl px-5 py-3.5 flex items-center gap-4">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm">Welcome, Admin 👋</p>
          <p className="text-orange-100 text-xs truncate">
            {user?.user_metadata?.name || 'Admin'} · {user?.email} · Full administrator access
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};

export default RequireAdmin;
