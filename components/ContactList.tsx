import React, { useState, useMemo } from 'react';
import type { Client } from '../types';
import { ContactsMap } from './ContactsMap';
import { findNearbyPlaces } from '../services/geminiService';
import { Modal } from './Modal';
import { PlusIcon, MailIcon, PhoneIcon, LocationMarkerIcon, SearchLocationIcon } from './icons';
import { ExportButton, type ExportField } from './export/ExportButton';

interface ContactListProps {
  clients: Client[];
  onAddContact: () => void;
}

const ContactCard: React.FC<{ 
    client: Client;
    isSelected: boolean;
    onSelect: (id: string) => void;
}> = ({ client, isSelected, onSelect }) => {
    const cardClasses = `bg-white/30 dark:bg-black/20 backdrop-blur-xl p-6 rounded-lg border flex flex-col transition-all duration-300 cursor-pointer hover:border-white/40 text-shadow-strong ${isSelected ? 'border-teal-400 shadow-lg scale-105' : 'border-white/20'}`;
    
    return (
        <div 
            className={cardClasses}
            onClick={() => onSelect(client.id)}
        >
            <h3 className="text-lg font-bold text-slate-900 truncate w-full dark:text-slate-100">{client.name}</h3>
            <p className="text-sm text-teal-600 font-medium mb-3 dark:text-teal-400">{client.contactPerson}</p>
            <div className="space-y-2 text-sm text-slate-700 flex-grow dark:text-slate-300">
                <div className="flex items-center gap-2">
                    <MailIcon />
                    <a href={`mailto:${client.email}`} className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 truncate">{client.email}</a>
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
        </div>
    );
};

const AddContactCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white/30 dark:bg-black/20 backdrop-blur-xl p-6 rounded-lg border-2 border-dashed border-white/30 text-center flex flex-col items-center justify-center hover:border-teal-500 hover:text-teal-600 transition-colors duration-200 text-slate-500 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-300"
    >
        <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center mb-4 dark:bg-black/20">
            <PlusIcon />
        </div>
        <h3 className="text-lg font-bold">Add Contact</h3>
    </button>
);


export const ContactList: React.FC<ContactListProps> = ({ clients, onAddContact }) => {
    const [sortBy, setSortBy] = useState('alphabetical');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isFinderOpen, setIsFinderOpen] = useState(false);
    const [finderQuery, setFinderQuery] = useState('non-profit organizations');
    const [finderResult, setFinderResult] = useState<{ text: string, sources: any[] } | null>(null);
    const [isFinding, setIsFinding] = useState(false);

    const handleSelectClient = (clientId: string) => {
        // Toggle selection
        setSelectedClientId(prevId => (prevId === clientId ? null : clientId));
    };

    const handleFindNearby = () => {
        setIsFinding(true);
        setFinderResult(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const result = await findNearbyPlaces(latitude, longitude, finderQuery);
                setFinderResult(result);
                setIsFinding(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setFinderResult({ text: `Could not get your location: ${error.message}`, sources: [] });
                setIsFinding(false);
            }
        );
    };


    const sortedClients = useMemo(() => {
        const sorted = [...clients];
        switch (sortBy) {
            case 'date-newest':
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'date-oldest':
                return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case 'location':
                return sorted.sort((a, b) => a.location.localeCompare(b.location));
            case 'alphabetical':
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
    }, [clients, sortBy]);

    const exportFields: ExportField[] = [
      { key: 'name', label: 'Organization Name' },
      { key: 'contactPerson', label: 'Contact Person' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'location', label: 'Location' },
      {
        key: 'createdAt',
        label: 'Date Added',
        format: (date) => new Date(date).toLocaleDateString()
      },
    ];

  return (
    <div className="space-y-8 text-shadow-strong">
      <Modal isOpen={isFinderOpen} onClose={() => setIsFinderOpen(false)} title="Find Nearby Places">
          <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">Find potential partners or resources near your current location using Google Maps.</p>
              <div>
                <label htmlFor="finder-query" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Search for:</label>
                <input
                    id="finder-query"
                    type="text"
                    value={finderQuery}
                    onChange={(e) => setFinderQuery(e.target.value)}
                    className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md dark:bg-slate-700/50 dark:border-slate-600 dark:text-white"
                />
              </div>
              <button onClick={handleFindNearby} disabled={isFinding} className="w-full flex justify-center items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-teal-700 disabled:bg-teal-300">
                  {isFinding ? 'Searching...' : 'Find Places'}
              </button>
              {finderResult && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-md max-h-64 overflow-y-auto dark:bg-slate-700/50">
                      <p className="whitespace-pre-wrap dark:text-slate-200">{finderResult.text}</p>
                      {finderResult.sources.length > 0 && (
                          <div className="mt-4 pt-2 border-t dark:border-slate-600">
                              <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sources:</h4>
                              <ul className="text-xs mt-1 space-y-1">
                                  {finderResult.sources.map((source, index) => source.maps && (
                                      <li key={index}>
                                          <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline dark:text-teal-400">
                                              {source.maps.title}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              )}
          </div>
      </Modal>

      <ContactsMap 
        clients={clients} 
        selectedClientId={selectedClientId}
        onSelect={handleSelectClient}
      />
      
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Contacts</h2>
            <div className="flex items-center gap-2">
                 <ExportButton
                    data={sortedClients}
                    fields={exportFields}
                    filename="contacts"
                    label="Export Contacts"
                  />
                 <button onClick={() => setIsFinderOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-white/30 hover:bg-white/50 text-slate-700 dark:bg-black/20 dark:border-white/20 dark:text-slate-200 dark:hover:bg-black/30">
                    <SearchLocationIcon />
                    Find Nearby
                </button>
                <select
                id="sort-contacts"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/50 dark:bg-black/30 border border-white/30 dark:border-white/20 rounded-md px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-teal-500 focus:border-teal-500"
                >
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="date-newest">Date Added (Newest)</option>
                <option value="date-oldest">Date Added (Oldest)</option>
                <option value="location">Location (A-Z)</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedClients.map((client) => (
            <ContactCard 
                key={client.id} 
                client={client}
                isSelected={client.id === selectedClientId}
                onSelect={handleSelectClient}
            />
            ))}
            <AddContactCard onClick={onAddContact} />
        </div>
      </div>
    </div>
  );
};