import React, { useState } from 'react';
import { Modal } from './Modal';
import type { TeamMember } from '../types';

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id'>) => void;
}

export const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && role.trim()) {
      onSave({ name, email, role });
      setName('');
      setEmail('');
      setRole('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setRole('');
    onClose();
  }

  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-slate-400";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Jane Doe"
            required
            className={inputStyles}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., jane.doe@example.com"
            required
            className={inputStyles}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Role</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Project Manager"
            required
            className={inputStyles}
            autoComplete="organization-title"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-md text-sm font-semibold hover:from-teal-700 hover:to-cyan-700">Add Member</button>
        </div>
      </form>
    </Modal>
  );
};