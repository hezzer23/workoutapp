'use client';

import { useState, useCallback } from 'react';
import { workoutPlans } from '@/lib/workoutData';
import { LoggedExercise, WorkoutSession } from '@/lib/types';
import { saveSession, getProfile } from '@/lib/storage';
import ExerciseCard from './ExerciseCard';
import RestTimer from './RestTimer';

interface ActiveWorkoutProps {
  onComplete: () => void;
}

export default function ActiveWorkout({ onComplete }: ActiveWorkoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);
  const [selectedAlternatives, setSelectedAlternatives] = useState<Record<string, string | null>>({});
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [startTime] = useState(Date.now());

  const plan = selectedPlan ? workoutPlans.find(p => p.type === selectedPlan) : null;

  const handleSelectPlan = (type: string) => {
    const selected = workoutPlans.find(p => p.type === type);
    if (!selected) return;
    
    setSelectedPlan(type);
    setCurrentExerciseIndex(0);
    setSelectedAlternatives({});
    
    const initialExercises: LoggedExercise[] = selected.exercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      sets: Array.from({ length: ex.sets }, () => ({ weight: 0, reps: 0, completed: false })),
    }));
    setExercises(initialExercises);
  };

  const handleSetUpdate = useCallback((exerciseIdx: number, setIdx: number, weight: number, reps: number, completed: boolean) => {
    setExercises(prev => {
      const updated = [...prev];
      const exercise = { ...updated[exerciseIdx] };
      exercise.sets = [...exercise.sets];
      exercise.sets[setIdx] = { weight, reps, completed };
      updated[exerciseIdx] = exercise;
      return updated;
    });
  }, []);

  const handleStartRest = useCallback((seconds: number) => {
    setTimerSeconds(seconds);
    setShowTimer(true);
  }, []);

  const handleAlternativeSelect = useCallback((exerciseId: string, alternative: string | null) => {
    setSelectedAlternatives(prev => ({
      ...prev,
      [exerciseId]: alternative,
    }));
  }, []);

  const handleCompleteWorkout = () => {
    if (!plan || !selectedPlan) return;
    
    const finalExercises = exercises.map(ex => ({
      ...ex,
      name: selectedAlternatives[ex.exerciseId] || ex.name,
    }));
    
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: selectedPlan as 'push' | 'pull' | 'legs' | 'upper-hybrid',
      typeName: plan.name,
      exercises: finalExercises,
      completed: true,
      duration: Math.round((Date.now() - startTime) / 1000 / 60),
    };
    
    saveSession(session);
    onComplete();
  };

  // Plan Selection
  if (!selectedPlan) {
    return (
      <div className="space-y-3">
        {workoutPlans.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPlan(p.type)}
            className="w-full p-5 bg-neutral-950 border border-neutral-900 rounded-lg text-left hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">{p.name}</h3>
                <p className="text-neutral-600 text-sm mt-1">{p.exercises.length} exercises</p>
              </div>
              <span className="text-neutral-600 text-xl">→</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (!plan) return null;

  const currentExercise = plan.exercises[currentExerciseIndex];
  const loggedExercise = exercises[currentExerciseIndex];
  const totalExercises = plan.exercises.length;

  // Rest Timer Modal
  const timerModal = showTimer && (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-5">
      <div className="w-full max-w-xs">
        <RestTimer
          initialSeconds={timerSeconds}
          onComplete={() => setShowTimer(false)}
          autoStart
        />
        <button
          onClick={() => setShowTimer(false)}
          className="w-full mt-4 py-3 text-neutral-500 text-sm hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );

  return (
    <>
      {timerModal}
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => { setSelectedPlan(null); setExercises([]); setCurrentExerciseIndex(0); }}
            className="text-neutral-500 text-sm hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-neutral-500 text-sm">{currentExerciseIndex + 1} / {totalExercises}</span>
        </div>
        <div className="h-0.5 bg-neutral-900 rounded-full">
          <div 
            className="h-full bg-white transition-all duration-300 rounded-full"
            style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Exercise */}
      {currentExercise && loggedExercise && (
        <ExerciseCard
          name={currentExercise.name}
          sets={currentExercise.sets}
          reps={currentExercise.reps}
          rest={currentExercise.rest}
          notes={currentExercise.notes}
          alternatives={(currentExercise as any).alternatives || []}
          isActive
          loggedSets={loggedExercise.sets}
          selectedAlternative={selectedAlternatives[currentExercise.id]}
          onSetUpdate={(setIdx, weight, reps, completed) => 
            handleSetUpdate(currentExerciseIndex, setIdx, weight, reps, completed)
          }
          onStartRest={handleStartRest}
          onAlternativeSelect={(alt) => handleAlternativeSelect(currentExercise.id, alt)}
        />
      )}

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        {currentExerciseIndex > 0 && (
          <button
            onClick={() => setCurrentExerciseIndex(i => i - 1)}
            className="flex-1 py-3 bg-neutral-900 text-white text-sm font-medium rounded hover:bg-neutral-800 transition-colors"
          >
            Previous
          </button>
        )}
        
        {currentExerciseIndex < totalExercises - 1 ? (
          <button
            onClick={() => setCurrentExerciseIndex(i => i + 1)}
            className="flex-1 py-3 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleCompleteWorkout}
            className="flex-1 py-3 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 transition-colors"
          >
            Complete
          </button>
        )}
      </div>

      {/* Exercise Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {plan.exercises.map((ex, idx) => {
          const isDone = exercises[idx]?.sets.some(s => s.completed);
          const isCurrent = idx === currentExerciseIndex;
          return (
            <button
              key={ex.id}
              onClick={() => setCurrentExerciseIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                isCurrent ? 'bg-white' : isDone ? 'bg-neutral-500' : 'bg-neutral-800'
              }`}
            />
          );
        })}
      </div>
    </>
  );
}
