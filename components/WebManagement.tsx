import React, { useState, useMemo } from 'react';
import type { Webpage, Client } from '../types';
import { WebpageStatus } from '../types';
import { WebpagePreviewModal } from './WebpagePreviewModal';

interface WebManagementProps {
    webpages: Webpage[];
    clients: Client[];
    onCreatePage: () => void;
    onEditPage: (pageId: string) => void;
}

const StatusBadge: React.FC<{ status: WebpageStatus }> = ({ status }) => {
  const colorClasses = {
    [WebpageStatus.Published]: 'bg-teal-100 text-teal-800',
    [WebpageStatus.Draft]: 'bg-amber-100 text-amber-800',
    [WebpageStatus.Archived]: 'bg-slate-200 text-slate-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>
      {status}
    </span>
  );
};

const StatusIndicator: React.FC<{ status: WebpageStatus }> = ({ status }) => {
    const colorClass = {
        [WebpageStatus.Published]: 'bg-teal-500',
        [WebpageStatus.Draft]: 'bg-amber-500',
        [WebpageStatus.Archived]: 'bg-slate-400',
    }[status];
    return <span className={`inline-block h-2 w-2 rounded-full ${colorClass}`} title={status}></span>;
}


export const WebManagement: React.FC<WebManagementProps> = ({ webpages, clients, onCreatePage, onEditPage }) => {
    const [statusFilter, setStatusFilter] = useState<WebpageStatus | 'all'>('all');
    const [clientFilter, setClientFilter] = useState<string | 'all'>('all');
    const [previewingPage, setPreviewingPage] = useState<Webpage | null>(null);

    const filteredWebpages = useMemo(() => {
        return webpages
            .filter(page => {
                const statusMatch = statusFilter === 'all' || page.status === statusFilter;
                const clientMatch = clientFilter === 'all' || page.relatedId === clientFilter;
                return statusMatch && clientMatch;
            })
            .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }, [webpages, statusFilter, clientFilter]);

    const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';
    const numberFormatter = new Intl.NumberFormat('en-US');

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Webpage Management</h2>
                    <p className="text-slate-500 mt-1">Manage content, view analytics, and control the status of client webpages.</p>
                </div>
                <button 
                    onClick={onCreatePage}
                    className="flex items-center bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                    <PlusIcon />
                    Create New Page
                </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as WebpageStatus | 'all')}
                    className="bg-slate-100 border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:ring-violet-500 focus:border-violet-500"
                >
                    <option value="all">All Statuses</option>
                    {Object.values(WebpageStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="bg-slate-100 border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:ring-violet-500 focus:border-violet-500"
                >
                    <option value="all">All Clients</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Visits</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Engagement</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredWebpages.map(page => (
                            <tr key={page.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                    <div className="flex items-center gap-3">
                                        <StatusIndicator status={page.status} />
                                        {page.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getClientName(page.relatedId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={page.status} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(page.lastUpdated).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right font-mono">{numberFormatter.format(page.visits)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right font-mono">{page.engagementScore}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => setPreviewingPage(page)} className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-slate-100 rounded-md" title="Preview Page"><EyeIcon /></button>
                                        <button onClick={() => onEditPage(page.id)} className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-slate-100 rounded-md" title="Edit Page"><PencilIcon /></button>
                                        <button className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md" title="Archive Page"><ArchiveIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredWebpages.length === 0 && (
                    <div className="text-center p-12 text-slate-500">
                        No webpages match the current filters.
                    </div>
                 )}
            </div>
            {previewingPage && (
                <WebpagePreviewModal
                    isOpen={!!previewingPage}
                    onClose={() => setPreviewingPage(null)}
                    page={previewingPage}
                />
            )}
        </div>
    );
};

// Icons
const iconProps = { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 };
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const EyeIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const ArchiveIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;