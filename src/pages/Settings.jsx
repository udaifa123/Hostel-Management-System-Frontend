import React, { useState } from 'react';
import { 
  Bell, Moon, Sun, Globe, Save, Volume2, 
  Eye, Shield, Clock, Languages, Mail, Smartphone,
  Monitor, Download, Upload, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true,
      leaveUpdates: true,
      attendanceAlerts: true,
      messageAlerts: true,
      systemUpdates: false
    },
    
   
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      animations: true
    },
    
  
    language: {
      preferred: 'english',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      firstDayOfWeek: 'monday'
    },
    
   
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true,
      allowMessagesFrom: 'everyone'
    },
 
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reducedMotion: false
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
   
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset all settings to default?')) {
   
      toast.success('Settings reset to default');
    }
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email shortly.');
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'accessibility', label: 'Accessibility', icon: Volume2 },
    { id: 'data', label: 'Data & Storage', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            Save Changes
          </button>
          <button
            onClick={handleResetSettings}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
       
        <div className="border-b overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

  
        <div className="p-6">
         
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-600" />
                      <span>Email Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-gray-600" />
                      <span>Push Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-gray-600" />
                      <span>SMS Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Monitor size={18} className="text-gray-600" />
                      <span>Desktop Notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.desktop}
                      onChange={(e) => handleSettingChange('notifications', 'desktop', e.target.checked)}
                      className="toggle"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Alert Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Leave Request Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.leaveUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'leaveUpdates', e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Attendance Alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.attendanceAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'attendanceAlerts', e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Message Alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.messageAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'messageAlerts', e.target.checked)}
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>System Updates</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.systemUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'systemUpdates', e.target.checked)}
                      className="toggle"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map(theme => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('appearance', 'theme', theme)}
                      className={`p-4 rounded-lg border-2 capitalize ${
                        settings.appearance.theme === theme
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {theme === 'light' && <Sun size={24} className="mx-auto mb-2" />}
                      {theme === 'dark' && <Moon size={24} className="mx-auto mb-2" />}
                      {theme === 'system' && <Monitor size={24} className="mx-auto mb-2" />}
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Font Size</h3>
                <div className="flex gap-4">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      onClick={() => handleSettingChange('appearance', 'fontSize', size)}
                      className={`px-4 py-2 rounded-lg border capitalize ${
                        settings.appearance.fontSize === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Compact Mode</span>
                  <input
                    type="checkbox"
                    checked={settings.appearance.compactMode}
                    onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                    className="toggle"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Enable Animations</span>
                  <input
                    type="checkbox"
                    checked={settings.appearance.animations}
                    onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
                    className="toggle"
                  />
                </label>
              </div>
            </div>
          )}

          
          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferred Language</h3>
                <select
                  value={settings.language.preferred}
                  onChange={(e) => handleSettingChange('language', 'preferred', e.target.value)}
                  className="w-full md:w-96 p-2 border rounded-lg"
                >
                  <option value="english">English</option>
                  <option value="hindi">हिन्दी</option>
                  <option value="malayalam">മലയാളം</option>
                  <option value="tamil">தமிழ்</option>
                  <option value="telugu">తెలుగు</option>
                  <option value="kannada">ಕನ್ನಡ</option>
                  <option value="bengali">বাংলা</option>
                  <option value="marathi">मराठी</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Date Format</h3>
                <div className="flex gap-4">
                  {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(format => (
                    <button
                      key={format}
                      onClick={() => handleSettingChange('language', 'dateFormat', format)}
                      className={`px-4 py-2 rounded-lg border ${
                        settings.language.dateFormat === format
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Time Format</h3>
                <div className="flex gap-4">
                  {['12h', '24h'].map(format => (
                    <button
                      key={format}
                      onClick={() => handleSettingChange('language', 'timeFormat', format)}
                      className={`px-4 py-2 rounded-lg border ${
                        settings.language.timeFormat === format
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {format === '12h' ? '12-hour' : '24-hour'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="w-full md:w-96 p-2 border rounded-lg"
                >
                  <option value="public">Public - Everyone can see</option>
                  <option value="private">Private - Only I can see</option>
                  <option value="contacts">Contacts - Only my contacts</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Show Online Status</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showOnlineStatus}
                    onChange={(e) => handleSettingChange('privacy', 'showOnlineStatus', e.target.checked)}
                    className="toggle"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Show Last Seen</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showLastSeen}
                    onChange={(e) => handleSettingChange('privacy', 'showLastSeen', e.target.checked)}
                    className="toggle"
                  />
                </label>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Who can message me?</h3>
                <select
                  value={settings.privacy.allowMessagesFrom}
                  onChange={(e) => handleSettingChange('privacy', 'allowMessagesFrom', e.target.value)}
                  className="w-full md:w-96 p-2 border rounded-lg"
                >
                  <option value="everyone">Everyone</option>
                  <option value="contacts">Only my contacts</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>
            </div>
          )}

        
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>High Contrast Mode</span>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.highContrast}
                    onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                    className="toggle"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Large Text</span>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.largeText}
                    onChange={(e) => handleSettingChange('accessibility', 'largeText', e.target.checked)}
                    className="toggle"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Screen Reader Optimized</span>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.screenReader}
                    onChange={(e) => handleSettingChange('accessibility', 'screenReader', e.target.checked)}
                    className="toggle"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Reduced Motion</span>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.reducedMotion}
                    onChange={(e) => handleSettingChange('accessibility', 'reducedMotion', e.target.checked)}
                    className="toggle"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Storage Usage</h3>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used: 245 MB</span>
                    <span>Total: 1 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">24% of 1 GB used</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-blue-600" />
                    <span>Export My Data</span>
                  </div>
                  <span className="text-sm text-gray-500">JSON</span>
                </button>

                <button
                  onClick={() => toast.success('Backup started')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Upload size={18} className="text-green-600" />
                    <span>Backup Settings</span>
                  </div>
                  <span className="text-sm text-gray-500">Cloud</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Clear all cached data?')) {
                      toast.success('Cache cleared');
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 size={18} className="text-red-600" />
                    <span className="text-red-600">Clear Cache</span>
                  </div>
                  <span className="text-sm text-gray-500">245 MB</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .toggle {
          width: 50px;
          height: 24px;
          appearance: none;
          background: #ddd;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle:checked {
          background: #3b82f6;
        }

        .toggle::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
        }

        .toggle:checked::before {
          transform: translateX(26px);
        }
      `}</style>
    </div>
  );
};

export default Settings;