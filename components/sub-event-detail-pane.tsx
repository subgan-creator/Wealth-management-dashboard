'use client';

import { X, Calendar, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { SubEvent, WorkRequest } from '@/lib/types';

interface SubEventDetailPaneProps {
  subEvent: SubEvent;
  businessEventName: string;
  requests: WorkRequest[];
  onClose: () => void;
}

export function SubEventDetailPane({
  subEvent,
  businessEventName,
  requests,
  onClose,
}: SubEventDetailPaneProps) {
  // Calculate statistics for this sub-event
  const totalRequests = requests.length;
  const newRequests = requests.filter((r) => r.status === 'new').length;
  const inProgress = requests.filter((r) => r.status === 'in-progress').length;
  const completed = requests.filter((r) => r.status === 'completed').length;
  const slaBreached = requests.filter((r) => r.slaStatus === 'breached').length;
  const slaAtRisk = requests.filter((r) => r.slaStatus === 'at-risk').length;

  return (
    <div className="border-t bg-card animate-in slide-in-from-bottom duration-300">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{businessEventName}</span>
              <span>›</span>
              <span className="font-medium">Sub-Event Details</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{subEvent.name}</h3>
            {subEvent.description && (
              <p className="text-sm text-muted-foreground mt-1">{subEvent.description}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-6 gap-x-8 gap-y-3 text-sm">
          <div className="col-span-1">
            <p className="text-muted-foreground">Total Requests</p>
            <p className="font-semibold text-foreground mt-0.5">{totalRequests}</p>
          </div>

          <div className="col-span-1">
            <p className="text-muted-foreground">New</p>
            <p className="font-semibold text-foreground mt-0.5">{newRequests}</p>
          </div>

          <div className="col-span-1">
            <p className="text-muted-foreground">In Progress</p>
            <p className="font-semibold text-foreground mt-0.5">{inProgress}</p>
          </div>

          <div className="col-span-1">
            <p className="text-muted-foreground">Completed</p>
            <p className="font-semibold text-success mt-0.5">{completed}</p>
          </div>

          <div className="col-span-1">
            <p className="text-muted-foreground">SLA At Risk</p>
            <p className="font-semibold text-warning mt-0.5">{slaAtRisk}</p>
          </div>

          <div className="col-span-1">
            <p className="text-muted-foreground">SLA Breached</p>
            <p className="font-semibold text-destructive mt-0.5">{slaBreached}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
