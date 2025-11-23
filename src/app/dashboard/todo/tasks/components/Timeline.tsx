// src/app/dashboard/todo/tasks/components/Timeline.tsx
"use client";

import { useMemo } from "react";
import { TAG_COLORS, type TaskSessionWithTask } from "@/types/database";

interface TimelineProps {
    sessions: TaskSessionWithTask[];
    currentTime: Date;
    isDark: boolean;
}

export default function Timeline({ sessions, currentTime, isDark }: TimelineProps) {
    // Dynamic timeline hours based on sessions and current time
    const timelineHours = useMemo(() => {
        const currentHour = currentTime.getHours();
        let startHour = 8;
        let endHour = 20;

        // Extend based on sessions
        sessions.forEach(session => {
            const sessionStart = new Date(session.start_time);
            const sessionStartHour = sessionStart.getHours();

            if (session.end_time) {
                const sessionEnd = new Date(session.end_time);
                const sessionEndHour = sessionEnd.getHours();
                endHour = Math.max(endHour, sessionEndHour + 1);
            }

            startHour = Math.min(startHour, sessionStartHour);
        });

        // Extend to include current time
        if (currentHour >= endHour) {
            endHour = Math.min(currentHour + 1, 24);
        }
        if (currentHour < startHour) {
            startHour = Math.max(currentHour, 0);
        }

        const hours = [];
        for (let i = startHour; i <= endHour; i++) {
            hours.push(i);
        }
        return hours;
    }, [sessions, currentTime]);

    const startHour = timelineHours[0];
    const endHour = timelineHours[timelineHours.length - 1];
    const totalHours = endHour - startHour;

    // Calculate position and height for sessions
    const getSessionPosition = (session: TaskSessionWithTask) => {
        const start = new Date(session.start_time);
        const startHour = start.getHours();
        const startMinute = start.getMinutes();

        // Calculate start position (in minutes from timeline start)
        const startMinutesFromTimeline = (startHour - timelineHours[0]) * 60 + startMinute;
        const totalTimelineMinutes = totalHours * 60;
        const topPercent = (startMinutesFromTimeline / totalTimelineMinutes) * 100;

        // Calculate height based on actual duration
        const durationMinutes = session.duration / 60; // duration is in seconds
        const heightPercent = (durationMinutes / totalTimelineMinutes) * 100;

        return {
            top: `${Math.max(0, topPercent)}%`,
            height: `${Math.max(heightPercent, 2)}%` // Minimum 2% height
        };
    };

    // Get current time indicator position
    const getCurrentTimePosition = () => {
        const hour = currentTime.getHours();
        const minute = currentTime.getMinutes();

        if (hour < timelineHours[0] || hour > endHour) return null;

        const minutesFromStart = (hour - timelineHours[0]) * 60 + minute;
        const totalMinutes = totalHours * 60;
        const top = (minutesFromStart / totalMinutes) * 100;

        return `${top}%`;
    };

    const currentTimePos = getCurrentTimePosition();

    // Format duration display
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    };

    // Height per hour (80px = comfortable spacing)
    const pixelsPerHour = 80;
    const totalHeight = totalHours * pixelsPerHour;

    return (
        <div className="relative">
            {/* Timeline Container */}
            <div className={`relative h-[600px] overflow-y-auto ${isDark ? 'scrollbar-custom' : 'scrollbar-custom-light'}`}>
                <div className="relative pr-2" style={{ height: `${totalHeight}px` }}>

                    {/* Time Labels (Left Side) */}
                    <div className="absolute left-0 top-0 w-16 z-10" style={{ height: `${totalHeight}px` }}>
                        {timelineHours.map((hour, idx) => (
                            <div
                                key={hour}
                                className="absolute left-0 w-full"
                                style={{
                                    top: `${(idx / totalHours) * 100}%`,
                                    transform: 'translateY(-8px)'
                                }}
                            >
                                <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {hour.toString().padStart(2, '0')}:00
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Grid Area */}
                    <div className="ml-16 relative" style={{ height: `${totalHeight}px` }}>

                        {/* Hour Lines with More Gap */}
                        {timelineHours.map((hour, idx) => (
                            <div
                                key={`line-${hour}`}
                                className={`absolute left-0 right-0 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'
                                    }`}
                                style={{
                                    top: `${(idx / totalHours) * 100}%`
                                }}
                            />
                        ))}

                        {/* Session Blocks - Positioned by actual time */}
                        {sessions.map((session, idx) => {
                            const position = getSessionPosition(session);
                            const tagColor = session.task.tag
                                ? TAG_COLORS[session.task.tag.color]
                                : { darkBg: '#f97316', lightBg: '#fed7aa', darkText: '#fff', lightText: '#000' };

                            return (
                                <div
                                    key={`${session.id}-${idx}`}
                                    className="absolute left-0 right-0 rounded-lg p-3 shadow-md"
                                    style={{
                                        top: position.top,
                                        height: position.height,
                                        backgroundColor: isDark ? tagColor.darkBg : tagColor.lightBg,
                                        minHeight: '45px',
                                        zIndex: 5
                                    }}
                                >
                                    <div className="flex items-start justify-between h-full">
                                        <div
                                            className="text-sm font-semibold truncate flex-1"
                                            style={{ color: isDark ? tagColor.darkText : tagColor.lightText }}
                                        >
                                            {session.task.title}
                                        </div>
                                        <div
                                            className="text-xs font-bold ml-2 flex-shrink-0"
                                            style={{ color: isDark ? tagColor.darkText : tagColor.lightText }}
                                        >
                                            {formatDuration(session.duration)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Current Time Indicator - Red Line */}
                        {currentTimePos && (
                            <div
                                className="absolute left-0 right-0 flex items-center"
                                style={{
                                    top: currentTimePos,
                                    zIndex: 20
                                }}
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 shadow-lg animate-pulse" />
                                <div className="flex-1 h-0.5 bg-red-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {sessions.length === 0 && (
                <div className={`absolute inset-0 flex items-center justify-center text-center pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    <div>
                        <p className="text-sm">No time records yet</p>
                        <p className="text-xs mt-2">Start a task timer to see it here</p>
                    </div>
                </div>
            )}
        </div>
    );
}