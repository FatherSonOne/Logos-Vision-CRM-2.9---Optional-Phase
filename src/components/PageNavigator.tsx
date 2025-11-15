import React from 'react';
import type { Page } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface PageNavigatorProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    pageOrder: Page[];
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({ currentPage, onNavigate, pageOrder }) => {
    const currentIndex = pageOrder.indexOf(currentPage);

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + pageOrder.length) % pageOrder.length;
        onNavigate(pageOrder[prevIndex]);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % pageOrder.length;
        onNavigate(pageOrder[nextIndex]);
    };

    const buttonStyle = "p-2 rounded-full text-slate-700 dark:text-slate-200 bg-gradient-to-b from-white/50 to-white/20 dark:from-white/20 dark:to-transparent border border-white/30 dark:border-white/10 shadow-md hover:shadow-lg transition-shadow";

    return (
        <div className="flex items-center gap-2">
            <button 
                onClick={handlePrev} 
                className={buttonStyle}
                aria-label="Previous Page"
            >
                <ChevronLeftIcon />
            </button>
            <span className="text-sm font-semibold text-slate-800 w-32 text-center capitalize dark:text-white text-shadow-strong">
                {currentPage.replace('-', ' ')}
            </span>
             <button 
                onClick={handleNext} 
                className={buttonStyle}
                aria-label="Next Page"
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
};