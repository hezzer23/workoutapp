'use client';

import { useState } from 'react';
import { workoutPlans } from '@/lib/workoutData';

export default function WorkoutPlanView() {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {workoutPlans.map((plan) => (
        <div key={plan.id}>
          <button
            onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between py-3 border-b border-neutral-900">
              <span className="font-medium">{plan.name}</span>
              <span className="text-neutral-600 text-sm">{plan.exercises.length} exercises</span>
            </div>
          </button>
          
          {expandedPlan === plan.id && (
            <div className="py-4 space-y-0">
              {plan.exercises.map((exercise, idx) => {
                const hasAlts = (exercise as any).alternatives?.length > 0;
                return (
                  <div key={exercise.id + idx} className="flex items-center justify-between py-3 border-b border-neutral-900/50">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-600 text-sm w-4">{idx + 1}</span>
                      <div>
                        <span className="text-white">{exercise.name}</span>
                        {hasAlts && (
                          <span className="text-neutral-600 text-xs ml-2">+{((exercise as any).alternatives?.length || 0)} alt</span>
                        )}
                        {exercise.notes && (
                          <p className="text-neutral-600 text-xs mt-0.5">{exercise.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-neutral-500 text-sm shrink-0">{exercise.sets}×{exercise.reps}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
