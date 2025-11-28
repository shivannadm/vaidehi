// src/app/dashboard/components/TimerContext.tsx
// ✅ NEW FILE: Global timer context that persists across route changes
"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { 
  createTaskSession, 
  endTaskSession, 
  addTimeToTask,
  getActiveSession 
} from "@/lib/supabase/task-helpers";
import { formatDateToString } from "@/types/database";

interface TimerState {
  taskId: string | null;
  taskTitle: string | null;
  sessionId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
  isRunning: boolean;
}

interface TimerContextType {
  timer: TimerState;
  startTimer: (taskId: string, taskTitle: string, userId: string, date: Date) => Promise<void>;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => Promise<boolean>;
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
  const [timer, setTimer] = useState<TimerState>({
    taskId: null,
    taskTitle: null,
    sessionId: null,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Check for active session on mount
  useEffect(() => {
    if (!userId) return;

    const checkActiveSession = async () => {
      try {
        const { data } = await getActiveSession(userId);
        if (data) {
          const start = new Date(data.start_time);
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);

          startTimeRef.current = start.getTime();

          setTimer({
            taskId: data.task_id,
            taskTitle: data.task.title,
            sessionId: data.id,
            startTime: start,
            elapsedSeconds: elapsed,
            isRunning: true
          });
        }
      } catch (err) {
        console.error("Error checking active session:", err);
      }
    };

    checkActiveSession();
  }, [userId]);

  // ✅ Timer tick - persists across route changes
  useEffect(() => {
    if (timer.isRunning && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current!) / 1000);
        
        setTimer(prev => ({
          ...prev,
          elapsedSeconds: elapsed
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // ✅ CRITICAL: Don't clear interval on unmount - let it persist
    return () => {
      // Only clear if explicitly stopped
      if (!timer.isRunning && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning]);

  const startTimer = async (taskId: string, taskTitle: string, userId: string, date: Date) => {
    try {
      const now = new Date();
      const { data, error } = await createTaskSession({
        task_id: taskId,
        user_id: userId,
        start_time: now.toISOString(),
        end_time: null,
        duration: 0,
        date: formatDateToString(date)
      });

      if (error || !data) {
        console.error("Error creating session:", error);
        alert("Failed to start timer");
        return;
      }

      startTimeRef.current = now.getTime();

      setTimer({
        taskId,
        taskTitle,
        sessionId: data.id,
        startTime: now,
        elapsedSeconds: 0,
        isRunning: true
      });
    } catch (err) {
      console.error("Error starting timer:", err);
      alert("An error occurred");
    }
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    if (startTimeRef.current) {
      setTimer(prev => ({ ...prev, isRunning: true }));
    }
  };

  const stopTimer = async () => {
    if (!timer.sessionId || !timer.taskId) return false;

    try {
      const now = new Date();
      const duration = startTimeRef.current 
        ? Math.floor((now.getTime() - startTimeRef.current) / 1000)
        : timer.elapsedSeconds;

      if (duration === 0) {
        console.warn("Cannot save 0-second session");
        return false;
      }

      const { error: endError } = await endTaskSession(
        timer.sessionId,
        now.toISOString(),
        duration
      );

      if (endError) {
        console.error("Error ending session:", endError);
        alert("Failed to save timer");
        return false;
      }

      const { error: addTimeError } = await addTimeToTask(timer.taskId, duration);

      if (addTimeError) {
        console.error("Error adding time to task:", addTimeError);
      }

      // Clear interval explicitly
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      startTimeRef.current = null;
      setTimer({
        taskId: null,
        taskTitle: null,
        sessionId: null,
        startTime: null,
        elapsedSeconds: 0,
        isRunning: false
      });

      return true;
    } catch (err) {
      console.error("Error stopping timer:", err);
      alert("An error occurred");
      return false;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider value={{ timer, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return context;
}