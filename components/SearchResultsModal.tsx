import React from 'react';
import { Modal } from './Modal';
import type { Project, Client } from '../types';
import type { EnrichedTask } from '../types';
import { FolderIcon, UsersIcon, ClipboardListIcon } from './icons';

interface SearchResults {
    projects: Project[];
    clients: Client[];
    tasks: EnrichedTask[];
}

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: SearchResults;
  query: string;
  onNavigate: (type: 'project' | 'client' | 'task', id: string, projectId?: string) => void;
}

const ResultItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    type: string;
    onClick: () => void;
}> = ({ icon, title, subtitle, type, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className="w-full text-left flex items-center p-3 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-700"
        >
            <div className="mr-4 text-slate-400 flex-shrink-0">{icon}</div>
            <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-slate-800 truncate dark:text-slate-200">{title}</p>
                <p className="text-sm text-slate-500 truncate dark:text-slate-400">{subtitle}</p>
            </div>
            <span className="ml-4 text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full dark:bg-slate-600 dark:text-slate-200">{type}</span>
        </button>
    </li>
);

export const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ isOpen, onClose, results, query, onNavigate }) => {
    const hasResults = results.projects.length > 0 || results.clients.length > 0 || results.tasks.length > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Search Results for "${query}"`}>
            {hasResults ? (
                <div className="max-h-[60vh] overflow-y-auto -mr-2 pr-2">
                    <ul className="space-y-1">
                        {results.projects.length > 0 && (
                            <>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1 dark:text-slate-400">Projects</h4>
                                {results.projects.map(project => (
                                    <ResultItem
                                        key={`proj-${project.id}`}
                                        icon={<FolderIcon />}
                                        title={project.name}
                                        subtitle={project.description}
                                        type="Project"
                                        onClick={() => onNavigate('project', project.id)}
                                    />
                                ))}
                            </>
                        )}
                        {results.clients.length > 0 && (
                             <>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1 dark:text-slate-400">Clients</h4>
                                {results.clients.map(client => (
                                    <ResultItem
                                        key={`client-${client.id}`}
                                        icon={<UsersIcon />}
                                        title={client.name}
                                        subtitle={`Contact: ${client.contactPerson}`}
                                        type="Client"
                                        onClick={() => onNavigate('client', client.id)}
                                    />
                                ))}
                            </>
                        )}
                        {results.tasks.length > 0 && (
                            <>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1 dark:text-slate-400">Tasks</h4>
                                {results.tasks.map(task => (
                                    <ResultItem
                                        key={`task-${task.id}`}
                                        icon={<ClipboardListIcon />}
                                        title={task.description}
                                        subtitle={`In project: ${task.projectName}`}
                                        type="Task"
                                        onClick={() => onNavigate('task', task.id, task.projectId)}
                                    />
                                ))}
                            </>
                        )}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No results found for your search.</p>
                </div>
            )}
        </Modal>
    );
};
