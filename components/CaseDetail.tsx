import React, { useState } from 'react';
import type { Case, Client, TeamMember, Activity, CaseComment } from '../types';
import { CaseStatus, CasePriority, ActivityType } from '../types';
import { AiEnhancedTextarea } from './AiEnhancedTextarea';

// --- Helper Components & Icons ---

const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const colorClasses = {
    [CaseStatus.New]: 'bg-blue-100 text-blue-800',
    [CaseStatus.InProgress]: 'bg-amber-100 text-amber-800',
    [CaseStatus.Resolved]: 'bg-teal-100 text-teal-800',
    [CaseStatus.Closed]: 'bg-slate-200 text-slate-800',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const PriorityBadge: React.FC<{ priority: CasePriority }> = ({ priority }) => {
  const colorClasses = {
    [CasePriority.Low]: 'border-slate-300 text-slate-600',
    [CasePriority.Medium]: 'border-amber-400 text-amber-700',
    [CasePriority.High]: 'border-rose-400 text-rose-700',
  };
   const icon = {
    [CasePriority.Low]: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
    [CasePriority.Medium]: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>,
    [CasePriority.High]: <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  };
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${colorClasses[priority]}`}>
      {icon[priority]} {priority}
    </span>
  );
};

const ActivityTypeIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
    const icons: Record<ActivityType, React.ReactNode> = {
        [ActivityType.Call]: <PhoneIcon />,
        [ActivityType.Email]: <MailIcon />,
        [ActivityType.Meeting]: <UsersIcon />,
        [ActivityType.Note]: <DocumentTextIcon />
    }
    return <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">{icons[type] || <DocumentTextIcon />}</div>
}

// --- Main Component ---

interface CaseDetailProps {
  caseItem: Case;
  client?: Client;
  assignee?: TeamMember;
  activities: Activity[];
  teamMembers: TeamMember[];
  currentUserId: string;
  onBack: () => void;
  onAddComment: (caseId: string, text: string) => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseItem, client, assignee, activities, teamMembers, currentUserId, onBack, onAddComment }) => {
    const [activeTab, setActiveTab] = useState<'activities' | 'comments'>('activities');
    const [newComment, setNewComment] = useState('');

    const getTeamMember = (id: string) => teamMembers.find(tm => tm.id === id);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(caseItem.id, newComment.trim());
            setNewComment('');
        }
    };
    
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    }

    return (
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-violet-600 font-semibold hover:text-violet-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Cases
            </button>

            <header className="mb-6">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h2 className="text-3xl font-bold text-slate-900">{caseItem.title}</h2>
                    <StatusBadge status={caseItem.status} />
                    <PriorityBadge priority={caseItem.priority} />
                </div>
                <p className="text-md text-slate-500">for <span className="font-semibold text-violet-600">{client?.name || 'Unknown Client'}</span></p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Case Description</h3>
                        <p className="text-slate-600 whitespace-pre-wrap">{caseItem.description || 'No description provided.'}</p>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500">Assignee</p>
                                <p className="font-medium text-slate-800">{assignee?.name || 'Unassigned'}</p>
                            </div>
                             <div>
                                <p className="text-slate-500">Client Contact</p>
                                <p className="font-medium text-slate-800">{client?.contactPerson || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Date Created</p>
                                <p className="font-medium text-slate-800">{new Date(caseItem.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Last Updated</p>
                                <p className="font-medium text-slate-800">{new Date(caseItem.lastUpdatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activities & Comments */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex border-b border-slate-200 mb-4">
                        <TabButton active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>Activities ({activities.length})</TabButton>
                        <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')}>Comments ({caseItem.comments?.length || 0})</TabButton>
                    </div>
                    {activeTab === 'activities' && (
                        <div className="space-y-4">
                            {activities.length > 0 ? activities.map(act => (
                                <div key={act.id} className="flex gap-3">
                                    <ActivityTypeIcon type={act.type} />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{act.title}</p>
                                        <p className="text-xs text-slate-500">{new Date(act.activityDate).toLocaleDateString()} by {getTeamMember(act.createdById)?.name}</p>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-4">No activities linked to this case.</p>}
                        </div>
                    )}
                    {activeTab === 'comments' && (
                        <div className="flex flex-col h-full">
                           <div className="flex-grow space-y-4 overflow-y-auto max-h-96 pr-2 -mr-2">
                                {caseItem.comments && caseItem.comments.length > 0 ? [...caseItem.comments].reverse().map(comment => {
                                    const author = getTeamMember(comment.authorId);
                                    return (
                                        <div key={comment.id} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-600 flex-shrink-0">{author?.name.charAt(0)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <p className="font-semibold text-sm">{author?.name}</p>
                                                    <p className="text-xs text-slate-400">{timeAgo(comment.timestamp)}</p>
                                                </div>
                                                <p className="text-sm text-slate-700 bg-slate-100 p-2 rounded-md mt-1">{comment.text}</p>
                                            </div>
                                        </div>
                                    )
                                }) : <p className="text-sm text-slate-500 text-center py-4">No comments yet. Start the conversation!</p>}
                           </div>
                           <form onSubmit={handleCommentSubmit} className="mt-4 border-t border-slate-200 pt-4">
                               <AiEnhancedTextarea
                                   value={newComment}
                                   onValueChange={setNewComment}
                                   placeholder="Add a comment..."
                                   rows={3}
                                   className="w-full p-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                />
                               <button type="submit" className="mt-2 w-full bg-violet-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-violet-700 disabled:bg-violet-300" disabled={!newComment.trim()}>Post Comment</button>
                           </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${active ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
        {children}
    </button>
);


const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;