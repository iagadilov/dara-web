'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseTimerProps {
  duration: number;
  onComplete: () => void;
}

export function ExerciseTimer({ duration, onComplete }: ExerciseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  useEffect(() => {
    if (finished) {
      setFinished(false);
      onCompleteRef.current();
    }
  }, [finished]);

  const reset = useCallback(() => {
    setRunning(false);
    setTimeLeft(duration);
  }, [duration]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular timer */}
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${progress * 2.827} ${282.7 - progress * 2.827}`}
            strokeLinecap="round"
            className="text-foreground transition-all"
          />
        </svg>
        <span className="font-mono text-3xl font-bold">
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={reset}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => setRunning(!running)}
        >
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
