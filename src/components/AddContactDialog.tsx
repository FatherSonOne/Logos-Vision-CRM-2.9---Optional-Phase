import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Client } from '../types';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Client, 'id' | 'createdAt'>) => void;
}

export const AddContactDialog: React.FC<AddContactDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(field => typeof field === 'string' && field.trim())) {
      onSave(formData);
      handleClose();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
  };

  const handleClose = () => {
    setFormData({ name: '', contactPerson: '', email: '', phone: '', location: '' });
    onClose();
  }

  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-slate-400";
  const labelStyles = "block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelStyles}>Organization Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Global Health Initiative" required className={inputStyles} autoComplete="organization" />
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactPerson" className={labelStyles}>Contact Person</label>
              <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="e.g., Dr. Emily Carter" required className={inputStyles} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="email" className={labelStyles}>Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., ecarter@ghi.org" required className={inputStyles} autoComplete="email" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="phone" className={labelStyles}>Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., 555-0101" required className={inputStyles} autoComplete="tel" />
            </div>
            <div>
                <label htmlFor="location" className={labelStyles}>Location</label>
                <LocationAutocompleteInput id="location" name="location" value={formData.location} onChange={handleLocationChange} placeholder="e.g., New York, NY" required className={inputStyles} />
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-md text-sm font-semibold hover:from-teal-700 hover:to-cyan-700">Add Contact</button>
        </div>
      </form>
    </Modal>
  );
};
