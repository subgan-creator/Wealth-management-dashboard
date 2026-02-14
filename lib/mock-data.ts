import type {
  Team,
  BusinessEvent,
  WorkRequest,
  User,
  RoutingRule,
  Notification,
} from './types';

// Teams
export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Account Operations',
    description: 'Manages account opening, maintenance, and closures',
    businessEventIds: ['be-1', 'be-2'],
  },
  {
    id: 'team-2',
    name: 'Money Movement',
    description: 'Handles transfers, wires, and payment processing',
    businessEventIds: ['be-3'],
  },
  {
    id: 'team-3',
    name: 'Investment Operations',
    description: 'Manages trades, rebalancing, and portfolio changes',
    businessEventIds: ['be-4'],
  },
  {
    id: 'team-4',
    name: 'Client Services',
    description: 'General client requests and support',
    businessEventIds: ['be-5'],
  },
  {
    id: 'team-5',
    name: 'Compliance & Documentation',
    description: 'Regulatory compliance and document management',
    businessEventIds: ['be-6'],
  },
];

// Business Events with Sub-events
export const mockBusinessEvents: BusinessEvent[] = [
  {
    id: 'be-1',
    name: 'Account Opening',
    description: 'New account setup and onboarding',
    icon: 'UserPlus',
    color: 'blue',
    teamId: 'team-1',
    isActive: true,
    slaHours: 48,
    routingRules: [],
    subEvents: [
      {
        id: 'se-1-1',
        name: 'New Requests',
        description: 'Newly submitted account opening requests',
        slaHours: 24,
        isActive: true,
      },
      {
        id: 'se-1-2',
        name: 'Pending Documentation',
        description: 'Waiting for client documentation',
        slaHours: 72,
        isActive: true,
      },
      {
        id: 'se-1-3',
        name: 'Compliance Review',
        description: 'Under compliance verification',
        slaHours: 48,
        isActive: true,
      },
      {
        id: 'se-1-4',
        name: 'Priority Requests',
        description: 'High-value or urgent account openings',
        slaHours: 12,
        isActive: true,
      },
      {
        id: 'se-1-5',
        name: 'Expired Requests',
        description: 'Requests that have exceeded SLA',
        isActive: true,
      },
    ],
  },
  {
    id: 'be-2',
    name: 'Account Maintenance',
    description: 'Account updates, changes, and maintenance',
    icon: 'Settings',
    color: 'green',
    teamId: 'team-1',
    isActive: true,
    slaHours: 24,
    routingRules: [],
    subEvents: [
      {
        id: 'se-2-1',
        name: 'Profile Updates',
        description: 'Client information changes',
        slaHours: 24,
        isActive: true,
      },
      {
        id: 'se-2-2',
        name: 'Beneficiary Changes',
        description: 'Beneficiary designation updates',
        slaHours: 48,
        isActive: true,
      },
      {
        id: 'se-2-3',
        name: 'Address Changes',
        description: 'Address and contact updates',
        slaHours: 12,
        isActive: true,
      },
    ],
  },
  {
    id: 'be-3',
    name: 'Money Movement',
    description: 'Transfers, wires, and payment processing',
    icon: 'ArrowLeftRight',
    color: 'orange',
    teamId: 'team-2',
    isActive: true,
    slaHours: 4,
    routingRules: [],
    subEvents: [
      {
        id: 'se-3-1',
        name: 'Wire Transfers',
        description: 'Outgoing wire transfer requests',
        slaHours: 4,
        isActive: true,
      },
      {
        id: 'se-3-2',
        name: 'ACH Transfers',
        description: 'ACH transfer processing',
        slaHours: 24,
        isActive: true,
      },
      {
        id: 'se-3-3',
        name: 'Internal Transfers',
        description: 'Transfers between client accounts',
        slaHours: 2,
        isActive: true,
      },
      {
        id: 'se-3-4',
        name: 'Urgent Requests',
        description: 'Same-day processing required',
        slaHours: 1,
        isActive: true,
      },
    ],
  },
  {
    id: 'be-4',
    name: 'Investment Operations',
    description: 'Trading and portfolio management',
    icon: 'TrendingUp',
    color: 'purple',
    teamId: 'team-3',
    isActive: true,
    slaHours: 24,
    routingRules: [],
    subEvents: [
      {
        id: 'se-4-1',
        name: 'Trade Execution',
        description: 'Buy and sell orders',
        slaHours: 4,
        isActive: true,
      },
      {
        id: 'se-4-2',
        name: 'Portfolio Rebalancing',
        description: 'Portfolio rebalancing requests',
        slaHours: 48,
        isActive: true,
      },
      {
        id: 'se-4-3',
        name: 'Manager Changes',
        description: 'Investment manager transitions',
        slaHours: 72,
        isActive: true,
      },
    ],
  },
  {
    id: 'be-5',
    name: 'Client Services',
    description: 'General client requests and inquiries',
    icon: 'MessageSquare',
    color: 'teal',
    teamId: 'team-4',
    isActive: true,
    slaHours: 24,
    routingRules: [],
    subEvents: [
      {
        id: 'se-5-1',
        name: 'General Inquiries',
        description: 'Client questions and requests',
        slaHours: 24,
        isActive: true,
      },
      {
        id: 'se-5-2',
        name: 'Statement Requests',
        description: 'Account statements and reports',
        slaHours: 48,
        isActive: true,
      },
      {
        id: 'se-5-3',
        name: 'Escalations',
        description: 'Escalated client issues',
        slaHours: 4,
        isActive: true,
      },
    ],
  },
  {
    id: 'be-6',
    name: 'Compliance & Documentation',
    description: 'Regulatory and document management',
    icon: 'FileText',
    color: 'slate',
    teamId: 'team-5',
    isActive: true,
    slaHours: 48,
    routingRules: [],
    subEvents: [
      {
        id: 'se-6-1',
        name: 'Document Verification',
        description: 'Client document review',
        slaHours: 24,
        isActive: true,
      },
      {
        id: 'se-6-2',
        name: 'KYC Updates',
        description: 'Know Your Customer updates',
        slaHours: 48,
        isActive: true,
      },
      {
        id: 'se-6-3',
        name: 'Regulatory Requests',
        description: 'Compliance-related requests',
        slaHours: 12,
        isActive: true,
      },
    ],
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@wealthfirm.com',
    role: 'advisor',
    channel: 'in-house',
    teamId: 'team-1',
    preferences: {
      visibleBusinessEvents: ['be-1', 'be-2', 'be-4', 'be-5'],
      notificationSettings: {
        inApp: true,
        email: true,
        sms: false,
      },
    },
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    email: 'michael.chen@wealthfirm.com',
    role: 'operations',
    teamId: 'team-2',
    preferences: {
      visibleBusinessEvents: ['be-3'],
      notificationSettings: {
        inApp: true,
        email: true,
        sms: true,
      },
    },
  },
  {
    id: 'user-3',
    name: 'Jennifer Torres',
    email: 'jennifer.torres@wealthfirm.com',
    role: 'supervisor',
    teamId: 'team-1',
    preferences: {
      visibleBusinessEvents: ['be-1', 'be-2', 'be-3', 'be-4', 'be-5', 'be-6'],
      notificationSettings: {
        inApp: true,
        email: true,
        sms: false,
      },
    },
  },
  {
    id: 'user-4',
    name: 'David Park',
    email: 'david.park@independent.com',
    role: 'advisor',
    channel: 'independent',
    teamId: 'team-1',
    preferences: {
      visibleBusinessEvents: ['be-1', 'be-2', 'be-4'],
      notificationSettings: {
        inApp: true,
        email: false,
        sms: false,
      },
    },
  },
  {
    id: 'user-5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@wealthfirm.com',
    role: 'client-assistant',
    teamId: 'team-4',
    preferences: {
      visibleBusinessEvents: ['be-5'],
      notificationSettings: {
        inApp: true,
        email: true,
        sms: false,
      },
    },
  },
];

