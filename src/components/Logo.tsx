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
          