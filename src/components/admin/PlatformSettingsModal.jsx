// src/components/admin/PlatformSettingsModal.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XCircle, Settings, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const PlatformSettingsModal = ({ isOpen, onClose }) => {
  
  if (!isOpen) return null;

  // Platform settings state
  const [settings, setSettings] = useState({
    maxLinksPerUser: 100,
    allowCustomUrls: true,
    requireEmailVerification: true,
    enableAnalytics: true,
    maintenanceMode: false,
    maxUrlLength: 2048,
    allowSignups: true,
    defaultLinkExpiry: 0, // 0 = never expire
    enableQRCodes: true,
    rateLimitPerHour: 50,
    allowGuests: false,
    enablePasswordProtection: true,
    maxCustomUrlLength: 50,
    enableLinkExpiration: true,
    enableClickLimit: false,
    defaultClickLimit: 1000,
    enableGeoblocking: false,
    blockedCountries: [],
    enableSpamProtection: true,
    minLinkInterval: 5, // seconds between link creation
    enableBulkOperations: true,
    enableApiAccess: false,
    maxApiCallsPerHour: 1000
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call to save settings
      // await savePlatformSettings(settings);
      
      console.log('Saving platform settings:', settings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Platform settings saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        maxLinksPerUser: 100,
        allowCustomUrls: true,
        requireEmailVerification: true,
        enableAnalytics: true,
        maintenanceMode: false,
        maxUrlLength: 2048,
        allowSignups: true,
        defaultLinkExpiry: 0,
        enableQRCodes: true,
        rateLimitPerHour: 50,
        allowGuests: false,
        enablePasswordProtection: true,
        maxCustomUrlLength: 50,
        enableLinkExpiration: true,
        enableClickLimit: false,
        defaultClickLimit: 1000,
        enableGeoblocking: false,
        blockedCountries: [],
        enableSpamProtection: true,
        minLinkInterval: 5,
        enableBulkOperations: true,
        enableApiAccess: false,
        maxApiCallsPerHour: 1000
      });
    }
  };

  const ToggleButton = ({ enabled, onChange, label, description, disabled = false }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className={`font-medium ${disabled ? 'text-gray-500' : 'text-white'}`}>{label}</div>
        <div className={`text-sm ${disabled ? 'text-gray-600' : 'text-gray-400'}`}>{description}</div>
      </div>
      <Button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`p-2 transition-colors ${
          disabled ? 'bg-gray-800 cursor-not-allowed' :
          enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        {enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-orange-400" />
            Platform Settings
          </h3>
          <Button onClick={onClose} className="bg-transparent hover:bg-white/10 p-2">
            <XCircle className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* User Limits Section */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">User Limits & Restrictions</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Max Links Per User</label>
                  <Input
                    type="number"
                    value={settings.maxLinksPerUser}
                    onChange={(e) => handleSettingChange('maxLinksPerUser', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="1"
                    max="10000"
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Max URL Length</label>
                  <Input
                    type="number"
                    value={settings.maxUrlLength}
                    onChange={(e) => handleSettingChange('maxUrlLength', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Rate Limit (Links per hour)</label>
                  <Input
                    type="number"
                    value={settings.rateLimitPerHour}
                    onChange={(e) => handleSettingChange('rateLimitPerHour', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="1"
                    max="1000"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Min Interval Between Links (seconds)</label>
                  <Input
                    type="number"
                    value={settings.minLinkInterval}
                    onChange={(e) => handleSettingChange('minLinkInterval', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="0"
                    max="3600"
                  />
                </div>
              </div>
            </div>

            {/* Link Settings */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Link Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Default Link Expiry (days, 0 = never)</label>
                  <Input
                    type="number"
                    value={settings.defaultLinkExpiry}
                    onChange={(e) => handleSettingChange('defaultLinkExpiry', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="0"
                    max="365"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Max Custom URL Length</label>
                  <Input
                    type="number"
                    value={settings.maxCustomUrlLength}
                    onChange={(e) => handleSettingChange('maxCustomUrlLength', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="3"
                    max="100"
                    disabled={!settings.allowCustomUrls}
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Default Click Limit</label>
                  <Input
                    type="number"
                    value={settings.defaultClickLimit}
                    onChange={(e) => handleSettingChange('defaultClickLimit', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="1"
                    max="1000000"
                    disabled={!settings.enableClickLimit}
                  />
                </div>
              </div>
            </div>

            {/* API Settings */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">API Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Max API Calls Per Hour</label>
                  <Input
                    type="number"
                    value={settings.maxApiCallsPerHour}
                    onChange={(e) => handleSettingChange('maxApiCallsPerHour', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/10 text-white"
                    min="100"
                    max="100000"
                    disabled={!settings.enableApiAccess}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Core Features */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Core Features</h4>
              <div className="space-y-2">
                <ToggleButton
                  enabled={settings.allowSignups}
                  onChange={(value) => handleSettingChange('allowSignups', value)}
                  label="Allow New Signups"
                  description="Enable or disable new user registrations"
                />

                <ToggleButton
                  enabled={settings.allowCustomUrls}
                  onChange={(value) => handleSettingChange('allowCustomUrls', value)}
                  label="Allow Custom URLs"
                  description="Let users create custom short URLs"
                />
                
                <ToggleButton
                  enabled={settings.requireEmailVerification}
                  onChange={(value) => handleSettingChange('requireEmailVerification', value)}
                  label="Email Verification Required"
                  description="Require email verification for new users"
                />
                
                <ToggleButton
                  enabled={settings.enableAnalytics}
                  onChange={(value) => handleSettingChange('enableAnalytics', value)}
                  label="Analytics Tracking"
                  description="Enable detailed click analytics and tracking"
                />

                <ToggleButton
                  enabled={settings.enableQRCodes}
                  onChange={(value) => handleSettingChange('enableQRCodes', value)}
                  label="QR Code Generation"
                  description="Automatically generate QR codes for short links"
                />

                <ToggleButton
                  enabled={settings.allowGuests}
                  onChange={(value) => handleSettingChange('allowGuests', value)}
                  label="Allow Guest Users"
                  description="Allow non-registered users to create links"
                />
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Advanced Features</h4>
              <div className="space-y-2">
                <ToggleButton
                  enabled={settings.enablePasswordProtection}
                  onChange={(value) => handleSettingChange('enablePasswordProtection', value)}
                  label="Password Protection"
                  description="Allow users to password protect their links"
                />

                <ToggleButton
                  enabled={settings.enableLinkExpiration}
                  onChange={(value) => handleSettingChange('enableLinkExpiration', value)}
                  label="Link Expiration"
                  description="Allow users to set expiration dates for links"
                />

                <ToggleButton
                  enabled={settings.enableClickLimit}
                  onChange={(value) => handleSettingChange('enableClickLimit', value)}
                  label="Click Limits"
                  description="Allow users to set maximum click limits"
                />

                <ToggleButton
                  enabled={settings.enableGeoblocking}
                  onChange={(value) => handleSettingChange('enableGeoblocking', value)}
                  label="Geographic Blocking"
                  description="Allow blocking specific countries/regions"
                />

                <ToggleButton
                  enabled={settings.enableBulkOperations}
                  onChange={(value) => handleSettingChange('enableBulkOperations', value)}
                  label="Bulk Operations"
                  description="Enable bulk link creation and management"
                />

                <ToggleButton
                  enabled={settings.enableApiAccess}
                  onChange={(value) => handleSettingChange('enableApiAccess', value)}
                  label="API Access"
                  description="Enable REST API for developers"
                />
              </div>
            </div>

            {/* Security & Spam Protection */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">Security & Protection</h4>
              <div className="space-y-2">
                <ToggleButton
                  enabled={settings.enableSpamProtection}
                  onChange={(value) => handleSettingChange('enableSpamProtection', value)}
                  label="Spam Protection"
                  description="Enable automated spam detection and prevention"
                />

                <ToggleButton
                  enabled={settings.maintenanceMode}
                  onChange={(value) => handleSettingChange('maintenanceMode', value)}
                  label="Maintenance Mode"
                  description="Temporarily disable the platform for maintenance"
                />
              </div>

              {settings.maintenanceMode && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-300 font-medium">Maintenance Mode Active</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    When enabled, new users cannot sign up and existing users will see a maintenance message.
                    Existing short links will continue to work.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/20">
          <h4 className="text-white font-semibold mb-4">Configuration Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Max Links/User:</span>
                <span className="text-white font-medium">{settings.maxLinksPerUser}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rate Limit/Hour:</span>
                <span className="text-white font-medium">{settings.rateLimitPerHour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">URL Length Limit:</span>
                <span className="text-white font-medium">{settings.maxUrlLength} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Link Interval:</span>
                <span className="text-white font-medium">{settings.minLinkInterval}s</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Custom URLs:</span>
                <span className={settings.allowCustomUrls ? "text-green-400" : "text-red-400"}>
                  {settings.allowCustomUrls ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Email Verification:</span>
                <span className={settings.requireEmailVerification ? "text-green-400" : "text-red-400"}>
                  {settings.requireEmailVerification ? "Required" : "Optional"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Analytics:</span>
                <span className={settings.enableAnalytics ? "text-green-400" : "text-red-400"}>
                  {settings.enableAnalytics ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">QR Codes:</span>
                <span className={settings.enableQRCodes ? "text-green-400" : "text-red-400"}>
                  {settings.enableQRCodes ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Guest Access:</span>
                <span className={settings.allowGuests ? "text-green-400" : "text-red-400"}>
                  {settings.allowGuests ? "Allowed" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">API Access:</span>
                <span className={settings.enableApiAccess ? "text-green-400" : "text-red-400"}>
                  {settings.enableApiAccess ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Spam Protection:</span>
                <span className={settings.enableSpamProtection ? "text-green-400" : "text-red-400"}>
                  {settings.enableSpamProtection ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Maintenance:</span>
                <span className={settings.maintenanceMode ? "text-red-400" : "text-green-400"}>
                  {settings.maintenanceMode ? "Active" : "Normal"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
          
          <Button 
            onClick={handleResetToDefaults}
            className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-300"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettingsModal;