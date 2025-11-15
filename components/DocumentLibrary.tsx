import React, { useState, useMemo } from 'react';
import type { Document, Client, Project, TeamMember } from '../types';
import { DocumentCategory } from '../types';

interface DocumentLibraryProps {
    documents: Document[];
    clients: Client[];
    projects: Project[];
    teamMembers: TeamMember[];
}

const FileTypeIcon: React.FC<{ type: Document['fileType'] }> = ({ type }) => {
    const icons = {
        pdf: { icon: <PdfIcon />, color: 'text-red-600' },
        docx: { icon: <DocxIcon />, color: 'text-blue-600' },
        xlsx: { icon: <XlsxIcon />, color: 'text-green-600' },
        pptx: { icon: <PptxIcon />, color: 'text-orange-500' },
        other: { icon: <OtherIcon />, color: 'text-slate-500' },
    };
    const { icon, color } = icons[type] || icons.other;
    return <div className={`h-6 w-6 ${color}`}>{icon}</div>;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ documents, clients, projects, teamMembers }) => {
    const [activeTab, setActiveTab] = useState<DocumentCategory | 'all'>('all');

    const filteredDocuments = useMemo(() => {
        const sorted = [...documents].sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        if (activeTab === 'all') {
            return sorted;
        }
        return sorted.filter(doc => doc.category === activeTab);
    }, [documents, activeTab]);
    
    const getRelatedName = (doc: Document) => {
        if (doc.category === DocumentCategory.Client) {
            return clients.find(c => c.id === doc.relatedId)?.name || 'Unknown Client';
        }
        if (doc.category === DocumentCategory.Project) {
            return projects.find(p => p.id === doc.relatedId)?.name || 'Unknown Project';
        }
        return 'N/A';
    };

    const getUploaderName = (id: string) => teamMembers.find(tm => tm.id === id)?.name || 'Unknown';

    const TabButton: React.FC<{ tabId: DocumentCategory | 'all', label: string }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                activeTab === tabId
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Document Library</h2>
                    <p className="text-slate-500 mt-1">Manage and access all your important files.</p>
                </div>
                <button 
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon />
                    Upload Document
                </button>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200 max-w-max">
                    <TabButton tabId="all" label="All" />
                    <TabButton tabId={DocumentCategory.Client} label="Client Docs" />
                    <TabButton tabId={DocumentCategory.Project} label="Project Docs" />
                    <TabButton tabId={DocumentCategory.Internal} label="Internal" />
                    <TabButton tabId={DocumentCategory.Template} label="Templates" />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">File Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Related To</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Modified</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Uploaded By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredDocuments.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                    <div className="flex items-center gap-3">
                                        <FileTypeIcon type={doc.fileType} />
                                        <span>{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getRelatedName(doc)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(doc.lastModified).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getUploaderName(doc.uploadedById)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredDocuments.length === 0 && (
                    <div className="text-center p-12 text-slate-500">
                        No documents match the current filters.
                    </div>
                 )}
            </div>
        </div>
    );
};

// FIX: Defined missing icon components used in the DocumentLibrary.
const iconProps = { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 };
const docPath = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
const PdfIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d={docPath} /></svg>;
const DocxIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d={docPath} /></svg>;
const XlsxIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M4 6h16v12H4zM10 6v12" /></svg>;
const PptxIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const OtherIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;