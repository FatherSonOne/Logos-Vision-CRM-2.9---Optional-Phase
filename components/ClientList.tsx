import React from 'react';
import type { Client } from '../types';
import { MailIcon, PhoneIcon, LocationMarkerIcon, PlusIcon } from './icons';
import { ExportButton, type ExportField } from './export/ExportButton';

interface ClientListProps {
  clients: Client[];
  onAddOrganization: () => void;
  onSelectOrganization: (id: string) => void;
}

const OrganizationCard: React.FC<{ client: Client, onSelectOrganization: (id: string) => void }> = ({ client, onSelectOrganization }) => (
    <button 
        onClick={() => onSelectOrganization(client.id)}
        className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-lg flex flex-col hover:border-white/40 transition-colors duration-300 text-left w-full h-full text-shadow-strong"
    >
        <h3 className="text-lg font-bold text-slate-900 truncate w-full dark:text-slate-100">{client.name}</h3>
        <p className="text-sm text-teal-600 font-medium mb-3 dark:text-teal-400">{client.contactPerson}</p>
        <div className="space-y-2 text-sm text-slate-700 flex-grow dark:text-slate-300">
            <div className="flex items-center gap-2">
                <MailIcon />
                <a href={`mailto:${client.email}`} onClick={e => e.stopPropagation()} className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 truncate">{client.email}</a>
            </div>
            <div className="flex items-center gap-2">
                <PhoneIcon />
                <span>{client.phone}</span>
            </div>
             <div className="flex items-center gap-2">
                <LocationMarkerIcon />
                <span>{client.location}</span>
            </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 dark:text-slate-500">Added: {new Date(client.createdAt).toLocaleDateString()}</p>
    </button>
);

const AddOrganizationCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border-2 border-dashed border-white/30 text-center flex flex-col items-center justify-center hover:border-teal-500 hover:text-teal-600 transition-colors duration-200 text-slate-500 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-300 h-full text-shadow-strong"
    >
        <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center mb-4 dark:bg-black/20">
            <PlusIcon />
        </div>
        <h3 className="text-lg font-bold">Add Organization</h3>
    </button>
);

export const ClientList: React.FC<ClientListProps> = ({ clients, onAddOrganization, onSelectOrganization }) => {
  const exportFields: ExportField[] = [
    { key: 'name', label: 'Client Name' },
    { key: 'type', label: 'Type' },
    { key: 'email', label: 'Email' },
    { 
      key: 'createdAt', 
      label: 'Created',
      format: (date) => new Date(date).toLocaleDateString()
    },
  ];

  return (
    <div className="text-shadow-strong">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Organizations</h2>
        <ExportButton
          data={clients}
          fields={exportFields}
          filename="clients"
          label="Export Clients"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clients.map((client, index) => (
          <div key={client.id} className="fade-in h-full" style={{ animationDelay: `${index * 50}ms` }}>
            <OrganizationCard client={client} onSelectOrganization={onSelectOrganization} />
          </div>
        ))}
        <div className="fade-in h-full" style={{ animationDelay: `${clients.length * 50}ms` }}>
            <AddOrganizationCard onClick={onAddOrganization} />
        </div>
      </div>
    </div>
  );
};
