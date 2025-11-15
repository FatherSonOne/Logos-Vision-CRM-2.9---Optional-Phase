import React, { useState, useCallback, useMemo } from 'react';
import type { Project, Donation, Client } from '../../types';
import { generateGrantNarrative } from '../../services/geminiService';
import { AiEnhancedTextarea } from './AiEnhancedTextarea';
import { UploadCloudIcon, SparklesIcon, DatabaseIcon } from './icons';

interface GrantAssistantProps {
    projects: Project[];
    donations: Donation[];
    clients: Client[];
}

type GrantSectionType = 'narrative' | 'data';
interface GrantSection {
    id: string;
    title: string;
    type: GrantSectionType;
    promptSuggestion?: string;
    content: string;
    crmSuggestion?: string;
}

const MOCK_GRANT_SECTIONS: GrantSection[] = [
    { id: 'org_history', title: 'Organization History', type: 'narrative', content: '', promptSuggestion: 'Write a brief history of our organization, focusing on our founding and major milestones.' },
    { id: 'needs_statement', title: 'Statement of Need', type: 'narrative', content: '', promptSuggestion: "Draft a compelling needs statement for the 'Youth Empowerment Network' project, highlighting the 20% increase in community engagement we saw last year." },
    { id: 'project_goals', title: 'Project Goals & Objectives', type: 'narrative', content: '', promptSuggestion: "List the primary goals and measurable objectives for the 'Annual Fundraising Gala Strategy' project." },
    { id: 'impact_metrics', title: 'Impact Metrics', type: 'data', content: '', crmSuggestion: 'Relevant data includes total donations from the last fiscal year, number of projects completed, and total volunteers engaged.' },
];

export const GrantAssistant: React.FC<GrantAssistantProps> = ({ projects, donations, clients }) => {
    const [step, setStep] = useState<'upload' | 'edit'>('upload');
    const [sections, setSections] = useState<GrantSection[]>([]);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [userPrompt, setUserPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataToInsert, setDataToInsert] = useState('');

    const handleUpload = () => {
        setIsLoading(true);
        setTimeout(() => {
            const initialSections = MOCK_GRANT_SECTIONS.map(s => ({...s})); // Create deep copy
            setSections(initialSections);
            const firstSection = initialSections[0];
            if (firstSection) {
                setSelectedSectionId(firstSection.id);
                setUserPrompt(firstSection.promptSuggestion || '');
            }
            setStep('edit');
            setIsLoading(false);
        }, 1000);
    };

    const selectedSection = useMemo(() => sections.find(s => s.id === selectedSectionId), [sections, selectedSectionId]);

    const handleSelectSection = (id: string) => {
        setSelectedSectionId(id);
        const section = sections.find(s => s.id === id);
        setUserPrompt(section?.promptSuggestion || '');
        setDataToInsert(''); // Clear data when switching sections
    };

    const handleSectionContentChange = (value: string) => {
        if (!selectedSectionId) return;
        setSections(secs => secs.map(s => s.id === selectedSectionId ? { ...s, content: value } : s));
    };

    const handleGenerateNarrative = useCallback(async () => {
        if (!selectedSection || !userPrompt) return;
        setIsLoading(true);
        let contextData = '';
        if (userPrompt.toLowerCase().includes('youth empowerment')) {
            const project = projects.find(p => p.clientId === 'cl3'); // Youth Empowerment Network
            const client = clients.find(c => c.id === 'cl3');
            contextData = `Client: ${client?.name}\nProject: ${project?.name}\nDescription: ${project?.description}`;
        } else if (userPrompt.toLowerCase().includes('gala')) {
            const project = projects.find(p => p.id === 'p1'); // Annual Fundraising Gala Strategy
            contextData = `Project: ${project?.name}\nDescription: ${project?.description}`;
        }
        
        const narrative = await generateGrantNarrative(userPrompt, contextData);
        handleSectionContentChange(narrative);
        setIsLoading(false);
    }, [selectedSection, userPrompt, projects, clients]);

    const handleFindData = () => {
        const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
        const projectsCompleted = projects.filter(p => p.status === 'Completed').length;
        const formattedData = `
- Total Donations (All Time): ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDonated)}
- Projects Completed: ${projectsCompleted}
- Total Active Clients: ${clients.length}
        `;
        setDataToInsert(formattedData);
    };

    if (step === 'upload') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-lg border border-dashed border-white/20 dark:border-white/10">
                <UploadCloudIcon />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-4">AI Grant Assistant</h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mt-2">Upload a grant application (PDF or DocX) to get started. The AI will analyze the document, identify key sections, and help you draft compelling content with data from your CRM.</p>
                <button 
                    onClick={handleUpload} 
                    disabled={isLoading}
                    className="mt-6 flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-md text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
                >
                    {isLoading ? 'Analyzing...' : 'Upload Grant Application (Simulated)'}
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-full -m-6 sm:-m-8">
            <aside className="w-1/4 max-w-xs bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm p-4 flex flex-col border-r border-white/20 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Grant Sections</h2>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-1">
                        {sections.map(section => (
                            <li key={section.id}>
                                <button
                                    onClick={() => handleSelectSection(section.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        selectedSectionId === section.id
                                        ? 'bg-violet-100 text-violet-700 font-semibold dark:bg-violet-900/50 dark:text-violet-300'
                                        : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-black/20'
                                    }`}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 flex flex-col p-6 overflow-y-auto">
                {selectedSection && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedSection.title}</h3>
                        {selectedSection.type === 'narrative' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">AI Prompt</label>
                                    <textarea value={userPrompt} onChange={e => setUserPrompt(e.target.value)} rows={3} className="w-full p-2 bg-white/50 border border-white/30 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-black/30 dark:border-white/20" />
                                    <button onClick={handleGenerateNarrative} disabled={isLoading} className="mt-2 flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50">
                                        <SparklesIcon /> {isLoading ? 'Generating...' : 'Generate Draft'}
                                    </button>
                                </div>
                                <AiEnhancedTextarea
                                    value={selectedSection.content}
                                    onValueChange={handleSectionContentChange}
                                    rows={15}
                                    className="w-full p-2 bg-white/50 border border-white/30 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-black/30 dark:border-white/20"
                                />
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-white/30 dark:bg-black/20 rounded-lg border border-white/20">
                                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">AI Suggestion</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selectedSection.crmSuggestion}</p>
                                    <button onClick={handleFindData} className="mt-3 flex items-center bg-white/50 text-slate-700 dark:bg-black/30 dark:text-slate-200 px-3 py-1.5 text-sm font-semibold rounded-md border border-white/30 dark:border-white/20 hover:bg-white/80">
                                        <DatabaseIcon /> Find Relevant Data
                                    </button>
                                </div>
                                {dataToInsert && (
                                     <div className="p-4 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
                                        <h4 className="font-semibold text-violet-800 dark:text-violet-200">Data from CRM</h4>
                                        <pre className="text-sm text-violet-700 dark:text-violet-300 whitespace-pre-wrap mt-2 font-mono">{dataToInsert}</pre>
                                     </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};