

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Client, Project, TeamMember, Activity, Donation, Document, Event, PortalLayout, PortalComponent, PortalWidgetType } from '../types';
import { ProjectStatus, TaskStatus } from '../types';

// --- WIDGETS & RENDERERS ---

const WidgetWrapper: React.FC<{ title: string; children: React.ReactNode; isDragging?: boolean }> = ({ title, children, isDragging }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm ${isDragging ? 'opacity-50' : ''}`}>
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 p-3 border-b border-slate-200 dark:border-slate-700">{title}</h3>
        <div className="p-3">{children}</div>
    </div>
);

const WelcomeWidget: React.FC<{ settings: any }> = ({ settings }) => (
    <WidgetWrapper title={settings.title || 'Welcome'}>
        <p className="text-sm text-slate-600 dark:text-slate-300">{settings.message || 'Welcome to your portal.'}</p>
    </WidgetWrapper>
);

const ProjectsWidget: React.FC<{ settings: any; projects: Project[] }> = ({ settings, projects }) => (
    <WidgetWrapper title={settings.title || 'Projects'}>
        <ul className="space-y-2">
            {projects.slice(0, settings.itemLimit || 3).map(p => (
                <li key={p.id} className="text-sm flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === ProjectStatus.Completed ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
                </li>
            ))}
        </ul>
    </WidgetWrapper>
);

const TasksWidget: React.FC<{ settings: any; tasks: any[] }> = ({ settings, tasks }) => (
     <WidgetWrapper title={settings.title || 'My Tasks'}>
        <ul className="space-y-2">
            {tasks.slice(0, settings.itemLimit || 5).map(t => (
                <li key={t.id} className="text-sm flex items-center gap-2">
                    <input type="checkbox" readOnly checked={t.status === TaskStatus.Done} className="h-4 w-4 rounded text-violet-600" />
                    <span className={`flex-1 ${t.status === TaskStatus.Done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{t.description}</span>
                </li>
            ))}
        </ul>
    </WidgetWrapper>
);

const PortalComponentRenderer: React.FC<{ component: PortalComponent, allData: any, isDragging?: boolean }> = ({ component, allData, isDragging }) => {
    const clientProjects = allData.projects.filter((p: Project) => p.clientId === allData.client.id);
    const clientTasks = clientProjects.flatMap((p: Project) => p.tasks.filter(t => t.sharedWithClient));

    switch(component.type) {
        case 'welcome': return <WelcomeWidget settings={component.settings} />;
        case 'projects': return <ProjectsWidget settings={component.settings} projects={clientProjects} />;
        case 'tasks': return <TasksWidget settings={component.settings} tasks={clientTasks} />;
        // Add more cases here for other widgets...
        default: return <WidgetWrapper title={component.settings.title || component.type.replace('-', ' ')}>{component.type} widget preview.</WidgetWrapper>
    }
}


// --- SETTINGS PANELS ---

const SettingsWrapper: React.FC<{ component: PortalComponent; onDelete: (id: string) => void; children: React.ReactNode }> = ({ component, onDelete, children }) => (
    <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-md font-bold capitalize">{component.type.replace('-', ' ')}</h3>
            <button onClick={() => onDelete(component.id)} className="text-slate-400 hover:text-red-500 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
        {children}
    </div>
);

const GeneralSettings: React.FC<{ settings: any; onUpdate: (field: string, value: any) => void; }> = ({ settings, onUpdate }) => (
    <>
        <div>
            <label className="text-xs font-medium text-slate-500">Widget Title</label>
            <input type="text" value={settings.title || ''} onChange={e => onUpdate('title', e.target.value)} className="w-full mt-1 p-1 border rounded text-sm" />
        </div>
        <div>
            <label className="text-xs font-medium text-slate-500">Number of Items</label>
            <input type="number" value={settings.itemLimit || 5} onChange={e => onUpdate('itemLimit', parseInt(e.target.value, 10))} className="w-full mt-1 p-1 border rounded text-sm" />
        </div>
    </>
);

const WelcomeSettings: React.FC<{ settings: any; onUpdate: (field: string, value: any) => void; }> = ({ settings, onUpdate }) => (
     <>
        <div>
            <label className="text-xs font-medium text-slate-500">Title</label>
            <input type="text" value={settings.title || ''} onChange={e => onUpdate('title', e.target.value)} className="w-full mt-1 p-1 border rounded text-sm" />
        </div>
        <div>
            <label className="text-xs font-medium text-slate-500">Welcome Message</label>
            <textarea value={settings.message || ''} onChange={e => onUpdate('message', e.target.value)} rows={4} className="w-full mt-1 p-1 border rounded text-sm" />
        </div>
    </>
);

