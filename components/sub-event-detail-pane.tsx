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

  // Get unique advisors and clients
  const uniqueAdvisors = new Set(requests.map((r) => r.advisorName)).size;
  const uniqueClients = new Set(requests.map((r) => r.clientName)).size;

  // Calculate average processing time (mock data)
  const avgProcessingTime = '2.5 days';

  return (
    <div className="border-t bg-muted/30 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>{businessEventName}</span>
              <span>›</span>
              <span>Sub-Event Details</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">{subEvent.name}</h3>
            {subEvent.description && (
              <p className="text-sm text-muted-foreground mt-1">{subEvent.description}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Total Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          {/* New Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                New
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{newRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending review</p>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">Being processed</p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully done</p>
            </CardContent>
          </Card>

          {/* SLA At Risk */}
          <Card className="border-warning/50 bg-warning/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-warning flex items-center gap-1">
                <Clock className="h-3 w-3" />
                SLA At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{slaAtRisk}</div>
              <p className="text-xs text-muted-foreground mt-1">Need attention</p>
            </CardContent>
          </Card>

          {/* SLA Breached */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                SLA Breached
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{slaBreached}</div>
              <p className="text-xs text-muted-foreground mt-1">Overdue</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{uniqueAdvisors}</p>
              <p className="text-xs text-muted-foreground">Active Advisors</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{uniqueClients}</p>
              <p className="text-xs text-muted-foreground">Unique Clients</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{avgProcessingTime}</p>
              <p className="text-xs text-muted-foreground">Avg Processing Time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Last 30 days</p>
              <p className="text-xs text-muted-foreground">Data Period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
