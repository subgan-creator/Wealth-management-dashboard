'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, User, Building2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { WorkRequest, RequestPriority, RequestStatus, SLAStatus } from '@/lib/types';
import { mockBusinessEvents } from '@/lib/mock-data';

interface RequestListProps {
  requests: WorkRequest[];
  onRequestSelect: (request: WorkRequest) => void;
  selectedRequestId?: string;
}

const priorityConfig: Record<RequestPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  normal: { label: 'Normal', className: 'bg-secondary text-secondary-foreground' },
  high: { label: 'High', className: 'bg-warning text-warning-foreground' },
  urgent: { label: 'Urgent', className: 'bg-destructive text-destructive-foreground' },
};

const statusConfig: Record<RequestStatus, { label: string; icon: React.ReactNode; className: string }> = {
  new: {
    label: 'New',
    icon: <AlertCircle className="h-3 w-3" />,
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  'in-progress': {
    label: 'In Progress',
    icon: <TrendingUp className="h-3 w-3" />,
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'pending-review': {
    label: 'Pending Review',
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: 'bg-success/10 text-success border-success/20',
  },
  expired: {
    label: 'Expired',
    icon: <AlertCircle className="h-3 w-3" />,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  cancelled: {
    label: 'Cancelled',
    icon: <AlertCircle className="h-3 w-3" />,
    className: 'bg-muted text-muted-foreground border-muted',
  },
};

const slaConfig: Record<SLAStatus, { className: string; label: string }> = {
  'on-track': { className: 'text-success', label: 'On Track' },
  'at-risk': { className: 'text-warning', label: 'At Risk' },
  breached: { className: 'text-destructive', label: 'Breached' },
};

export function RequestList({ requests, onRequestSelect, selectedRequestId }: RequestListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTimeRemaining = (request: WorkRequest) => {
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
        text: `${hoursOverdue}h overdue`,
        className: 'text-destructive font-semibold',
      };
    }

    if (hoursRemaining < 2) {
      return {
        text: `${hoursRemaining}h ${minutesRemaining}m left`,
        className: 'text-destructive font-semibold',
      };
    }

    if (hoursRemaining < 8) {
      return {
        text: `${hoursRemaining}h left`,
        className: 'text-warning font-medium',
      };
    }

    return {
      text: `${hoursRemaining}h left`,
      className: 'text-muted-foreground',
    };
  };

  const getBusinessEventName = (businessEventId: string) => {
    return mockBusinessEvents.find((e) => e.id === businessEventId)?.name || 'Unknown';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-12 w-12" />
          <div>
            <p className="text-lg font-medium">No requests found</p>
            <p className="text-sm">Try adjusting your filters or search criteria</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const timeRemaining = formatTimeRemaining(request);
        const isSelected = selectedRequestId === request.id;
        const statusInfo = statusConfig[request.status];
        const priorityInfo = priorityConfig[request.priority];

        return (
          <Card
            key={request.id}
            onClick={() => onRequestSelect(request)}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md border-l-4',
              isSelected
                ? 'border-l-primary bg-accent/5 shadow-md'
                : 'border-l-transparent hover:border-l-primary/30',
              request.slaStatus === 'breached' && 'border-l-destructive',
              request.slaStatus === 'at-risk' && !isSelected && 'border-l-warning'
            )}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{request.title}</h3>
                  <p className="text-xs text-muted-foreground">{getBusinessEventName(request.businessEventId)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn('text-xs border', statusInfo.className)}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.label}</span>
                  </Badge>
                  <Badge className={cn('text-xs', priorityInfo.className)}>{priorityInfo.label}</Badge>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{request.clientName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{request.advisorName}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {mounted
                      ? `Created ${formatDate(request.createdAt)}`
                      : `Created ${request.createdAt.toLocaleDateString()}`}
                  </span>
                </div>
                {mounted && timeRemaining && (
                  <div className={cn('flex items-center gap-1.5 text-xs', timeRemaining.className)}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span className="font-medium">{timeRemaining.text}</span>
                  </div>
                )}
              </div>

              {/* SLA Indicator */}
              {request.slaStatus !== 'on-track' && request.status !== 'completed' && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-2 flex-1 rounded-full bg-muted',
                        request.slaStatus === 'breached' && 'bg-destructive',
                        request.slaStatus === 'at-risk' && 'bg-warning'
                      )}
                    >
                      <div
                        className={cn(
                          'h-full rounded-full',
                          request.slaStatus === 'breached' && 'bg-destructive',
                          request.slaStatus === 'at-risk' && 'bg-warning'
                        )}
                        style={{ width: request.slaStatus === 'breached' ? '100%' : '75%' }}
                      />
                    </div>
                    <span className={cn('text-xs font-medium', slaConfig[request.slaStatus].className)}>
                      {slaConfig[request.slaStatus].label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
