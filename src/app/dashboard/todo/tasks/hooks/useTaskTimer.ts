// src/app/dashboard/todo/tasks/hooks/useTaskTimer.ts
import { useState, useEffect, useRef } from "react";
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

export function useTaskTimer(userId: string | null, currentDate: Date) {
  const [timer, setTimer] = useState<TimerState>({
    taskId: null,
    taskTitle: null,
    sessionId: null,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Timer tick
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
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
      }
    };
  }, [timer.isRunning]);

  const startTimer = async (taskId: string, taskTitle: string) => {
    if (!userId) return;

    try {
      const now = new Date();
      const { data, error } = await createTaskSession({
        task_id: taskId,
        user_id: userId,
        start_time: now.toISOString(),
        end_time: null,
        duration: 0,
        date: formatDateToString(currentDate)
      });

      if (error || !data) {
        console.error("Error creating session:", error);
        alert("Failed to start timer");
        return;
      }

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
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const stopTimer = async () => {
    if (!timer.sessionId || !timer.taskId) return;

    try {
      const now = new Date();
      const duration = timer.elapsedSeconds;

      // IMPORTANT: Don't stop if duration is 0
      if (duration === 0) {
        console.warn("Cannot save 0-second session");
        return false;
      }

      // End the session with correct duration
      const { error: endError } = await endTaskSession(
        timer.sessionId,
        now.toISOString(),
        duration // This is in SECONDS
      );

      if (endError) {
        console.error("Error ending session:", endError);
        alert("Failed to save timer");
        return false;
      }

      // Add time to task
      const { error: addTimeError } = await addTimeToTask(timer.taskId, duration);

      if (addTimeError) {
        console.error("Error adding time to task:", addTimeError);
      }

      // Reset timer
      setTimer({
        taskId: null,
        taskTitle: null,
        sessionId: null,
        startTime: null,
        elapsedSeconds: 0,
        isRunning: false
      });

      return true; // Success
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

  return {
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formatTime
  };
}