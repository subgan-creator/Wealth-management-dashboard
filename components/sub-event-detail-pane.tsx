'use client';

import { useState } from 'react';
import { X, FileText, MessageSquare, Paperclip, BarChart3, Users, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const totalRequests = requests.length;
  const statusBreakdown = {
    new: requests.filter((r) => r.status === 'new').length,
    'in-progress': requests.filter((r) => r.status === 'in-progress').length,
    'on-hold': requests.filter((r) => r.status === 'on-hold').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    cancelled: requests.filter((r) => r.status === 'cancelled').length,
  };

  const slaBreakdown = {
    'on-track': requests.filter((r) => r.slaStatus === 'on-track').length,
    'at-risk': requests.filter((r) => r.slaStatus === 'at-risk').length,
    breached: requests.filter((r) => r.slaStatus === 'breached').length,
  };

  // Get unique advisors and clients
  const uniqueAdvisors = Array.from(new Set(requests.map((r) => r.advisorName)));
  const uniqueClients = Array.from(new Set(requests.map((r) => r.clientName)));

  // Get all comments and attachments from requests
  const allComments = requests.flatMap((r) => 
    r.comments.map((c) => ({ ...c, requestId: r.id, requestTitle: r.title }))
  );
  const allAttachments = requests.flatMap((r) => 
    r.attachments.map((a) => ({ ...a, requestId: r.id, requestTitle: r.title }))
  );

  // Get recent activity from timeline
  const recentActivity = requests
    .flatMap((r) => 
      r.auditLog.map((entry) => ({ ...entry, requestId: r.id, requestTitle: r.title, date: entry.timestamp }))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return (
    <div className="border-t bg-card animate-in slide-in-from-bottom-5 duration-300 shadow-lg">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{businessEventName}</span>
              <span>›</span>
              <span className="font-medium">{subEvent.name}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Sub-Event Details</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Clock className="h-3.5 w-3.5" />
              Activity ({recentActivity.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2">
              <MessageSquare className="h-3.5 w-3.5" />
              Comments ({allComments.length})
            </TabsTrigger>
            <TabsTrigger value="attachments" className="gap-2">
              <Paperclip className="h-3.5 w-3.5" />
              Attachments ({allAttachments.length})
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <BarChart3 className="h-3.5 w-3.5" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm text-foreground">{subEvent.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Total Requests</p>
                <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Sub-Event ID</p>
                <p className="text-sm font-mono text-foreground">{subEvent.id}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Status Breakdown</p>
                <div className="space-y-2">
                  {Object.entries(statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{status.replace('-', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">SLA Breakdown</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>On Track</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {slaBreakdown['on-track']}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>At Risk</span>
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      {slaBreakdown['at-risk']}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Breached</span>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                      {slaBreakdown.breached}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-foreground">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.userName}</span>
                        <span>·</span>
                        <span>{activity.requestTitle}</span>
                        <span>·</span>
                        <span>{activity.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="mt-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {allComments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No comments yet</p>
              ) : (
                allComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 rounded-lg border bg-muted/30">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{comment.userName}</p>
                        {comment.isInternal && (
                          <Badge variant="outline" className="text-xs">Internal</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{comment.requestTitle}</span>
                        <span>·</span>
                        <span>{comment.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="mt-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allAttachments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No attachments</p>
              ) : (
                allAttachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Paperclip className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{attachment.requestTitle}</span>
                        <span>·</span>
                        <span>{(attachment.fileSize / 1024).toFixed(1)} KB</span>
                        <span>·</span>
                        <span>{attachment.uploadedByName}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Active Participants</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{uniqueAdvisors.length}</p>
                      <p className="text-xs text-muted-foreground">Advisors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{uniqueClients.length}</p>
                      <p className="text-xs text-muted-foreground">Clients</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Top Advisors</p>
                <div className="space-y-2">
                  {uniqueAdvisors.slice(0, 5).map((advisor) => {
                    const count = requests.filter((r) => r.advisorName === advisor).length;
                    return (
                      <div key={advisor} className="flex items-center justify-between text-sm">
                        <span className="truncate">{advisor}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
