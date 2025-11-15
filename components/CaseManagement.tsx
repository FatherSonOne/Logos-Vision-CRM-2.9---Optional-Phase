import React, { useState, useMemo } from 'react';
import type { Case, Client, TeamMember } from '../types';
import { CaseStatus, CasePriority } from '../types';
import { ExportButton, type ExportField } from './export/ExportButton';

interface CaseManagementProps {
    cases: Case[];
    clients: Client[];
    teamMembers: TeamMember[];
    onAddCase: () => void;
    onEditCase: (caseItem: Case) => void;
    onDeleteCase: (caseId: string) => void;
    onSelectCase: (caseId: string) => void;
    onUpdateCaseStatus: (caseId: string, newStatus: CaseStatus) => void;
}

const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const colorClasses = {
    [CaseStatus.New]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [CaseStatus.InProgress]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    [CaseStatus.Resolved]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    [CaseStatus.Closed]: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>
      {status}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: CasePriority; small?: boolean }> = ({ priority, small = false }) => {
  const colorClasses = {
    [CasePriority.Low]: 'border-slate-300 text-slate-600 dark:border-slate-500 dark:text-slate-400',
    [CasePriority.Medium]: 'border-amber-400 text-amber-700 dark:border-amber-500 dark:text-amber-400',
    [CasePriority.High]: 'border-rose-400 text-rose-700 dark:border-rose-500 dark:text-rose-400',
  };
   const icon = {
    [CasePriority.Low]: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
    [CasePriority.Medium]: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>,
    [CasePriority.High]: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  };
  return (
    <span className={`flex items-center gap-1 text-xs font-medium rounded-full border ${colorClasses[priority]} ${small ? 'px-1.5 py-0' : 'px-2 py-0.5'}`}>
      {icon[priority]}
      {!small && priority}
    </span>
  );
};


const CaseTile: React.FC<{ 
    caseItem: Case; 
    clientName: string; 
    assigneeName: string;
    onEdit: () => void;
    onDelete: () => void;
    onSelect: () => void;
}> = ({ caseItem, clientName, assigneeName, onEdit, onDelete, onSelect }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors duration-200 group relative">
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Edit Case" className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md dark:text-slate-400 dark:hover:bg-slate-700">
                    <PencilIcon />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete Case" className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md dark:text-slate-400 dark:hover:bg-slate-700">
                    <TrashIcon />
                </button>
            </div>
            <button onClick={onSelect} className="w-full h-full text-left p-5 flex flex-col">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-md font-bold text-slate-900 dark:text-slate-100 pr-4">{caseItem.title}</h3>
                        <PriorityBadge priority={caseItem.priority} />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 h-[60px]">{caseItem.description}</p>
                </div>
                <div className="mt-auto border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Client:</span>
                        <span>{clientName}</span>
                    </div>
                     <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Assignee:</span>
                        <span>{assigneeName}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Status:</span>
                        <StatusBadge status={caseItem.status} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 pt-1">
                        <span>Created:</span>
                        <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </button>
        </div>
    );
}

const CaseCard: React.FC<{
    caseItem: Case;
    assigneeName: string;
    onSelect: () => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({ caseItem, assigneeName, onSelect, onDragStart }) => (
    <div
        draggable
        onDragStart={onDragStart}
        onClick={onSelect}
        className="bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600"
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 pr-2">{caseItem.title}</p>
            <PriorityBadge priority={caseItem.priority} small />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{assigneeName}</p>
    </div>
);


export const CaseManagement: React.FC<CaseManagementProps> = ({ cases, clients, teamMembers, onAddCase, onEditCase, onDeleteCase, onSelectCase, onUpdateCaseStatus }) => {
    const [view, setView] = useState<'tile' | 'board'>('tile');
    const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
    const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');
    const [draggedOverColumn, setDraggedOverColumn] = useState<CaseStatus | null>(null);

    const filteredCases = useMemo(() => {
        return cases.filter(caseItem => {
            const statusMatch = statusFilter === 'all' || caseItem.status === statusFilter;
            const assigneeMatch = assigneeFilter === 'all' || caseItem.assignedToId === assigneeFilter;
            return statusMatch && assigneeMatch;
        });
    }, [cases, statusFilter, assigneeFilter]);

    const casesByStatus = useMemo(() => {
        return cases.reduce((acc, caseItem) => {
            if (!acc[caseItem.status]) {
                acc[caseItem.status] = [];
            }
            acc[caseItem.status].push(caseItem);
            return acc;
        }, {} as Record<CaseStatus, Case[]>);
    }, [cases]);

    const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown';
    const getAssigneeName = (id: string) => teamMembers.find(tm => tm.id === id)?.name || 'Unassigned';

    const handleDragStart = (e: React.DragEvent, caseId: string) => {
        e.dataTransfer.setData('caseId', caseId);
    };

    const handleDragOver = (e: React.DragEvent, status: CaseStatus) => {
        e.preventDefault();
        setDraggedOverColumn(status);
    };

    const handleDrop = (e: React.DragEvent, newStatus: CaseStatus) => {
        const caseId = e.dataTransfer.getData('caseId');
        onUpdateCaseStatus(caseId, newStatus);
        setDraggedOverColumn(null);
    };

    const handleDragLeave = () => {
        setDraggedOverColumn(null);
    };

    const viewButtonClasses = (isActive: boolean) =>
    `px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none ${
        isActive
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
    }`;

    const exportFields: ExportField[] = [
      { key: 'title', label: 'Case Title' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      {
        key: 'clientId',
        label: 'Client',
        format: (id) => getClientName(id)
      },
      {
        key: 'assignedToId',
        label: 'Assignee',
        format: (id) => getAssigneeName(id)
      },
      {
        key: 'createdAt',
        label: 'Created',
        format: (date) => new Date(date).toLocaleDateString()
      },
      {
        key: 'lastUpdatedAt',
        label: 'Last Updated',
        format: (date) => new Date(date).toLocaleDateString()
      },
    ];
    
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Case Management</h2>
                 <div className="flex items-center gap-4 flex-wrap">
                    {view === 'tile' && (
                        <>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'all')}
                                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Statuses</option>
                                {Object.values(CaseStatus).map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <select
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Assignees</option>
                                {teamMembers.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                            </select>
                        </>
                    )}
                     <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <button onClick={() => setView('tile')} className={viewButtonClasses(view === 'tile')}>Tile</button>
                        <button onClick={() => setView('board')} className={viewButtonClasses(view === 'board')}>Board</button>
                    </div>
                    <ExportButton
                      data={filteredCases}
                      fields={exportFields}
                      filename="cases"
                      label="Export Cases"
                    />
                    <button 
                        onClick={onAddCase}
                        className="flex items-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-violet-700 transition-colors"
                    >
                        <PlusIcon />
                        New Case
                    </button>
                 </div>
            </div>
            {view === 'tile' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCases.map(caseItem => (
                        <CaseTile 
                            key={caseItem.id} 
                            caseItem={caseItem}
                            clientName={getClientName(caseItem.clientId)}
                            assigneeName={getAssigneeName(caseItem.assignedToId)}
                            onEdit={() => onEditCase(caseItem)}
                            onDelete={() => onDeleteCase(caseItem.id)}
                            onSelect={() => onSelectCase(caseItem.id)}
                        />
                    ))}
                    {filteredCases.length === 0 && (
                        <div className="col-span-full text-center p-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                            No cases match the current filters.
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 sm:-mx-8 px-6 sm:px-8">
                    {Object.values(CaseStatus).map(status => (
                        <div 
                            key={status} 
                            className={`w-72 bg-slate-100 dark:bg-slate-900/70 rounded-lg p-3 flex-shrink-0 transition-colors ${draggedOverColumn === status ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`}
                            onDragOver={(e) => handleDragOver(e, status)}
                            onDrop={(e) => handleDrop(e, status)}
                            onDragLeave={handleDragLeave}
                        >
                            <h3 className="font-semibold mb-3 px-1 text-slate-700 dark:text-slate-300">{status} <span className="text-sm font-normal text-slate-400">({casesByStatus[status]?.length || 0})</span></h3>
                            <div className="space-y-3 min-h-[100px]">
                                {(casesByStatus[status] || []).map(caseItem => (
                                    <CaseCard
                                        key={caseItem.id}
                                        caseItem={caseItem}
                                        assigneeName={getAssigneeName(caseItem.assignedToId)}
                                        onSelect={() => onSelectCase(caseItem.id)}
                                        onDragStart={(e) => handleDragStart(e, caseItem.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const iconProps = { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 };
function PlusIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>; }
function PencilIcon() { return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>; }
function TrashIcon() { return <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }