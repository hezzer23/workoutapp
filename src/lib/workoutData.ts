import { WorkoutPlan, Exercise } from './types';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface ExerciseWithAlternatives extends Exercise {
  alternatives?: string[];
}

const ex = (name: string, sets: number, reps: string, rest: string, notes: string = '', alternatives: string[] = []): ExerciseWithAlternatives => ({
  id: generateId(),
  name,
  sets,
  reps,
  rest,
  notes,
  alternatives,
});

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'push',
    name: 'Push',
    type: 'push',
    exercises: [
      ex('Incline Dumbbell Press', 4, '8-10', '90s', '', 
        ['Barbell Incline Press', 'Machine Incline Press']),
      ex('Chest Press Machine', 3, '10-12', '90s', '',
        ['Flat Dumbbell Press', 'Cable Chest Press']),
      ex('Seated Dumbbell Press', 3, '8-10', '90s', '',
        ['Military Press', 'Machine Shoulder Press']),
      ex('Lateral Raises', 4, '12-15', '60s', '',
        ['Cable Lateral Raises', 'Machine Lateral Raises']),
      ex('Cable Flyes', 3, '12-15', '60s', '',
        ['Dumbbell Flyes', 'Pec Deck']),
      ex('Tricep Pushdowns', 3, '10-12', '60s', '',
        ['Skull Crushers', 'Close-Grip Bench']),
      ex('Overhead Tricep Extension', 3, '10-12', '60s', '',
        ['Tricep Dips', 'Cable Overhead Extension']),
    ],
  },
  {
    id: 'pull',
    name: 'Pull',
    type: 'pull',
    exercises: [
      ex('Hex Bar Deadlift', 3, '6-8', '120s', 'QL Injury - Be careful',
        ['Rack Pulls', 'Chest-Supported Row']),
      ex('Lat Pulldown', 4, '10-12', '90s', '',
        ['Pull-ups', 'Straight Arm Pulldown']),
      ex('Seated Cable Row', 3, '10-12', '90s', '',
        ['T-Bar Row', 'Meadows Row']),
      ex('Chest-Supported Row', 3, '10-12', '60s', 'QL-friendly',
        ['Incline DB Row', 'Machine Row']),
      ex('Face Pulls', 3, '15-20', '60s', '',
        ['Reverse Pec Deck', 'Cable Face Pulls']),
      ex('Dumbbell Bicep Curls', 3, '10-12', '60s', '',
        ['Barbell Curls', 'Cable Curls']),
      ex('Hammer Curls', 3, '10-12', '60s', '',
        ['Cross-Body Curls', 'Rope Hammer Curls']),
    ],
  },
  {
    id: 'legs',
    name: 'Legs',
    type: 'legs',
    exercises: [
      ex('Hack Squat', 4, '8-10', '120s', '',
        ['Barbell Back Squat', 'Goblet Squats']),
      ex('Leg Press', 4, '10-12', '120s', '',
        ['Bulgarian Split Squats', 'Front Squat']),
      ex('Lying Leg Curl', 4, '10-12', '60s', '',
        ['Seated Leg Curl', 'Stiff-Leg Deadlift']),
      ex('Leg Extension', 3, '12-15', '60s', '',
        ['Goblet Squats', 'Sissy Squat']),
      ex('Standing Calf Raises', 4, '15-20', '60s', '',
        ['Seated Calf Raises', 'Donkey Calf Raises']),
    ],
  },
  {
    id: 'upper-hybrid',
    name: 'Upper Hybrid',
    type: 'upper-hybrid',
    exercises: [
      ex('Machine Chest Press', 3, '10-12', '90s', '',
        ['Dumbbell Bench Press', 'Push-Ups']),
      ex('Lat Pulldown', 3, '10-12', '90s', '',
        ['Pull-ups', 'Straight Arm Pulldown']),
      ex('Seated Dumbbell Press', 3, '10-12', '90s', '',
        ['Arnold Press', 'Machine Shoulder Press']),
      ex('Seated Cable Row', 3, '10-12', '60s', '',
        ['One-Arm DB Row', 'T-Bar Row']),
      ex('Lateral Raises', 3, '12-15', '60s', '',
        ['Upright Rows', 'Cable Lateral Raises']),
      ex('Face Pulls', 3, '15-20', '60s', '',
        ['Reverse Pec Deck', 'Band Pull-Aparts']),
      ex('Bicep Curls', 3, '10-12', '60s', '',
        ['Hammer Curls', 'Preacher Curls']),
      ex('Tricep Pushdowns', 3, '10-12', '60s', '',
        ['Skull Crushers', 'Tricep Dips']),
    ],
  },
];

export const getWorkoutPlan = (type: string): WorkoutPlan | undefined => {
  return workoutPlans.find(plan => plan.type === type);
};
