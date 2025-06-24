import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Settings as SettingsIcon, 
  User, 
  Save,
  CheckCircle,
  Sparkles,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { UrlState } from '@/context';
import supabase from '@/db/supabase';
// Optional: import { updateUserProfile } from '@/db/apiAuth';

const Settings = () => {
  const { user, fetchUser } = UrlState(); // Add fetchUser if available
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for username
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setUserData({
        name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
        email: user?.email || ''
      });
    }
  }, [user]);

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Settings...</h2>
          <p className="text-gray-300">Please wait while we load your account information.</p>
        </div>
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
      // Update Supabase user metadata using your existing setup
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          full_name: userData.name
        }
      });

      if (error) throw error;

      // Refresh user context if fetchUser function is available
      if (fetchUser) {
        await fetchUser();
      } else {
        // Force a page refresh to show updated name
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Failed to update username:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-600/90 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-medium">Settings Updated!</p>
              <p className="text-green-100 text-sm">Your name has been saved</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {showError && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-red-600/90 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-medium">Update Failed!</p>
              <p className="text-red-100 text-sm">Please try again</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Account Settings</h1>
              <p className="text-gray-300 text-lg">Update your profile information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-lg"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <User className="w-6 h-6" />
              Profile Information
            </CardTitle>
            <p className="text-gray-300">Update your account details and preferences</p>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            {/* Profile Avatar Section */}
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{userData.name || 'User'}</h3>
                <p className="text-gray-300">{userData.email}</p>
                <p className="text-sm text-gray-400 mt-1">LinkFlow Member</p>
              </div>
            </div>

            {/* Username Update Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Display Name
                </label>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 h-12 text-lg"
                  placeholder="Enter your display name"
                />
                <p className="text-xs text-gray-400 mt-2">
                  This is the name that will be displayed throughout LinkFlow
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">Email Address</label>
                <Input
                  value={userData.email}
                  className="bg-white/5 border-white/10 text-gray-400 h-12 text-lg"
                  placeholder="Your email address"
                  disabled
                />
                <p className="text-xs text-gray-400 mt-2">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {/* TODO: Replace with actual link count */}
                  -
                </div>
                <div className="text-sm text-gray-400">Links Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {/* TODO: Replace with actual click count */}
                  -
                </div>
                <div className="text-sm text-gray-400">Total Clicks</div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button 
                onClick={handleSaveUsername}
                disabled={isLoading || !userData.name.trim()}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-8 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 bg-white/5 backdrop-blur-xl mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">Account Type</h4>
                <p className="text-gray-300 text-sm mb-3">Free Plan</p>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 w-full"
                >
                  Upgrade Plan
                </Button>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">Data Export</h4>
                <p className="text-gray-300 text-sm mb-3">Download your data</p>
                <Button 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 w-full"
                >
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;