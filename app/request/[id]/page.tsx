'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  User,
  Building2,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Save,
  X,
  Send,
  Paperclip,
  Download,
  FileText,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { mockRequests, mockBusinessEvents, mockUsers, mockTeams } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';
import type { WorkRequest, RequestStatus, RequestPriority, Comment, Attachment } from '@/lib/types';

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser } = useUser();
  const requestId = params.id as string;

  const [request, setRequest] = useState<WorkRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState<Partial<WorkRequest>>({});
  const [newComment, setNewComment] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    const foundRequest = mockRequests.find((r) => r.id === requestId);
    if (foundRequest) {
      setRequest(foundRequest);
      setEditedRequest(foundRequest);
    }
  }, [requestId]);

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
          <p className="text-muted-foreground mb-4">The request you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const businessEvent = mockBusinessEvents.find((be) => be.id === request.businessEventId);
  const subEvent = businessEvent?.subEvents.find((se) => se.id === request.subEventId);
  const assignedUser = mockUsers.find((u) => u.id === request.assignedUserId);

  const handleSaveEdit = () => {
    // Update the request with edited values
    setRequest({ ...request, ...editedRequest, updatedAt: new Date() });
    setIsEditing(false);
    console.log('[v0] Request updated:', editedRequest);
  };

  const handleCancelEdit = () => {
    setEditedRequest(request);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      content: newComment,
      createdAt: new Date(),
      isInternal: true,
    };

    setRequest({
      ...request,
      comments: [...request.comments, comment],
      updatedAt: new Date(),
    });
    setNewComment('');
    console.log('[v0] Comment added:', comment);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);

    // Simulate file upload
    setTimeout(() => {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: `attachment-${Date.now()}-${Math.random()}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: currentUser.id,
        uploadedByName: currentUser.name,
        uploadedAt: new Date(),
        url: URL.createObjectURL(file),
      }));

      setRequest({
        ...request,
        attachments: [...request.attachments, ...newAttachments],
        updatedAt: new Date(),
      });
      setUploadingFile(false);
      console.log('[v0] Files uploaded:', newAttachments);
    }, 1000);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setRequest({
      ...request,
      attachments: request.attachments.filter((a) => a.id !== attachmentId),
      updatedAt: new Date(),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusColor = (status: RequestStatus) => {
    const colors = {
      new: 'bg-blue-500/10 text-blue-700 border-blue-300',
      'in-progress': 'bg-yellow-500/10 text-yellow-700 border-yellow-300',
      'pending-review': 'bg-purple-500/10 text-purple-700 border-purple-300',
      completed: 'bg-green-500/10 text-green-700 border-green-300',
      expired: 'bg-red-500/10 text-red-700 border-red-300',
      cancelled: 'bg-gray-500/10 text-gray-700 border-gray-300',
    };
    return colors[status] || colors.new;
  };

  const getPriorityColor = (priority: RequestPriority) => {
    const colors = {
      low: 'bg-gray-500/10 text-gray-700 border-gray-300',
      normal: 'bg-blue-500/10 text-blue-700 border-blue-300',
      high: 'bg-orange-500/10 text-orange-700 border-orange-300',
      urgent: 'bg-red-500/10 text-red-700 border-red-300',
    };
    return colors[priority];
  };

  const getSLAColor = () => {
    const colors = {
      'on-track': 'text-green-600',
      'at-risk': 'text-yellow-600',
      breached: 'text-red-600',
    };
    return colors[request.slaStatus];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{request.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">Request ID: {request.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Request
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editedRequest.title || ''}
                        onChange={(e) => setEditedRequest({ ...editedRequest, title: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editedRequest.description || ''}
                        onChange={(e) => setEditedRequest({ ...editedRequest, description: e.target.value })}
                        className="mt-1.5"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={editedRequest.status}
                          onValueChange={(value) =>
                            setEditedRequest({ ...editedRequest, status: value as RequestStatus })
                          }
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="pending-review">Pending Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select
                          value={editedRequest.priority}
                          onValueChange={(value) =>
                            setEditedRequest({ ...editedRequest, priority: value as RequestPriority })
                          }
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="text-sm text-muted-foreground">Description</Label>
                      <p className="text-base mt-1">{request.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Business Event</Label>
                        <p className="text-base font-medium mt-1">{businessEvent?.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Sub-Event</Label>
                        <p className="text-base font-medium mt-1">{subEvent?.name}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Comments & Activity
                </CardTitle>
                <CardDescription>Internal notes and communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()} className="gap-2">
                        <Send className="h-4 w-4" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {request.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    request.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {comment.userName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.createdAt.toLocaleString()}
                            </span>
                            {comment.isInternal && (
                              <Badge variant="secondary" className="text-xs">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attachments Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Paperclip className="h-5 w-5" />
                      Attachments
                    </CardTitle>
                    <CardDescription>Documents and files related to this request</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" disabled={uploadingFile}>
                    <label className="cursor-pointer flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Upload File
                      <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                    </label>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {request.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No attachments yet. Upload files to get started.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {request.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>{formatFileSize(attachment.fileSize)}</span>
                              <span>•</span>
                              <span>Uploaded by {attachment.uploadedByName}</span>
                              <span>•</span>
                              <span>{attachment.uploadedAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={attachment.url} download={attachment.fileName}>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAttachment(attachment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge className={cn('mt-1.5 w-full justify-center py-2', getStatusColor(request.status))}>
                    {request.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Priority</Label>
                  <Badge className={cn('mt-1.5 w-full justify-center py-2', getPriorityColor(request.priority))}>
                    {request.priority.toUpperCase()}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm text-muted-foreground">SLA Status</Label>
                  <div className={cn('mt-1.5 flex items-center gap-2 font-medium', getSLAColor())}>
                    {request.slaStatus === 'breached' && <AlertCircle className="h-4 w-4" />}
                    {request.slaStatus === 'at-risk' && <Clock className="h-4 w-4" />}
                    {request.slaStatus === 'on-track' && <CheckCircle2 className="h-4 w-4" />}
                    <span className="capitalize">{request.slaStatus.replace('-', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Card */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div>
                    <Label>Assigned To</Label>
                    <Select
                      value={editedRequest.assignedUserId}
                      onValueChange={(value) => {
                        const user = mockUsers.find((u) => u.id === value);
                        setEditedRequest({
                          ...editedRequest,
                          assignedUserId: value,
                          assignedUserName: user?.name,
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {assignedUser
                            ? assignedUser.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {assignedUser?.name || request.assignedUserName || 'Unassigned'}
                        </p>
                        {assignedUser && (
                          <p className="text-xs text-muted-foreground capitalize">{assignedUser.role}</p>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Team
                      </Label>
                      <p className="text-sm font-medium mt-1">{request.assignedTeamId || 'No team assigned'}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Client & Advisor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Client & Advisor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                  </Label>
                  <p className="text-sm font-medium mt-1">{request.clientName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">ID: {request.clientId}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Advisor
                  </Label>
                  <p className="text-sm font-medium mt-1">{request.advisorName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">Channel: {request.channel}</p>
                </div>
              </CardContent>
            </Card>

            {/* Audit Log */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.auditLog.map((entry, index) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {index < request.auditLog.length - 1 && (
                          <div className="w-px h-full bg-border my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entry.userName} • {entry.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
