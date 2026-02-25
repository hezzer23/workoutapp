'use client';

import { useState, useMemo, useEffect } from 'react';
import { getSessions, getExerciseProgress } from '@/lib/storage';
import { WorkoutSession } from '@/lib/types';

export default function ProgressView() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  // Reload sessions every time this tab is viewed
  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const stats = useMemo(() => {
    const completedSessions = sessions.filter(s => s.completed);
    const thisWeek = completedSessions.filter(s => {
      const sessionDate = new Date(s.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate >= weekAgo;
    }).length;
    
    return { totalWorkouts: completedSessions.length, thisWeek };
  }, [sessions]);

  const exerciseHistory = useMemo(() => {
    if (!selectedExercise) return [];
    return getExerciseProgress(selectedExercise);
  }, [selectedExercise]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const allExercises = useMemo(() => 
    Array.from(new Set(sessions.flatMap(s => s.exercises.map(e => e.name)))),
    [sessions]
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
          <div className="text-4xl font-light">{stats.totalWorkouts}</div>
          <div className="text-neutral-600 text-xs uppercase tracking-wider mt-1">Total</div>
        </div>
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
          <div className="text-4xl font-light">{stats.thisWeek}</div>
          <div className="text-neutral-600 text-xs uppercase tracking-wider mt-1">This Week</div>
        </div>
      </div>

      {/* Exercise Progress */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">Track Progress</h3>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full p-3 bg-neutral-950 border border-neutral-900 rounded-lg text-white text-sm focus:border-neutral-700 focus:outline-none"
        >
          <option value="">Select exercise...</option>
          {allExercises.map(ex => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>

        {exerciseHistory.length > 0 && (
          <div className="mt-4 space-y-0">
            {exerciseHistory.slice(0, 10).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-neutral-900/50">
                <span className="text-neutral-500 text-sm">{formatDate(entry.date)}</span>
                <span className="text-white font-medium">{entry.weight}kg × {entry.reps}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">History</h3>
        {sessions.length === 0 ? (
          <div className="text-neutral-600 text-sm py-8 text-center">No workouts yet</div>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 10).map((session) => (
              <div 
                key={session.id} 
                className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden"
              >
                {/* Session Header - Clickable */}
                <button
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="text-white font-medium">{session.typeName}</span>
                    <p className="text-neutral-600 text-xs mt-0.5">
                      {formatDate(session.date)} at {formatTime(session.date)}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-neutral-500 text-sm">
                        {session.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)} sets
                      </span>
                      {session.duration && (
                        <p className="text-neutral-600 text-xs">{session.duration} min</p>
                      )}
                    </div>
                    <span className={`text-neutral-600 transition-transform ${expandedSession === session.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedSession === session.id && (
                  <div className="border-t border-neutral-900 px-4 py-3">
                    {session.exercises.map((exercise, idx) => {
                      const completedSets = exercise.sets.filter(s => s.completed);
                      if (completedSets.length === 0) return null;
                      
                      return (
                        <div key={idx} className="py-2 border-b border-neutral-900/50 last:border-0">
                          <div className="text-white text-sm font-medium">{exercise.name}</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {completedSets.map((set, setIdx) => (
                              <span 
                                key={setIdx}
                                className="text-xs bg-neutral-900 px-2 py-1 rounded text-neutral-400"
                              >
                                {set.weight}kg × {set.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
