import { Client, TeamMember, Project, ProjectStatus, TaskStatus, Activity, ActivityType, ActivityStatus, ChatRoom, ChatMessage, Donation, Volunteer, Case, CaseStatus, CasePriority, Document, DocumentCategory, Webpage, WebpageStatus, WebpageComponentType, Event, PortalLayout, EmailCampaign } from '../types';

export const mockTeamMembers: TeamMember[] = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@consult.com', role: 'Lead Strategist' },
  { id: 'c2', name: 'Bob Williams', email: 'bob@consult.com', role: 'Project Manager' },
  { id: 'c3', name: 'Charlie Brown', email: 'charlie@consult.com', role: 'Data Analyst' },
  { id: 'c4', name: 'Diana Prince', email: 'diana@consult.com', role: 'Grant Writer' },
  { id: 'c5', name: 'Ethan Miller', email: 'ethan@consult.com', role: 'Community Outreach Lead' },
  { id: 'c6', name: 'Fiona Davis', email: 'fiona@consult.com', role: 'Marketing Specialist' },
  { id: 'c7', name: 'George Taylor', email: 'george@consult.com', role: 'IT Coordinator' },
  { id: 'c8', name: 'Hannah Wilson', email: 'hannah@consult.com', role: 'Junior Consultant' },
  { id: 'c9', name: 'Isaac Newton', email: 'isaac@consult.com', role: 'Financial Advisor' },
  { id: 'c10', name: 'Jasmine Lee', email: 'jasmine@consult.com', role: 'UX/UI Designer' },
  { id: 'c11', name: 'Kevin Harris', email: 'kevin@consult.com', role: 'Legal Counsel' },
  { id: 'c12', name: 'Laura Smith', email: 'laura@consult.com', role: 'Operations Manager' },
];

