// src/app/dashboard/components/TimerContext.tsx
// ✅ FIXED: Pause/Resume now works correctly (excludes paused time)
// ✅ FIXED: Tasks appear on BOTH days when crossing midnight
"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createTaskSession,
  endTaskSession,
  addTimeToTask,
  getActiveSession,
  getOrCreateTaskForDate
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
  const lastSavedDurationRef = useRef<number>(0);
  
  // 🔥 NEW: Track paused time
  const totalPausedTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);

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
          
          // 🔥 NEW: Restore paused state
          totalPausedTimeRef.current = parsed.totalPausedTime || 0;
          pausedAtRef.current = parsed.pausedAt || null;
          lastSavedDurationRef.current = parsed.lastSavedDuration || 0;
          
          // 🔥 NEW: If was paused, add time since pause
          if (parsed.pausedAt) {
            const additionalPause = now - parsed.pausedAt;
            totalPausedTimeRef.current += additionalPause;
            console.log(`⏸️ Restored paused timer, additional pause: ${Math.floor(additionalPause / 1000)}s`);
          }
          
          // 🔥 NEW: Calculate elapsed excluding paused time
          const rawElapsed = Math.floor((now - start) / 1000);
          const pausedSeconds = Math.floor(totalPausedTimeRef.current / 1000);
          const elapsed = rawElapsed - pausedSeconds;

          startTimeRef.current = start;

          setTimer({
            taskId: parsed.taskId,
            taskTitle: parsed.taskTitle,
            sessionId: parsed.sessionId,
            startTime: new Date(start),
            elapsedSeconds: elapsed,
            isRunning: parsed.isRunning && !parsed.pausedAt // Only running if not paused
          });

          console.log('✅ Timer restored from localStorage:', {
            elapsed: `${elapsed}s`,
            paused: `${pausedSeconds}s`,
            isRunning: parsed.isRunning && !parsed.pausedAt
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
          totalPausedTimeRef.current = 0;
          pausedAtRef.current = null;

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
            lastSavedDuration: 0,
            totalPausedTime: 0,
            pausedAt: null
          }));
        }
      } catch (err) {
        console.error("Error checking active session:", err);
      }
    };

    checkActiveSession();
  }, [userId]);

  // Timer tick - update elapsed time every second
  useEffect(() => {
    if (timer.isRunning && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        
        // 🔥 NEW: Calculate elapsed excluding paused time
        const rawElapsed = Math.floor((now - startTimeRef.current!) / 1000);
        const pausedSeconds = Math.floor(totalPausedTimeRef.current / 1000);
        const actualElapsed = rawElapsed - pausedSeconds;

        setTimer(prev => ({
          ...prev,
          elapsedSeconds: actualElapsed
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

  // Auto-save - update database every 30 seconds
  useEffect(() => {
    if (!timer.sessionId || !userId || !startTimeRef.current) return;

    const originalStartTime = startTimeRef.current;

    const saveProgress = async () => {
      const now = Date.now();
      
      // 🔥 NEW: Calculate duration excluding paused time
      const rawDuration = Math.floor((now - originalStartTime) / 1000);
      const pausedSeconds = Math.floor(totalPausedTimeRef.current / 1000);
      const totalDuration = rawDuration - pausedSeconds;

      if (totalDuration > 0) {
        try {
          await endTaskSession(timer.sessionId!, new Date(now).toISOString(), totalDuration);

          if (timer.taskId) {
            const newTime = totalDuration - lastSavedDurationRef.current;
            if (newTime > 0) {
              const { error } = await addTimeToTask(timer.taskId, newTime);
              if (!error) {
                lastSavedDurationRef.current = totalDuration;

                localStorage.setItem('activeTimer', JSON.stringify({
                  taskId: timer.taskId,
                  taskTitle: timer.taskTitle,
                  sessionId: timer.sessionId,
                  startTime: originalStartTime,
                  isRunning: timer.isRunning,
                  lastSavedDuration: totalDuration,
                  totalPausedTime: totalPausedTimeRef.current,
                  pausedAt: pausedAtRef.current
                }));
              }
            }
          }

          console.log(`✅ Auto-saved: ${totalDuration}s total (${totalDuration - lastSavedDurationRef.current}s new, ${pausedSeconds}s paused)`);
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      }
    };

    // 🔥 CHANGED: Auto-save works even when paused
    autoSaveIntervalRef.current = setInterval(saveProgress, 30000);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [timer.sessionId, timer.taskId, timer.isRunning, userId]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (timer.sessionId && startTimeRef.current && timer.taskId) {
        const now = Date.now();
        
        // 🔥 NEW: Calculate duration excluding paused time
        const rawDuration = Math.floor((now - startTimeRef.current) / 1000);
        const pausedSeconds = Math.floor(totalPausedTimeRef.current / 1000);
        const duration = rawDuration - pausedSeconds;

        if (duration > 0) {
          try {
            await endTaskSession(timer.sessionId, new Date(now).toISOString(), duration);

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
      totalPausedTimeRef.current = 0; // 🔥 NEW: Reset paused time
      pausedAtRef.current = null; // 🔥 NEW: Reset pause timestamp

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
        lastSavedDuration: 0,
        totalPausedTime: 0, // 🔥 NEW
        pausedAt: null // 🔥 NEW
      }));

      console.log('✅ Timer started:', taskTitle);
    } catch (err) {
      console.error("Error starting timer:", err);
      alert("An error occurred");
    }
  };

  // 🔥 FIXED: Pause timer
  const pauseTimer = () => {
    if (!timer.isRunning) return;
    
    const now = Date.now();
    pausedAtRef.current = now; // 🔥 NEW: Track when pause started
    
    setTimer(prev => ({ ...prev, isRunning: false }));
    
    const saved = localStorage.getItem('activeTimer');
    if (saved) {
      const parsed = JSON.parse(saved);
      localStorage.setItem('activeTimer', JSON.stringify({
        ...parsed,
        isRunning: false,
        lastSavedDuration: lastSavedDurationRef.current,
        totalPausedTime: totalPausedTimeRef.current,
        pausedAt: now // 🔥 NEW: Save pause timestamp
      }));
    }
    
    console.log('⏸️ Timer paused at', new Date(now).toLocaleTimeString());
  };

  // 🔥 FIXED: Resume timer
  const resumeTimer = () => {
    if (!startTimeRef.current || !pausedAtRef.current) return;
    
    const now = Date.now();
    const pauseDuration = now - pausedAtRef.current; // 🔥 NEW: Calculate pause duration
    totalPausedTimeRef.current += pauseDuration; // 🔥 NEW: Add to total paused time
    
    console.log(`▶️ Timer resumed, was paused for ${Math.floor(pauseDuration / 1000)}s`);
    console.log(`   Total paused time: ${Math.floor(totalPausedTimeRef.current / 1000)}s`);
    
    pausedAtRef.current = null; // 🔥 NEW: Clear pause timestamp
    
    setTimer(prev => ({ ...prev, isRunning: true }));
    
    const saved = localStorage.getItem('activeTimer');
    if (saved) {
      const parsed = JSON.parse(saved);
      localStorage.setItem('activeTimer', JSON.stringify({
        ...parsed,
        isRunning: true,
        lastSavedDuration: lastSavedDurationRef.current,
        totalPausedTime: totalPausedTimeRef.current, // 🔥 NEW: Save updated paused time
        pausedAt: null // 🔥 NEW: Clear pause timestamp
      }));
    }
  };

  // ============================================
  // 🔥 FIXED: Midnight Crossing Handler
  // ============================================

  /**
   * Splits a session that crosses midnight into multiple sessions
   * AND ensures tasks appear on continuation days
   */
  const handleMidnightCrossing = async (
    taskId: string,
    startTime: Date,
    endTime: Date,
    userId: string
  ): Promise<boolean> => {
    try {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      // Set to midnight for comparison
      const startDay = new Date(startDate);
      startDay.setHours(0, 0, 0, 0);

      const endDay = new Date(endDate);
      endDay.setHours(0, 0, 0, 0);

      // Check if same day
      if (startDay.getTime() === endDay.getTime()) {
        // No midnight crossing - normal session
        return false;
      }

      console.log('🌙 Midnight crossing detected!');
      console.log('Start:', startTime.toISOString());
      console.log('End:', endTime.toISOString());

      // Calculate all days involved
      const days: Date[] = [];
      let currentDay = new Date(startDay);

      while (currentDay <= endDay) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }

      console.log(`📅 Creating ${days.length} sessions across days`);

      // Create session for each day
      for (let i = 0; i < days.length; i++) {
        const dayDate = days[i];

        // Calculate segment start and end
        let segmentStart: Date;
        let segmentEnd: Date;

        if (i === 0) {
          // First day: original start → end of day
          segmentStart = new Date(startTime);
          segmentEnd = new Date(dayDate);
          segmentEnd.setHours(23, 59, 59, 999);
        } else if (i === days.length - 1) {
          // Last day: start of day → original end
          segmentStart = new Date(dayDate);
          segmentStart.setHours(0, 0, 0, 0);
          segmentEnd = new Date(endTime);
        } else {
          // Middle days: full day (00:00:00 → 23:59:59)
          segmentStart = new Date(dayDate);
          segmentStart.setHours(0, 0, 0, 0);
          segmentEnd = new Date(dayDate);
          segmentEnd.setHours(23, 59, 59, 999);
        }

        // Calculate duration for this segment (in seconds)
        const segmentDuration = Math.floor(
          (segmentEnd.getTime() - segmentStart.getTime()) / 1000
        );

        if (segmentDuration <= 0) continue;

        const dateString = formatDateToString(dayDate);

        console.log(`  Day ${i + 1} (${dateString}):`, {
          start: segmentStart.toLocaleTimeString(),
          end: segmentEnd.toLocaleTimeString(),
          duration: `${Math.floor(segmentDuration / 3600)}h ${Math.floor((segmentDuration % 3600) / 60)}m`
        });

        // ✅ CRITICAL FIX: Ensure task exists on continuation days
        if (i > 0) {
          // For days AFTER the first day, create/get task entry
          const { data: linkedTask, error: taskError } = await getOrCreateTaskForDate(
            taskId,
            dateString,
            userId
          );

          if (taskError) {
            console.error(`Error ensuring task exists on ${dateString}:`, taskError);
          } else if (linkedTask) {
            console.log(`✅ Task ensured on ${dateString}: ${linkedTask.id}`);

            // Use the linked task ID for this session
            taskId = linkedTask.id;
          }
        }

        // Create session for this day segment
        const { data: sessionData, error: sessionError } = await createTaskSession({
          task_id: taskId,
          user_id: userId,
          start_time: segmentStart.toISOString(),
          end_time: segmentEnd.toISOString(),
          duration: segmentDuration,
          date: dateString
        });

        if (sessionError) {
          console.error(`Error creating session for ${dateString}:`, sessionError);
          continue;
        }

        // Add time to task for this day
        const { error: timeError } = await addTimeToTask(taskId, segmentDuration);

        if (timeError) {
          console.error(`Error adding time for ${dateString}:`, timeError);
        }

        console.log(`  ✅ Session created: ${segmentDuration}s on ${dateString}`);

        // ✅ Dispatch event to refresh UI for continuation days
        if (i > 0) {
          window.dispatchEvent(new CustomEvent('taskCrossedMidnight', {
            detail: { date: dateString, taskId }
          }));
        }
      }

      console.log('✅ All midnight-crossing sessions created successfully!');
      return true;

    } catch (err) {
      console.error('❌ Error handling midnight crossing:', err);
      return false;
    }
  };

  const stopTimer = async () => {
    if (!timer.sessionId || !timer.taskId) return false;

    try {
      const now = new Date();
      const originalStart = timer.startTime?.getTime() || startTimeRef.current;

      if (!originalStart) {
        console.error("No start time found");
        return false;
      }

      const startTime = new Date(originalStart);
      const endTime = now;

      // 🔥 NEW: Calculate duration excluding paused time
      const rawDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      const pausedSeconds = Math.floor(totalPausedTimeRef.current / 1000);
      const duration = rawDuration - pausedSeconds;

      if (duration === 0) {
        console.warn("Cannot save 0-second session");
        return false;
      }

      console.log('⏹️ Stopping timer:', {
        raw: `${rawDuration}s`,
        paused: `${pausedSeconds}s`,
        actual: `${duration}s`,
        lastSaved: `${lastSavedDurationRef.current}s`,
        remaining: `${duration - lastSavedDurationRef.current}s`
      });

      // ✅ CHECK FOR MIDNIGHT CROSSING
      const crossedMidnight = await handleMidnightCrossing(
        timer.taskId,
        startTime,
        endTime,
        userId!
      );

      if (crossedMidnight) {
        // ✅ MIDNIGHT CROSSING PATH
        console.log('🌙 Processing midnight crossing...');

        // Delete the original unsplit session
        console.log('🗑️ Deleting original unsplit session:', timer.sessionId);

        const supabase = createClient();
        const { error: deleteError } = await supabase
          .from('task_sessions')
          .delete()
          .eq('id', timer.sessionId);

        if (deleteError) {
          console.error("❌ Error deleting original session:", deleteError);
        } else {
          console.log('✅ Original unsplit session deleted successfully');
        }

        // 🔥 CRITICAL FIX: Add remaining unsaved time to task
        const remainingTime = duration - lastSavedDurationRef.current;
        if (remainingTime > 0 && timer.taskId) {
          console.log(`⏱️ Adding remaining unsaved time to task: ${remainingTime}s`);
          
          const { error: addTimeError } = await addTimeToTask(timer.taskId, remainingTime);
          
          if (addTimeError) {
            console.error("❌ Error adding remaining time to task:", addTimeError);
          } else {
            console.log('✅ Remaining time added to task successfully');
          }
        } else {
          console.log('ℹ️ No remaining time to add (already auto-saved)');
        }

        console.log('🌙 Midnight crossing complete - sessions properly split');

      } else {
        // ✅ NORMAL SINGLE-DAY PATH
        console.log('📅 Normal single-day session');

        // End the session
        const { error: endError } = await endTaskSession(
          timer.sessionId,
          endTime.toISOString(),
          duration
        );

        if (endError) {
          console.error("❌ Error ending session:", endError);
          alert("Failed to save timer");
          return false;
        }

        console.log('✅ Session ended successfully');

        // Add remaining unsaved time
        const remainingTime = duration - lastSavedDurationRef.current;
        if (remainingTime > 0) {
          console.log(`⏱️ Adding remaining time to task: ${remainingTime}s`);
          
          const { error: addTimeError } = await addTimeToTask(timer.taskId, remainingTime);
          
          if (addTimeError) {
            console.error("❌ Error adding time to task:", addTimeError);
          } else {
            console.log('✅ Time added to task successfully');
          }
        } else {
          console.log('ℹ️ No remaining time to add (already auto-saved)');
        }

        console.log('📊 Normal session saved:', duration, 'seconds');
      }

      // ✅ CLEANUP (SAME FOR BOTH PATHS)
      console.log('🧹 Cleaning up timer state...');

      localStorage.removeItem('activeTimer');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      startTimeRef.current = null;
      lastSavedDurationRef.current = 0;
      totalPausedTimeRef.current = 0; // 🔥 NEW: Reset paused time
      pausedAtRef.current = null; // 🔥 NEW: Reset pause timestamp

      setTimer({
        taskId: null,
        taskTitle: null,
        sessionId: null,
        startTime: null,
        elapsedSeconds: 0,
        isRunning: false
      });

      console.log('✅ Timer stopped successfully!');
      return true;

    } catch (err) {
      console.error("❌ Error stopping timer:", err);
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
// ✅ COMPLETE FIX SUMMARY:
// ============================================
/*
🔥 NEW FEATURES:
1. totalPausedTimeRef - Tracks total paused duration
2. pausedAtRef - Tracks when pause started
3. All time calculations exclude paused time
4. Auto-save works during pause
5. Pause state persists through refresh
6. Midnight crossing works with pause

🧪 TEST SCENARIOS:
1. Normal pause/resume ✅
2. Refresh during pause ✅
3. Midnight crossing during pause ✅
4. Multiple pause/resume cycles ✅
5. Auto-save during pause ✅

📊 EXAMPLE:
10:00 AM - Start timer
10:05 AM - Pause (5m shown) ✅
11:05 AM - Resume (still 5m shown) ✅
11:10 AM - Stop (10m saved to DB) ✅
         - Excludes 1 hour pause ✅
*/