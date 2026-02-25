'use client';

import { useState } from 'react';
import { LoggedSet } from '@/lib/types';

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
  alternatives?: string[];
  isActive?: boolean;
  loggedSets?: LoggedSet[];
  selectedAlternative?: string;
  onSetUpdate?: (setIndex: number, weight: number, reps: number, completed: boolean) => void;
  onStartRest?: (seconds: number) => void;
  onAlternativeSelect?: (alternative: string | null) => void;
}

export default function ExerciseCard({
  name,
  sets,
  reps,
  rest,
  notes,
  alternatives = [],
  isActive = false,
  loggedSets = [],
  selectedAlternative,
  onSetUpdate,
  onStartRest,
  onAlternativeSelect,
}: ExerciseCardProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const parseRestTime = (restStr: string): number => {
    const match = restStr.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (restStr.includes('min')) return num * 60;
      return num;
    }
    return 90;
  };

  const isQLWarning = notes.includes('QL');
  const isLoggedMode = loggedSets.length > 0 || isActive;
  const hasAlternatives = alternatives && alternatives.length > 0;
  const completedSets = loggedSets.filter(s => s.completed).length;
  const currentName = selectedAlternative || name;

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">
              {currentName}
              {selectedAlternative && (
                <span className="text-neutral-500 text-xs ml-2 font-normal">alt</span>
              )}
            </h3>
            {notes && !isQLWarning && (
              <p className="text-neutral-600 text-xs mt-1 truncate">{notes.replace('⚠️ ', '').replace(' - Be careful!', '')}</p>
            )}
            {isQLWarning && (
              <p className="text-yellow-500 text-xs mt-1">QL Injury - Be careful</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-white font-semibold">{sets} × {reps}</span>
            <p className="text-neutral-600 text-xs">{rest} rest</p>
          </div>
        </div>

        {/* Progress indicator during active workout */}
        {isLoggedMode && loggedSets.length > 0 && (
          <div className="mt-3 flex gap-1">
            {loggedSets.map((s, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  s.completed ? 'bg-white' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alternatives Button */}
      {hasAlternatives && isActive && (
        <button
          onClick={() => setShowAlternatives(!showAlternatives)}
          className="w-full py-2 text-xs text-neutral-500 border-t border-neutral-900 hover:text-white transition-colors"
        >
          {showAlternatives ? 'Hide alternatives' : 'Show alternatives'}
        </button>
      )}

      {/* Alternative Options */}
      {showAlternatives && hasAlternatives && (
        <div className="px-4 py-3 border-t border-neutral-900 space-y-2">
          <button
            onClick={() => onAlternativeSelect?.(null)}
            className={`w-full py-2 px-3 rounded text-sm text-left transition-colors ${
              !selectedAlternative ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'
            }`}
          >
            {name}
          </button>
          {alternatives.map((alt, idx) => (
            <button
              key={idx}
              onClick={() => onAlternativeSelect?.(alt)}
              className={`w-full py-2 px-3 rounded text-sm text-left transition-colors ${
                selectedAlternative === alt ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              {alt}
            </button>
          ))}
        </div>
      )}

      {/* Set Logging */}
      {isLoggedMode && onSetUpdate && (
        <div className="border-t border-neutral-900">
          {Array.from({ length: sets }, (_, i) => {
            const loggedSet = loggedSets[i] || { weight: 0, reps: 0, completed: false };
            return (
              <div 
                key={i} 
                className={`flex items-center gap-3 px-4 py-3 border-b border-neutral-900 last:border-b-0 ${
                  loggedSet.completed ? 'bg-neutral-900/50' : ''
                }`}
              >
                <span className="text-neutral-600 text-sm w-6">{i + 1}</span>
                <input
                  type="number"
                  placeholder="kg"
                  value={loggedSet.weight || ''}
                  onChange={(e) => onSetUpdate(i, parseFloat(e.target.value) || 0, loggedSet.reps, loggedSet.completed)}
                  className="w-16 px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white text-sm text-center focus:border-neutral-600 focus:outline-none"
                />
                <span className="text-neutral-700">×</span>
                <input
                  type="number"
                  placeholder="reps"
                  value={loggedSet.reps || ''}
                  onChange={(e) => onSetUpdate(i, loggedSet.weight, parseInt(e.target.value) || 0, loggedSet.completed)}
                  className="w-16 px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white text-sm text-center focus:border-neutral-600 focus:outline-none"
                />
                <button
                  onClick={() => {
                    onSetUpdate(i, loggedSet.weight, loggedSet.reps, !loggedSet.completed);
                    if (!loggedSet.completed && onStartRest) {
                      onStartRest(parseRestTime(rest));
                    }
                  }}
                  className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    loggedSet.completed
                      ? 'bg-white text-black'
                      : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                  }`}
                >
                  {loggedSet.completed ? '✓' : ''}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
