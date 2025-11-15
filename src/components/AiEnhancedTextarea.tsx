import React, { useState, useRef, useEffect } from 'react';
import { processTextWithAction } from '../services/geminiService';

type AiAction = 'improve' | 'summarize' | 'clarify';

interface AiEnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    onValueChange: (value: string) => void;
}

export const AiEnhancedTextarea: React.FC<AiEnhancedTextareaProps> = ({ onValueChange, ...rest }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = async (action: AiAction) => {
        setIsMenuOpen(false);
        setIsLoading(true);
        const result = await processTextWithAction(rest.value as string, action);
        onValueChange(result);
        setIsLoading(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <textarea {...rest} onChange={(e) => onValueChange(e.target.value)} />
            <div className="absolute top-2 right-2">
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="p-1.5 bg-white/50 dark:bg-slate-900/50 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="AI Text Tools"
                >
                    {isLoading 
                        ? <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                        : <SparklesIcon />
                    }
                </button>
                {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                        <ul className="py-1">
                            <MenuItem onClick={() => handleAction('improve')}>Improve Writing</MenuItem>
                            <MenuItem onClick={() => handleAction('summarize')}>Summarize</MenuItem>
                            <MenuItem onClick={() => handleAction('clarify')}>Check for Clarity</MenuItem>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 7l-2.293-2.293a1 1 0 011.414 0L12 6.414l1.293-1.293a1 1 0 011.414 0zM17 12l-2.293 2.293a1 1 0 01-1.414 0L12 13l-1.293 1.293a1 1 0 01-1.414 0L8 13.414a1 1 0 010-1.414L10.293 10l-2.293-2.293a1 1 0 011.414 0L12 9.414l1.293-1.293a1 1 0 011.414 0L17 10.414a1 1 0 010 1.414L14.707 13l2.293 2.293a1 1 0 010 1.414L15 18l1.293-1.293a1 1 0 011.414 0L20 18.414a1 1 0 010-1.414L17.707 15l2.293-2.293a1 1 0 010-1.414L18 10l-1.293 1.293a1 1 0 01-1.414 0L14 10.414a1 1 0 010-1.414l2.293-2.293a1 1 0 011.414 0L20 9.414a1 1 0 010 1.414L17.707 12z" />
    </svg>
);

const MenuItem: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <li>
        <button
            onClick={onClick}
            className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
            {children}
        </button>
    </li>
);