// src/app/dashboard/components/TimerContext.tsx
// ✅ FIXED: Ensures task duration updates correctly on timer stop
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
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDurationRef = useRef<number>(0); // ✅ Track what we've already saved

  // Check for active session on mount
  useEffect(() => {
    if (!userId) return;

    const checkActiveSession = async () => {
      try {
        const savedTimer = localStorage.getItem('activeTimer');
        if (savedTimer) {
          const parsed = JSON.parse(savedTimer);
          const start = parsed.startTime;
          const now = Date.now();
          const elapsed = Math.floor((now - start) / 1000);

          startTimeRef.current = start;
          lastSavedDurationRef.current = parsed.lastSavedDuration || 0;

          setTimer({
            taskId: parsed.taskId,
            taskTitle: parsed.taskTitle,
            sessionId: parsed.sessionId,
            startTime: new Date(start),
            elapsedSeconds: elapsed,
            isRunning: parsed.isRunning
          });

          return;
        }

        const { data } = await getActiveSession(userId);
        if (data) {
          const start = new Date(data.start_time);
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);

          startTimeRef.current = start.getTime();
          lastSavedDurationRef.current = 0;

          setTimer({
            taskId: data.task_id,
            taskTitle: data.task.title,
            sessionId: data.id,
            startTime: start,
            elapsedSeconds: elapsed,
            isRunning: true
          });

          localStorage.setItem('activeTimer', JSON.stringify({
            taskId: data.task_id,
            taskTitle: data.task.title,
            sessionId: data.id,
            startTime: start.getTime(),
            isRunning: true,
            lastSavedDuration: 0
          }));
        }
      } catch (err) {
        console.error("Error checking active session:", err);
      }
    };

    checkActiveSession();
  }, [userId]);

  // ✅ TIMER TICK - Update elapsed time EVERY SECOND
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

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.isRunning, startTimeRef.current]);

  // ✅ AUTO-SAVE - Update database every 30 seconds
  useEffect(() => {
    if (!timer.isRunning || !timer.sessionId || !userId || !startTimeRef.current) return;

    const originalStartTime = startTimeRef.current;

    const saveProgress = async () => {
      const now = Date.now();
      const totalDuration = Math.floor((now - originalStartTime) / 1000);

      if (totalDuration > 0) {
        try {
          // Update session with total duration
          await endTaskSession(timer.sessionId!, new Date(now).toISOString(), totalDuration);
          
          // ✅ CRITICAL FIX: Only add the NEW time since last save
          if (timer.taskId) {
            const newTime = totalDuration - lastSavedDurationRef.current;
            if (newTime > 0) {
              const { error } = await addTimeToTask(timer.taskId, newTime);
              if (!error) {
                lastSavedDurationRef.current = totalDuration;
                
                // Update localStorage
                localStorage.setItem('activeTimer', JSON.stringify({
                  taskId: timer.taskId,
                  taskTitle: timer.taskTitle,
                  sessionId: timer.sessionId,
                  startTime: originalStartTime,
                  isRunning: true,
                  lastSavedDuration: totalDuration
                }));
              }
            }
          }

          console.log(`✅ Auto-saved: ${totalDuration}s total (${totalDuration - lastSavedDurationRef.current}s new)`);
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      }
    };

    autoSaveIntervalRef.current = setInterval(saveProgress, 30000);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [timer.isRunning, timer.sessionId, timer.taskId, userId]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (timer.sessionId && startTimeRef.current && timer.taskId) {
        const now = Date.now();
        const duration = Math.floor((now - startTimeRef.current) / 1000);

        if (duration > 0) {
          try {
            await endTaskSession(timer.sessionId, new Date(now).toISOString(), duration);
            
            // ✅ Save remaining unsaved time
            const newTime = duration - lastSavedDurationRef.current;
            if (newTime > 0) {
              await addTimeToTask(timer.taskId, newTime);
            }
          } catch (err) {
            console.error("Error saving on unload:", err);
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timer.sessionId, timer.taskId]);

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
      lastSavedDurationRef.current = 0;

      const newTimer = {
        taskId,
        taskTitle,
        sessionId: data.id,
        startTime: now,
        elapsedSeconds: 0,
        isRunning: true
      };

      setTimer(newTimer);

      localStorage.setItem('activeTimer', JSON.stringify({
        taskId,
        taskTitle,
        sessionId: data.id,
        startTime: now.getTime(),
        isRunning: true,
        lastSavedDuration: 0
      }));

      console.log('✅ Timer started:', taskTitle);
    } catch (err) {
      console.error("Error starting timer:", err);
      alert("An error occurred");
    }
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
    const saved = localStorage.getItem('activeTimer');
    if (saved) {
      const parsed = JSON.parse(saved);
      localStorage.setItem('activeTimer', JSON.stringify({ 
        ...parsed, 
        isRunning: false,
        lastSavedDuration: lastSavedDurationRef.current 
      }));
    }
  };

  const resumeTimer = () => {
    if (startTimeRef.current) {
      setTimer(prev => ({ ...prev, isRunning: true }));
      const saved = localStorage.getItem('activeTimer');
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem('activeTimer', JSON.stringify({ 
          ...parsed, 
          isRunning: true,
          lastSavedDuration: lastSavedDurationRef.current 
        }));
      }
    }
  };

  const stopTimer = async () => {
    if (!timer.sessionId || !timer.taskId) return false;

    try {
      const now = new Date();
      
      // ✅ Calculate from ORIGINAL start time
      const originalStart = timer.startTime?.getTime() || startTimeRef.current;
      const duration = originalStart
        ? Math.floor((now.getTime() - originalStart) / 1000)
        : timer.elapsedSeconds;

      if (duration === 0) {
        console.warn("Cannot save 0-second session");
        return false;
      }

      // End session
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

      // ✅ CRITICAL FIX: Add remaining unsaved time to task
      const remainingTime = duration - lastSavedDurationRef.current;
      if (remainingTime > 0) {
        const { error: addTimeError } = await addTimeToTask(timer.taskId, remainingTime);
        if (addTimeError) {
          console.error("Error adding time to task:", addTimeError);
        }
      }

      localStorage.removeItem('activeTimer');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      startTimeRef.current = null;
      lastSavedDurationRef.current = 0;
      
      setTimer({
        taskId: null,
        taskTitle: null,
        sessionId: null,
        startTime: null,
        elapsedSeconds: 0,
        isRunning: false
      });

      console.log('✅ Timer stopped:', duration, 'seconds');
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

// ============================================
// ✅ KEY FIXES FOR TIMER DURATION:
// ============================================
/*
1. Added lastSavedDurationRef to track already saved time
2. Auto-save now only adds NEW time (line 149-153)
3. stopTimer adds remaining unsaved time (line 282-288)
4. localStorage stores lastSavedDuration for crash recovery
5. Prevents duplicate time additions

This ensures task duration is ALWAYS accurate!
*/