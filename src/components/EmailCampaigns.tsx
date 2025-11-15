import React, { useState, useMemo } from 'react';
import type { EmailCampaign, Client } from '../../types';
import { Modal } from './Modal';
import { generateEmailContent, generateSubjectLineVariations } from '../../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type SaveCampaignPayload = Omit<EmailCampaign, 'id' | 'sentDate' | 'stats' | 'status'> & { scheduleDate?: string };

interface EmailCampaignsProps {
  campaigns: EmailCampaign[];
  clients: Client[];
  onSaveCampaign: (campaign: SaveCampaignPayload) => void;
}

const StatCard: React.FC<{ label: string; value: string | number; subtext?: string; }> = ({ label, value, subtext }) => (
  <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    {subtext && <p className="text-xs text-slate-400 dark:text-slate-500">{subtext}</p>}
  </div>
);

const CampaignCard: React.FC<{ campaign: EmailCampaign, onView: () => void }> = ({ campaign, onView }) => {
    const openRate = campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent) * 100 : 0;
    const clickRate = campaign.stats.opened > 0 ? (campaign.stats.clicked / campaign.stats.opened) * 100 : 0;

    const statusStyles = {
        Sent: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300' },
        Scheduled: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-300' },
        Draft: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-300' },
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col group">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{campaign.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[campaign.status].bg} ${statusStyles[campaign.status].text}`}>
                    {campaign.status}
                </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 my-2 h-10">{campaign.subject}</p>
            
            <div className="grid grid-cols-2 gap-4 text-center my-4">
                <Stat label="Open Rate" value={`${openRate.toFixed(1)}%`} />
                <Stat label="Click Rate" value={`${clickRate.toFixed(1)}%`} />
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={onView} className="w-full text-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    View Analytics
                </button>
            </div>
        </div>
    );
};

