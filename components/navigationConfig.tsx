import React from 'react';
import type { Page } from '../types';
import {
  DashboardIcon, BuildingIcon, UsersIcon, FolderIcon, CaseIcon, ClipboardListIcon,
  DonationIcon, HandHeartIcon, EventsIcon, MailCampaignIcon, GlobeIcon, HeartIcon,
  CheckSquareIcon, CalendarIcon, DocumentsIcon, ReportsIcon, BriefcaseIcon,
  ChatIcon, VideoIcon, MicIcon, SparklesIcon, FormGeneratorIcon, GrantWriterIcon,
  LayoutIcon, UserCircleIcon
} from './icons';


// --- CONFIGURATION ---

export interface NavItemConfig {
  pageId: Page;
  label: string;
  icon: React.ReactNode;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const mainNav: NavItemConfig = {
    pageId: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />
};

export const navigationSections: NavSectionConfig[] = [
    {
        title: 'CRM',
        items: [
            { pageId: 'organizations', label: 'Organizations', icon: <BuildingIcon /> },
            { pageId: 'contacts', label: 'Contacts', icon: <UsersIcon /> },
            { pageId: 'projects', label: 'Projects', icon: <FolderIcon /> },
            { pageId: 'case', label: 'Case Management', icon: <CaseIcon /> },
            { pageId: 'activities', label: 'Activities', icon: <ClipboardListIcon /> },
        ]
    },
    {
        title: 'Outreach',
        items: [
            { pageId: 'donations', label: 'Donations', icon: <DonationIcon /> },
            { pageId: 'volunteers', label: 'Volunteers', icon: <HandHeartIcon /> },
            { pageId: 'events', label: 'Events', icon: <EventsIcon /> },
            { pageId: 'email', label: 'Email Campaigns', icon: <MailCampaignIcon /> },
            { pageId: 'web-management', label: 'Web Management', icon: <GlobeIcon /> },
            { pageId: 'charity', label: 'Charity Tracker', icon: <HeartIcon /> },
        ]
    },
    {
        title: 'Workspace',
        items: [
            { pageId: 'tasks', label: 'Tasks', icon: <CheckSquareIcon /> },
            { pageId: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
            { pageId: 'documents', label: 'Documents', icon: <DocumentsIcon /> },
            { pageId: 'reports', label: 'Reports', icon: <ReportsIcon /> },
            { pageId: 'team', label: 'Team Members', icon: <BriefcaseIcon /> },
        ]
    },
    {
        title: 'Connect',
        items: [
            { pageId: 'chat', label: 'Team Chat', icon: <ChatIcon /> },
            { pageId: 'video', label: 'Video Conference', icon: <VideoIcon /> },
            { pageId: 'live-chat', label: 'Live Chat', icon: <MicIcon /> },
        ]
    },
    {
        title: 'AI Suite',
        items: [
            { pageId: 'ai-tools', label: 'AI Tools', icon: <SparklesIcon /> },
            { pageId: 'form-generator', label: 'Form Generator', icon: <FormGeneratorIcon /> },
            { pageId: 'grant-assistant', label: 'Grant Assistant', icon: <GrantWriterIcon /> },
        ]
    },
    {
        title: 'Client Suite',
        items: [
            { pageId: 'portal-builder', label: 'Portal Builder', icon: <LayoutIcon /> },
            { pageId: 'client-portal', label: 'Client Portal', icon: <UserCircleIcon /> },
        ]
    }
];

export const allNavItems: NavItemConfig[] = [
    mainNav,
    ...navigationSections.flatMap(s => s.items)
];