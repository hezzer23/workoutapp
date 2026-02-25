export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: 'push' | 'pull' | 'legs' | 'upper-hybrid';
  exercises: Exercise[];
}

export interface LoggedSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  type: 'push' | 'pull' | 'legs' | 'upper-hybrid';
  typeName: string;
  exercises: LoggedExercise[];
  completed: boolean;
  duration?: number;
}

export interface UserProfile {
  currentWeight: number;
  startWeight: number;
  targetWeight?: number;
  name: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  restTimerDefault: number;
}

export type TabType = 'workout' | 'plans' | 'progress' | 'settings';
