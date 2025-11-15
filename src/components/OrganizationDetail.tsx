import React, { useState } from 'react';
import type { Client, Project, Activity, Case, Donation, Document, TeamMember, Event } from '../types';
import { ProjectStatus, CaseStatus, ActivityType } from '../types';
import { generateDonorInsights, DonorInsightsResult } from '../services/geminiService';

interface OrganizationDetailProps {
  client: Client;
  projects: Project[];
  activities: Activity[];
  cases: Case[];
  donations: Donation[];
  documents: Document[];
  teamMembers: TeamMember[];
  events: Event[];
  onBack: () => void;
  onSelectProject: (id: string) => void;
  onScheduleActivity: (activity: Partial<Activity>) => void;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            active
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
    >
        {children}
    </button>
);


export const OrganizationDetail: React.FC<OrganizationDetailProps> = ({ client, projects, activities, cases, donations, documents, teamMembers, events, onBack, onSelectProject, onScheduleActivity }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'cases' | 'activities' | 'donations' | 'documents'>('overview');
    const [donorInsights, setDonorInsights] = useState<DonorInsightsResult | null>(null);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    const getAssigneeName = (id: string) => teamMembers.find(tm => tm.id === id)?.name || 'N/A';
    
    const handleGenerateInsights = async () => {
        setIsGeneratingInsights(true);
        setDonorInsights(null);
        const result = await generateDonorInsights(client, donations, activities, events);
        setDonorInsights(result);
        setIsGeneratingInsights(false);
    };

    const handleActionClick = () => {
        if (!donorInsights?.suggestion) return;

        const { actionType, actionTitle } = donorInsights.suggestion;
        if (actionType === 'ScheduleCall') {
            onScheduleActivity({
                title: actionTitle || `Follow-up with ${client.contactPerson}`,
                clientId: client.id,
                type: ActivityType.Call,
            });
        }
        // Could add 'DraftEmail' logic here
    };


    const renderContent = () => {
        switch(activeTab) {
            case 'overview':
                const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard label="Active Projects" value={projects.filter(p => p.status === ProjectStatus.InProgress).length} />
                                <StatCard label="Open Cases" value={cases.filter(c => c.status === CaseStatus.New || c.status === CaseStatus.InProgress).length} />
                                <StatCard label="Total Donations" value={currencyFormatter.format(totalDonated)} />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-violet-50 to-indigo-100 p-6 rounded-lg border border-violet-200/50 dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-900/50 dark:border-white/10">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Donor Insights</h3>
                            
                            {isGeneratingInsights && <p className="text-sm text-slate-500 dark:text-slate-400">Generating...</p>}

                            {!isGeneratingInsights && !donorInsights && (
                                <>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get AI-powered insights and suggested actions for this donor.</p>
                                    <button onClick={handleGenerateInsights} className="w-full text-center bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-violet-700">
                                        Generate Donor Insights
                                    </button>
                                </>
                            )}
                            
                            {!isGeneratingInsights && donorInsights && (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{donorInsights.insights}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{donorInsights.suggestion.text}</p>
                                    {donorInsights.suggestion.actionType !== 'None' && (
                                        <button onClick={handleActionClick} className="w-full text-center bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-violet-700">
                                            {donorInsights.suggestion.actionType === 'ScheduleCall' ? 'Schedule Call' : 'Draft Email'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'projects':
                return (
                     <div className="space-y-3">
                        {projects.map(p => (
                            <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md border dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{p.startDate} - {p.endDate}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{p.status}</span>
                                     <button onClick={() => onSelectProject(p.id)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'cases':
                 return (
                     <div className="space-y-3">
                        {cases.map(c => (
                            <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md border dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{c.title}</p>
                                    <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{c.priority}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Assigned to: {getAssigneeName(c.assignedToId)} | Status: {c.status}</p>
                            </div>
                        ))}
                    </div>
                );
             // Add more cases for activities, donations, documents...
            default:
                return <p>Content for {activeTab}</p>;
        }
    }

    return (
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-indigo-600 font-semibold hover:text-indigo-700 mb-6 dark:text-indigo-400 dark:hover:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Organizations
            </button>

            <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-slate-200 pb-6 mb-6 dark:border-slate-700">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 dark:text-slate-100">{client.name}</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <span><strong>Contact:</strong> {client.contactPerson}</span>
                            <span><strong>Email:</strong> {client.email}</span>
                            <span><strong>Phone:</strong> {client.phone}</span>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-sm text-slate-500 dark:text-slate-400 text-right">
                        <p><strong>Location:</strong> {client.location}</p>
                        <p><strong>Client Since:</strong> {new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                        <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>Projects ({projects.length})</TabButton>
                        <TabButton active={activeTab === 'cases'} onClick={() => setActiveTab('cases')}>Cases ({cases.length})</TabButton>
                        <TabButton active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>Activities ({activities.length})</TabButton>
                        <TabButton active={activeTab === 'donations'} onClick={() => setActiveTab('donations')}>Donations ({donations.length})</TabButton>
                        <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>Documents ({documents.length})</TabButton>
                    </nav>
                </div>
                
                {/* Tab Content */}
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
