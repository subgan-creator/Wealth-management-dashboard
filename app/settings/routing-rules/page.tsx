'use client';

import { useState } from 'react';
import { Plus, Trash2, GitBranch, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockBusinessEvents, mockTeams } from '@/lib/mock-data';

interface RoutingRule {
  id: string;
  businessEventId: string;
  subEventId?: string;
  priority?: string;
  teamId: string;
}

export default function RoutingRulesConfig() {
  const [rules, setRules] = useState<RoutingRule[]>([
    {
      id: 'rule-1',
      businessEventId: 'be-1',
      teamId: 'team-1',
    },
    {
      id: 'rule-2',
      businessEventId: 'be-2',
      teamId: 'team-2',
    },
    {
      id: 'rule-3',
      businessEventId: 'be-3',
      teamId: 'team-3',
    },
  ]);

  const handleAddRule = () => {
    const newRule: RoutingRule = {
      id: `rule-${Date.now()}`,
      businessEventId: mockBusinessEvents[0]?.id || '',
      teamId: mockTeams[0]?.id || '',
    };
    setRules([...rules, newRule]);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
  };

  const handleUpdateRule = (ruleId: string, field: keyof RoutingRule, value: string | undefined) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              [field]: value,
              // Clear subEventId if business event changes
              ...(field === 'businessEventId' ? { subEventId: undefined } : {}),
            }
          : rule
      )
    );
  };

  const getEventName = (eventId: string) => {
    return mockBusinessEvents.find((e) => e.id === eventId)?.name || eventId;
  };

  const getSubEventName = (eventId: string, subEventId?: string) => {
    if (!subEventId) return undefined;
    const event = mockBusinessEvents.find((e) => e.id === eventId);
    return event?.subEvents.find((se) => se.id === subEventId)?.name;
  };

  const getTeamName = (teamId: string) => {
    return mockTeams.find((t) => t.id === teamId)?.name || teamId;
  };

  const getSubEvents = (eventId: string) => {
    return mockBusinessEvents.find((e) => e.id === eventId)?.subEvents || [];
  };

  const handleSaveChanges = () => {
    console.log('[v0] Saving routing rules:', rules);
    alert('Routing rules saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Routing Rules Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure how requests are automatically routed to teams based on business events and conditions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-accent/50 border-accent">
        <div className="flex gap-3">
          <GitBranch className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-sm text-accent-foreground">How Routing Works</div>
            <div className="text-sm text-accent-foreground/80 mt-1">
              When a request is created, the system checks these rules from top to bottom. The first matching
              rule determines which team receives the request. More specific rules (with sub-events or
              priorities) should be placed higher.
            </div>
          </div>
        </div>
      </Card>

      {/* Routing Rules */}
      <div className="space-y-3">
        {rules.map((rule, index) => {
          const subEvents = getSubEvents(rule.businessEventId);

          return (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start gap-4">
                {/* Rule Number */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>

                {/* Rule Configuration */}
                <div className="flex-1 grid gap-4 lg:grid-cols-4">
                  {/* Business Event */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Business Event</Label>
                    <Select
                      value={rule.businessEventId}
                      onValueChange={(value) => handleUpdateRule(rule.id, 'businessEventId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBusinessEvents.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub-Event (Optional) */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Sub-Event (Optional)</Label>
                    <Select
                      value={rule.subEventId || 'any'}
                      onValueChange={(value) =>
                        handleUpdateRule(rule.id, 'subEventId', value === 'any' ? undefined : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Sub-Event</SelectItem>
                        {subEvents.map((subEvent) => (
                          <SelectItem key={subEvent.id} value={subEvent.id}>
                            {subEvent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority (Optional) */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Priority (Optional)</Label>
                    <Select
                      value={rule.priority || 'any'}
                      onValueChange={(value) =>
                        handleUpdateRule(rule.id, 'priority', value === 'any' ? undefined : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Route To Team */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Route To Team</Label>
                    <Select
                      value={rule.teamId}
                      onValueChange={(value) => handleUpdateRule(rule.id, 'teamId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                    disabled={rules.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rule Summary */}
              <div className="mt-4 flex items-center gap-2 text-sm pl-12">
                <span className="text-muted-foreground">IF request is</span>
                <Badge variant="secondary">{getEventName(rule.businessEventId)}</Badge>
                {rule.subEventId && (
                  <>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="secondary">{getSubEventName(rule.businessEventId, rule.subEventId)}</Badge>
                  </>
                )}
                {rule.priority && (
                  <>
                    <span className="text-muted-foreground">with priority</span>
                    <Badge variant="secondary">{rule.priority}</Badge>
                  </>
                )}
                <span className="text-muted-foreground">THEN route to</span>
                <Badge className="bg-primary">{getTeamName(rule.teamId)}</Badge>
              </div>
            </Card>
          );
        })}

        {/* Add Rule Button */}
        <Button variant="outline" onClick={handleAddRule} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Routing Rule
        </Button>
      </div>

      {/* No Rules State */}
      {rules.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No routing rules configured yet.</p>
          <Button onClick={handleAddRule} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Routing Rule
          </Button>
        </Card>
      )}
    </div>
  );
}
