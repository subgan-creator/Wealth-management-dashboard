'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BusinessEventTree } from '@/components/business-event-tree';
import { StatsOverview } from '@/components/stats-overview';
import { SearchFilters } from '@/components/search-filters';
import { RequestList } from '@/components/request-list';
import { RequestDetail } from '@/components/request-detail';
import { CreateRequestDialog } from '@/components/create-request-dialog';
import { mockRequests, mockBusinessEvents } from '@/lib/mock-data';
import type { WorkRequest, SearchFilters as SearchFiltersType } from '@/lib/types';

export default function DashboardPage() {
  const [selectedBusinessEventId, setSelectedBusinessEventId] = useState<string | undefined>('all');
  const [selectedSubEventId, setSelectedSubEventId] = useState<string | undefined>();
  const [selectedRequest, setSelectedRequest] = useState<WorkRequest | undefined>();
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [requests, setRequests] = useState<WorkRequest[]>(mockRequests);

  const handleCreateRequest = (newRequestData: Omit<WorkRequest, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    const newRequest: WorkRequest = {
      ...newRequestData,
      id: `REQ-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          date: new Date(),
          action: 'Request created',
          user: newRequestData.advisorName,
        },
      ],
    };

    setRequests([newRequest, ...requests]);
    console.log('[v0] New request created:', newRequest);
  };

  // Filter requests based on business event, sub-event, and search filters
  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    // Filter by business event
    if (selectedBusinessEventId && selectedBusinessEventId !== 'all') {
      filtered = filtered.filter((req) => req.businessEventId === selectedBusinessEventId);

      // Filter by sub-event
      if (selectedSubEventId) {
        filtered = filtered.filter((req) => req.subEventId === selectedSubEventId);
      }
    }

    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.title.toLowerCase().includes(query) ||
          req.clientName.toLowerCase().includes(query) ||
          req.advisorName.toLowerCase().includes(query) ||
          req.id.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter((req) => filters.statuses!.includes(req.status));
    }

    // Apply priority filters
    if (filters.priorities && filters.priorities.length > 0) {
      filtered = filtered.filter((req) => filters.priorities!.includes(req.priority));
    }

    // Apply SLA status filters
    if (filters.slaStatuses && filters.slaStatuses.length > 0) {
      filtered = filtered.filter((req) => filters.slaStatuses!.includes(req.slaStatus));
    }

    // Apply date filters
    if (filters.dateFrom) {
      filtered = filtered.filter((req) => req.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((req) => req.createdAt <= filters.dateTo!);
    }

    // Sort by priority and SLA status
    filtered.sort((a, b) => {
      // Priority order
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // SLA status order
      const slaOrder = { breached: 3, 'at-risk': 2, 'on-track': 1 };
      const slaDiff = slaOrder[b.slaStatus] - slaOrder[a.slaStatus];
      if (slaDiff !== 0) return slaDiff;

      // Newest first
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return filtered;
  }, [selectedBusinessEventId, selectedSubEventId, filters]);

  const handleEventSelect = (businessEventId: string, subEventId?: string) => {
    setSelectedBusinessEventId(businessEventId);
    setSelectedSubEventId(subEventId);
    setSelectedRequest(undefined);
  };

  const handleRequestSelect = (request: WorkRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(undefined);
  };

  const getPageInfo = () => {
    if (selectedBusinessEventId === 'all' || !selectedBusinessEventId) {
      return {
        title: 'Dashboard Overview',
        subtitle: 'Monitor and manage all work requests across your organization',
        showStats: true,
      };
    }

    const businessEvent = mockBusinessEvents.find((be) => be.id === selectedBusinessEventId);
    if (!businessEvent) {
      return { title: 'Requests', subtitle: '', showStats: false };
    }

    if (selectedSubEventId) {
      const subEvent = businessEvent.subEvents.find((se) => se.id === selectedSubEventId);
      return {
        title: `${businessEvent.name} - ${subEvent?.name || 'Sub-Event'}`,
        subtitle: subEvent?.description || businessEvent.description,
        showStats: false,
      };
    }

    return {
      title: businessEvent.name,
      subtitle: businessEvent.description,
      showStats: false,
    };
  };

  const pageInfo = getPageInfo();

  return (
    <DashboardLayout
      sidebar={
        <BusinessEventTree
          onEventSelect={handleEventSelect}
          selectedBusinessEventId={selectedBusinessEventId}
          selectedSubEventId={selectedSubEventId}
        />
      }
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{pageInfo.title}</h2>
            {pageInfo.subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{pageInfo.subtitle}</p>
            )}
          </div>
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Overview - Only show on landing page */}
        {pageInfo.showStats && (
          <div>
            <StatsOverview requests={requests} />
          </div>
        )}

        {/* Search and Filters */}
        <div>
          {!pageInfo.showStats && (
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Requests ({filteredRequests.length})
            </h3>
          )}
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Request List */}
        <div>
          {pageInfo.showStats && (
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">All Requests</h3>
              <p className="text-sm text-muted-foreground">
                {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          <RequestList
            requests={filteredRequests}
            onRequestSelect={handleRequestSelect}
            selectedRequestId={selectedRequest?.id}
          />
        </div>
      </div>

      {/* Request Detail Panel */}
      {selectedRequest && <RequestDetail request={selectedRequest} onClose={handleCloseDetail} />}

      {/* Create Request Dialog */}
      <CreateRequestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateRequest}
      />
    </DashboardLayout>
  );
}
