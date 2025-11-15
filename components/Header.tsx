import React from 'react';
import { GlobalSearch } from './GlobalSearch';
import type { Page } from '../types';
import { MoonIcon, SunIcon, QuestionMarkCircleIcon } from './icons';

interface HeaderProps {
    onSearch: (query: string, includeWeb: boolean) => void;
    isSearching: boolean;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    openTabs: Page[];
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onCloseTab: (page: Page, e: React.MouseEvent) => void;
    onStartTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onSearch, 
    isSearching, 
    theme, 
    onToggleTheme, 
    openTabs, 
    currentPage, 
    onNavigate, 
    onCloseTab,
    onStartTour
}) => {
    return (
        <header className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-4 pt-4 flex flex-col z-10 flex-shrink-0">
            {/* Top row for search and theme toggle */}
            <div className="flex items-start justify-between w-full">
                <div className="flex-1 flex-shrink-0">
                    {/* Left Spacer */}
                </div>
                <div className="px-4">
                    <div className="relative w-full max-w-sm">
                        <GlobalSearch onSearch={onSearch} />
                        {isSearching && (
                            <div className="absolute right-3 top-2.5">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 flex justify-end items-center gap-2">
                    <button
                        onClick={onStartTour}
                        className="p-2 rounded-full text-slate-700 dark:text-slate-200 bg-gradient-to-b from-white/50 to-white/20 dark:from-white/20 dark:to-transparent border border-white/30 dark:border-white/10 shadow-md hover:shadow-lg transition-shadow"
                        aria-label="Start guided tour"
                    >
                        <QuestionMarkCircleIcon />
                    </button>
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-full text-slate-700 dark:text-slate-200 bg-gradient-to-b from-white/50 to-white/20 dark:from-white/20 dark:to-transparent border border-white/30 dark:border-white/10 shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-900 btn-hover-scale"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </div>
            
            {/* Bottom row for tabs */}
            <div className="w-full overflow-x-auto scrollbar-hide mt-3">
                <div role="tablist" aria-label="Open pages" className="flex items-end border-b-2 border-white/20 dark:border-white/10">
                    {openTabs.map((page, index) => {
                        const isActive = page === currentPage;
                        return (
                            <div
                                key={page}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`panel-${page}`}
                                id={`tab-${page}`}
                                onClick={() => onNavigate(page)}
                                className={`fade-in flex items-center h-10 px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer group transition-all duration-200 border-b-2 shrink-0
                                    ${isActive
                                        ? 'bg-white/30 dark:bg-slate-800/50 text-slate-900 dark:text-white border-cyan-500 shadow-inner'
                                        : 'bg-transparent text-slate-700 dark:text-slate-300 border-transparent hover:bg-white/20 dark:hover:bg-black/30'
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className="capitalize whitespace-nowrap text-shadow-strong">{page.replace('-', ' ')}</span>
                                {openTabs.length > 1 && (
                                    <button
                                        onClick={(e) => onCloseTab(page, e)}
                                        className="ml-3 -mr-1 p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white"
                                        aria-label={`Close ${page} tab`}
                                    >
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};
