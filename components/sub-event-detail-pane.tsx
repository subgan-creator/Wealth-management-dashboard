'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  onClose,
}: SubEventDetailPaneProps) {
  return (
    <div className="border-t bg-card animate-in slide-in-from-bottom duration-300">
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>{businessEventName}</span>
              <span>›</span>
              <span>{subEvent.name}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm text-foreground">{subEvent.name}</p>
              </div>
              {subEvent.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground">{subEvent.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sub-Event ID</p>
                <p className="text-sm font-mono text-foreground">{subEvent.id}</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
