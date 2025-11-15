import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-cyan-500 dark:text-cyan-400">
        <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <line x1="12" y1="6.5" x2="12" y2="3.5" />
          <line x1="16.95" y1="7.05" x2="18.5" y2="5.5" />
          <line x1="17.5" y1="12" x2="20.5" y2="12" />
          <line x1="16.95" y1="16.95" x2="18.5" y2="18.5" />
          <line x1="12" y1="17.5" x2="12" y2="20.5" />
          <line x1="7.05" y1="16.95" x2="5.5" y2="18.5" />
          <line x1="6.5" y1="12" x2="3.5" y2="12" />
          <line x1="7.05" y1="7.05" x2="5.5" y2="5.5" />
        </g>
        <g fill="currentColor">
          <circle cx="12" cy="2" r="1.3" />
          <circle cx="19.5" cy="4.5" r="1.3" />
          <circle cx="22" cy="12" r="1.3" />
          <circle cx="19.5" cy="19.5" r="1.3" />
          <circle cx="12" cy="22" r="1.3" />
          <circle cx="4.5" cy="19.5" r="1.3" />
          <circle cx="2" cy="12" r="1.3" />
          <circle cx="4.5" cy="4.5" r="1.3" />
          <path fillRule="evenodd" d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-3 4a1 1 0 011-1h4a1 1 0 011 1v-1.5a2.5 2.5 0 00-5 0V16z" />
        </g>
      </svg>
      <span className="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline text-shadow-strong">
        Logos Vision
      </span>
    </div>
  );
};