const TitleOnlySettings: React.FC<{ settings: any; onUpdate: (field: string, value: any) => void; }> = ({ settings, onUpdate }) => (
    <div>
        <label className="text-xs font-medium text-slate-500">Widget Title</label>
        <input type="text" value={settings.title || ''} onChange={e => onUpdate('title', e.target.value)} className="w-full mt-1 p-1 border rounded text-sm" />
    </div>
);

const SettingsPanel: React.FC<{ component: PortalComponent | null, onUpdate: (id: string, newSettings: any) => void, onDelete: (id: string) => void }> = ({ component, onUpdate, onDelete }) => {
    if (!component) {
        return <div className="p-4 text-sm text-slate-500">Select a widget to edit its settings.</div>;
    }

    const handleUpdate = (field: string, value: any) => {
        onUpdate(component.id, { ...component.settings, [field]: value });
    };

    const renderSettings = () => {
        switch(component.type) {
            case 'welcome': return <WelcomeSettings settings={component.settings} onUpdate={handleUpdate} />;
            case 'projects':
            case 'tasks':
            case 'activities':
            case 'donations':
            case 'events':
            case 'volunteers':
            case 'documents':
            case 'team':
                return <GeneralSettings settings={component.settings} onUpdate={handleUpdate} />;
            case 'calendar':
            case 'charity-tracker':
            case 'live-chat':
            case 'video-conference':
            case 'ai-chat-bot':
                return <TitleOnlySettings settings={component.settings} onUpdate={handleUpdate} />;
            default: return <p className="text-xs text-slate-400">No specific settings for this widget.</p>
        }
    }

    return (
        <SettingsWrapper component={component} onDelete={onDelete}>
            {renderSettings()}
        </SettingsWrapper>
    );
};


// --- COMPONENT PALETTE ---
const paletteItems: { type: PortalWidgetType, label: string }[] = [
    { type: 'welcome', label: 'Welcome Message' },
    { type: 'projects', label: 'Projects List' },
    { type: 'tasks', label: 'Tasks List' },
    { type: 'activities', label: 'Activity Feed' },
    { type: 'donations', label: 'Donations Feed' },
    { type: 'documents', label: 'Key Documents' },
    { type: 'team', label: 'Assigned Team' },
    { type: 'calendar', label: 'Calendar View' },
    { type: 'events', label: 'Events List' },
    { type: 'volunteers', label: 'Volunteers List' },
    { type: 'charity-tracker', label: 'Charity Tracker' },
    { type: 'live-chat', label: 'Live Chat' },
    { type: 'video-conference', label: 'Video Conference' },
    { type: 'ai-chat-bot', label: 'AI Help Bot' },
];

const PaletteItem: React.FC<{ item: { type: PortalWidgetType, label: string }, onDragStart: (e: React.DragEvent, type: PortalWidgetType) => void }> = ({ item, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, item.type)}
        className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 cursor-grab active:cursor-grabbing text-sm font-medium text-slate-700 dark:text-slate-200"
    >
        {item.label}
    </div>
);


