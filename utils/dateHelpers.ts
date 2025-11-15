
export const getDeadlineStatus = (dueDate: string, isCompleted: boolean = false) => {
    if (isCompleted) {
        return {
            text: 'Completed',
            status: 'completed' as const,
            color: 'text-teal-600 dark:text-teal-400',
        };
    }
    
    const now = new Date();
    const deadline = new Date(dueDate);
    
    now.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'overdue' | 'soon' | 'safe' = 'safe';
    let text = `${diffDays} days left`;
    
    if (diffDays < 0) {
        status = 'overdue';
        text = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
        text = 'Due today';
        status = 'soon';
    } else if (diffDays <= 7) {
        status = 'soon';
        text = `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    }
    
    const colorClasses = {
        overdue: 'text-red-600 dark:text-red-500',
        soon: 'text-amber-600 dark:text-amber-400',
        safe: 'text-slate-500 dark:text-slate-400',
    };

    return {
        text,
        status,
        color: colorClasses[status],
    };
};
