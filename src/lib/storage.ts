import { WorkoutSession, UserProfile, AppSettings } from './types';

const SESSIONS_KEY = 'gym_sessions';
const PROFILE_KEY = 'gym_profile';
const SETTINGS_KEY = 'gym_settings';

// Sessions
export const getSessions = (): WorkoutSession[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSession = (session: WorkoutSession): void => {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.unshift(session);
  }
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const deleteSession = (id: string): void => {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const clearAllSessions = (): void => {
  localStorage.removeItem(SESSIONS_KEY);
};

// Profile
export const getProfile = (): UserProfile => {
  if (typeof window === 'undefined') return { currentWeight: 112, startWeight: 131, name: 'User' };
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : { currentWeight: 112, startWeight: 131, name: 'User' };
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// Settings
export const getSettings = (): AppSettings => {
  if (typeof window === 'undefined') return { soundEnabled: true, restTimerDefault: 90 };
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { soundEnabled: true, restTimerDefault: 90 };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Stats
export const getExerciseProgress = (exerciseName: string): { date: string; weight: number; reps: number }[] => {
  const sessions = getSessions();
  const progress: { date: string; weight: number; reps: number }[] = [];
  
  sessions.forEach(session => {
    const exercise = session.exercises.find(e => e.name === exerciseName);
    if (exercise && exercise.sets.length > 0) {
      const completedSets = exercise.sets.filter(s => s.completed);
      if (completedSets.length > 0) {
        const maxWeight = Math.max(...completedSets.map(s => s.weight));
        const maxReps = Math.max(...completedSets.filter(s => s.weight === maxWeight).map(s => s.reps));
        progress.push({
          date: session.date,
          weight: maxWeight,
          reps: maxReps,
        });
      }
    }
  });
  
  return progress.reverse();
};

export const getWorkoutStats = () => {
  const sessions = getSessions();
  const completedSessions = sessions.filter(s => s.completed);
  
  const workoutCounts: Record<string, number> = {};
  completedSessions.forEach(s => {
    workoutCounts[s.typeName] = (workoutCounts[s.typeName] || 0) + 1;
  });
  
  return {
    totalWorkouts: completedSessions.length,
    workoutCounts,
    thisWeek: completedSessions.filter(s => {
      const sessionDate = new Date(s.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate >= weekAgo;
    }).length,
  };
};
