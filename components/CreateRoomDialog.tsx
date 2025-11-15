

import React, { useState } from 'react';
import { Modal } from './Modal';

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomName: string) => void;
}

export const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onSave(roomName.trim());
      setRoomName('');
    }
  };

  const inputStyles = "w-full p-2 bg-slate-100 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:placeholder-slate-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Channel">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Channel Name</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="#e-g-project-kickoff"
            required
            className={inputStyles}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-md text-sm font-semibold hover:from-teal-700 hover:to-cyan-700">Create Channel</button>
        </div>
      </form>
    </Modal>
  );
};