export const mockClients: Client[] = [
  { id: 'cl1', name: 'Global Health Initiative', contactPerson: 'Dr. Emily Carter', email: 'ecarter@ghi.org', phone: '555-0101', location: 'New York, NY', createdAt: '2023-01-15T10:00:00Z' },
  { id: 'cl2', name: 'Community Arts Foundation', contactPerson: 'Markus Reid', email: 'mreid@caf.org', phone: '555-0102', location: 'San Francisco, CA', createdAt: '2022-11-20T14:30:00Z' },
  { id: 'cl3', name: 'Youth Empowerment Network', contactPerson: 'Sarah Chen', email: 'schen@yen.org', phone: '555-0103', location: 'Chicago, IL', createdAt: '2023-05-10T09:00:00Z' },
  { id: 'cl4', name: 'Green Future Alliance', contactPerson: 'David Lee', email: 'dlee@gfa.org', phone: '555-0104', location: 'Austin, TX', createdAt: '2023-08-22T11:00:00Z' },
  { id: 'cl5', name: 'Literacy for All', contactPerson: 'Maria Garcia', email: 'mgarcia@lfa.org', phone: '555-0105', location: 'Miami, FL', createdAt: '2024-01-05T16:20:00Z' },
  { id: 'cl6', name: 'Animal Rescue Shelter', contactPerson: 'Tom Harris', email: 'tharris@ars.org', phone: '555-0106', location: 'Denver, CO', createdAt: '2024-03-12T08:45:00Z' },
  { id: 'cl7', name: 'Hope for Paws Shelter', contactPerson: 'Jessica Day', email: 'jday@hfp.org', phone: '555-0107', location: 'Los Angeles, CA', createdAt: '2024-04-01T10:00:00Z' },
  { id: 'cl8', name: 'Future Coders Initiative', contactPerson: 'Winston Schmidt', email: 'wschmidt@fci.org', phone: '555-0108', location: 'Seattle, WA', createdAt: '2024-02-18T11:30:00Z' },
  { id: 'cl9', name: 'Urban Garden Project', contactPerson: 'Nick Miller', email: 'nmiller@ugp.org', phone: '555-0109', location: 'Portland, OR', createdAt: '2023-12-01T09:00:00Z' },
  { id: 'cl10', name: 'Senior Support Services', contactPerson: 'Cecelia Parekh', email: 'cparekh@sss.org', phone: '555-0110', location: 'Boston, MA', createdAt: '2024-05-20T14:00:00Z' },
  { id: 'cl11', name: 'Clean Ocean Collective', contactPerson: 'Paul Genzlinger', email: 'paul@coc.org', phone: '555-0111', location: 'San Diego, CA', createdAt: '2024-06-11T13:00:00Z' },
  { id: 'cl12', name: 'Global Arts Exchange', contactPerson: 'Reagan Lucas', email: 'rlucas@gae.org', phone: '555-0112', location: 'New Orleans, LA', createdAt: '2024-07-01T15:00:00Z' },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Annual Fundraising Gala Strategy',
    description: 'Develop and execute a comprehensive strategy for the 2024 Annual Fundraising Gala to increase donations by 20%.',
    clientId: 'cl2',
    teamMemberIds: ['c1', 'c2', 'c6'],
    startDate: '2024-08-01',
    endDate: '2024-11-30',
    status: ProjectStatus.InProgress,
    tasks: [
      { id: 't1_1', description: 'Finalize venue and catering', teamMemberId: 'c2', dueDate: '2024-08-30', status: TaskStatus.Done, sharedWithClient: true },
      { id: 't1_2', description: 'Secure keynote speaker', teamMemberId: 'c1', dueDate: '2024-09-15', status: TaskStatus.InProgress, sharedWithClient: true },
      { id: 't1_3', description: 'Launch ticket sales portal', teamMemberId: 'c10', dueDate: '2024-09-20', status: TaskStatus.ToDo, sharedWithClient: false },
      { id: 't1_4', description: 'Design marketing materials', teamMemberId: 'c6', dueDate: '2024-09-25', status: TaskStatus.InProgress, sharedWithClient: false },
    ],
  },
  {
    id: 'p2',
    name: 'Grant Application for Youth Programs',
    description: 'Prepare and submit a detailed grant application to the National Youth Foundation for funding of after-school programs.',
    clientId: 'cl3',
    teamMemberIds: ['c4', 'c8'],
    startDate: '2024-09-01',
    endDate: '2024-10-15',
    status: ProjectStatus.Planning,
    tasks: [
      { id: 't2_1', description: 'Gather program statistics', teamMemberId: 'c3', dueDate: '2024-09-10', status: TaskStatus.ToDo, sharedWithClient: true },
      { id: 't2_2', description: 'Draft application narrative', teamMemberId: 'c4', dueDate: '2024-09-30', status: TaskStatus.ToDo, sharedWithClient: true },
      { id: 't2_3', description: 'Review budget proposal with finance', teamMemberId: 'c9', dueDate: '2024-10-05', status: TaskStatus.ToDo, sharedWithClient: false },
    ],
  },
  {
    id: 'p3',
    name: 'Impact Assessment Report 2023',
    description: 'Analyze program data from 2023 to create a comprehensive impact assessment report for stakeholders and donors.',
    clientId: 'cl1',
    teamMemberIds: ['c3', 'c1'],
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    status: ProjectStatus.Completed,
    tasks: [
        { id: 't3_1', description: 'Collect all relevant program data', teamMemberId: 'c3', dueDate: '2024-05-15', status: TaskStatus.Done, sharedWithClient: true },
        { id: 't3_2', description: 'Perform statistical analysis', teamMemberId: 'c3', dueDate: '2024-06-15', status: TaskStatus.Done, sharedWithClient: false },
        { id: 't3_3', description: 'Write final report draft', teamMemberId: 'c1', dueDate: '2024-07-10', status: TaskStatus.Done, sharedWithClient: true },
    ],
  },
  {
    id: 'p4',
    name: 'Earth Day Awareness Campaign',
    description: 'Launch a multi-platform social media campaign to promote environmental awareness and drive volunteer sign-ups for Earth Day.',
    clientId: 'cl4',
    teamMemberIds: ['c5', 'c6'],
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    status: ProjectStatus.Planning,
    tasks: [
        { id: 't4_1', description: 'Develop campaign concept and messaging', teamMemberId: 'c6', dueDate: '2025-03-15', status: TaskStatus.ToDo, sharedWithClient: true },
        { id: 't4_2', description: 'Create social media content calendar', teamMemberId: 'c5', dueDate: '2025-03-20', status: TaskStatus.ToDo, sharedWithClient: false },
    ],
  },
  {
    id: 'p5',
    name: 'Summer Reading Program',
    description: 'Organize and manage a summer reading program for K-5 students to improve literacy rates.',
    clientId: 'cl5',
    teamMemberIds: ['c2', 'c8'],
    startDate: '2025-04-01',
    endDate: '2025-08-31',
    status: ProjectStatus.OnHold,
    tasks: [
      { id: 't5_1', description: 'Secure library partnerships', teamMemberId: 'c2', dueDate: '2025-04-30', status: TaskStatus.ToDo, sharedWithClient: true },
    ],
  },
  {
    id: 'p6',
    name: 'Website Redesign for ARS',
    description: 'Complete overhaul of the Animal Rescue Shelter website to improve user experience and increase adoption inquiries.',
    clientId: 'cl6',
    teamMemberIds: ['c1', 'c7', 'c10'],
    startDate: '2025-02-01',
    endDate: '2025-06-01',
    status: ProjectStatus.InProgress,
    tasks: [
      { id: 't6_1', description: 'Wireframing and UX design', teamMemberId: 'c10', dueDate: '2025-02-28', status: TaskStatus.Done, sharedWithClient: true },
      { id: 't6_2', description: 'Develop new site architecture', teamMemberId: 'c7', dueDate: '2025-03-31', status: TaskStatus.InProgress, sharedWithClient: false },
      { id: 't6_3', description: 'Migrate existing content', teamMemberId: 'c7', dueDate: '2025-04-15', status: TaskStatus.ToDo, sharedWithClient: false },
    ],
  },
  {
    id: 'p7',
    name: 'Volunteer Recruitment Drive',
    description: 'A 3-month campaign to recruit, onboard, and train 50 new volunteers for various community programs.',
    clientId: 'cl3',
    teamMemberIds: ['c5', 'c12'],
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    status: ProjectStatus.Completed,
    tasks: [
      { id: 't7_1', description: 'Plan recruitment events', teamMemberId: 'c5', dueDate: '2025-01-31', status: TaskStatus.Done, sharedWithClient: true },
      { id: 't7_2', description: 'Develop training materials', teamMemberId: 'c12', dueDate: '2025-02-15', status: TaskStatus.Done, sharedWithClient: false },
      { id: 't7_3', description: 'Conduct volunteer orientation', teamMemberId: 'c5', dueDate: '2025-03-10', status: TaskStatus.Done, sharedWithClient: true },
    ],
  },
   {
    id: 'p8',
    name: 'Online Adoption Portal for HFP',
    description: 'Design and develop a new online portal for Hope for Paws to streamline pet adoptions.',
    clientId: 'cl7',
    teamMemberIds: ['c10', 'c7', 'c2'],
    startDate: '2024-05-01',
    endDate: '2024-10-31',
    status: ProjectStatus.InProgress,
    tasks: [
      { id: 't8_1', description: 'User research and journey mapping', teamMemberId: 'c10', dueDate: '2024-05-30', status: TaskStatus.Done },
      { id: 't8_2', description: 'Backend API development', teamMemberId: 'c7', dueDate: '2024-08-15', status: TaskStatus.InProgress },
      { id: 't8_3', description: 'Frontend UI development', teamMemberId: 'c10', dueDate: '2024-09-30', status: TaskStatus.ToDo },
    ],
  },
  {
    id: 'p9',
    name: 'Curriculum Development for FCI',
    description: 'Create a 12-week coding bootcamp curriculum for underserved youth.',
    clientId: 'cl8',
    teamMemberIds: ['c1', 'c8', 'c3'],
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    status: ProjectStatus.Completed,
    tasks: [
      { id: 't9_1', description: 'Module 1: Intro to Web Dev', teamMemberId: 'c8', dueDate: '2024-03-31', status: TaskStatus.Done },
      { id: 't9_2', description: 'Module 2: React Deep Dive', teamMemberId: 'c1', dueDate: '2024-04-30', status: TaskStatus.Done },
    ],
  },
  {
    id: 'p10',
    name: 'Community Garden Build-out',
    description: 'Manage the construction and launch of three new community gardens in Portland.',
    clientId: 'cl9',
    teamMemberIds: ['c5', 'c12'],
    startDate: '2024-07-01',
    endDate: '2024-11-15',
    status: ProjectStatus.Planning,
    tasks: [
      { id: 't10_1', description: 'Secure land permits', teamMemberId: 'c12', dueDate: '2024-07-31', status: TaskStatus.ToDo },
      { id: 't10_2', description: 'Recruit volunteers for build days', teamMemberId: 'c5', dueDate: '2024-08-30', status: TaskStatus.ToDo },
    ],
  },
  {
    id: 'p11',
    name: 'Elderly Tech Literacy Program',
    description: 'Develop and run workshops to help seniors use modern technology.',
    clientId: 'cl10',
    teamMemberIds: ['c8', 'c5'],
    startDate: '2024-06-15',
    endDate: '2024-09-15',
    status: ProjectStatus.InProgress,
    tasks: [
      { id: 't11_1', description: 'Finalize workshop materials', teamMemberId: 'c8', dueDate: '2024-06-30', status: TaskStatus.Done },
      { id: 't11_2', description: 'Run first workshop series', teamMemberId: 'c5', dueDate: '2024-07-31', status: TaskStatus.InProgress },
    ],
  },
  {
    id: 'p12',
    name: 'Beach Cleanup Campaign 2024',
    description: 'Organize a large-scale beach cleanup event and social media awareness campaign.',
    clientId: 'cl11',
    teamMemberIds: ['c6', 'c5', 'c12'],
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    status: ProjectStatus.Planning,
    tasks: [
      { id: 't12_1', description: 'Social media content creation', teamMemberId: 'c6', dueDate: '2024-08-20', status: TaskStatus.ToDo },
    ],
  },
  {
    id: 'p13',
    name: 'International Artist Exchange Program',
    description: 'Facilitate a cultural exchange program for artists between New Orleans and Paris.',
    clientId: 'cl12',
    teamMemberIds: ['c1', 'c11'],
    startDate: '2024-09-01',
    endDate: '2025-03-01',
    status: ProjectStatus.OnHold,
    tasks: [
        { id: 't13_1', description: 'Finalize partnership with Parisian gallery', teamMemberId: 'c1', dueDate: '2024-10-15', status: TaskStatus.ToDo },
    ],
  },
  {
    id: 'p14',
    name: 'Financial Audit for GHI',
    description: 'Conduct a full financial audit for the Global Health Initiative for the 2023 fiscal year.',
    clientId: 'cl1',
    teamMemberIds: ['c9', 'c3'],
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    status: ProjectStatus.Completed,
    tasks: [
        { id: 't14_1', description: 'Gather all financial statements', teamMemberId: 'c3', dueDate: '2024-02-28', status: TaskStatus.Done },
        { id: 't14_2', description: 'Perform audit and write report', teamMemberId: 'c9', dueDate: '2024-04-15', status: TaskStatus.Done },
    ],
  },
  {
    id: 'p15',
    name: 'Non-Profit Bylaws Review',
    description: 'Review and update the corporate bylaws for the Community Arts Foundation.',
    clientId: 'cl2',
    teamMemberIds: ['c11', 'c1'],
    startDate: '2024-10-01',
    endDate: '2024-11-30',
    status: ProjectStatus.Planning,
    tasks: [
        { id: 't15_1', description: 'Initial review of existing bylaws', teamMemberId: 'c11', dueDate: '2024-10-20', status: TaskStatus.ToDo },
    ],
  },
];

