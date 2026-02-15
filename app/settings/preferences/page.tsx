'use client';

import { useState } from 'react';
import { Bell, Eye, EyeOff, Mail, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
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

      <div className="grid gap-6">
        {/* Event Access Control */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Business Event Access
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Select which business events you want to see in your dashboard. Hidden events won't
                  appear in your navigation or request list.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b">
                <span>
                  {visibleEvents.length} of {mockBusinessEvents.length} events visible
                </span>
                <span>
                  {mockBusinessEvents.length - visibleEvents.length} events hidden
                </span>
              </div>

              <div className="grid gap-3">
                {mockBusinessEvents.map((event) => {
                  const isVisible = visibleEvents.includes(event.id);
                  const subEventCount = event.subEvents.length;

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={event.id}
                        checked={isVisible}
                        onCheckedChange={(checked) => handleEventToggle(event.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={event.id}
                          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                        >
                          {event.name}
                          {isVisible ? (
                            <Eye className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {subEventCount} sub-event{subEventCount !== 1 ? 's' : ''}
                          </Badge>
                          {event.teamId && (
                            <Badge variant="outline" className="text-xs">
                              Team: {event.teamId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="mt-1.5">
              Choose how and when you want to receive notifications about your work requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* In-App Notifications */}
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    In-App Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications in the dashboard notification center
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.inApp}
                  onCheckedChange={(checked) => handleNotificationToggle('inApp', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Email Notifications */}
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for important updates
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.email}
                  onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* SLA Warnings */}
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    SLA Warnings
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when requests are approaching or have breached their SLA deadline
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.slaWarnings}
                  onCheckedChange={(checked) => handleNotificationToggle('slaWarnings', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Request Assignments */}
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Request Assignments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when new requests are assigned to you or your team
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.assignments}
                  onCheckedChange={(checked) => handleNotificationToggle('assignments', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Status Updates */}
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-accent" />
                    Status Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when the status of your requests changes
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

        {/* Role & Access Information */}
        <Card>
          <CardHeader>
            <CardTitle>Role & Access Information</CardTitle>
            <CardDescription>Your current role and access level in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">User Role</Label>
                <p className="text-base font-medium mt-1 capitalize">{currentUser.role}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Team Assignment</Label>
                <p className="text-base font-medium mt-1">{currentUser.teamId || 'No team'}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">User ID</Label>
                <p className="text-base font-medium mt-1 font-mono text-sm">{currentUser.id}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-base font-medium mt-1">{currentUser.email}</p>
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
