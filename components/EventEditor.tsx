import React, { useState, useEffect, useMemo } from 'react';
import type { Event, Client, ScheduleItem, TicketType, Volunteer } from '../types';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

// --- Helper Components & Constants ---
// FIX: Defined styles object to be used by various components in this file.
const styles = {
    input: 'w-full p-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-violet-500 focus:border-violet-500',
};

// FIX: Defined Label component.
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{children}</label>;

// FIX: Defined Input component.
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`${styles.input} ${props.className || ''}`} />;

// FIX: Defined PublishToggle component.
const PublishToggle: React.FC<{ isPublished: boolean, onToggle: (isPublished: boolean) => void }> = ({ isPublished, onToggle }) => (
    <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${isPublished ? 'text-teal-600' : 'text-slate-500'}`}>{isPublished ? 'Published' : 'Draft'}</span>
        <button type="button" onClick={() => onToggle(!isPublished)} className={`${isPublished ? 'bg-teal-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2`}>
            <span className={`${isPublished ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
        </button>
    </div>
);

// FIX: Defined EditorCard component.
const EditorCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
        {children}
    </div>
);

// FIX: Defined AgendaCard component.
const AgendaCard: React.FC<{ schedule: ScheduleItem[], onUpdate: (newSchedule: ScheduleItem[]) => void }> = ({ schedule, onUpdate }) => {
    const handleUpdate = (index: number, field: keyof ScheduleItem, value: string) => {
        const newList = [...schedule];
        newList[index] = { ...newList[index], [field]: value };
        onUpdate(newList);
    };
    const handleAdd = () => onUpdate([...schedule, { id: `s-${Date.now()}`, time: '09:00', title: 'New Item' }]);
    const handleRemove = (id: string) => onUpdate(schedule.filter(item => item.id !== id));

    return (
        <EditorCard title="Agenda / Schedule">
            <div className="space-y-2">
                {schedule.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <Input type="time" value={item.time} onChange={e => handleUpdate(index, 'time', e.target.value)} className="w-28" />
                        <Input type="text" value={item.title} onChange={e => handleUpdate(index, 'title', e.target.value)} className="flex-1" />
                        <button onClick={() => handleRemove(item.id)} className="text-slate-400 hover:text-red-500 p-1">&times;</button>
                    </div>
                ))}
            </div>
            <button onClick={handleAdd} className="mt-4 text-sm font-semibold text-violet-600 hover:text-violet-800">
                + Add Schedule Item
            </button>
        </EditorCard>
    );
};

// FIX: Defined TicketsCard component.
const TicketsCard: React.FC<{ ticketTypes: TicketType[], onUpdate: (newTickets: TicketType[]) => void }> = ({ ticketTypes, onUpdate }) => {
    const handleUpdate = (index: number, field: keyof TicketType, value: string | number) => {
        const newList = [...ticketTypes];
        newList[index] = { ...newList[index], [field]: value };
        onUpdate(newList);
    };
    const handleAdd = () => onUpdate([...ticketTypes, { id: `t-${Date.now()}`, name: 'New Ticket', price: 0 }]);
    const handleRemove = (id: string) => onUpdate(ticketTypes.filter(item => item.id !== id));

    return (
        <EditorCard title="Tickets">
            <div className="space-y-2">
                {ticketTypes.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <Input type="text" value={item.name} onChange={e => handleUpdate(index, 'name', e.target.value)} className="flex-1" />
                        <Input type="number" value={item.price} onChange={e => handleUpdate(index, 'price', parseFloat(e.target.value) || 0)} className="w-24" />
                        <button onClick={() => handleRemove(item.id)} className="text-slate-400 hover:text-red-500 p-1">&times;</button>
                    </div>
                ))}
            </div>
            <button onClick={handleAdd} className="mt-4 text-sm font-semibold text-violet-600 hover:text-violet-800">
                + Add Ticket Type
            </button>
        </EditorCard>
    );
};

// FIX: Defined VolunteersCard component.
const VolunteersCard: React.FC<{ assignedVolunteerIds: string[], allVolunteers: Volunteer[], onUpdate: (newIds: string[]) => void }> = ({ assignedVolunteerIds, allVolunteers, onUpdate }) => {
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Add an explicit type annotation for the 'option' parameter in Array.from to resolve a TypeScript error where the type was inferred as 'unknown'.
        const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        onUpdate(selectedIds);
    };

    return (
        <EditorCard title="Volunteers">
            <select multiple value={assignedVolunteerIds} onChange={handleSelectionChange} className={`${styles.input} h-32`}>
                {allVolunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
        </EditorCard>
    );
};

// FIX: Defined BannerCard component.
const BannerCard: React.FC<{ imageUrl?: string, onUpdate: (url: string) => void }> = ({ imageUrl, onUpdate }) => (
    <EditorCard title="Banner Image">
        <div>
            <Label>Image URL</Label>
            <Input type="text" value={imageUrl || ''} onChange={e => onUpdate(e.target.value)} placeholder="https://..." />
            {imageUrl && <img src={imageUrl} alt="Banner Preview" className="mt-4 rounded-md aspect-video object-cover" />}
        </div>
    </EditorCard>
);


// --- Main Component ---
interface EventEditorProps {
    events: Event[];
    clients: Client[];
    volunteers: Volunteer[];
    onSave: (event: Event) => void;
}

export const EventEditor: React.FC<EventEditorProps> = ({ events, clients, volunteers, onSave }) => {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);

    // Creates a mutable copy of the selected event for editing
    useEffect(() => {
        if (selectedEventId) {
            const event = events.find(e => e.id === selectedEventId);
            setActiveEvent(event ? { ...event, schedule: [...event.schedule], ticketTypes: [...event.ticketTypes], volunteerIds: [...event.volunteerIds] } : null);
        } else {
            setActiveEvent(null);
        }
    }, [selectedEventId, events]);

    const handleSelectEvent = (id: string) => {
        // Simple dirty check. In a real app, this would be more robust.
        const originalEvent = events.find(e => e.id === selectedEventId);
        if (activeEvent && JSON.stringify(originalEvent) !== JSON.stringify(activeEvent)) {
             if (window.confirm('You have unsaved changes. Are you sure you want to switch? Your changes will be lost.')) {
                setSelectedEventId(id);
            }
        } else {
            setSelectedEventId(id);
        }
    };

    const handleCreateNew = () => {
        const newEvent: Event = {
            id: `evt-${Date.now()}`,
            title: 'New Event',
            eventDate: new Date().toISOString(),
            location: '',
            description: '',
            isPublished: false,
            schedule: [],
            ticketTypes: [],
            volunteerIds: [],
        };
        onSave(newEvent);
        setSelectedEventId(newEvent.id);
    };

    const handleSave = () => {
        if (activeEvent) {
            onSave(activeEvent);
            // In a real app, you might show a success toast notification
            alert('Event saved!');
        }
    };

    return (
        <div className="flex h-full -m-6 sm:-m-8 bg-slate-50 dark:bg-slate-900">
            <EventListPanel 
                events={events} 
                onSelect={handleSelectEvent} 
                onCreate={handleCreateNew} 
                selectedId={selectedEventId} 
            />
            <main className="flex-1 overflow-y-auto">
                {activeEvent ? (
                    <EditorCanvas
                        key={activeEvent.id} 
                        event={activeEvent}
                        clients={clients}
                        volunteers={volunteers}
                        onUpdate={setActiveEvent}
                        onSave={handleSave}
                    />
                ) : (
                    <NoEventSelected onCreate={handleCreateNew} />
                )}
            </main>
        </div>
    );
};

// --- Sub-components ---

const EventListPanel: React.FC<{ events: Event[], onSelect: (id: string) => void, onCreate: () => void, selectedId: string | null }> = ({ events, onSelect, onCreate, selectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

    const filteredEvents = useMemo(() => {
        return events
            .filter(event => {
                const searchMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
                const statusMatch = statusFilter === 'all' || (statusFilter === 'published' && event.isPublished) || (statusFilter === 'draft' && !event.isPublished);
                return searchMatch && statusMatch;
            })
            .sort((a,b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    }, [events, searchTerm, statusFilter]);

    return (
        <aside className="w-1/3 max-w-sm bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Events</h2>
                <button onClick={onCreate} className="flex items-center gap-1 text-sm bg-violet-600 text-white px-3 py-1.5 rounded-md font-semibold hover:bg-violet-700">
                    <PlusIcon /> New
                </button>
            </div>
            <div className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    // FIX: Applied consistent input styling.
                    className={styles.input}
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} 
                    // FIX: Applied consistent input styling.
                    className={styles.input}>
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>
            <nav className="flex-1 overflow-y-auto -mr-2 pr-2">
                <ul className="space-y-1">
                    {filteredEvents.map(event => (
                        <li key={event.id}>
                            <button
                              onClick={() => onSelect(event.id)}
                              className={`w-full text-left p-3 rounded-md transition-colors ${selectedId === event.id ? 'bg-violet-100 dark:bg-violet-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <p className={`font-semibold ${selectedId === event.id ? 'text-violet-800 dark:text-violet-200' : 'text-slate-800 dark:text-slate-200'}`}>{event.title}</p>
                                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${event.isPublished ? 'bg-teal-500' : 'bg-amber-500'}`} title={event.isPublished ? 'Published' : 'Draft'}></span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <p className={`${selectedId === event.id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'}`}>{new Date(event.eventDate).toLocaleDateString()}</p>
                                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400" title="Assigned Volunteers">
                                        <UsersIcon /> {event.volunteerIds.length}
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

const NoEventSelected: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Select an event to edit</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Or, create a new one to get started.</p>
        <button onClick={onCreate} className="mt-6 flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-violet-700">
            <PlusIcon /> Create New Event
        </button>
    </div>
);

const EditorCanvas: React.FC<{ event: Event, clients: Client[], volunteers: Volunteer[], onUpdate: (event: Event) => void, onSave: () => void }> = ({ event, clients, volunteers, onUpdate, onSave }) => {
    
    const handleFieldChange = (field: keyof Event, value: any) => {
        onUpdate({ ...event, [field]: value });
    };

    const handleListChange = (field: 'schedule' | 'ticketTypes' | 'volunteerIds', newList: any[]) => {
        onUpdate({ ...event, [field]: newList });
    };

    return (
        <div className="p-6 sm:p-8 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <input type="text" value={event.title} onChange={e => handleFieldChange('title', e.target.value)} className="text-3xl font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none focus:ring-0 p-0" />
                <div className="flex items-center gap-4">
                    <PublishToggle isPublished={event.isPublished} onToggle={(val) => handleFieldChange('isPublished', val)} />
                    <button onClick={onSave} className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-violet-700">Save Changes</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DetailsCard event={event} clients={clients} onChange={handleFieldChange} />
                    <EditorCard title="Description">
                        <textarea value={event.description} onChange={e => handleFieldChange('description', e.target.value)} rows={5} className="w-full p-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Tell attendees about your event..." />
                    </EditorCard>
                    <AgendaCard schedule={event.schedule} onUpdate={(newList) => handleListChange('schedule', newList)} />
                </div>
                <div className="space-y-6">
                    <BannerCard imageUrl={event.bannerImageUrl} onUpdate={(url) => handleFieldChange('bannerImageUrl', url)} />
                    <VolunteersCard assignedVolunteerIds={event.volunteerIds} allVolunteers={volunteers} onUpdate={(newList) => handleListChange('volunteerIds', newList)} />
                    <TicketsCard ticketTypes={event.ticketTypes} onUpdate={(newList) => handleListChange('ticketTypes', newList)} />
                </div>
            </div>
        </div>
    );
};

const DetailsCard: React.FC<{ event: Event, clients: Client[], onChange: (field: keyof Event, value: any) => void }> = ({ event, clients, onChange }) => {
    const { date, time } = {
        date: event.eventDate.split('T')[0],
        time: new Date(event.eventDate).toTimeString().substring(0,5)
    }
    const handleDateTimeChange = (newDate: string, newTime: string) => {
        onChange('eventDate', new Date(`${newDate || '1970-01-01'}T${newTime || '00:00'}`).toISOString());
    }

    return (
        <EditorCard title="Event Details">
            <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={e => handleDateTimeChange(e.target.value, time)} />
                    </div>
                    <div>
                        <Label>Time</Label>
                        <Input type="time" value={time} onChange={e => handleDateTimeChange(date, e.target.value)} />
                    </div>
                </div>
                <div>
                    <Label>Location</Label>
                    <LocationAutocompleteInput value={event.location} onChange={val => onChange('location', val)} className={styles.input} />
                </div>
                <div>
                    <Label>Related Client (Optional)</Label>
                    <select value={event.clientId || ''} onChange={e => onChange('clientId', e.target.value)} className={styles.input}>
                        <option value="">None</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
        </EditorCard>
    );
};

// --- Icons ---
// FIX: Defined PlusIcon.
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>;
// FIX: Defined UsersIcon.
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197M15 21a6 6 0 00-9-5.197" /></svg>;