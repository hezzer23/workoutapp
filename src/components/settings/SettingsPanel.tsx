'use client';

import { useState, useCallback } from 'react';
import { getProfile, saveProfile, getSettings, saveSettings, clearAllSessions } from '@/lib/storage';
import { UserProfile, AppSettings } from '@/lib/types';

export default function SettingsPanel() {
  const [profile, setProfile] = useState<UserProfile>(() => getProfile());
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = useCallback(() => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [profile]);

  const handleClearData = useCallback(() => {
    if (confirm('Delete all workout data?')) {
      clearAllSessions();
      alert('Data cleared');
    }
  }, []);

  const weightLost = profile.startWeight - profile.currentWeight;

  return (
    <div className="space-y-8">
      {/* Profile */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-neutral-600 text-xs mb-1 block">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
              className="w-full p-3 bg-neutral-950 border border-neutral-900 rounded-lg text-white text-sm focus:border-neutral-700 focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-600 text-xs mb-1 block">Start (kg)</label>
              <input
                type="number"
                value={profile.startWeight}
                onChange={(e) => setProfile({ ...profile, startWeight: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 bg-neutral-950 border border-neutral-900 rounded-lg text-white text-sm text-center focus:border-neutral-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-neutral-600 text-xs mb-1 block">Current (kg)</label>
              <input
                type="number"
                value={profile.currentWeight}
                onChange={(e) => setProfile({ ...profile, currentWeight: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 bg-neutral-950 border border-neutral-900 rounded-lg text-white text-sm text-center focus:border-neutral-700 focus:outline-none"
              />
            </div>
          </div>

          {weightLost > 0 && (
            <div className="text-center py-4">
              <div className="text-neutral-500 text-xs uppercase tracking-wider">Lost</div>
              <div className="text-3xl font-light mt-1">{weightLost} kg</div>
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            className="w-full py-3 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 transition-colors"
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Sound</span>
            <button
              onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-10 h-5 rounded-full transition-colors ${settings.soundEnabled ? 'bg-white' : 'bg-neutral-800'}`}
            >
              <div className={`w-4 h-4 bg-black rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div>
            <label className="text-neutral-600 text-xs mb-1 block">Rest Timer (seconds)</label>
            <input
              type="number"
              value={settings.restTimerDefault}
              onChange={(e) => setSettings({ ...settings, restTimerDefault: parseInt(e.target.value) || 90 })}
              className="w-full p-3 bg-neutral-950 border border-neutral-900 rounded-lg text-white text-sm focus:border-neutral-700 focus:outline-none"
            />
          </div>

          <button
            onClick={() => { saveSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
            className="w-full py-3 bg-neutral-900 text-white text-sm font-medium rounded hover:bg-neutral-800 transition-colors"
          >
            {saved ? 'Saved' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Data */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">Data</h3>
        <button
          onClick={handleClearData}
          className="w-full py-3 bg-neutral-950 border border-neutral-900 text-neutral-500 text-sm rounded hover:text-white hover:border-neutral-700 transition-colors"
        >
          Clear All Data
        </button>
      </div>

      {/* About */}
      <div className="text-center pt-4">
        <div className="text-neutral-600 text-xs">Gym Tracker v1.0</div>
      </div>
    </div>
  );
}