// --- MAIN BUILDER COMPONENT ---
interface PortalBuilderProps {
    clients: Client[];
    projects: Project[];
    teamMembers: TeamMember[];
    activities: Activity[];
    donations: Donation[];
    documents: Document[];
    events: Event[];
    portalLayouts: PortalLayout[];
    onSaveLayout: (layout: PortalLayout) => void;
}

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export const PortalBuilder: React.FC<PortalBuilderProps> = (props) => {
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [activeLayout, setActiveLayout] = useState<PortalComponent[]>([]);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const clientSelectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedClientId) {
            const existingLayout = props.portalLayouts.find(l => l.clientId === selectedClientId);
            setActiveLayout(existingLayout ? existingLayout.components : []);
        } else {
            setActiveLayout([]);
        }
    }, [selectedClientId, props.portalLayouts]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (clientSelectorRef.current && !clientSelectorRef.current.contains(event.target as Node)) {
                setIsClientSelectorOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClientChange = (clientId: string) => {
        const originalLayout = props.portalLayouts.find(l => l.clientId === selectedClientId);
        const hasUnsavedChanges = JSON.stringify(originalLayout?.components || []) !== JSON.stringify(activeLayout);

        if (hasUnsavedChanges) {
            if (!window.confirm('You have unsaved changes that will be lost. Are you sure you want to switch clients?')) {
                setIsClientSelectorOpen(false);
                return;
            }
        }
        setSelectedClientId(clientId);
        setSelectedComponentId(null);
        setIsClientSelectorOpen(false);
        setClientSearch('');
    };

    const handleSave = () => {
        if (!selectedClientId) return;
        props.onSaveLayout({ clientId: selectedClientId, components: activeLayout });
        alert('Portal layout saved!');
    };

    const handleUpdateSettings = (id: string, newSettings: any) => {
        setActiveLayout(prev => prev.map(c => c.id === id ? { ...c, settings: newSettings } : c));
    };
    
    const handleDelete = (id: string) => {
        setActiveLayout(prev => prev.filter(c => c.id !== id));
        setSelectedComponentId(null);
    }
    
    // DND Handlers
    const handlePaletteDragStart = (e: React.DragEvent, type: PortalWidgetType) => {
        e.dataTransfer.setData('widgetType', type);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const widgetType = e.dataTransfer.getData('widgetType') as PortalWidgetType;
        if (widgetType) {
            const newComponent: PortalComponent = {
                id: `pc-${Date.now()}`,
                type: widgetType,
                settings: { title: `${widgetType.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`, itemLimit: 5 },
            };
            setActiveLayout(prev => [...prev, newComponent]);
        }
    };
    
    const selectedComponent = activeLayout.find(c => c.id === selectedComponentId) || null;
    const selectedClient = props.clients.find(c => c.id === selectedClientId);
    const filteredClients = props.clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Portal Builder</h2>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop to build a custom portal for your clients.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative" ref={clientSelectorRef}>
                        <button
                            onClick={() => setIsClientSelectorOpen(prev => !prev)}
                            className="flex items-center justify-between w-64 p-2 border border-slate-300 rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 text-left focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <span className="truncate text-slate-800 dark:text-slate-200">{selectedClient ? selectedClient.name : '-- Select a Client --'}</span>
                            <ChevronDownIcon />
                        </button>
                        {isClientSelectorOpen && (
                            <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-10">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        placeholder="Search clients..."
                                        value={clientSearch}
                                        onChange={e => setClientSearch(e.target.value)}
                                        className="w-full p-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
                                        autoFocus
                                    />
                                </div>
                                <ul className="max-h-60 overflow-y-auto">
                                    {filteredClients.length > 0 ? filteredClients.map(c => (
                                        <li key={c.id}>
                                            <button
                                                onClick={() => handleClientChange(c.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-violet-100 dark:hover:bg-violet-900/50"
                                            >
                                                {c.name}
                                            </button>
                                        </li>
                                    )) : (
                                        <li className="px-4 py-2 text-sm text-slate-500">No clients found.</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button onClick={handleSave} disabled={!selectedClientId} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-md disabled:bg-violet-300">
                        Save Layout
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Palette */}
                <aside className="w-56 bg-white dark:bg-slate-800 p-4 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    <h3 className="text-sm font-semibold mb-3">Widgets</h3>
                    <div className="space-y-2">
                        {paletteItems.map(item => <PaletteItem key={item.type} item={item} onDragStart={handlePaletteDragStart} />)}
                    </div>
                </aside>

                {/* Canvas */}
                <main className="flex-1 bg-slate-100 dark:bg-slate-900 p-6 overflow-y-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
                    {selectedClientId ? (
                        <div className="max-w-3xl mx-auto space-y-4">
                            {activeLayout.map(comp => (
                                <div key={comp.id} onClick={() => setSelectedComponentId(comp.id)} className={`rounded-lg transition-all ${selectedComponentId === comp.id ? 'ring-2 ring-violet-500' : 'cursor-pointer'}`}>
                                    <PortalComponentRenderer component={comp} allData={{ ...props, client: selectedClient }} />
                                </div>
                            ))}
                            {activeLayout.length === 0 && (
                                <div className="text-center py-24 border-2 border-dashed rounded-lg text-slate-500">
                                    <p>Drop widgets here to build the portal for</p>
                                    <p className="font-semibold mt-1">{selectedClient?.name}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="text-center py-24 text-slate-500">
                            <p>Please select a client to begin building their portal.</p>
                        </div>
                    )}
                </main>

                {/* Settings */}
                <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
                    <SettingsPanel component={selectedComponent} onUpdate={handleUpdateSettings} onDelete={handleDelete} />
                </aside>
            </div>
        </div>
    );
};