export const mockActivities: Activity[] = [
  { id: 'act21', type: ActivityType.Email, title: 'Initial outreach to new prospect "Hope Foundation"', clientId: null, projectId: null, caseId: null, activityDate: new Date().toISOString().substring(0, 10), status: ActivityStatus.Completed, notes: 'Sent introductory email outlining our services.', createdById: 'c4', sharedWithClient: false, },
  { id: 'act1', type: ActivityType.Call, title: 'Follow-up call with Dr. Carter', clientId: 'cl1', projectId: 'p3', caseId: 'case3', activityDate: '2024-07-20', activityTime: '14:30', status: ActivityStatus.Completed, notes: 'Discussed the final draft of the impact report. Dr. Carter was pleased with the results and had minor feedback.', createdById: 'c1', sharedWithClient: true, },
  { id: 'act2', type: ActivityType.Meeting, title: 'Gala planning session', clientId: 'cl2', projectId: 'p1', caseId: 'case2', activityDate: '2024-08-05', activityTime: '10:00', status: ActivityStatus.Completed, notes: 'Brainstormed theme ideas and confirmed budget with the internal team.', createdById: 'c2', sharedWithClient: true, },
  { id: 'act3', type: ActivityType.Email, title: 'Sent grant application draft to Sarah Chen', clientId: 'cl3', projectId: 'p2', caseId: null, activityDate: '2024-09-28', status: ActivityStatus.Completed, notes: 'Emailed the first draft of the grant narrative for her review. Awaiting feedback.', createdById: 'c4', sharedWithClient: true, },
  { id: 'act4', type: ActivityType.Note, title: 'Internal strategy note', projectId: 'p1', caseId: null, clientId: null, activityDate: '2024-10-02', status: ActivityStatus.Completed, notes: 'A potential keynote speaker has been identified. Need to prepare an outreach packet.', createdById: 'c1', sharedWithClient: false, },
  { id: 'act5', type: ActivityType.Meeting, title: 'Kick-off meeting for Earth Day Campaign', clientId: 'cl4', projectId: 'p4', caseId: null, activityDate: '2025-02-20', activityTime: '11:00', status: ActivityStatus.Scheduled, notes: 'Agenda includes brainstorming, content strategy, and assigning roles.', createdById: 'c5', sharedWithClient: true, },
  { id: 'act6', type: ActivityType.Call, title: 'Check-in with Maria Garcia about program hold', clientId: 'cl5', projectId: 'p5', caseId: 'case7', activityDate: '2025-04-05', activityTime: '15:00', status: ActivityStatus.Completed, notes: 'Discussed reasons for the project hold. Budgetary constraints. Will revisit in Q3.', createdById: 'c2', sharedWithClient: false, },
  { id: 'act7', type: ActivityType.Email, title: 'Sent wireframes to Tom Harris for ARS website', clientId: 'cl6', projectId: 'p6', caseId: null, activityDate: '2025-03-01', status: ActivityStatus.Completed, notes: 'Emailed the link to the Figma wireframes for initial feedback.', createdById: 'c10', sharedWithClient: true, },
  { id: 'act8', type: ActivityType.Note, title: 'Website migration plan', projectId: 'p6', caseId: null, clientId: null, activityDate: '2025-03-15', status: ActivityStatus.Completed, notes: 'Drafted a step-by-step plan for migrating the old content to the new CMS. George to review.', createdById: 'c7', sharedWithClient: false, },
  { id: 'act9', type: ActivityType.Meeting, title: 'Post-mortem for Volunteer Drive', clientId: 'cl3', projectId: 'p7', caseId: null, activityDate: '2025-04-20', activityTime: '13:00', status: ActivityStatus.Completed, notes: 'Team meeting to discuss successes and challenges of the recruitment campaign. Overall very successful, exceeded goal by 15%.', createdById: 'c5', sharedWithClient: false, },
  { id: 'act10', type: ActivityType.Meeting, title: 'HFP Adoption Portal Kick-off', clientId: 'cl7', projectId: 'p8', caseId: null, activityDate: '2024-05-02', activityTime: '10:00', status: ActivityStatus.Completed, notes: 'Met with Jessica Day to align on project goals and user stories for the new portal.', createdById: 'c2', sharedWithClient: true, },
  { id: 'act11', type: ActivityType.Call, title: 'Check-in with Nick Miller', clientId: 'cl9', projectId: 'p10', caseId: 'case12', activityDate: '2024-07-10', activityTime: '14:00', status: ActivityStatus.Completed, notes: 'Discussed potential sites for the new gardens. He will send over a list of city-owned lots.', createdById: 'c5', sharedWithClient: false, },
  { id: 'act12', type: ActivityType.Email, title: 'Sent final audit report to GHI', clientId: 'cl1', projectId: 'p14', caseId: null, activityDate: '2024-04-28', status: ActivityStatus.Completed, notes: 'Emailed the completed 2023 audit report to Dr. Carter.', createdById: 'c9', sharedWithClient: true, },
  { id: 'act13', type: ActivityType.Meeting, title: 'Beach Cleanup Logistics Planning', clientId: 'cl11', projectId: 'p12', caseId: null, activityDate: '2024-08-05', activityTime: '11:00', status: ActivityStatus.Scheduled, notes: 'Team meeting to plan logistics for the cleanup event, including supplies and volunteer coordination.', createdById: 'c12', sharedWithClient: true, },
  { id: 'act14', type: ActivityType.Note, title: 'FCI curriculum feedback', projectId: 'p9', clientId: 'cl8', caseId: null, activityDate: '2024-06-25', status: ActivityStatus.Completed, notes: 'Winston Schmidt from FCI provided excellent feedback on the React module. The curriculum is now finalized.', createdById: 'c1', sharedWithClient: false, },
  { id: 'act15', type: ActivityType.Call, title: 'Call with Reagan Lucas re: Artist Exchange', clientId: 'cl12', projectId: 'p13', caseId: null, activityDate: '2024-08-15', activityTime: '15:30', status: ActivityStatus.Completed, notes: 'Project is on hold pending confirmation of international travel grants. Will follow up in October.', createdById: 'c1', sharedWithClient: true, },
  { id: 'act16', type: ActivityType.Meeting, title: 'UX review for Adoption Portal', clientId: 'cl7', projectId: 'p8', caseId: null, activityDate: new Date(Date.now() - 86400000 * 3).toISOString().substring(0,10), activityTime: '13:00', status: ActivityStatus.Completed, notes: 'Presented wireframes to HFP. Feedback was positive.', createdById: 'c10', sharedWithClient: true },
  { id: 'act17', type: ActivityType.Email, title: 'Sent SSS workshop schedule', clientId: 'cl10', projectId: 'p11', caseId: null, activityDate: new Date(Date.now() - 86400000 * 5).toISOString().substring(0,10), status: ActivityStatus.Completed, notes: 'Emailed the detailed workshop schedule to Cecelia Parekh.', createdById: 'c8', sharedWithClient: true },
  { id: 'act18', type: ActivityType.Note, title: 'Legal review for GAE contract', projectId: 'p13', clientId: 'cl12', caseId: null, activityDate: new Date(Date.now() - 86400000 * 10).toISOString().substring(0,10), status: ActivityStatus.Completed, notes: 'Kevin Harris has reviewed the initial gallery contract. Some clauses need revision.', createdById: 'c11', sharedWithClient: false },
  { id: 'act19', type: ActivityType.Call, title: 'Follow-up on bylaws with Markus Reid', clientId: 'cl2', projectId: 'p15', caseId: 'case14', activityDate: new Date(Date.now() + 86400000 * 5).toISOString().substring(0,10), activityTime: '10:30', status: ActivityStatus.Scheduled, notes: 'Scheduled a call to discuss the proposed bylaw changes.', createdById: 'c11', sharedWithClient: true },
  { id: 'act20', type: ActivityType.Meeting, title: 'Quarterly review with Green Future Alliance', clientId: 'cl4', projectId: null, caseId: null, activityDate: new Date(Date.now() - 86400000 * 1).toISOString().substring(0,10), activityTime: '16:00', status: ActivityStatus.Completed, notes: 'General quarterly check-in with David Lee. Discussed potential future projects.', createdById: 'c1', sharedWithClient: true },
];

