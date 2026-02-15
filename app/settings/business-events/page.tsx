'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { mockBusinessEvents } from '@/lib/mock-data';
import type { BusinessEvent, SubEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function BusinessEventsConfig() {
  const [events, setEvents] = useState<BusinessEvent[]>(mockBusinessEvents);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [editingEvent, setEditingEvent] = useState<BusinessEvent | null>(null);
  const [editingSubEvent, setEditingSubEvent] = useState<{ event: BusinessEvent; subEvent: SubEvent } | null>(
    null
  );
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingSubEvent, setIsAddingSubEvent] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '' });

  const toggleExpanded = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleAddEvent = () => {
    setFormData({ name: '', description: '' });
    setIsAddingEvent(true);
  };

  const handleEditEvent = (event: BusinessEvent) => {
    setFormData({ name: event.name, description: event.description });
    setEditingEvent(event);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this business event?')) {
      setEvents(events.filter((e) => e.id !== eventId));
    }
  };

  const handleSaveEvent = () => {
    if (!formData.name.trim()) return;

    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id ? { ...e, name: formData.name, description: formData.description } : e
        )
      );
      setEditingEvent(null);
    } else {
      // Add new event
      const newEvent: BusinessEvent = {
        id: `be-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        subEvents: [],
      };
      setEvents([...events, newEvent]);
      setIsAddingEvent(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleAddSubEvent = (eventId: string) => {
    setFormData({ name: '', description: '' });
    setIsAddingSubEvent(eventId);
  };

  const handleEditSubEvent = (event: BusinessEvent, subEvent: SubEvent) => {
    setFormData({ name: subEvent.name, description: subEvent.description });
    setEditingSubEvent({ event, subEvent });
  };

  const handleDeleteSubEvent = (eventId: string, subEventId: string) => {
    if (confirm('Are you sure you want to delete this sub-event?')) {
      setEvents(
        events.map((e) =>
          e.id === eventId ? { ...e, subEvents: e.subEvents.filter((se) => se.id !== subEventId) } : e
        )
      );
    }
  };

  const handleSaveSubEvent = () => {
    if (!formData.name.trim()) return;

    if (editingSubEvent) {
      // Update existing sub-event
      setEvents(
        events.map((e) =>
          e.id === editingSubEvent.event.id
            ? {
                ...e,
                subEvents: e.subEvents.map((se) =>
                  se.id === editingSubEvent.subEvent.id
                    ? { ...se, name: formData.name, description: formData.description }
                    : se
                ),
              }
            : e
        )
      );
      setEditingSubEvent(null);
    } else if (isAddingSubEvent) {
      // Add new sub-event
      const newSubEvent: SubEvent = {
        id: `se-${Date.now()}`,
        name: formData.name,
        description: formData.description,
      };
      setEvents(
        events.map((e) =>
          e.id === isAddingSubEvent ? { ...e, subEvents: [...e.subEvents, newSubEvent] } : e
        )
      );
      setIsAddingSubEvent(null);
    }
    setFormData({ name: '', description: '' });
  };

  const handleCloseDialog = () => {
    setIsAddingEvent(false);
    setEditingEvent(null);
    setIsAddingSubEvent(null);
    setEditingSubEvent(null);
    setFormData({ name: '', description: '' });
  };

  const isDialogOpen = isAddingEvent || !!editingEvent || !!isAddingSubEvent || !!editingSubEvent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Business Events Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage business events and their sub-events. Drag to reorder.
          </p>
        </div>
        <Button onClick={handleAddEvent} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Business Event
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => {
          const isExpanded = expandedEvents.has(event.id);

          return (
            <Card key={event.id} className="p-0 overflow-hidden">
              {/* Event Header */}
              <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <button className="cursor-grab hover:bg-muted rounded p-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>

                <button onClick={() => toggleExpanded(event.id)} className="flex items-center gap-2 flex-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{event.name}</div>
                    <div className="text-sm text-muted-foreground">{event.description}</div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {event.subEvents.length} sub-events
                  </Badge>
                </button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sub-Events */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Sub-Events</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSubEvent(event.id)}
                      className="gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add Sub-Event
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {event.subEvents.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No sub-events yet. Click &quot;Add Sub-Event&quot; to create one.
                      </div>
                    ) : (
                      event.subEvents.map((subEvent) => (
                        <div
                          key={subEvent.id}
                          className="flex items-center gap-3 p-3 bg-card rounded-md border border-border"
                        >
                          <button className="cursor-grab hover:bg-muted rounded p-1">
                            <GripVertical className="h-3 w-3 text-muted-foreground" />
                          </button>

                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground">{subEvent.name}</div>
                            <div className="text-xs text-muted-foreground">{subEvent.description}</div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditSubEvent(event, subEvent)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteSubEvent(event.id, subEvent.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {events.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No business events configured yet.</p>
            <Button onClick={handleAddEvent} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Business Event
            </Button>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent && 'Edit Business Event'}
              {isAddingEvent && 'Add Business Event'}
              {editingSubEvent && 'Edit Sub-Event'}
              {isAddingSubEvent && 'Add Sub-Event'}
            </DialogTitle>
            <DialogDescription>
              {(editingEvent || isAddingEvent) &&
                'Business events represent major categories of work requests.'}
              {(editingSubEvent || isAddingSubEvent) && 'Sub-events provide additional categorization.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={editingSubEvent || isAddingSubEvent ? handleSaveSubEvent : handleSaveEvent}
            >
              {editingEvent || editingSubEvent ? 'Save Changes' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
