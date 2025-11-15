import React, { useState, useMemo } from 'react';
import type { Project, Client } from '../types';
import { ProjectStatus } from '../types';
import { ProjectTimeline } from './ProjectTimeline';
import { getDeadlineStatus } from '../utils/dateHelpers';
import { StatusBadge } from '../src/components/ui/StatusBadge';
import { ClockIcon, BriefcaseIcon } from './icons';
import { EmptyState } from '../src/components/ui/EmptyState';
import { AdvancedFilterPanel, FilterConfig, FilterGroup, SavedFilter } from './filters/AdvancedFilterPanel';
import { applyFilterLogic } from './filters/filterLogic';
import { ExportButton, ExportDialog, ExportField } from './export/ExportButton';


interface ProjectListProps {
  projects: Project[];
  clients: Client[];
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
}

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
                    <StatusBadge 
                      label={project.status} 
                      variant={
                        project.status === ProjectStatus.Planning ? 'neutral' :
                        project.status === ProjectStatus.InProgress ? 'success' :
                        project.status === ProjectStatus.Completed ? 'info' :
                        project.status === ProjectStatus.OnHold ? 'warning' : 'neutral'
                      }
                    />
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

export const ProjectList: React.FC<ProjectListProps> = ({ projects, clients, onSelectProject, onAddProject }) => {
  const [view, setView] = useState<'card' | 'timeline'>('card');
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterGroup | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Define filterable fields
  const filterConfigs: FilterConfig[] = [
    {
      field: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: ProjectStatus.Planning, label: 'Planning' },
        { value: ProjectStatus.InProgress, label: 'In Progress' },
        { value: ProjectStatus.Completed, label: 'Completed' },
        { value: ProjectStatus.OnHold, label: 'On Hold' },
      ],
    },
    {
      field: 'name',
      label: 'Project Name',
      type: 'text',
    },
    {
      field: 'endDate',
      label: 'End Date',
      type: 'date',
    },
  ];

  // Define exportable fields
  const exportFields: ExportField[] = [
    { key: 'name', label: 'Project Name' },
    { key: 'status', label: 'Status' },
    { 
      key: 'clientId', 
      label: 'Client',
      format: (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client?.name || '';
      }
    },
    { 
      key: 'startDate', 
      label: 'Start Date',
      format: (date) => date ? new Date(date).toLocaleDateString() : ''
    },
    { 
      key: 'endDate', 
      label: 'End Date',
      format: (date) => date ? new Date(date).toLocaleDateString() : ''
    },
    { 
      key: 'budget', 
      label: 'Budget',
      format: (budget) => budget ? `$${budget.toLocaleString()}` : ''
    },
  ];

  // Apply filters
  const filteredProjects = useMemo(() => 
    applyFilterLogic(projects, activeFilter),
    [projects, activeFilter]
  );

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  const viewButtonClasses = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none ${
        isActive
            ? 'bg-gradient-to-b from-white/80 to-white/50 dark:from-white/30 dark:to-white/10 text-slate-800 dark:text-white shadow-md'
            : 'text-slate-600 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-white/20'
    }`;

  return (
    <div className="text-shadow-strong">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
          {filteredProjects.length !== projects.length && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Showing {filteredProjects.length} of {projects.length} projects.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
            <ExportButton
              data={filteredProjects}
              fields={exportFields}
              filename="projects"
              label="Quick Export"
            />
            
            <button
              onClick={() => setShowExportDialog(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Custom Export
            </button>
            <AdvancedFilterPanel
                filters={filterConfigs}
                onApplyFilters={setActiveFilter}
                savedFilters={savedFilters}
                onSaveFilter={(name, group) => {
                const newFilter: SavedFilter = {
                    id: `filter-${Date.now()}`,
                    name,
                    group,
                    createdAt: new Date(),
                };
                setSavedFilters([...savedFilters, newFilter]);
                }}
            />
            <div className="flex items-center gap-1 p-1 bg-black/10 dark:bg-black/20 rounded-lg border border-white/20 dark:border-white/10 self-start sm:self-center">
                <button onClick={() => setView('card')} className={viewButtonClasses(view === 'card')}>
                    Card View
                </button>
                <button onClick={() => setView('timeline')} className={viewButtonClasses(view === 'timeline')}>
                    Timeline View
                </button>
            </div>
        </div>
      </div>
      {view === 'card' ? (
        projects.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={<BriefcaseIcon />}
              title="No projects yet"
              description="Get started by creating your first project to organize your work and collaborate with your team."
              action={{
                label: 'Create Project',
                onClick: onAddProject
              }}
            />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div key={project.id} className="fade-in h-full" style={{ animationDelay: `${index * 50}ms` }}>
                <ProjectCard
                  project={project}
                  clientName={getClientName(project.clientId)}
                  onSelectProject={onSelectProject}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-16 bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-lg border border-dashed border-white/20 dark:border-white/10">
            <p className="text-slate-700 dark:text-slate-300 font-semibold">No projects match the selected filters.</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Try adjusting the filters.</p>
          </div>
        )
      ) : (
        <ProjectTimeline projects={filteredProjects} clients={clients} onSelectProject={onSelectProject} />
      )}
      
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        data={filteredProjects}
        availableFields={exportFields}
        title="Projects"
      />
    </div>
  );
};
