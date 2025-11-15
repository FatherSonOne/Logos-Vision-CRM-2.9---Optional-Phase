import React, { useMemo } from 'react';
import type { Project, Client } from '../types';
import { ProjectStatus } from '../types';

// --- Date Helpers ---
const addDays = (date: Date, days: number): Date => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, months: number): Date => { const d = new Date(date); d.setMonth(d.getMonth() + months); return d; };
const differenceInDays = (dateLeft: Date, dateRight: Date): number => Math.round((dateLeft.getTime() - dateRight.getTime()) / (1000 * 60 * 60 * 24));

const statusColors: { [key in ProjectStatus]: { bg: string; border: string } } = {
    [ProjectStatus.Planning]: { bg: 'bg-green-400', border: 'border-green-500' },
    [ProjectStatus.InProgress]: { bg: 'bg-blue-500', border: 'border-blue-600' },
    [ProjectStatus.Completed]: { bg: 'bg-teal-500', border: 'border-teal-600' },
    [ProjectStatus.OnHold]: { bg: 'bg-rose-500', border: 'border-rose-600' },
};

interface ProjectTimelineProps {
  projects: Project[];
  clients: Client[];
  onSelectProject: (id: string) => void;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects, clients, onSelectProject }) => {
    if (projects.length === 0) {
        return <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500 dark:bg-slate-800 dark:border-slate-700">No projects to display in timeline view.</div>;
    }

    const { timelineStart, timelineEnd, totalDays } = useMemo(() => {
        if (projects.length === 0) {
            const today = new Date();
            return {
                timelineStart: startOfMonth(today),
                timelineEnd: addMonths(startOfMonth(today), 1),
                totalDays: 30,
            };
        }
        const startDates = projects.map(p => new Date(p.startDate));
        const endDates = projects.map(p => new Date(p.endDate));

        const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));

        const timelineStart = startOfMonth(minDate);
        const timelineEnd = addDays(new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0), 1);
        const totalDays = differenceInDays(timelineEnd, timelineStart);

        return { timelineStart, timelineEnd, totalDays: totalDays > 0 ? totalDays : 1 };
    }, [projects]);
    
    // Create month headers
    const months = useMemo(() => {
        const monthHeaders = [];
        let currentMonth = startOfMonth(timelineStart);
        while (currentMonth < timelineEnd) {
            const start = currentMonth > timelineStart ? currentMonth : timelineStart;
            let endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            const end = endOfMonth < timelineEnd ? endOfMonth : timelineEnd;

            const daysInView = differenceInDays(end, start) + 1;
            if (daysInView > 0) {
                monthHeaders.push({
                    name: currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
                    width: (daysInView / totalDays) * 100,
                });
            }
            currentMonth = addMonths(currentMonth, 1);
        }
        return monthHeaders;
    }, [timelineStart, timelineEnd, totalDays]);
    
    const today = new Date();
    const todayPosition = today >= timelineStart && today <= timelineEnd ? (differenceInDays(today, timelineStart) / totalDays) * 100 : null;

    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown Client';
    
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Header */}
                    <div className="relative flex border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                        {months.map((month, index) => (
                            <div key={index} style={{ width: `${month.width}%` }} className="text-sm text-center font-semibold text-slate-500 dark:text-slate-400">
                                {month.name}
                            </div>
                        ))}
                    </div>

                    {/* Body */}
                    <div className="relative mt-4 space-y-2">
                        {todayPosition !== null && (
                            <div className="absolute top-0 bottom-0 z-10" style={{ left: `${todayPosition}%` }}>
                                <div className="w-0.5 h-full bg-violet-500"></div>
                                <div className="absolute -top-6 -translate-x-1/2 text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded-full">Today</div>
                            </div>
                        )}
                        {projects.map(project => {
                            const projectStart = new Date(project.startDate);
                            const projectEnd = new Date(project.endDate);

                            if (projectEnd < timelineStart || projectStart > timelineEnd) return null;

                            const offsetDays = Math.max(0, differenceInDays(projectStart, timelineStart));
                            const durationDays = Math.max(1, differenceInDays(projectEnd, projectStart) + 1);

                            const left = (offsetDays / totalDays) * 100;
                            const width = (durationDays / totalDays) * 100;
                            
                            const projectColors = statusColors[project.status] || statusColors[ProjectStatus.InProgress];

                            return (
                                <div key={project.id} className="h-10 text-sm group relative">
                                    <div
                                        className={`absolute top-0 h-full rounded-md px-2 flex items-center ${projectColors.bg} border ${projectColors.border} overflow-hidden cursor-pointer`}
                                        style={{ left: `${left}%`, width: `${width}%` }}
                                        onClick={() => onSelectProject(project.id)}
                                    >
                                       <span className="relative z-10 text-xs text-white font-semibold truncate">{project.name}</span>
                                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-600 dark:bg-slate-900 dark:border-slate-700">
                                            <p className="font-bold">{project.name}</p>
                                            <p>Client: {getClientName(project.clientId)}</p>
                                            <p>Status: {project.status}</p>
                                            <p>{projectStart.toLocaleDateString()} - {projectEnd.toLocaleDateString()}</p>
                                       </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
