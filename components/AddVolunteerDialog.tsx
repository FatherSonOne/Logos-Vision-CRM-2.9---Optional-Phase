import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Volunteer, Client, Project } from '../types';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

interface AddVolunteerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (volunteer: Omit<Volunteer, 'id'>) => void;
  clients: Client[];
  projects: Project[];
}

const initialFormData = {
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    availability: '',
    assignedProjectIds: [],
    assignedClientIds: [],
};

export const AddVolunteerDialog: React.FC<AddVolunteerDialogProps> = ({ isOpen, onClose, onSave, clients, projects }) => {
  const [formData, setFormData] = useState<Omit<Volunteer, 'id' | 'skills'> & { skills: string }>(initialFormData as any);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(field => typeof field === 'string' && !field.trim())) {
        alert("Please fill out all required fields.");
        return;
    }
    onSave({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    handleClose();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({...prev, location: value}));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: 'assignedProjectIds' | 'assignedClientIds') => {
    const options = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setFormData(prev => ({ ...prev, [field]: options }));
  };

  const handleClose = () => {
    setFormData(initialFormData as any);
    onClose();
  }

  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400";
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Volunteer">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputStyles} autoComplete="name" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputStyles} autoComplete="email" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputStyles} autoComplete="tel" />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <LocationAutocompleteInput name="location" value={formData.location} onChange={handleLocationChange} required className={inputStyles} />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className={inputStyles} />
        </div>
         <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Availability *</label>
            <input type="text" name="availability" value={formData.availability} onChange={handleChange} required className={inputStyles} placeholder="e.g., Weekends, Mon/Wed evenings" />
        </div>
        
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Projects</label>
                <select multiple name="assignedProjectIds" value={formData.assignedProjectIds} onChange={(e) => handleMultiSelectChange(e, 'assignedProjectIds')} className={`${inputStyles} h-24`}>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Clients</label>
                <select multiple name="assignedClientIds" value={formData.assignedClientIds} onChange={(e) => handleMultiSelectChange(e, 'assignedClientIds')} className={`${inputStyles} h-24`}>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-violet-700">Add Volunteer</button>
        </div>
      </form>
    </Modal>
  );
};