export const mockChatRooms: ChatRoom[] = [
    { id: 'room-1', name: '#general' },
    { id: 'room-2', name: '#gala-planning' },
    { id: 'room-3', name: '#random' },
    { id: 'room-4', name: '#website-redesigns' },
    { id: 'room-5', name: '#legal-and-finance' },
    { id: 'room-6', name: '#clean-ocean-campaign' },
];

export const mockChatMessages: ChatMessage[] = [
    { id: 'msg-1', roomId: 'room-1', senderId: 'c1', text: 'Hey team, welcome to the new chat!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'msg-2', roomId: 'room-1', senderId: 'c2', text: 'This is great! So much easier to coordinate here.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString() },
    { id: 'msg-3', roomId: 'room-2', senderId: 'c2', text: 'Okay, for the gala, I\'ve finalized the venue options. I\'ll share the doc shortly.', timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
    { id: 'msg-4', roomId: 'room-2', senderId: 'c1', text: 'Perfect, thanks Bob. I have some ideas for the keynote speaker.', timestamp: new Date(Date.now() - 1000 * 60 * 49).toISOString() },
    { id: 'msg-5', roomId: 'room-3', senderId: 'c3', text: 'Has anyone seen the new documentary on data visualization? It was fascinating.', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 'msg-6', roomId: 'room-1', senderId: 'c4', text: 'I just submitted the grant draft for the Youth Empowerment Network. Fingers crossed!', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'msg-7', roomId: 'room-1', senderId: 'c1', text: 'Awesome news, Diana! Let us know how it goes.', timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString() },
    { id: 'msg-8', roomId: 'room-4', senderId: 'c7', text: 'Okay, staging server for the ARS website is up. The link is in the project docs.', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    { id: 'msg-9', roomId: 'room-4', senderId: 'c10', text: 'Great, thanks George. I\'ll take a look and give feedback on the UX.', timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString() },
    { id: 'msg-10', roomId: 'room-1', senderId: 'c5', text: 'Excited to kick off the Earth Day campaign planning! Let\'s make a big impact.', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: 'msg-11', roomId: 'room-5', senderId: 'c9', text: 'Morning all. Just a reminder that Q3 financial reports are due by EOD Friday.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: 'msg-12', roomId: 'room-5', senderId: 'c11', text: 'Thanks, Isaac. Quick question about the GAE contract, can you hop on a quick call?', timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
    { id: 'msg-13', roomId: 'room-6', senderId: 'c6', text: 'Here are the first mockups for the Clean Ocean campaign. Let me know your thoughts!', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'msg-14', roomId: 'room-6', senderId: 'c5', text: 'These look fantastic, Fiona! Love the color palette.', timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
    { id: 'msg-15', roomId: 'room-1', senderId: 'c8', text: 'I\'m running the first Senior Tech workshop this afternoon. Wish me luck!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'msg-16', roomId: 'room-1', senderId: 'c12', text: 'You\'ll do great, Hannah!', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
];

export const mockDonations: Donation[] = [
  { id: 'd21', donorName: 'Tech for Tomorrow Foundation', clientId: 'cl8', amount: 25000, donationDate: new Date().toISOString(), campaign: 'FCI Scholarship Fund' },
  { id: 'd1', donorName: 'Markus Reid', clientId: 'cl2', amount: 1000, donationDate: '2024-10-25T10:00:00Z', campaign: 'Annual Fundraising Gala Strategy' },
  { id: 'd2', donorName: 'Anonymous Donor', clientId: null, amount: 500, donationDate: '2024-10-24T14:30:00Z', campaign: 'General Fund' },
  { id: 'd3', donorName: 'Tech for Good Inc.', clientId: 'cl8', amount: 5000, donationDate: '2024-10-22T09:00:00Z', campaign: 'FCI Scholarship Fund' },
  { id: 'd4', donorName: 'Global Health Initiative', clientId: 'cl1', amount: 2500, donationDate: '2024-10-20T11:00:00Z', campaign: 'Impact Assessment Fund' },
  { id: 'd5', donorName: 'Sarah Chen', clientId: 'cl3', amount: 250, donationDate: '2024-10-18T16:45:00Z', campaign: 'Youth Empowerment Network Grant Match' },
  { id: 'd6', donorName: 'Community Arts Foundation', clientId: 'cl2', amount: 750, donationDate: '2024-09-15T12:00:00Z', campaign: 'Annual Fundraising Gala Strategy' },
  { id: 'd7', donorName: 'David Lee', clientId: 'cl4', amount: 1500, donationDate: '2025-03-10T10:00:00Z', campaign: 'Earth Day Initiative' },
  { id: 'd8', donorName: 'The Bookworm Club', clientId: 'cl5', amount: 3000, donationDate: '2025-01-20T14:00:00Z', campaign: 'Summer Reading Program' },
  { id: 'd9', donorName: 'Pet Lovers United', clientId: 'cl6', amount: 1200, donationDate: '2025-02-25T18:00:00Z', campaign: 'New Shelter Wing' },
  { id: 'd10', donorName: 'Anonymous', clientId: null, amount: 10000, donationDate: '2025-04-01T12:00:00Z', campaign: 'General Fund' },
  { id: 'd11', donorName: 'Austin Green Tech', clientId: 'cl4', amount: 7500, donationDate: '2025-03-28T09:30:00Z', campaign: 'Earth Day Initiative' },
  { id: 'd12', donorName: 'The Miller Foundation', clientId: 'cl9', amount: 15000, donationDate: '2024-07-15T10:00:00Z', campaign: 'Urban Garden Project' },
  { id: 'd13', donorName: 'Jessica Day', clientId: 'cl7', amount: 500, donationDate: '2024-06-01T14:00:00Z', campaign: 'Hope for Paws General Fund' },
  { id: 'd14', donorName: 'Boston Philanthropic Society', clientId: 'cl10', amount: 20000, donationDate: '2024-05-25T11:00:00Z', campaign: 'Senior Support Services' },
  { id: 'd15', donorName: 'Winston Schmidt', clientId: 'cl8', amount: 1000, donationDate: '2024-03-01T18:00:00Z', campaign: 'FCI Scholarship Fund' },
  { id: 'd16', donorName: 'Ocean Guardians', clientId: 'cl11', amount: 25000, donationDate: '2024-06-20T09:00:00Z', campaign: 'Clean Ocean Collective' },
  { id: 'd17', donorName: 'Reagan Lucas', clientId: 'cl12', amount: 750, donationDate: '2024-07-05T12:00:00Z', campaign: 'Global Arts Exchange' },
  { id: 'd18', donorName: 'Maria Garcia', clientId: 'cl5', amount: 150, donationDate: '2024-02-10T16:00:00Z', campaign: 'Literacy for All' },
  { id: 'd19', donorName: 'SF Art Collective', clientId: 'cl2', amount: 5000, donationDate: '2024-08-20T13:00:00Z', campaign: 'Annual Fundraising Gala Strategy' },
  { id: 'd20', donorName: 'Anonymous', clientId: null, amount: 200, donationDate: new Date().toISOString(), campaign: 'General Fund' },
];

export const mockVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Ethan Hunt', email: 'ethan.h@volunteer.org', phone: '555-0201', location: 'Brooklyn, NY', skills: ['Event Planning', 'Public Speaking'], availability: 'Weekends', assignedProjectIds: ['p1'], assignedClientIds: ['cl2'] },
  { id: 'v2', name: 'Fiona Glenanne', email: 'fiona.g@volunteer.org', phone: '555-0202', location: 'Palo Alto, CA', skills: ['Social Media', 'Graphic Design'], availability: 'Mon, Wed, Fri afternoons', assignedProjectIds: ['p1', 'p4'], assignedClientIds: ['cl2', 'cl4'] },
  { id: 'v3', name: 'Michael Westen', email: 'michael.w@volunteer.org', phone: '555-0203', location: 'Oak Park, IL', skills: ['Data Entry', 'Research'], availability: 'Any weekday', assignedProjectIds: ['p2', 'p3'], assignedClientIds: ['cl3', 'cl1'] },
  { id: 'v4', name: 'Sam Axe', email: 'sam.a@volunteer.org', phone: '555-0204', location: 'Evanston, IL', skills: ['Fundraising', 'Community Outreach'], availability: 'Weekends', assignedProjectIds: ['p2', 'p7'], assignedClientIds: ['cl3'] },
  { id: 'v5', name: 'Jane Smith', email: 'jane.s@volunteer.org', phone: '555-0205', location: 'Austin, TX', skills: ['Gardening', 'Event Coordination'], availability: 'Tue, Thu mornings', assignedProjectIds: ['p4', 'p10'], assignedClientIds: ['cl4', 'cl9'] },
  { id: 'v6', name: 'Carlos Rivera', email: 'carlos.r@volunteer.org', phone: '555-0206', location: 'Miami, FL', skills: ['Bilingual (Spanish)', 'Tutoring'], availability: 'Weekdays after 4pm', assignedProjectIds: ['p5'], assignedClientIds: ['cl5'] },
  { id: 'v7', name: 'Brenda Walsh', email: 'brenda.w@volunteer.org', phone: '555-0207', location: 'Denver, CO', skills: ['Animal Handling', 'Photography'], availability: 'Weekends', assignedProjectIds: ['p6'], assignedClientIds: ['cl6'] },
  { id: 'v8', name: 'Kevin McCallister', email: 'kevin.m@volunteer.org', phone: '555-0208', location: 'Chicago, IL', skills: ['Creative Problem Solving', 'Logistics'], availability: 'Holidays', assignedProjectIds: ['p2', 'p7'], assignedClientIds: ['cl3'] },
  { id: 'v9', name: 'Olivia Pope', email: 'olivia.p@volunteer.org', phone: '555-0209', location: 'Washington, DC', skills: ['Crisis Management', 'PR'], availability: 'Evenings', assignedProjectIds: ['p1', 'p15'], assignedClientIds: ['cl2'] },
  { id: 'v10', name: 'Walter White', email: 'walter.w@volunteer.org', phone: '555-0210', location: 'Albuquerque, NM', skills: ['Chemistry', 'Teaching'], availability: 'Weekends', assignedProjectIds: ['p9'], assignedClientIds: ['cl8'] },
  { id: 'v11', name: 'Liz Lemon', email: 'liz.l@volunteer.org', phone: '555-0211', location: 'New York, NY', skills: ['Writing', 'Project Management'], availability: 'Weekdays', assignedProjectIds: ['p13'], assignedClientIds: ['cl12'] },
  { id: 'v12', name: 'Ron Swanson', email: 'ron.s@volunteer.org', phone: '555-0212', location: 'Indianapolis, IN', skills: ['Woodworking', 'Permitting'], availability: 'Mornings', assignedProjectIds: ['p10'], assignedClientIds: ['cl9'] },
];

export const mockCases: Case[] = [
  { id: 'case16', title: 'Urgent: New Donor Welcome Packet', description: 'A major new donor just contributed. We need to prepare and send a personalized welcome packet and thank you note immediately.', clientId: 'cl8', assignedToId: 'c1', status: CaseStatus.New, priority: CasePriority.High, createdAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString(), activityIds: [], documentIds: [], comments: [], },
  { id: 'case1', title: 'Grant Proposal Follow-up Required', description: 'The National Youth Foundation has requested additional documentation for the recent grant application. Need to compile and send before the deadline.', clientId: 'cl3', assignedToId: 'c4', status: CaseStatus.InProgress, priority: CasePriority.High, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), activityIds: [], documentIds: [], comments: [{ id: 'com1-1', authorId: 'c4', text: 'I\'ve compiled the initial documents. Waiting on the Q3 program report from Charlie.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },], },
  { id: 'case2', title: 'Gala Venue Contract Issue', description: 'The venue for the annual gala has double-booked the date. Need to resolve the conflict or find an alternative venue immediately.', clientId: 'cl2', assignedToId: 'c2', status: CaseStatus.New, priority: CasePriority.High, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), activityIds: ['act2'], documentIds: [], comments: [], },
  { id: 'case3', title: 'Impact Report Data Discrepancy', description: 'A stakeholder noted a discrepancy in the Q3 data of the 2023 impact report. Needs investigation and clarification.', clientId: 'cl1', assignedToId: 'c3', status: CaseStatus.InProgress, priority: CasePriority.Medium, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), activityIds: ['act1'], documentIds: [], comments: [{ id: 'com3-1', authorId: 'c3', text: 'Identified the source of the discrepancy. It was a data entry error in the initial collection phase. Preparing a corrected report.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() }, { id: 'com3-2', authorId: 'c1', text: 'Thanks, Charlie. Let me know when the corrected version is ready to send to the client.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },], },
  { id: 'case4', title: 'New Volunteer Onboarding Packet', description: 'A new batch of volunteers needs their onboarding packets and initial assignments for the upcoming arts festival.', clientId: 'cl2', assignedToId: 'c12', status: CaseStatus.New, priority: CasePriority.Low, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), activityIds: [], documentIds: [], comments: [], },
  { id: 'case5', title: 'Donor Inquiry about Fund Allocation', description: 'Received an email from a major donor asking for a detailed breakdown of how their contribution to the "Impact Assessment Fund" was used.', clientId: 'cl1', assignedToId: 'c9', status: CaseStatus.Resolved, priority: CasePriority.Medium, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), activityIds: [], documentIds: [], comments: [], },
  { id: 'case6', title: 'Permit Application for Park Cleanup', description: 'The city requires a permit for the park cleanup event scheduled for Earth Day. We need to file the paperwork asap.', clientId: 'cl4', assignedToId: 'c5', status: CaseStatus.New, priority: CasePriority.High, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), activityIds: [], documentIds: [], comments: [], },
  { id: 'case7', title: 'Investigate low registration for Reading Program', description: 'Registrations for the Summer Reading Program are lower than expected. Need to analyze outreach efforts and propose a new strategy.', clientId: 'cl5', assignedToId: 'c6', status: CaseStatus.InProgress, priority: CasePriority.Medium, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), activityIds: ['act6'], documentIds: [], comments: [{ id: 'com7-1', authorId: 'c6', text: 'Initial thought: our social media ads might not be targeting the right demographics. Pulling the numbers now.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() }], },
  { id: 'case8', title: 'Broken donation link on ARS website', description: 'A potential donor reported that the main "Donate Now" button on the homepage is leading to a 404 error.', clientId: 'cl6', assignedToId: 'c7', status: CaseStatus.Resolved, priority: CasePriority.High, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), activityIds: [], documentIds: [], comments: [{ id: 'com8-1', authorId: 'c7', text: 'Fixed. It was a typo in the URL. Deployed the fix.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString() }], },
  { id: 'case9', title: 'Finalize volunteer schedules for Gala', description: 'Need to confirm shifts and roles with all assigned volunteers for the upcoming gala.', clientId: 'cl2', assignedToId: 'c2', status: CaseStatus.Closed, priority: CasePriority.Low, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(), activityIds: [], documentIds: [], comments: [], },
  { id: 'case10', title: 'Adoption Portal Image Upload Bug', description: 'Users are reporting errors when trying to upload photos of pets to the new portal.', clientId: 'cl7', assignedToId: 'c7', status: CaseStatus.InProgress, priority: CasePriority.High, createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), comments: [] },
  { id: 'case11', title: 'Request for Advanced JS curriculum module', description: 'FCI wants to add an advanced JavaScript module covering asynchronous programming.', clientId: 'cl8', assignedToId: 'c1', status: CaseStatus.New, priority: CasePriority.Medium, createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), lastUpdatedAt: new Date(Date.now() - 86400000 * 4).toISOString(), comments: [] },
  { id: 'case12', title: 'Permit delay for Garden Site #2', description: 'The permit for the second garden site has been delayed by the city. Need to follow up.', clientId: 'cl9', assignedToId: 'c12', status: CaseStatus.InProgress, priority: CasePriority.High, createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), lastUpdatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), activityIds: ['act11'], comments: [] },
  { id: 'case13', title: 'Low attendance at Senior Tech workshop', description: 'Attendance for the last workshop was low. Investigate and propose marketing changes.', clientId: 'cl10', assignedToId: 'c5', status: CaseStatus.New, priority: CasePriority.Medium, createdAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString(), comments: [] },
  { id: 'case14', title: 'Inquiry about bylaw voting rights', description: 'Markus Reid has questions regarding the proposed changes to member voting rights in the new bylaws.', clientId: 'cl2', assignedToId: 'c11', status: CaseStatus.New, priority: CasePriority.Medium, createdAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString(), activityIds: ['act19'], comments: [] },
  { id: 'case15', title: 'COC website donation button broken', description: 'The main donation link on the Clean Ocean Collective homepage is failing.', clientId: 'cl11', assignedToId: 'c7', status: CaseStatus.Resolved, priority: CasePriority.High, createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), lastUpdatedAt: new Date(Date.now() - 86400000 * 14).toISOString(), comments: [{ id: 'com15-1', authorId: 'c7', text: 'Fixed the link. It was pointing to an old payment processor.', timestamp: new Date(Date.now() - 86400000 * 14).toISOString() }] },
];

