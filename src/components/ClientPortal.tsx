import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Client, Project, Activity, Task, Donation, Document, Event, TeamMember, Volunteer, PortalLayout, PortalComponent, ChatMessage } from '../types';
import { ProjectStatus, TaskStatus, ActivityType } from '../types';
import { chatWithBot } from '../services/geminiService';

interface ClientPortalProps {
  client: Client;
  layout?: PortalLayout;
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  donations: Donation[];
  documents: Document[];
  events: Event[];
  team: TeamMember[];
  volunteers: Volunteer[];
  onLogout: () => void;
}

// --- GENERIC WIDGET WRAPPER ---
const WidgetWrapper: React.FC<{ title: string; children: React.ReactNode; isDragging?: boolean }> = ({ title, children, isDragging }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col ${isDragging ? 'opacity-50' : ''}`}>
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">{title}</h3>
        <div className="p-4 flex-grow">{children}</div>
    </div>
);

// --- INDIVIDUAL WIDGET COMPONENTS ---

const CalendarWidget: React.FC<{ settings: any, activities: Activity[], events: Event[] }> = ({ settings, activities, events }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const calendarGrid = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) { days.push({ key: `pad-start-${i}`, date: null }); }
        for (let i = 1; i <= daysInMonth; i++) { days.push({ key: `day-${i}`, date: new Date(year, month, i) }); }
        while (days.length % 7 !== 0) { days.push({ key: `pad-end-${days.length}`, date: null }); }
        return days;
    }, [viewDate]);

    const itemsByDate = useMemo(() => {
        const map = new Map<string, (Activity | Event)[]>();
        [...activities, ...events].forEach(item => {
            const dateKey = new Date('eventDate' in item ? item.eventDate : item.activityDate).toISOString().split('T')[0];
            const dayItems = map.get(dateKey) || [];
            map.set(dateKey, [...dayItems, item]);
        });
        return map;
    }, [activities, events]);

    const selectedDayItems = selectedDay ? itemsByDate.get(selectedDay.toISOString().split('T')[0]) || [] : [];
    
    return (
        <WidgetWrapper title={settings.title || 'Calendar'}>
            <div className="text-center mb-2 font-semibold">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
            <div className="grid grid-cols-7 text-center text-xs text-slate-500">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {calendarGrid.map(({ key, date }) => {
                    const dateKey = date?.toISOString().split('T')[0];
                    const hasItems = dateKey && itemsByDate.has(dateKey);
                    return (
                        <div key={key} className="aspect-square flex items-center justify-center">
                            {date && (
                                <button
                                    onClick={() => setSelectedDay(date)}
                                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors relative ${selectedDay?.getTime() === date.getTime() ? 'bg-violet-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    {date.getDate()}
                                    {hasItems && <span className="absolute bottom-1 h-1 w-1 bg-violet-500 rounded-full"></span>}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedDay && (
                <div className="mt-4 border-t pt-2">
                    <h4 className="font-semibold text-sm">{selectedDay.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                    <ul className="text-xs space-y-1 mt-1">
                        {selectedDayItems.length > 0 ? selectedDayItems.map(item => (
                            <li key={item.id} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-500"></span>{item.title}</li>
                        )) : <li>No events scheduled.</li>}
                    </ul>
                </div>
            )}
        </WidgetWrapper>
    );
};

const LiveChatWidget: React.FC<{ settings: any }> = ({ settings }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage: ChatMessage = { id: `msg-${Date.now()}`, roomId: 'portal-chat', senderId: 'CLIENT', text: input, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsReplying(true);
        setTimeout(() => {
            const reply: ChatMessage = { id: `msg-${Date.now()+1}`, roomId: 'portal-chat', senderId: 'CONSULTANT', text: "Thanks for your message! We'll get back to you shortly.", timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, reply]);
            setIsReplying(false);
        }, 1500);
    };

    return (
        <WidgetWrapper title={settings.title || 'Live Chat'}>
            <div className="flex flex-col h-64">
                <div className="flex-1 space-y-2 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-t-md">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-2 text-sm ${msg.senderId === 'CLIENT' ? 'justify-end' : ''}`}>
                             <div className={`p-2 rounded-lg ${msg.senderId === 'CLIENT' ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{msg.text}</div>
                        </div>
                    ))}
                    {isReplying && <div className="text-sm text-slate-400 italic">Consultant is typing...</div>}
                </div>
                <form onSubmit={handleSend}>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="w-full p-2 text-sm border-t border-slate-200 focus:ring-0 focus:border-violet-500 rounded-b-md" />
                </form>
            </div>
        </WidgetWrapper>
    )
}

const AiChatBotWidget: React.FC<{ settings: any }> = ({ settings }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init-bot', roomId: 'portal-ai-bot', senderId: 'AI', text: "Hello! I'm your portal assistant. How can I help you navigate your projects and data today?", timestamp: new Date().toISOString() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const systemInstruction = `You are a helpful AI assistant embedded in a client portal for a non-profit consulting firm. Your name is Logos Helper. Your purpose is to guide clients on how to use their portal.
    The portal contains the following widgets they can ask about:
    - Welcome Message: A greeting from their consultant.
    - Projects: A list of their current and past projects.
    - Tasks: A list of tasks related to their projects that are shared with them.
    - Activity Feed: A timeline of recent calls, meetings, and emails.
    - Donations Feed: A list of recent donations for their campaigns.
    - Key Documents: Important files shared by their consultant.
    - Calendar View: A monthly view of scheduled activities and events.
    - Events List: A list of upcoming events.
    - Volunteers List: A list of volunteers assigned to their projects.
    - Charity Tracker: A progress bar for their fundraising goals.
    - Live Chat: A way to chat in real-time with their consultant.
    - Video Conference: Quick links to start video calls.
    - AI Help Bot: A way to chat with Logos Helper.

    Keep your answers concise, friendly, and focused on helping the user understand and navigate these features. Do not go off-topic. If asked something you don't know, politely say you can only help with portal functions.
    `;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: `msg-user-${Date.now()}`, roomId: 'portal-ai-bot', senderId: 'USER', text: input.trim(), timestamp: new Date().toISOString() };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const responseText = await chatWithBot(newMessages, userMessage.text, systemInstruction);

        const aiMessage: ChatMessage = { id: `msg-ai-${Date.now()}`, roomId: 'portal-ai-bot', senderId: 'AI', text: responseText, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <WidgetWrapper title={settings.title || 'AI Help Bot'}>
            <div className="flex flex-col h-80">
                <div className="flex-1 space-y-3 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-t-md">
                    {messages.map(msg => (
                         <div key={msg.id} className={`flex items-start gap-2.5 text-sm ${msg.senderId === 'USER' ? 'justify-end' : ''}`}>
                             {msg.senderId === 'AI' && <div className="w-6 h-6 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">AI</div>}
                             <div className={`p-2 rounded-lg max-w-[90%] ${msg.senderId === 'USER' ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{msg.text}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-2.5 text-sm">
                             <div className="w-6 h-6 rounded-full bg-violet-200 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">AI</div>
                            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                               <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
                <form onSubmit={handleSend}>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the portal..." className="w-full p-2 text-sm border-t border-slate-200 focus:ring-0 focus:border-violet-500 rounded-b-md dark:bg-slate-700 dark:border-slate-600" />
                </form>
            </div>
        </WidgetWrapper>
    );
}

