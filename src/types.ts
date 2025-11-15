

export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'In Progress',
  Completed = 'Completed',
  OnHold = 'On Hold',
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  createdAt: string; // ISO String
}

export interface Task {
  id: string;
  description: string;
  teamMemberId: string;
  dueDate: string;
  status: TaskStatus;
  sharedWithClient?: boolean;
  notes?: string;
}

export interface Project {
  id:string;
  name: string;
  description: string;
  clientId: string;
  teamMemberIds: string[];
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  tasks: Task[];
}

export interface EnrichedTask extends Task {
  projectName: string;
  projectId: string;
}

export enum ActivityType {
  Call = 'Call',
  Email = 'Email',
  Meeting = 'Meeting',
  Note = 'Note',
}

export enum ActivityStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  projectId?: string | null;
  clientId?: string | null;
  caseId?: string | null;
  activityDate: string; // YYYY-MM-DD
  activityTime?: string; // HH:mm
  status: ActivityStatus;
  notes?: string;
  createdById: string; // TeamMember ID
  sharedWithClient?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string; // TeamMember ID or 'USER' or 'AI'
  text: string;
  timestamp: string; // ISO string
}

export interface Donation {
  id: string;
  donorName: string;
  clientId?: string | null;
  amount: number;
  donationDate: string; // ISO String
  campaign: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  availability: string;
  assignedProjectIds: string[];
  assignedClientIds: string[];
}

export enum CaseStatus {
  New = 'New',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum CasePriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface CaseComment {
  id: string;
  authorId: string; // TeamMember ID
  text: string;
  timestamp: string; // ISO String
}


export interface Case {
  id: string;
  title: string;
  description: string;
  clientId: string;
  assignedToId: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string; // ISO String
  lastUpdatedAt: string; // ISO String
  activityIds?: string[];
  documentIds?: string[];
  comments?: CaseComment[];
}

export enum DocumentCategory {
    Client = 'Client',
    Project = 'Project',
    Internal = 'Internal',
    Template = 'Template',
}

export interface Document {
    id: string;
    name: string;
    category: DocumentCategory;
    relatedId: string; // Can be clientId or projectId, or teamId for internal
    fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'other';
    size: string; // e.g., "2.5 MB"
    lastModified: string; // ISO String
    uploadedById: string; // TeamMember ID
}

export enum WebpageStatus {
    Published = 'Published',
    Draft = 'Draft',
    Archived = 'Archived',
}

export interface WebpageComponentStyles {
  backgroundColor?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: string; 
  fontWeight?: 'normal' | 'bold';
  padding?: string;
  margin?: string;
}

export type WebpageComponentType = 'headline' | 'paragraph' | 'image' | 'button' | 'spacer' | 'hero' | 'video' | 'columns';

export interface WebpageComponent {
  id: string;
  type: WebpageComponentType;
  content: { [key: string]: any };
  styles?: WebpageComponentStyles;
  children?: WebpageComponent[][]; // Array of columns, each column is an array of components
}


export interface Webpage {
    id: string;
    relatedId: string; // Client ID
    title: string;
    status: WebpageStatus;
    lastUpdated: string; // ISO String
    visits: number;
    engagementScore: number; // 0-100
    content?: WebpageComponent[];
    colorPalette?: {
        primary: string;
        secondary: string;
        accent: string;
        text: string;
        background: string;
    }
}

export interface ScheduleItem {
    id: string;
    time: string; // e.g., "09:00 AM"
    title: string;
    description?: string;
}

export interface TicketType {
    id: string;
    name: string;
    price: number;
    description?: string;
}

export interface Event {
  id: string;
  title: string;
  clientId?: string | null;
  eventDate: string; // ISO String for date and time
  location: string;
  description: string;
  bannerImageUrl?: string;
  isPublished: boolean;
  schedule: ScheduleItem[];
  ticketTypes: TicketType[];
  volunteerIds: string[];
}

export type PortalWidgetType = 
    | 'welcome' 
    | 'projects' 
    | 'tasks' 
    | 'activities' 
    | 'documents'
    | 'team'
    | 'calendar'
    | 'events'
    | 'volunteers'
    | 'donations'
    | 'charity-tracker'
    | 'live-chat'
    | 'video-conference'
    | 'ai-chat-bot';

export interface PortalComponent {
    id: string;
    type: PortalWidgetType;
    settings: {
        title?: string;
        itemLimit?: number;
        [key: string]: any;
    };
}

export interface PortalLayout {
    clientId: string;
    components: PortalComponent[];
}

export interface EmailCampaignStats {
    sent: number;
    opened: number;
    clicked: number;
    unsubscribes: number;
}

export interface EmailCampaign {
    id: string;
    name: string;
    status: 'Sent' | 'Draft' | 'Scheduled';
    subject: string;
    subjectLineB?: string; // For A/B testing
    body: string;
    headerImageUrl?: string;
    ctaButtonText?: string;
    ctaButtonUrl?: string;
    recipientSegment: string;
    sentDate?: string; // ISO String - becomes defined when sent
    scheduleDate?: string; // ISO String - for scheduled campaigns
    stats: EmailCampaignStats;
    performance?: {
        opensOverTime: { hour: number, count: number }[];
    }
}

export interface WebSearchResult {
  name: string;
  description: string;
  url?: string;
  source: string;
}

// FIX: Moved SearchResults interface here to resolve circular dependency.
export interface SearchResults {
    projects: Project[];
    clients: Client[];
    tasks: EnrichedTask[];
    teamMembers: TeamMember[];
    activities: Activity[];
    volunteers: Volunteer[];
    cases: Case[];
    documents: Document[];
    webResults: WebSearchResult[];
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    teamMemberId: string;
    color: { bg: string, text: string, border: string };
    type: 'project' | 'task' | 'activity';
}


// FIX: Moved Page type here to resolve circular dependency issues.
export type Page = 
  | 'dashboard' 
  | 'organizations' 
  | 'contacts' 
  | 'projects' 
  | 'team' 
  | 'activities' 
  | 'calendar' 
  | 'volunteers' 
  | 'charity' 
  | 'case' 
  | 'chat' 
  | 'video' 
  | 'tasks' 
  | 'email' 
  | 'events' 
  | 'documents' 
  | 'donations'
  | 'reports'
  | 'form-generator'
  | 'web-management'
  | 'portal-builder'
  | 'client-portal'
  | 'ai-tools'
  | 'grant-assistant'
  | 'live-chat'
  | 'search-results';