export const mockDocuments: Document[] = [
    { id: 'doc1', name: 'GHI_Impact_Report_2023_Final.pdf', category: DocumentCategory.Client, relatedId: 'cl1', fileType: 'pdf', size: '3.2 MB', lastModified: '2024-07-25T14:00:00Z', uploadedById: 'c1', },
    { id: 'doc2', name: 'Gala_Sponsorship_Tiers.docx', category: DocumentCategory.Project, relatedId: 'p1', fileType: 'docx', size: '78 KB', lastModified: '2024-08-15T10:30:00Z', uploadedById: 'c2', },
    { id: 'doc3', name: 'Grant_Application_Budget.xlsx', category: DocumentCategory.Project, relatedId: 'p2', fileType: 'xlsx', size: '120 KB', lastModified: '2024-09-05T11:00:00Z', uploadedById: 'c4', },
    { id: 'doc4', name: 'Consulting_Agreement_YEN.pdf', category: DocumentCategory.Client, relatedId: 'cl3', fileType: 'pdf', size: '450 KB', lastModified: '2023-05-01T09:00:00Z', uploadedById: 'c1', },
    { id: 'doc5', name: 'Internal_Q3_Performance_Review.pptx', category: DocumentCategory.Internal, relatedId: 'c1', fileType: 'pptx', size: '5.1 MB', lastModified: '2024-10-01T16:00:00Z', uploadedById: 'c1', },
    { id: 'doc6', name: 'Press_Release_Template.docx', category: DocumentCategory.Template, relatedId: 'internal', fileType: 'docx', size: '35 KB', lastModified: '2022-01-10T12:00:00Z', uploadedById: 'c2', },
    { id: 'doc7', name: 'Gala_Guest_List_Tracker.xlsx', category: DocumentCategory.Project, relatedId: 'p1', fileType: 'xlsx', size: '256 KB', lastModified: '2024-10-12T18:00:00Z', uploadedById: 'c2', },
    { id: 'doc8', name: 'Data_Analysis_Raw_Data.csv', category: DocumentCategory.Project, relatedId: 'p3', fileType: 'other', size: '12.8 MB', lastModified: '2024-06-10T09:00:00Z', uploadedById: 'c3', },
    { id: 'doc-cost-analysis', name: 'Deployment_Cost_Analysis.xlsx', category: DocumentCategory.Internal, relatedId: 'internal', fileType: 'xlsx', size: '45 KB', lastModified: new Date().toISOString(), uploadedById: 'c9', },
    { id: 'doc9', name: 'Earth_Day_Campaign_Brief.pdf', category: DocumentCategory.Project, relatedId: 'p4', fileType: 'pdf', size: '1.1 MB', lastModified: '2025-02-25T10:00:00Z', uploadedById: 'c5', },
    { id: 'doc10', name: 'LFA_MSA.pdf', category: DocumentCategory.Client, relatedId: 'cl5', fileType: 'pdf', size: '600 KB', lastModified: '2024-01-02T13:00:00Z', uploadedById: 'c11', },
    { id: 'doc11', name: 'ARS_Brand_Guidelines.pptx', category: DocumentCategory.Client, relatedId: 'cl6', fileType: 'pptx', size: '8.4 MB', lastModified: '2024-03-15T15:00:00Z', uploadedById: 'c6', },
    { id: 'doc12', name: 'Volunteer_Handbook_Template.docx', category: DocumentCategory.Template, relatedId: 'internal', fileType: 'docx', size: '150 KB', lastModified: '2023-11-01T11:00:00Z', uploadedById: 'c12', },
    { id: 'doc13', name: 'HFP_Portal_Wireframes.pdf', category: DocumentCategory.Project, relatedId: 'p8', fileType: 'pdf', size: '2.5 MB', lastModified: '2024-05-28T16:00:00Z', uploadedById: 'c10' },
    { id: 'doc14', name: 'FCI_Curriculum_Final.docx', category: DocumentCategory.Project, relatedId: 'p9', fileType: 'docx', size: '1.8 MB', lastModified: '2024-06-28T10:00:00Z', uploadedById: 'c1' },
    { id: 'doc15', name: 'UGP_Site_Permits.pdf', category: DocumentCategory.Project, relatedId: 'p10', fileType: 'pdf', size: '980 KB', lastModified: '2024-07-29T11:00:00Z', uploadedById: 'c12' },
    { id: 'doc16', name: 'COC_Campaign_Analytics.xlsx', category: DocumentCategory.Project, relatedId: 'p12', fileType: 'xlsx', size: '340 KB', lastModified: '2024-08-10T15:00:00Z', uploadedById: 'c6' },
    { id: 'doc17', name: 'GHI_2023_Audit_Report.pdf', category: DocumentCategory.Client, relatedId: 'cl1', fileType: 'pdf', size: '4.1 MB', lastModified: '2024-04-28T12:00:00Z', uploadedById: 'c9' },
    { id: 'doc18', name: 'CAF_Bylaw_Draft_v2.docx', category: DocumentCategory.Project, relatedId: 'p15', fileType: 'docx', size: '215 KB', lastModified: '2024-10-15T09:00:00Z', uploadedById: 'c11' },
    { id: 'doc19', name: 'Onboarding_Checklist_Template.xlsx', category: DocumentCategory.Template, relatedId: 'internal', fileType: 'xlsx', size: '65 KB', lastModified: '2023-01-01T10:00:00Z', uploadedById: 'c12' },
    { id: 'doc20', name: 'SSS_Workshop_Feedback.csv', category: DocumentCategory.Project, relatedId: 'p11', fileType: 'other', size: '88 KB', lastModified: '2024-08-01T17:00:00Z', uploadedById: 'c8' },
];