const VideoConferenceWidget: React.FC<{ settings: any }> = ({ settings }) => (
    <WidgetWrapper title={settings.title || 'Start a Call'}>
        <div className="space-y-2">
            <a href="https://meet.new" target="_blank" rel="noopener noreferrer" className="block text-center w-full p-2 rounded-md bg-green-500 text-white font-semibold">Google Meet</a>
            <a href="https://zoom.us/start/meeting" target="_blank" rel="noopener noreferrer" className="block text-center w-full p-2 rounded-md bg-blue-500 text-white font-semibold">Zoom</a>
        </div>
    </WidgetWrapper>
);

// --- MAIN RENDERER ---
const WidgetRenderer: React.FC<{ component: PortalComponent, allData: Omit<ClientPortalProps, 'layout' | 'onLogout'> }> = ({ component, allData }) => {
    const { settings } = component;
    const limit = settings.itemLimit || 5;

    switch(component.type) {
        case 'welcome':
            return <WidgetWrapper title={settings.title || 'Welcome'}><p className="text-sm text-slate-600 dark:text-slate-300">{settings.message || 'Welcome to your portal.'}</p></WidgetWrapper>;
        
        case 'projects':
            return <WidgetWrapper title={settings.title || 'Projects'}>
                <ul className="space-y-3">
                    {allData.projects.length > 0 ? allData.projects.slice(0, limit).map(p => (
                        <li key={p.id} className="text-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === ProjectStatus.Completed ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
                            </div>
                        </li>
                    )) : <p className="text-xs text-slate-400 text-center py-4">No projects to display.</p>}
                </ul>
            </WidgetWrapper>;
            
        case 'tasks':
            return <WidgetWrapper title={settings.title || 'Tasks'}>
                <ul className="space-y-2">
                    {allData.tasks.length > 0 ? allData.tasks.slice(0, limit).map(t => (
                        <li key={t.id} className="text-sm flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                            <input type="checkbox" readOnly checked={t.status === TaskStatus.Done} className="h-4 w-4 rounded text-violet-600 focus:ring-0" />
                            <span className={`flex-1 ${t.status === TaskStatus.Done ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{t.description}</span>
                        </li>
                    )) : <p className="text-xs text-slate-400 text-center py-4">No tasks shared.</p>}
                </ul>
            </WidgetWrapper>;

        case 'activities':
            return <WidgetWrapper title={settings.title || 'Recent Activity'}>
                 <ul className="space-y-3">
                    {allData.activities.length > 0 ? allData.activities.slice(0, limit).map(a => (
                        <li key={a.id} className="text-sm flex items-start gap-3">
                            <div className="mt-1 text-slate-400">{ {Call: '📞', Meeting: '👥', Email: '✉️', Note: '📝'}[a.type] }</div>
                            <div>
                                <p className="font-medium text-slate-700 dark:text-slate-300">{a.title}</p>
                                <p className="text-xs text-slate-500">{new Date(a.activityDate).toLocaleDateString()}</p>
                            </div>
                        </li>
                    )) : <p className="text-xs text-slate-400 text-center py-4">No recent activities.</p>}
                 </ul>
            </WidgetWrapper>;

        case 'documents':
            return <WidgetWrapper title={settings.title || 'Key Documents'}>
                <ul className="space-y-2">
                    {allData.documents.length > 0 ? allData.documents.slice(0, limit).map(d => (
                        <li key={d.id} className="text-sm flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                            <span className="text-slate-400">📄</span>
                            <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-violet-600 dark:text-violet-400 hover:underline truncate">{d.name}</a>
                        </li>
                    )) : <p className="text-xs text-slate-400 text-center py-4">No documents shared.</p>}
                </ul>
            </WidgetWrapper>;

        case 'team':
            return <WidgetWrapper title={settings.title || 'Your Team'}>
                <ul className="space-y-3">
                    {allData.team.length > 0 ? allData.team.slice(0, limit).map(t => (
                        <li key={t.id} className="text-sm flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">{t.name.split(' ').map(n=>n[0]).join('')}</span>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{t.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                            </div>
                        </li>
                    )) : <p className="text-xs text-slate-400 text-center py-4">No team members assigned.</p>}
                </ul>
            </WidgetWrapper>;

        case 'calendar':
            return <CalendarWidget settings={settings} activities={allData.activities} events={allData.events} />;
        
        case 'events':
             return <WidgetWrapper title={settings.title || 'Upcoming Events'}>
                <ul className="space-y-3">
                    {allData.events.length > 0 ? allData.events.slice(0, limit).map(e => <li key={e.id} className="text-sm"><b>{e.title}</b> on {new Date(e.eventDate).toLocaleDateString()}</li>) : <p className="text-xs text-slate-400 text-center py-4">No upcoming events.</p>}
                </ul>
            </WidgetWrapper>;

        case 'volunteers':
             return <WidgetWrapper title={settings.title || 'Your Volunteers'}>
                <ul className="space-y-2 text-sm">
                    {allData.volunteers.length > 0 ? allData.volunteers.slice(0, limit).map(v => <li key={v.id}>{v.name}</li>) : <p className="text-xs text-slate-400 text-center py-4">No volunteers assigned.</p>}
                </ul>
            </WidgetWrapper>;

        case 'donations':
            const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
            return <WidgetWrapper title={settings.title || 'Recent Donations'}>
                 <ul className="space-y-2 text-sm">
                    {allData.donations.length > 0 ? allData.donations.slice(0, limit).map(d => <li key={d.id} className="flex justify-between"><span>{d.donorName}</span><b>{currencyFormatter.format(d.amount)}</b></li>) : <p className="text-xs text-slate-400 text-center py-4">No recent donations.</p>}
                </ul>
            </WidgetWrapper>;

        case 'charity-tracker':
            const totalDonations = allData.donations.reduce((sum, d) => sum + d.amount, 0);
            const goal = 10000;
            const progress = Math.min((totalDonations / goal) * 100, 100);
            return <WidgetWrapper title={settings.title || 'Fundraising Goal'}>
                <div className="text-3xl font-bold text-violet-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDonations)}</div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2"><div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                <p className="text-xs text-slate-500 mt-1">Raised towards {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(goal)} goal</p>
            </WidgetWrapper>;
        
        case 'live-chat':
            return <LiveChatWidget settings={settings} />;

        case 'video-conference':
            return <VideoConferenceWidget settings={settings} />;
        
        case 'ai-chat-bot':
            return <AiChatBotWidget settings={settings} />;
            
        default: 
            return <WidgetWrapper title={component.settings.title || component.type}>Coming soon...</WidgetWrapper>;
    }
}


export const ClientPortal: React.FC<ClientPortalProps> = (props) => {
  const { client, layout, onLogout } = props;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-full">
        <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    <span className="font-light text-slate-500">Portal for</span> {client.name}
                </h2>
                <button onClick={onLogout} className="text-sm font-semibold text-slate-600 hover:text-violet-600">
                    Exit Portal View &rarr;
                </button>
            </div>
        </header>
        <main className="max-w-7xl mx-auto p-4 sm:p-6">
            {layout && layout.components.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {layout.components.map(component => (
                        <div key={component.id} className={`${['calendar', 'live-chat', 'ai-chat-bot'].includes(component.type) ? 'md:col-span-1' : 'md:col-span-1'}`}>
                            <WidgetRenderer component={component} allData={props} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed">
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">This Portal is Empty</h3>
                    <p className="text-slate-500 mt-2">Use the Portal Builder to add and configure widgets for this client.</p>
                </div>
            )}
        </main>
    </div>
  );
};