import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-16 bg-white/30 dark:bg-black/20 backdrop-blur-xl rounded-lg border border-dashed border-white/20 dark:border-white/10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-sky-500/30 text-cyan-700 dark:from-cyan-500/20 dark:to-sky-500/20 dark:text-cyan-300">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      {action && (
        <div className="mt-6">
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center rounded-md bg-gradient-to-b from-cyan-500 to-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:to-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 btn-hover-scale"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};
