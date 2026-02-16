'use client';

import { useState } from 'react';
import { X, MessageSquare, Paperclip, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { SubEvent, WorkRequest } from '@/lib/types';

interface SubEventDetailPaneProps {
  subEvent: SubEvent;
  businessEventName: string;
  requests: WorkRequest[];
  onClose: () => void;
}

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800' },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  'on-hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800' },
  'pending-review': { label: 'Pending Review', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Expired', color: 'bg-orange-100 text-orange-800' },
};

const priorityConfig = {
  low: { label: 'Low', color: 'text-blue-600' },
  normal: { label: 'Normal', color: 'text-gray-600' },
  high: { label: 'High', color: 'text-orange-600' },
  urgent: { label: 'Urgent', color: 'text-red-600' },
};

export function SubEventDetailPane({
  subEvent,
  businessEventName,
  requests,
  onClose,
}: SubEventDetailPaneProps) {
  const [selectedRequest, setSelectedRequest] = useState<WorkRequest | null>(
    requests.length > 0 ? requests[0] : null
  );
  const [activeTab, setActiveTab] = useState('request-details');

  const displayRequests = requests.slice(0, 3); // Show max 3 items in list

  return (
    <div className="border-t bg-card animate-in slide-in-from-bottom-5 duration-300 shadow-lg h-96">
      <div className="flex h-full">
        {/* Left: Request List */}
        <div className="flex-1 border-r overflow-y-auto">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {displayRequests.length} Request{displayRequests.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2">
              {displayRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-all',
                    selectedRequest?.id === request.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{request.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs', statusConfig[request.status as keyof typeof statusConfig]?.color)}
                        >
                          {statusConfig[request.status as keyof typeof statusConfig]?.label || request.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{request.clientName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Request Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedRequest ? (
            <div className="px-4 py-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{businessEventName} › {subEvent.name}</p>
                  <h4 className="text-sm font-semibold text-foreground">{selectedRequest.title}</h4>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 shrink-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="h-8 text-xs">
                  <TabsTrigger value="request-details" className="text-xs">Details</TabsTrigger>
                  <TabsTrigger value="comments" className="text-xs">Comments</TabsTrigger>
                  <TabsTrigger value="attachments" className="text-xs">Files</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                </TabsList>

                {/* Request Details Tab */}
                <TabsContent value="request-details" className="mt-2 space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Status & Priority</p>
                    <div className="flex gap-2">
                      <Badge className={statusConfig[selectedRequest.status as keyof typeof statusConfig]?.color}>
                        {statusConfig[selectedRequest.status as keyof typeof statusConfig]?.label}
                      </Badge>
                      <Badge variant="outline">
                        {priorityConfig[selectedRequest.priority as keyof typeof priorityConfig]?.label}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Client</p>
                      <p className="text-sm text-foreground">{selectedRequest.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Advisor</p>
                      <p className="text-sm text-foreground">{selectedRequest.advisorName}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">SLA Status</p>
                    <div className="flex items-center gap-2">
                      {selectedRequest.slaStatus === 'on-track' && (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">On Track</span>
                        </>
                      )}
                      {selectedRequest.slaStatus === 'at-risk' && (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
                          <span className="text-xs text-orange-600 font-medium">At Risk</span>
                        </>
                      )}
                      {selectedRequest.slaStatus === 'breached' && (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">Breached</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Due Date</p>
                    <p className="text-sm text-foreground">{selectedRequest.dueDate.toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                    <p className="text-sm text-foreground">{selectedRequest.createdAt.toLocaleDateString()}</p>
                  </div>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {selectedRequest.comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No comments yet</p>
                  ) : (
                    selectedRequest.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2 p-2 rounded-lg bg-muted/30">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {comment.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{comment.userName}</p>
                          <p className="text-xs text-foreground mt-0.5">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* Attachments Tab */}
                <TabsContent value="attachments" className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {selectedRequest.attachments.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No attachments</p>
                  ) : (
                    selectedRequest.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{attachment.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {selectedRequest.auditLog.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No activity yet</p>
                  ) : (
                    selectedRequest.auditLog.map((entry) => (
                      <div key={entry.id} className="flex gap-2 text-xs">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground">{entry.action}</p>
                          <p className="text-muted-foreground">{entry.userName} · {entry.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No requests to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
