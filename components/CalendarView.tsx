
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { TeamMember, Project, Activity } from '../types';

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    teamMemberId: string;
    color: { bg: string, text: string, border: string };
    type: 'project' | 'task' | 'activity';
}

interface CalendarViewProps {
    teamMembers: TeamMember[];
    projects: Project[];
    activities: Activity[];
}

const mockGoogleCalendarService = {
  getEvents: async (
    projects: Project[], 
    activities: Activity[], 
    teamMembers: TeamMember[]
  ): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    const events: CalendarEvent[] = [];
    const colors = [
      { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-800 dark:text-violet-200', border: 'border-violet-300 dark:border-violet-700' },
      { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-300 dark:border-blue-700' },
      { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-200', border: 'border-teal-300 dark:border-teal-700' },
      { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-700' },
    ];

    const getColor = (id: string) => colors[teamMembers.findIndex(tm => tm.id === id) % colors.length];

    projects.forEach(project => {
        project.teamMemberIds.forEach(memberId => {
             events.push({
                id: `proj-${project.id}-${memberId}`,
                title: project.name,
                start: new Date(project.startDate),
                end: new Date(project.endDate),
                allDay: true,
                teamMemberId: memberId,
                color: getColor(memberId),
                type: 'project',
            });
        });
        project.tasks.forEach(task => {
            events.push({
                id: task.id,
                title: task.description,
                start: new Date(task.dueDate),
                end: new Date(task.dueDate),
                allDay: true,
                teamMemberId: task.teamMemberId,
                color: getColor(task.teamMemberId),
                type: 'task',
            });
        });
    });

    activities.forEach(activity => {
        events.push({
            id: activity.id,
            title: activity.title,
            start: new Date(activity.activityDate),
            end: new Date(activity.activityDate),
            allDay: !activity.activityTime,
            teamMemberId: activity.createdById,
            color: getColor(activity.createdById),
            type: 'activity',
        });
    });

    return events;
  }
};


export const CalendarView: React.FC<CalendarViewProps> = ({ teamMembers, projects, activities }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(() => teamMembers.map(tm => tm.id));
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'connected'>('idle');
    const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const fetchEvents = useCallback(async () => {
        setStatus('loading');
        const fetchedEvents = await mockGoogleCalendarService.getEvents(projects, activities, teamMembers);
        setEvents(fetchedEvents);
        setStatus('connected');
    }, [projects, activities, teamMembers]);

    const handleTeamMemberToggle = (id: string) => {
        setSelectedTeamMembers(prev => 
            prev.includes(id) ? prev.filter(tmId => tmId !== id) : [...prev, id]
        );
    };

    const changeMonth = (offset: number) => {
        setViewDate(current => {
            const newDate = new Date(current);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const calendarGrid = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Pad start
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ key: `pad-start-${i}`, date: null });
        }
        // Month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ key: `day-${i}`, date: new Date(year, month, i) });
        }
        // Pad end
        while (days.length % 7 !== 0) {
            days.push({ key: `pad-end-${days.length}`, date: null });
        }
        return days;
    }, [viewDate]);

    const filteredEvents = useMemo(() => {
        return events.filter(e => selectedTeamMembers.includes(e.teamMemberId));
    }, [events, selectedTeamMembers]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        filteredEvents.forEach(event => {
            let current = new Date(event.start);
            while (current <= event.end) {
                const dateKey = current.toISOString().split('T')[0];
                const dayEvents = map.get(dateKey) || [];
                map.set(dateKey, [...dayEvents, event]);
                current.setDate(current.getDate() + 1);
            }
        });
        return map;
    }, [filteredEvents]);

    const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setActiveEvent(event);
        setPopoverPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    if (status !== 'connected') {
        return (
            <div className="text-center p-8 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-slate-900 mb-4 dark:text-slate-100">Team Calendar</h2>
                <p className="text-slate-500 mb-6 dark:text-slate-400">Connect to your calendar to view team schedules.</p>
                <button 
                    onClick={fetchEvents}
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 mx-auto bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                >
                    {status === 'loading' ? 'Connecting...' : 'Connect to Google Calendar'}
                </button>
            </div>
        )
    }

    return (
        <div className="flex -m-6 sm:-m-8 h-full bg-white dark:bg-slate-900">
            {activeEvent && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveEvent(null)}
                >
                    <div 
                        className="absolute bg-white dark:bg-slate-800 p-4 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-50 w-64"
                        style={{ top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px` }}
                        onClick={e => e.stopPropagation()}
                    >
                       <p className={`text-sm font-bold ${activeEvent.color.text}`}>{activeEvent.title}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeEvent.start.toLocaleDateString()} - {activeEvent.end.toLocaleDateString()}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">Assignee: {teamMembers.find(tm => tm.id === activeEvent.teamMemberId)?.name}</p>
                    </div>
                </div>
            )}
            <aside className="w-1/5 border-r border-slate-200 p-4 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 dark:text-slate-100">Team Members</h3>
                <ul className="space-y-2">
                    {teamMembers.map(tm => (
                        <li key={tm.id}>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={selectedTeamMembers.includes(tm.id)} onChange={() => handleTeamMemberToggle(tm.id)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:bg-slate-700 dark:border-slate-600" />
                                <span className="text-sm dark:text-slate-300">{tm.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1 flex flex-col p-4">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold dark:text-slate-100">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setViewDate(new Date())} className="px-3 py-1.5 text-sm font-semibold rounded-md border border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">Today</button>
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">&lt;</button>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">&gt;</button>
                    </div>
                </header>
                <div className="grid grid-cols-7 text-center font-semibold text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 grid-rows-6 flex-1 border-l border-slate-200 dark:border-slate-700">
                    {calendarGrid.map(({ key, date }) => {
                        const dayEvents = date ? eventsByDate.get(date.toISOString().split('T')[0]) || [] : [];
                        return (
                            <div key={key} className="border-r border-b border-slate-200 dark:border-slate-700 p-1 overflow-hidden relative">
                                {date && <span className={`text-sm dark:text-slate-300 ${isToday(date) ? 'bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold' : ''}`}>{date.getDate()}</span>}
                                <div className="space-y-1 mt-1">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <div 
                                            key={event.id}
                                            onClick={(e) => handleEventClick(event, e)}
                                            className={`p-1 rounded text-xs cursor-pointer ${event.color.bg} ${event.color.text} ${event.color.border} border truncate`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400 text-center cursor-pointer hover:underline">
                                            + {dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    );
};