export const mockWebpages: Webpage[] = [
  { id: 'wp1', relatedId: 'cl1', title: 'Global Health Initiative - Home', status: WebpageStatus.Published, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), visits: 12530, engagementScore: 88, colorPalette: { primary: '#4f46e5', secondary: '#10b981', accent: '#f59e0b', text: '#1f2937', background: '#f9fafb', }, content: [ { id: 'c-hero-1', type: 'hero', content: { headline: 'Improving Health Outcomes Worldwide', subheadline: 'Innovative research and strategic partnerships.', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop', buttonText: 'Learn More', buttonUrl: '#about' }, styles: { textColor: '#ffffff', } }, { id: 'c-spacer-1', type: 'spacer', content: { height: 60 } }, { id: 'c-cols-1', type: 'columns', content: { count: 2 }, children: [ [ { id: 'c-h2-1', type: 'headline', content: { text: 'Our Mission', level: 'h2' }, styles: { textAlign: 'left' } }, { id: 'c-p-1', type: 'paragraph', content: { text: 'We are dedicated to improving health outcomes for communities worldwide through innovative research and strategic partnerships. We believe that everyone deserves access to quality healthcare.' }, styles: { textAlign: 'left' } }, ], [ { id: 'c-img-1', type: 'image', content: { src: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop', alt: 'Doctor with patient' } }, ] ] } ] },
  { id: 'wp2', relatedId: 'cl2', title: 'Community Arts Foundation - Annual Gala 2024', status: WebpageStatus.Published, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), visits: 8765, engagementScore: 92, content: [ { id: 'c-1', type: 'headline', content: { text: 'Join Us for the 2024 Annual Gala' } }, { id: 'c-2', type: 'paragraph', content: { text: 'A night of art, community, and celebration. All proceeds support local artists and programs.' } }, { id: 'c-3', type: 'button', content: { text: 'Buy Tickets', url: '#' } }, ] },
  { id: 'wp3', relatedId: 'cl3', title: 'Youth Empowerment Network - About Us', status: WebpageStatus.Draft, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), visits: 0, engagementScore: 0, content: [], },
  { id: 'wp4', relatedId: 'cl2', title: 'Community Arts Foundation - Past Events', status: WebpageStatus.Archived, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), visits: 15201, engagementScore: 75, content: [ { id: 'c-1', type: 'headline', content: { text: 'A Look Back at Our Events' } }, ], },
  { id: 'wp5', relatedId: 'cl1', title: 'Global Health Initiative - Donate Now', status: WebpageStatus.Draft, lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), visits: 0, engagementScore: 0, content: [], },
  { id: 'wp6', relatedId: 'cl4', title: 'Green Future Alliance - Get Involved', status: WebpageStatus.Published, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), visits: 4208, engagementScore: 81, content: [ { id: 'c-gfa-1', type: 'headline', content: { text: 'Be a Part of the Solution' } }, { id: 'c-gfa-2', type: 'paragraph', content: { text: 'Join us in our mission to create a sustainable future. Volunteer, donate, or spread the word.' } }, ], },
  { id: 'wp7', relatedId: 'cl6', title: 'Animal Rescue Shelter - Adopt a Pet', status: WebpageStatus.Draft, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), visits: 0, engagementScore: 0, content: [], },
  { id: 'wp8', relatedId: 'cl7', title: 'Hope for Paws - Our Animals', status: WebpageStatus.Published, lastUpdated: new Date(Date.now() - 86400000 * 15).toISOString(), visits: 9800, engagementScore: 85, content: [] },
  { id: 'wp9', relatedId: 'cl8', title: 'Future Coders Initiative - Apply Now', status: WebpageStatus.Published, lastUpdated: new Date(Date.now() - 86400000 * 20).toISOString(), visits: 15021, engagementScore: 91, content: [] },
  { id: 'wp10', relatedId: 'cl9', title: 'Urban Garden Project - Volunteer', status: WebpageStatus.Draft, lastUpdated: new Date(Date.now() - 86400000 * 3).toISOString(), visits: 0, engagementScore: 0, content: [] },
  { id: 'wp11', relatedId: 'cl11', title: 'Clean Ocean Collective - Our Impact', status: WebpageStatus.Published, lastUpdated: new Date(Date.now() - 86400000 * 30).toISOString(), visits: 18345, engagementScore: 89, content: [] },
  { id: 'wp12', relatedId: 'cl10', title: 'SSS - Workshop Schedule', status: WebpageStatus.Archived, lastUpdated: new Date(Date.now() - 86400000 * 120).toISOString(), visits: 3412, engagementScore: 72, content: [] },
];

