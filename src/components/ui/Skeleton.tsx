
import React from 'react';

/**
 * A base skeleton component with a pulse animation.
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-800/50 ${className}`} />
);

/**
 * A skeleton loader specifically for stat cards.
 */
export const CardSkeleton: React.FC = () => (
    <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-lg border border-white/20 shadow-lg">
        <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="mt-4">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/4" />
        </div>
    </div>
);

/**
 * A skeleton loader for lists of items.
 */
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
    <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        ))}
    </div>
);
