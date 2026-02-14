'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BusinessEvent, SubEvent } from '@/lib/types';
import { mockBusinessEvents, mockRequests } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

interface BusinessEventTreeProps {
  onEventSelect: (businessEventId: string, subEventId?: string) => void;
  selectedBusinessEventId?: string;
  selectedSubEventId?: string;
}

export function BusinessEventTree({
  onEventSelect,
  selectedBusinessEventId,
  selectedSubEventId,
}: BusinessEventTreeProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set(['be-1', 'be-3']));
  const { currentUser } = useUser();

  // Filter business events based on user preferences
  const visibleEvents = mockBusinessEvents.filter((event) =>
    currentUser.preferences.visibleBusinessEvents.includes(event.id)
  );

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getRequestCount = (businessEventId: string, subEventId?: string) => {
    return mockRequests.filter((req) => {
      const matchesBusinessEvent = req.businessEventId === businessEventId;
      const matchesSubEvent = subEventId ? req.subEventId === subEventId : true;
      const isNotCompleted = req.status !== 'completed';
      return matchesBusinessEvent && matchesSubEvent && isNotCompleted;
    }).length;
  };

  const getSLAWarningCount = (businessEventId: string, subEventId?: string) => {
    return mockRequests.filter((req) => {
      const matchesBusinessEvent = req.businessEventId === businessEventId;
      const matchesSubEvent = subEventId ? req.subEventId === subEventId : true;
      const hasSLAIssue = req.slaStatus === 'at-risk' || req.slaStatus === 'breached';
      return matchesBusinessEvent && matchesSubEvent && hasSLAIssue;
    }).length;
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Business Events
        </h2>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-1 px-2">
        {/* All Requests */}
        <button
          onClick={() => onEventSelect('all')}
          className={cn(
            'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
            !selectedBusinessEventId || selectedBusinessEventId === 'all'
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <span className="font-medium">All Requests</span>
          <Badge variant="secondary" className="ml-2">
            {mockRequests.filter((r) => r.status !== 'completed').length}
          </Badge>
        </button>

        {/* Business Events */}
        {visibleEvents.map((event) => {
          const isExpanded = expandedEvents.has(event.id);
          const isSelected = selectedBusinessEventId === event.id && !selectedSubEventId;
          const eventCount = getRequestCount(event.id);
          const slaWarnings = getSLAWarningCount(event.id);

          return (
            <div key={event.id} className="space-y-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleEvent(event.id)}
                  className="flex items-center justify-center w-5 h-5 rounded hover:bg-muted text-muted-foreground"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onEventSelect(event.id)}
                  className={cn(
                    'flex flex-1 items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                    isSelected
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span className="font-medium truncate">{event.name}</span>
                  <div className="flex items-center gap-1.5 ml-2">
                    {slaWarnings > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {slaWarnings}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {eventCount}
                    </Badge>
                  </div>
                </button>
              </div>

              {/* Sub-events */}
              {isExpanded && (
                <div className="ml-6 space-y-1 border-l border-border pl-2">
                  {event.subEvents.map((subEvent) => {
                    const isSubSelected =
                      selectedBusinessEventId === event.id && selectedSubEventId === subEvent.id;
                    const subEventCount = getRequestCount(event.id, subEvent.id);
                    const subSLAWarnings = getSLAWarningCount(event.id, subEvent.id);

                    return (
                      <button
                        key={subEvent.id}
                        onClick={() => onEventSelect(event.id, subEvent.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                          isSubSelected
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <span className="truncate text-xs">{subEvent.name}</span>
                        <div className="flex items-center gap-1.5 ml-2">
                          {subSLAWarnings > 0 && (
                            <Badge variant="destructive" className="h-4 px-1 text-xs">
                              {subSLAWarnings}
                            </Badge>
                          )}
                          {subEventCount > 0 && (
                            <Badge variant="secondary" className="h-4 px-1 text-xs">
                              {subEventCount}
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 px-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Business Event
        </Button>
      </div>
    </div>
  );
}
