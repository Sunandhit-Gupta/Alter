"use client";

import { useEffect, useRef, useState } from 'react';

export default function QuizTimer({ duration, onTimerEnd, isSubmitted }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const timerRef = useRef(null);
  const savedOnTimerEnd = useRef(onTimerEnd);

  // Update saved callback if onTimerEnd changes
  useEffect(() => {
    savedOnTimerEnd.current = onTimerEnd;
  }, [onTimerEnd]);

  useEffect(() => {
    if (isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          savedOnTimerEnd.current();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [duration, isSubmitted]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine the color based on time remaining
  const getTimerColor = () => {
    const totalSeconds = duration * 60;
    const percentRemaining = (timeLeft / totalSeconds) * 100;
    if (percentRemaining <= 10) return 'text-red-600 animate-pulse';
    if (percentRemaining <= 25) return 'text-red-500';
    if (percentRemaining <= 50) return 'text-yellow-500';
    return 'text-green-600';
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
        <p className={`text-xl font-bold ${getTimerColor()}`}>
          ⏱️ {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
}
