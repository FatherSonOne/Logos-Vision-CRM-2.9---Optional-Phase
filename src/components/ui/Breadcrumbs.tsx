import React from 'react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const ChevronRightIcon: React.FC = () => (
  <svg className="h-5 w-5 flex-shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 text-shadow-strong">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label}>
              <div className="flex items-center">
                {index > 0 && <ChevronRightIcon />}
                <button
                  onClick={item.onClick}
                  disabled={!item.onClick}
                  className={`
                    ${index > 0 ? 'ml-2' : ''}
                    text-sm font-medium
                    ${isLast || !item.onClick 
                      ? 'text-slate-500 dark:text-slate-400 cursor-default' 
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}
                  `}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
