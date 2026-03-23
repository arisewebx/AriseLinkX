import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, CheckCircle, AlertCircle, Link2, MousePointer } from 'lucide-react';
import { UrlState } from '@/context';
import supabase from '@/db/supabase';
import useFetch from '@/hooks/use-fetch';
import { getUrls } from '@/db/apiUrls';
import { getClicksForUrls } from '@/db/apiClicks';

const Settings = () => {
  const { user, fetchUser } = UrlState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loading, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id);
  const { loading: loadingClicks, data: clicks, fn: fnClicks } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
        email: user?.email || ''
      });
    }
  }, [user]);

  useEffect(() => { if (user?.id) fnUrls(); }, [user?.id]);
  useEffect(() => { if (urls?.length) fnClicks(); }, [urls?.length]);

  const totalClicks = clicks?.length || 0;
  const totalUrls = urls?.length || 0;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  const handleSaveUsername = async () => {
    if (!userData.name.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: userData.name, full_name: userData.name }
      });
      if (error) throw error;
      if (fetchUser) {
        await fetchUser();
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Toasts */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white border border-green-200 text-green-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Name updated successfully
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            Update failed. Please try again.
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-sm font-semibold text-gray-900">Profile</h2>

        {/* Avatar Row */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-orange-500">
              {userData.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{userData.name || 'User'}</p>
            <p className="text-xs text-gray-500">{userData.email}</p>
            <p className="text-xs text-orange-500 mt-0.5 font-medium">AriseLinkX member</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Display name</label>
            <Input
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-orange-400 h-10"
              placeholder="Enter your display name"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              This is the name shown throughout AriseLinkX.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Email address</label>
            <Input
              value={userData.email}
              className="border-gray-200 text-gray-400 h-10 bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Email cannot be changed.
            </p>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <Button
            onClick={handleSaveUsername}
            disabled={isLoading || !userData.name.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 h-9 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-2" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Account stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <Link2 className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Links Created</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin align-middle" />
              ) : totalUrls}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <MousePointer className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Total Clicks</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loadingClicks ? (
                <span className="inline-block w-5 h-5 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin align-middle" />
              ) : totalClicks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
