

import React, { useState, useEffect } from 'react';
import type { Activity, Client, Project } from '../types';
import { ActivityType, ActivityStatus } from '../types';
import { Modal } from './Modal';
import { AiEnhancedTextarea } from './AiEnhancedTextarea';

interface ActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'createdById'> & { id?: string }) => void;
  clients: Client[];
  projects: Project[];
  activityToEdit?: Activity | null;
}

const initialFormData = {
    type: ActivityType.Call,
    title: "",
    clientId: "",
    projectId: "",
    activityDate: new Date().toISOString().split('T')[0],
    activityTime: "",
    status: ActivityStatus.Completed,
    notes: "",
    sharedWithClient: false,
};

export const ActivityDialog: React.FC<ActivityDialogProps> = ({ isOpen, onClose, onSave, clients, projects, activityToEdit }) => {
  const [formData, setFormData] = useState<Omit<Activity, 'id' | 'createdById' | 'activityDate'> & { activityDate: string; }>(initialFormData as any);
  
  useEffect(() => {
    if (isOpen) {
      if (activityToEdit) {
        setFormData({
          ...activityToEdit,
          clientId: activityToEdit.clientId || "",
          projectId: activityToEdit.projectId || "",
          activityTime: activityToEdit.activityTime || "",
          notes: activityToEdit.notes || "",
        });
      } else {
        setFormData(initialFormData as any);
      }
    }
  }, [isOpen, activityToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
        alert("Title is required.");
        return;
    }
    onSave({
        ...formData,
        clientId: formData.clientId || null,
        projectId: formData.projectId || null,
        id: activityToEdit?.id,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({
        ...prev, 
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleTextareaChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-slate-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activityToEdit ? "Edit Activity" : "Log New Activity"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Activity Type *</label>
                <select id="type" name="type" value={formData.type} onChange={(e) => handleSelectChange('type', e.target.value)} className={inputStyles}>
                    {Object.values(ActivityType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Status *</label>
                <select id="status" name="status" value={formData.status} onChange={(e) => handleSelectChange('status', e.target.value)} className={inputStyles}>
                    {Object.values(ActivityStatus).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputStyles} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Related Client</label>
                <select id="clientId" name="clientId" value={formData.clientId || ''} onChange={handleChange} className={inputStyles}>
                    <option value="">None</option>
                    {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Related Project</label>
                <select id="projectId" name="projectId" value={formData.projectId || ''} onChange={handleChange} className={inputStyles}>
                    <option value="">None</option>
                    {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="activityDate" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Date</label>
                <input type="date" id="activityDate" name="activityDate" value={formData.activityDate} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
                <label htmlFor="activityTime" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Time</label>
                <input type="time" id="activityTime" name="activityTime" value={formData.activityTime || ''} onChange={handleChange} className={inputStyles} />
            </div>
        </div>

        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Notes</label>
            <AiEnhancedTextarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onValueChange={(value) => handleTextareaChange('notes', value)}
                rows={4}
                className={inputStyles}
            />
        </div>

        <div className="flex items-center">
            <input
                id="sharedWithClient"
                name="sharedWithClient"
                type="checkbox"
                checked={formData.sharedWithClient || false}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:bg-slate-700 dark:border-slate-600"
            />
            <label htmlFor="sharedWithClient" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">
                Share this activity with the client portal
            </label>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-md text-sm font-semibold hover:from-teal-700 hover:to-cyan-700">Save Activity</button>
        </div>
      </form>
    </Modal>
  );
};