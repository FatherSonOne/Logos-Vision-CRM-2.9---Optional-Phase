import React from 'react';
// FIX: Import SearchResults from types.ts to avoid circular dependency with App.tsx
import type { Client, Project, EnrichedTask, TeamMember, Activity, Volunteer, Case, Document, Page, WebSearchResult, SearchResults } from '../types';
import { GlobeIcon, FolderIcon, BuildingIcon, CheckSquareIcon, BriefcaseIcon, ClipboardListIcon, HandHeartIcon, CaseIcon, DocumentsIcon } from './icons';

// Helper component to highlight the search query in a string.
const Highlight: React.FC<{ text: string | undefined; query: string }> = ({ text, query }) => {
    if (!text) return null;
    if (!query) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-500 text-black rounded px-1 py-0.5 font-bold">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

// Card component for displaying a single result
interface ResultCardProps {
    type: string;
    title: React.ReactNode;
    context1?: React.ReactNode;
    context2?: React.ReactNode;
    onClick: () => void;
    icon: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ type, title, context1, context2, onClick, icon }) => (
    <button onClick={onClick} className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md transition-all flex items-start gap-4">
        <div className="text-violet-500 mt-1 flex-shrink-0">{icon}</div>
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center gap-2">
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 truncate">{title}</h3>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full dark:bg-slate-700 dark:text-slate-300 flex-shrink-0">{type}</span>
            </div>
            {context1 && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{context1}</p>}
            {context2 && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{context2}</p>}
        </div>
    </button>
);

const WebResultCard: React.FC<{ result: WebSearchResult, query: string }> = ({ result, query }) => (
    <div className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-fuchsia-400 dark:hover:border-fuchsia-500 hover:shadow-md transition-all flex items-start gap-4">
        <div className="text-fuchsia-500 mt-1 flex-shrink-0"><GlobeIcon /></div>
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center gap-2">
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 truncate">
                    <Highlight text={result.name} query={query} />
                </h3>
                <span className="text-xs font-medium bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full dark:bg-fuchsia-900/50 dark:text-fuchsia-300 flex-shrink-0">Web Lead</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                <Highlight text={result.description} query={query} />
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs">
                {result.url && <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold truncate">Visit Website</a>}
                {result.source && result.source !== '#' && <a href={result.source} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:underline truncate">Source</a>}
            </div>
        </div>
    </div>
);


// Main search results page component
interface SearchResultsPageProps {
  query: string;
  isLoading: boolean;
  results: SearchResults | null;
  onNavigateToProject: (projectId: string) => void;
  onNavigateToPage: (page: Page) => void;
}


export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
    query,
    isLoading,
    results,
    onNavigateToProject,
    onNavigateToPage,
}) => {

    // FIX: Replaced reduce with explicit sum of lengths for type safety and to include webResults.
    const totalResults = results
    ? (results.projects?.length || 0) +
      (results.clients?.length || 0) +
      (results.tasks?.length || 0) +
      (results.teamMembers?.length || 0) +
      (results.activities?.length || 0) +
      (results.volunteers?.length || 0) +
      (results.cases?.length || 0) +
      (results.documents?.length || 0) +
      (results.webResults?.length || 0)
    : 0;
    
    // These helpers are needed because the results objects are minimal
    const clients = results?.clients || [];
    const projects = results?.projects || [];

    const getClientName = (clientId: string | null | undefined) => clients.find(c => c.id === clientId)?.name || 'N/A';
    const getProjectName = (projectId: string | null | undefined) => projects.find(p => p.id === projectId)?.name || 'N/A';

    if (isLoading || !results) {
         return (
            <div>
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Searching...</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Asking Gemini to find results for <span className="font-semibold text-violet-600 dark:text-violet-400">"{query}"</span>
                </p>
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mt-4">Searching...</p>
                </div>
            </div>
        )
    }

    const hasInternalResults = totalResults - (results.webResults?.length || 0) > 0;

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Search Results</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} for <span className="font-semibold text-violet-600 dark:text-violet-400">"{query}"</span>
            </p>

            {totalResults > 0 ? (
                <div className="space-y-8">
                    {/* Web Results Section */}
                    {results.webResults.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 border-b pb-2 dark:border-slate-700">Potential New Leads from the Web</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.webResults.map((res, i) => (
                                    <WebResultCard key={`web-${i}`} result={res} query={query} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Internal CRM Results Section */}
                    {hasInternalResults && (
                        <div>
                             <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 border-b pb-2 dark:border-slate-700">Results from your CRM</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* FIX: Corrected property names from '...Results' to match the 'SearchResults' interface (e.g., 'projectResults' to 'projects'). */}
                                {results.projects.map(p => <ResultCard key={`proj-${p.id}`} type="Project" title={<Highlight text={p.name} query={query} />} context1={<>Client: {getClientName(p.clientId)}</>} context2={<Highlight text={p.description} query={query} />} onClick={() => onNavigateToProject(p.id)} icon={<FolderIcon />} />)}
                                {results.clients.map(c => <ResultCard key={`client-${c.id}`} type="Organization" title={<Highlight text={c.name} query={query} />} context1={<>Contact: <Highlight text={c.contactPerson} query={query} /></>} onClick={() => onNavigateToPage('organizations')} icon={<BuildingIcon />} />)}
                                {results.tasks.map(t => <ResultCard key={`task-${t.id}`} type="Task" title={<Highlight text={t.description} query={query} />} context1={<>Project: {t.projectName}</>} onClick={() => onNavigateToProject(t.projectId)} icon={<CheckSquareIcon />} />)}
                                {results.teamMembers.map(tm => <ResultCard key={`tm-${tm.id}`} type="Team Member" title={<Highlight text={tm.name} query={query} />} context1={<Highlight text={tm.role} query={query} />} onClick={() => onNavigateToPage('team')} icon={<BriefcaseIcon />} />)}
                                {results.activities.map(a => <ResultCard key={`act-${a.id}`} type="Activity" title={<Highlight text={a.title} query={query} />} context1={<>Client: {getClientName(a.clientId)} / Project: {getProjectName(a.projectId)}</>} context2={<Highlight text={a.notes} query={query} />} onClick={() => onNavigateToPage('activities')} icon={<ClipboardListIcon />} />)}
                                {results.volunteers.map(v => <ResultCard key={`vol-${v.id}`} type="Volunteer" title={<Highlight text={v.name} query={query} />} context1={<>Skills: <Highlight text={v.skills.join(', ')} query={query} /></>} onClick={() => onNavigateToPage('volunteers')} icon={<HandHeartIcon />} />)}
                                {results.cases.map(c => <ResultCard key={`case-${c.id}`} type="Case" title={<Highlight text={c.title} query={query} />} context1={<>Client: {getClientName(c.clientId)}</>} context2={<Highlight text={c.description} query={query} />} onClick={() => onNavigateToPage('case')} icon={<CaseIcon />} />)}
                                {results.documents.map(d => <ResultCard key={`doc-${d.id}`} type="Document" title={<Highlight text={d.name} query={query} />} context1={<>Category: {d.category}</>} onClick={() => onNavigateToPage('documents')} icon={<DocumentsIcon />} />)}
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">No results found.</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try searching for something else, or rephrasing your query.</p>
                </div>
            )}
        </div>
    );
};
