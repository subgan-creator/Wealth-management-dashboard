'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BusinessEventTree } from '@/components/business-event-tree';
import { StatsOverview } from '@/components/stats-overview';
import { CreateRequestDialog } from '@/components/create-request-dialog';
import { mockRequests } from '@/lib/mock-data';
import type { WorkRequest } from '@/lib/types';

export default function OverviewPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [requests, setRequests] = useState<WorkRequest[]>(mockRequests);

  const handleCreateRequest = (newRequestData: Omit<WorkRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: WorkRequest = {
      ...newRequestData,
      id: `REQ-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRequests([newRequest, ...requests]);
  };

  const handleEventSelect = (businessEventId: string, subEventId?: string) => {
    // Navigate to main page with selected event
    window.location.href = `/?event=${businessEventId}${subEventId ? `&subEvent=${subEventId}` : ''}`;
  };

  return (
    <DashboardLayout
      sidebar={
        <BusinessEventTree
          onEventSelect={handleEventSelect}
          selectedBusinessEventId={undefined}
          selectedSubEventId={undefined}
        />
      }
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage all work requests across your organization
            </p>
          </div>
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Overview */}
        <div>
          <StatsOverview requests={requests} />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/?event=all"
            className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">View All Requests</h3>
                <p className="text-sm text-muted-foreground">Browse all work requests</p>
              </div>
            </div>
          </Link>

          <Link
            href="/?event=all&slaStatus=at-risk,breached"
            className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">SLA Alerts</h3>
                <p className="text-sm text-muted-foreground">View at-risk and breached requests</p>
              </div>
            </div>
          </Link>

          <Link
            href="/?event=all&status=new,in-progress"
            className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Active Requests</h3>
                <p className="text-sm text-muted-foreground">View new and in-progress requests</p>
              </div>
            </div>
          </Link>

          <Link
            href="/?event=all&status=completed"
            className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Completed Requests</h3>
                <p className="text-sm text-muted-foreground">View completed work requests</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Create Request Dialog */}
      <CreateRequestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateRequest}
      />
    </DashboardLayout>
  );
}
