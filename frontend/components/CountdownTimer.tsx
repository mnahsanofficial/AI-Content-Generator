'use client';

import { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  className?: string;
}

export default function CountdownTimer({ initialSeconds, onComplete, className = '' }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset seconds when initialSeconds changes
    setSeconds(initialSeconds);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (initialSeconds <= 0) {
      // Defer onComplete to avoid setState during render
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 0);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Defer onComplete to avoid setState during render
          if (onComplete) {
            setTimeout(() => {
              onComplete();
            }, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [initialSeconds, onComplete]);

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / initialSeconds) * 100;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-bold text-yellow-700 tabular-nums">
              {formatTime(seconds)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-900">
          {seconds > 0 ? 'Processing will start in' : 'Starting processing...'}
        </p>
        <p className="text-xs text-yellow-700 mt-0.5">
          {seconds > 0 ? 'Please wait while your job is queued' : 'Your content is being generated'}
        </p>
      </div>
    </div>
  );
}