const CampaignDetailView: React.FC<{ campaign: EmailCampaign; onClose: () => void; }> = ({ campaign, onClose }) => {
    const openRate = campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent) * 100 : 0;
    const clickRate = campaign.stats.sent > 0 ? (campaign.stats.clicked / campaign.stats.sent) * 100 : 0;
    const unsubscribeRate = campaign.stats.sent > 0 ? (campaign.stats.unsubscribes / campaign.stats.sent) * 100 : 0;
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Analytics: ${campaign.name}`}>
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Sent" value={campaign.stats.sent} />
                    <StatCard label="Open Rate" value={`${openRate.toFixed(1)}%`} subtext={`${campaign.stats.opened} opens`} />
                    <StatCard label="Click-through Rate" value={`${clickRate.toFixed(1)}%`} subtext={`${campaign.stats.clicked} clicks`} />
                    <StatCard label="Unsubscribes" value={`${unsubscribeRate.toFixed(1)}%`} subtext={`${campaign.stats.unsubscribes} users`} />
                </div>

                {campaign.performance?.opensOverTime && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Opens Over First 24 Hours</h3>
                        <div className="h-64 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={campaign.performance.opensOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis dataKey="hour" label={{ value: 'Hour After Sending', position: 'insideBottom', offset: -5, fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} name="Opens" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
                 <div className="flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md text-sm font-semibold hover:bg-slate-300">Close</button>
                </div>
            </div>
        </Modal>
    );
};


export const EmailCampaigns: React.FC<EmailCampaignsProps> = ({ campaigns, clients, onSaveCampaign }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState<EmailCampaign | null>(null);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Email Campaigns</h2>
          <p className="text-slate-500 mt-1 dark:text-slate-400">Create, send, and track your email marketing campaigns.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon />
          Create New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} onView={() => setViewingCampaign(campaign)} />
        ))}
      </div>
      
      {campaigns.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-semibold">No campaigns yet.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click "Create New Campaign" to get started.</p>
          </div>
      )}

      <CreateCampaignWizard
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={onSaveCampaign}
        clients={clients}
      />

      {viewingCampaign && <CampaignDetailView campaign={viewingCampaign} onClose={() => setViewingCampaign(null)} />}
    </div>
  );
};

const CreateCampaignWizard: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: SaveCampaignPayload) => void;
  clients: Client[];
}> = ({ isOpen, onClose, onSave, clients }) => {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState<Omit<EmailCampaign, 'id' | 'sentDate' | 'stats' | 'status'>>({
    name: '', recipientSegment: 'All Contacts', subject: '', body: '',
  });
  const [schedule, setSchedule] = useState({ date: '', time: '' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const content = await generateEmailContent(aiPrompt);
    setCampaignData(prev => ({ ...prev, ...content }));
    setIsGenerating(false);
  };

  const handleGenerateSubjects = async () => {
     if (!aiPrompt) return;
    setIsGenerating(true);
    const { subjectA, subjectB } = await generateSubjectLineVariations(aiPrompt);
    setCampaignData(prev => ({ ...prev, subject: subjectA, subjectLineB: subjectB }));
    setIsGenerating(false);
  }

  const handleSaveAndSend = (isScheduled: boolean) => {
    if (campaignData.name && campaignData.subject && campaignData.body) {
        let payload: SaveCampaignPayload = { ...campaignData };
        if (isScheduled && schedule.date) {
            payload.scheduleDate = new Date(`${schedule.date}T${schedule.time || '09:00'}`).toISOString();
        }
        onSave(payload);
        handleClose();
    } else {
        alert("Please complete all fields.");
    }
  };

  const handleClose = () => {
    setStep(1);
    setCampaignData({ name: '', recipientSegment: 'All Contacts', subject: '', body: '' });
    setAiPrompt('');
    setSchedule({ date: '', time: '' });
    onClose();
  }

  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white";
  const labelStyles = "block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Email Campaign">
        <div className="flex items-center justify-center mb-6">
            <Step number={1} label="Setup" active={step >= 1} />
            <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            <Step number={2} label="Compose" active={step >= 2} />
            <div className={`flex-1 h-0.5 ${step > 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            <Step number={3} label="Schedule" active={step >= 3} />
        </div>
        
        {step === 1 && (
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className={labelStyles}>Campaign Name</label>
                    <input type="text" id="name" value={campaignData.name} onChange={e => setCampaignData(p => ({...p, name: e.target.value}))} className={inputStyles} placeholder="e.g., Q4 Fundraising Drive" />
                </div>
                <div>
                    <label htmlFor="recipientSegment" className={labelStyles}>Recipient Segment</label>
                    <select id="recipientSegment" value={campaignData.recipientSegment} onChange={e => setCampaignData(p => ({...p, recipientSegment: e.target.value}))} className={inputStyles}>
                        <option>All Contacts</option> <option>Past Donors</option> <option>Newsletter Subscribers</option>
                    </select>
                </div>
                 <div className="flex justify-end pt-4"><button onClick={() => setStep(2)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700">Next</button></div>
            </div>
        )}
        {step === 2 && (
            <div className="space-y-4">
                <div>
                    <label htmlFor="aiPrompt" className={labelStyles}>Email Goal</label>
                    <textarea id="aiPrompt" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={3} className={inputStyles} placeholder="e.g., an end-of-year fundraising appeal highlighting our work with animal shelters." />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={handleGenerateSubjects} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 bg-slate-500 text-white p-2 rounded-md disabled:bg-slate-300 text-sm"><SparklesIcon/> A/B Subjects</button>
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-2 rounded-md disabled:bg-indigo-300 text-sm"><SparklesIcon/> Generate Content</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="subject" className={labelStyles}>Subject Line A</label>
                    <input type="text" id="subject" value={campaignData.subject} onChange={e => setCampaignData(p => ({...p, subject: e.target.value}))} className={inputStyles} />
                </div>
                {campaignData.subjectLineB && <div><label htmlFor="subjectLineB" className={labelStyles}>Subject Line B (A/B Test)</label><input type="text" id="subjectLineB" value={campaignData.subjectLineB} onChange={e => setCampaignData(p => ({...p, subjectLineB: e.target.value}))} className={inputStyles} /></div>}
                <div>
                    <label htmlFor="body" className={labelStyles}>Body</label>
                    <textarea id="body" value={campaignData.body} onChange={e => setCampaignData(p => ({...p, body: e.target.value}))} rows={6} className={`${inputStyles} font-mono text-xs`} />
                </div>
                 <div>
                    <label className={labelStyles}>Call to Action Button</label>
                    <div className="flex gap-2">
                         <input type="text" value={campaignData.ctaButtonText || ''} onChange={e => setCampaignData(p => ({...p, ctaButtonText: e.target.value}))} placeholder="Button Text" className={inputStyles} />
                         <input type="url" value={campaignData.ctaButtonUrl || ''} onChange={e => setCampaignData(p => ({...p, ctaButtonUrl: e.target.value}))} placeholder="Button URL" className={inputStyles} />
                    </div>
                </div>
                <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md text-sm font-semibold hover:bg-slate-300">Back</button>
                    <button onClick={() => setStep(3)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700">Next</button>
                </div>
            </div>
        )}
        {step === 3 && (
            <div>
                 <div className="space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                    <p><strong>To:</strong> {campaignData.recipientSegment}</p>
                    <p><strong>Subject:</strong> {campaignData.subject}</p>
                    {campaignData.headerImageUrl && <img src={campaignData.headerImageUrl} alt="Header" className="rounded-md max-h-32 w-full object-cover"/>}
                    <div className="border-t pt-2">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Body Preview</p>
                        <p className="text-sm whitespace-pre-wrap">{campaignData.body}</p>
                        {campaignData.ctaButtonText && <div className="mt-4"><span className="inline-block bg-indigo-600 text-white px-4 py-2 text-sm rounded-md">{campaignData.ctaButtonText}</span></div>}
                    </div>
                </div>
                <div className="mt-4">
                    <label className={labelStyles}>Schedule Send</label>
                    <div className="flex gap-2">
                        <input type="date" value={schedule.date} onChange={e => setSchedule(s => ({...s, date: e.target.value}))} className={inputStyles} />
                        <input type="time" value={schedule.time} onChange={e => setSchedule(s => ({...s, time: e.target.value}))} className={inputStyles} />
                    </div>
                </div>
                <div className="flex justify-between pt-6">
                    <button onClick={() => setStep(2)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md text-sm font-semibold hover:bg-slate-300">Back</button>
                    <div className="flex gap-2">
                         <button onClick={() => handleSaveAndSend(true)} disabled={!schedule.date} className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-semibold hover:bg-amber-700 disabled:bg-amber-300">Schedule</button>
                         <button onClick={() => handleSaveAndSend(false)} className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-semibold hover:bg-teal-700">Send Now</button>
                    </div>
                </div>
            </div>
        )}
    </Modal>
  );
};

const Step: React.FC<{number: number, label: string, active: boolean}> = ({ number, label, active }) => (
    <div className="flex flex-col items-center gap-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {number}
        </div>
        <p className={`text-xs ${active ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`}>{label}</p>
    </div>
);

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{value}</p>
  </div>
);

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 7l-2.293-2.293a1 1 0 011.414 0L12 6.414l1.293-1.293a1 1 0 011.414 0zM17 12l-2.293 2.293a1 1 0 01-1.414 0L12 13l-1.293 1.293a1 1 0 01-1.414 0L8 13.414a1 1 0 010-1.414L10.293 10l-2.293-2.293a1 1 0 011.414 0L12 9.414l1.293-1.293a1 1 0 011.414 0L17 10.414a1 1 0 010 1.414L14.707 13l2.293 2.293a1 1 0 010 1.414L15 18l1.293-1.293a1 1 0 011.414 0L20 18.414a1 1 0 010-1.414L17.707 15l2.293-2.293a1 1 0 010-1.414L18 10l-1.293 1.293a1 1 0 01-1.414 0L14 10.414a1 1 0 010-1.414l2.293-2.293a1 1 0 011.414 0L20 9.414a1 1 0 010 1.414L17.707 12z" /></svg>;