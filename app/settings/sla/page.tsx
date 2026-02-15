'use client';

import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockBusinessEvents } from '@/lib/mock-data';

interface SLAConfig {
  businessEventId: string;
  hours: number;
  atRiskThreshold: number; // percentage of time remaining to mark as "at-risk"
}

export default function SLAConfig() {
  const [slaConfigs, setSlaConfigs] = useState<SLAConfig[]>(
    mockBusinessEvents.map((event) => ({
      businessEventId: event.id,
      hours: 48,
      atRiskThreshold: 25,
    }))
  );

  const handleUpdateSLA = (businessEventId: string, field: 'hours' | 'atRiskThreshold', value: number) => {
    setSlaConfigs(
      slaConfigs.map((config) =>
        config.businessEventId === businessEventId ? { ...config, [field]: value } : config
      )
    );
  };

  const handleSaveChanges = () => {
    console.log('[v0] Saving SLA configurations:', slaConfigs);
    alert('SLA configurations saved successfully!');
  };

  const getEventName = (eventId: string) => {
    return mockBusinessEvents.find((e) => e.id === eventId)?.name || eventId;
  };

  const getEventDescription = (eventId: string) => {
    return mockBusinessEvents.find((e) => e.id === eventId)?.description || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SLA Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set Service Level Agreement (SLA) thresholds for each business event type.
          </p>
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-accent/50 border-accent">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-sm text-accent-foreground">About SLA Configuration</div>
            <div className="text-sm text-accent-foreground/80 mt-1">
              SLA hours define the maximum time allowed to complete a request. The at-risk threshold
              determines when to show warnings (e.g., 25% means warn when 75% of time has passed).
            </div>
          </div>
        </div>
      </Card>

      {/* SLA Status Legend */}
      <Card className="p-4">
        <div className="text-sm font-medium mb-3">SLA Status Indicators</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-sm font-medium">On Track</div>
              <div className="text-xs text-muted-foreground">Within SLA timeline</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <div className="text-sm font-medium">At Risk</div>
              <div className="text-xs text-muted-foreground">Approaching deadline</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
              <Clock className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <div className="text-sm font-medium">Breached</div>
              <div className="text-xs text-muted-foreground">Past deadline</div>
            </div>
          </div>
        </div>
      </Card>

      {/* SLA Configuration List */}
      <div className="space-y-3">
        {slaConfigs.map((config) => (
          <Card key={config.businessEventId} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Event Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{getEventName(config.businessEventId)}</h3>
                  <Badge variant="outline" className="text-xs">
                    SLA: {config.hours}h
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{getEventDescription(config.businessEventId)}</p>
              </div>

              {/* SLA Settings */}
              <div className="flex flex-col sm:flex-row gap-4 lg:w-96">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`hours-${config.businessEventId}`} className="text-xs">
                    SLA Hours
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`hours-${config.businessEventId}`}
                      type="number"
                      min="1"
                      max="720"
                      value={config.hours}
                      onChange={(e) =>
                        handleUpdateSLA(config.businessEventId, 'hours', parseInt(e.target.value) || 0)
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor={`threshold-${config.businessEventId}`} className="text-xs">
                    At-Risk Threshold
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`threshold-${config.businessEventId}`}
                      type="number"
                      min="1"
                      max="99"
                      value={config.atRiskThreshold}
                      onChange={(e) =>
                        handleUpdateSLA(
                          config.businessEventId,
                          'atRiskThreshold',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Timeline */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2">Example Timeline</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${100 - config.atRiskThreshold}%` }}
                  />
                  <div className="h-full bg-warning" style={{ width: `${config.atRiskThreshold}%` }} />
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {config.hours}h deadline
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-success">On Track (0-{100 - config.atRiskThreshold}%)</span>
                <span className="text-xs text-warning">
                  At Risk ({100 - config.atRiskThreshold}-100%)
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
