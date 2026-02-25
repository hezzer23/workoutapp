'use client';

import { useState } from 'react';
import { TabType } from '@/lib/types';
import { getProfile } from '@/lib/storage';
import WorkoutPlanView from '@/components/workout/WorkoutPlanView';
import ActiveWorkout from '@/components/workout/ActiveWorkout';
import ProgressView from '@/components/progress/ProgressView';
import SettingsPanel from '@/components/settings/SettingsPanel';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('workout');
  const [profile] = useState(() => getProfile());
  const [greeting] = useState(() => getGreeting());

  const handleWorkoutComplete = () => {
    setActiveTab('progress');
  };

  const tabs = [
    { id: 'workout' as TabType, label: 'Workout' },
    { id: 'plans' as TabType, label: 'Plans' },
    { id: 'progress' as TabType, label: 'Progress' },
    { id: 'settings' as TabType, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-black z-20 px-5 py-4">
        <p className="text-neutral-500 text-xs uppercase tracking-wider">
          {greeting}{profile.name ? `, ${profile.name}` : ''}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          {activeTab === 'workout' && 'Start Workout'}
            {activeTab === 'plans' && 'Plans'}
            {activeTab === 'progress' && 'Progress'}
            {activeTab === 'settings' && 'Settings'}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 pb-24">
        {activeTab === 'workout' && <ActiveWorkout onComplete={handleWorkoutComplete} />}
        {activeTab === 'plans' && <WorkoutPlanView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-900 z-20">
        <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-full text-xs font-medium tracking-wide transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-neutral-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
