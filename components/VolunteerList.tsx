import React, { useState, useMemo } from 'react';
import type { Volunteer, Client, Project } from '../types';
import { VolunteersMap } from './VolunteersMap';
import { MailIcon, LocationMarkerIcon, ClockIcon, PlusIcon, FolderIcon, BuildingIcon } from './icons';
import { ExportButton, type ExportField } from './export/ExportButton';

interface VolunteerListProps {
  volunteers: Volunteer[];
  clients: Client[];
  projects: Project[];
  onAddVolunteer: () => void;
}

const VolunteerCard: React.FC<{ 
    volunteer: Volunteer; 
    getProjectName: (id: string) => string;
    getClientName: (id: string) => string;
}> = ({ volunteer, getProjectName, getClientName }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col hover:border-indigo-400 transition-colors duration-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-indigo-600">
        <h3 className="text-lg font-bold text-slate-900 truncate w-full dark:text-slate-100">{volunteer.name}</h3>
        <p className="text-sm text-slate-500 mb-3 dark:text-slate-400">{volunteer.skills.join(', ')}</p>
        <div className="space-y-2 text-sm text-slate-700 flex-grow mb-4 dark:text-slate-300">
            <div className="flex items-center gap-2">
                <MailIcon />
                <a href={`mailto:${volunteer.email}`} className="text-indigo-600 hover:text-indigo-700 truncate dark:text-indigo-400 dark:hover:text-indigo-300">{volunteer.email}</a>
            </div>
            <div className="flex items-center gap-2">
                <LocationMarkerIcon />
                <span>{volunteer.location}</span>
            </div>
             <div className="flex items-center gap-2">
                <ClockIcon />
                <span>{volunteer.availability}</span>
            </div>
        </div>
        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 dark:text-slate-400">Assignments</h4>
            <div className="space-y-1 text-xs">
                {volunteer.assignedProjectIds.map(id => (
                    <div key={`proj-${id}`} className="flex items-center gap-2 bg-slate-100 p-1.5 rounded dark:bg-slate-700">
                        <FolderIcon />
                        <span className="text-slate-700 dark:text-slate-300">{getProjectName(id)}</span>
                    </div>
                ))}
                {volunteer.assignedClientIds.map(id => (
                     <div key={`client-${id}`} className="flex items-center gap-2 bg-indigo-50 p-1.5 rounded dark:bg-indigo-900/50">
                        <BuildingIcon />
                        <span className="text-indigo-700 dark:text-indigo-300">{getClientName(id)}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AddVolunteerCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white p-6 rounded-lg border-2 border-dashed border-slate-300 text-center flex flex-col items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition-colors duration-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
    >
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 dark:bg-slate-700">
            <PlusIcon />
        </div>
        <h3 className="text-lg font-bold">Add Volunteer</h3>
    </button>
);


export const VolunteerList: React.FC<VolunteerListProps> = ({ volunteers, clients, projects, onAddVolunteer }) => {
    const [clientFilter, setClientFilter] = useState<string>('all');
    const [projectFilter, setProjectFilter] = useState<string>('all');
    
    const filteredVolunteers = useMemo(() => {
        return volunteers.filter(volunteer => {
            const clientMatch = clientFilter === 'all' || volunteer.assignedClientIds.includes(clientFilter);
            const projectMatch = projectFilter === 'all' || volunteer.assignedProjectIds.includes(projectFilter);
            return clientMatch && projectMatch;
        });
    }, [volunteers, clientFilter, projectFilter]);
    
    const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || 'Unknown Project';
    const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

    const exportFields: ExportField[] = [
      { key: 'name', label: 'Volunteer Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'location', label: 'Location' },
      {
        key: 'skills',
        label: 'Skills',
        format: (skills) => skills.join(' | ')
      },
      { key: 'availability', label: 'Availability' },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-white p-4 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700 relative aspect-[4/1] overflow-hidden">
                <VolunteersMap 
                    volunteers={filteredVolunteers}
                    clients={clients}
                    selectedClientId={clientFilter !== 'all' ? clientFilter : null}
                />
            </div>
            
            <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Volunteers</h2>
                    <div className="flex items-center gap-4">
                        <ExportButton
                            data={filteredVolunteers}
                            fields={exportFields}
                            filename="volunteers"
                            label="Export Volunteers"
                        />
                        <select
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                            className="bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                        >
                            <option value="all">All Clients</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                         <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                        >
                            <option value="all">All Projects</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredVolunteers.map((volunteer) => (
                        <VolunteerCard 
                            key={volunteer.id} 
                            volunteer={volunteer}
                            getProjectName={getProjectName}
                            getClientName={getClientName}
                        />
                    ))}
                    <AddVolunteerCard onClick={onAddVolunteer} />
                 </div>
            </div>
        </div>
    );
};