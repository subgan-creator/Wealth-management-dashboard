export type UserRole = 'advisor' | 'banker' | 'client-assistant' | 'operations' | 'supervisor' | 'admin';

export type Channel = 'in-house' | 'independent';

export type RequestStatus = 'new' | 'in-progress' | 'pending-review' | 'completed' | 'expired' | 'cancelled';

export type RequestPriority = 'low' | 'normal' | 'high' | 'urgent';

export type SLAStatus = 'on-track' | 'at-risk' | 'breached';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  channel?: Channel;
  teamId: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  visibleBusinessEvents: string[]; // IDs of business events user can access
  notifications: {
    inApp: boolean;
    email: boolean;
    slaWarnings: boolean;
    assignments: boolean;
    statusUpdates: boolean;
  };
  defaultFilters?: Record<string, any>;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  businessEventIds: string[]; // Business events this team manages
}

export interface BusinessEvent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  subEvents: SubEvent[];
  teamId: string;
  isActive: boolean;
  slaHours: number; // Default SLA in hours
  routingRules: RoutingRule[];
}

export interface SubEvent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  slaHours?: number; // Override default SLA
  isActive: boolean;
}

export interface RoutingRule {
  id: string;
  businessEventId: string;
  subEventId?: string; // Optional: route specific sub-events
  targetTeamId: string;
  targetRoles: UserRole[];
  priority: RequestPriority[];
  conditions?: Record<string, any>; // Additional routing conditions
  isActive: boolean;
}

export interface WorkRequest {
  id: string;
  title: string;
  description: string;
  businessEventId: string;
  subEventId: string;
  status: RequestStatus;
  priority: RequestPriority;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  advisorId: string;
  advisorName: string;
  channel: Channel;
  assignedTeamId?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  completedAt?: Date;
  slaStatus: SLAStatus;
  slaBreachAt: Date; // When SLA will be breached
  tags: string[];
  metadata: Record<string, any>;
  comments: Comment[];
  auditLog: AuditEntry[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  isInternal: boolean; // Internal vs client-facing
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  changes?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'request-assigned' | 'sla-warning' | 'sla-breach' | 'status-change' | 'comment-added' | 'priority-change';
  title: string;
  message: string;
  requestId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalRequests: number;
  newRequests: number;
  inProgress: number;
  pendingReview: number;
  completed: number;
  expired: number;
  slaAtRisk: number;
  slaBreached: number;
  byPriority: Record<RequestPriority, number>;
  byBusinessEvent: Record<string, number>;
}

export interface SearchFilters {
  query?: string;
  businessEventIds?: string[];
  subEventIds?: string[];
  statuses?: RequestStatus[];
  priorities?: RequestPriority[];
  slaStatuses?: SLAStatus[];
  assignedTeamIds?: string[];
  assignedUserIds?: string[];
  clientId?: string;
  advisorId?: string;
  channels?: Channel[];
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
}
