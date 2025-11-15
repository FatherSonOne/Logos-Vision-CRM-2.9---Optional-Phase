import React from 'react';
import { Logo } from './Logo';
import type { Page } from '../types';
import { mainNav, navigationSections } from './navigationConfig';

interface NavItemProps {
  pageId: Page;
  label: string;
  icon: React.ReactNode;
  currentPage: string;
  onNavigate: (page: Page) => void;
  hasNotification: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ pageId, label, icon, currentPage, onNavigate, hasNotification }) => (
    <li>
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onNavigate(pageId);
            }}
            className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 group text-shadow-strong ${
                currentPage === pageId 
                ? 'font-semibold bg-white/30 dark:bg-white/20 text-slate-900 dark:text-white shadow-inner' 
                : 'text-slate-800 hover:bg-white/20 dark:text-slate-100 dark:hover:bg-white/10'
            }`}
        >
            {currentPage === pageId && (
                <span className="absolute inset-y-0 left-0 w-1 bg-cyan-500 rounded-r-full transition-all duration-300" aria-hidden="true"></span>
            )}
            <span className="flex items-center transition-transform duration-200 ease-in-out group-hover:translate-x-1">
                <span className="mr-3 w-5 h-5 flex items-center justify-center">{icon}</span>
                {label}
            </span>
            {hasNotification && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" aria-label="New notification"></span>
            )}
        </a>
    </li>
);

const NavSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="mt-4">
        <h3 className="px-3 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300 text-shadow-strong">{title}</h3>
        <ul className="space-y-1">
            {children}
        </ul>
    </div>
)

export const Sidebar: React.FC<{ currentPage: string; onNavigate: (page: Page) => void; notifications: Set<Page>; }> = ({ currentPage, onNavigate, notifications }) => {
    return (
        <aside id="main-sidebar" className="w-64 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl border-r border-white/20 dark:border-white/10 p-4 flex flex-col flex-shrink-0">
            <div className="mb-6">
                <Logo />
            </div>
            <nav className="flex-1 overflow-y-auto pr-2 -mr-2">
                 <NavItem
                    pageId={mainNav.pageId}
                    label={mainNav.label}
                    icon={mainNav.icon}
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                    hasNotification={notifications.has(mainNav.pageId)}
                />

                {navigationSections.map(section => (
                    <NavSection key={section.title} title={section.title}>
                        {section.items.map(item => (
                            <NavItem
                                key={item.pageId}
                                pageId={item.pageId}
                                label={item.label}
                                icon={item.icon}
                                currentPage={currentPage}
                                onNavigate={onNavigate}
                                hasNotification={notifications.has(item.pageId)}
                            />
                        ))}
                    </NavSection>
                ))}
            </nav>
        </aside>
    );
};
