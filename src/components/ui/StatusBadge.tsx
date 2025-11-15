import React from 'react';

type BadgeVariant = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

const variantClasses: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
};

export const StatusBadge: React.FC<{ label: string, variant: BadgeVariant, }> = ({ label, variant }) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${variantClasses[variant]}`}>
    {label}
  </span>
);