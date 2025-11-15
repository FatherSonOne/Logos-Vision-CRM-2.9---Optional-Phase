import React, { useState, useMemo } from 'react';
import type { Project, Client } from '../types';
import { ProjectStatus } from '../types';
import { ProjectTimeline } from './ProjectTimeline';
import { getDeadlineStatus } from '../utils/dateHelpers';
import { ClockIcon } from './icons';

interface ProjectListProps {
  projects: Project[];
  clients: Client[];
  onSelectProject: (id: string) => void;
}

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const colorClasses = {
    [ProjectStatus.Planning]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [ProjectStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [ProjectStatus.Completed]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
    [ProjectStatus.OnHold]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>
      {status}
    </span>
  );
};

const ProjectCard: React.FC<{ project: Project; clientName: string; onSelectProject: (id: string) => void }> = ({ project, clientName, onSelectProject }) => {
    const completionPercentage = project.tasks.length > 0
        ? (project.tasks.filter(t => t.status === 'Done').length / project.tasks.length) * 100
        : 0;
    
    const deadline = getDeadlineStatus(project.endDate, project.status === ProjectStatus.Completed);

    return (
        <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-lg flex flex-col justify-between hover:border-white/40 transition-colors duration-300 text-shadow-strong h-full">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{project.name}</h3>
                    <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-cyan-800 font-medium mb-3 dark:text-cyan-300">{clientName}</p>
                <p className="text-sm text-slate-700 line-clamp-2 mb-4 dark:text-slate-200">{project.description}</p>
                
                <div className="flex justify-between items-center text-sm mb-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Deadline</span>
                    <span className={`flex items-center gap-1 font-semibold ${deadline.color}`}>
                        <ClockIcon />
                        {deadline.text}
                    </span>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-600 mb-1 dark:text-slate-300">
                        <span>Progress</span>
                        <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2 dark:bg-black/20">
                        <div className="bg-gradient-to-r from-cyan-500 to-sky-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
            </div>
            
            <button
                onClick={() => onSelectProject(project.id)}
                className="mt-4 w-full text-center bg-gradient-to-b from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold border border-cyan-700/50 hover:from-cyan-600 hover:to-sky-700 transition-all shadow-md btn-hover-scale"
            >
                View Details
            </button>
        </div>
    );
};

export const ProjectList: React.FC<ProjectListProps> = ({ projects, clients, onSelectProject }) => {
  const [view, setView] = useState<'card' | 'timeline'>('card');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
        const statusMatch = statusFilter === 'all' || project.status === statusFilter;
        const clientMatch = clientFilter === 'all' || project.clientId === clientFilter;
        return statusMatch && clientMatch;
    });
  }, [projects, statusFilter, clientFilter]);

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  const viewButtonClasses = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none ${
        isActive
            ? 'bg-gradient-to-b from-white/80 to-white/50 dark:from-white/30 dark:to-white/10 text-slate-800 dark:text-white shadow-md'
            : 'text-slate-600 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-white/20'
    }`;

  const selectStyles = "bg-white/50 dark:bg-black/30 backdrop-blur-sm border-white/30 dark:border-white/10 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm";

  return (
    <div className="text-shadow-strong">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Projects</h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                className={selectStyles}
                aria-label="Filter by status"
            >
                <option value="all">All Statuses</option>
                {Object.values(ProjectStatus).map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className={selectStyles}
                aria-label="Filter by client"
            >
                <option value="all">All Clients</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 bg-black/10 dark:bg-black/20 rounded-lg border border-white/20 dark:border-white/10 self-start sm:self-center">
            <button onClick={() => setView('card')} className={viewButtonClasses(view === 'card')}>
                Card View
            </button>
            <button onClick={() => setView('timeline')} className={viewButtonClasses(view === 'timeline')}>
                Timeline View
            </button>
        </div>
      </div>
      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                <div key={project.id} className="fade-in h-full" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProjectCard
                        project={project}
                        clientName={getClientName(project.clientId)}
                        onSelectProject={onSelectProject}
                    />
                </div>
                ))
            ) : (
                <div className="col-span-full text-center py-16 bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-lg border border-dashed border-white/20 dark:border-white/10">
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">No projects match the selected filters.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Try adjusting the status or client filters.</p>
                </div>
            )}
        </div>
      ) : (
          <ProjectTimeline projects={filteredProjects} clients={clients} onSelectProject={onSelectProject} />
      )}
    </div>
  );
};
