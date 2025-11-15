import React, { useState, useEffect } from 'react';
import type { Case, Client, TeamMember } from '../types';
import { CaseStatus, CasePriority } from '../types';
import { Modal } from './Modal';
import { AiEnhancedTextarea } from './AiEnhancedTextarea';

interface CaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseData: Omit<Case, 'createdAt' | 'lastUpdatedAt'> & { id?: string }) => void;
  clients: Client[];
  teamMembers: TeamMember[];
  caseToEdit?: Case | null;
}

const initialFormData = {
    title: "",
    description: "",
    clientId: "",
    assignedToId: "",
    status: CaseStatus.New,
    priority: CasePriority.Medium,
};

export const CaseDialog: React.FC<CaseDialogProps> = ({ isOpen, onClose, onSave, clients, teamMembers, caseToEdit }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (caseToEdit) {
        setFormData({
            title: caseToEdit.title,
            description: caseToEdit.description,
            clientId: caseToEdit.clientId,
            assignedToId: caseToEdit.assignedToId,
            status: caseToEdit.status,
            priority: caseToEdit.priority,
        });
      } else {
        setFormData({ ...initialFormData, clientId: clients[0]?.id || '', assignedToId: teamMembers[0]?.id || '' });
      }
    }
  }, [isOpen, caseToEdit, clients, teamMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.clientId || !formData.assignedToId) {
        alert("Please fill in all required fields.");
        return;
    }
    onSave({
        ...formData,
        id: caseToEdit?.id,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-slate-900 placeholder-slate-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={caseToEdit ? "Edit Case" : "Create New Case"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputStyles} />
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <AiEnhancedTextarea
                id="description"
                name="description"
                value={formData.description}
                onValueChange={(value) => handleTextareaChange('description', value)}
                rows={4}
                className={inputStyles}
            />
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
                <select id="clientId" name="clientId" value={formData.clientId} onChange={handleChange} required className={inputStyles} disabled={!!caseToEdit}>
                    {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="assignedToId" className="block text-sm font-medium text-slate-700 mb-1">Assignee *</label>
                <select id="assignedToId" name="assignedToId" value={formData.assignedToId} onChange={handleChange} required className={inputStyles}>
                    {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                    {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputStyles}>
                    {Object.values(CasePriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-violet-700">Save Case</button>
        </div>
      </form>
    </Modal>
  );
};