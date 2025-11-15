import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface GlobalSearchProps {
  onSearch: (query: string, includeWeb: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [includeWeb, setIncludeWeb] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), includeWeb);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search CRM or find new leads on the web..."
                aria-label="Global search"
                className="w-full pl-10 pr-4 py-2 bg-white/20 dark:bg-slate-900/40 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow shadow-md"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
        </div>
        <div className="mt-2 flex justify-center">
            <label htmlFor="web-search-toggle" className="flex items-center cursor-pointer group">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="web-search-toggle"
                        className="sr-only peer"
                        checked={includeWeb}
                        onChange={(e) => setIncludeWeb(e.target.checked)}
                    />
                    <div className="w-10 h-6 bg-slate-300 rounded-full peer-checked:bg-teal-500 transition-colors dark:bg-slate-700"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="ml-3 text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 text-shadow-strong">
                    Include web search for new leads
                </span>
            </label>
        </div>
    </form>
  );
};
