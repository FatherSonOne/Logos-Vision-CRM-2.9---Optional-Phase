
import React, { useMemo } from 'react';
import type { Client, Donation } from '../types';

interface CharityTrackerProps {
    clients: Client[];
    donations: Donation[];
}

const currencyFormatter = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const ClientProgressTile: React.FC<{ client: Client, donations: Donation[] }> = ({ client, donations }) => {
    const fundraisingGoal = 10000; // Mock goal for demonstration

    const clientStats = useMemo(() => {
        const clientDonations = donations.filter(d => d.clientId === client.id);
        const totalAmount = clientDonations.reduce((sum, d) => sum + d.amount, 0);
        const donorCount = new Set(clientDonations.map(d => d.donorName)).size;
        const progress = Math.min((totalAmount / fundraisingGoal) * 100, 100);
        const recentDonations = clientDonations
            .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
            .slice(0, 3);
        
        return { totalAmount, donorCount, progress, recentDonations };
    }, [client, donations, fundraisingGoal]);

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col hover:border-indigo-400 transition-colors duration-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-indigo-600">
            <h3 className="text-lg font-bold text-slate-900 truncate dark:text-slate-100">{client.name}</h3>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 my-4">{currencyFormatter.format(clientStats.totalAmount)}</p>
            
            <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress to Goal ({currencyFormatter.format(fundraisingGoal)})</span>
                    <span>{Math.round(clientStats.progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                    <div 
                        className="bg-indigo-500 h-2.5 rounded-full" 
                        style={{ width: `${clientStats.progress}%` }}
                    ></div>
                </div>
            </div>
            
            <p className="text-sm text-slate-500 mt-1 mb-4">{clientStats.donorCount} unique donor{clientStats.donorCount !== 1 ? 's' : ''}</p>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-auto">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 dark:text-slate-400">Recent Donations</h4>
                <ul className="space-y-2">
                    {clientStats.recentDonations.length > 0 ? clientStats.recentDonations.map(d => (
                        <li key={d.id} className="flex justify-between text-sm">
                            <span className="text-slate-700 truncate dark:text-slate-300">{d.donorName}</span>
                            <span className="font-mono text-slate-500">{currencyFormatter.format(d.amount)}</span>
                        </li>
                    )) : (
                        <p className="text-sm text-slate-400 italic">No donations yet.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};


export const CharityTracker: React.FC<CharityTrackerProps> = ({ clients, donations }) => {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Charity Fundraising Tracker</h2>
                <p className="text-slate-500 mt-1 dark:text-slate-400">Monitor the fundraising progress for each partner organization.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <ClientProgressTile key={client.id} client={client} donations={donations} />
                ))}
            </div>
        </div>
    );
};