export const mockEvents: Event[] = [
  { id: 'evt1', title: 'Annual Fundraising Gala 2024', clientId: 'cl2', eventDate: '2024-11-15T18:00:00Z', location: 'The Grand Ballroom, New York, NY', description: 'Join us for a night of celebration and fundraising to support community arts. An evening of fine dining, live music, and auctions.', bannerImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop', isPublished: true, schedule: [ { id: 's1-1', time: '06:00 PM', title: 'Cocktail Reception' }, { id: 's1-2', time: '07:00 PM', title: 'Dinner & Welcome Speeches' }, { id: 's1-3', time: '08:30 PM', title: 'Live Auction' }, { id: 's1-4', time: '10:00 PM', title: 'Dancing & Entertainment' }, ], ticketTypes: [ { id: 't1-1', name: 'General Admission', price: 250 }, { id: 't1-2', name: 'VIP Table (8 guests)', price: 2500 }, ], volunteerIds: ['v1', 'v2', 'v9'], },
  { id: 'evt2', title: 'Youth Empowerment Workshop', clientId: 'cl3', eventDate: '2024-12-05T09:00:00Z', location: 'Community Center, Chicago, IL', description: 'A full-day workshop for young leaders focusing on skill-building, networking, and community projects. Lunch will be provided.', bannerImageUrl: 'https://images.unsplash.com/photo-1517486808906-6538cb3f3479?q=80&w=2070&auto=format&fit=crop', isPublished: false, schedule: [ { id: 's2-1', time: '09:00 AM', title: 'Registration & Breakfast' }, { id: 's2-2', time: '10:00 AM', title: 'Keynote: Leading with Impact' }, { id: 's2-3', time: '12:00 PM', title: 'Lunch & Networking' }, { id: 's2-4', time: '01:00 PM', title: 'Breakout Sessions' }, { id: 's2-5', time: '03:00 PM', title: 'Closing Remarks' }, ], ticketTypes: [ { id: 't2-1', name: 'Student Ticket', price: 25 }, { id: 't2-2', name: 'Free Ticket (Sponsored)', price: 0 }, ], volunteerIds: ['v3', 'v4', 'v8'], },
  { id: 'evt3', title: 'Earth Day Park Cleanup', clientId: 'cl4', eventDate: '2025-04-22T10:00:00Z', location: 'Zilker Park, Austin, TX', description: 'Join the Green Future Alliance for our annual park cleanup event. Help us make our city greener!', bannerImageUrl: 'https://images.unsplash.com/photo-1619973850029-7971a8cf42dc?q=80&w=2070&auto=format&fit=crop', isPublished: true, schedule: [ { id: 's3-1', time: '10:00 AM', title: 'Check-in and Welcome' }, { id: 's3-2', time: '10:30 AM', title: 'Cleanup Activities' }, { id: 's3-3', time: '12:30 PM', title: 'Lunch & Thank You' }, ], ticketTypes: [ { id: 't3-1', name: 'Volunteer RSVP', price: 0 }, ], volunteerIds: ['v2', 'v5'], },
  { id: 'evt4', title: 'Adoption Day at the Shelter', clientId: 'cl7', eventDate: '2025-05-18T11:00:00Z', location: 'Hope for Paws Shelter, Los Angeles, CA', description: 'Come meet your new best friend! We will have dozens of dogs and cats ready for their forever homes.', bannerImageUrl: 'https://images.unsplash.com/photo-1598875184988-5e67b1a8e6b0?q=80&w=2070&auto=format&fit=crop', isPublished: false, schedule: [], ticketTypes: [], volunteerIds: ['v7'], },
  { id: 'evt5', title: 'FCI Demo Day', clientId: 'cl8', eventDate: '2024-07-15T17:00:00Z', location: 'Seattle Tech Hub, Seattle, WA', description: 'Our first cohort of students from the Future Coders Initiative will present their final projects.', bannerImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop', isPublished: true, schedule: [ { id: 's5-1', time: '05:00 PM', title: 'Networking & Welcome' }, { id: 's5-2', time: '06:00 PM', title: 'Student Presentations' }, { id: 's5-3', time: '07:30 PM', title: 'Judges Deliberation & Awards' }, ], ticketTypes: [ { id: 't5-1', name: 'RSVP', price: 0 } ], volunteerIds: ['v10'], },
  { id: 'evt6', title: 'Harvest Festival', clientId: 'cl9', eventDate: '2024-10-12T12:00:00Z', location: 'Portland Community Gardens, Portland, OR', description: 'Celebrate the first harvest from our new community gardens with food, music, and activities for the whole family.', bannerImageUrl: 'https://images.unsplash.com/photo-1574007300185-35e941537446?q=80&w=2070&auto=format&fit=crop', isPublished: true, schedule: [], ticketTypes: [ { id: 't6-1', name: 'General Admission', price: 10 }, { id: 't6-2', name: 'Family Pass (4 tickets)', price: 30 } ], volunteerIds: ['v5', 'v12'], },
  { id: 'evt7', title: 'Tech for Seniors Workshop', clientId: 'cl10', eventDate: '2024-07-20T10:00:00Z', location: 'Boston Public Library, Boston, MA', description: 'Our first workshop helping seniors learn how to use smartphones and connect with family online.', bannerImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop', isPublished: true, schedule: [], ticketTypes: [ { id: 't7-1', name: 'Free Registration', price: 0 } ], volunteerIds: [], },
  { id: 'evt8', title: 'Save Our Seas Gala', clientId: 'cl11', eventDate: '2024-09-28T18:00:00Z', location: 'San Diego Aquarium, San Diego, CA', description: 'A fundraiser to support our ocean cleanup and conservation efforts.', bannerImageUrl: 'https://images.unsplash.com/photo-1544405784-5d5395a1a4b4?q=80&w=2036&auto=format&fit=crop', isPublished: false, schedule: [], ticketTypes: [], volunteerIds: ['v2'], },
];

export const mockEmailCampaigns: EmailCampaign[] = [
    {
        id: 'ec1',
        name: 'Q3 Newsletter',
        status: 'Sent',
        subject: '🚀 Our Third Quarter Achievements & What\'s Next!',
        body: `Hello Team,\n\nWhat an incredible quarter it's been! We've made significant strides in our community projects, and it's all thanks to your hard work and dedication.\n\nHere are a few highlights:\n- Successfully launched the "Green Future" initiative, planting over 500 trees.\n- Our "Youth Empowerment" workshop series saw a 40% increase in attendance.\n- We secured a major grant that will fund our "Literacy for All" program for the next two years.\n\nAs we look ahead to Q4, we're excited to build on this momentum. Get ready for our annual fundraising gala and a new volunteer drive!\n\nThank you for everything you do.\n\nBest,\nThe Logos Vision Team`,
        headerImageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop',
        ctaButtonText: 'Read the Full Report',
        ctaButtonUrl: '#',
        recipientSegment: 'All Contacts',
        sentDate: '2024-10-05T10:00:00Z',
        stats: { sent: 450, opened: 180, clicked: 45, unsubscribes: 5 },
        performance: {
            opensOverTime: [
                { hour: 1, count: 50 }, { hour: 2, count: 35 }, { hour: 3, count: 25 },
                { hour: 4, count: 20 }, { hour: 5, count: 15 }, { hour: 6, count: 10 },
                { hour: 8, count: 10 }, { hour: 12, count: 5 }, { hour: 24, count: 10 },
            ]
        }
    },
    {
        id: 'ec2',
        name: 'Gala Early Bird Tickets',
        status: 'Sent',
        subject: '✨ Exclusive Early Bird Access to the 2024 Gala!',
        subjectLineB: 'Your Exclusive Invitation: 2024 Gala Early Bird Tickets',
        body: 'As one of our most valued supporters, we wanted to give you the first opportunity to secure your tickets for the Annual Fundraising Gala. Purchase now to get early bird pricing!',
        recipientSegment: 'Major Donors',
        sentDate: '2024-09-15T14:00:00Z',
        stats: { sent: 85, opened: 68, clicked: 30, unsubscribes: 1 },
        performance: {
             opensOverTime: [
                { hour: 1, count: 40 }, { hour: 2, count: 15 }, { hour: 3, count: 8 },
                { hour: 5, count: 3 }, { hour: 8, count: 2 },
            ]
        }
    },
    {
        id: 'ec3',
        name: 'Volunteer Call - Earth Day',
        status: 'Sent',
        subject: '🌍 We Need You for Earth Day!',
        body: 'Our annual Earth Day cleanup is just around the corner, and we need your help to make it a success! Join us for a day of community action and environmental stewardship.',
        ctaButtonText: 'Sign Up to Volunteer',
        ctaButtonUrl: '#',
        recipientSegment: 'Past Volunteers',
        sentDate: '2024-03-20T09:00:00Z',
        stats: { sent: 220, opened: 110, clicked: 22, unsubscribes: 3 },
    },
    {
        id: 'ec4',
        name: 'End of Year Appeal',
        status: 'Scheduled',
        subject: 'A Look Back, A Leap Forward: Support Our Mission',
        body: 'As the year comes to a close, we reflect on the impact we\'ve made together. Your support can help us continue this vital work in the new year. Please consider a year-end gift.',
        recipientSegment: 'All Contacts',
        scheduleDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        stats: { sent: 0, opened: 0, clicked: 0, unsubscribes: 0 },
    },
    {
        id: 'ec5',
        name: 'Workshop Announcement',
        status: 'Draft',
        subject: 'New Workshop: Grant Writing Essentials',
        body: '',
        recipientSegment: 'Newsletter Subscribers',
        stats: { sent: 0, opened: 0, clicked: 0, unsubscribes: 0 },
    }
];


export const mockPortalLayouts: PortalLayout[] = [
  {
    clientId: 'cl1',
    components: [
      {
        id: 'portal-comp-1',
        type: 'welcome',
        settings: {
          title: 'Welcome, Global Health Initiative!',
          message: 'Here is your central hub for all project updates, tasks, and communications. We are excited to continue our partnership.',
        },
      },
      {
        id: 'portal-comp-2',
        type: 'projects',
        settings: {
          title: 'Your Active Projects',
          itemLimit: 3,
        }
      },
      {
        id: 'portal-comp-3',
        type: 'calendar',
        settings: {
          title: 'Upcoming Schedule',
        }
      },
      {
        id: 'portal-comp-4',
        type: 'donations',
        settings: {
          title: 'Recent Donations',
          itemLimit: 5,
        }
      },
      {
        id: 'portal-comp-5',
        type: 'live-chat',
        settings: {
          title: 'Quick Connect',
        }
      },
      {
        id: 'portal-comp-6',
        type: 'ai-chat-bot',
        settings: {
            title: 'Logos Helper',
        }
      }
    ],
  },
];