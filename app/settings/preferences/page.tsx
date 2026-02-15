'use client';

import { useState } from 'react';
import { Bell, Eye, EyeOff, Mail, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockBusinessEvents, mockUsers } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

export default function PreferencesPage() {
  const { currentUser, setCurrentUser } = useUser();
  const [visibleEvents, setVisibleEvents] = useState<string[]>(
    currentUser.preferences.visibleBusinessEvents || []
  );
  const [notificationPrefs, setNotificationPrefs] = useState(
    currentUser.preferences.notifications || {
      inApp: true,
      email: true,
      slaWarnings: true,
      assignments: true,
      statusUpdates: true,
    }
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleEventToggle = (eventId: string, checked: boolean) => {
    const updated = checked
      ? [...visibleEvents, eventId]
      : visibleEvents.filter((id) => id !== eventId);
    setVisibleEvents(updated);
    setHasChanges(true);
  };

  const handleSelectAll = () => {
    setVisibleEvents(mockBusinessEvents.map((e) => e.id));
    setHasChanges(true);
  };

  const handleDeselectAll = () => {
    setVisibleEvents([]);
    setHasChanges(true);
  };

  const handleNotificationToggle = (key: keyof typeof notificationPrefs, value: boolean) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would update the backend
    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        visibleBusinessEvents: visibleEvents,
        notifications: notificationPrefs,
      },
    };

    // Update the user in the mock data
    const userIndex = mockUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    setCurrentUser(currentUser.id);
    setHasChanges(false);

    console.log('[v0] User preferences saved:', {
      visibleEvents,
      notifications: notificationPrefs,
    });
  };

  const handleReset = () => {
    setVisibleEvents(currentUser.preferences.visibleBusinessEvents);
    setNotificationPrefs(currentUser.preferences.notifications);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Customize your dashboard experience and notification settings
        </p>
      </div>

      {hasChanges && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Click "Save Changes" to apply your preferences.
          </AlertDescription>
        </Alert>
      )}

      {/* Role & Access Information - Moved to top */}
      <Card className="bg-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle>Role & Access Information</CardTitle>
          <CardDescription>Your current role and access level in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">User Role</Label>
              <p className="text-base font-semibold mt-1 capitalize">{currentUser.role}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Channel</Label>
              <p className="text-base font-semibold mt-1 capitalize">{currentUser.channel}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Team Assignment</Label>
              <p className="text-base font-semibold mt-1">{currentUser.teamId || 'No team'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="text-base font-semibold mt-1 break-all">{currentUser.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout for Event Access and Notifications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Event Access Control */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Business Event Access
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Select which business events you want to see in your dashboard
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{visibleEvents.length}</span> of{' '}
                {mockBusinessEvents.length} visible
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid gap-2 flex-1">
              {mockBusinessEvents.map((event) => {
                const isVisible = visibleEvents.includes(event.id);
                const isExpanded = expandedEvents.has(event.id);
                const subEventCount = event.subEvents.length;

                return (
                  <div key={event.id} className="rounded-md border bg-card">
                    {/* Parent Business Event */}
                    <div className="flex items-center gap-2 p-3">
                      <button
                        onClick={() => toggleEventExpansion(event.id)}
                        className="flex items-center justify-center w-5 h-5 rounded hover:bg-muted transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <Checkbox
                        id={event.id}
                        checked={isVisible}
                        onCheckedChange={(checked) => handleEventToggle(event.id, checked as boolean)}
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={event.id}
                          className="text-sm font-semibold cursor-pointer flex items-center gap-2"
                        >
                          {event.name}
                          {isVisible ? (
                            <Eye className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Label>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {subEventCount} sub-event{subEventCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    {/* Sub-Events */}
                    {isExpanded && subEventCount > 0 && (
                      <div className="border-t bg-muted/20 px-3 py-2">
                        <div className="grid gap-1.5 ml-7">
                          {event.subEvents.map((subEvent) => (
                            <div
                              key={subEvent.id}
                              className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-4 h-px bg-border" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground">
                                  {subEvent.name}
                                </p>
                                {subEvent.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {subEvent.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="mt-1.5">
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {/* In-App Notifications */}
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <Bell className="h-4 w-4" />
                    In-App Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Dashboard notification center
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.inApp}
                  onCheckedChange={(checked) => handleNotificationToggle('inApp', checked)}
                />
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Email alerts for updates
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.email}
                  onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                />
              </div>

              {/* SLA Warnings */}
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    SLA Warnings
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Approaching or breached deadlines
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.slaWarnings}
                  onCheckedChange={(checked) => handleNotificationToggle('slaWarnings', checked)}
                />
              </div>

              {/* Request Assignments */}
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Request Assignments
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    New assignments to you or team
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.assignments}
                  onCheckedChange={(checked) => handleNotificationToggle('assignments', checked)}
                />
              </div>

              {/* Status Updates */}
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <Info className="h-4 w-4 text-accent" />
                    Status Updates
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Request status changes
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.statusUpdates}
                  onCheckedChange={(checked) => handleNotificationToggle('statusUpdates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
