import React, { useMemo } from 'react';
import type { Donation, Client } from '../types';
import { DollarSignIcon, UsersIcon, TrendingUpIcon } from './icons';

interface DonationsProps {
  donations: Donation[];
  clients: Client[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-lg border border-white/20 shadow-lg flex flex-col justify-between text-shadow-strong">
    <div className="flex justify-between items-start">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      <div className={`${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{value}</p>
    </div>
  </div>
);

export const Donations: React.FC<DonationsProps> = ({ donations, clients }) => {
    
    const sortedDonations = useMemo(() => {
        return [...donations].sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime());
    }, [donations]);

    const stats = useMemo(() => {
        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
        const donationCount = donations.length;
        const averageDonation = donationCount > 0 ? totalAmount / donationCount : 0;
        return { totalAmount, donationCount, averageDonation };
    }, [donations]);
    
    const currencyFormatter = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const getClientName = (clientId: string | null | undefined) => {
      if (!clientId) return <span className="text-slate-400 italic">Individual</span>;
      return clients.find(c => c.id === clientId)?.name || <span className="text-slate-400 italic">Unknown</span>;
    };

    return (
        <div className="space-y-8 text-shadow-strong">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Donations</h2>
                <p className="text-slate-600 mt-1 dark:text-slate-300">Track and manage all contributions to your causes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Donations" 
                    value={currencyFormatter.format(stats.totalAmount)} 
                    icon={<DollarSignIcon />} 
                    color="text-teal-600 dark:text-teal-400" 
                />
                <StatCard 
                    title="Number of Donations" 
                    value={stats.donationCount.toString()} 
                    icon={<UsersIcon />} 
                    color="text-teal-600 dark:text-teal-400"
                />
                <StatCard 
                    title="Average Donation" 
                    value={currencyFormatter.format(stats.averageDonation)} 
                    icon={<TrendingUpIcon />} 
                    color="text-teal-600 dark:text-teal-400"
                />
            </div>

             <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden">
                <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/20 dark:bg-black/10">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Donor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Organization</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Campaign</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                    {sortedDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-white/20 dark:hover:bg-black/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{donation.donorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{getClientName(donation.clientId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{donation.campaign}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{new Date(donation.donationDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-teal-600 dark:text-teal-400">{currencyFormatter.format(donation.amount)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
};
