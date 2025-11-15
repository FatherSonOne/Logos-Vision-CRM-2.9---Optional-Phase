
import React from 'react';
import type { Project, TeamMember } from '../types';
import { TaskStatus } from '../types';

interface TaskTimelineProps {
    project: Project;
    allTeamMembers: TeamMember[];
}

// Date helpers
const addMonths = (date: Date, months: number) => { const d = new Date(date); d.setMonth(d.getMonth() + months); return d; };
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const differenceInDays = (dateLeft: Date, dateRight: Date) => Math.round((dateLeft.getTime() - dateRight.getTime()) / (1000 * 60 * 60 * 24));

const statusColors: { [key in TaskStatus]: { bg: string; border: string } } = {
    [TaskStatus.ToDo]: { bg: 'bg-slate-400', border: 'border-slate-500' },
    [TaskStatus.InProgress]: { bg: 'bg-blue-500', border: 'border-blue-600' },
    [TaskStatus.Done]: { bg: 'bg-teal-500', border: 'border-teal-600' },
};

const ASSUMED_TASK_DURATION_DAYS = 5;

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ project, allTeamMembers }) => {
    if (project.tasks.length === 0) {
        return <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500">No tasks to display in timeline view.</div>;
    }

    const timelineStart = new Date(project.startDate);
    const timelineEnd = new Date(project.endDate);
    const totalDays = differenceInDays(timelineEnd, timelineStart) + 1;

    if (totalDays <= 0) {
        return <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500">Invalid project dates for timeline.</div>;
    }
    
    // Create month headers
    const months = [];
    let currentMonth = startOfMonth(timelineStart);
    while (currentMonth <= timelineEnd) {
        const start = currentMonth > timelineStart ? currentMonth : timelineStart;
        
        let endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const end = endOfMonth < timelineEnd ? endOfMonth : timelineEnd;

        const daysInView = differenceInDays(end, start) + 1;
        if (daysInView > 0) {
            months.push({
                name: currentMonth.toLocaleString('default', { month: 'short', year: '2-digit' }),
                width: (daysInView / totalDays) * 100,
            });
        }
        currentMonth = addMonths(currentMonth, 1);
    }
    
    const today = new Date();
    const todayPosition = today >= timelineStart && today <= timelineEnd ? (differenceInDays(today, timelineStart) / totalDays) * 100 : null;
    
    const getAssigneeName = (teamMemberId: string) => allTeamMembers.find(m => m.id === teamMemberId)?.name || 'N/A';
    
    const Legend = () => (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs">
            {Object.entries(statusColors).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${colors.bg}`}></div>
                    <span className="text-slate-600">{status}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
            <Legend />
            <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                    {/* Header */}
                    <div className="relative flex border-b-2 border-slate-200 pb-2">
                        {months.map((month, index) => (
                            <div key={index} style={{ width: `${month.width}%` }} className="text-xs text-center font-semibold text-slate-500">
                                {month.name}
                            </div>
                        ))}
                    </div>

                    {/* Body */}
                    <div className="relative mt-3 space-y-2">
                        {todayPosition !== null && (
                            <div className="absolute top-0 bottom-0 z-10" style={{ left: `${todayPosition}%` }}>
                                <div className="w-0.5 h-full bg-violet-500"></div>
                                <div className="absolute -top-5 -translate-x-1/2 text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded-full">Today</div>
                            </div>
                        )}
                        {project.tasks.map(task => {
                            const taskEndDate = new Date(task.dueDate);
                            const potentialStartDate = new Date(taskEndDate);
                            potentialStartDate.setDate(potentialStartDate.getDate() - (ASSUMED_TASK_DURATION_DAYS - 1));
                            const taskStartDate = potentialStartDate > timelineStart ? potentialStartDate : timelineStart;

                            if (taskEndDate < timelineStart || taskStartDate > timelineEnd) return null;

                            const offsetDays = Math.max(0, differenceInDays(taskStartDate, timelineStart));
                            const durationDays = Math.max(1, differenceInDays(taskEndDate, taskStartDate) + 1);

                            const left = (offsetDays / totalDays) * 100;
                            const width = (durationDays / totalDays) * 100;
                            
                            const taskColors = statusColors[task.status] || statusColors[TaskStatus.ToDo];
                            const assigneeName = getAssigneeName(task.teamMemberId);
                            
                            let progressPercentage = 0;
                            if (task.status === TaskStatus.InProgress) {
                                const totalTaskDuration = Math.max(1, differenceInDays(taskEndDate, taskStartDate) + 1);
                                const daysElapsed = Math.max(0, differenceInDays(today, taskStartDate) + 1);
                                progressPercentage = Math.min(100, (daysElapsed / totalTaskDuration) * 100);
                            }

                            return (
                                <div key={task.id} className="flex items-center text-sm group h-8">
                                    <div className="w-1/3 pr-4 truncate text-slate-700" title={task.description}>{task.description}</div>
                                    <div className="w-2/3 h-full relative">
                                        <div
                                            className={`absolute top-1 h-6 rounded-md px-2 flex items-center group-scope ${taskColors.bg} border ${taskColors.border} overflow-hidden`}
                                            style={{ left: `${left}%`, width: `${width}%` }}
                                        >
                                            {task.status === TaskStatus.InProgress && (
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-blue-700"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            )}
                                           <span className="relative z-10 text-xs text-white font-semibold truncate hidden sm:inline">{assigneeName}</span>
                                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-scope-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-600">
                                                <p className="font-bold">{task.description}</p>
                                                <p>Assignee: {assigneeName}</p>
                                                <p>Due: {taskEndDate.toLocaleDateString()}</p>
                                                <p>Status: {task.status}</p>
                                           </div>
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
