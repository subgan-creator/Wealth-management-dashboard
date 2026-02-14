'use client';

import {
  X,
  User,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Tag,
  MessageSquare,
  TrendingUp,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { WorkRequest } from '@/lib/types';
import { mockBusinessEvents, mockTeams } from '@/lib/mock-data';

interface RequestDetailProps {
  request: WorkRequest;
  onClose: () => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-secondary text-secondary-foreground',
  high: 'bg-warning text-warning-foreground',
  urgent: 'bg-destructive text-destructive-foreground',
};

const statusColors = {
  new: 'bg-accent/10 text-accent border-accent/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  'pending-review': 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-success/10 text-success border-success/20',
  expired: 'bg-destructive/10 text-destructive border-destructive/20',
  cancelled: 'bg-muted text-muted-foreground border-muted',
};

export function RequestDetail({ request, onClose }: RequestDetailProps) {
  const businessEvent = mockBusinessEvents.find((e) => e.id === request.businessEventId);
  const subEvent = businessEvent?.subEvents.find((s) => s.id === request.subEventId);
  const team = mockTeams.find((t) => t.id === request.assignedTeamId);

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = () => {
    if (request.status === 'completed' || request.status === 'cancelled') {
      return null;
    }

    const now = new Date();
    const timeRemaining = request.slaBreachAt.getTime() - now.getTime();
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (timeRemaining < 0) {
      const hoursOverdue = Math.abs(hoursRemaining);
      return {
        text: `${hoursOverdue} hours overdue`,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
      };
    }

    if (hoursRemaining < 2) {
      return {
        text: `${hoursRemaining}h ${minutesRemaining}m remaining`,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
      };
    }

    if (hoursRemaining < 8) {
      return {
        text: `${hoursRemaining} hours remaining`,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
      };
    }

    return {
      text: `${hoursRemaining} hours remaining`,
      color: 'text-success',
      bgColor: 'bg-success/10',
    };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-background border-l border-border shadow-2xl overflow-hidden flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn('text-xs border', statusColors[request.status])}>
              {request.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {request.status === 'in-progress' && <TrendingUp className="h-3 w-3 mr-1" />}
              {request.status === 'new' && <AlertCircle className="h-3 w-3 mr-1" />}
              {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
            </Badge>
            <Badge className={priorityColors[request.priority]}>
              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
            </Badge>
          </div>
          <h2 className="text-xl font-semibold text-foreground">{request.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">Request ID: {request.id}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* SLA Status */}
        {timeRemaining && (
          <Card className={cn('border-l-4', timeRemaining.bgColor)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className={cn('h-5 w-5', timeRemaining.color)} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">SLA Status</p>
                  <p className={cn('text-lg font-semibold', timeRemaining.color)}>{timeRemaining.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(request.dueDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
        </div>

        <Separator />

        {/* Business Event Info */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Business Event</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{businessEvent?.name}</p>
                <p className="text-xs text-muted-foreground">{subEvent?.name}</p>
              </div>
            </div>
            {team && (
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Client Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Client Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{request.clientName}</p>
                <p className="text-xs text-muted-foreground">Client ID: {request.clientId}</p>
              </div>
            </div>
            {request.clientEmail && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">{request.clientEmail}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Advisor Information */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Advisor Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{request.advisorName}</p>
                <p className="text-xs text-muted-foreground">
                  {request.channel === 'in-house' ? 'In-House Advisor' : 'Independent Advisor'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment */}
        {request.assignedUserName && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Assigned To</h3>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-foreground">{request.assignedUserName}</p>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm text-foreground">{formatDate(request.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm text-foreground">{formatDate(request.updatedAt)}</p>
              </div>
            </div>
            {request.completedAt && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-sm text-foreground">{formatDate(request.completedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audit Log */}
        {request.auditLog.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Activity Log</h3>
              <div className="space-y-2">
                {request.auditLog.map((entry) => (
                  <div key={entry.id} className="flex gap-2 text-xs">
                    <div className="flex-1">
                      <p className="text-foreground">
                        <span className="font-medium">{entry.userName}</span> {entry.action}
                      </p>
                      <p className="text-muted-foreground">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-border p-6 space-y-2">
        <Button className="w-full">Assign to Me</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">Update Status</Button>
          <Button variant="outline">Add Comment</Button>
        </div>
      </div>
    </div>
  );
}