// Generate mock requests
function generateMockRequests(): WorkRequest[] {
  const requests: WorkRequest[] = [];
  const now = new Date();
  
  const sampleRequests = [
    {
      title: 'New Joint Account - Anderson Family Trust',
      businessEventId: 'be-1',
      subEventId: 'se-1-4',
      priority: 'high' as const,
      status: 'in-progress' as const,
      hoursAgo: 2,
      clientName: 'Robert Anderson',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'Wire Transfer to External Bank',
      businessEventId: 'be-3',
      subEventId: 'se-3-1',
      priority: 'urgent' as const,
      status: 'new' as const,
      hoursAgo: 0.5,
      clientName: 'Patricia Williams',
      advisorName: 'David Park',
    },
    {
      title: 'Portfolio Rebalancing Request',
      businessEventId: 'be-4',
      subEventId: 'se-4-2',
      priority: 'normal' as const,
      status: 'pending-review' as const,
      hoursAgo: 18,
      clientName: 'James Thompson',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'Individual Retirement Account Opening',
      businessEventId: 'be-1',
      subEventId: 'se-1-2',
      priority: 'normal' as const,
      status: 'in-progress' as const,
      hoursAgo: 36,
      clientName: 'Maria Garcia',
      advisorName: 'David Park',
    },
    {
      title: 'Beneficiary Designation Update',
      businessEventId: 'be-2',
      subEventId: 'se-2-2',
      priority: 'normal' as const,
      status: 'new' as const,
      hoursAgo: 4,
      clientName: 'William Chen',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'Urgent Wire - Medical Emergency',
      businessEventId: 'be-3',
      subEventId: 'se-3-4',
      priority: 'urgent' as const,
      status: 'new' as const,
      hoursAgo: 0.25,
      clientName: 'Elizabeth Martinez',
      advisorName: 'David Park',
    },
    {
      title: 'KYC Documentation Update Required',
      businessEventId: 'be-6',
      subEventId: 'se-6-2',
      priority: 'high' as const,
      status: 'in-progress' as const,
      hoursAgo: 96,
      clientName: 'Richard Brown',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'ACH Transfer Setup',
      businessEventId: 'be-3',
      subEventId: 'se-3-2',
      priority: 'normal' as const,
      status: 'new' as const,
      hoursAgo: 8,
      clientName: 'Susan Davis',
      advisorName: 'David Park',
    },
    {
      title: 'Address Change Request',
      businessEventId: 'be-2',
      subEventId: 'se-2-3',
      priority: 'low' as const,
      status: 'completed' as const,
      hoursAgo: 72,
      clientName: 'Thomas Wilson',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'Trade Execution - Buy Order',
      businessEventId: 'be-4',
      subEventId: 'se-4-1',
      priority: 'high' as const,
      status: 'in-progress' as const,
      hoursAgo: 2,
      clientName: 'Jennifer Taylor',
      advisorName: 'David Park',
    },
    {
      title: 'Client Statement Request',
      businessEventId: 'be-5',
      subEventId: 'se-5-2',
      priority: 'low' as const,
      status: 'completed' as const,
      hoursAgo: 48,
      clientName: 'Daniel Martinez',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'Escalation - Account Access Issue',
      businessEventId: 'be-5',
      subEventId: 'se-5-3',
      priority: 'urgent' as const,
      status: 'in-progress' as const,
      hoursAgo: 1,
      clientName: 'Nancy Rodriguez',
      advisorName: 'David Park',
    },
    {
      title: 'Trust Account Opening - EXPIRED',
      businessEventId: 'be-1',
      subEventId: 'se-1-5',
      priority: 'normal' as const,
      status: 'expired' as const,
      hoursAgo: 120,
      clientName: 'Christopher Lee',
      advisorName: 'Sarah Mitchell',
    },
    {
      title: 'Internal Account Transfer',
      businessEventId: 'be-3',
      subEventId: 'se-3-3',
      priority: 'normal' as const,
      status: 'new' as const,
      hoursAgo: 1,
      clientName: 'Barbara White',
      advisorName: 'David Park',
    },
    {
      title: 'Investment Manager Transition',
      businessEventId: 'be-4',
      subEventId: 'se-4-3',
      priority: 'high' as const,
      status: 'pending-review' as const,
      hoursAgo: 60,
      clientName: 'Paul Harris',
      advisorName: 'Sarah Mitchell',
    },
  ];

  sampleRequests.forEach((sample, index) => {
    const createdAt = new Date(now.getTime() - sample.hoursAgo * 60 * 60 * 1000);
    const businessEvent = mockBusinessEvents.find(be => be.id === sample.businessEventId);
    const subEvent = businessEvent?.subEvents.find(se => se.id === sample.subEventId);
    const slaHours = subEvent?.slaHours || businessEvent?.slaHours || 24;
    const dueDate = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);
    const slaBreachAt = dueDate;
    
    // Calculate SLA status
    const timeUntilBreach = slaBreachAt.getTime() - now.getTime();
    const hoursUntilBreach = timeUntilBreach / (60 * 60 * 1000);
    let slaStatus: 'on-track' | 'at-risk' | 'breached' = 'on-track';
    
    if (sample.status === 'completed') {
      slaStatus = 'on-track';
    } else if (hoursUntilBreach < 0) {
      slaStatus = 'breached';
    } else if (hoursUntilBreach < slaHours * 0.25) {
      slaStatus = 'at-risk';
    }

    const advisor = mockUsers.find(u => u.name === sample.advisorName);
    const assignedTeam = businessEvent?.teamId;

    requests.push({
      id: `req-${index + 1}`,
      title: sample.title,
      description: `Request details for ${sample.title}`,
      businessEventId: sample.businessEventId,
      subEventId: sample.subEventId,
      status: sample.status,
      priority: sample.priority,
      clientId: `client-${index + 1}`,
      clientName: sample.clientName,
      clientEmail: `${sample.clientName.toLowerCase().replace(' ', '.')}@email.com`,
      advisorId: advisor?.id || 'user-1',
      advisorName: sample.advisorName,
      channel: advisor?.channel || 'in-house',
      assignedTeamId: assignedTeam,
      assignedUserId: sample.status === 'new' ? undefined : 'user-2',
      assignedUserName: sample.status === 'new' ? undefined : 'Michael Chen',
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000),
      dueDate,
      slaBreachAt,
      slaStatus,
      completedAt: sample.status === 'completed' ? new Date(now.getTime() - 24 * 60 * 60 * 1000) : undefined,
      tags: [],
      metadata: {},
      comments: [],
      auditLog: [
        {
          id: `audit-${index + 1}-1`,
          userId: advisor?.id || 'user-1',
          userName: sample.advisorName,
          action: 'Request created',
          timestamp: createdAt,
        },
      ],
    });
  });

  return requests;
}

export const mockRequests = generateMockRequests();

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'sla-warning',
    title: 'SLA Warning',
    message: 'Request "Wire Transfer to External Bank" approaching SLA breach',
    requestId: 'req-2',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'request-assigned',
    title: 'New Assignment',
    message: 'You have been assigned to "Portfolio Rebalancing Request"',
    requestId: 'req-3',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'sla-breach',
    title: 'SLA Breached',
    message: 'Request "Trust Account Opening - EXPIRED" has breached SLA',
    requestId: 'req-13',
    isRead: true,
    createdAt: new Date(Date.now() - 120 * 60 * 1000),
  },
];
