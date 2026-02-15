'use client';

import { useState } from 'react';
import { Bell, Eye, EyeOff, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { mockBusinessEvents, mockUsers } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

// Type for per-event notification preferences
type EventNotificationPrefs = {
  [eventId: string]: {
    inApp: boolean;
    email: boolean;
  };
};

export default function PreferencesPage() {
  const { currentUser, setCurrentUser } = useUser();
  const [visibleEvents, setVisibleEvents] = useState<string[]>(
    currentUser.preferences.visibleBusinessEvents || []
  );
  
  // Initialize per-event notification preferences
  const initializeEventNotifications = (): EventNotificationPrefs => {
    const prefs: EventNotificationPrefs = {};
    mockBusinessEvents.forEach((event) => {
      prefs[event.id] = { inApp: true, email: true };
      event.subEvents.forEach((subEvent) => {
        prefs[subEvent.id] = { inApp: true, email: false };
      });
    });
    return prefs;
  };

  const [eventNotifications, setEventNotifications] = useState<EventNotificationPrefs>(
    initializeEventNotifications()
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

  const handleEventNotificationToggle = (
    eventId: string,
    type: 'inApp' | 'email',
    value: boolean
  ) => {
    setEventNotifications((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [type]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would update the backend
    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        visibleBusinessEvents: visibleEvents,
        notifications: currentUser.preferences.notifications, // Keep existing structure
        eventNotifications, // Add per-event notifications
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
      eventNotifications,
    });
  };

  const handleReset = () => {
    setVisibleEvents(currentUser.preferences.visibleBusinessEvents);
    setEventNotifications(initializeEventNotifications());
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Customize your dashboard experience and notification settings per business event
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

      {/* Role & Access Information */}
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

      {/* Event Access & Notification Preferences Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Business Event Access & Notifications
              </CardTitle>
              <CardDescription className="mt-1.5">
                Select which events to show and configure notification preferences for each event and sub-event
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Business Event / Sub-Event</div>
              <div className="col-span-2 text-center">Visible</div>
              <div className="col-span-2 text-center flex items-center justify-center gap-1">
                <Bell className="h-3.5 w-3.5" />
                In-App
              </div>
              <div className="col-span-2 text-center flex items-center justify-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Email
              </div>
            </div>

            {/* Event Rows */}
            {mockBusinessEvents.map((event) => {
              const isVisible = visibleEvents.includes(event.id);
              const isExpanded = expandedEvents.has(event.id);
              const subEventCount = event.subEvents.length;

              return (
                <div key={event.id} className="space-y-2">
                  {/* Parent Business Event Row */}
                  <div className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                    <div className="col-span-6 flex items-center gap-2">
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{event.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {subEventCount}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <Checkbox
                        checked={isVisible}
                        onCheckedChange={(checked) => handleEventToggle(event.id, checked as boolean)}
                      />
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <Switch
                        checked={eventNotifications[event.id]?.inApp ?? true}
                        onCheckedChange={(checked) =>
                          handleEventNotificationToggle(event.id, 'inApp', checked)
                        }
                        disabled={!isVisible}
                      />
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <Switch
                        checked={eventNotifications[event.id]?.email ?? true}
                        onCheckedChange={(checked) =>
                          handleEventNotificationToggle(event.id, 'email', checked)
                        }
                        disabled={!isVisible}
                      />
                    </div>
                  </div>

                  {/* Sub-Events */}
                  {isExpanded && subEventCount > 0 && (
                    <div className="ml-8 space-y-2">
                      {event.subEvents.map((subEvent) => (
                        <div
                          key={subEvent.id}
                          className="grid grid-cols-12 gap-4 items-center p-2.5 rounded-md border bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="col-span-6 flex items-center gap-2 pl-4">
                            <div className="w-4 h-px bg-border" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{subEvent.name}</p>
                              {subEvent.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {subEvent.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-span-2 flex justify-center">
                            <span className="text-xs text-muted-foreground">
                              {isVisible ? 'Included' : 'Hidden'}
                            </span>
                          </div>

                          <div className="col-span-2 flex justify-center">
                            <Switch
                              checked={eventNotifications[subEvent.id]?.inApp ?? true}
                              onCheckedChange={(checked) =>
                                handleEventNotificationToggle(subEvent.id, 'inApp', checked)
                              }
                              disabled={!isVisible}
                            />
                          </div>

                          <div className="col-span-2 flex justify-center">
                            <Switch
                              checked={eventNotifications[subEvent.id]?.email ?? false}
                              onCheckedChange={(checked) =>
                                handleEventNotificationToggle(subEvent.id, 'email', checked)
                              }
                              disabled={!isVisible}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
