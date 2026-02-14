'use client';

import { TrendingUp, AlertTriangle, Clock, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WorkRequest } from '@/lib/types';

interface StatsOverviewProps {
  requests: WorkRequest[];
}

export function StatsOverview({ requests }: StatsOverviewProps) {
  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === 'new').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    pendingReview: requests.filter((r) => r.status === 'pending-review').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    expired: requests.filter((r) => r.status === 'expired').length,
    slaAtRisk: requests.filter((r) => r.slaStatus === 'at-risk').length,
    slaBreached: requests.filter((r) => r.slaStatus === 'breached').length,
    urgent: requests.filter((r) => r.priority === 'urgent').length,
    high: requests.filter((r) => r.priority === 'high').length,
  };

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.total,
      icon: FileText,
      description: 'All active requests',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'New Requests',
      value: stats.new,
      icon: AlertCircle,
      description: 'Awaiting assignment',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      description: 'Currently being worked',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'SLA Breached',
      value: stats.slaBreached,
      icon: AlertTriangle,
      description: 'Exceeded deadline',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'SLA At Risk',
      value: stats.slaAtRisk,
      icon: Clock,
      description: 'Approaching deadline',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      description: 'Successfully closed',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
