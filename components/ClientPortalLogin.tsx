
import React from 'react';
import type { Client } from '../types';

interface ClientPortalLoginProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
}

export const ClientPortalLogin: React.FC<ClientPortalLoginProps> = ({ clients, onSelectClient }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Client Portal Access</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Select a client to simulate their portal view.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <button 
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 text-left hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-200 group shadow-sm hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400">{client.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{client.contactPerson}</p>
             <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-4 flex items-center">
                <span>View Portal</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};
