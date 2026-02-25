'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface RestTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function RestTimer({ initialSeconds, onComplete, autoStart = false }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            onCompleteRef.current?.();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const start = useCallback(() => { setIsRunning(true); setIsComplete(false); }, []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => { setSeconds(initialSeconds); setIsRunning(false); setIsComplete(false); }, [initialSeconds]);
  const addTime = useCallback((amount: number) => { setSeconds(s => Math.max(0, s + amount)); setIsComplete(false); }, []);

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 text-center">
      <div className="text-neutral-500 text-xs uppercase tracking-wider mb-4">Rest Timer</div>
      
      {/* Timer */}
      <div className="text-5xl font-light tracking-tight mb-6">
        <span className={isComplete ? 'text-white' : 'text-white'}>{formatTime(seconds)}</span>
      </div>

      {/* Quick Add */}
      <div className="flex justify-center gap-2 mb-6">
        {[-15, 15, 30].map((amt) => (
          <button
            key={amt}
            onClick={() => addTime(amt)}
            className="px-4 py-2 bg-neutral-900 text-neutral-400 text-sm rounded hover:text-white transition-colors"
          >
            {amt > 0 ? '+' : ''}{amt}s
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button onClick={start} className="px-8 py-2.5 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 transition-colors">
            Start
          </button>
        ) : (
          <button onClick={pause} className="px-8 py-2.5 bg-neutral-800 text-white text-sm font-medium rounded hover:bg-neutral-700 transition-colors">
            Pause
          </button>
        )}
        <button onClick={reset} className="px-8 py-2.5 bg-neutral-900 text-neutral-400 text-sm rounded hover:text-white transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}
